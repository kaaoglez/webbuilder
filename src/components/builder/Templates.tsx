'use client';

import { TEMPLATE_META } from '@/lib/builder-types';
import type { PageTemplate } from '@/lib/builder-types';
import { useBuilderStore } from '@/lib/builder-store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Rocket,
  Briefcase,
  UtensilsCrossed,
  Cloud,
  Building2,
  ShoppingCart,
  PenLine,
  Plus,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  Rocket,
  Briefcase,
  UtensilsCrossed,
  Cloud,
  Building2,
  ShoppingCart,
  PenLine,
};

export function Templates() {
  const createNewPage = useBuilderStore((s) => s.createNewPage);

  const handleSelectTemplate = (label: string, templateKey: PageTemplate) => {
    const newPage = createNewPage(label, templateKey);
    // Persist to database
    fetch('/api/pages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPage),
    }).catch((err) => console.error('[Templates] Failed to save page:', err));
  };

  const handleCreateBlank = () => {
    const newPage = createNewPage('Página en Blanco', 'landing');
    // Persist to database
    fetch('/api/pages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPage),
    }).catch((err) => console.error('[Templates] Failed to save page:', err));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Plantillas
        </h1>
        <p className="text-muted-foreground text-lg">
          Elige una plantilla para comenzar rápidamente
        </p>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {(Object.entries(TEMPLATE_META) as [PageTemplate, typeof TEMPLATE_META[PageTemplate]][]).map(
          ([key, meta]) => {
            const Icon = ICON_MAP[meta.icon];

            return (
              <Card
                key={key}
                className="group overflow-hidden bg-white hover:shadow-lg transition-all duration-300 border border-border/60 cursor-pointer"
              >
                {/* Colored header band with icon */}
                <div
                  className="h-40 flex items-center justify-center relative"
                  style={{ backgroundColor: meta.color }}
                >
                  <div className="absolute inset-0 bg-black/5" />
                  <div className="relative flex flex-col items-center gap-3">
                    {Icon ? (
                      <Icon className="h-14 w-14 text-white/90" strokeWidth={1.5} />
                    ) : (
                      <span className="text-2xl font-bold text-white/90">
                        {meta.icon}
                      </span>
                    )}
                  </div>
                </div>

                <CardHeader className="pb-2 pt-4 px-4">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base font-semibold leading-snug">
                      {meta.label}
                    </CardTitle>
                    <Badge variant="secondary" className="shrink-0 text-xs font-medium">
                      {meta.sections.length} secciones
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="px-4 pb-4 pt-0">
                  <CardDescription className="text-sm mb-4 leading-relaxed line-clamp-2">
                    {meta.description}
                  </CardDescription>
                  <Button
                    className="w-full text-white font-medium transition-all duration-200 hover:opacity-90"
                    style={{ backgroundColor: meta.color }}
                    onClick={() => handleSelectTemplate(meta.label, key)}
                  >
                    Usar Plantilla
                  </Button>
                </CardContent>
              </Card>
            );
          }
        )}

        {/* Custom / Blank Template */}
        <Card className="group overflow-hidden bg-white hover:shadow-lg transition-all duration-300 border-2 border-dashed border-muted-foreground/30 cursor-pointer flex flex-col items-center justify-center min-h-[320px]">
          <CardContent className="flex flex-col items-center justify-center gap-4 p-6 text-center">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-foreground text-base">
                Crear en Blanco
              </h3>
              <p className="text-sm text-muted-foreground">
                Comienza con una página vacía y añade secciones libremente
              </p>
            </div>
            <Button
              variant="outline"
              className="mt-2 font-medium"
              onClick={handleCreateBlank}
            >
              Empezar desde Cero
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
