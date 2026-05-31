'use client';

import { useState } from 'react';
import { useBuilderStore } from '@/lib/builder-store';
import type { BuilderPage } from '@/lib/builder-types';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Flame,
  LayoutDashboard,
  LayoutTemplate,
  Palette,
  ChevronRight,
  Menu,
  LogOut,
  Eye,
  Edit3,
  User,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// Navigation Config
// ─────────────────────────────────────────────────────────────

interface NavItem {
  key: BuilderPage;
  label: string;
  icon: React.ReactNode;
  requiresCurrentPage?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="size-5" /> },
  { key: 'templates', label: 'Templates', icon: <LayoutTemplate className="size-5" /> },
  { key: 'editor', label: 'Editor', icon: <Edit3 className="size-5" />, requiresCurrentPage: true },
  { key: 'theme', label: 'Theme', icon: <Palette className="size-5" />, requiresCurrentPage: true },
];

const PAGE_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  templates: 'Templates',
  editor: 'Editor',
  theme: 'Theme',
  preview: 'Preview',
};

// ─────────────────────────────────────────────────────────────
// Sidebar Content (shared between desktop & mobile)
// ─────────────────────────────────────────────────────────────

interface SidebarContentProps {
  activePage: BuilderPage;
  currentPage: { name: string } | null;
  onNavigate: (page: BuilderPage) => void;
  onPreview: () => void;
  onLogout: () => void;
}

function SidebarContent({ activePage, currentPage, onNavigate, onPreview, onLogout }: SidebarContentProps) {
  const isActive = (key: BuilderPage) => activePage === key;

  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/10">
        <div className="flex size-9 items-center justify-center rounded-lg bg-white/15">
          <Flame className="size-5 text-white" />
        </div>
        <span className="text-lg font-bold tracking-tight text-white">PageForge</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1" aria-label="Navegación principal">
        {NAV_ITEMS.map((item) => {
          // Hide items that require a current page if none is selected
          if (item.requiresCurrentPage && !currentPage) return null;

          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/80 transition-colors"
              style={{
                backgroundColor: isActive(item.key) ? 'rgba(255,255,255,0.15)' : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (!isActive(item.key)) {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.key)) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              {item.icon}
              <span>{item.label}</span>
              {isActive(item.key) && (
                <div className="ml-auto size-1.5 rounded-full bg-emerald-400" />
              )}
            </button>
          );
        })}

        {/* Current page indicator when editing */}
        {currentPage && (activePage === 'editor' || activePage === 'theme') && (
          <div className="mx-2 mt-2 flex items-center gap-2 rounded-md bg-white/5 px-3 py-2">
            <Edit3 className="size-3.5 text-emerald-400" />
            <span className="text-xs text-white/60 truncate">{currentPage.name}</span>
            <Badge
              variant="secondary"
              className="ml-auto bg-white/20 text-[10px] px-1.5 py-0 text-white border-0"
            >
              Editing
            </Badge>
          </div>
        )}
      </nav>

      {/* Bottom Actions */}
      <div className="border-t border-white/10 px-3 py-4 space-y-2">
        {/* Live Preview Button */}
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-white/80 hover:bg-white/10 hover:text-white"
          onClick={onPreview}
        >
          <Eye className="size-4" />
          <span className="text-sm">View Live Preview</span>
        </Button>

        {/* Logout / Back to Dashboard */}
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-white/50 hover:bg-white/8 hover:text-white/80"
          onClick={onLogout}
        >
          <LogOut className="size-4" />
          <span className="text-sm">Back to Dashboard</span>
        </Button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Top Bar
// ─────────────────────────────────────────────────────────────

interface TopBarProps {
  activePage: BuilderPage;
  currentPage: { name: string } | null;
  onToggleSidebar: () => void;
}

function TopBar({ activePage, currentPage, onToggleSidebar }: TopBarProps) {
  const getBreadcrumbLabel = () => {
    if ((activePage === 'editor' || activePage === 'theme') && currentPage) {
      return currentPage.name;
    }
    return PAGE_LABELS[activePage];
  };

  return (
    <header
      className="sticky top-0 z-30 flex h-14 items-center justify-between px-4 lg:px-6 border-b"
      style={{ backgroundColor: '#1a1a1a', color: '#ccc' }}
    >
      {/* Left: Mobile menu + Breadcrumb */}
      <div className="flex items-center gap-3">
        {/* Mobile menu toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-white/70 hover:text-white hover:bg-white/10"
          onClick={onToggleSidebar}
          aria-label="Alternar barra lateral"
        >
          <Menu className="size-5" />
        </Button>

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm" aria-label="Ruta de navegación">
          <button
            onClick={() => useBuilderStore.getState().setActivePage('dashboard')}
            className="flex items-center gap-1.5 text-white/50 hover:text-white/80 transition-colors"
          >
            <Flame className="size-4" />
            <span className="font-medium">PageForge</span>
          </button>
          <ChevronRight className="size-3.5 text-white/30" />
          <span className="text-white/90 font-medium truncate max-w-[200px]">
            {getBreadcrumbLabel()}
          </span>
        </nav>
      </div>

      {/* Right: Preview + Avatar */}
      <div className="flex items-center gap-2">
        {/* Preview button */}
        <Button
          variant="ghost"
          size="sm"
          className="hidden sm:flex items-center gap-2 text-white/70 hover:text-white hover:bg-white/10"
          onClick={() => useBuilderStore.getState().setShowPreview(true)}
        >
          <Eye className="size-4" />
          <span>Vista Previa</span>
        </Button>

        {/* User avatar */}
        <button className="flex size-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
          <User className="size-4 text-white/70" />
        </button>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────
// Builder Layout
// ─────────────────────────────────────────────────────────────

interface BuilderLayoutProps {
  children: React.ReactNode;
}

export function BuilderLayout({ children }: BuilderLayoutProps) {
  const { activePage, setActivePage, currentPage, setCurrentPage, setShowPreview } = useBuilderStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavigate = (page: BuilderPage) => {
    setActivePage(page);
    setSidebarOpen(false);
  };

  const handlePreview = () => {
    if (currentPage) {
      setShowPreview(true);
    }
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    setCurrentPage(null);
    setActivePage('dashboard');
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 z-40"
        style={{ backgroundColor: '#1B4332' }}
      >
        <SidebarContent
          activePage={activePage}
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onPreview={handlePreview}
          onLogout={handleLogout}
        />
      </aside>

      {/* Mobile Sidebar Sheet */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent
          side="left"
          className="w-72 p-0 border-0"
          style={{ backgroundColor: '#1B4332' }}
        >
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <SidebarContent
            activePage={activePage}
            currentPage={currentPage}
            onNavigate={handleNavigate}
            onPreview={handlePreview}
            onLogout={handleLogout}
          />
        </SheetContent>
      </Sheet>

      {/* Main Area */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Top Bar */}
        <TopBar
          activePage={activePage}
          currentPage={currentPage}
          onToggleSidebar={() => setSidebarOpen(true)}
        />

        {/* Content */}
        <main className="flex-1 overflow-y-auto" style={{ backgroundColor: '#f0f0eb' }}>
          <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer
          className="border-t px-4 py-3 text-center text-xs"
          style={{
            backgroundColor: '#1a1a1a',
            borderColor: 'rgba(255,255,255,0.06)',
            color: 'rgba(255,255,255,0.35)',
          }}
        >
          &copy; {new Date().getFullYear()} PageForge. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
