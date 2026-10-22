import React from 'react';
import { 
  Play, 
  DownloadCloud, 
  Check, 
  Share2, 
  Monitor, 
  Clock, 
  Building2, 
  Cpu, 
  Orbit, 
  Waves, 
  Disc, 
  Atom, 
  Type, 
  CloudRain,
  ShieldCheck
} from 'lucide-react';
import { Video } from '../types';

interface FrontPageGridProps {
  videos: Video[];
  activeVideoId: string;
  onSelectVideo: (video: Video) => void;
  onDownloadVideo: (videoId: string) => void;
  onOpenShareModal: (video: Video) => void;
  onOpenDeviceSync: () => void;
  isDarkMode: boolean;
  title?: string;
}

export const FrontPageGrid: React.FC<FrontPageGridProps> = ({
  videos,
  activeVideoId,
  onSelectVideo,
  onDownloadVideo,
  onOpenShareModal,
  onOpenDeviceSync,
  isDarkMode,
  title = 'Front Page Feed'
}) => {
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'building': return <Building2 className="w-8 h-8 text-neutral-400 stroke-1" />;
      case 'cpu': return <Cpu className="w-8 h-8 text-amber-400 stroke-1" />;
      case 'orbit': return <Orbit className="w-8 h-8 text-indigo-400 stroke-1" />;
      case 'waves': return <Waves className="w-8 h-8 text-rose-400 stroke-1" />;
      case 'disc': return <Disc className="w-8 h-8 text-emerald-400 stroke-1" />;
      case 'atom': return <Atom className="w-8 h-8 text-cyan-400 stroke-1" />;
      case 'type': return <Type className="w-8 h-8 text-stone-300 stroke-1" />;
      case 'cloud-rain': return <CloudRain className="w-8 h-8 text-teal-400 stroke-1" />;
      default: return <Play className="w-8 h-8 text-neutral-400 stroke-1" />;
    }
  };

  if (videos.length === 0) {
    return (
      <div className={`p-8 rounded-xl border text-center space-y-2 ${
        isDarkMode ? 'bg-white/[0.02] border-white/10 text-neutral-400' : 'bg-black/[0.02] border-black/10 text-neutral-500'
      }`}>
        <div className="text-sm font-semibold">No videos found</div>
        <p className="text-xs">Try clearing the search query or selecting a different category filter.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className={`text-xs font-semibold uppercase tracking-wider ${
          isDarkMode ? 'text-neutral-400' : 'text-neutral-600'
        }`}>
          {title}
        </h2>
        <span className="text-[11px] font-mono text-neutral-500">
          Assembly Stream Catalog · {videos.length} videos
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {videos.map((vid) => {
          const isActive = vid.id === activeVideoId;

          return (
            <div
              key={vid.id}
              className={`group flex flex-col rounded-lg overflow-hidden transition-all duration-200 border cursor-pointer ${
                isActive
                  ? isDarkMode
                    ? 'bg-neutral-800/80 border-rose-500/60 ring-1 ring-rose-500/40 shadow-lg'
                    : 'bg-white border-rose-500/60 ring-1 ring-rose-500/40 shadow-lg'
                  : isDarkMode
                    ? 'bg-[#18191e]/60 hover:bg-[#1f2026] border-white/[0.07] hover:border-white/15'
                    : 'bg-white hover:bg-neutral-50 border-black/[0.07] hover:border-black/15 shadow-sm'
              }`}
              onClick={() => onSelectVideo(vid)}
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video w-full bg-neutral-900 overflow-hidden">
                {vid.thumbnailUrl ? (
                  <img
                    src={vid.thumbnailUrl}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                /* Styled Procedural Graphic Fallback Frame */
                <div className={`absolute inset-0 bg-gradient-to-br ${vid.thumbnailGradient} flex items-center justify-center transition-transform duration-300 group-hover:scale-105`}>
                  <div className="opacity-40 group-hover:opacity-60 transition-opacity">
                    {renderIcon(vid.previewSvgIcon)}
                  </div>
                  {/* Subtle technical grid overlay */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:12px_12px] opacity-40 pointer-events-none" />
                </div>
                )}

                {/* Duration Badge */}
                {vid.duration && <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-white text-[10px] font-mono font-medium backdrop-blur-sm">
                  {vid.duration}
                </div>}

                {/* Top Status Indicators (Offline ready, Active Now, Resolution) */}
                <div className="absolute top-2 left-2 flex items-center gap-1.5">
                  {vid.isOffline && (
                    <div 
                      className="px-1.5 py-0.5 rounded bg-amber-950/85 border border-amber-500/40 text-amber-300 text-[10px] font-mono flex items-center gap-1 backdrop-blur-md"
                      title="Available Offline in Local Cache"
                    >
                      <DownloadCloud className="w-2.5 h-2.5" />
                      <span>Cached</span>
                    </div>
                  )}

                  {isActive && (
                    <div className="px-1.5 py-0.5 rounded bg-rose-600 text-white text-[10px] font-mono font-bold flex items-center gap-1 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                      <span>Playing</span>
                    </div>
                  )}
                </div>

                {/* Hover Action Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectVideo(vid);
                    }}
                    className="w-10 h-10 rounded-full bg-white text-neutral-900 flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform"
                    title="Play on Stage"
                  >
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDownloadVideo(vid.id);
                    }}
                    className="w-8 h-8 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center border border-white/20 transition-transform hover:scale-105"
                    title={vid.isOffline ? 'Already downloaded' : 'Save for offline watching'}
                  >
                    {vid.isOffline ? <Check className="w-4 h-4 text-emerald-400" /> : <DownloadCloud className="w-4 h-4" />}
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenShareModal(vid);
                    }}
                    className="w-8 h-8 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center border border-white/20 transition-transform hover:scale-105"
                    title="Share link"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Card Information */}
              <div className="p-3 flex gap-2.5 flex-1 justify-between flex-col">
                <div className="space-y-1.5">
                  <h3 className={`text-xs font-semibold line-clamp-2 leading-snug group-hover:text-rose-400 transition-colors ${
                    isDarkMode ? 'text-neutral-100' : 'text-neutral-900'
                  }`}>
                    {vid.title}
                  </h3>

                  <div className="text-[11px] text-neutral-400 flex items-center gap-1.5">
                    <span className="font-medium text-neutral-300">{vid.channel}</span>
                  </div>
                </div>

                {/* Zero-Pill Unboxed Metadata per Design Constitution */}
                <div className="pt-2 border-t border-white/[0.06] flex items-center gap-1.5 text-[11px] text-neutral-500 font-mono">
                  <span>{vid.views}</span>
                  <span aria-hidden="true">·</span>
                  <span>{vid.publishedDate}</span>
                  <span aria-hidden="true">·</span>
                  <span>{vid.resolution.split(' ')[0]}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
