import React, { useState, useEffect } from 'react';
import { PromptTemplate } from '../types';
import { 
  Copy, 
  Check, 
  Download, 
  Edit3, 
  Eye, 
  Info,
  Layers
} from 'lucide-react';

interface PromptPreviewProps {
  template: PromptTemplate;
  compiledText: string;
}

export default function PromptPreview({
  template,
  compiledText
}: PromptPreviewProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isEditingDirectly, setIsEditingDirectly] = useState(false);
  const [directText, setDirectText] = useState('');

  // Sync directText with compiledText whenever compiledText or template changes,
  // unless we are in the middle of active direct editing.
  useEffect(() => {
    setDirectText(compiledText);
  }, [compiledText]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(directText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([directText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    
    // Create clean file name based on template title
    const sanitizedTitle = template.title
      .replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, "_")
      .slice(0, 30);
    element.download = `prompt_${sanitizedTitle || 'template'}.txt`;
    
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const charCount = directText.length;
  const wordCount = directText.trim() ? directText.trim().split(/\s+/).length : 0;

  return (
    <div className="flex flex-col h-full bg-[#1A1A1A] text-[#F9F9F7] border-l border-white/10 font-sans">
      {/* Panel Header */}
      <div className="px-8 py-6 border-b border-white/10 flex items-center justify-between flex-shrink-0">
        <div>
          <h3 className="text-xs font-bold tracking-[0.2em] text-[#E33B2E] flex items-center gap-2 uppercase font-mono">
            <Layers className="w-3.5 h-3.5" />
            <span>Output Console</span>
          </h3>
          <p className="text-[11px] text-[#F9F9F7]/50 mt-1 font-sans">
            即時生成最終提示詞。可手動微調並一鍵複製。
          </p>
        </div>

        {/* Word Counts */}
        <div className="flex items-center gap-3 text-[10px] font-mono text-[#F9F9F7]/60 bg-transparent border border-white/15 px-3 py-1.5 rounded-md">
          <div>
            WORDS: <span className="text-white font-bold">{wordCount}</span>
          </div>
          <div className="w-px h-3 bg-white/10" />
          <div>
            CHARS: <span className="text-white font-bold">{charCount}</span>
          </div>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="flex-1 p-8 overflow-hidden flex flex-col min-h-0 relative">
        <div className="flex items-center justify-between mb-3 flex-shrink-0">
          <span className="text-[10px] font-medium text-[#F9F9F7]/60 flex items-center gap-1.5 italic">
            <Info className="w-3.5 h-3.5 text-[#E33B2E]" />
            {isEditingDirectly 
              ? '自由編輯模式：可直接在下方編輯框修改內容' 
              : '動態預覽模式：隨欄位同步，隨時點擊右側進行編輯'
            }
          </span>

          <button
            onClick={() => setIsEditingDirectly(!isEditingDirectly)}
            className={`flex items-center gap-1.5 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider border rounded-full transition-all duration-200 ${
              isEditingDirectly
                ? 'bg-white border-white text-black'
                : 'bg-transparent border-white/20 text-[#F9F9F7]/80 hover:border-white hover:text-white'
            }`}
            id="toggle-edit-mode-btn"
          >
            {isEditingDirectly ? (
              <>
                <Eye className="w-3 h-3" />
                <span>Preview</span>
              </>
            ) : (
              <>
                <Edit3 className="w-3 h-3" />
                <span>Edit Ink</span>
              </>
            )}
          </button>
        </div>

        {/* Text Container */}
        <div className="flex-1 min-h-0 bg-[#111110] rounded-2xl border border-white/10 p-5 font-mono text-sm leading-relaxed overflow-hidden flex flex-col">
          {isEditingDirectly ? (
            <textarea
              value={directText}
              onChange={(e) => setDirectText(e.target.value)}
              className="w-full flex-1 bg-transparent text-[#F9F9F7]/90 placeholder:text-white/20 focus:outline-none resize-none font-mono text-xs leading-relaxed overflow-y-auto scrollbar-none"
              id="prompt-direct-textarea"
            />
          ) : (
            <div className="flex-1 overflow-y-auto whitespace-pre-wrap text-[#F9F9F7]/90 text-xs leading-relaxed select-text pr-2 scrollbar-none" id="prompt-preview-text">
              {directText || (
                <span className="text-white/30 italic">在左側填寫欄位後，此處將自動生成對應的提示詞。</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Copy / Export Buttons Footer */}
      <div className="p-8 border-t border-white/10 bg-[#141413]/40 flex items-center gap-3 flex-shrink-0">
        <button
          onClick={handleDownload}
          disabled={!directText.trim()}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-transparent hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed text-[#F9F9F7]/80 hover:text-white text-xs font-bold uppercase tracking-widest rounded-full border border-white/20 hover:border-white transition-all duration-200"
          id="download-prompt-btn"
        >
          <Download className="w-3.5 h-3.5" />
          <span>下載 .txt</span>
        </button>

        <button
          onClick={handleCopy}
          disabled={!directText.trim()}
          className={`flex-[2] flex items-center justify-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-widest rounded-full transition-all duration-200 ${
            isCopied
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-[#E33B2E] hover:bg-[#E33B2E]/90 disabled:opacity-30 disabled:cursor-not-allowed text-white'
          }`}
          id="copy-prompt-btn"
        >
          {isCopied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>複製成功！</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>複製提示詞</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
