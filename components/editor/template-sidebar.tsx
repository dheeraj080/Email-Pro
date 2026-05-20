'use client';

import React, { useState } from 'react';
import { 
  FilePlus2, 
  LayoutGrid, 
  ChevronRight,
  Search,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { Template } from '@/lib/types';
import { Input } from '@/components/ui/input';

interface TemplateSidebarProps {
  templates: Template[];
  activeTemplate: Template;
  onTemplateChange: (template: Template) => void;
  onCreateTemplate: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const TemplateSidebar = React.memo(function TemplateSidebar({ 
  templates, 
  activeTemplate, 
  onTemplateChange, 
  onCreateTemplate, 
  isCollapsed, 
}: TemplateSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSectionCollapsed, setIsSectionCollapsed] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const filteredTemplates = templates.filter(t => 
    t.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayTemplates = (searchQuery || showAll) 
    ? filteredTemplates 
    : filteredTemplates.filter(t => t.id === activeTemplate.id);

  if (isCollapsed) return null;

  return (
    <div className="w-64 p-5 space-y-8 shrink-0 overflow-y-auto custom-scrollbar border-r border-ink-black-100 bg-white">
      <Input 
        placeholder="Filter templates..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        icon={<Search className="w-4 h-4" />}
        className="h-10 shadow-sm"
      />

      <section className="space-y-5">
        <div 
          className="flex items-center justify-between px-1 cursor-pointer group/header"
          onClick={() => setIsSectionCollapsed(!isSectionCollapsed)}
        >
          <div className="flex items-center gap-2">
            <motion.div 
              animate={{ rotate: isSectionCollapsed ? 0 : 90 }}
              className="text-ink-black-300"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </motion.div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-black-400">Campaign Templates</h3>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover/header:opacity-100 transition-all">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onCreateTemplate();
              }}
              className="p-1.5 hover:bg-alabaster-grey-200 rounded-xl transition-colors text-ink-black-400 hover:text-ink-black-900"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onCreateTemplate();
              }}
              className="p-1.5 hover:bg-alabaster-grey-200 rounded-xl transition-colors text-powder-blue-600"
            >
              <FilePlus2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        
        <AnimatePresence>
          {!isSectionCollapsed && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-1.5 overflow-hidden"
            >
              {displayTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => onTemplateChange(template)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left transition-all group relative",
                    activeTemplate.id === template.id 
                      ? "bg-white border-ink-black-100 shadow-[0_4px_12px_rgba(0,0,0,0.03)] border" 
                      : "hover:bg-alabaster-grey-100 text-ink-black-600 border border-transparent"
                  )}
                >
                  <div className="relative flex-shrink-0">
                    <div className={cn(
                      "w-2.5 h-2.5 rounded-full transition-all border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.05)]",
                      activeTemplate.id === template.id ? "bg-powder-blue-500 scale-110" : "bg-ink-black-100 group-hover:bg-ink-black-200"
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={cn(
                      "text-xs font-bold truncate transition-colors",
                      activeTemplate.id === template.id ? "text-ink-black-900" : "text-ink-black-500 group-hover:text-ink-black-700"
                    )}>
                      {template.name}
                    </div>
                  </div>
                  <div className={cn(
                    "transition-all duration-300",
                    activeTemplate.id === template.id ? "text-powder-blue-500 opacity-100 scale-100" : "opacity-0 scale-50 group-hover:opacity-30 group-hover:scale-75"
                  )}>
                    <Check className="w-3.5 h-3.5" />
                  </div>
                </button>
              ))}

              {!searchQuery && filteredTemplates.length > 1 && (
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="w-full text-[10px] font-bold text-ink-black-400 hover:text-ink-black-900 py-2 transition-colors uppercase tracking-wider mt-2"
                >
                  {showAll ? 'Show Less' : `View ${filteredTemplates.length - 1} Other Templates`}
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
});
