import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  Code, 
  QrCode, 
  ExternalLink,
  MessageCircle,
  Mail
} from 'lucide-react';
import { Video } from '../types';

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: Video;
  currentTime: number;
  isDarkMode: boolean;
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({
  isOpen,
  onClose,
  video,
  currentTime,
  isDarkMode,
}) => {
  const [includeTimestamp, setIncludeTimestamp] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [activeTab, setActiveTab] = useState<'social' | 'embed'>('social');

  if (!isOpen) return null;

  const roundedTime = Math.floor(currentTime);
  const baseUrl = window.location.href.split('?')[0];
  const shareUrl = includeTimestamp && roundedTime > 0
    ? `${baseUrl}?v=${video.id}&t=${roundedTime}`
    : `${baseUrl}?v=${video.id}`;

  const embedCode = `<iframe width="560" height="315" src="${shareUrl}&embed=1" title="${video.title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: video.title,
          text: `Watch "${video.title}" by ${video.channel} on Assembly Cocoa Player`,
          url: shareUrl,
        });
      } catch {
        // User cancelled
      }
    }
  };

  const socialLinks = [
    {
      name: 'X (Twitter)',
      icon: '𝕏',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Watching "${video.title}" on Assembly Cocoa Player`)}&url=${encodeURIComponent(shareUrl)}`,
      color: 'bg-black text-white hover:bg-neutral-800'
    },
    {
      name: 'Reddit',
      icon: '🔴',
      url: `https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(video.title)}`,
      color: 'bg-[#ff4500]/15 text-[#ff4500] hover:bg-[#ff4500]/25'
    },
    {
      name: 'WhatsApp',
      icon: '🟢',
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${video.title} - ${shareUrl}`)}`,
      color: 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25'
    },
    {
      name: 'Telegram',
      icon: '✈️',
      url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(video.title)}`,
      color: 'bg-sky-500/15 text-sky-400 hover:bg-sky-500/25'
    },
    {
      name: 'LinkedIn',
      icon: '💼',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      color: 'bg-blue-600/15 text-blue-400 hover:bg-blue-600/25'
    },
    {
      name: 'Email',
      icon: '✉️',
      url: `mailto:?subject=${encodeURIComponent(`Watch: ${video.title}`)}&body=${encodeURIComponent(`Check out this video on Assembly Cocoa Player:\n\n${video.title}\n${shareUrl}`)}`,
      color: 'bg-neutral-500/15 text-neutral-300 hover:bg-neutral-500/25'
    }
  ];

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
            <div className="w-7 h-7 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-semibold">Share & Export</h3>
              <p className="text-[11px] text-neutral-400 font-mono">Social Publishing & Embeds</p>
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

        {/* Tab switch */}
        <div className="px-5 pt-3 flex gap-2 border-b border-white/[0.08]">
          <button
            type="button"
            onClick={() => setActiveTab('social')}
            className={`pb-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'social' ? 'border-rose-500 text-rose-400' : 'border-transparent text-neutral-400'
            }`}
          >
            Social Channels
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('embed')}
            className={`pb-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'embed' ? 'border-rose-500 text-rose-400' : 'border-transparent text-neutral-400'
            }`}
          >
            Embed Code
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Video Preview Snippet */}
          <div className={`p-2.5 rounded-lg border flex items-center gap-3 text-xs ${
            isDarkMode ? 'bg-white/[0.02] border-white/10' : 'bg-neutral-50 border-black/10'
          }`}>
            <div className="w-12 aspect-video rounded bg-neutral-800 flex items-center justify-center shrink-0">
              <Share2 className="w-4 h-4 text-neutral-400" />
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-white truncate">{video.title}</div>
              <div className="text-[11px] text-neutral-400">{video.channel}</div>
            </div>
          </div>

          {/* Timestamp checkbox */}
          <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-neutral-300">
            <input
              type="checkbox"
              checked={includeTimestamp}
              onChange={(e) => setIncludeTimestamp(e.target.checked)}
              className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 bg-neutral-800 border-neutral-700"
            />
            <span>Start at current timestamp: <strong className="font-mono text-white">{Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')}</strong></span>
          </label>

          {/* Copy Direct URL Box */}
          <div className="space-y-1">
            <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
              Direct Link
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className={`flex-1 h-8 px-2.5 text-xs rounded-md border font-mono outline-none ${
                  isDarkMode ? 'bg-neutral-900 border-white/10 text-neutral-300' : 'bg-neutral-50 border-black/10 text-neutral-800'
                }`}
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3 h-8 rounded-md bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium flex items-center gap-1.5 transition-colors shrink-0"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {activeTab === 'social' ? (
            /* Social Grid */
            <div className="space-y-2">
              <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                Export to Social Networks
              </div>
              <div className="grid grid-cols-3 gap-2">
                {socialLinks.map((item) => (
                  <a
                    key={item.name}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2.5 rounded-lg border border-white/10 flex flex-col items-center justify-center gap-1 transition-all ${item.color}`}
                  >
                    <span className="text-base">{item.icon}</span>
                    <span className="text-[11px] font-medium">{item.name}</span>
                  </a>
                ))}
              </div>

              {/* Native Mobile Share fallback */}
              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="w-full py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-white flex items-center justify-center gap-2 border border-white/10 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>Open System Share Sheet</span>
                </button>
              )}
            </div>
          ) : (
            /* Embed code */
            <div className="space-y-2">
              <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider flex items-center justify-between">
                <span>HTML Embed Iframe</span>
                <span className="text-neutral-500 font-mono">560 x 315</span>
              </div>
              <textarea
                readOnly
                rows={3}
                value={embedCode}
                className={`w-full p-2 text-[11px] font-mono rounded-md border outline-none resize-none ${
                  isDarkMode ? 'bg-neutral-900 border-white/10 text-neutral-300' : 'bg-neutral-50 border-black/10 text-neutral-800'
                }`}
              />
              <button
                type="button"
                onClick={handleCopyEmbed}
                className="w-full py-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-white flex items-center justify-center gap-1.5 border border-white/10 transition-colors"
              >
                {copiedEmbed ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Code className="w-3.5 h-3.5" />}
                <span>{copiedEmbed ? 'Embed Code Copied' : 'Copy HTML Embed Code'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-white/[0.02] border-t border-white/[0.08] flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
