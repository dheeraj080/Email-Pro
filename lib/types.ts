export interface Template {
  id: string;
  name: string;
  code: string;
  language?: 'typescript' | 'javascript' | 'html';
}
