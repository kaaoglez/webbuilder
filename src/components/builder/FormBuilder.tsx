'use client';

import { useBuilderStore } from '@/lib/builder-store';
import type { FormConfig, FormField, FormFieldType } from '@/lib/builder-types';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import {
  Plus,
  GripVertical,
  Trash2,
  X,
  Type,
  Mail,
  Phone,
  FileText,
  ListChecks,
  Hash,
  Calendar,
  Upload,
  AlignLeft,
  MousePointer,
  Eye,
  Copy,
  Settings,
  FormInput,
} from 'lucide-react';
import { toast } from 'sonner';

// ═══════════════════════════════════════════════════════════════
// Constants
// ═══════════════════════════════════════════════════════════════

const uid = () => Math.random().toString(36).slice(2, 10);

const FIELD_TYPE_OPTIONS: { type: FormFieldType; label: string; icon: React.ReactNode; defaultLabel: string; defaultPlaceholder?: string }[] = [
  { type: 'text', label: 'Texto corto', icon: <Type className="h-4 w-4" />, defaultLabel: 'Nombre', defaultPlaceholder: 'Tu nombre' },
  { type: 'email', label: 'Email', icon: <Mail className="h-4 w-4" />, defaultLabel: 'Email', defaultPlaceholder: 'tu@email.com' },
  { type: 'phone', label: 'Teléfono', icon: <Phone className="h-4 w-4" />, defaultLabel: 'Teléfono', defaultPlaceholder: '+34 600 000 000' },
  { type: 'textarea', label: 'Textarea', icon: <AlignLeft className="h-4 w-4" />, defaultLabel: 'Mensaje', defaultPlaceholder: 'Escribe tu mensaje...' },
  { type: 'select', label: 'Select', icon: <ListChecks className="h-4 w-4" />, defaultLabel: 'Seleccionar', defaultPlaceholder: 'Elige una opción' },
  { type: 'checkbox', label: 'Checkbox', icon: <FormInput className="h-4 w-4" />, defaultLabel: 'Acepto los términos' },
  { type: 'number', label: 'Número', icon: <Hash className="h-4 w-4" />, defaultLabel: 'Cantidad', defaultPlaceholder: '0' },
  { type: 'date', label: 'Fecha', icon: <Calendar className="h-4 w-4" />, defaultLabel: 'Fecha' },
  { type: 'file', label: 'Archivo', icon: <Upload className="h-4 w-4" />, defaultLabel: 'Adjuntar archivo' },
];

const FORM_TYPE_META: Record<FormConfig['type'], { label: string; color: string; bg: string }> = {
  contact: { label: 'Contacto', color: 'text-emerald-700', bg: 'bg-emerald-100 border-emerald-200' },
  newsletter: { label: 'Newsletter', color: 'text-sky-700', bg: 'bg-sky-100 border-sky-200' },
  custom: { label: 'Personalizado', color: 'text-amber-700', bg: 'bg-amber-100 border-amber-200' },
};

// ═══════════════════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════════════════

function getFieldIcon(type: FormFieldType) {
  const found = FIELD_TYPE_OPTIONS.find((f) => f.type === type);
  return found ? found.icon : <Type className="h-4 w-4" />;
}

function getFieldLabel(type: FormFieldType) {
  const found = FIELD_TYPE_OPTIONS.find((f) => f.type === type);
  return found ? found.label : type;
}

function createDefaultField(type: FormFieldType): FormField {
  const meta = FIELD_TYPE_OPTIONS.find((f) => f.type === type)!;
  return {
    id: uid(),
    type,
    label: meta.defaultLabel,
    placeholder: meta.defaultPlaceholder,
    required: false,
    ...(type === 'select' ? { options: ['Opción 1', 'Opción 2'] } : {}),
  };
}

// ═══════════════════════════════════════════════════════════════
// Sortable Field Item
// ═══════════════════════════════════════════════════════════════

interface SortableFieldItemProps {
  field: FormField;
  isSelected: boolean;
  onSelect: () => void;
}

