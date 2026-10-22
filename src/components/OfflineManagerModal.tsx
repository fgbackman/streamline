import React, { useState } from 'react';
import { 
  X, 
  DownloadCloud, 
  Trash2, 
  HardDrive, 
  Check, 
  WifiOff, 
  Play, 
  Settings,
  Sparkles,
  ArrowDownCircle
} from 'lucide-react';
import { Video } from '../types';

interface OfflineManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videos: Video[];
  isOfflineMode: boolean;
  onToggleOfflineMode: () => void;
  onSelectVideo: (video: Video) => void;
  onRemoveDownload: (videoId: string) => void;
  onClearAllDownloads: () => void;
  isDarkMode: boolean;
}

export const OfflineManagerModal: React.FC<OfflineManagerModalProps> = ({
  isOpen,
  onClose,
  videos,
  isOfflineMode,
  onToggleOfflineMode,
  onSelectVideo,
  onRemoveDownload,
  onClearAllDownloads,
  isDarkMode,
}) => {
  const [downloadQuality, setDownloadQuality] = useState<'1080p' | '720p' | 'audio'>('1080p');

  if (!isOpen) return null;

  const downloadedVideos = videos.filter(v => v.isOffline);
  const totalCachedMb = downloadedVideos.reduce((acc, v) => acc + (v.offlineSizeMb || 0), 0);
  const allocatedGb = 32;
  const usedGb = (totalCachedMb / 1024).toFixed(2);
  const percentUsed = Math.min(100, Math.round((totalCachedMb / (allocatedGb * 1024)) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className={`w-full max-w-lg rounded-xl border shadow-2xl overflow-hidden transition-all ${
          isDarkMode 
            ? 'bg-[#18191e] border-white/15 text-neutral-100' 
            : 'bg-white border-black/15 text-neutral-900'
        }`}
      >
        {/* Cocoa Header */}
        <div className="px-5 py-3.5 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <DownloadCloud className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-semibold">Offline Downloads & Cache</h3>
              <p className="text-[11px] text-neutral-400 font-mono">Assembly Local Storage Engine</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Offline Mode Switch */}
          <div className={`p-3.5 rounded-lg border flex items-center justify-between ${
            isOfflineMode
              ? isDarkMode ? 'bg-amber-950/30 border-amber-500/50' : 'bg-amber-50 border-amber-300'
              : isDarkMode ? 'bg-white/[0.02] border-white/10' : 'bg-neutral-50 border-black/10'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isOfflineMode ? 'bg-amber-500 text-black' : 'bg-neutral-800 text-neutral-400'}`}>
                <WifiOff className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold">Offline Watching Mode</div>
                <div className="text-[11px] text-neutral-400">
                  {isOfflineMode ? 'Active: Only cached videos available (0 network traffic)' : 'Stream normally using online CDN and buffer'}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onToggleOfflineMode}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                isOfflineMode 
                  ? 'bg-amber-500 hover:bg-amber-400 text-black font-semibold' 
                  : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-white/10'
              }`}
            >
              {isOfflineMode ? 'Disable' : 'Enable'}
            </button>
          </div>

          {/* Storage Quota Usage Meter */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-400 flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-neutral-300" />
                Assembly Local Disk Cache
              </span>
              <span className="font-mono text-neutral-300 font-semibold">
                {totalCachedMb.toFixed(1)} MB / {allocatedGb} GB
              </span>
            </div>

            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-rose-500 transition-all duration-300"
                style={{ width: `${Math.max(4, percentUsed)}%` }}
              />
            </div>
            <div className="text-[10px] text-neutral-500 font-mono flex justify-between">
              <span>{downloadedVideos.length} videos downloaded</span>
              <span>Fast 0ms latency playback</span>
            </div>
          </div>

          {/* Download Quality Preference */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
              Default Download Quality
            </label>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              {(['1080p', '720p', 'audio'] as const).map(q => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setDownloadQuality(q)}
                  className={`py-1.5 rounded-md border text-center transition-colors ${
                    downloadQuality === q
                      ? 'bg-white/15 border-white/30 text-white font-semibold'
                      : 'bg-white/[0.02] border-white/10 text-neutral-400 hover:text-white'
                  }`}
                >
                  {q === '1080p' ? '1080p Full HD' : q === '720p' ? '720p Compact' : 'Audio Only'}
                </button>
              ))}
            </div>
          </div>

          {/* Downloaded Video List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
              <span>Cached Library</span>
              {downloadedVideos.length > 0 && (
                <button
                  type="button"
                  onClick={onClearAllDownloads}
                  className="text-rose-400 hover:text-rose-300 normal-case flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear All</span>
                </button>
              )}
            </div>

            {downloadedVideos.length === 0 ? (
              <div className="p-6 rounded-lg border border-dashed border-white/10 text-center text-xs text-neutral-400">
                No downloaded videos yet. Click "Download" on any video to save it for offline playback.
              </div>
            ) : (
              <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                {downloadedVideos.map(vid => (
                  <div
                    key={vid.id}
                    className={`p-2.5 rounded-lg border flex items-center justify-between gap-3 text-xs transition-colors ${
                      isDarkMode ? 'bg-white/[0.02] border-white/10 hover:bg-white/[0.04]' : 'bg-neutral-50 border-black/10'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-12 aspect-video rounded bg-neutral-800 flex items-center justify-center shrink-0">
                        <Play className="w-3.5 h-3.5 text-neutral-400 fill-current" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-white truncate">{vid.title}</div>
                        <div className="text-[10px] text-neutral-400 font-mono flex items-center gap-1.5">
                          <span>{vid.offlineSizeMb} MB</span>
                          <span aria-hidden="true">·</span>
                          <span>{vid.resolution}</span>
                          <span aria-hidden="true">·</span>
                          <span>{vid.duration}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectVideo(vid);
                          onClose();
                        }}
                        className="p-1.5 rounded bg-white/10 hover:bg-white/20 text-white transition-colors"
                        title="Play offline"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemoveDownload(vid.id)}
                        className="p-1.5 rounded hover:bg-rose-500/20 text-neutral-400 hover:text-rose-400 transition-colors"
                        title="Delete from cache"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-white/[0.02] border-t border-white/[0.08] flex items-center justify-between text-xs">
          <span className="text-[11px] text-neutral-400">Cache storage persistent in browser</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
