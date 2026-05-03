import { exportToHTML } from './render-email';

export interface AccessibilityIssue {
  id: string;
  impact: 'minor' | 'moderate' | 'serious' | 'critical';
  description: string;
  help: string;
  helpUrl: string;
}

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
  accessibilityIssues: AccessibilityIssue[];
  accessibilityScore: number;
}

export const analyzeEmail = async (code: string): Promise<EmailMetrics> => {
  const html = await exportToHTML(code);
  
  // Accessibility check via axe-core
  let accessibilityIssues: AccessibilityIssue[] = [];
  let accessibilityScore = 100;

  if (typeof window !== 'undefined') {
    try {
      const { default: axe } = await import('axe-core');
      
      // Create a hidden container to run axe on
      const container = document.createElement('div');
      container.id = 'axe-temp-container';
      container.style.display = 'none';
      container.innerHTML = html;
      document.body.appendChild(container);

      const results = await axe.run(container, {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'best-practice']
        }
      });

      accessibilityIssues = results.violations.map(v => ({
        id: v.id,
        impact: v.impact as any,
        description: v.description,
        help: v.help,
        helpUrl: v.helpUrl
      }));

      // Basic score calculation: 100 - (count of violations * impact weight)
      const weightMap: any = { minor: 2, moderate: 5, serious: 10, critical: 20 };
      const penalty = results.violations.reduce((acc, v) => acc + (weightMap[v.impact || 'minor'] || 5), 0);
      accessibilityScore = Math.max(0, 100 - penalty);

      document.body.removeChild(container);
    } catch (error) {
      console.error('Axe analysis failed:', error);
    }
  }

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
    estimatedClickRate,
    accessibilityIssues,
    accessibilityScore
  };
};
