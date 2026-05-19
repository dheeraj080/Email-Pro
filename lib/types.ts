export interface EmailTemplate {
  id: string;
  name: string;
  subject?: string;
  content?: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Contact {
  id?: string;
  name?: string;
  email: string;
  phoneNo?: string;
  description?: string;
  userId?: string;
  selected?: boolean;
  groups?: ContactGroup[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ContactGroup {
  id?: string;
  name?: string;
  description?: string;
  userId?: string;
  contacts?: Contact[];
  createdAt?: string;
}

export interface EmailRequest {
  to: string[];
  cc?: string[];
  bcc?: string[];
  replyTo?: string;
  subject: string;
  body: string;
}

export interface AnalyticsStats {
  totalSent: number;
  totalDelivered: number;
  totalOpened: number;
  totalClicked: number;
  totalUnsubscribed: number;
  totalBounced: number;
  totalSpamComplaints: number;
  openRate: number;
  clickThroughRate: number;
  clickToOpenRate: number;
  unsubscribeRate: number;
  bounceRate: number;
  deliveryRate: number;
  spamComplaintRate: number;
}

export interface Template extends EmailTemplate {
  code: string; // Alias for content to maintain compatibility with existing frontend
  language?: 'typescript' | 'javascript' | 'html';
}
