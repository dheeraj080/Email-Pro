const renderCache = new Map<string, string>();

export async function exportToHTML(code: string, language?: string, templateId?: string, templates: any[] = []): Promise<string> {
  const cacheKey = `${language || 'typescript'}:${code}`;
  if (renderCache.has(cacheKey)) {
    return renderCache.get(cacheKey)!;
  }

  // Check localStorage for static preset templates
  if (templateId && typeof window !== 'undefined') {
    const localKey = `email_pro_preview_${templateId}_${code.length}`;
    try {
      const cachedHTML = localStorage.getItem(localKey);
      if (cachedHTML) {
        renderCache.set(cacheKey, cachedHTML);
        return cachedHTML;
      }
    } catch (e) {
      console.warn('Failed to read preview from localStorage:', e);
    }
  }

  try {
    const response = await fetch('/api/render', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ code, language, templates }),
    });

    const text = await response.text();
    
    if (!response.ok) {
      let errorMessage = 'Failed to render email';
      try {
        const errorData = JSON.parse(text);
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
        errorMessage = text || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data = JSON.parse(text);
    
    // Save to localStorage for persistence across app loads
    if (templateId && typeof window !== 'undefined') {
      const localKey = `email_pro_preview_${templateId}_${code.length}`;
      try {
        localStorage.setItem(localKey, data.html);
      } catch (e) {
        console.warn('Failed to save preview to localStorage:', e);
      }
    }

    renderCache.set(cacheKey, data.html);
    
    // Simple cache eviction to prevent memory leak
    if (renderCache.size > 50) {
      const firstKey = renderCache.keys().next().value;
      if (firstKey) renderCache.delete(firstKey);
    }

    return data.html;
  } catch (error: any) {
    console.error('Export error (detailed):', error);
    if (error.message === 'Failed to fetch' || error.message.includes('NetworkError')) {
      throw new Error('Network error: Could not reach the render API. Please ensure the development server is running and reachable.');
    }
    throw error;
  }
}
