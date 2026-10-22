import React from 'react';
import { Wifi, HardDrive, ShieldCheck, Monitor, Cpu } from 'lucide-react';
import { SyncDevice } from '../types';

interface CocoaStatusFooterProps {
  isDarkMode: boolean;
  isOfflineMode: boolean;
  adsBlocked: number;
  activeDevice: SyncDevice | undefined;
  onOpenDeviceSync: () => void;
  onOpenOfflineManager: () => void;
}

export const CocoaStatusFooter: React.FC<CocoaStatusFooterProps> = ({
  isDarkMode,
  isOfflineMode,
  adsBlocked,
  activeDevice,
  onOpenDeviceSync,
  onOpenOfflineManager,
}) => {
  return (
    <footer className={`h-7 px-3.5 flex items-center justify-between select-none border-t text-[11px] font-mono transition-colors ${
      isDarkMode 
        ? 'bg-[#15161a] border-white/[0.08] text-neutral-400' 
        : 'bg-[#eeeff2] border-black/[0.08] text-neutral-600'
    }`}>
      {/* Left: Cocoa Engine Specs */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-neutral-300">
          <Cpu className="w-3 h-3 text-rose-500" />
          <span>Assembly Cocoa Runtime</span>
        </div>
        <span className="hidden sm:inline text-neutral-600">·</span>
        <span className="hidden sm:inline">60 FPS Hardware Render</span>
        <span className="hidden md:inline text-neutral-600">·</span>
        <span className="hidden md:inline">Stereo 48kHz</span>
      </div>

      {/* Right: Status Affordances */}
      <div className="flex items-center gap-3">
        {/* Device Sync Pill */}
        <button
          type="button"
          onClick={onOpenDeviceSync}
          className="flex items-center gap-1 hover:text-white transition-colors"
          title="Open Device Sync"
        >
          <Monitor className="w-3 h-3 text-sky-400" />
          <span className="hidden sm:inline">Continuity:</span>
          <span className="text-emerald-400">Connected</span>
        </button>

        <span className="text-neutral-600">·</span>

        {/* Offline Cache */}
        <button
          type="button"
          onClick={onOpenOfflineManager}
          className="flex items-center gap-1 hover:text-white transition-colors"
          title="Manage Offline Cache"
        >
          <HardDrive className="w-3 h-3 text-amber-400" />
          <span>{isOfflineMode ? 'Offline Mode' : 'Cache Ready'}</span>
        </button>

        <span className="text-neutral-600">·</span>

        {/* AdShield */}
        <div className="flex items-center gap-1 text-emerald-400">
          <ShieldCheck className="w-3 h-3" />
          <span>0 Ads</span>
        </div>
      </div>
    </footer>
  );
};
