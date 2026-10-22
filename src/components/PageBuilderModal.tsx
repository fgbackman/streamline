import React, { useState } from 'react';
import { 
  X, 
  Layers, 
  Eye, 
  EyeOff, 
  Plus, 
  RotateCcw, 
  Check, 
  ArrowUp, 
  ArrowDown, 
  Sliders, 
  Sparkles,
  Video as VideoIcon,
  Tv,
  ListOrdered,
  Gauge
} from 'lucide-react';
import { PageSectionConfig, PageSectionId, CustomVideoInput } from '../types';

interface PageBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  sections: PageSectionConfig[];
  onToggleSection: (id: PageSectionId) => void;
  onMoveSection: (id: PageSectionId, direction: 'up' | 'down') => void;
  onResetSections: () => void;
  onAddCustomVideo: (video: CustomVideoInput) => void;
  isDarkMode: boolean;
}

export const PageBuilderModal: React.FC<PageBuilderModalProps> = ({
  isOpen,
  onClose,
  sections,
  onToggleSection,
  onMoveSection,
  onResetSections,
  onAddCustomVideo,
  isDarkMode,
}) => {
  const [activeTab, setActiveTab] = useState<'layout' | 'addVideo'>('layout');

  // Add custom video form state
  const [newTitle, setNewTitle] = useState('');
  const [newChannel, setNewChannel] = useState('');
  const [newCategory, setNewCategory] = useState<CustomVideoInput['category']>('Tech');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [addedToast, setAddedToast] = useState(false);

  if (!isOpen) return null;

  const handleCreateVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddCustomVideo({
      title: newTitle.trim(),
      channel: newChannel.trim() || 'Custom Channel',
      category: newCategory,
      videoUrl: newVideoUrl.trim() || 'procedural',
      description: newDescription.trim() || 'User custom stream integrated into Assembly Cocoa Stage.'
    });

    setAddedToast(true);
    setTimeout(() => {
      setAddedToast(false);
      onClose();
    }, 1500);

    setNewTitle('');
    setNewChannel('');
    setNewVideoUrl('');
    setNewDescription('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className={`w-full max-w-xl rounded-xl border shadow-2xl overflow-hidden transition-all ${
          isDarkMode 
            ? 'bg-[#18191e] border-white/15 text-neutral-100' 
            : 'bg-white border-black/15 text-neutral-900'
        }`}
      >
        {/* Cocoa Header */}
        <div className="px-5 py-3.5 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-semibold">Assembly Page Builder & Studio</h3>
              <p className="text-[11px] text-neutral-400 font-mono">Customize Viewport Modules & Inject Custom Streams</p>
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
            onClick={() => setActiveTab('layout')}
            className={`pb-2 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'layout' ? 'border-rose-500 text-rose-400 font-semibold' : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span>Show / Hide Page Modules ({sections.filter(s => s.visible).length}/{sections.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('addVideo')}
            className={`pb-2 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'addVideo' ? 'border-rose-500 text-rose-400 font-semibold' : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom Stream / Video</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 max-h-[460px] overflow-y-auto space-y-4">
          {addedToast && (
            <div className="p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Video successfully added to stage & feed!</span>
            </div>
          )}

          {activeTab === 'layout' ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[11px] text-neutral-400">
                <span>Toggle switches to show or hide any element of the interface.</span>
                <button
                  type="button"
                  onClick={onResetSections}
                  className="hover:text-rose-400 flex items-center gap-1 font-mono transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Defaults</span>
                </button>
              </div>

              {/* Module list */}
              <div className="space-y-2">
                {sections.map((sec, idx) => (
                  <div
                    key={sec.id}
                    className={`p-3 rounded-lg border flex items-center justify-between gap-3 text-xs transition-colors ${
                      sec.visible
                        ? isDarkMode ? 'bg-white/[0.03] border-white/15' : 'bg-neutral-50 border-black/15 shadow-sm'
                        : isDarkMode ? 'bg-white/[0.01] border-white/5 opacity-50' : 'bg-neutral-100 border-black/5 opacity-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        type="button"
                        onClick={() => onToggleSection(sec.id)}
                        className={`p-1.5 rounded-md transition-colors ${
                          sec.visible 
                            ? 'bg-rose-500/20 text-rose-400' 
                            : 'bg-neutral-800 text-neutral-500'
                        }`}
                        title={sec.visible ? 'Hide section' : 'Show section'}
                      >
                        {sec.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>

                      <div className="min-w-0">
                        <div className="font-semibold text-white flex items-center gap-2">
                          <span>{sec.label}</span>
                          {!sec.visible && (
                            <span className="text-[10px] font-mono text-neutral-500 uppercase">Hidden</span>
                          )}
                        </div>
                        <div className="text-[11px] text-neutral-400 truncate">
                          {sec.description}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => onMoveSection(sec.id, 'up')}
                        disabled={idx === 0}
                        className="p-1 rounded text-neutral-400 hover:text-white disabled:opacity-20 transition-opacity"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onMoveSection(sec.id, 'down')}
                        disabled={idx === sections.length - 1}
                        className="p-1 rounded text-neutral-400 hover:text-white disabled:opacity-20 transition-opacity"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Add Custom Video Form */
            <form onSubmit={handleCreateVideo} className="space-y-3.5 text-xs">
              <div className="p-3 rounded-lg bg-sky-950/20 border border-sky-500/30 text-sky-300 space-y-1">
                <div className="font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Ultra-Fast Instant Playback
                </div>
                <p className="text-[11px] text-sky-200/80 leading-relaxed">
                  Paste any YouTube URL, MP4 link, or leave blank to generate an instant zero-latency 60FPS procedural hardware stream!
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                  Video Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Next-Gen Assembly Microkernel Architecture"
                  className={`w-full h-8 px-3 rounded-md border outline-none ${
                    isDarkMode ? 'bg-neutral-900 border-white/10 text-white focus:border-rose-500' : 'bg-neutral-50 border-black/10 text-neutral-900 focus:border-rose-500'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                    Channel / Creator
                  </label>
                  <input
                    type="text"
                    value={newChannel}
                    onChange={(e) => setNewChannel(e.target.value)}
                    placeholder="e.g. SiliconCraft"
                    className={`w-full h-8 px-3 rounded-md border outline-none ${
                      isDarkMode ? 'bg-neutral-900 border-white/10 text-white focus:border-rose-500' : 'bg-neutral-50 border-black/10 text-neutral-900 focus:border-rose-500'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className={`w-full h-8 px-2.5 rounded-md border outline-none ${
                      isDarkMode ? 'bg-neutral-900 border-white/10 text-white focus:border-rose-500' : 'bg-neutral-50 border-black/10 text-neutral-900 focus:border-rose-500'
                    }`}
                  >
                    <option value="Tech">Tech</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Space">Space</option>
                    <option value="Ambient">Ambient</option>
                    <option value="Science">Science</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                  Video URL or YouTube Link (Optional)
                </label>
                <input
                  type="text"
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=... or direct MP4 link (or leave empty for procedural stream)"
                  className={`w-full h-8 px-3 font-mono text-[11px] rounded-md border outline-none ${
                    isDarkMode ? 'bg-neutral-900 border-white/10 text-white focus:border-rose-500' : 'bg-neutral-50 border-black/10 text-neutral-900 focus:border-rose-500'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Brief synopsis or stream notes..."
                  className={`w-full p-2 text-xs rounded-md border outline-none resize-none ${
                    isDarkMode ? 'bg-neutral-900 border-white/10 text-white focus:border-rose-500' : 'bg-neutral-50 border-black/10 text-neutral-900 focus:border-rose-500'
                  }`}
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-md bg-rose-600 hover:bg-rose-500 text-white font-medium flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to Assembly Stage</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-white/[0.02] border-t border-white/[0.08] flex items-center justify-between text-xs">
          <span className="text-[11px] text-neutral-400">Settings save automatically to browser storage</span>
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
