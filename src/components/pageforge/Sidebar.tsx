'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Palette,
  Puzzle,
  FolderOpen,
  BookOpen,
  ImageIcon,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export type NavItem = 'dashboard' | 'create-theme' | 'create-pages' | 'create-plugin' | 'my-projects' | 'templates' | 'medios' | 'settings';

interface SidebarProps {
  activeItem: NavItem;
  onNavigate: (item: NavItem) => void;
  isOpen: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

interface NavItemDef {
  id: NavItem;
  label: string;
  icon: React.ElementType;
  description: string;
  group: string;
  parent?: NavItem;
}

const navItems: NavItemDef[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Vista general', group: 'Principal' },
  { id: 'create-theme', label: 'Crear Theme', icon: Palette, description: 'Generador de themes WP', group: 'Crear' },
  { id: 'create-pages', label: 'Páginas', icon: FileText, description: 'Gestión de páginas', group: 'Crear', parent: 'create-theme' },
  { id: 'create-plugin', label: 'Crear Plugin', icon: Puzzle, description: 'Generador de plugins WP', group: 'Crear' },
  { id: 'my-projects', label: 'Mis Proyectos', icon: FolderOpen, description: 'Proyectos guardados', group: 'Gestión' },
  { id: 'templates', label: 'Template Library', icon: BookOpen, description: 'Templates preconstruidos', group: 'Gestión' },
  { id: 'medios', label: 'Medios', icon: ImageIcon, description: 'Biblioteca de medios', group: 'Gestión' },
  { id: 'settings', label: 'Configuracion', icon: Settings, description: 'Ajustes de cuenta', group: 'Sistema' },
];

// Breadcrumb map
export const BREADCRUMBS: Record<NavItem, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Vista general' },
  'create-theme': { title: 'Crear WordPress Theme', subtitle: 'Editor visual de temas' },
  'create-plugin': { title: 'Crear WordPress Plugin', subtitle: 'Generador de plugins' },
  'create-pages': { title: 'Páginas', subtitle: 'Gestión de páginas del theme' },
  'my-projects': { title: 'Mis Proyectos', subtitle: 'Proyectos guardados' },
  templates: { title: 'Template Library', subtitle: 'Templates preconstruidos' },
  medios: { title: 'Biblioteca de Medios', subtitle: 'Gestión de imágenes y archivos' },
  settings: { title: 'Configuracion', subtitle: 'Ajustes de cuenta' },
};

