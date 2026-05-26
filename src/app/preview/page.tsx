'use client';

import ThemeLivePreview from '@/components/pageforge/ThemeLivePreview';

export default function PreviewPage() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999 }}>
      <ThemeLivePreview />
    </div>
  );
}
