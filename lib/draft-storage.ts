/**
 * Draft storage and persistence layer for Email.Pro
 * Provides lightweight, versioned, fail-safe local storage for user email drafts.
 */

export const DRAFT_STORAGE_KEY = 'email-pro:draft:v1';

export interface EmailDraft {
  version: 1;
  templateId: string;
  code: string;
  language: 'typescript' | 'javascript' | 'html';
  updatedAt: number;
}

/**
 * Normalizes code string for comparison (handles CRLF vs LF line endings)
 */
export function normalizeCode(code: string): string {
  return (code || '').replace(/\r\n/g, '\n').trim();
}

/**
 * Checks if current code differs from the baseline template code
 */
export function isCodeDirty(currentCode: string, baselineCode: string): boolean {
  return normalizeCode(currentCode) !== normalizeCode(baselineCode);
}

/**
 * Safely saves a draft to browser localStorage.
 * Catches quota errors or serialization failures without breaking the editor.
 */
export function saveDraft(data: {
  templateId: string;
  code: string;
  language: 'typescript' | 'javascript' | 'html';
}): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const draft: EmailDraft = {
      version: 1,
      templateId: data.templateId,
      code: data.code,
      language: data.language,
      updatedAt: Date.now()
    };
    window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    return true;
  } catch (err) {
    console.warn('[Email.Pro] Failed to save draft to localStorage:', err);
    return false;
  }
}

/**
 * Safely loads and validates a saved draft from localStorage.
 * If corrupt, invalid, or obsolete schema, discards gracefully and returns null.
 */
export function loadDraft(): EmailDraft | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (
      parsed &&
      parsed.version === 1 &&
      typeof parsed.templateId === 'string' &&
      typeof parsed.code === 'string' &&
      typeof parsed.updatedAt === 'number'
    ) {
      return parsed as EmailDraft;
    }

    // Invalid format - remove corrupt entry
    clearDraft();
    return null;
  } catch (err) {
    console.warn('[Email.Pro] Failed to parse draft, clearing corrupt entry:', err);
    clearDraft();
    return null;
  }
}

/**
 * Safely clears the current draft from localStorage
 */
export function clearDraft(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(DRAFT_STORAGE_KEY);
  } catch (err) {
    console.warn('[Email.Pro] Failed to remove draft:', err);
  }
}