export function Sidebar({ activeItem, onNavigate, isOpen, onClose, collapsed, onToggleCollapse }: SidebarProps) {
  const [expandedParent, setExpandedParent] = React.useState<string | null>(
    activeItem === 'create-pages' ? 'create-theme' : null
  );

  React.useEffect(() => {
    // Auto-expand parent when child is active
    const childItem = navItems.find(n => n.id === activeItem && n.parent);
    if (childItem?.parent) setExpandedParent(childItem.parent);
  }, [activeItem]);

  const groups = React.useMemo(() => {
    const map: Record<string, typeof navItems> = {};
    for (const item of navItems) {
      if (item.parent) continue; // skip children, they render under parent
      if (!map[item.group]) map[item.group] = [];
      map[item.group].push(item);
    }
    return Object.entries(map);
  }, []);

  const childrenOf = React.useCallback((parentId: NavItem) => {
    return navItems.filter(n => n.parent === parentId);
  }, []);

  const toggleParent = (id: NavItem) => {
    setExpandedParent(prev => prev === id ? null : id);
  };

  const isParentExpanded = (id: NavItem) => {
    return expandedParent === id;
  };

  const isChildActive = (parentId: NavItem) => {
    return navItems.some(n => n.parent === parentId && n.id === activeItem);
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full flex flex-col transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        style={{ backgroundColor: '#1B4332', width: collapsed ? '64px' : '260px', minWidth: collapsed ? '64px' : '260px' }}
      >
        {/* Logo area + collapse button top-right */}
        <div className="flex items-center justify-between p-4 h-16">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            {!collapsed && (
              <div className="animate-in fade-in duration-200">
                <h1 className="text-white font-bold text-base tracking-tight leading-none whitespace-nowrap">
                  PageForge
                </h1>
                <span className="text-emerald-300/70 text-[10px] font-medium uppercase tracking-widest">
                  v2.0
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1">
            {/* Collapse toggle — top-right corner, desktop only */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleCollapse}
              className="hidden lg:flex text-white/50 hover:text-white hover:bg-white/10 h-7 w-7 rounded-md transition-colors"
              title={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white/60 hover:text-white hover:bg-white/10 h-8 w-8"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator className="bg-white/10" />

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          {groups.map(([group, items], gi) => (
            <div key={group} className={cn(gi > 0 && 'mt-5')}>
              {!collapsed && (
                <p className="text-emerald-400/50 text-[10px] font-semibold uppercase tracking-wider px-3 mb-2">
                  {group}
                </p>
              )}
              <div className="space-y-0.5">
                {items.map((item) => {
                  const isActive = activeItem === item.id;
                  const children = childrenOf(item.id);
                  const hasChildren = children.length > 0;
                  const expanded = isParentExpanded(item.id);
                  const childActive = isChildActive(item.id);
                  const Icon = item.icon;

                  if (hasChildren && !collapsed) {
                    return (
                      <div key={item.id}>
                        <button
                          onClick={() => {
                            // If clicking the parent itself, navigate to it
                            onNavigate(item.id);
                            onClose();
                          }}
                          className="w-full flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-200 group px-3 py-2"
                          style={{
                            backgroundColor: (isActive || childActive) ? 'rgba(255,255,255,0.15)' : 'transparent',
                            color: (isActive || childActive) ? '#FFFFFF' : 'rgba(255,255,255,0.7)',
                          }}
                          onMouseEnter={(e) => {
                            if (!isActive && !childActive) {
                              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
                              e.currentTarget.style.color = '#FFFFFF';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isActive && !childActive) {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                            }
                          }}
                        >
                          <Icon className="h-[18px] w-[18px] flex-shrink-0 transition-colors duration-200"
                            style={{ color: (isActive || childActive) ? '#34D399' : 'rgba(255,255,255,0.5)' }}
                          />
                          <span className="flex-1 text-left">{item.label}</span>
                          <span
                            role="button"
                            tabIndex={-1}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleParent(item.id);
                            }}
                            className="p-0.5 rounded hover:bg-white/10 transition-colors cursor-pointer"
                          >
                            <ChevronDown
                              className="h-3.5 w-3.5 transition-transform duration-200"
                              style={{
                                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                color: (isActive || childActive) ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.4)',
                              }}
                            />
                          </span>
                        </button>
                        <AnimatePresence>
                          {expanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="ml-6 mt-1 space-y-0.5 border-l border-white/10 pl-3">
                                {children.map((child) => {
                                  const childIsActive = activeItem === child.id;
                                  const ChildIcon = child.icon;
                                  return (
                                    <button
                                      key={child.id}
                                      onClick={() => {
                                        onNavigate(child.id);
                                        onClose();
                                      }}
                                      className={cn(
                                        'w-full flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-200 group',
                                        'px-3 py-1.5',
                                        childIsActive
                                          ? 'bg-white/15 text-white shadow-sm'
                                          : 'text-white/60 hover:bg-white/8 hover:text-white'
                                      )}
                                    >
                                      <ChildIcon
                                        className={cn(
                                          'h-4 w-4 flex-shrink-0 transition-colors duration-200',
                                          childIsActive ? 'text-emerald-400' : 'text-white/40 group-hover:text-white/80'
                                        )}
                                      />
                                      <span className="flex-1 text-left text-[13px]">{child.label}</span>
                                      {childIsActive && (
                                        <motion.div
                                          layoutId="activeIndicator"
                                          className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                        />
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (hasChildren && collapsed) {
                          toggleParent(item.id);
                        } else {
                          onNavigate(item.id);
                          onClose();
                        }
                      }}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        'w-full flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-200 group',
                        collapsed ? 'px-0 py-2 justify-center' : 'px-3 py-2',
                        isActive || (childActive && collapsed)
                          ? 'bg-white/15 text-white shadow-sm'
                          : 'text-white/70 hover:bg-white/8 hover:text-white'
                      )}
                    >
                      <Icon
                        className={cn(
                          'h-[18px] w-[18px] flex-shrink-0 transition-colors duration-200',
                          isActive || (childActive && collapsed) ? 'text-emerald-400' : 'text-white/50 group-hover:text-white/80'
                        )}
                      />
                      {!collapsed && <span className="flex-1 text-left">{item.label}</span>}
                      {!collapsed && isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <Separator className="bg-white/10" />

        {/* Bottom section */}
        <div className="p-4">
          {!collapsed && (
            <div className="rounded-lg bg-white/8 p-3 border border-white/10">
              <p className="text-white/80 text-xs font-semibold">WordPress Generator</p>
              <p className="text-white/50 text-[11px] mt-1 leading-relaxed">
                Genera themes y plugins de WordPress sin codigo
              </p>
              <div className="mt-3 flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 text-[11px] font-medium">Online</span>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

/* TopBar that works with the Sidebar */
export function Topbar({ activeItem, onToggleSidebar }: { activeItem: NavItem; onToggleSidebar: () => void }) {
  const breadcrumb = BREADCRUMBS[activeItem] || BREADCRUMBS.dashboard;

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between h-14 px-4 md:px-6 border-b border-white/10 shadow-sm"
      style={{ backgroundColor: '#1a1a1a' }}
    >
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-white/80 hover:text-white hover:bg-white/10 h-9 w-9"
          onClick={onToggleSidebar}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="hidden sm:flex items-center gap-2">
          <h2 className="text-white font-semibold text-sm">{breadcrumb.title}</h2>
          <span className="text-white/40 text-xs">/</span>
          <span className="text-white/60 text-xs">{breadcrumb.subtitle}</span>
        </div>
        <div className="sm:hidden">
          <h2 className="text-white font-semibold text-sm">{breadcrumb.title}</h2>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/8 border border-white/10">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-white/70 text-xs font-medium">WordPress Generator</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center cursor-pointer hover:bg-emerald-500 transition-colors">
          <span className="text-white text-xs font-bold">U</span>
        </div>
      </div>
    </header>
  );
}
