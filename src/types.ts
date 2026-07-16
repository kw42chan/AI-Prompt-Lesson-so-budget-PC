export interface VariableConfig {
  key: string;
  label: string;
  type: 'text' | 'textarea';
  defaultValue: string;
}

export interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  templateText: string;
  variables: VariableConfig[];
  isCustom?: boolean;
}

export type CategoryType = 'all' | 'structural' | 'copywriting' | 'seo' | 'critical' | 'image' | 'custom';
