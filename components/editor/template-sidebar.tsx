'use client';

import React, { useState } from 'react';
import {
  LayoutGrid,
  ChevronRight,
  Search,
  Check,
  FileCode,
  Plus,
  Trash2
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
  onDeleteTemplate: (templateId: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const TemplateSidebar = React.memo(function TemplateSidebar({
  templates,
  activeTemplate,
  onTemplateChange,
  onCreateTemplate,
  onDeleteTemplate,
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
    <div className="w-64 p-5 space-y-6 shrink-0 overflow-y-auto custom-scrollbar border-r border-neutral-200/50 bg-[#FAFAFA] flex flex-col justify-between h-full">
      <div className="space-y-6">
        <div className="relative">
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-4 h-4 text-neutral-400" />}
            className="h-9.5 bg-white rounded-xl border-neutral-200/60 focus-visible:ring-neutral-200 placeholder-neutral-400 text-xs text-neutral-800 pl-9.5 shadow-2xs"
          />
        </div>

        <section className="space-y-4">
          <div
            className="flex items-center justify-between px-1 cursor-pointer group/header"
            onClick={() => setIsSectionCollapsed(!isSectionCollapsed)}
          >
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: isSectionCollapsed ? 0 : 90 }}
                className="text-neutral-400"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </motion.div>
              <h3 className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Templates</h3>
            </div>

            {/* 
              Removed opacity-0 and group-hover classes so these buttons are always visible.
              The Plus button has the hover background removed as requested.
            */}
            <div className="flex items-center gap-1 transition-all">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCreateTemplate();
                }}
                className="p-1 hover:bg-neutral-200/60 rounded-lg transition-colors text-neutral-400 hover:text-neutral-800"
                title="Templates Catalog"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCreateTemplate();
                }}
                className="p-1 text-neutral-600 transition-colors hover:text-neutral-900"
                title="Create Template"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <AnimatePresence>
            {!isSectionCollapsed && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-1 overflow-hidden"
              >
                {displayTemplates.map((template) => {
                  const isHtml = template.language === 'html';
                  return (
                    <button
                      key={template.id}
                      onClick={() => onTemplateChange(template)}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all group relative border",
                        activeTemplate.id === template.id
                          ? "bg-white border-neutral-200/80 shadow-2xs text-neutral-900 font-bold"
                          : "bg-transparent hover:bg-neutral-200/40 text-neutral-500 hover:text-neutral-800 border-transparent"
                      )}
                    >
                      <div className="relative flex-shrink-0">
                        <FileCode className={cn(
                          "w-4 h-4 transition-colors",
                          activeTemplate.id === template.id
                            ? (isHtml ? "text-amber-500" : "text-indigo-500")
                            : "text-neutral-400 group-hover:text-neutral-600"
                        )} />
                      </div>
                      <div className="flex-1 min-w-0 flex items-baseline justify-between gap-1.5 mr-6">
                        <span className="text-xs truncate">
                          {template.name}
                        </span>
                        <span className="text-[8px] font-mono text-neutral-400/80 uppercase font-black tracking-wider shrink-0 select-none">
                          {isHtml ? '.html' : '.tsx'}
                        </span>
                      </div>
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10">
                        {templates.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm(`Are you sure you want to delete "${template.name}"?`)) {
                                onDeleteTemplate(template.id);
                              }
                            }}
                            className="p-1 rounded-md text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                            title="Delete Template"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                        {activeTemplate.id === template.id && (
                          <div className="text-emerald-500 p-1">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}

                {!searchQuery && filteredTemplates.length > 1 && (
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="w-full text-[9px] font-black text-neutral-400 hover:text-neutral-800 py-2.5 transition-colors uppercase tracking-wider text-center"
                  >
                    {showAll ? 'Show Less' : `View ${filteredTemplates.length - 1} Other Files`}
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>

      <div className="bg-white border border-neutral-200/60 rounded-xl p-3.5 space-y-2.5 shadow-2xs select-none">
        <div className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-wider text-neutral-400">
          <FileCode className="w-3 h-3 text-neutral-400" /> workspace engine
        </div>
        <p className="text-[9px] text-neutral-400/90 font-medium leading-relaxed">
          Files are kept locally. Save changes to trigger automatic compilation checks.
        </p>
      </div>
    </div>
  );
});