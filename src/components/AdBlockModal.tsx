import React from 'react';
import { 
  X, 
  ShieldCheck, 
  ShieldAlert, 
  Zap, 
  EyeOff, 
  Timer, 
  Wifi, 
  Check, 
  Layers
} from 'lucide-react';
import { AdBlockStats } from '../types';

interface AdBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: AdBlockStats;
  onToggleAdShield: () => void;
  onToggleSkipSponsors: () => void;
  isDarkMode: boolean;
}

export const AdBlockModal: React.FC<AdBlockModalProps> = ({
  isOpen,
  onClose,
  stats,
  onToggleAdShield,
  onToggleSkipSponsors,
  isDarkMode,
}) => {
  if (!isOpen) return null;

  const minutesSaved = Math.floor(stats.timeSavedSeconds / 60);
  const secondsSaved = stats.timeSavedSeconds % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className={`w-full max-w-md rounded-xl border shadow-2xl overflow-hidden transition-all ${
          isDarkMode 
            ? 'bg-[#18191e] border-white/15 text-neutral-100' 
            : 'bg-white border-black/15 text-neutral-900'
        }`}
      >
        {/* Cocoa Header */}
        <div className="px-5 py-3.5 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center border ${
              stats.isEnabled
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                : 'bg-amber-500/15 border-amber-500/30 text-amber-400'
            }`}>
              {stats.isEnabled ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-xs font-semibold">Assembly AdShield & SponsorBlock</h3>
              <p className="text-[11px] text-neutral-400 font-mono">Kernel-Level Media Stream Filter</p>
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
          {/* Master Shield Toggle */}
          <div className={`p-3.5 rounded-lg border flex items-center justify-between transition-colors ${
            stats.isEnabled
              ? isDarkMode ? 'bg-emerald-950/20 border-emerald-500/40' : 'bg-emerald-50 border-emerald-200'
              : isDarkMode ? 'bg-white/[0.02] border-white/10' : 'bg-neutral-50 border-black/10'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                stats.isEnabled ? 'bg-emerald-500 text-black' : 'bg-neutral-800 text-neutral-400'
              }`}>
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold">Ad-Shield Protection</div>
                <div className="text-[11px] text-neutral-400">
                  {stats.isEnabled ? 'Zero ads, commercial interruptions, or trackers' : 'Ad filtering disabled'}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onToggleAdShield}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                stats.isEnabled
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-black font-semibold'
                  : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-white/10'
              }`}
            >
              {stats.isEnabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          {/* SponsorBlock Auto-Skip Toggle */}
          <div className={`p-3.5 rounded-lg border flex items-center justify-between transition-colors ${
            stats.skipSponsors
              ? isDarkMode ? 'bg-amber-950/20 border-amber-500/40' : 'bg-amber-50 border-amber-200'
              : isDarkMode ? 'bg-white/[0.02] border-white/10' : 'bg-neutral-50 border-black/10'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                stats.skipSponsors ? 'bg-amber-500 text-black' : 'bg-neutral-800 text-neutral-400'
              }`}>
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold">SponsorBlock Auto-Skip</div>
                <div className="text-[11px] text-neutral-400">
                  Automatically jump over sponsored segments in video timeline
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onToggleSkipSponsors}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                stats.skipSponsors
                  ? 'bg-amber-500 hover:bg-amber-400 text-black font-semibold'
                  : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-white/10'
              }`}
            >
              {stats.skipSponsors ? 'Active' : 'Off'}
            </button>
          </div>

          {/* Metrics Matrix */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className={`p-2.5 rounded-lg border ${
              isDarkMode ? 'bg-white/[0.02] border-white/10' : 'bg-neutral-50 border-black/10'
            }`}>
              <div className="text-[10px] text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Ads Blocked
              </div>
              <div className="text-lg font-bold text-emerald-400 mt-1">
                {stats.adsBlockedCount}
              </div>
            </div>

            <div className={`p-2.5 rounded-lg border ${
              isDarkMode ? 'bg-white/[0.02] border-white/10' : 'bg-neutral-50 border-black/10'
            }`}>
              <div className="text-[10px] text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" />
                Sponsors Skipped
              </div>
              <div className="text-lg font-bold text-amber-400 mt-1">
                {stats.sponsorsSkippedCount}
              </div>
            </div>

            <div className={`p-2.5 rounded-lg border ${
              isDarkMode ? 'bg-white/[0.02] border-white/10' : 'bg-neutral-50 border-black/10'
            }`}>
              <div className="text-[10px] text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                <Timer className="w-3 h-3 text-sky-400" />
                Time Saved
              </div>
              <div className="text-base font-bold text-sky-400 mt-1">
                {minutesSaved}m {secondsSaved}s
              </div>
            </div>

            <div className={`p-2.5 rounded-lg border ${
              isDarkMode ? 'bg-white/[0.02] border-white/10' : 'bg-neutral-50 border-black/10'
            }`}>
              <div className="text-[10px] text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                <EyeOff className="w-3 h-3 text-rose-400" />
                Trackers Halted
              </div>
              <div className="text-lg font-bold text-rose-400 mt-1">
                {stats.trackersBlockedCount}
              </div>
            </div>
          </div>

          {/* Active Filter Lists */}
          <div className="space-y-1.5 text-[11px] text-neutral-400">
            <div className="font-semibold text-neutral-300 uppercase tracking-wider text-[10px]">
              Active Filter Rulesets
            </div>
            <div className="space-y-1 font-mono">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <Check className="w-3 h-3" />
                <span>EasyList Video Filter v2026.09</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <Check className="w-3 h-3" />
                <span>SponsorBlock Community Database</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <Check className="w-3 h-3" />
                <span>uBlock Origin Cosmetic Desync Rules</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-white/[0.02] border-t border-white/[0.08] flex items-center justify-between text-xs">
          <span className="text-[11px] text-neutral-400">Pure client-side stream sanitization</span>
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
