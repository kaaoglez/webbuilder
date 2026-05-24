'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import {
  Search,
  Plus,
  X,
  Trash2,
  Eye,
  Save,
  ArrowLeft,
  Globe,
  Shield,
  Sparkles,
  Link,
  Image,
  Check,
  AlertTriangle,
  BarChart3,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { useBuilderStore } from '@/lib/builder-store';
import { useSEO, useAutoSave } from '@/lib/builder-hooks';
import { validateSEO } from '@/lib/builder-validators';
import { SEO_LIMITS } from '@/lib/builder-utils';
import type { PageSEO } from '@/lib/builder-types';
import { DEFAULT_SEO } from '@/lib/builder-constants';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// ═══════════════════════════════════════════════════════════════
// Google Preview Card
// ═══════════════════════════════════════════════════════════════

function GooglePreview({
  title,
  description,
  url,
}: {
  title: string;
  description: string;
  url: string;
}) {
  const displayTitle = title || 'Título de tu página';
  const displayDescription = description || 'La descripción de tu página aparecerá aquí. Añade un texto atractivo para mejorar el CTR.';
  const displayUrl = url || 'https://tu-sitio.com/pagina';

  return (
    <Card className="p-4 space-y-2 bg-white border-gray-200">
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
        <p className="text-sm text-gray-500">Vista previa en Google</p>
      </div>
      <div className="space-y-1.5">
        {/* URL */}
        <p className="text-xs text-gray-500 truncate">
          {displayUrl}
        </p>
        {/* Title */}
        <p className="text-lg text-blue-700 font-normal leading-snug hover:underline cursor-pointer line-clamp-1">
          {displayTitle}
        </p>
        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
          {displayDescription}
        </p>
      </div>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════
// Character Counter
// ═══════════════════════════════════════════════════════════════

function CharCounter({
  current,
  max,
  optimalMin,
}: {
  current: number;
  max: number;
  optimalMin?: number;
}) {
  const ratio = current / max;
  const isOver = current > max;
  const isOptimal = current > 0 && current <= max && (optimalMin ? current >= optimalMin : true);

  return (
    <div className="flex items-center gap-1.5">
      <div className="h-1 w-16 rounded-full bg-gray-200 overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all',
            isOver ? 'bg-red-500 w-full' : isOptimal ? 'bg-emerald-500' : 'bg-amber-400',
          )}
          style={{ width: `${Math.min(ratio * 100, 100)}%` }}
        />
      </div>
      <span
        className={cn(
          'text-xs font-medium tabular-nums',
          isOver ? 'text-red-600' : isOptimal ? 'text-emerald-600' : 'text-amber-600',
        )}
      >
        {current}/{max}
      </span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Validation Summary
// ═══════════════════════════════════════════════════════════════

function ValidationSummary({
  errors,
}: {
  errors: { field: string; message: string; severity: string }[];
}) {
  if (errors.length === 0) return null;

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 space-y-1.5">
      <div className="flex items-center gap-1.5 text-amber-700">
        <AlertTriangle className="h-4 w-4" />
        <span className="text-sm font-medium">Recomendaciones</span>
      </div>
      <ul className="space-y-1">
        {errors.map((err, i) => (
          <li key={i} className="text-xs text-amber-600 flex items-start gap-1.5">
            <span className="mt-0.5 flex-shrink-0">
              {err.severity === 'error' ? '●' : err.severity === 'warning' ? '◐' : '○'}
            </span>
            <span>{err.message}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SEOSettings — Main Export
// ═══════════════════════════════════════════════════════════════

export function SEOSettings() {
  const currentPage = useBuilderStore((s) => s.currentPage);
  const seoFromStore = useBuilderStore((s) => s.seo);
  const setSeoStore = useBuilderStore((s) => s.setSeo);
  const setActivePage = useBuilderStore((s) => s.setActivePage);

  // Local keyword input
  const [keywordInput, setKeywordInput] = useState('');

  // Initialize SEO hook with data from store or defaults
  const {
    seo,
    update,
    addKeyword,
    removeKeyword,
    titleLength,
    descriptionLength,
    isTitleValid,
    isDescriptionValid,
    keywordsCount,
  } = useSEO(seoFromStore ?? { title: currentPage?.name ?? '', ...DEFAULT_SEO });

  // Sync local seo state back to store
  useEffect(() => {
    if (currentPage) {
      const seoData: PageSEO = {
        id: seoFromStore?.id ?? `seo-${currentPage.id}`,
        pageId: currentPage.id,
        title: seo.title,
        description: seo.description,
        keywords: seo.keywords,
        ogImage: seo.ogImage,
        ogType: seo.ogType as PageSEO['ogType'],
        twitterCard: seo.twitterCard as PageSEO['twitterCard'],
        canonicalUrl: seo.canonicalUrl,
        robotsIndex: seo.robotsIndex,
        robotsFollow: seo.robotsFollow,
      };
      setSeoStore(seoData);
    }
  }, [seo, currentPage, setSeoStore]);

  // Auto-save hook
  const autoSaveData = useMemo(() => ({
    id: seoFromStore?.id ?? `seo-${currentPage?.id ?? ''}`,
    pageId: currentPage?.id ?? '',
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    ogImage: seo.ogImage,
    ogType: seo.ogType,
    twitterCard: seo.twitterCard,
    canonicalUrl: seo.canonicalUrl,
    robotsIndex: seo.robotsIndex,
    robotsFollow: seo.robotsFollow,
  }), [seo, seoFromStore, currentPage]);

  const { isSaving, lastSaved, saveNow } = useAutoSave<PageSEO>({
    data: autoSaveData,
    endpoint: '/api/seo',
    delay: 3000,
    enabled: !!currentPage,
    method: 'PUT',
    onSave: () => {},
    onError: (msg) => {
      console.error('SEO auto-save error:', msg);
    },
  });

  // Run validation
  const validation = useMemo(() => {
    return validateSEO({
      title: seo.title,
      description: seo.description,
      keywords: seo.keywords,
      canonicalUrl: seo.canonicalUrl,
      ogImage: seo.ogImage,
    });
  }, [seo.title, seo.description, seo.keywords, seo.canonicalUrl, seo.ogImage]);

  // Keyword management
  const handleAddKeyword = useCallback(() => {
    const trimmed = keywordInput.trim().toLowerCase();
    if (!trimmed) return;
    if (seo.keywords.length >= 20) {
      toast.warning('Máximo 20 palabras clave permitidas.');
      return;
    }
    if (seo.keywords.includes(trimmed)) {
      toast.info('Esta palabra clave ya existe.');
      setKeywordInput('');
      return;
    }
    addKeyword(trimmed);
    setKeywordInput('');
  }, [keywordInput, seo.keywords, addKeyword]);

  const handleKeywordKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAddKeyword();
      }
    },
    [handleAddKeyword],
  );

  // Save & Go Back
  const handleSaveAndBack = useCallback(() => {
    saveNow();
    toast.success('SEO guardado correctamente.');
    setActivePage('editor');
  }, [saveNow, setActivePage]);

  // Force save
  const handleSave = useCallback(() => {
    saveNow();
    toast.success('SEO guardado correctamente.');
  }, [saveNow]);

  // ── No page selected ──
  if (!currentPage) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4 p-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <BarChart3 className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="text-center space-y-1">
          <h3 className="text-lg font-semibold">Sin página seleccionada</h3>
          <p className="text-sm text-muted-foreground">
            Ve al Dashboard y selecciona una página para editar su SEO.
          </p>
        </div>
        <Button variant="outline" onClick={() => setActivePage('dashboard')} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Ir al Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
            <Search className="h-5 w-5 text-emerald-700" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Configuración SEO</h2>
            <p className="text-sm text-muted-foreground">
              {currentPage.name} — Optimiza tu página para buscadores
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isSaving && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              Guardando...
            </span>
          )}
          {lastSaved && !isSaving && (
            <span className="text-xs text-emerald-600 flex items-center gap-1">
              <Check className="h-3 w-3" />
              Guardado
            </span>
          )}
          <Button variant="outline" size="sm" onClick={handleSaveAndBack} className="gap-1.5">
            <ArrowLeft className="h-3.5 w-3.5" />
            Guardar y Volver
          </Button>
          <Button size="sm" onClick={handleSave} className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white">
            <Save className="h-3.5 w-3.5" />
            Guardar
          </Button>
        </div>
      </div>

      <Separator />

      {/* ── Google Preview ── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Eye className="h-4 w-4 text-emerald-600" />
          <Label className="text-sm font-semibold text-foreground">Vista previa en Google</Label>
        </div>
        <GooglePreview
          title={seo.title}
          description={seo.description}
          url={seo.canonicalUrl}
        />
      </div>

      <Separator />

      {/* ── Title & Description ── */}
      <div className="space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="seo-title" className="text-sm font-medium">
              Título de la Página
            </Label>
            <CharCounter current={titleLength} max={SEO_LIMITS.title} optimalMin={10} />
          </div>
          <Input
            id="seo-title"
            value={seo.title}
            onChange={(e) => update({ title: e.target.value })}
            placeholder="Título SEO optimizado (ej: Las mejores herramientas de diseño web)"
            className={cn(
              titleLength > SEO_LIMITS.title && 'border-red-300 focus-visible:ring-red-400',
              isTitleValid && titleLength > 0 && 'border-emerald-300',
            )}
          />
          <p className="text-xs text-muted-foreground">
            El título ideal tiene entre 30-60 caracteres. Aparece como enlace en los resultados de búsqueda.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="seo-description" className="text-sm font-medium">
              Meta Descripción
            </Label>
            <CharCounter current={descriptionLength} max={SEO_LIMITS.description} optimalMin={30} />
          </div>
          <Textarea
            id="seo-description"
            value={seo.description}
            onChange={(e) => update({ description: e.target.value })}
            placeholder="Describe tu página de forma atractiva para mejorar el CTR en los resultados de búsqueda..."
            rows={3}
            className={cn(
              descriptionLength > SEO_LIMITS.description && 'border-red-300 focus-visible:ring-red-400',
              isDescriptionValid && descriptionLength > 0 && 'border-emerald-300',
            )}
          />
          <p className="text-xs text-muted-foreground">
            La descripción ideal tiene entre 120-160 caracteres. Incluye palabras clave relevantes.
          </p>
        </div>
      </div>

      <Separator />

      {/* ── Keywords ── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">
            Palabras Clave
          </Label>
          <Badge variant="secondary" className="text-xs">
            {keywordsCount}/20
          </Badge>
        </div>
        <div className="flex gap-2">
          <Input
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyDown={handleKeywordKeyDown}
            placeholder="Escribe una palabra clave y presiona Enter"
            disabled={keywordsCount >= 20}
            className="text-sm"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={handleAddKeyword}
            disabled={!keywordInput.trim() || keywordsCount >= 20}
            className="flex-shrink-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {seo.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {seo.keywords.map((keyword) => (
              <Badge
                key={keyword}
                variant="secondary"
                className="gap-1 pr-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200"
              >
                <span className="text-xs">{keyword}</span>
                <button
                  type="button"
                  onClick={() => removeKeyword(keyword)}
                  className="ml-0.5 rounded-full p-0.5 hover:bg-emerald-200 transition-colors"
                  aria-label={`Eliminar ${keyword}`}
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </Badge>
            ))}
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          Máximo 20 palabras clave. Escribe y presiona Enter para agregar.
        </p>
      </div>

      <Separator />

      {/* ── Open Graph ── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-emerald-600" />
          <Label className="text-sm font-semibold">Open Graph</Label>
        </div>

        <div className="space-y-2">
          <Label htmlFor="og-image" className="text-sm font-medium">Imagen OG</Label>
          <div className="flex gap-2">
            <Input
              id="og-image"
              value={seo.ogImage}
              onChange={(e) => update({ ogImage: e.target.value })}
              placeholder="https://ejemplo.com/og-image.jpg"
              className="text-sm flex-1"
            />
            {seo.ogImage && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => update({ ogImage: '' })}
                className="flex-shrink-0 text-muted-foreground hover:text-red-600"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          {seo.ogImage && (
            <div className="mt-2 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
              <img
                src={seo.ogImage}
                alt="OG Preview"
                className="h-32 w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            Imagen que se mostrará al compartir tu página en redes sociales (recomendado: 1200×630px).
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="og-type" className="text-sm font-medium">Tipo OG</Label>
          <Select
            value={seo.ogType}
            onValueChange={(v) => update({ ogType: v })}
          >
            <SelectTrigger id="og-type" className="w-full">
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="website">
                <div className="flex items-center gap-2">
                  <Globe className="h-3.5 w-3.5" />
                  Website
                </div>
              </SelectItem>
              <SelectItem value="article">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5" />
                  Article
                </div>
              </SelectItem>
              <SelectItem value="profile">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-3.5 w-3.5" />
                  Profile
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      {/* ── Twitter Card ── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-emerald-600" />
          <Label className="text-sm font-semibold">Twitter Card</Label>
        </div>

        <div className="space-y-2">
          <Label htmlFor="twitter-card" className="text-sm font-medium">Tipo de Tarjeta</Label>
          <Select
            value={seo.twitterCard}
            onValueChange={(v) => update({ twitterCard: v })}
          >
            <SelectTrigger id="twitter-card" className="w-full">
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="summary">Summary — Tarjeta compacta</SelectItem>
              <SelectItem value="summary_large_image">Summary Large Image — Tarjeta con imagen grande</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Define cómo se verá tu página cuando se comparta en Twitter/X.
          </p>
        </div>
      </div>

      <Separator />

      {/* ── Canonical URL ── */}
      <div className="space-y-2">
        <Label htmlFor="canonical-url" className="text-sm font-medium flex items-center gap-1.5">
          <Link className="h-3.5 w-3.5" />
          URL Canónica
        </Label>
        <Input
          id="canonical-url"
          value={seo.canonicalUrl}
          onChange={(e) => update({ canonicalUrl: e.target.value })}
          placeholder="https://tu-sitio.com/pagina"
          className={cn(
            seo.canonicalUrl &&
              seo.canonicalUrl.length > 0 &&
              !/^https?:\/\/.+\..+/.test(seo.canonicalUrl) &&
              'border-red-300 focus-visible:ring-red-400',
          )}
        />
        <p className="text-xs text-muted-foreground">
          Indica a los buscadores cuál es la URL preferida de esta página para evitar contenido duplicado.
        </p>
      </div>

      <Separator />

      {/* ── Robots ── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-emerald-600" />
          <Label className="text-sm font-semibold">Robots</Label>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3">
            <div className="space-y-0.5">
              <Label htmlFor="robots-index" className="text-sm font-medium">Indexar</Label>
              <p className="text-xs text-muted-foreground">
                Permite a los buscadores indexar esta página
              </p>
            </div>
            <Switch
              id="robots-index"
              checked={seo.robotsIndex}
              onCheckedChange={(checked) => update({ robotsIndex: checked })}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3">
            <div className="space-y-0.5">
              <Label htmlFor="robots-follow" className="text-sm font-medium">Seguir Enlaces</Label>
              <p className="text-xs text-muted-foreground">
                Permite a los buscadores seguir los enlaces de esta página
              </p>
            </div>
            <Switch
              id="robots-follow"
              checked={seo.robotsFollow}
              onCheckedChange={(checked) => update({ robotsFollow: checked })}
            />
          </div>

          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">
              Meta robots:{' '}
              <code className="rounded bg-white px-1.5 py-0.5 text-xs font-mono border">
                {seo.robotsIndex ? 'index' : 'noindex'}, {seo.robotsFollow ? 'follow' : 'nofollow'}
              </code>
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* ── Validation Summary ── */}
      {!validation.valid && (
        <ValidationSummary errors={validation.errors} />
      )}

      {validation.valid && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
          <div className="flex items-center gap-1.5 text-emerald-700">
            <Check className="h-4 w-4" />
            <span className="text-sm font-medium">Todo en orden</span>
          </div>
          <p className="text-xs text-emerald-600 mt-1">
            Tu configuración SEO cumple con las mejores prácticas.
          </p>
        </div>
      )}

      {/* ── Bottom Actions ── */}
      <div className="flex items-center justify-between pt-2 pb-4">
        <Button variant="outline" onClick={() => setActivePage('editor')} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Volver al Editor
        </Button>
        <Button onClick={handleSave} className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white">
          <Save className="h-4 w-4" />
          Guardar SEO
        </Button>
      </div>
    </div>
  );
}

export default SEOSettings;
