import React, { useState } from 'react';
import { 
  Sun, 
  Moon, 
  Wifi, 
  WifiOff, 
  ShieldCheck, 
  ShieldAlert, 
  Share2, 
  Bell, 
  DownloadCloud, 
  Monitor, 
  Maximize2, 
  Minimize2,
  Sliders,
  Check
} from 'lucide-react';
import { AdBlockStats, NotificationItem } from '../types';

interface CocoaTitlebarProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isOfflineMode: boolean;
  onToggleOfflineMode: () => void;
  adBlockStats: AdBlockStats;
  onOpenAdBlockModal: () => void;
  onOpenDeviceSync: () => void;
  onOpenOfflineManager: () => void;
  onOpenNotifications: () => void;
  onOpenShareModal: () => void;
  onOpenSettings: () => void;
  onOpenPageBuilder: () => void;
  onOpenDownloadFiles: () => void;
  unreadNotificationsCount: number;
  syncedDeviceCount: number;
  activeLayoutMode: 'standard' | 'theater' | 'compact';
  onChangeLayoutMode: (mode: 'standard' | 'theater' | 'compact') => void;
  isWindowMaximized: boolean;
  onToggleMaximizeWindow: () => void;
}

export const CocoaTitlebar: React.FC<CocoaTitlebarProps> = ({
  isDarkMode,
  onToggleDarkMode,
  isOfflineMode,
  onToggleOfflineMode,
  adBlockStats,
  onOpenAdBlockModal,
  onOpenDeviceSync,
  onOpenOfflineManager,
  onOpenNotifications,
  onOpenShareModal,
  onOpenSettings,
  onOpenPageBuilder,
  onOpenDownloadFiles,
  unreadNotificationsCount,
  syncedDeviceCount,
  activeLayoutMode,
  onChangeLayoutMode,
  isWindowMaximized,
  onToggleMaximizeWindow,
}) => {
  const [trafficHovered, setTrafficHovered] = useState(false);

  return (
    <header className={`h-11 px-3.5 flex items-center justify-between select-none border-b transition-colors duration-200 ${
      isDarkMode 
        ? 'bg-[#18191d]/90 backdrop-blur-xl border-white/[0.08] text-neutral-200' 
        : 'bg-[#f4f5f8]/95 backdrop-blur-xl border-black/[0.08] text-neutral-800'
    }`}>
      {/* Zone 1: Traffic Lights + Bespoke Cocoa Assembly App Icon + Window Title */}
      <div className="flex items-center gap-3">
        {/* macOS Traffic Lights with hover glyphs */}
        <div 
          className="flex items-center gap-2 group mr-1"
          onMouseEnter={() => setTrafficHovered(true)}
          onMouseLeave={() => setTrafficHovered(false)}
        >
          {/* Close */}
          <button 
            type="button"
            title="Close Window"
            aria-label="Close Window"
            className="w-3 h-3 rounded-full bg-[#ff5f57] border border-[#e0443e] flex items-center justify-center text-[8px] text-[#4d0000] font-bold opacity-90 hover:opacity-100 transition-opacity"
            onClick={() => window.location.reload()}
          >
            <span className={`transition-opacity duration-150 leading-none ${trafficHovered ? 'opacity-80' : 'opacity-0'}`}>×</span>
          </button>
          {/* Minimize */}
          <button 
            type="button"
            title="Minimize"
            aria-label="Minimize Window"
            className="w-3 h-3 rounded-full bg-[#febc2e] border border-[#d89e24] flex items-center justify-center text-[8px] text-[#543b00] font-bold opacity-90 hover:opacity-100 transition-opacity"
            onClick={() => onChangeLayoutMode(activeLayoutMode === 'compact' ? 'standard' : 'compact')}
          >
            <span className={`transition-opacity duration-150 leading-none ${trafficHovered ? 'opacity-80' : 'opacity-0'}`}>−</span>
          </button>
          {/* Zoom / Fullscreen */}
          <button 
            type="button"
            title="Zoom / Fullscreen"
            aria-label="Zoom Window"
            className="w-3 h-3 rounded-full bg-[#28c840] border border-[#1aab29] flex items-center justify-center text-[7px] text-[#004707] font-bold opacity-90 hover:opacity-100 transition-opacity"
            onClick={onToggleMaximizeWindow}
          >
            <span className={`transition-opacity duration-150 leading-none ${trafficHovered ? 'opacity-80' : 'opacity-0'}`}>+</span>
          </button>
        </div>

        {/* Bespoke Cocoa Assembly App Icon */}
        <div className="flex items-center gap-2.5">
          <div className="relative w-6 h-6 rounded-[7px] bg-gradient-to-b from-[#2e3038] to-[#121316] p-[1px] shadow-sm shadow-black/40 ring-1 ring-white/10 shrink-0 flex items-center justify-center overflow-hidden">
            {/* Subtle inner lens glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-rose-600/40 via-transparent to-white/10" />
            <svg 
              viewBox="0 0 24 24" 
              className="w-3.5 h-3.5 fill-rose-500 stroke-rose-400 drop-shadow-[0_1px_2px_rgba(244,63,94,0.4)]"
            >
              <rect x="2" y="4" width="20" height="16" rx="4" fill="#E11D48" stroke="#FB7185" strokeWidth="0.5" />
              <polygon points="10,8 16,12 10,16" fill="#FFFFFF" />
            </svg>
          </div>

          {/* Window Title & Document Proxy */}
          <div className="flex items-center gap-1.5 text-xs font-semibold tracking-tight">
            <span className={isDarkMode ? 'text-neutral-200' : 'text-neutral-900'}>Assembly Player</span>
            <span className="text-[10px] text-neutral-400 font-mono font-normal">v3.4-cocoa</span>
          </div>
        </div>
      </div>

      {/* Zone 2: Cocoa Window Segmented Layout Controls */}
      <div className="hidden md:flex items-center gap-1 p-0.5 rounded-lg border text-xs font-medium transition-colors"
        style={{
          backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
          borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'
        }}
      >
        <button
          type="button"
          onClick={() => onChangeLayoutMode('standard')}
          className={`px-2.5 py-1 rounded-[5px] transition-all flex items-center gap-1.5 ${
            activeLayoutMode === 'standard'
              ? isDarkMode ? 'bg-neutral-800 text-white shadow-sm' : 'bg-white text-neutral-900 shadow-sm'
              : isDarkMode ? 'text-neutral-400 hover:text-neutral-200' : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <span>Integrated View</span>
        </button>
        <button
          type="button"
          onClick={() => onChangeLayoutMode('theater')}
          className={`px-2.5 py-1 rounded-[5px] transition-all flex items-center gap-1.5 ${
            activeLayoutMode === 'theater'
              ? isDarkMode ? 'bg-neutral-800 text-white shadow-sm' : 'bg-white text-neutral-900 shadow-sm'
              : isDarkMode ? 'text-neutral-400 hover:text-neutral-200' : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <span>Theater</span>
        </button>
        <button
          type="button"
          onClick={() => onChangeLayoutMode('compact')}
          className={`px-2.5 py-1 rounded-[5px] transition-all flex items-center gap-1.5 ${
            activeLayoutMode === 'compact'
              ? isDarkMode ? 'bg-neutral-800 text-white shadow-sm' : 'bg-white text-neutral-900 shadow-sm'
              : isDarkMode ? 'text-neutral-400 hover:text-neutral-200' : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <span>Mini Stage</span>
        </button>
      </div>

      {/* Zone 3: Cocoa Window Actions (AdShield, Device Sync, Offline, Notifications, Dark Mode) */}
      <div className="flex items-center gap-1.5">
        {/* AdBlock Shield Indicator Button */}
        <button
          type="button"
          onClick={onOpenAdBlockModal}
          title={adBlockStats.isEnabled ? `AdBlock Active: ${adBlockStats.adsBlockedCount} ads blocked` : 'AdBlock Disabled'}
          className={`h-7 px-2 rounded-md flex items-center gap-1.5 text-xs font-mono transition-colors border ${
            adBlockStats.isEnabled
              ? isDarkMode 
                ? 'bg-emerald-950/40 border-emerald-800/40 text-emerald-400 hover:bg-emerald-900/40' 
                : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
              : isDarkMode
                ? 'bg-neutral-800/50 border-neutral-700 text-neutral-400'
                : 'bg-neutral-100 border-neutral-200 text-neutral-500'
          }`}
        >
          {adBlockStats.isEnabled ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />}
          <span className="hidden sm:inline">AdShield</span>
          <span className="text-[10px] opacity-80">{adBlockStats.adsBlockedCount}</span>
        </button>

        {/* Offline Mode Switch */}
        <button
          type="button"
          onClick={onToggleOfflineMode}
          title={isOfflineMode ? 'Exit Offline Mode' : 'Switch to Offline Saved Mode'}
          className={`h-7 px-2 rounded-md flex items-center gap-1.5 text-xs font-medium transition-colors border ${
            isOfflineMode
              ? isDarkMode 
                ? 'bg-amber-950/50 border-amber-700/60 text-amber-300' 
                : 'bg-amber-50 border-amber-300 text-amber-800'
              : isDarkMode
                ? 'border-white/[0.08] hover:bg-white/[0.05] text-neutral-300'
                : 'border-black/[0.08] hover:bg-black/[0.05] text-neutral-600'
          }`}
        >
          {isOfflineMode ? <WifiOff className="w-3.5 h-3.5 text-amber-400" /> : <DownloadCloud className="w-3.5 h-3.5" />}
          <span className="hidden lg:inline">{isOfflineMode ? 'Offline Active' : 'Offline'}</span>
        </button>

        {/* Cross-Device Sync Modal trigger */}
        <button
          type="button"
          onClick={onOpenDeviceSync}
          title={`Cross-Device Sync (${syncedDeviceCount} devices connected)`}
          className={`h-7 px-2 rounded-md flex items-center gap-1.5 text-xs font-medium transition-colors border ${
            isDarkMode 
              ? 'border-white/[0.08] hover:bg-white/[0.05] text-neutral-300' 
              : 'border-black/[0.08] hover:bg-black/[0.05] text-neutral-600'
          }`}
        >
          <Monitor className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden sm:inline">Sync</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </button>

        {/* Notifications Bell */}
        <button
          type="button"
          onClick={onOpenNotifications}
          title="Notification Settings & Alerts"
          className={`relative h-7 w-7 rounded-md flex items-center justify-center transition-colors border ${
            isDarkMode 
              ? 'border-white/[0.08] hover:bg-white/[0.05] text-neutral-300' 
              : 'border-black/[0.08] hover:bg-black/[0.05] text-neutral-600'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#18191d]" />
          )}
        </button>

        {/* Share Button */}
        <button
          type="button"
          onClick={onOpenShareModal}
          title="Share Video & Export"
          className={`h-7 w-7 rounded-md flex items-center justify-center transition-colors border ${
            isDarkMode 
              ? 'border-white/[0.08] hover:bg-white/[0.05] text-neutral-300' 
              : 'border-black/[0.08] hover:bg-black/[0.05] text-neutral-600'
          }`}
        >
          <Share2 className="w-3.5 h-3.5" />
        </button>

        {/* Download Project Source Files Button */}
        <button
          type="button"
          onClick={onOpenDownloadFiles}
          title="Download Project Files (.ZIP for macOS)"
          className={`h-7 px-2 rounded-md flex items-center gap-1.5 text-xs font-medium transition-colors border ${
            isDarkMode 
              ? 'bg-sky-950/40 border-sky-500/40 text-sky-300 hover:bg-sky-900/40' 
              : 'bg-sky-50 border-sky-200 text-sky-700 hover:bg-sky-100'
          }`}
        >
          <DownloadCloud className="w-3.5 h-3.5" />
          <span className="hidden md:inline font-mono">Download Code</span>
        </button>

        {/* Page Builder / Customize Layout & Add Videos */}
        <button
          type="button"
          onClick={onOpenPageBuilder}
          title="Build Page: Hide/Show parts, reorder modules, & add custom streams"
          className={`h-7 px-2 rounded-md flex items-center gap-1.5 text-xs font-medium transition-colors border ${
            isDarkMode 
              ? 'bg-rose-950/40 border-rose-500/40 text-rose-300 hover:bg-rose-900/40' 
              : 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span className="hidden sm:inline font-mono">Build Page</span>
        </button>

        {/* Dark Mode Toggle */}
        <button
          type="button"
          onClick={onToggleDarkMode}
          title={isDarkMode ? 'Switch to Light Appearance' : 'Switch to Dark Appearance'}
          className={`h-7 w-7 rounded-md flex items-center justify-center transition-colors border ${
            isDarkMode 
              ? 'border-white/[0.08] hover:bg-white/[0.05] text-amber-300' 
              : 'border-black/[0.08] hover:bg-black/[0.05] text-neutral-700'
          }`}
        >
          {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </button>
      </div>
    </header>
  );
};
