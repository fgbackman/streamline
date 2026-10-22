import React, { useState } from 'react';
import { 
  X, 
  Monitor, 
  Smartphone, 
  Tablet, 
  Tv, 
  Glasses, 
  RefreshCw, 
  Check, 
  Copy, 
  QrCode, 
  ArrowRightLeft, 
  Battery, 
  Radio, 
  Play
} from 'lucide-react';
import { SyncDevice, Video } from '../types';

interface DeviceSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  devices: SyncDevice[];
  currentVideo: Video;
  currentTime: number;
  onHandoffToDevice: (device: SyncDevice) => void;
  onResumeFromDevice: (device: SyncDevice) => void;
  isDarkMode: boolean;
}

export const DeviceSyncModal: React.FC<DeviceSyncModalProps> = ({
  isOpen,
  onClose,
  devices,
  currentVideo,
  currentTime,
  onHandoffToDevice,
  onResumeFromDevice,
  isDarkMode,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [syncPin] = useState('749-218');
  const [activeTab, setActiveTab] = useState<'devices' | 'pair'>('devices');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const renderDeviceIcon = (type: SyncDevice['type']) => {
    switch (type) {
      case 'iphone': return <Smartphone className="w-5 h-5 text-sky-400" />;
      case 'ipad': return <Tablet className="w-5 h-5 text-indigo-400" />;
      case 'tv': return <Tv className="w-5 h-5 text-purple-400" />;
      case 'vision_pro': return <Glasses className="w-5 h-5 text-emerald-400" />;
      default: return <Monitor className="w-5 h-5 text-neutral-300" />;
    }
  };

  const formatSecs = (s?: number) => {
    if (!s) return '00:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const handleBroadcastSync = () => {
    setIsBroadcasting(true);
    setStatusMessage(`Broadcasting current timestamp (${formatSecs(currentTime)}) to all paired devices...`);
    setTimeout(() => {
      setIsBroadcasting(false);
      setStatusMessage('All 4 devices synchronized successfully via Cocoa Continuity');
      setTimeout(() => setStatusMessage(null), 3500);
    }, 1200);
  };

  const handleCopyPin = () => {
    navigator.clipboard.writeText(syncPin);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className={`w-full max-w-lg rounded-xl border shadow-2xl overflow-hidden transition-all ${
          isDarkMode 
            ? 'bg-[#18191e] border-white/15 text-neutral-100' 
            : 'bg-white border-black/15 text-neutral-900'
        }`}
      >
        {/* Cocoa Sheet Header */}
        <div className="px-5 py-3.5 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-semibold">Cross-Device Synchronization</h3>
              <p className="text-[11px] text-neutral-400 font-mono">Cocoa Continuity & Broadcast Sync</p>
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

        {/* Tab Switcher */}
        <div className="px-5 pt-3 flex gap-2 border-b border-white/[0.08]">
          <button
            type="button"
            onClick={() => setActiveTab('devices')}
            className={`pb-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'devices'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Connected Devices ({devices.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pair')}
            className={`pb-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'pair'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Pair New Device
          </button>
        </div>

        {/* Status Toast */}
        {statusMessage && (
          <div className="mx-5 mt-3 p-2 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-3.5 h-3.5" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Tab 1: Connected Devices */}
        {activeTab === 'devices' ? (
          <div className="p-5 space-y-4">
            {/* Current State Info Banner */}
            <div className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
              isDarkMode ? 'bg-white/[0.03] border-white/10' : 'bg-neutral-50 border-black/10'
            }`}>
              <div>
                <div className="text-[11px] text-neutral-400">Current Local Stream</div>
                <div className="font-semibold text-white truncate max-w-xs">{currentVideo.title}</div>
                <div className="text-[10px] font-mono text-neutral-400">Playhead at {formatSecs(currentTime)}</div>
              </div>
              <button
                type="button"
                onClick={handleBroadcastSync}
                disabled={isBroadcasting}
                className="px-3 py-1.5 rounded-md bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isBroadcasting ? 'animate-spin' : ''}`} />
                <span>Sync All</span>
              </button>
            </div>

            {/* Device List */}
            <div className="space-y-2">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                Paired Cocoa Devices
              </div>
              {devices.map((device) => (
                <div
                  key={device.id}
                  className={`p-3 rounded-lg border flex items-center justify-between transition-colors ${
                    device.isCurrentDevice
                      ? isDarkMode ? 'bg-sky-950/20 border-sky-500/40' : 'bg-sky-50 border-sky-200'
                      : isDarkMode ? 'bg-white/[0.02] border-white/10 hover:bg-white/[0.04]' : 'bg-neutral-50 border-black/10 hover:bg-neutral-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-black/30 border border-white/10">
                      {renderDeviceIcon(device.type)}
                    </div>
                    <div>
                      <div className="text-xs font-semibold flex items-center gap-2">
                        <span>{device.name}</span>
                        {device.isCurrentDevice && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-400 font-mono">
                            This Host
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-neutral-400 flex items-center gap-2 font-mono">
                        <span>{device.lastActive}</span>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-1">
                          <Battery className="w-3 h-3" />
                          {device.batteryPercent}%
                        </span>
                        {device.currentTimestamp !== undefined && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-rose-400">at {formatSecs(device.currentTimestamp)}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {!device.isCurrentDevice && (
                    <div className="flex items-center gap-2">
                      {/* Pull from device */}
                      {device.currentTimestamp !== undefined && (
                        <button
                          type="button"
                          onClick={() => onResumeFromDevice(device)}
                          className="px-2.5 py-1 rounded text-[11px] font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-white/10 flex items-center gap-1"
                          title="Resume from this device's position"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Resume</span>
                        </button>
                      )}
                      {/* Push to device */}
                      <button
                        type="button"
                        onClick={() => onHandoffToDevice(device)}
                        className="px-2.5 py-1 rounded text-[11px] font-medium bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 flex items-center gap-1"
                        title="Send current video to this device"
                      >
                        <ArrowRightLeft className="w-3 h-3" />
                        <span>Handoff</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Tab 2: Pair New Device */
          <div className="p-5 space-y-4 text-center">
            <p className="text-xs text-neutral-400">
              Open Assembly Player on your iPhone, iPad, or Mac and enter the 6-digit sync PIN or scan the QR code to pair seamlessly.
            </p>

            {/* Simulated Live QR Code SVG */}
            <div className="mx-auto w-44 h-44 p-3 rounded-xl bg-white flex items-center justify-center shadow-lg">
              <svg viewBox="0 0 100 100" className="w-full h-full fill-neutral-900">
                {/* Corner markers */}
                <rect x="5" y="5" width="25" height="25" fill="#111" />
                <rect x="9" y="9" width="17" height="17" fill="#fff" />
                <rect x="13" y="13" width="9" height="9" fill="#111" />

                <rect x="70" y="5" width="25" height="25" fill="#111" />
                <rect x="74" y="9" width="17" height="17" fill="#fff" />
                <rect x="78" y="13" width="9" height="9" fill="#111" />

                <rect x="5" y="70" width="25" height="25" fill="#111" />
                <rect x="9" y="74" width="17" height="17" fill="#fff" />
                <rect x="13" y="78" width="9" height="9" fill="#111" />

                {/* Data matrix dots */}
                <rect x="36" y="10" width="5" height="5" />
                <rect x="46" y="15" width="8" height="5" />
                <rect x="58" y="10" width="5" height="5" />
                <rect x="36" y="24" width="8" height="5" />
                <rect x="48" y="28" width="6" height="5" />

                <rect x="10" y="38" width="8" height="6" />
                <rect x="24" y="42" width="6" height="6" />
                <rect x="36" y="40" width="12" height="12" fill="#E11D48" />
                <rect x="52" y="42" width="8" height="6" />
                <rect x="66" y="38" width="10" height="6" />
                <rect x="80" y="42" width="8" height="8" />

                <rect x="38" y="60" width="8" height="6" />
                <rect x="50" y="64" width="10" height="6" />
                <rect x="64" y="58" width="6" height="10" />
                <rect x="74" y="70" width="12" height="6" />
                <rect x="42" y="76" width="6" height="10" />
                <rect x="54" y="80" width="12" height="8" />
                <rect x="72" y="84" width="14" height="6" />
              </svg>
            </div>

            {/* PIN Code Box */}
            <div className="flex items-center justify-center gap-3">
              <span className="font-mono text-2xl font-bold tracking-widest text-rose-500 bg-white/5 px-4 py-1.5 rounded-lg border border-white/10">
                {syncPin}
              </span>
              <button
                type="button"
                onClick={handleCopyPin}
                className="px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-white flex items-center gap-1.5 border border-white/10 transition-colors"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied' : 'Copy PIN'}</span>
              </button>
            </div>

            <div className="text-[11px] text-neutral-400">
              Broadcast protocol: WebSocket P2P + BroadcastChannel (Local Mesh Mode)
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-5 py-3 bg-white/[0.02] border-t border-white/[0.08] flex items-center justify-between text-[11px] text-neutral-400">
          <span>End-to-End Encrypted Sync</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-white text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
