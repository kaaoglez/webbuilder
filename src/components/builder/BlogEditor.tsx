'use client';

import { useBuilderStore } from '@/lib/builder-store';
import type { BlogPost } from '@/lib/builder-types';
import { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ImageManager } from '@/components/builder/ImageManager';
import { Plus, FileText, Edit2, Trash2, Eye, Clock, Tag, X, Calendar, User } from 'lucide-react';
import { toast } from 'sonner';

// ═══════════════════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════════════════

const uid = () => Math.random().toString(36).slice(2, 10);

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 100);
}

function estimateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
}

function createEmptyPost(): Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    author: '',
    tags: [],
    status: 'DRAFT',
  };
}

const STATUS_STYLES: Record<BlogPost['status'], { label: string; className: string }> = {
  DRAFT: { label: 'Borrador', className: 'bg-gray-100 text-gray-700 border-gray-200' },
  PUBLISHED: { label: 'Publicado', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  ARCHIVED: { label: 'Archivado', className: 'bg-red-100 text-red-700 border-red-200' },
};

// ═══════════════════════════════════════════════════════════════
// Toggle Row
// ═══════════════════════════════════════════════════════════════

function ToggleRow({
  label,
  description,
  checked,
  onCheckedChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <Label className="text-sm font-medium text-gray-700">{label}</Label>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Blog Settings Section
// ═══════════════════════════════════════════════════════════════

function BlogSettingsPanel() {
  const { currentWebsite, updateBlog } = useBuilderStore();
  if (!currentWebsite) return null;

  const blog = currentWebsite.blog;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <FileText className="h-5 w-5 text-emerald-600" />
          Configuración del Blog
        </CardTitle>
        <CardDescription>
          Administra la configuración general de tu blog y cómo se muestran los artículos.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enable toggle */}
        <ToggleRow
          label="Blog habilitado"
          description="Activa o desactiva la sección de blog en tu sitio."
          checked={blog.enabled}
          onCheckedChange={(enabled) => updateBlog({ enabled })}
        />

        <Separator />

        {/* Posts per page */}
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="postsPerPage" className="text-sm font-medium text-gray-700">
              Artículos por página
            </Label>
            <Input
              id="postsPerPage"
              type="number"
              min={1}
              max={50}
              value={blog.postsPerPage}
              onChange={(e) => updateBlog({ postsPerPage: Math.max(1, parseInt(e.target.value) || 1) })}
              className="h-9"
            />
            <p className="text-xs text-gray-400">Mostrar entre 1 y 50 artículos por página.</p>
          </div>

          {/* Layout */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">Disposición</Label>
            <Select value={blog.layout} onValueChange={(v: 'grid' | 'list' | 'magazine') => updateBlog({ layout: v })}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grid">Cuadrícula</SelectItem>
                <SelectItem value="list">Lista</SelectItem>
                <SelectItem value="magazine">Magazine</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-400">Define cómo se visualizan los artículos.</p>
          </div>
        </div>

        <Separator />

        {/* Display toggles */}
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Elementos a mostrar
          </p>
          <ToggleRow
            label="Autor"
            description="Mostrar el nombre del autor en cada artículo."
            checked={blog.showAuthor}
            onCheckedChange={(showAuthor) => updateBlog({ showAuthor })}
          />
          <ToggleRow
            label="Fecha"
            description="Mostrar la fecha de publicación."
            checked={blog.showDate}
            onCheckedChange={(showDate) => updateBlog({ showDate })}
          />
          <ToggleRow
            label="Tiempo de lectura"
            description="Estimación del tiempo de lectura del artículo."
            checked={blog.showReadingTime}
            onCheckedChange={(showReadingTime) => updateBlog({ showReadingTime })}
          />
          <ToggleRow
            label="Etiquetas"
            description="Mostrar las etiquetas asociadas al artículo."
            checked={blog.showTags}
            onCheckedChange={(showTags) => updateBlog({ showTags })}
          />
          <ToggleRow
            label="Imagen destacada"
            description="Mostrar la imagen de portada en el listado."
            checked={blog.showFeaturedImage}
            onCheckedChange={(showFeaturedImage) => updateBlog({ showFeaturedImage })}
          />
        </div>
      </CardContent>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════
// Article Card
// ═══════════════════════════════════════════════════════════════

function ArticleCard({
  post,
  onEdit,
  onDelete,
}: {
  post: BlogPost;
  onEdit: (post: BlogPost) => void;
  onDelete: (id: string) => void;
}) {
  const statusStyle = STATUS_STYLES[post.status];
  const readingTime = estimateReadingTime(post.content);

  return (
    <Card className="group overflow-hidden transition-shadow duration-200 hover:shadow-md">
      {/* Cover image */}
      {post.coverImage ? (
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          <img
            src={post.coverImage}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="flex aspect-video w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50">
          <FileText className="h-10 w-10 text-gray-300" />
        </div>
      )}

      <CardContent className="space-y-3 p-4">
        {/* Title & Status */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="min-w-0 flex-1 truncate text-sm font-semibold text-gray-900">
            {post.title || 'Sin título'}
          </h3>
          <Badge variant="outline" className={`shrink-0 border text-[11px] font-medium ${statusStyle.className}`}>
            {statusStyle.label}
          </Badge>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
          {post.author && (
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {post.author}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(post.createdAt)}
          </span>
          {post.content.trim().length > 0 && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {readingTime} min
            </span>
          )}
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-0.5 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700"
              >
                <Tag className="h-2.5 w-2.5" />
                {tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
                +{post.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1.5 border-t border-gray-100 pt-3">
          <Button
            variant="outline"
            size="sm"
            className="h-7 gap-1.5 text-xs"
            onClick={() => onEdit(post)}
          >
            <Edit2 className="h-3 w-3" />
            Editar
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 gap-1.5 text-xs"
            onClick={() => {
              window.open(`/blog/${post.slug}`, '_blank');
            }}
          >
            <Eye className="h-3 w-3" />
            Ver
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto h-7 gap-1.5 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={() => onDelete(post.id)}
          >
            <Trash2 className="h-3 w-3" />
            Eliminar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════
// Article List Section
// ═══════════════════════════════════════════════════════════════

function ArticleListPanel({
  posts,
  onNew,
  onEdit,
  onDelete,
}: {
  posts: BlogPost[];
  onNew: () => void;
  onEdit: (post: BlogPost) => void;
  onDelete: (id: string) => void;
}) {
  if (posts.length === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base">Artículos</CardTitle>
            <CardDescription>Gestiona los artículos de tu blog.</CardDescription>
          </div>
          <Button size="sm" className="gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700" onClick={onNew}>
            <Plus className="h-4 w-4" />
            Nuevo Artículo
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <FileText className="h-8 w-8 text-gray-300" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">No hay artículos aún</p>
              <p className="mt-1 text-xs text-gray-400">
                Crea tu primer artículo para empezar a publicar contenido.
              </p>
            </div>
            <Button size="sm" className="mt-2 gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700" onClick={onNew}>
              <Plus className="h-4 w-4" />
              Crear primer artículo
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle className="text-base">
            Artículos
            <span className="ml-2 text-sm font-normal text-gray-400">({posts.length})</span>
          </CardTitle>
          <CardDescription>Gestiona los artículos de tu blog.</CardDescription>
        </div>
        <Button size="sm" className="gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700" onClick={onNew}>
          <Plus className="h-4 w-4" />
          Nuevo Artículo
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <ArticleCard key={post.id} post={post} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════
// Tag Input
// ═══════════════════════════════════════════════════════════════

function TagInput({
  tags,
  onChange,
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
}) {
  const [input, setInput] = useState('');

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        const raw = input.replace(/,/g, '').trim().toLowerCase();
        if (raw && !tags.includes(raw) && tags.length < 10) {
          onChange([...tags, raw]);
          setInput('');
        }
      }
      if (e.key === 'Backspace' && input === '' && tags.length > 0) {
        onChange(tags.slice(0, -1));
      }
    },
    [input, tags, onChange]
  );

  const handleBlur = useCallback(() => {
    const raw = input.replace(/,/g, '').trim().toLowerCase();
    if (raw && !tags.includes(raw) && tags.length < 10) {
      onChange([...tags, raw]);
      setInput('');
    }
  }, [input, tags, onChange]);

  const removeTag = useCallback(
    (tag: string) => {
      onChange(tags.filter((t) => t !== tag));
    },
    [tags, onChange]
  );

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">
        Etiquetas
        <span className="ml-1 text-xs font-normal text-gray-400">(máx. 10)</span>
      </Label>
      <div className="flex min-h-[40px] flex-wrap items-center gap-1.5 rounded-md border border-gray-200 bg-background px-3 py-2 transition-colors focus-within:border-emerald-400 focus-within:ring-1 focus-within:ring-emerald-400">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-200"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-0.5 rounded-full p-0.5 transition-colors hover:bg-emerald-300"
              aria-label={`Eliminar etiqueta ${tag}`}
            >
              <X className="h-2.5 w-2.5" />
            </button>
          </span>
        ))}
        {tags.length < 10 && (
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            placeholder={tags.length === 0 ? 'Escribe y presiona Enter...' : ''}
            className="min-w-[100px] flex-1 border-0 bg-transparent text-sm outline-none placeholder:text-gray-400"
          />
        )}
      </div>
      <p className="text-xs text-gray-400">Presiona Enter o coma para añadir etiquetas.</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Article Editor Section
// ═══════════════════════════════════════════════════════════════

function ArticleEditorPanel({
  post,
  onSave,
  onCancel,
  isNew,
}: {
  post: BlogPost;
  onSave: (post: BlogPost) => void;
  onCancel: () => void;
  isNew: boolean;
}) {
  const [form, setForm] = useState<BlogPost>({ ...post });
  const [tagInput, setTagInput] = useState(post.tags.join(', '));
  const readingTime = estimateReadingTime(form.content);

  const updateField = useCallback(<K extends keyof BlogPost>(key: K, value: BlogPost[K]) => {
    setForm((prev) => {
      const updated = { ...prev, [key]: value };
      // Auto-generate slug from title
      if (key === 'title' && isNew) {
        updated.slug = generateSlug(value as string);
      }
      return updated;
    });
  }, [isNew]);

  const handleTagInputChange = useCallback((value: string) => {
    setTagInput(value);
    const tags = value
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);
    setForm((prev) => ({ ...prev, tags: tags }));
  }, []);

  const handleSave = useCallback(() => {
    if (!form.title.trim()) {
      toast.error('El título es obligatorio.');
      return;
    }
    if (!form.slug.trim()) {
      toast.error('El slug es obligatorio.');
      return;
    }
    const now = new Date().toISOString();
    const saved: BlogPost = {
      ...form,
      updatedAt: now,
      publishedAt: form.status === 'PUBLISHED' && !form.publishedAt ? now : form.publishedAt,
    };
    onSave(saved);
  }, [form, onSave]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle className="text-base">
            {isNew ? 'Nuevo Artículo' : 'Editar Artículo'}
          </CardTitle>
          <CardDescription>
            {isNew ? 'Crea un nuevo artículo para tu blog.' : `Editando: ${form.title || 'Sin título'}`}
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onCancel}>
            Cancelar
          </Button>
          <Button size="sm" className="gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700" onClick={handleSave}>
            <FileText className="h-3.5 w-3.5" />
            {isNew ? 'Crear' : 'Guardar'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* ── Left: Content ─────────────────────────────────── */}
          <div className="space-y-5">
            {/* Title */}
            <div className="space-y-1.5">
              <Label htmlFor="post-title" className="text-sm font-medium text-gray-700">
                Título <span className="text-red-500">*</span>
              </Label>
              <Input
                id="post-title"
                value={form.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="Título del artículo"
                className="text-base font-medium"
              />
            </div>

            {/* Slug */}
            <div className="space-y-1.5">
              <Label htmlFor="post-slug" className="text-sm font-medium text-gray-700">
                Slug <span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 whitespace-nowrap">/blog/</span>
                <Input
                  id="post-slug"
                  value={form.slug}
                  onChange={(e) => updateField('slug', e.target.value)}
                  placeholder="url-del-articulo"
                  className="h-9 text-sm"
                />
              </div>
              <p className="text-xs text-gray-400">
                {isNew ? 'Se genera automáticamente a partir del título. Puedes editarlo.' : 'URL amigable del artículo.'}
              </p>
            </div>

            {/* Excerpt */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="post-excerpt" className="text-sm font-medium text-gray-700">
                  Extracto
                </Label>
                <span className={`text-xs ${form.excerpt.length > 200 ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
                  {form.excerpt.length}/200
                </span>
              </div>
              <Textarea
                id="post-excerpt"
                value={form.excerpt}
                onChange={(e) => updateField('excerpt', e.target.value.slice(0, 200))}
                placeholder="Breve resumen del artículo (máx. 200 caracteres)"
                rows={3}
                className="resize-none text-sm"
              />
            </div>

            {/* Content */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="post-content" className="text-sm font-medium text-gray-700">
                  Contenido <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    ~{readingTime} min de lectura
                  </span>
                  <span>{form.content.trim().split(/\s+/).filter(Boolean).length} palabras</span>
                </div>
              </div>
              <Textarea
                id="post-content"
                value={form.content}
                onChange={(e) => updateField('content', e.target.value)}
                placeholder="Escribe el contenido de tu artículo aquí. Se soporta Markdown."
                rows={16}
                className="min-h-[320px] resize-y font-mono text-sm leading-relaxed"
              />
              <p className="text-xs text-gray-400">
                Escribe tu artículo usando Markdown para formato: **negrita**, *cursiva*, ## encabezados, etc.
              </p>
            </div>
          </div>

          {/* ── Right: Sidebar Settings ───────────────────────── */}
          <div className="space-y-5 lg:border-l lg:border-gray-100 lg:pl-6">
            {/* Status */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700">Estado</Label>
              <Select
                value={form.status}
                onValueChange={(v: BlogPost['status']) => updateField('status', v)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-gray-400" />
                      Borrador
                    </span>
                  </SelectItem>
                  <SelectItem value="PUBLISHED">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      Publicado
                    </span>
                  </SelectItem>
                  <SelectItem value="ARCHIVED">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-red-500" />
                      Archivado
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Cover Image */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700">Imagen de portada</Label>
              <ImageManager
                value={form.coverImage}
                onChange={(url) => updateField('coverImage', url)}
                label="Seleccionar imagen de portada"
              />
            </div>

            <Separator />

            {/* Author */}
            <div className="space-y-1.5">
              <Label htmlFor="post-author" className="text-sm font-medium text-gray-700">
                Autor
              </Label>
              <Input
                id="post-author"
                value={form.author}
                onChange={(e) => updateField('author', e.target.value)}
                placeholder="Nombre del autor"
                className="h-9 text-sm"
              />
            </div>

            <Separator />

            {/* Tags */}
            <TagInput
              tags={form.tags}
              onChange={(tags) => {
                setForm((prev) => ({ ...prev, tags }));
                setTagInput(tags.join(', '));
              }}
            />

            {/* Dates info */}
            <Separator />
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Información
              </p>
              <div className="space-y-1.5 text-xs text-gray-500">
                <div className="flex items-center justify-between">
                  <span>Creado</span>
                  <span className="text-gray-700">{formatDate(form.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Actualizado</span>
                  <span className="text-gray-700">{formatDate(form.updatedAt)}</span>
                </div>
                {form.status === 'PUBLISHED' && form.publishedAt && (
                  <div className="flex items-center justify-between">
                    <span>Publicado</span>
                    <span className="text-gray-700">{formatDate(form.publishedAt)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span>Tiempo de lectura</span>
                  <span className="text-gray-700">~{readingTime} min</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════
// Main BlogEditor Component
// ═══════════════════════════════════════════════════════════════

export function BlogEditor() {
  const { currentWebsite } = useBuilderStore();

  // Local state for blog posts
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isNewPost, setIsNewPost] = useState(false);

  // ── Post CRUD ───────────────────────────────────────────────

  const handleNewPost = useCallback(() => {
    const now = new Date().toISOString();
    const newPost: BlogPost = {
      ...createEmptyPost(),
      id: uid(),
      createdAt: now,
      updatedAt: now,
    };
    setEditingPost(newPost);
    setIsNewPost(true);
  }, []);

  const handleEditPost = useCallback((post: BlogPost) => {
    setEditingPost({ ...post });
    setIsNewPost(false);
  }, []);

  const handleDeletePost = useCallback((id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
    if (editingPost?.id === id) {
      setEditingPost(null);
    }
    toast.success('Artículo eliminado.');
  }, [editingPost]);

  const handleSavePost = useCallback((post: BlogPost) => {
    setPosts((prev) => {
      const existingIndex = prev.findIndex((p) => p.id === post.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = post;
        return updated;
      }
      return [...prev, post];
    });
    setEditingPost(null);
    setIsNewPost(false);
    toast.success(isNewPost ? 'Artículo creado exitosamente.' : 'Artículo guardado exitosamente.');
  }, [isNewPost]);

  const handleCancelEdit = useCallback(() => {
    setEditingPost(null);
    setIsNewPost(false);
  }, []);

  // ── Stats ───────────────────────────────────────────────────

  const stats = useMemo(() => {
    const published = posts.filter((p) => p.status === 'PUBLISHED').length;
    const drafts = posts.filter((p) => p.status === 'DRAFT').length;
    const archived = posts.filter((p) => p.status === 'ARCHIVED').length;
    return { published, drafts, archived, total: posts.length };
  }, [posts]);

  // ── Render ──────────────────────────────────────────────────

  if (!currentWebsite) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <FileText className="h-12 w-12 text-gray-300" />
        <p className="text-sm text-gray-500">Selecciona un sitio web para gestionar el blog.</p>
      </div>
    );
  }

  // When editing an article, show the editor
  if (editingPost) {
    return (
      <div className="space-y-6">
        <ArticleEditorPanel
          post={editingPost}
          onSave={handleSavePost}
          onCancel={handleCancelEdit}
          isNew={isNewPost}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section 1: Blog Settings */}
      <BlogSettingsPanel />

      {/* Stats bar */}
      {posts.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Total', value: stats.total, color: 'text-gray-900' },
            { label: 'Publicados', value: stats.published, color: 'text-emerald-600' },
            { label: 'Borradores', value: stats.drafts, color: 'text-gray-500' },
            { label: 'Archivados', value: stats.archived, color: 'text-red-500' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-gray-100 bg-white px-4 py-3 text-center shadow-sm"
            >
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Section 2: Article List */}
      <ArticleListPanel
        posts={posts}
        onNew={handleNewPost}
        onEdit={handleEditPost}
        onDelete={handleDeletePost}
      />
    </div>
  );
}
