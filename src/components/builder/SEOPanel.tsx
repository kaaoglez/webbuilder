'use client';

import { useBuilderStore } from '@/lib/builder-store';
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ImageManager } from '@/components/builder/ImageManager';
import { Globe, Search, FileText, Shield, BarChart3, AlertCircle, CheckCircle2, Image as ImageIcon } from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// Char count helper
// ─────────────────────────────────────────────────────────────

function CharCount({ current, max }: { current: number; max: number }) {
  const ratio = current / max;
  let color = 'bg-emerald-100 text-emerald-700 border-emerald-200';
  if (ratio > 1) {
    color = 'bg-red-100 text-red-700 border-red-200';
  } else if (ratio > 0.85) {
    color = 'bg-yellow-100 text-yellow-700 border-yellow-200';
  }

  let icon = <CheckCircle2 className="h-3 w-3" />;
  if (ratio > 1) {
    icon = <AlertCircle className="h-3 w-3" />;
  } else if (ratio > 0.85) {
    icon = <AlertCircle className="h-3 w-3" />;
  }

  return (
    <Badge variant="outline" className={`ml-2 gap-1 px-2 py-0 text-xs font-normal ${color}`}>
      {icon}
      {current}/{max}
    </Badge>
  );
}

// ─────────────────────────────────────────────────────────────
// Language options
// ─────────────────────────────────────────────────────────────

const LANGUAGES: { value: string; label: string }[] = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'English' },
  { value: 'pt', label: 'Português' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'it', label: 'Italiano' },
  { value: 'nl', label: 'Nederlands' },
];

const OG_TYPES = [
  { value: 'website', label: 'Website' },
  { value: 'article', label: 'Article' },
  { value: 'product', label: 'Product' },
];

// ─────────────────────────────────────────────────────────────
// Global SEO Tab
// ─────────────────────────────────────────────────────────────

