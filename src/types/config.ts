export interface Configuration {
  id: string;
  key: string;
  value: string;
  type: 'URL' | 'TEXT' | 'NUMBER' | 'BOOLEAN' | 'JSON';
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConfigurationInput {
  key: string;
  value: string;
  type: 'URL' | 'TEXT' | 'NUMBER' | 'BOOLEAN' | 'JSON';
  description?: string;
}