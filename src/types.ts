export interface Video {
  id: string;
  title: string;
  channel: string;
  channelAvatar: string;
  subscribers: string;
  views: string;
  viewCount: number;
  publishedDate: string;
  duration: string;
  durationSeconds: number;
  description: string;
  category: 'Tech' | 'Design' | 'Space' | 'Ambient' | 'Engineering' | 'Science';
  tags: string[];
  videoUrl: string;
  youtubeId?: string; // Optional YouTube ID or custom stream ID
  source?: 'youtube'; // Set for live YouTube search results
  thumbnailUrl?: string; // Real thumbnail image (YouTube results)
  thumbnailGradient: string;
  previewSvgIcon: string;
  resolution: string;
  fps: number;
  isLiked: boolean;
  likeCount: number;
  isOffline: boolean;
  offlineSizeMb?: number;
  downloadProgress?: number; // 0-100
  downloadDate?: string;
  sponsorsSegments?: { start: number; end: number; label: string }[];
}

export type PageSectionId = 
  | 'searchAndFilters' 
  | 'playerStage' 
  | 'videoInfo' 
  | 'upNextQueue' 
  | 'frontPageFeed' 
  | 'perfTelemetry' 
  | 'statusFooter';

export interface PageSectionConfig {
  id: PageSectionId;
  label: string;
  description: string;
  visible: boolean;
  order: number;
  category: 'core' | 'stage' | 'feed' | 'telemetry';
}

export interface CustomVideoInput {
  title: string;
  channel: string;
  category: 'Tech' | 'Design' | 'Space' | 'Ambient' | 'Engineering' | 'Science';
  videoUrl: string;
  description?: string;
}

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  timeAgo: string;
  text: string;
  likes: number;
  isLiked?: boolean;
}

export interface SyncDevice {
  id: string;
  name: string;
  type: 'mac' | 'iphone' | 'ipad' | 'tv' | 'vision_pro';
  lastActive: string;
  currentVideoId?: string;
  currentTimestamp?: number;
  isCurrentDevice: boolean;
  batteryPercent: number;
  status: 'online' | 'idle' | 'syncing';
}

export interface BufferMetrics {
  bufferedSeconds: number;
  bufferHealthPercent: number;
  droppedFrames: number;
  currentBitrateMbps: number;
  simulatedNetwork: 'fiber' | '4g' | '3g' | 'slow_throttle';
  preloadStrategy: 'aggressive' | 'balanced' | 'saver';
}

export interface AdBlockStats {
  isEnabled: boolean;
  skipSponsors: boolean;
  adsBlockedCount: number;
  sponsorsSkippedCount: number;
  trackersBlockedCount: number;
  timeSavedSeconds: number;
}

export interface NotificationItem {
  id: string;
  videoId: string;
  channel: string;
  title: string;
  timeAgo: string;
  thumbnailGradient: string;
  isRead: boolean;
}

export interface NotificationSettings {
  channelAlerts: 'all' | 'personalized' | 'none';
  categories: {
    tech: boolean;
    design: boolean;
    space: boolean;
    ambient: boolean;
    engineering: boolean;
    science: boolean;
  };
  soundAlerts: boolean;
  desktopPush: boolean;
  quietHours: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}