function GlobalSEOTab() {
  const { currentWebsite, updateSEO } = useBuilderStore();

  if (!currentWebsite) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <Globe className="h-12 w-12 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">No hay un sitio web seleccionado.</p>
        <p className="text-xs text-muted-foreground">Crea o selecciona un sitio web para configurar el SEO.</p>
      </div>
    );
  }

  const seo = currentWebsite.seo;

  return (
    <div className="space-y-6">
      {/* ── Site Identity ─────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
              <Globe className="h-4 w-4 text-emerald-700" />
            </div>
            <div>
              <CardTitle className="text-base">Identidad del Sitio</CardTitle>
              <CardDescription>Nombre y metadatos por defecto del sitio web.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Site Name */}
          <div className="space-y-2">
            <Label htmlFor="siteName" className="text-sm font-medium">
              Nombre del Sitio
            </Label>
            <Input
              id="siteName"
              value={seo.siteName}
              onChange={(e) => updateSEO({ siteName: e.target.value })}
              placeholder="Mi Sitio Web"
            />
          </div>

          {/* Default Title */}
          <div className="space-y-2">
            <div className="flex items-center">
              <Label htmlFor="defaultTitle" className="text-sm font-medium">
                Título por Defecto
              </Label>
              <CharCount current={seo.defaultTitle.length} max={60} />
            </div>
            <Input
              id="defaultTitle"
              value={seo.defaultTitle}
              onChange={(e) => updateSEO({ defaultTitle: e.target.value })}
              placeholder="Título que aparece en las pestañas del navegador"
              maxLength={100}
            />
          </div>

          {/* Default Description */}
          <div className="space-y-2">
            <div className="flex items-center">
              <Label htmlFor="defaultDescription" className="text-sm font-medium">
                Descripción por Defecto
              </Label>
              <CharCount current={seo.defaultDescription.length} max={160} />
            </div>
            <Textarea
              id="defaultDescription"
              value={seo.defaultDescription}
              onChange={(e) => updateSEO({ defaultDescription: e.target.value })}
              placeholder="Descripción breve del sitio para los resultados de búsqueda..."
              rows={3}
              maxLength={200}
            />
          </div>

          {/* Keywords */}
          <div className="space-y-2">
            <Label htmlFor="defaultKeywords" className="text-sm font-medium">
              Palabras Clave
            </Label>
            <Input
              id="defaultKeywords"
              value={seo.defaultKeywords}
              onChange={(e) => updateSEO({ defaultKeywords: e.target.value })}
              placeholder="marketing, diseño web, desarrollo (separadas por comas)"
            />
            <p className="text-xs text-muted-foreground">Separa las palabras clave con comas.</p>
          </div>
        </CardContent>
      </Card>

      {/* ── Favicon & Images ─────────────────────────────── */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">
              <ImageIcon className="h-4 w-4 text-purple-700" />
            </div>
            <div>
              <CardTitle className="text-base">Favicon e Imágenes</CardTitle>
              <CardDescription>Icono del sitio e imagen para compartir.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Favicon URL */}
          <div className="space-y-2">
            <Label htmlFor="favicon" className="text-sm font-medium">
              Favicon URL
            </Label>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <Input
                  id="favicon"
                  value={seo.favicon}
                  onChange={(e) => updateSEO({ favicon: e.target.value })}
                  placeholder="https://ejemplo.com/favicon.ico"
                />
              </div>
              {seo.favicon && (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-background">
                  <img
                    src={seo.favicon}
                    alt="Favicon preview"
                    className="h-6 w-6 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Default OG Image */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Imagen OG por Defecto</Label>
            <ImageManager
              value={seo.ogImage}
              onChange={(url) => updateSEO({ ogImage: url })}
              label="Seleccionar imagen para compartir"
            />
            <p className="text-xs text-muted-foreground">
              Imagen que se muestra al compartir el sitio en redes sociales. Recomendado: 1200×630 px.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ── Social Media ──────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
              <Search className="h-4 w-4 text-blue-700" />
            </div>
            <div>
              <CardTitle className="text-base">Redes Sociales</CardTitle>
              <CardDescription>Configuración de Open Graph y Twitter Cards.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* OG Type */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Tipo OG</Label>
            <Select
              value={seo.ogType}
              onValueChange={(value) => updateSEO({ ogType: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona un tipo" />
              </SelectTrigger>
              <SelectContent>
                {OG_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Twitter Handle */}
          <div className="space-y-2">
            <Label htmlFor="twitterHandle" className="text-sm font-medium">
              Twitter Handle
            </Label>
            <div className="flex items-center gap-0">
              <div className="flex h-10 items-center justify-center rounded-l-md border border-r-0 bg-muted px-3 text-sm text-muted-foreground">
                @
              </div>
              <Input
                id="twitterHandle"
                value={seo.twitterHandle}
                onChange={(e) => {
                  const val = e.target.value.replace(/^@/, '');
                  updateSEO({ twitterHandle: val });
                }}
                placeholder="miusuario"
                className="rounded-l-none"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Robots & Language ────────────────────────────── */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100">
              <Shield className="h-4 w-4 text-orange-700" />
            </div>
            <div>
              <CardTitle className="text-base">Robots e Idioma</CardTitle>
              <CardDescription>Controla el indexamiento y el idioma del sitio.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Language */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Idioma Principal</Label>
            <Select
              value={seo.language}
              onValueChange={(value) => updateSEO({ language: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona un idioma" />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Index Switch */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="robotsIndex" className="text-sm font-medium">
                Permitir Indexación
              </Label>
              <p className="text-xs text-muted-foreground">
                Permite a los motores de búsqueda indexar este sitio.
              </p>
            </div>
            <Switch
              id="robotsIndex"
              checked={seo.robots.index}
              onCheckedChange={(checked) =>
                updateSEO({ robots: { ...seo.robots, index: checked } })
              }
            />
          </div>

          {/* Follow Switch */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="robotsFollow" className="text-sm font-medium">
                Seguir Enlaces
              </Label>
              <p className="text-xs text-muted-foreground">
                Permite a los motores de búsqueda seguir los enlaces del sitio.
              </p>
            </div>
            <Switch
              id="robotsFollow"
              checked={seo.robots.follow}
              onCheckedChange={(checked) =>
                updateSEO({ robots: { ...seo.robots, follow: checked } })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* ── Analytics ────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100">
              <BarChart3 className="h-4 w-4 text-teal-700" />
            </div>
            <div>
              <CardTitle className="text-base">Analíticas</CardTitle>
              <CardDescription>IDs de seguimiento para Google Analytics y Meta Pixel.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Google Analytics */}
          <div className="space-y-2">
            <Label htmlFor="googleAnalytics" className="text-sm font-medium">
              Google Analytics ID
            </Label>
            <Input
              id="googleAnalytics"
              value={seo.googleAnalytics}
              onChange={(e) => updateSEO({ googleAnalytics: e.target.value })}
              placeholder="G-XXXXXXXXXX"
            />
            <p className="text-xs text-muted-foreground">
              ID de medición de Google Analytics 4.
            </p>
          </div>

          {/* Facebook Pixel */}
          <div className="space-y-2">
            <Label htmlFor="facebookPixel" className="text-sm font-medium">
              Facebook Pixel ID
            </Label>
            <Input
              id="facebookPixel"
              value={seo.facebookPixel}
              onChange={(e) => updateSEO({ facebookPixel: e.target.value })}
              placeholder="123456789012345"
            />
            <p className="text-xs text-muted-foreground">
              ID del píxel de Meta (Facebook) para rastreo de conversiones.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Google Preview Card
// ─────────────────────────────────────────────────────────────

function GooglePreview({
  title,
  url,
  description,
}: {
  title: string;
  url: string;
  description: string;
}) {
  const displayTitle = title || 'Título de la página';
  const displayUrl = url || 'https://www.tusitio.com/pagina';
  const displayDescription = description || 'Descripción de la página aparecerá aquí. Añade una descripción atractiva para mejorar el CTR en los resultados de búsqueda.';

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="space-y-1">
        {/* URL */}
        <div className="flex items-center gap-1.5">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100">
            <Globe className="h-3 w-3 text-gray-500" />
          </div>
          <p className="truncate text-sm text-gray-700">{displayUrl}</p>
        </div>

        {/* Title */}
        <h3 className="cursor-pointer truncate text-xl leading-7 text-blue-700 hover:underline">
          {displayTitle}
        </h3>

        {/* Description */}
        <p className="line-clamp-2 text-sm leading-5 text-gray-600">
          {displayDescription}
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Per-Page SEO Tab
// ─────────────────────────────────────────────────────────────

function PerPageSEOTab() {
  const { currentWebsite, updatePageSEO } = useBuilderStore();
  const [selectedPageId, setSelectedPageId] = useState<string>('');

  const selectedPage = useMemo(() => {
    if (!currentWebsite || !selectedPageId) return null;
    return currentWebsite.pages.find((p) => p.id === selectedPageId) ?? null;
  }, [currentWebsite, selectedPageId]);

  if (!currentWebsite) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <FileText className="h-12 w-12 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">No hay un sitio web seleccionado.</p>
        <p className="text-xs text-muted-foreground">Crea o selecciona un sitio web para configurar el SEO por página.</p>
      </div>
    );
  }

  if (currentWebsite.pages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <FileText className="h-12 w-12 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">No hay páginas disponibles.</p>
        <p className="text-xs text-muted-foreground">Crea al menos una página para configurar su SEO.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page selector */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
              <FileText className="h-4 w-4 text-emerald-700" />
            </div>
            <div>
              <CardTitle className="text-base">SEO por Página</CardTitle>
              <CardDescription>Configura metadatos individuales para cada página.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Seleccionar Página</Label>
            <Select value={selectedPageId} onValueChange={setSelectedPageId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Elige una página..." />
              </SelectTrigger>
              <SelectContent>
                {currentWebsite.pages.map((page) => (
                  <SelectItem key={page.id} value={page.id}>
                    {page.name}
                    <span className="ml-2 text-xs text-muted-foreground">
                      (/{page.slug || 'inicio'})
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Page SEO fields */}
      {selectedPage && (
        <>
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">
                Metadatos de &ldquo;{selectedPage.name}&rdquo;
              </CardTitle>
              <CardDescription>
                Estos valores sobreescriben la configuración global de SEO para esta página.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <div className="flex items-center">
                  <Label htmlFor="pageTitle" className="text-sm font-medium">
                    Título
                  </Label>
                  <CharCount current={selectedPage.seo.title.length} max={60} />
                </div>
                <Input
                  id="pageTitle"
                  value={selectedPage.seo.title}
                  onChange={(e) =>
                    updatePageSEO(selectedPage.id, { title: e.target.value })
                  }
                  placeholder={currentWebsite.seo.defaultTitle || 'Título de la página'}
                  maxLength={100}
                />
                {!selectedPage.seo.title && currentWebsite.seo.defaultTitle && (
                  <p className="text-xs text-muted-foreground">
                    Usará el título por defecto: &ldquo;{currentWebsite.seo.defaultTitle}&rdquo;
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <div className="flex items-center">
                  <Label htmlFor="pageDescription" className="text-sm font-medium">
                    Descripción
                  </Label>
                  <CharCount current={selectedPage.seo.description.length} max={160} />
                </div>
                <Textarea
                  id="pageDescription"
                  value={selectedPage.seo.description}
                  onChange={(e) =>
                    updatePageSEO(selectedPage.id, { description: e.target.value })
                  }
                  placeholder={currentWebsite.seo.defaultDescription || 'Descripción de la página...'}
                  rows={3}
                  maxLength={200}
                />
                {!selectedPage.seo.description && currentWebsite.seo.defaultDescription && (
                  <p className="text-xs text-muted-foreground">
                    Usará la descripción por defecto del sitio.
                  </p>
                )}
              </div>

              {/* Keywords */}
              <div className="space-y-2">
                <Label htmlFor="pageKeywords" className="text-sm font-medium">
                  Palabras Clave
                </Label>
                <Input
                  id="pageKeywords"
                  value={selectedPage.seo.keywords}
                  onChange={(e) =>
                    updatePageSEO(selectedPage.id, { keywords: e.target.value })
                  }
                  placeholder="diseño, desarrollo, creatividad (separadas por comas)"
                />
              </div>

              {/* Canonical URL */}
              <div className="space-y-2">
                <Label htmlFor="pageCanonical" className="text-sm font-medium">
                  URL Canónica
                </Label>
                <Input
                  id="pageCanonical"
                  value={selectedPage.seo.canonical}
                  onChange={(e) =>
                    updatePageSEO(selectedPage.id, { canonical: e.target.value })
                  }
                  placeholder="https://www.tusitio.com/pagina"
                />
                <p className="text-xs text-muted-foreground">
                  Indica a los motores de búsqueda cuál es la URL principal de esta página.
                </p>
              </div>

              <Separator />

              {/* OG Image */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Imagen OG</Label>
                <ImageManager
                  value={selectedPage.seo.ogImage}
                  onChange={(url) =>
                    updatePageSEO(selectedPage.id, { ogImage: url })
                  }
                  label="Seleccionar imagen OG para esta página"
                />
                {!selectedPage.seo.ogImage && currentWebsite.seo.ogImage && (
                  <p className="text-xs text-muted-foreground">
                    Usará la imagen OG por defecto del sitio.
                  </p>
                )}
              </div>

              <Separator />

              {/* No Index */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="pageNoIndex" className="text-sm font-medium">
                    No Indexar
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Evita que los motores de búsqueda indexen esta página.
                  </p>
                </div>
                <Switch
                  id="pageNoIndex"
                  checked={selectedPage.seo.noIndex}
                  onCheckedChange={(checked) =>
                    updatePageSEO(selectedPage.id, { noIndex: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Google Preview */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                  <Search className="h-4 w-4 text-blue-700" />
                </div>
                <div>
                  <CardTitle className="text-base">Vista Previa en Google</CardTitle>
                  <CardDescription>
                    Así es como podría verse esta página en los resultados de búsqueda.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <GooglePreview
                title={
                  selectedPage.seo.title || currentWebsite.seo.defaultTitle
                }
                url={
                  selectedPage.seo.canonical ||
                  `https://www.${currentWebsite.name.toLowerCase().replace(/\s+/g, '')}.com/${selectedPage.slug || ''}`
                }
                description={
                  selectedPage.seo.description || currentWebsite.seo.defaultDescription
                }
              />

              {/* SEO score hints */}
              <div className="mt-4 space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Consejos de optimización:</p>
                <div className="space-y-1.5">
                  <SEOHint
                    ok={(selectedPage.seo.title || currentWebsite.seo.defaultTitle).length > 0 && (selectedPage.seo.title || currentWebsite.seo.defaultTitle).length <= 60}
                    label="Título entre 30-60 caracteres"
                  />
                  <SEOHint
                    ok={(selectedPage.seo.description || currentWebsite.seo.defaultDescription).length > 0 && (selectedPage.seo.description || currentWebsite.seo.defaultDescription).length <= 160}
                    label="Descripción entre 70-160 caracteres"
                  />
                  <SEOHint
                    ok={(selectedPage.seo.keywords || currentWebsite.seo.defaultKeywords).length > 0}
                    label="Palabras clave definidas"
                  />
                  <SEOHint
                    ok={!selectedPage.seo.noIndex}
                    label="Página indexable"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Empty state when no page selected */}
      {!selectedPage && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-16 text-center">
          <FileText className="h-10 w-10 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">
            Selecciona una página para editar su SEO.
          </p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SEO Hint
// ─────────────────────────────────────────────────────────────

function SEOHint({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      {ok ? (
        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
      ) : (
        <AlertCircle className="h-3.5 w-3.5 shrink-0 text-yellow-500" />
      )}
      <span className={`text-xs ${ok ? 'text-emerald-600' : 'text-yellow-600'}`}>
        {label}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main SEOPanel Component
// ─────────────────────────────────────────────────────────────

export function SEOPanel() {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <Tabs defaultValue="global" className="w-full">
        <TabsList className="mb-6 w-full">
          <TabsTrigger value="global" className="flex-1 gap-2">
            <Globe className="h-4 w-4" />
            <span>Global SEO</span>
          </TabsTrigger>
          <TabsTrigger value="perPage" className="flex-1 gap-2">
            <FileText className="h-4 w-4" />
            <span>SEO por Página</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="global" className="mt-0">
          <GlobalSEOTab />
        </TabsContent>

        <TabsContent value="perPage" className="mt-0">
          <PerPageSEOTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
