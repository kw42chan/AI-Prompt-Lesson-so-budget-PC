import React, { useState, useEffect } from 'react';
import { PromptTemplate, VariableConfig } from '../types';
import { X, Sparkles, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CustomTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: PromptTemplate) => void;
  editingTemplate?: PromptTemplate | null;
}

export default function CustomTemplateModal({
  isOpen,
  onClose,
  onSave,
  editingTemplate
}: CustomTemplateModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('custom');
  const [templateText, setTemplateText] = useState('');
  const [variables, setVariables] = useState<VariableConfig[]>([]);
  const [error, setError] = useState('');

  // When editing, populate existing template values
  useEffect(() => {
    if (editingTemplate) {
      setTitle(editingTemplate.title);
      setDescription(editingTemplate.description);
      setCategory(editingTemplate.category);
      setTemplateText(editingTemplate.templateText);
      setVariables(editingTemplate.variables);
    } else {
      setTitle('');
      setDescription('');
      setCategory('custom');
      setTemplateText('');
      setVariables([]);
    }
    setError('');
  }, [editingTemplate, isOpen]);

  // Automatically detect placeholders in templateText
  useEffect(() => {
    if (editingTemplate) return; // Skip auto-overwriting variables when editing an existing template

    const placeholderRegex = /\{([^}]+)\}/g;
    const matches: string[] = [];
    let match;
    while ((match = placeholderRegex.exec(templateText)) !== null) {
      if (!matches.includes(match[1])) {
        matches.push(match[1]);
      }
    }

    // Map matches to VariableConfig
    const updatedVars = matches.map(m => {
      const existing = variables.find(v => v.key === m);
      return existing || {
        key: m,
        label: m,
        type: 'textarea' as const,
        defaultValue: ''
      };
    });

    setVariables(updatedVars);
  }, [templateText]);

  const handleVariableChange = (key: string, field: keyof VariableConfig, value: string) => {
    setVariables(prev =>
      prev.map(v => (v.key === key ? { ...v, [field]: value } : v))
    );
  };

  const handleSave = () => {
    if (!title.trim()) {
      setError('請輸入範本名稱');
      return;
    }
    if (!templateText.trim()) {
      setError('請輸入提示詞範本內容');
      return;
    }

    const finalVariables = variables.length > 0 ? variables : [];

    const newTemplate: PromptTemplate = {
      id: editingTemplate?.id || `custom-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || '自訂提示詞範本',
      category: category,
      templateText: templateText,
      variables: finalVariables,
      isCustom: true
    };

    onSave(newTemplate);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl bg-[#FBFBFA] dark:bg-[#111110] border border-black/10 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] font-sans text-black dark:text-white"
          id="custom-template-modal"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-black/10 dark:border-white/10 bg-[#F5F5F2] dark:bg-[#151514]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#E33B2E]" />
              <h2 className="text-lg font-serif italic text-black dark:text-white">
                {editingTemplate ? '編輯自訂範本' : '新增自訂提示詞範本'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white transition"
              id="close-modal-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-8 space-y-6">
            {error && (
              <div className="flex items-center gap-2 p-4 bg-[#E33B2E]/10 border border-[#E33B2E]/20 text-[#E33B2E] text-xs font-semibold uppercase tracking-wider rounded-lg">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Title */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-black/60 dark:text-white/60">
                範本名稱 <span className="text-[#E33B2E] font-bold">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="例如：高轉化 IG 貼文範本"
                className="w-full px-4 py-3 border border-black/10 dark:border-white/10 rounded-xl bg-white dark:bg-[#1E1E1D] text-black dark:text-white placeholder:italic placeholder:text-black/30 dark:placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-[#E33B2E] focus:border-[#E33B2E] transition-all"
                id="template-title-input"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-black/60 dark:text-white/60">
                簡短描述
              </label>
              <input
                type="text"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="簡述此範本的適用場景或目的"
                className="w-full px-4 py-3 border border-black/10 dark:border-white/10 rounded-xl bg-white dark:bg-[#1E1E1D] text-black dark:text-white placeholder:italic placeholder:text-black/30 dark:placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-[#E33B2E] focus:border-[#E33B2E] transition-all"
                id="template-desc-input"
              />
            </div>

            {/* Category selection */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-black/60 dark:text-white/60">
                範本分類
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {[
                  { value: 'custom', label: '自訂範本' },
                  { value: 'structural', label: '結構性' },
                  { value: 'copywriting', label: '文案撰寫' },
                  { value: 'seo', label: 'SEO優化' },
                  { value: 'critical', label: '批判思考' },
                  { value: 'image', label: '影像生成' }
                ].map(cat => {
                  const isSelected = category === cat.value;
                  return (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setCategory(cat.value)}
                      className={`px-3 py-2.5 border text-xs rounded-xl transition-all duration-200 font-bold uppercase tracking-wider ${
                        isSelected
                          ? 'border-[#E33B2E] bg-[#E33B2E]/10 text-[#E33B2E]'
                          : 'border-black/10 dark:border-white/10 bg-transparent text-black/60 dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Template raw text */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-black/60 dark:text-white/60">
                  提示詞範本內容 <span className="text-[#E33B2E] font-bold">*</span>
                </label>
                <span className="text-[10px] text-black/40 dark:text-white/40 font-mono">
                  使用 <code className="px-1.5 py-0.5 bg-black/5 dark:bg-white/5 rounded text-[#E33B2E] font-bold">{"{KEY}"}</code> 定義變數
                </span>
              </div>
              <textarea
                value={templateText}
                onChange={e => setTemplateText(e.target.value)}
                placeholder={`例如：\n你是一位{角色}，專門為{目標群體}撰寫精美的文案。\n\n主題是：{主題}\n語氣要求：{語氣}`}
                rows={6}
                className="w-full px-4 py-3 border border-black/10 dark:border-white/10 rounded-xl bg-white dark:bg-[#1E1E1D] text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-[#E33B2E] focus:border-[#E33B2E] font-mono text-xs leading-relaxed transition-all resize-none"
                id="template-text-input"
              />
            </div>

            {/* Variable Configurations dynamic list */}
            {variables.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-black/10 dark:border-white/10">
                <h3 className="text-xs font-bold uppercase tracking-widest text-black/80 dark:text-white/80">
                  動態欄位設定 ({variables.length})
                </h3>
                <div className="space-y-3">
                  {variables.map((v) => (
                    <div
                      key={v.key}
                      className="p-4 bg-black/5 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5 space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[10px] font-mono bg-[#E33B2E]/10 text-[#E33B2E] px-2 py-0.5 rounded-md font-bold">
                          {"{"}
                          {v.key}
                          {"}"}
                        </span>
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-black/50 dark:text-white/50 cursor-pointer">
                            <input
                              type="radio"
                              name={`type-${v.key}`}
                              checked={v.type === 'text'}
                              onChange={() => handleVariableChange(v.key, 'type', 'text')}
                              className="text-[#E33B2E] focus:ring-[#E33B2E]"
                            />
                            <span>單行</span>
                          </label>
                          <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-black/50 dark:text-white/50 cursor-pointer">
                            <input
                              type="radio"
                              name={`type-${v.key}`}
                              checked={v.type === 'textarea'}
                              onChange={() => handleVariableChange(v.key, 'type', 'textarea')}
                              className="text-[#E33B2E] focus:ring-[#E33B2E]"
                            />
                            <span>多行</span>
                          </label>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <input
                            type="text"
                            value={v.label}
                            onChange={e => handleVariableChange(v.key, 'label', e.target.value)}
                            placeholder="欄位顯示名稱 (標籤)"
                            className="w-full px-3 py-2 text-xs border border-black/10 dark:border-white/10 rounded-lg bg-white dark:bg-[#1E1E1D] text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-[#E33B2E]"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            value={v.defaultValue}
                            onChange={e => handleVariableChange(v.key, 'defaultValue', e.target.value)}
                            placeholder="預設填寫內容 (選填)"
                            className="w-full px-3 py-2 text-xs border border-black/10 dark:border-white/10 rounded-lg bg-white dark:bg-[#1E1E1D] text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-[#E33B2E]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer actions */}
          <div className="px-8 py-4 border-t border-black/10 dark:border-white/10 bg-[#F5F5F2] dark:bg-[#151514] flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 border border-black/20 dark:border-white/20 hover:border-black dark:hover:border-white text-xs font-bold uppercase tracking-widest text-black/70 dark:text-white/70 rounded-full transition-all duration-200"
              id="cancel-modal-btn"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-black hover:bg-[#E33B2E] dark:bg-white dark:hover:bg-[#E33B2E] text-white dark:text-black dark:hover:text-white text-xs font-bold uppercase tracking-widest rounded-full transition-all duration-200 shadow-sm flex items-center gap-1.5"
              id="save-template-btn"
            >
              <Check className="w-4 h-4" />
              <span>儲存範本</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
