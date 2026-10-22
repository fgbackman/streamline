import React, { useState } from 'react';
import { 
  X, 
  Bell, 
  Check, 
  Sliders, 
  Volume2, 
  Moon, 
  Sparkles, 
  Play, 
  CheckCheck,
  ShieldAlert
} from 'lucide-react';
import { NotificationItem, NotificationSettings, Video } from '../types';

interface NotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  settings: NotificationSettings;
  onUpdateSettings: (newSettings: NotificationSettings) => void;
  onMarkAllRead: () => void;
  onSelectVideoById: (videoId: string) => void;
  isDarkMode: boolean;
}

export const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  settings,
  onUpdateSettings,
  onMarkAllRead,
  onSelectVideoById,
  isDarkMode,
}) => {
  const [activeTab, setActiveTab] = useState<'inbox' | 'preferences'>('inbox');
  const [saveToast, setSaveToast] = useState(false);

  if (!isOpen) return null;

  const handleToggleCategory = (catKey: keyof NotificationSettings['categories']) => {
    const updated = {
      ...settings,
      categories: {
        ...settings.categories,
        [catKey]: !settings.categories[catKey],
      }
    };
    onUpdateSettings(updated);
    showSavedToast();
  };

  const handleUpdateChannelAlerts = (level: 'all' | 'personalized' | 'none') => {
    const updated = { ...settings, channelAlerts: level };
    onUpdateSettings(updated);
    showSavedToast();
  };

  const showSavedToast = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

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
            <div className="w-7 h-7 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-semibold">Notification Center & Alerts</h3>
              <p className="text-[11px] text-neutral-400 font-mono">Personalized Content Delivery Settings</p>
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
            onClick={() => setActiveTab('inbox')}
            className={`pb-2 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'inbox' ? 'border-rose-500 text-rose-400' : 'border-transparent text-neutral-400'
            }`}
          >
            <span>Inbox Alerts</span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-600 text-white font-mono">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preferences')}
            className={`pb-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'preferences' ? 'border-rose-500 text-rose-400' : 'border-transparent text-neutral-400'
            }`}
          >
            Custom Alert Settings
          </button>
        </div>

        {/* Saved confirmation toast */}
        {saveToast && (
          <div className="mx-5 mt-3 p-2 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-3.5 h-3.5" />
            <span>Preferences updated</span>
          </div>
        )}

        {/* Content */}
        <div className="p-5 max-h-[460px] overflow-y-auto space-y-4">
          {activeTab === 'inbox' ? (
            /* Inbox alerts list */
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                <span>Recent Notifications</span>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={onMarkAllRead}
                    className="text-rose-400 hover:text-rose-300 normal-case flex items-center gap-1"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              {notifications.length === 0 ? (
                <div className="p-6 rounded-lg border border-dashed border-white/10 text-center text-xs text-neutral-400">
                  No notifications. You are all caught up!
                </div>
              ) : (
                <div className="space-y-2">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3 rounded-lg border flex items-center justify-between gap-3 text-xs transition-colors ${
                        item.isRead
                          ? isDarkMode ? 'bg-white/[0.01] border-white/5 opacity-75' : 'bg-neutral-50 border-black/5 opacity-75'
                          : isDarkMode ? 'bg-white/[0.04] border-rose-500/30 ring-1 ring-rose-500/20' : 'bg-rose-50/50 border-rose-200'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded bg-neutral-800 flex items-center justify-center shrink-0">
                          <Bell className={`w-4 h-4 ${item.isRead ? 'text-neutral-500' : 'text-rose-500'}`} />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-white truncate">{item.title}</div>
                          <div className="text-[11px] text-neutral-400 flex items-center gap-1.5 font-mono">
                            <span>{item.channel}</span>
                            <span aria-hidden="true">·</span>
                            <span>{item.timeAgo}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          onSelectVideoById(item.videoId);
                          onClose();
                        }}
                        className="px-3 py-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs flex items-center gap-1 shrink-0"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Watch</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Custom alert preferences */
            <div className="space-y-4">
              {/* Channel Alerts Level */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Channel Frequency Level
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[
                    { id: 'all', label: 'All Uploads', desc: 'Every new video drop' },
                    { id: 'personalized', label: 'Personalized', desc: 'AI-curated recommendations' },
                    { id: 'none', label: 'None', desc: 'Mute push alerts' },
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => handleUpdateChannelAlerts(lvl.id as any)}
                      className={`p-2.5 rounded-lg border text-left transition-colors ${
                        settings.channelAlerts === lvl.id
                          ? 'bg-rose-950/30 border-rose-500/50 text-rose-300'
                          : 'bg-white/[0.02] border-white/10 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <div className="font-semibold">{lvl.label}</div>
                      <div className="text-[10px] text-neutral-500">{lvl.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Category-specific alerts */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Personalized Topic Categories
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(settings.categories).map(([key, isEnabled]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleToggleCategory(key as any)}
                      className={`p-2 rounded-lg border flex items-center justify-between capitalize transition-colors ${
                        isEnabled
                          ? 'bg-white/10 border-white/20 text-white'
                          : 'bg-white/[0.02] border-white/5 text-neutral-500'
                      }`}
                    >
                      <span>{key} drops</span>
                      <span className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] ${
                        isEnabled ? 'bg-rose-600 text-white' : 'border border-neutral-600'
                      }`}>
                        {isEnabled && <Check className="w-2.5 h-2.5" />}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sound and Desktop Push Settings */}
              <div className="space-y-2 pt-2 border-t border-white/[0.08]">
                <label className="flex items-center justify-between text-xs cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-neutral-400" />
                    <span>Audible Chimes on Premiere</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.soundAlerts}
                    onChange={(e) => {
                      onUpdateSettings({ ...settings, soundAlerts: e.target.checked });
                      showSavedToast();
                    }}
                    className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 bg-neutral-800 border-neutral-700"
                  />
                </label>

                <label className="flex items-center justify-between text-xs cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Moon className="w-4 h-4 text-neutral-400" />
                    <div>
                      <div>Quiet Hours Schedule</div>
                      <div className="text-[10px] text-neutral-500">Mute notifications between 22:00 and 08:00</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.quietHours}
                    onChange={(e) => {
                      onUpdateSettings({ ...settings, quietHours: e.target.checked });
                      showSavedToast();
                    }}
                    className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 bg-neutral-800 border-neutral-700"
                  />
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-white/[0.02] border-t border-white/[0.08] flex items-center justify-between text-xs">
          <span className="text-[11px] text-neutral-400">Settings synchronized across Apple devices</span>
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
