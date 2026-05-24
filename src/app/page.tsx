'use client';

import { useEffect } from 'react';
import { useBuilderStore } from '@/lib/builder-store';
import { BuilderLayout } from '@/components/builder/BuilderLayout';
import { Dashboard } from '@/components/builder/Dashboard';
import { Templates } from '@/components/builder/Templates';
import { PageEditor } from '@/components/builder/PageEditor';
import { ThemeEditor } from '@/components/builder/ThemeEditor';
import { SEOSettings } from '@/components/builder/SEOSettings';
import { NavigationEditor } from '@/components/builder/NavigationEditor';
import { PreviewPanel } from '@/components/builder/PreviewPanel';

function PageContent() {
  const { activePage, setPages, showPreview } = useBuilderStore();

  // Load pages from database on mount
  useEffect(() => {
    fetch('/api/pages')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // Parse JSON strings for sections and theme
          const parsed = data.map((page: Record<string, unknown>) => ({
            ...page,
            sections: typeof page.sections === 'string' ? JSON.parse(page.sections) : page.sections,
            theme: typeof page.theme === 'string' ? JSON.parse(page.theme) : page.theme,
          }));
          setPages(parsed);
        }
      })
      .catch((err) => console.error('[PageForge] Failed to load pages:', err));
  }, [setPages]);

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'templates':
        return <Templates />;
      case 'editor':
        return <PageEditor />;
      case 'theme':
        return <ThemeEditor />;
      case 'seo':
        return <SEOSettings />;
      case 'navigation':
        return <NavigationEditor />;
      case 'preview':
        return null; // Handled by PreviewPanel
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      <BuilderLayout>
        {renderPage()}
      </BuilderLayout>
      {showPreview && (
        <PreviewPanel />
      )}
    </>
  );
}

export default function PageForgeApp() {
  return <PageContent />;
}
