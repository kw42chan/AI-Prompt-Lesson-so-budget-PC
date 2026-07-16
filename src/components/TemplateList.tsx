import React, { useState } from 'react';
import { PromptTemplate, CategoryType } from '../types';
import { 
  Search, 
  Trash2, 
  Edit, 
  Plus, 
  Sparkles, 
  HelpCircle 
} from 'lucide-react';

interface TemplateListProps {
  templates: PromptTemplate[];
  selectedTemplateId: string;
  onSelect: (template: PromptTemplate) => void;
  onDeleteCustom: (id: string) => void;
  onEditCustom: (template: PromptTemplate) => void;
  onAddNewClick: () => void;
}

export default function TemplateList({
  templates,
  selectedTemplateId,
  onSelect,
  onDeleteCustom,
  onEditCustom,
  onAddNewClick
}: TemplateListProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');

  const categories: { value: CategoryType; label: string }[] = [
    { value: 'all', label: '全部' },
    { value: 'structural', label: '結構性' },
    { value: 'copywriting', label: '文案' },
    { value: 'seo', label: 'SEO' },
    { value: 'critical', label: '批判' },
    { value: 'image', label: '影像' },
    { value: 'custom', label: '自訂' }
  ];

  // Filtering logic
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = 
      template.title.toLowerCase().includes(search.toLowerCase()) ||
      template.description.toLowerCase().includes(search.toLowerCase());
    
    if (selectedCategory === 'all') return matchesSearch;
    if (selectedCategory === 'custom') return matchesSearch && template.isCustom;
    return matchesSearch && template.category === selectedCategory;
  });

  return (
    <div className="flex flex-col h-full bg-[#F5F5F2] dark:bg-[#151514] border-r border-black/10 dark:border-white/10 font-sans">
      {/* Search Header */}
      <div className="p-6 space-y-4 border-b border-black/10 dark:border-white/10">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">INDEX EXPLORER</div>
          <div className="relative flex items-center">
            <Search className="absolute left-0 w-3.5 h-3.5 text-black/40 dark:text-white/40" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="搜尋提示詞範本..."
              className="w-full pl-6 bg-transparent border-b border-black/20 dark:border-white/20 focus:border-[#E33B2E] dark:focus:border-[#E33B2E] text-sm py-1.5 focus:outline-none placeholder:italic placeholder:opacity-40 text-black dark:text-white transition-colors"
              id="template-search-input"
            />
          </div>
        </div>

        <button
          onClick={onAddNewClick}
          className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-black hover:bg-[#E33B2E] dark:bg-white dark:hover:bg-[#E33B2E] text-white dark:text-black dark:hover:text-white text-xs font-bold uppercase tracking-widest rounded-full transition-all duration-200 shadow-sm"
          id="add-custom-btn"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>創建自訂範本</span>
        </button>
      </div>

      {/* Category Pills (Horizontal scrollable) */}
      <div className="px-5 py-2.5 border-b border-black/10 dark:border-white/10 overflow-x-auto flex gap-1 scrollbar-none">
        {categories.map(cat => {
          const isSelected = selectedCategory === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest transition-all duration-200 border-b-2 whitespace-nowrap ${
                isSelected
                  ? 'border-[#E33B2E] text-[#E33B2E]'
                  : 'border-transparent text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white'
              }`}
              id={`category-${cat.value}`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Templates List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {filteredTemplates.length > 0 ? (
          <div>
            <div className="text-[10px] font-bold text-[#E33B2E] uppercase tracking-widest mb-3 px-2">
              {selectedCategory === 'all' ? 'Core Catalog' : `${selectedCategory} category`}
            </div>
            
            <div className="space-y-1">
              {filteredTemplates.map((template, index) => {
                const isSelected = template.id === selectedTemplateId;
                const formattedIndex = String(index + 1).padStart(2, '0');
                
                return (
                  <div
                    key={template.id}
                    onClick={() => onSelect(template)}
                    className={`group relative flex flex-col p-3 rounded-xl cursor-pointer transition-all duration-250 border ${
                      isSelected
                        ? 'bg-white dark:bg-[#1E1E1D] border-black/10 dark:border-white/15 shadow-sm'
                        : 'bg-transparent border-transparent hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                    id={`template-item-${template.id}`}
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex gap-3 min-w-0">
                        {/* Elegant monospaced index */}
                        <span className={`text-[10px] font-mono mt-1 ${
                          isSelected ? 'text-[#E33B2E] font-bold' : 'text-black/30 dark:text-white/30'
                        }`}>
                          [{formattedIndex}]
                        </span>

                        <div className="min-w-0">
                          <h4 className={`text-base font-serif italic leading-snug transition-colors ${
                            isSelected 
                              ? 'text-[#E33B2E] font-medium' 
                              : 'text-black dark:text-white group-hover:text-black/80 dark:group-hover:text-white/85'
                          }`}>
                            {template.title}
                          </h4>
                          <p className="text-[11px] text-black/50 dark:text-white/40 line-clamp-1 mt-1 leading-normal">
                            {template.description}
                          </p>
                        </div>
                      </div>

                      {template.isCustom && (
                        <span className="text-[9px] font-mono tracking-widest uppercase bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/30 px-1.5 py-0.5 rounded-md font-bold flex-shrink-0">
                          User
                        </span>
                      )}
                    </div>

                    {/* Custom Edit / Delete actions */}
                    {template.isCustom && (
                      <div className="absolute right-2 bottom-2 flex items-center gap-1 bg-white/95 dark:bg-[#1E1E1D]/95 backdrop-blur-sm p-1 rounded-md border border-black/10 dark:border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditCustom(template);
                          }}
                          className="p-1 rounded text-black/60 dark:text-white/60 hover:text-[#E33B2E] dark:hover:text-[#E33B2E] hover:bg-black/5 dark:hover:bg-white/5 transition"
                          title="編輯範本"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteCustom(template.id);
                          }}
                          className="p-1 rounded text-black/60 dark:text-white/60 hover:text-[#E33B2E] dark:hover:text-[#E33B2E] hover:bg-black/5 dark:hover:bg-white/5 transition"
                          title="刪除範本"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-black/40 dark:text-white/40 space-y-2">
            <HelpCircle className="w-7 h-7 stroke-1" />
            <span className="text-xs tracking-wider uppercase font-mono">No Results Found</span>
          </div>
        )}
      </div>
    </div>
  );
}
