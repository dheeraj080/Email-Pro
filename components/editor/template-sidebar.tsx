'use client';

import React, { useState } from 'react';
import {
  ChevronRight,
  Search,
  Check,
  Plus,
  Trash2,
  Folder,
  FolderDown,
  FolderInput,
  Mail,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { Template } from '@/lib/types';

interface FolderNode {
  name: string;
  path: string;
  templates: Template[];
  subfolders: Record<string, FolderNode>;
}

interface TemplateSidebarProps {
  templates: Template[];
  activeTemplate: Template;
  onTemplateChange: (template: Template) => void;
  onCreateTemplate: () => void;
  onDeleteTemplate: (templateId: string) => void;
  onDownloadWorkspace: () => Promise<void>;
  onMoveTemplate: (templateId: string, folderName: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const TemplateSidebar = React.memo(function TemplateSidebar({
  templates,
  activeTemplate,
  onTemplateChange,
  onCreateTemplate,
  onDeleteTemplate,
  onDownloadWorkspace,
  onMoveTemplate,
  isCollapsed,
  onToggleCollapse
}: TemplateSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedFolders, setCollapsedFolders] = useState<Record<string, boolean>>({});

  // Auto-expand folder path up to active template on mount/change
  React.useEffect(() => {
    if (activeTemplate.folder) {
      const parts = activeTemplate.folder.split('/');
      const pathsToExpand: Record<string, boolean> = {};
      let currentPath = '';
      parts.forEach(part => {
        currentPath = currentPath ? `${currentPath}/${part}` : part;
        pathsToExpand[currentPath] = false; // false means expanded
      });
      setCollapsedFolders(prev => ({
        ...prev,
        ...pathsToExpand
      }));
    }
  }, [activeTemplate.id, activeTemplate.folder]);

  const toggleFolder = (folderName: string) => {
    setCollapsedFolders(prev => ({
      ...prev,
      [folderName]: !prev[folderName]
    }));
  };

  const filteredTemplates = templates.filter(t =>
    t.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper to count templates recursively in a folder node
  const countTemplates = (node: FolderNode): number => {
    let count = node.templates.length;
    Object.values(node.subfolders).forEach(sub => {
      count += countTemplates(sub);
    });
    return count;
  };

  // Build the recursive folder node tree structure
  const templateTree = React.useMemo(() => {
    const root: FolderNode = { name: 'Root', path: '', templates: [], subfolders: {} };
    
    filteredTemplates.forEach(t => {
      if (!t.folder) {
        root.templates.push(t);
        return;
      }
      
      const parts = t.folder.split('/');
      let current = root;
      let currentPath = '';
      
      parts.forEach((part, index) => {
        currentPath = currentPath ? `${currentPath}/${part}` : part;
        if (!current.subfolders[part]) {
          current.subfolders[part] = {
            name: part,
            path: currentPath,
            templates: [],
            subfolders: {}
          };
        }
        current = current.subfolders[part];
        if (index === parts.length - 1) {
          current.templates.push(t);
        }
      });
    });
    
    return root;
  }, [filteredTemplates]);

  if (isCollapsed) return null;

  const renderTemplateRow = (template: Template) => {
    const isHtml = template.language === 'html';
    const isActive = activeTemplate.id === template.id;

    return (
      <div
        key={template.id}
        onClick={() => onTemplateChange(template)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onTemplateChange(template);
          }
        }}
        role="button"
        tabIndex={0}
        className={cn(
          "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors group relative cursor-pointer select-none border",
          isActive
            ? "bg-accent-muted border-accent-border text-fg font-medium"
            : "border-transparent hover:bg-surface-hover text-fg-secondary hover:text-fg"
        )}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {isActive ? (
            <Mail className="w-3.5 h-3.5 text-accent shrink-0" />
          ) : (
            <Mail className="w-3.5 h-3.5 text-fg-muted shrink-0 group-hover:text-fg-secondary transition-colors" />
          )}
          <span className="text-xs truncate">
            {template.name}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          <span className="text-[10px] font-mono text-fg-muted lowercase opacity-70 group-hover:opacity-100 transition-opacity">
            {isHtml ? 'html' : 'tsx'}
          </span>

          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const newFolder = window.prompt(
                  `Move "${template.name}" to folder (e.g. Transactional/Auth, or blank for Root):`,
                  template.folder || ""
                );
                if (newFolder !== null) {
                  onMoveTemplate(template.id, newFolder);
                }
              }}
              className="p-1 rounded text-fg-muted hover:text-fg hover:bg-surface-elevated transition-colors"
              title="Move to folder"
            >
              <FolderInput className="w-3 h-3" />
            </button>
            {templates.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm(`Delete "${template.name}"?`)) {
                    onDeleteTemplate(template.id);
                  }
                }}
                className="p-1 rounded text-fg-muted hover:text-danger hover:bg-danger-bg transition-colors"
                title="Delete template"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderFolderNode = (node: FolderNode, depth = 0) => {
    const isRoot = node.path === '';
    const isFolderCollapsed = collapsedFolders[node.path] === true;
    const sortedSubfolders = Object.values(node.subfolders).sort((a, b) => a.name.localeCompare(b.name));
    
    if (isRoot) {
      return (
        <div key="root-folder" className="space-y-1">
          {sortedSubfolders.map(subnode => renderFolderNode(subnode, depth))}
          
          {node.templates.length > 0 && (
            <div className="space-y-0.5 pt-1">
              {sortedSubfolders.length > 0 && (
                <div className="px-2.5 py-1 text-[10px] font-medium text-fg-muted uppercase tracking-wider">
                  Root
                </div>
              )}
              {node.templates.map(template => renderTemplateRow(template))}
            </div>
          )}
        </div>
      );
    }
    
    return (
      <div key={node.path} className="space-y-0.5">
        <button
          type="button"
          onClick={() => toggleFolder(node.path)}
          className="w-full flex items-center justify-between px-2 py-1 rounded-md text-fg-secondary hover:text-fg hover:bg-surface-hover text-left transition-colors"
        >
          <div className="flex items-center gap-1.5 min-w-0">
            <Folder className="w-3.5 h-3.5 text-fg-muted shrink-0" />
            <span className="text-xs font-medium text-fg-secondary truncate">
              {node.name}
            </span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-[10px] text-fg-muted font-mono">
              {countTemplates(node)}
            </span>
            <ChevronRight className={cn("w-3 h-3 transition-transform text-fg-muted", !isFolderCollapsed && "rotate-90")} />
          </div>
        </button>
        
        <AnimatePresence>
          {!isFolderCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="pl-3 ml-2 border-l border-border-subtle space-y-0.5 overflow-hidden"
            >
              {sortedSubfolders.map(subnode => renderFolderNode(subnode, depth + 1))}
              {node.templates.map(template => renderTemplateRow(template))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-backdrop z-30 md:hidden backdrop-blur-xs"
        onClick={onToggleCollapse}
        aria-hidden="true"
      />

      <aside className="w-60 md:w-56 lg:w-60 shrink-0 border-r border-border-base bg-surface flex flex-col justify-between h-full text-fg select-none z-40 md:static fixed inset-y-0 left-0 shadow-2xl md:shadow-none transition-colors">
        {/* Top: Library Search & Action */}
        <div className="p-3 space-y-3 flex-1 overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between pb-1 md:hidden">
            <span className="text-xs font-semibold text-fg">Template Library</span>
            <button
              type="button"
              onClick={onToggleCollapse}
              className="p-1 rounded text-fg-muted hover:text-fg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-fg-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-8 bg-surface-raised hover:bg-surface-hover focus:bg-surface-elevated border border-border-subtle focus:border-border-strong rounded-lg text-xs text-fg placeholder:text-fg-muted pl-8 pr-2.5 outline-none transition-colors"
              />
            </div>

            <button
              type="button"
              onClick={onCreateTemplate}
              className="w-full flex items-center justify-center gap-1.5 h-8 px-2.5 rounded-lg bg-surface-raised hover:bg-surface-hover border border-border-base text-xs font-medium text-fg transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-accent" />
              <span>New Email</span>
            </button>
          </div>

          <div className="pt-2">
            <div className="flex items-center justify-between px-1 mb-1.5">
              <span className="text-[11px] font-medium text-fg-muted">
                Templates
              </span>
              <span className="text-[10px] text-fg-muted font-mono">
                {templates.length}
              </span>
            </div>

            <div className="space-y-1">
              {renderFolderNode(templateTree)}
            </div>
          </div>
        </div>

        {/* Footer: Workspace Archive */}
        <div className="p-3 border-t border-border-base shrink-0">
          <button
            type="button"
            onClick={onDownloadWorkspace}
            className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-fg-muted hover:text-fg hover:bg-surface-hover rounded-lg transition-colors"
            title="Download Workspace Archive (.zip)"
          >
            <FolderDown className="w-3.5 h-3.5 text-fg-muted" />
            <span className="truncate">Download Workspace (.zip)</span>
          </button>
        </div>
      </aside>
    </>
  );
});