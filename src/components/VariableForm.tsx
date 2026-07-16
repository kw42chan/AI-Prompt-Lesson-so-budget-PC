import React from 'react';
import { PromptTemplate } from '../types';
import { RefreshCw, Sparkles } from 'lucide-react';

interface VariableFormProps {
  template: PromptTemplate;
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  onReset: () => void;
}

export default function VariableForm({
  template,
  values,
  onChange,
  onReset
}: VariableFormProps) {
  const hasVariables = template.variables && template.variables.length > 0;

  return (
    <div className="flex flex-col h-full bg-[#FBFBFA] dark:bg-[#111110] font-sans">
      {/* Form Header */}
      <div className="px-8 py-6 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
        <div>
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#E33B2E] italic">
              {template.category === 'structural' && 'Structure Matrix'}
              {template.category === 'copywriting' && 'Copywriter Draft'}
              {template.category === 'seo' && 'SEO Optimizer'}
              {template.category === 'critical' && 'Critical Inquiry'}
              {template.category === 'image' && 'Visual Architecture'}
              {template.category === 'custom' && 'User Custom Form'}
            </span>
          </div>
          <h3 className="text-xl font-serif italic text-black dark:text-white mt-1">
            配置變數欄位
          </h3>
        </div>

        {hasVariables && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-black/50 hover:text-[#E33B2E] dark:text-white/50 dark:hover:text-[#E33B2E] transition-colors"
            title="重設所有欄位為預設值"
            id="reset-form-btn"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Inputs List */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        {hasVariables ? (
          <div className="space-y-6">
            {template.variables.map((variable, index) => {
              const currentValue = values[variable.key] !== undefined ? values[variable.key] : '';
              const formattedIndex = String(index + 1).padStart(2, '0');
              
              return (
                <div key={variable.key} className="space-y-2" id={`field-group-${variable.key}`}>
                  <div className="flex justify-between items-center">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-black/60 dark:text-white/60">
                      {variable.label || variable.key}
                    </label>
                    <span className="text-[9px] font-mono text-black/30 dark:text-white/30">
                      [{formattedIndex}]
                    </span>
                  </div>
                  
                  {variable.type === 'textarea' ? (
                    <textarea
                      value={currentValue}
                      onChange={e => onChange(variable.key, e.target.value)}
                      placeholder={`請輸入${variable.label || variable.key}...`}
                      rows={5}
                      className="w-full px-4 py-3 text-sm border border-black/10 dark:border-white/10 rounded-xl bg-white dark:bg-[#1E1E1D] text-black dark:text-white placeholder:italic placeholder:text-black/30 dark:placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-[#E33B2E] focus:border-[#E33B2E] transition-all resize-none leading-relaxed"
                    />
                  ) : (
                    <input
                      type="text"
                      value={currentValue}
                      onChange={e => onChange(variable.key, e.target.value)}
                      placeholder={`請輸入${variable.label || variable.key}...`}
                      className="w-full px-4 py-3 text-sm border border-black/10 dark:border-white/10 rounded-xl bg-white dark:bg-[#1E1E1D] text-black dark:text-white placeholder:italic placeholder:text-black/30 dark:placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-[#E33B2E] focus:border-[#E33B2E] transition-all"
                    />
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-black/40 dark:text-white/40 space-y-3">
            <Sparkles className="w-8 h-8 stroke-1 text-[#E33B2E]" />
            <h4 className="text-sm font-serif italic text-black dark:text-white">此範本無須配置動態欄位</h4>
            <p className="text-[11px] text-black/50 dark:text-white/40 max-w-[220px] text-center leading-normal">
              此提示詞範本為固定內容，您可以直接在右側進行預覽與複製。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
