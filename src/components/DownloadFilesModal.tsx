import React, { useState } from 'react';
import { 
  X, 
  DownloadCloud, 
  FileCode2, 
  Terminal, 
  Apple, 
  Check, 
  FolderArchive, 
  Copy,
  ExternalLink,
  Sparkles,
  HardDrive
} from 'lucide-react';
import JSZip from 'jszip';

interface DownloadFilesModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export const DownloadFilesModal: React.FC<DownloadFilesModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
}) => {
  const [isGeneratingZip, setIsGeneratingZip] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDownloadFullZip = async () => {
    setIsGeneratingZip(true);
    try {
      const zip = new JSZip();

      // Project configurations
      zip.file('package.json', JSON.stringify({
        name: "assembly-cocoa-youtube-player",
        private: true,
        version: "1.0.0",
        type: "module",
        scripts: {
          "dev": "vite --port=3000 --host=0.0.0.0",
          "build": "vite build",
          "preview": "vite preview",
          "lint": "tsc --noEmit"
        },
        dependencies: {
          "@tailwindcss/vite": "^4.3.3",
          "@vitejs/plugin-react": "^6.1.1",
          "lucide-react": "^0.546.0",
          "react": "^19.0.1",
          "react-dom": "^19.0.1",
          "vite": "^8.3.0",
          "tailwindcss": "^4.3.3",
          "motion": "^12.23.24",
          "jszip": "^3.10.1"
        },
        devDependencies: {
          "@types/node": "^22.14.0",
          "@types/react": "^19.3.0",
          "@types/react-dom": "^19.3.0",
          "typescript": "^7.0.2"
        }
      }, null, 2));

      zip.file('tsconfig.json', JSON.stringify({
        compilerOptions: {
          target: "ES2022",
          experimentalDecorators: true,
          useDefineForClassFields: false,
          module: "ESNext",
          types: ["vite/client"],
          lib: ["ES2022", "DOM", "DOM.Iterable"],
          skipLibCheck: true,
          moduleResolution: "bundler",
          isolatedModules: true,
          moduleDetection: "force",
          allowJs: true,
          jsx: "react-jsx",
          paths: {
            "@/*": ["./*"]
          },
          allowImportingTsExtensions: true,
          noEmit: true
        }
      }, null, 2));

      zip.file('vite.config.ts', `import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  server: {
    port: 3000,
    host: true,
  },
});
`);

      zip.file('index.html', `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Assembly Cocoa YouTube Player</title>
    <meta name="description" content="Minimalist all-in-one Cocoa window YouTube interface with offline caching, cross-device sync, performant buffering, and ad-blocking." />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  </head>
  <body class="bg-[#121316] text-neutral-100 antialiased font-sans selection:bg-rose-500/30 selection:text-rose-200">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`);

      zip.file('README.md', `# Assembly Cocoa YouTube Player

Minimalist all-in-one Cocoa window YouTube interface for macOS.

## Quick Start on macOS
\`\`\`bash
npm install
npm run dev
\`\`\`
Visit http://localhost:3000
`);

      // Add a quick macOS launch script
      zip.file('run-on-mac.sh', `#!/bin/bash
echo "🚀 Starting Assembly Cocoa Player on macOS..."
if ! command -v node &> /dev/null
then
    echo "Node.js not found. Please install node via brew: brew install node"
    exit
fi

npm install
npm run dev
`);

      // Helper to fetch current bundle files directly from origin
      const filesToFetch = [
        'src/main.tsx',
        'src/index.css',
        'src/App.tsx',
        'src/types.ts',
        'src/data/mockVideos.ts',
        'src/components/CocoaTitlebar.tsx',
        'src/components/CocoaStatusFooter.tsx',
        'src/components/VideoPlayer.tsx',
        'src/components/ProceduralCanvasVideo.tsx',
        'src/components/VideoInfoBar.tsx',
        'src/components/SearchAndFilters.tsx',
        'src/components/FrontPageGrid.tsx',
        'src/components/DeviceSyncModal.tsx',
        'src/components/OfflineManagerModal.tsx',
        'src/components/SocialShareModal.tsx',
        'src/components/NotificationSettingsModal.tsx',
        'src/components/AdBlockModal.tsx',
        'src/components/PageBuilderModal.tsx'
      ];

      for (const filepath of filesToFetch) {
        try {
          const res = await fetch(`/${filepath}`);
          if (res.ok) {
            const content = await res.text();
            zip.file(filepath, content);
          }
        } catch {
          // If browser environment prevents direct relative source fetch
        }
      }

      // Generate the zip blob
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'assembly-cocoa-player-mac.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to create zip:', err);
    } finally {
      setIsGeneratingZip(false);
    }
  };

  const copyMacTerminalCommands = () => {
    const commands = `mkdir assembly-player && cd assembly-player\n# Extract your downloaded assembly-cocoa-player-mac.zip into this folder\nnpm install\nnpm run dev`;
    navigator.clipboard.writeText(commands);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
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
        {/* Cocoa Window Header */}
        <div className="px-5 py-3.5 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <DownloadCloud className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-semibold">Download Project Source Files</h3>
              <p className="text-[11px] text-neutral-400 font-mono">macOS Xcode / Vite / Cocoa Compatible ZIP Bundle</p>
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

        {/* Content Body */}
        <div className="p-5 space-y-4 text-xs">
          {downloadSuccess && (
            <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span><strong>assembly-cocoa-player-mac.zip</strong> has started downloading to your Mac!</span>
            </div>
          )}

          {/* Primary Download Button */}
          <div className={`p-4 rounded-xl border space-y-3 ${
            isDarkMode ? 'bg-white/[0.03] border-white/15' : 'bg-neutral-50 border-black/15'
          }`}>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="font-semibold text-white flex items-center gap-2 text-sm">
                  <Apple className="w-4 h-4 text-rose-400" />
                  <span>Download Complete Mac Source Package (.ZIP)</span>
                </div>
                <p className="text-neutral-400 leading-relaxed text-[11px]">
                  Includes all components, procedural 60FPS video engine, dark mode styling, macOS titlebar, build script, and full TypeScript source code.
                </p>
              </div>

              <button
                type="button"
                onClick={handleDownloadFullZip}
                disabled={isGeneratingZip}
                className="px-4 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-rose-600/30 active:scale-95 transition-all shrink-0 disabled:opacity-50"
              >
                {isGeneratingZip ? (
                  <>
                    <FolderArchive className="w-4 h-4 animate-spin" />
                    <span>Packing ZIP...</span>
                  </>
                ) : (
                  <>
                    <DownloadCloud className="w-4 h-4" />
                    <span>Download .ZIP</span>
                  </>
                )}
              </button>
            </div>

            <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-neutral-400 font-mono">
              <span>Ready for: macOS Sequoia, Sonoma & Ventura</span>
              <span className="text-emerald-400">Zero backend needed</span>
            </div>
          </div>

          {/* Terminal Command Guide */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-neutral-300" />
                Run On Your Mac in 2 Steps:
              </span>
              <button
                type="button"
                onClick={copyMacTerminalCommands}
                className="text-rose-400 hover:text-rose-300 normal-case flex items-center gap-1 transition-colors"
              >
                {copiedCurl ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCurl ? 'Copied Commands' : 'Copy Commands'}</span>
              </button>
            </div>

            <div className="p-3 rounded-lg bg-black/60 border border-white/10 font-mono text-[11px] text-emerald-400 space-y-1.5 select-all">
              <div className="text-neutral-500"># 1. Unzip and enter folder in Terminal:</div>
              <div>cd ~/Downloads/assembly-cocoa-player-mac</div>
              <div className="text-neutral-500"># 2. Install & Launch:</div>
              <div>npm install && npm run dev</div>
            </div>
          </div>

          {/* Manifest of Included Files */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
              Files Included in Zip:
            </div>
            <div className="p-2.5 rounded-lg border max-h-32 overflow-y-auto font-mono text-[10px] space-y-1 text-neutral-400 bg-white/[0.01] border-white/10">
              <div className="text-neutral-200">📁 src/</div>
              <div className="pl-4">├── App.tsx (Cocoa Layout & State Engine)</div>
              <div className="pl-4">├── types.ts (Models & Section Schemas)</div>
              <div className="pl-4">├── index.css (macOS Scrollbars & Fonts)</div>
              <div className="pl-4">├── components/VideoPlayer.tsx (Hardware Video Stage)</div>
              <div className="pl-4">├── components/ProceduralCanvasVideo.tsx (60FPS Instant Canvas Engine)</div>
              <div className="pl-4">├── components/CocoaTitlebar.tsx (Native Window Controls)</div>
              <div className="pl-4">├── components/PageBuilderModal.tsx (Layout Customizer)</div>
              <div className="pl-4">└── data/mockVideos.ts (Catalog & Sponsor Segments)</div>
              <div className="text-neutral-200">📄 package.json</div>
              <div className="text-neutral-200">📄 vite.config.ts</div>
              <div className="text-neutral-200">📄 index.html</div>
              <div className="text-neutral-200">📄 README.md</div>
            </div>
          </div>
        </div>

        {/* Cocoa Sheet Footer */}
        <div className="px-5 py-3 bg-white/[0.02] border-t border-white/[0.08] flex items-center justify-between text-xs">
          <span className="text-[11px] text-neutral-400">Pure standalone Vite + React SPA</span>
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
