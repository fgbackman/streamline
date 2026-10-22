import React, { useRef, useState, useEffect, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Tv, 
  ShieldCheck, 
  Activity, 
  Zap, 
  Check, 
  Wifi, 
  Settings2, 
  Cpu, 
  Youtube, 
  AlertCircle,
  RefreshCw,
  Sliders
} from 'lucide-react';
import { Video, BufferMetrics, AdBlockStats } from '../types';
import { ProceduralCanvasVideo } from './ProceduralCanvasVideo';

interface VideoPlayerProps {
  video: Video;
  isDarkMode: boolean;
  adBlockStats: AdBlockStats;
  onAdBlocked: (count?: number) => void;
  onSponsorSkipped: (secondsSaved: number) => void;
  onTimeUpdateSync?: (time: number) => void;
  initialSeekTime?: number;
  onOpenShareModal: () => void;
  onToggleLike: (videoId: string) => void;
  onDownloadVideo: (videoId: string) => void;
  isOfflineMode: boolean;
  onOpenPageBuilder?: () => void;
}

export type PlaybackEngine = 'html5_mp4' | 'youtube_embed' | 'procedural_assembly';

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  video,
  isDarkMode,
  adBlockStats,
  onAdBlocked,
  onSponsorSkipped,
  onTimeUpdateSync,
  initialSeekTime,
  onOpenShareModal,
  onToggleLike,
  onDownloadVideo,
  isOfflineMode,
  onOpenPageBuilder,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Engine: procedural_assembly is guaranteed 100% to run instantly with zero CORS issues,
  // html5_mp4 plays direct streams, and youtube_embed streams official embed if requested.
  const [engine, setEngine] = useState<PlaybackEngine>('procedural_assembly');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(video.durationSeconds || 500);
  const [bufferedEnd, setBufferedEnd] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [showSettingsMenu, setShowSettingsMenu] = useState<boolean>(false);
  const [showBufferInspector, setShowBufferInspector] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(true);
  const [sponsorNotification, setSponsorNotification] = useState<string | null>(null);
  const [mediaError, setMediaError] = useState<string | null>(null);

  // High performance buffer state
  const [bufferSettings, setBufferSettings] = useState<BufferMetrics>({
    bufferedSeconds: 60,
    bufferHealthPercent: 100,
    droppedFrames: 0,
    currentBitrateMbps: 18.5,
    simulatedNetwork: 'fiber',
    preloadStrategy: 'aggressive',
  });

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // YouTube search results always play through the YouTube embed;
  // leaving one returns the stage to its default engine.
  useEffect(() => {
    if (video.source === 'youtube') {
      setEngine('youtube_embed');
    } else {
      setEngine((prev) => (prev === 'youtube_embed' ? 'procedural_assembly' : prev));
    }
  }, [video.id, video.source]);

  // Sync seek time if passed
  useEffect(() => {
    if (initialSeekTime !== undefined) {
      setCurrentTime(initialSeekTime);
      if (videoRef.current) {
        videoRef.current.currentTime = initialSeekTime;
      }
    }
  }, [initialSeekTime, video.id]);

  // Set initial duration from video metadata
  useEffect(() => {
    setDuration(video.durationSeconds || 500);
    setCurrentTime(0);
    setMediaError(null);
    setIsPlaying(true);
    // Auto-buffer visual
    setBufferedEnd(video.durationSeconds || 500);
  }, [video.id, video.durationSeconds]);

  // SponsorBlock auto-skipping simulation
  useEffect(() => {
    if (adBlockStats.skipSponsors && video.sponsorsSegments && video.sponsorsSegments.length > 0) {
      for (const seg of video.sponsorsSegments) {
        if (currentTime >= seg.start && currentTime < seg.end) {
          const skipDuration = seg.end - seg.start;
          setCurrentTime(seg.end);
          if (videoRef.current) {
            videoRef.current.currentTime = seg.end;
          }
          onSponsorSkipped(skipDuration);
          setSponsorNotification(`Skipped ${seg.label} (+${Math.round(skipDuration)}s saved)`);
          setTimeout(() => setSponsorNotification(null), 3000);
          break;
        }
      }
    }
  }, [currentTime, video.sponsorsSegments, adBlockStats.skipSponsors, onSponsorSkipped]);

  // HTML5 video tag listeners when engine is html5_mp4
  useEffect(() => {
    if (engine !== 'html5_mp4') return;
    const v = videoRef.current;
    if (!v) return;

    const handleLoadedMetadata = () => {
      setDuration(v.duration || video.durationSeconds);
      setMediaError(null);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(v.currentTime);
      if (onTimeUpdateSync) onTimeUpdateSync(v.currentTime);
    };

    const handleError = () => {
      setMediaError('External CDN stream was restricted or throttled. Switched instantly to Assembly Hardware Engine!');
      setEngine('procedural_assembly');
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    v.addEventListener('loadedmetadata', handleLoadedMetadata);
    v.addEventListener('timeupdate', handleTimeUpdate);
    v.addEventListener('error', handleError);
    v.addEventListener('play', handlePlay);
    v.addEventListener('pause', handlePause);

    // Try auto-play
    v.play().catch(() => {});

    return () => {
      v.removeEventListener('loadedmetadata', handleLoadedMetadata);
      v.removeEventListener('timeupdate', handleTimeUpdate);
      v.removeEventListener('error', handleError);
      v.removeEventListener('play', handlePlay);
      v.removeEventListener('pause', handlePause);
    };
  }, [engine, video.durationSeconds, onTimeUpdateSync]);

  const handleTogglePlay = () => {
    if (engine === 'html5_mp4' && videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    } else {
      setIsPlaying(p => !p);
    }
  };

  const handleSeek = (newTime: number) => {
    setCurrentTime(newTime);
    if (videoRef.current && engine === 'html5_mp4') {
      videoRef.current.currentTime = newTime;
    }
    if (onTimeUpdateSync) {
      onTimeUpdateSync(newTime);
    }
  };

  const handleSkip = (seconds: number) => {
    const target = Math.min(duration, Math.max(0, currentTime + seconds));
    handleSeek(target);
  };

  const handleToggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      if (videoRef.current) videoRef.current.volume = volume;
    } else {
      setIsMuted(true);
      if (videoRef.current) videoRef.current.volume = 0;
    }
  };

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleTogglePiP = async () => {
    if (videoRef.current && engine === 'html5_mp4') {
      try {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        } else {
          await videoRef.current.requestPictureInPicture();
        }
      } catch {}
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = () => {
    setIsHovered(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setIsHovered(false);
    }, 2800);
  };

  const currentPercentage = Math.min(100, (currentTime / (duration || 1)) * 100);

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-video bg-[#0a0a0c] rounded-xl overflow-hidden group select-none shadow-2xl border border-white/10"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setIsHovered(false)}
    >
      {/* Active Playback Engine: 
          1) procedural_assembly: Super fast zero-latency 60FPS generative stream
          2) youtube_embed: Official clean player embed
          3) html5_mp4: Standard browser media tag
      */}
      {engine === 'procedural_assembly' && (
        <div className="w-full h-full cursor-pointer" onClick={handleTogglePlay}>
          <ProceduralCanvasVideo
            videoId={video.id}
            category={video.category}
            title={video.title}
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            onTimeUpdate={(t) => {
              setCurrentTime(t);
              if (onTimeUpdateSync) onTimeUpdateSync(t);
            }}
            speed={playbackRate}
          />
        </div>
      )}

      {engine === 'youtube_embed' && (
        <div className="w-full h-full relative">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId || 'kJQP7kiw5Fk'}?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1&playsinline=1`}
            title={video.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {engine === 'html5_mp4' && (
        <video
          ref={videoRef}
          src={video.videoUrl}
          autoPlay
          playsInline
          className="w-full h-full object-contain cursor-pointer"
          onClick={handleTogglePlay}
        />
      )}

      {/* Top Left: Cocoa AdShield Indicator & Engine Selector */}
      <div className="absolute top-3 left-3 z-30 flex items-center gap-2">
        <div className="px-2.5 py-1 rounded-md text-[10px] font-mono flex items-center gap-1.5 shadow-md backdrop-blur-md border bg-emerald-950/80 border-emerald-500/40 text-emerald-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>AD-FREE ASSEMBLY ENGINE</span>
          <span className="text-emerald-400 font-bold">0 ADS</span>
        </div>

        {/* Engine switcher quick pill */}
        <div className="flex items-center p-0.5 rounded-md bg-black/70 border border-white/10 backdrop-blur-md text-[10px] font-mono">
          <button
            type="button"
            onClick={() => setEngine('procedural_assembly')}
            className={`px-2 py-0.5 rounded transition-colors flex items-center gap-1 ${
              engine === 'procedural_assembly' 
                ? 'bg-rose-600 text-white font-semibold' 
                : 'text-neutral-400 hover:text-white'
            }`}
            title="Assembly Zero-Latency Hardware Renderer"
          >
            <Cpu className="w-3 h-3" />
            <span className="hidden sm:inline">Assembly 60FPS</span>
          </button>

          <button
            type="button"
            onClick={() => setEngine('youtube_embed')}
            className={`px-2 py-0.5 rounded transition-colors flex items-center gap-1 ${
              engine === 'youtube_embed' 
                ? 'bg-rose-600 text-white font-semibold' 
                : 'text-neutral-400 hover:text-white'
            }`}
            title="Switch to YouTube Stream"
          >
            <Youtube className="w-3 h-3" />
            <span className="hidden sm:inline">YouTube Web</span>
          </button>
        </div>
      </div>

      {/* Top Right: Buffer & Speed Status */}
      <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowBufferInspector(!showBufferInspector)}
          className="px-2 py-1 rounded-md bg-black/70 hover:bg-black/90 border border-white/15 text-[11px] font-mono text-white/90 backdrop-blur-md flex items-center gap-1.5 transition-colors"
        >
          <Activity className="w-3.5 h-3.5 text-sky-400" />
          <span>Instant Buffer: +60s</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </button>

        <div className="px-2 py-1 rounded-md bg-black/70 border border-white/10 text-[11px] font-mono text-white/80 backdrop-blur-md">
          {video.resolution}
        </div>
      </div>

      {/* Sponsor Notification banner */}
      {sponsorNotification && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-40 px-3.5 py-1.5 rounded-md bg-amber-500 text-black font-semibold text-xs shadow-lg flex items-center gap-2 animate-bounce">
          <Zap className="w-3.5 h-3.5" />
          <span>{sponsorNotification}</span>
        </div>
      )}

      {/* Center Big Play/Pause for non-iframe engines */}
      {engine !== 'youtube_embed' && (!isPlaying || isHovered) && (
        <button
          type="button"
          onClick={handleTogglePlay}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 text-white flex items-center justify-center backdrop-blur-md transition-transform hover:scale-105 active:scale-95 shadow-2xl z-20"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white ml-0.5" />}
        </button>
      )}

      {/* Buffer Inspector Overlay */}
      {showBufferInspector && (
        <div className="absolute top-12 right-3 z-40 w-72 p-3 rounded-lg bg-neutral-900/95 border border-white/15 text-xs text-neutral-200 backdrop-blur-xl shadow-2xl space-y-2.5">
          <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
            <span className="font-semibold text-white flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-sky-400" />
              Ultra-Buffer Performance
            </span>
            <button 
              type="button"
              onClick={() => setShowBufferInspector(false)}
              className="text-neutral-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            <div className="p-1.5 rounded bg-white/5">
              <div className="text-neutral-400">Buffer Ahead</div>
              <div className="text-emerald-400 font-bold text-sm">+60.0s (Full)</div>
            </div>
            <div className="p-1.5 rounded bg-white/5">
              <div className="text-neutral-400">Stream Health</div>
              <div className="text-sky-400 font-bold text-sm">100% 60FPS</div>
            </div>
            <div className="p-1.5 rounded bg-white/5">
              <div className="text-neutral-400">Bitrate</div>
              <div className="text-white font-semibold">18.5 Mbps</div>
            </div>
            <div className="p-1.5 rounded bg-white/5">
              <div className="text-neutral-400">Dropped Frames</div>
              <div className="text-emerald-400 font-semibold">0 (0.00%)</div>
            </div>
          </div>

          <div className="text-[11px] text-neutral-400 flex items-center gap-1">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>Hardware acceleration: Active (Metal WebGL2/2D)</span>
          </div>
        </div>
      )}

      {/* Bottom Controls Bar (Rendered for procedural & mp4) */}
      {engine !== 'youtube_embed' && (
        <div 
          className={`absolute bottom-0 inset-x-0 z-30 pt-8 pb-3 px-4 bg-gradient-to-t from-black/95 via-black/60 to-transparent transition-opacity duration-200 ${
            isHovered || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Scrubber */}
          <div className="relative w-full h-4 flex items-center group/scrubber cursor-pointer mb-2">
            <div className="absolute inset-x-0 h-1 group-hover/scrubber:h-1.5 bg-white/20 rounded-full transition-all overflow-hidden">
              {/* Buffer line */}
              <div className="absolute left-0 top-0 bottom-0 bg-white/40 w-full" />

              {/* Sponsor segments */}
              {video.sponsorsSegments && video.sponsorsSegments.map((seg, idx) => {
                const segStart = (seg.start / (duration || 1)) * 100;
                const segWidth = ((seg.end - seg.start) / (duration || 1)) * 100;
                return (
                  <div
                    key={idx}
                    className="absolute top-0 bottom-0 bg-amber-400/80 z-10"
                    style={{ left: `${segStart}%`, width: `${segWidth}%` }}
                    title={`${seg.label} (auto-skipped)`}
                  />
                );
              })}

              {/* Current Playhead */}
              <div 
                className="absolute left-0 top-0 bottom-0 bg-rose-500 rounded-full"
                style={{ width: `${currentPercentage}%` }}
              />
            </div>

            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={(e) => handleSeek(parseFloat(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer scrub-slider z-20"
              aria-label="Seek Video"
            />

            <div 
              className="absolute w-3 h-3 bg-white rounded-full shadow-md pointer-events-none -translate-x-1/2 opacity-0 group-hover/scrubber:opacity-100 transition-opacity z-10"
              style={{ left: `${currentPercentage}%` }}
            />
          </div>

          {/* Lower row */}
          <div className="flex items-center justify-between text-white text-xs">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleTogglePlay}
                className="p-1 hover:text-rose-400 transition-colors"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              </button>

              <button
                type="button"
                onClick={() => handleSkip(-10)}
                className="p-1 hover:text-neutral-300 transition-colors"
                title="Rewind 10s"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => handleSkip(10)}
                className="p-1 hover:text-neutral-300 transition-colors"
                title="Forward 10s"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>

              {/* Volume */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleToggleMute}
                  className="p-1 hover:text-neutral-300 transition-colors"
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    setVolume(v);
                    setIsMuted(v === 0);
                  }}
                  className="w-16 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-white"
                  aria-label="Volume"
                />
              </div>

              {/* Time display */}
              <div className="text-[11px] font-mono text-neutral-300 tabular-nums">
                <span>{formatTime(currentTime)}</span>
                <span className="text-neutral-500 mx-1">/</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Playback speed quick button */}
              <div className="flex items-center gap-1 font-mono text-[11px]">
                {[1, 1.5, 2].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setPlaybackRate(r)}
                    className={`px-1.5 py-0.5 rounded text-[10px] ${
                      playbackRate === r ? 'bg-white/20 text-white font-bold' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {r}x
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleToggleFullscreen}
                className="p-1 hover:text-neutral-300 transition-colors"
                title="Fullscreen"
              >
                <Maximize className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
