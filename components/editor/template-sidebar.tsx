'use client';

import React, { useState } from 'react';
import {
  LayoutGrid,
  ChevronRight,
  Search,
  Check,
  FileCode,
  Plus,
  Trash2,
  Folder,
  FolderDown,
  FolderInput
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { Template } from '@/lib/types';
import { Input } from '@/components/ui/input';

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
}: TemplateSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSectionCollapsed, setIsSectionCollapsed] = useState(false);
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
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              const newFolder = window.prompt(
                `Enter folder path to move "${template.name}" to (e.g. Transactional/Auth, leave blank to move to Root):`,
                template.folder || ""
              );
              if (newFolder !== null) {
                onMoveTemplate(template.id, newFolder);
              }
            }}
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/50 transition-all"
            title="Move Template to Folder"
          >
            <FolderInput className="w-3 h-3" />
          </button>
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
  };

  const renderFolderNode = (node: FolderNode, depth = 0) => {
    const isRoot = node.path === '';
    const isCollapsed = collapsedFolders[node.path] === true;
    
    const sortedSubfolders = Object.values(node.subfolders).sort((a, b) => a.name.localeCompare(b.name));
    
    if (isRoot) {
      return (
        <div key="root-folder" className="space-y-3">
          {/* Render subfolders first */}
          {sortedSubfolders.map(subnode => renderFolderNode(subnode, depth))}
          
          {/* Render root templates */}
          {node.templates.length > 0 && (
            <div className="space-y-1 pt-1">
              {sortedSubfolders.length > 0 && (
                <div className="px-2 py-1.5 text-[8px] font-black uppercase tracking-widest text-neutral-400">
                  Root Files
                </div>
              )}
              {node.templates.map(template => renderTemplateRow(template))}
            </div>
          )}
        </div>
      );
    }
    
    return (
      <div key={node.path} className="space-y-1">
        <button
          onClick={() => toggleFolder(node.path)}
          className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/20 text-left transition-all"
        >
          <div className="flex items-center gap-2">
            <Folder className="w-3.5 h-3.5 text-neutral-400 fill-neutral-400/10" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
              {node.name}
            </span>
            <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-neutral-200/50 text-neutral-500 font-mono">
              {countTemplates(node)}
            </span>
          </div>
          <ChevronRight className={cn("w-3 h-3 transition-transform text-neutral-400", !isCollapsed && "rotate-90")} />
        </button>
        
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="pl-2 border-l border-neutral-200/50 ml-3.5 space-y-1 overflow-hidden"
            >
              {/* Recursively render child subfolders */}
              {sortedSubfolders.map(subnode => renderFolderNode(subnode, depth + 1))}
              
              {/* Render templates in this folder */}
              {node.templates.map(template => renderTemplateRow(template))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

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

            <div className="flex items-center gap-1 transition-all">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDownloadWorkspace();
                }}
                className="p-1 hover:bg-neutral-200/60 rounded-lg transition-colors text-neutral-400 hover:text-neutral-800"
                title="Download Workspace Folders (.zip)"
              >
                <FolderDown className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
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
                className="space-y-3 overflow-hidden"
              >
                {renderFolderNode(templateTree)}
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
          Files are organized into directories. Export the workspace to download folders.
        </p>
      </div>
    </div>
  );
});