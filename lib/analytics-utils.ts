import { exportToHTML } from './render-email';

export interface EmailMetrics {
  sizeKb: number;
  linesOfCode: number;
  complexityScore: number;
  linkCount: number;
  imageCount: number;
  spamRisk: 'low' | 'medium' | 'high';
  readabilityScore: number;
  estimatedOpenRate: number;
  estimatedClickRate: number;
}

export const analyzeEmail = async (code: string): Promise<EmailMetrics> => {
  const html = await exportToHTML(code);
  
  // Size calculation
  const bytes = new TextEncoder().encode(html).length;
  const sizeKb = parseFloat((bytes / 1024).toFixed(2));
  
  // Basic content analysis
  const linesOfCode = code.split('\n').length;
  const linkCount = (html.match(/<a\s/g) || []).length;
  const imageCount = (html.match(/<img\s/g) || []).length;
  
  // Complexity score (arbitrary logic)
  const tagCount = (html.match(/<[a-z0-9]+/gi) || []).length;
  const complexityScore = Math.min(100, Math.round((tagCount / 50) * 100));
  
  // Mock spam risk analysis
  const spamKeywords = ['free', 'money', 'guaranteed', 'win', 'urgent', '!!!'];
  const spamMatches = spamKeywords.filter(word => html.toLowerCase().includes(word)).length;
  let spamRisk: 'low' | 'medium' | 'high' = 'low';
  if (spamMatches > 3) spamRisk = 'high';
  else if (spamMatches > 1) spamRisk = 'medium';
  
  // Readability (mocked)
  const readabilityScore = Math.max(0, 100 - (complexityScore / 2));
  
  // Performance-based estimates (mocked)
  const estimatedOpenRate = Math.max(15, 45 - (spamMatches * 5));
  const estimatedClickRate = Math.max(1, 10 - (complexityScore / 20));

  return {
    sizeKb,
    linesOfCode,
    complexityScore,
    linkCount,
    imageCount,
    spamRisk,
    readabilityScore,
    estimatedOpenRate,
    estimatedClickRate
  };
};
