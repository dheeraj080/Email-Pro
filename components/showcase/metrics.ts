export interface MetricDetails {
  name: string;
  category: 'Curated' | 'Brand Recreation' | 'Barebones';
  readTime: string;
  type: 'official' | 'brand';
  sizeEstimate: string;
  complexity: 'Simple' | 'Medium' | 'Advanced';
  description: string;
}

export const OFFICIAL_REACT_EMAIL_METRICS: Record<string, MetricDetails> = {
  'welcome': {
    name: 'Stripe / Developer Onboarding',
    category: 'Brand Recreation',
    readTime: '1.5m read',
    type: 'brand',
    sizeEstimate: '42.1 KB',
    complexity: 'Medium',
    description: "Clean developers onboarding template based on Stripe's signature aesthetic. Highlight grid layout and sleek button blocks."
  },
  'reset-password': {
    name: 'Notion / Verify Identity',
    category: 'Brand Recreation',
    readTime: '30s read',
    type: 'brand',
    sizeEstimate: '32.8 KB',
    complexity: 'Simple',
    description: 'Security passcode verification layout based on Notion. High readability, minimal style elements.'
  },
  'receipt': {
    name: 'Apple / Store Receipt',
    category: 'Brand Recreation',
    readTime: '1m read',
    type: 'brand',
    sizeEstimate: '65.4 KB',
    complexity: 'Advanced',
    description: 'Double column billing breakdown mockup matching Apple Store purchases. Structured price grids and clean dividing lines.'
  },
  'newsletter': {
    name: 'Newsletter / Matte Theme',
    category: 'Curated',
    readTime: '3m read',
    type: 'official',
    sizeEstimate: '94.2 KB',
    complexity: 'Advanced',
    description: 'Rich publishing template with featured image layouts, columns, and matte cards. Recommended for news and articles.'
  },
  'welcome-v2': {
    name: 'Email.Pro / Welcome Core',
    category: 'Curated',
    readTime: '2m read',
    type: 'official',
    sizeEstimate: '45.0 KB',
    complexity: 'Medium',
    description: 'Our proprietary modern onboarding card. Centered logos, header banner block, and distinct call to actions.'
  },
  'shipping-confirmation': {
    name: 'Nike / Shipping Tracker',
    category: 'Brand Recreation',
    readTime: '1.2m read',
    type: 'brand',
    sizeEstimate: '72.4 KB',
    complexity: 'Advanced',
    description: 'Actionable shipping update template mimicking Nike. Details tracking step indicators and responsive image grid arrays.'
  },
  'tech-summit': {
    name: 'Arcane / Summit RSVP',
    category: 'Curated',
    readTime: '2m read',
    type: 'official',
    sizeEstimate: '81.3 KB',
    complexity: 'Medium',
    description: 'Dark-themed premium event RSVP card. Subtle glow background layers, key details widgets, and inline maps simulation.'
  },
  'legacy-html': {
    name: 'Raw / HTML Boilerplate',
    category: 'Barebones',
    readTime: '1m read',
    type: 'official',
    sizeEstimate: '12.5 KB',
    complexity: 'Simple',
    description: 'Classic nested table email layout using standard clean HTML elements. Zero React compilation required.'
  }
};