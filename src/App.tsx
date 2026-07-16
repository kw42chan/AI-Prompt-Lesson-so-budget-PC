import React, { useState, useEffect } from 'react';
import { PromptTemplate } from './types';
import { PREDEFINED_TEMPLATES } from './templates';
import TemplateList from './components/TemplateList';
import VariableForm from './components/VariableForm';
import PromptPreview from './components/PromptPreview';
import CustomTemplateModal from './components/CustomTemplateModal';
import { 
  Sparkles, 
  Moon, 
  Sun, 
  HelpCircle, 
  BookOpen,
  Monitor,
  CheckCircle,
  Code
} from 'lucide-react';

export default function App() {
  const [customTemplates, setCustomTemplates] = useState<PromptTemplate[]>(() => {
    try {
      const stored = localStorage.getItem('prompt_generator_custom_templates_v2');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Combine predefined with user custom templates
  const allTemplates = [...PREDEFINED_TEMPLATES, ...customTemplates];

  // Default selected template is the first one
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(PREDEFINED_TEMPLATES[0].id);
  const selectedTemplate = allTemplates.find(t => t.id === selectedTemplateId) || PREDEFINED_TEMPLATES[0];

  // Selected template's input variables
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});

  // Modal control
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<PromptTemplate | null>(null);

  // Dark mode state (Default to dark theme for premium studio feel)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('prompt_generator_dark_mode');
      return stored ? JSON.parse(stored) : true;
    } catch {
      return true;
    }
  });

  // Persist dark mode and apply class
  useEffect(() => {
    localStorage.setItem('prompt_generator_dark_mode', JSON.stringify(isDarkMode));
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Persist custom templates
  useEffect(() => {
    localStorage.setItem('prompt_generator_custom_templates_v2', JSON.stringify(customTemplates));
  }, [customTemplates]);

  // When selected template changes, re-populate variable inputs with defaults
  useEffect(() => {
    if (selectedTemplate) {
      const initialValues: Record<string, string> = {};
      selectedTemplate.variables.forEach(v => {
        initialValues[v.key] = v.defaultValue;
      });
      setVariableValues(initialValues);
    }
  }, [selectedTemplateId]);

  // Callback to handle updating specific variables
  const handleVariableChange = (key: string, value: string) => {
    setVariableValues(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Reset variables to original default values
  const handleResetVariables = () => {
    if (selectedTemplate) {
      const resetValues: Record<string, string> = {};
      selectedTemplate.variables.forEach(v => {
        resetValues[v.key] = v.defaultValue;
      });
      setVariableValues(resetValues);
    }
  };

  // Compile final output string
  const compilePromptText = (): string => {
    if (!selectedTemplate) return '';
    let result = selectedTemplate.templateText;
    selectedTemplate.variables.forEach(v => {
      const val = variableValues[v.key] !== undefined ? variableValues[v.key] : v.defaultValue;
      // Escape variable key for safely embedding inside RegEx
      const escapedKey = v.key.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`\\{${escapedKey}\\}`, 'g');
      result = result.replace(regex, val);
    });
    return result;
  };

  // Save new or modified custom template
  const handleSaveCustomTemplate = (template: PromptTemplate) => {
    if (customTemplates.some(t => t.id === template.id)) {
      // Editing existing
      setCustomTemplates(prev => prev.map(t => t.id === template.id ? template : t));
    } else {
      // Creating new
      setCustomTemplates(prev => [...prev, template]);
    }
    // Select the new/updated template immediately
    setSelectedTemplateId(template.id);
  };

  // Delete custom template
  const handleDeleteCustomTemplate = (id: string) => {
    if (confirm('您確定要刪除此自訂提示詞範本嗎？')) {
      setCustomTemplates(prev => prev.filter(t => t.id !== id));
      // If deleted template was active, fall back to the first predefined one
      if (selectedTemplateId === id) {
        setSelectedTemplateId(PREDEFINED_TEMPLATES[0].id);
      }
    }
  };

  // Edit custom template click
  const handleEditCustomTemplateClick = (template: PromptTemplate) => {
    setEditingTemplate(template);
    setIsModalOpen(true);
  };

  // Create new custom template click
  const handleCreateNewClick = () => {
    setEditingTemplate(null);
    setIsModalOpen(true);
  };

  return (
    <div className={`h-screen flex flex-col overflow-hidden bg-[#FBFBFA] dark:bg-[#111110] text-[#1A1A1A] dark:text-[#F9F9F7] transition-colors duration-200`}>
      {/* Top Header */}
      <header className="flex-shrink-0 h-16 bg-[#FBFBFA] dark:bg-[#111110] border-b border-black/10 dark:border-white/10 flex items-center justify-between px-8 z-10">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-[#E33B2E] flex items-center justify-center text-white font-serif font-bold italic text-base">
            P
          </div>
          <div>
            <h1 className="text-base font-serif italic text-black dark:text-white flex items-center gap-2 leading-none">
              <span>結構化提示詞模板工作坊</span>
              <span className="text-[9px] font-mono tracking-widest font-bold bg-[#E33B2E]/10 dark:bg-[#E33B2E]/20 text-[#E33B2E] px-1.5 py-0.5 rounded border border-[#E33B2E]/25">EDITION V2.4</span>
            </h1>
            <p className="text-[10px] text-black/40 dark:text-white/40 mt-1.5 leading-none font-sans font-medium tracking-wide">
              專為大模型、社群行銷及批判分析而設計的提示詞生產中心
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-4">
          {/* Quick tips */}
          <div className="hidden md:flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-black/50 dark:text-white/50 border border-black/10 dark:border-white/10 px-3 py-1 rounded-full">
            <span>Dynamic compilation: active</span>
          </div>

          {/* Theme switcher */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full border border-black/10 dark:border-white/10 text-black/50 dark:text-white/50 hover:bg-black/5 dark:hover:bg-white/5 transition-all"
            title={isDarkMode ? '切換為亮色模式' : '切換為暗色模式'}
            id="theme-toggle-btn"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex min-h-0 overflow-hidden relative">
        <div className="w-full h-full grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Left Panel: Template Explorer (Col: 3) */}
          <div className="md:col-span-4 lg:col-span-3 h-full overflow-hidden border-b md:border-b-0 border-black/10 dark:border-white/10">
            <TemplateList
              templates={allTemplates}
              selectedTemplateId={selectedTemplateId}
              onSelect={(t) => setSelectedTemplateId(t.id)}
              onDeleteCustom={handleDeleteCustomTemplate}
              onEditCustom={handleEditCustomTemplateClick}
              onAddNewClick={handleCreateNewClick}
            />
          </div>

          {/* Middle Panel: Variables Config Form (Col: 4) */}
          <div className="md:col-span-4 lg:col-span-4 h-full overflow-hidden border-b md:border-b-0 border-r border-black/10 dark:border-white/10">
            <VariableForm
              template={selectedTemplate}
              values={variableValues}
              onChange={handleVariableChange}
              onReset={handleResetVariables}
            />
          </div>

          {/* Right Panel: Output & Actions (Col: 5) */}
          <div className="md:col-span-4 lg:col-span-5 h-full overflow-hidden">
            <PromptPreview
              template={selectedTemplate}
              compiledText={compilePromptText()}
            />
          </div>
        </div>
      </div>

      {/* Custom Template Creator/Editor Modal */}
      <CustomTemplateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCustomTemplate}
        editingTemplate={editingTemplate}
      />
    </div>
  );
}
