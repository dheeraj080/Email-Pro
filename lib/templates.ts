import { Template } from './types';
import { welcomeTemplate } from './templates/welcome';
import { resetPasswordTemplate } from './templates/reset-password';
import { receiptTemplate } from './templates/receipt';
import { newsletterTemplate } from './templates/newsletter';
import { welcomeV2Template } from './templates/welcome-v2';
import { shippingConfirmationTemplate } from './templates/shipping-confirmation';
import { techSummitTemplate } from './templates/tech-summit';
import { legacyHtmlTemplate } from './templates/legacy-html';

export const DEFAULT_TEMPLATE = welcomeTemplate;

export const TEMPLATES: Template[] = [
  {
    id: 'welcome',
    name: 'Welcome Email',
    code: welcomeTemplate,
    language: 'typescript',
    folder: 'Transactional'
  },
  {
    id: 'reset-password',
    name: 'Reset Password',
    code: resetPasswordTemplate,
    language: 'typescript',
    folder: 'Transactional'
  },
  {
    id: 'receipt',
    name: 'Order Receipt',
    code: receiptTemplate,
    language: 'typescript',
    folder: 'Transactional'
  },
  {
    id: 'newsletter',
    name: 'Weekly Newsletter',
    code: newsletterTemplate,
    language: 'typescript',
    folder: 'Marketing'
  },
  {
    id: 'welcome-v2',
    name: 'Resend Welcome',
    code: welcomeV2Template,
    language: 'typescript',
    folder: 'System'
  },
  {
    id: 'shipping-confirmation',
    name: 'Order Shipped & Tracking',
    code: shippingConfirmationTemplate,
    language: 'typescript',
    folder: 'Transactional'
  },
  {
    id: 'tech-summit',
    name: 'Tech Summit RSVP',
    code: techSummitTemplate,
    language: 'typescript',
    folder: 'Marketing'
  },
  {
    id: 'legacy-html',
    name: 'Plain HTML Template',
    code: legacyHtmlTemplate,
    language: 'html',
    folder: 'System'
  }
];
