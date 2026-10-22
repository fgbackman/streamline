import React, { useState } from 'react';
import { 
  ThumbsUp, 
  Share2, 
  DownloadCloud, 
  Check, 
  Monitor, 
  MessageSquare, 
  ChevronDown, 
  ChevronUp, 
  Send, 
  ShieldCheck,
  Sparkles,
  Radio
} from 'lucide-react';
import { Video, Comment } from '../types';

interface VideoInfoBarProps {
  video: Video;
  isDarkMode: boolean;
  onToggleLike: (videoId: string) => void;
  onOpenShareModal: () => void;
  onDownloadVideo: (videoId: string) => void;
  onOpenDeviceSync: () => void;
  comments: Comment[];
  onAddComment: (text: string) => void;
  onToggleLikeComment: (commentId: string) => void;
}

export const VideoInfoBar: React.FC<VideoInfoBarProps> = ({
  video,
  isDarkMode,
  onToggleLike,
  onOpenShareModal,
  onDownloadVideo,
  onOpenDeviceSync,
  comments,
  onAddComment,
  onToggleLikeComment,
}) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    onAddComment(newCommentText.trim());
    setNewCommentText('');
  };

  return (
    <div className="space-y-3">
      {/* Video Title */}
      <h1 className={`text-base md:text-lg font-semibold tracking-tight ${
        isDarkMode ? 'text-white' : 'text-neutral-900'
      }`}>
        {video.title}
      </h1>

      {/* Primary Row: Channel info + Actions (Like, Share, Download, Device Handoff) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-white/[0.08]">
        {/* Channel lockup */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-600 to-amber-600 flex items-center justify-center font-bold text-xs text-white shadow-sm ring-1 ring-white/10 shrink-0">
            {video.channelAvatar}
          </div>
          <div>
            <div className={`text-xs font-semibold ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
              {video.channel}
            </div>
            <div className="text-[11px] text-neutral-400">
              {video.source === 'youtube' ? 'YouTube channel' : `${video.subscribers} subscribers`}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsSubscribed(!isSubscribed)}
            className={`ml-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              isSubscribed
                ? isDarkMode ? 'bg-neutral-800 text-neutral-300 border border-white/10' : 'bg-neutral-200 text-neutral-700'
                : 'bg-rose-600 hover:bg-rose-500 text-white font-semibold shadow-sm'
            }`}
          >
            {isSubscribed ? 'Subscribed' : 'Subscribe'}
          </button>
        </div>

        {/* Action Button Strip */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Like Button */}
          <button
            type="button"
            onClick={() => onToggleLike(video.id)}
            className={`h-8 px-3 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors border ${
              video.isLiked
                ? isDarkMode ? 'bg-rose-950/40 border-rose-800 text-rose-300' : 'bg-rose-50 border-rose-200 text-rose-700'
                : isDarkMode ? 'border-white/10 hover:bg-white/5 text-neutral-300' : 'border-black/10 hover:bg-black/5 text-neutral-700'
            }`}
          >
            <ThumbsUp className={`w-3.5 h-3.5 ${video.isLiked ? 'fill-current' : ''}`} />
            <span>{video.likeCount.toLocaleString()}</span>
          </button>

          {/* Social Share Button */}
          <button
            type="button"
            onClick={onOpenShareModal}
            className={`h-8 px-3 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors border ${
              isDarkMode ? 'border-white/10 hover:bg-white/5 text-neutral-300' : 'border-black/10 hover:bg-black/5 text-neutral-700'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>

          {/* Offline Download Button */}
          <button
            type="button"
            onClick={() => onDownloadVideo(video.id)}
            className={`h-8 px-3 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors border ${
              video.isOffline
                ? isDarkMode ? 'bg-amber-950/40 border-amber-800 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-800'
                : isDarkMode ? 'border-white/10 hover:bg-white/5 text-neutral-300' : 'border-black/10 hover:bg-black/5 text-neutral-700'
            }`}
          >
            {video.isOffline ? <Check className="w-3.5 h-3.5 text-amber-400" /> : <DownloadCloud className="w-3.5 h-3.5" />}
            <span>{video.isOffline ? 'Offline Ready' : 'Download'}</span>
          </button>

          {/* Handoff / Device Sync */}
          <button
            type="button"
            onClick={onOpenDeviceSync}
            className={`h-8 px-3 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors border ${
              isDarkMode ? 'border-white/10 hover:bg-white/5 text-neutral-300' : 'border-black/10 hover:bg-black/5 text-neutral-700'
            }`}
            title="Push or Pull stream to connected devices"
          >
            <Monitor className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Handoff</span>
          </button>

          {/* Comments Toggle */}
          <button
            type="button"
            onClick={() => setShowComments(!showComments)}
            className={`h-8 px-3 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors border ${
              showComments
                ? isDarkMode ? 'bg-white/15 text-white' : 'bg-black/10 text-neutral-900'
                : isDarkMode ? 'border-white/10 hover:bg-white/5 text-neutral-300' : 'border-black/10 hover:bg-black/5 text-neutral-700'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{comments.length}</span>
          </button>
        </div>
      </div>

      {/* Unboxed Metadata (Zero-pill discipline per frontend-design skill) */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400 font-mono">
        <span className="text-neutral-300">{video.views}</span>
        <span aria-hidden="true">·</span>
        <span>Published {video.publishedDate}</span>
        <span aria-hidden="true">·</span>
        <span>{video.category}</span>
        <span aria-hidden="true">·</span>
        <span>{video.resolution}</span>
        <span aria-hidden="true">·</span>
        <span className="text-emerald-400 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" /> Zero Ads
        </span>
      </div>

      {/* Description Pane */}
      <div className={`p-3 rounded-lg text-xs leading-relaxed transition-colors ${
        isDarkMode ? 'bg-white/[0.03] border border-white/[0.06]' : 'bg-black/[0.02] border border-black/[0.06]'
      }`}>
        <p className={`text-neutral-300 ${isDescExpanded ? '' : 'line-clamp-2'}`}>
          {video.description}
        </p>

        {isDescExpanded && (
          <div className="mt-3 pt-2.5 border-t border-white/[0.08] space-y-2">
            <div className="flex flex-wrap gap-2 text-[11px] text-neutral-400">
              {video.tags.map((tag) => (
                <span key={tag} className="hover:text-rose-400 cursor-pointer">
                  #{tag}
                </span>
              ))}
            </div>
            <div className="text-[11px] text-neutral-500 font-mono">
              Assembly Cocoa Stream ID: {video.id} · Bitrate Target: 8.4 Mbps · Audio: 48kHz Stereo
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsDescExpanded(!isDescExpanded)}
          className="mt-1 text-[11px] font-medium text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
        >
          <span>{isDescExpanded ? 'Show less' : 'Show more'}</span>
          {isDescExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Expandable Comments Drawer */}
      {showComments && (
        <div className={`p-3.5 rounded-lg border space-y-3.5 ${
          isDarkMode ? 'bg-[#1a1b20] border-white/10' : 'bg-white border-black/10'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold">Discussion ({comments.length})</span>
            <button
              type="button"
              onClick={() => setShowComments(false)}
              className="text-xs text-neutral-400 hover:text-white"
            >
              Hide
            </button>
          </div>

          {/* Add comment form */}
          <form onSubmit={handleCommentSubmit} className="flex gap-2">
            <input
              type="text"
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder="Add a comment to the discussion..."
              className={`flex-1 h-8 px-3 text-xs rounded-md border outline-none ${
                isDarkMode 
                  ? 'bg-neutral-900 border-white/10 text-white placeholder:text-neutral-500 focus:border-rose-500/50' 
                  : 'bg-neutral-50 border-black/10 text-neutral-900 placeholder:text-neutral-400 focus:border-rose-500/50'
              }`}
            />
            <button
              type="submit"
              disabled={!newCommentText.trim()}
              className="px-3 h-8 rounded-md bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white text-xs font-medium flex items-center gap-1 transition-colors"
            >
              <Send className="w-3 h-3" />
              <span>Post</span>
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
            {comments.map((comm) => (
              <div key={comm.id} className="text-xs space-y-1">
                <div className="flex items-center justify-between text-[11px] text-neutral-400">
                  <span className="font-semibold text-neutral-200">{comm.author}</span>
                  <span>{comm.timeAgo}</span>
                </div>
                <p className="text-neutral-300 leading-normal">{comm.text}</p>
                <div className="flex items-center gap-2 pt-0.5">
                  <button
                    type="button"
                    onClick={() => onToggleLikeComment(comm.id)}
                    className={`text-[10px] flex items-center gap-1 ${
                      comm.isLiked ? 'text-rose-400 font-semibold' : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <ThumbsUp className="w-2.5 h-2.5" />
                    <span>{comm.likes}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
