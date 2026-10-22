import type { Video } from '../types';

const API = 'https://www.googleapis.com/youtube/v3';
const KEY = (import.meta.env.VITE_YOUTUBE_API_KEY as string | undefined)?.trim() || '';

export const hasYouTubeKey = KEY.length > 0;

export type YouTubeErrorKind = 'no_key' | 'quota' | 'key' | 'network' | 'other';

export class YouTubeSearchError extends Error {
  kind: YouTubeErrorKind;
  constructor(message: string, kind: YouTubeErrorKind) {
    super(message);
    this.kind = kind;
  }
}

const cache = new Map<string, Video[]>();

function decodeEntities(s: string): string {
  const el = document.createElement('textarea');
  el.innerHTML = s;
  return el.value;
}

function parseIsoDuration(iso: string): number {
  const m = iso.match(/^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/);
  if (!m) return 0;
  const [d, h, min, s] = [m[1], m[2], m[3], m[4]].map((x) => Number(x) || 0);
  return d * 86400 + h * 3600 + min * 60 + s;
}

function formatDuration(sec: number, live: boolean): string {
  if (live) return 'LIVE';
  if (!sec) return '';
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = String(sec % 60).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${s}` : `${m}:${s}`;
}

const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });

function timeAgo(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  const units: [number, string][] = [
    [31536000, 'year'], [2592000, 'month'], [604800, 'week'],
    [86400, 'day'], [3600, 'hour'], [60, 'minute'],
  ];
  for (const [secs, name] of units) {
    const v = Math.floor(diff / secs);
    if (v >= 1) return `${v} ${name}${v > 1 ? 's' : ''} ago`;
  }
  return 'Just now';
}

async function apiGet(path: string, params: Record<string, string>, signal?: AbortSignal): Promise<any> {
  const url = new URL(`${API}/${path}`);
  for (const [k, v] of Object.entries({ ...params, key: KEY })) url.searchParams.set(k, v);

  let res: Response;
  try {
    res = await fetch(url, { signal });
  } catch (e) {
    if ((e as Error).name === 'AbortError') throw e;
    throw new YouTubeSearchError("Couldn't reach YouTube. Check your connection and try again.", 'network');
  }

  if (!res.ok) {
    let reason = '';
    let message = '';
    try {
      const body = await res.json();
      reason = body?.error?.errors?.[0]?.reason ?? '';
      message = body?.error?.message ?? '';
    } catch { /* ignore */ }
    if (reason === 'quotaExceeded' || reason === 'dailyLimitExceeded' || reason === 'rateLimitExceeded') {
      throw new YouTubeSearchError('Daily YouTube search limit reached. It resets at midnight Pacific time.', 'quota');
    }
    if (res.status === 400 || res.status === 403) {
      throw new YouTubeSearchError(`YouTube rejected the API key${message ? `: ${message}` : '.'}`, 'key');
    }
    throw new YouTubeSearchError(`YouTube search failed (error ${res.status}).`, 'other');
  }
  return res.json();
}

function toVideo(item: any, detail: any): Video {
  const sn = item.snippet ?? {};
  const id: string = item.id.videoId;
  const live = sn.liveBroadcastContent === 'live';
  const secs = detail?.contentDetails?.duration ? parseIsoDuration(detail.contentDetails.duration) : 0;
  const views = Number(detail?.statistics?.viewCount ?? 0);
  const likes = Number(detail?.statistics?.likeCount ?? 0);
  const channel = decodeEntities(sn.channelTitle ?? 'YouTube');
  const thumbs = sn.thumbnails ?? {};

  return {
    id: `yt-${id}`,
    source: 'youtube',
    title: decodeEntities(sn.title ?? 'Untitled'),
    channel,
    channelAvatar: channel.replace(/[^\p{L}\p{N}]/gu, '').slice(0, 2).toUpperCase() || 'YT',
    subscribers: '',
    views: views ? `${compact.format(views)} views` : live ? 'Live now' : '',
    viewCount: views,
    publishedDate: sn.publishedAt ? timeAgo(sn.publishedAt) : '',
    duration: formatDuration(secs, live),
    durationSeconds: secs,
    description: decodeEntities(sn.description ?? ''),
    category: 'Tech',
    tags: [],
    videoUrl: `https://www.youtube.com/watch?v=${id}`,
    youtubeId: id,
    thumbnailUrl: thumbs.high?.url ?? thumbs.medium?.url ?? thumbs.default?.url ?? `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    thumbnailGradient: 'from-neutral-900 via-neutral-900 to-black',
    previewSvgIcon: 'play',
    resolution: 'YouTube',
    fps: 30,
    isLiked: false,
    likeCount: likes,
    isOffline: false,
    sponsorsSegments: [],
  };
}

/** Search YouTube. Costs ~101 quota units per new query (search + video details). */
export async function searchYouTube(query: string, signal?: AbortSignal): Promise<Video[]> {
  const q = query.trim();
  if (!hasYouTubeKey) {
    throw new YouTubeSearchError(
      'YouTube search needs a free API key. Add VITE_YOUTUBE_API_KEY in Netlify (or .env.local) and rebuild.',
      'no_key',
    );
  }
  const cacheKey = q.toLowerCase();
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const search = await apiGet('search', {
    part: 'snippet',
    type: 'video',
    videoEmbeddable: 'true',
    safeSearch: 'moderate',
    maxResults: '24',
    q,
  }, signal);

  const items: any[] = (search.items ?? []).filter((it: any) => it?.id?.videoId);
  if (items.length === 0) {
    cache.set(cacheKey, []);
    return [];
  }

  const details: Record<string, any> = {};
  try {
    const d = await apiGet('videos', {
      part: 'contentDetails,statistics',
      id: items.map((it) => it.id.videoId).join(','),
    }, signal);
    for (const v of d.items ?? []) details[v.id] = v;
  } catch (e) {
    if ((e as Error).name === 'AbortError') throw e;
    // Details are optional; show results without duration/views.
  }

  const results = items.map((it) => toVideo(it, details[it.id.videoId]));
  cache.set(cacheKey, results);
  return results;
}