function SortableFieldItem({ field, isSelected, onSelect }: SortableFieldItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id, strategy: verticalListSortingStrategy });

  const style: React.CSSProperties = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-2 rounded-lg border px-3 py-2.5 transition-all cursor-pointer ${
        isSelected
          ? 'border-emerald-500 bg-emerald-50 shadow-sm'
          : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-muted/50'
      }`}
      onClick={onSelect}
    >
      {/* Drag handle */}
      <button
        ref={setActivatorNodeRef}
        {...attributes}
        {...listeners}
        className="flex-shrink-0 cursor-grab text-muted-foreground hover:text-foreground active:cursor-grabbing p-0.5 rounded"
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical className="h-4 w-4" />
      </button>

      {/* Field type icon */}
      <div className={`flex h-7 w-7 items-center justify-center rounded-md shrink-0 ${
        isSelected ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
      }`}>
        {getFieldIcon(field.type)}
      </div>

      {/* Field info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className={`text-sm font-medium truncate ${
            isSelected ? 'text-emerald-800' : 'text-gray-800'
          }`}>
            {field.label}
          </span>
          {field.required && (
            <span className="text-red-500 text-xs">*</span>
          )}
        </div>
        <span className="text-xs text-gray-400">{getFieldLabel(field.type)}</span>
      </div>

      {/* Half-width indicator */}
      {field.halfWidth && (
        <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-gray-200 text-gray-500 shrink-0">
          ½
        </Badge>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Field Editor
// ═══════════════════════════════════════════════════════════════

interface FieldEditorProps {
  field: FormField;
  formId: string;
  onUpdateField: (formId: string, fieldId: string, data: Partial<FormField>) => void;
  onRemoveField: (formId: string, fieldId: string) => void;
}

function FieldEditor({ field, formId, onUpdateField, onRemoveField }: FieldEditorProps) {
  const [newOption, setNewOption] = useState('');

  const handleAddOption = () => {
    const trimmed = newOption.trim();
    if (!trimmed) return;
    const options = [...(field.options || []), trimmed];
    onUpdateField(formId, field.id, { options });
    setNewOption('');
  };

  const handleRemoveOption = (index: number) => {
    const options = (field.options || []).filter((_, i) => i !== index);
    onUpdateField(formId, field.id, { options });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-100 text-emerald-700">
            {getFieldIcon(field.type)}
          </div>
          Editar Campo: {field.label}
        </h4>
      </div>

      {/* Label */}
      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Etiqueta</Label>
        <Input
          value={field.label}
          onChange={(e) => onUpdateField(formId, field.id, { label: e.target.value })}
          placeholder="Etiqueta del campo"
          className="h-9"
        />
      </div>

      {/* Placeholder (not for checkbox) */}
      {field.type !== 'checkbox' && (
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Placeholder</Label>
          <Input
            value={field.placeholder || ''}
            onChange={(e) => onUpdateField(formId, field.id, { placeholder: e.target.value })}
            placeholder="Texto de ayuda"
            className="h-9"
          />
        </div>
      )}

      {/* Required & Half Width */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2.5">
          <Switch
            checked={field.required}
            onCheckedChange={(checked) => onUpdateField(formId, field.id, { required: checked })}
          />
          <Label className="text-sm text-gray-700">Obligatorio</Label>
        </div>
        {field.type !== 'checkbox' && field.type !== 'textarea' && (
          <div className="flex items-center gap-2.5">
            <Switch
              checked={field.halfWidth || false}
              onCheckedChange={(checked) => onUpdateField(formId, field.id, { halfWidth: checked })}
            />
            <Label className="text-sm text-gray-700">Medio ancho</Label>
          </div>
        )}
      </div>

      {/* Options for Select */}
      {field.type === 'select' && (
        <div className="space-y-2">
          <Label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Opciones</Label>
          <div className="space-y-2">
            {(field.options || []).map((option, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="flex-1 text-sm text-gray-700 bg-gray-50 rounded-md px-3 py-1.5 border border-gray-100">
                  {option}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50"
                  onClick={() => handleRemoveOption(idx)}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <Input
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                placeholder="Nueva opción"
                className="h-8 text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddOption();
                  }
                }}
              />
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs shrink-0"
                onClick={handleAddOption}
                disabled={!newOption.trim()}
              >
                <Plus className="h-3 w-3 mr-1" />
                Añadir
              </Button>
            </div>
          </div>
        </div>
      )}

      <Separator />

      {/* Delete field */}
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 h-8 text-sm"
        onClick={() => onRemoveField(formId, field.id)}
      >
        <Trash2 className="h-3.5 w-3.5" />
        Eliminar campo
      </Button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Form Preview
// ═══════════════════════════════════════════════════════════════

function FormPreview({ form }: { form: FormConfig }) {
  const renderField = (field: FormField) => {
    const requiredMark = field.required ? <span className="text-red-500 ml-0.5">*</span> : null;

    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
      case 'number':
      case 'date':
        return (
          <div className={field.halfWidth ? '' : 'w-full'}>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {field.label}{requiredMark}
            </label>
            <input
              type={field.type === 'phone' ? 'tel' : field.type}
              placeholder={field.placeholder}
              disabled
              className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-400"
            />
          </div>
        );
      case 'textarea':
        return (
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {field.label}{requiredMark}
            </label>
            <textarea
              placeholder={field.placeholder}
              disabled
              rows={3}
              className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-400 resize-none"
            />
          </div>
        );
      case 'select':
        return (
          <div className={field.halfWidth ? '' : 'w-full'}>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {field.label}{requiredMark}
            </label>
            <div className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-400">
              {field.placeholder || 'Seleccionar...'}
            </div>
            {(field.options || []).map((opt) => (
              <div key={opt} className="text-xs text-gray-300 mt-0.5 ml-3">{opt}</div>
            ))}
          </div>
        );
      case 'checkbox':
        return (
          <div className="w-full flex items-center gap-2">
            <div className="h-4 w-4 rounded border border-gray-300 bg-gray-50 shrink-0" />
            <label className="text-sm text-gray-700">
              {field.label}{requiredMark}
            </label>
          </div>
        );
      case 'file':
        return (
          <div className={field.halfWidth ? '' : 'w-full'}>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {field.label}{requiredMark}
            </label>
            <div className="w-full rounded-md border-2 border-dashed border-gray-200 bg-gray-50/50 px-4 py-6 text-center">
              <Upload className="h-5 w-5 text-gray-300 mx-auto mb-1" />
              <span className="text-xs text-gray-400">{field.placeholder || 'Arrastra o haz clic para subir'}</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Group fields by halfWidth pairs
  const renderedFields: React.ReactNode[] = [];
  const fields = form.fields;
  let i = 0;

  while (i < fields.length) {
    const field = fields[i];
    if (field.halfWidth && i + 1 < fields.length && fields[i + 1].halfWidth) {
      const nextField = fields[i + 1];
      renderedFields.push(
        <div key={field.id} className="grid grid-cols-2 gap-3">
          {renderField(field)}
          {renderField(nextField)}
        </div>
      );
      i += 2;
    } else {
      renderedFields.push(
        <div key={field.id}>
          {renderField(field)}
        </div>
      );
      i += 1;
    }
  }

  return (
    <div className="space-y-4">
      {/* Form name as title */}
      <h3 className="text-lg font-semibold text-gray-800">{form.name}</h3>

      {/* Fields */}
      <div className="space-y-3">
        {renderedFields}
      </div>

      {/* Submit button */}
      <button className="w-full rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm">
        {form.submitText || 'Enviar'}
      </button>

      {/* Success message hint */}
      {form.successMessage && (
        <p className="text-xs text-gray-400 text-center italic">
          ✨ {form.successMessage}
        </p>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Main FormBuilder Component
// ═══════════════════════════════════════════════════════════════

export function FormBuilder() {
  const { currentWebsite, addForm, removeForm, updateForm } = useBuilderStore();
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [addFieldOpen, setAddFieldOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const forms = currentWebsite?.forms || [];
  const selectedForm = forms.find((f) => f.id === selectedFormId) || null;
  const selectedField = selectedForm?.fields.find((f) => f.id === selectedFieldId) || null;

  // ── Form CRUD ──────────────────────────────────────────────

  function handleCreateForm() {
    const newForm: FormConfig = {
      id: uid(),
      name: 'Nuevo Formulario',
      type: 'contact',
      fields: [],
      submitText: 'Enviar',
      successMessage: '¡Mensaje enviado correctamente!',
      emailTo: '',
      enableRecaptcha: false,
    };
    addForm(newForm);
    setSelectedFormId(newForm.id);
    setSelectedFieldId(null);
    toast.success('Formulario creado');
  }

  function handleDuplicateForm(form: FormConfig) {
    const clone: FormConfig = {
      ...JSON.parse(JSON.stringify(form)),
      id: uid(),
      name: `${form.name} (copia)`,
      fields: form.fields.map((f) => ({ ...JSON.parse(JSON.stringify(f)), id: uid() })),
    };
    addForm(clone);
    toast.success('Formulario duplicado');
  }

  function handleDeleteForm(id: string) {
    removeForm(id);
    if (selectedFormId === id) {
      setSelectedFormId(null);
      setSelectedFieldId(null);
    }
    toast.success('Formulario eliminado');
  }

  function handleUpdateFormField(formId: string, fieldId: string, data: Partial<FormField>) {
    const form = forms.find((f) => f.id === formId);
    if (!form) return;
    const updatedFields = form.fields.map((f) => (f.id === fieldId ? { ...f, ...data } : f));
    updateForm(formId, { fields: updatedFields });
  }

  function handleRemoveFormField(formId: string, fieldId: string) {
    const form = forms.find((f) => f.id === formId);
    if (!form) return;
    const updatedFields = form.fields.filter((f) => f.id !== fieldId);
    updateForm(formId, { fields: updatedFields });
    if (selectedFieldId === fieldId) {
      setSelectedFieldId(null);
    }
    toast.success('Campo eliminado');
  }

  function handleAddField(type: FormFieldType) {
    if (!selectedForm) return;
    const newField = createDefaultField(type);
    updateForm(selectedForm.id, { fields: [...selectedForm.fields, newField] });
    setSelectedFieldId(newField.id);
    setAddFieldOpen(false);
    toast.success(`Campo "${getFieldLabel(type)}" añadido`);
  }

  function handleDragEnd(event: DragEndEvent) {
    if (!selectedForm) return;
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = selectedForm.fields.findIndex((f) => f.id === active.id);
      const newIndex = selectedForm.fields.findIndex((f) => f.id === over.id);
      const reordered = arrayMove(selectedForm.fields, oldIndex, newIndex);
      updateForm(selectedForm.id, { fields: reordered });
    }
  }

  // ── No website guard ───────────────────────────────────────

  if (!currentWebsite) {
    return (
      <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#1a2e1a' }}>
            Formularios
          </h1>
          <p className="text-sm" style={{ color: '#6b7280' }}>
            Gestiona los formularios de tu sitio web
          </p>
        </div>
        <Card className="border-0 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
              <FormInput className="h-8 w-8 text-emerald-400" />
            </div>
            <h3 className="mb-1 text-base font-semibold" style={{ color: '#1a2e1a' }}>
              No hay sitio web seleccionado
            </h3>
            <p className="mb-4 max-w-sm text-sm" style={{ color: '#6b7280' }}>
              Primero crea o selecciona un sitio web para gestionar sus formularios.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // Render
  // ═══════════════════════════════════════════════════════════

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#1a2e1a' }}>
            Formularios
          </h1>
          <p className="text-sm" style={{ color: '#6b7280' }}>
            Gestiona los formularios de contacto, newsletter y más
          </p>
        </div>
        <Button
          size="sm"
          className="gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700"
          onClick={handleCreateForm}
        >
          <Plus className="h-3.5 w-3.5" />
          Nuevo Formulario
        </Button>
      </div>

      {/* ── Section 1: Form List ───────────────────────────── */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
              <FormInput className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold" style={{ color: '#1a2e1a' }}>
                Mis Formularios
              </CardTitle>
              <CardDescription className="text-xs">
                {forms.length} {forms.length === 1 ? 'formulario' : 'formularios'} creado{forms.length !== 1 ? 's' : ''}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {forms.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-50">
                <FormInput className="h-6 w-6 text-gray-300" />
              </div>
              <p className="text-sm text-gray-500">No hay formularios aún</p>
              <p className="text-xs text-gray-400 mt-1">Haz clic en &quot;Nuevo Formulario&quot; para crear uno</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {forms.map((form) => {
                const meta = FORM_TYPE_META[form.type];
                const isSelected = form.id === selectedFormId;
                return (
                  <div
                    key={form.id}
                    onClick={() => {
                      setSelectedFormId(form.id);
                      setSelectedFieldId(null);
                    }}
                    className={`group relative rounded-lg border p-4 cursor-pointer transition-all duration-150 ${
                      isSelected
                        ? 'border-emerald-400 bg-emerald-50/50 shadow-sm ring-1 ring-emerald-200'
                        : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
                    }`}
                  >
                    {/* Type badge */}
                    <div className="flex items-start justify-between mb-2">
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-medium px-2 py-0 border ${meta.bg} ${meta.color}`}
                      >
                        {meta.label}
                      </Badge>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicateForm(form);
                          }}
                          className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                          title="Duplicar"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteForm(form.id);
                          }}
                          className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50"
                          title="Eliminar"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Form name */}
                    <h3 className={`text-sm font-semibold mb-1 ${
                      isSelected ? 'text-emerald-800' : 'text-gray-800'
                    }`}>
                      {form.name}
                    </h3>

                    {/* Field count */}
                    <p className="text-xs text-gray-400">
                      {form.fields.length} {form.fields.length === 1 ? 'campo' : 'campos'}
                    </p>

                    {/* Selected indicator */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600">
                        <MousePointer className="h-2.5 w-2.5 text-white" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Section 2 & 3: Form Editor + Settings (when selected) ── */}
      {selectedForm && (
        <>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* ── Left: Form Details & Field Management ─── */}
            <div className="space-y-6">
              {/* Form Name & Type */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50">
                      <Settings className="h-4 w-4 text-amber-600" />
                    </div>
                    <CardTitle className="text-sm font-semibold" style={{ color: '#1a2e1a' }}>
                      Configuración del Formulario
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Form Name */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre del Formulario
                    </Label>
                    <Input
                      value={selectedForm.name}
                      onChange={(e) => updateForm(selectedForm.id, { name: e.target.value })}
                      placeholder="Nombre del formulario"
                      className="h-9"
                    />
                  </div>

                  {/* Form Type */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo de Formulario
                    </Label>
                    <Select
                      value={selectedForm.type}
                      onValueChange={(v) => updateForm(selectedForm.id, { type: v as FormConfig['type'] })}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="contact">Contacto</SelectItem>
                        <SelectItem value="newsletter">Newsletter</SelectItem>
                        <SelectItem value="custom">Personalizado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Field Management */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50">
                        <ListChecks className="h-4 w-4 text-sky-600" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-semibold" style={{ color: '#1a2e1a' }}>
                          Campos
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {selectedForm.fields.length} {selectedForm.fields.length === 1 ? 'campo' : 'campos'}
                        </CardDescription>
                      </div>
                    </div>
                    {/* Add Field Popover */}
                    <Popover open={addFieldOpen} onOpenChange={setAddFieldOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 gap-1.5 text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                        >
                          <Plus className="h-3 w-3" />
                          Añadir Campo
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-52 p-2" align="end">
                        <div className="space-y-0.5">
                          {FIELD_TYPE_OPTIONS.map((opt) => (
                            <button
                              key={opt.type}
                              onClick={() => handleAddField(opt.type)}
                              className="flex items-center gap-2.5 w-full rounded-md px-2.5 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors text-left"
                            >
                              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-100 text-gray-500 shrink-0">
                                {opt.icon}
                              </div>
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </CardHeader>
                <CardContent>
                  {selectedForm.fields.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gray-50">
                        <Plus className="h-5 w-5 text-gray-300" />
                      </div>
                      <p className="text-sm text-gray-500">Sin campos</p>
                      <p className="text-xs text-gray-400 mt-0.5">Añade campos con el botón de arriba</p>
                    </div>
                  ) : (
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext
                        items={selectedForm.fields.map((f) => f.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-2">
                          {selectedForm.fields.map((field) => (
                            <SortableFieldItem
                              key={field.id}
                              field={field}
                              isSelected={field.id === selectedFieldId}
                              onSelect={() =>
                                setSelectedFieldId(
                                  selectedFieldId === field.id ? null : field.id,
                                )
                              }
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* ── Right: Field Editor + Form Settings ─── */}
            <div className="space-y-6">
              {/* Field Editor (when a field is selected) */}
              {selectedField && (
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50">
                        {getFieldIcon(selectedField.type)}
                      </div>
                      <CardTitle className="text-sm font-semibold" style={{ color: '#1a2e1a' }}>
                        Editor de Campo
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <FieldEditor
                      field={selectedField}
                      formId={selectedForm.id}
                      onUpdateField={handleUpdateFormField}
                      onRemoveField={handleRemoveFormField}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Form Settings */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50">
                      <Settings className="h-4 w-4 text-rose-600" />
                    </div>
                    <CardTitle className="text-sm font-semibold" style={{ color: '#1a2e1a' }}>
                      Ajustes del Formulario
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Submit text */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Texto del botón
                    </Label>
                    <Input
                      value={selectedForm.submitText}
                      onChange={(e) => updateForm(selectedForm.id, { submitText: e.target.value })}
                      placeholder="Enviar"
                      className="h-9"
                    />
                  </div>

                  {/* Success message */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mensaje de éxito
                    </Label>
                    <Textarea
                      value={selectedForm.successMessage}
                      onChange={(e) => updateForm(selectedForm.id, { successMessage: e.target.value })}
                      placeholder="¡Gracias por tu mensaje!"
                      className="min-h-[80px] text-sm"
                    />
                  </div>

                  {/* Email to */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email de destino
                    </Label>
                    <Input
                      type="email"
                      value={selectedForm.emailTo}
                      onChange={(e) => updateForm(selectedForm.id, { emailTo: e.target.value })}
                      placeholder="contacto@miweb.com"
                      className="h-9"
                    />
                  </div>

                  <Separator />

                  {/* reCAPTCHA */}
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm text-gray-700 font-medium">reCAPTCHA</Label>
                      <p className="text-xs text-gray-400 mt-0.5">Protección contra spam</p>
                    </div>
                    <Switch
                      checked={selectedForm.enableRecaptcha}
                      onCheckedChange={(checked) => updateForm(selectedForm.id, { enableRecaptcha: checked })}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* ── Section 4: Form Preview ─────────────────────── */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50">
                  <Eye className="h-4 w-4 text-teal-600" />
                </div>
                <div>
                  <CardTitle className="text-sm font-semibold" style={{ color: '#1a2e1a' }}>
                    Vista Previa
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Así se verá el formulario en tu sitio web
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mx-auto max-w-md rounded-xl border border-gray-100 bg-muted/50 p-6">
                {selectedForm.fields.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <FileText className="h-8 w-8 text-gray-300 mb-2" />
                    <p className="text-sm text-gray-500">El formulario está vacío</p>
                    <p className="text-xs text-gray-400 mt-0.5">Añade campos para ver la vista previa</p>
                  </div>
                ) : (
                  <FormPreview form={selectedForm} />
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
