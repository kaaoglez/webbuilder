'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  X,
  RotateCw,
  RotateCcw,
  FlipHorizontal2,
  FlipVertical2,
  Crop,
  Move,
  ZoomIn,
  ZoomOut,
  Undo2,
  Redo2,
  Check,
  SlidersHorizontal,
  Sun,
  Contrast,
  Droplets,
  Maximize2,
  Download,
  ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { MediaItem } from '@/lib/media-library-store';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

interface ImageTransform {
  rotation: number; // 0, 90, 180, 270
  flipH: boolean;
  flipV: boolean;
  brightness: number; // -100 to 100
  contrast: number; // -100 to 100
  saturation: number; // -100 to 100
  blur: number; // 0 to 20
  crop: {
    enabled: boolean;
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

interface HistoryEntry {
  dataUrl: string;
  transform: ImageTransform;
}

interface ImageEditorProps {
  item: MediaItem;
  onSave: (updatedUrl: string, width: number, height: number) => void;
  onClose: () => void;
}

// ─────────────────────────────────────────────────────────────
// Default transform
// ─────────────────────────────────────────────────────────────

const DEFAULT_TRANSFORM: ImageTransform = {
  rotation: 0,
  flipH: false,
  flipV: false,
  brightness: 0,
  contrast: 0,
  saturation: 0,
  blur: 0,
  crop: { enabled: false, x: 0, y: 0, width: 0, height: 0 },
};

// ─────────────────────────────────────────────────────────────
// Canvas rendering helper (outside component to avoid hoisting issues)
// ─────────────────────────────────────────────────────────────

function renderImageToCanvas(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
  t: ImageTransform,
): { width: number; height: number } {
  const ctx = canvas.getContext('2d');
  if (!ctx) return { width: 0, height: 0 };

  // Calculate dimensions based on rotation
  const isRotated = t.rotation === 90 || t.rotation === 270;
  const w = isRotated ? img.naturalHeight : img.naturalWidth;
  const h = isRotated ? img.naturalWidth : img.naturalHeight;

  // Apply crop if enabled
  let srcX = 0, srcY = 0, srcW = img.naturalWidth, srcH = img.naturalHeight;
  let outW = w, outH = h;

  if (t.crop.enabled && t.crop.width > 0 && t.crop.height > 0) {
    srcX = t.crop.x;
    srcY = t.crop.y;
    srcW = t.crop.width;
    srcH = t.crop.height;
    const cropRotated = t.rotation === 90 || t.rotation === 270;
    outW = cropRotated ? srcH : srcW;
    outH = cropRotated ? srcW : srcH;
  }

  canvas.width = outW;
  canvas.height = outH;

  ctx.save();
  ctx.clearRect(0, 0, outW, outH);

  // Apply filters
  const brightness = 100 + t.brightness;
  const contrast = 100 + t.contrast;
  const saturation = 100 + t.saturation;
  ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${t.blur}px)`;

  // Translate to center
  ctx.translate(outW / 2, outH / 2);

  // Apply rotation
  ctx.rotate((t.rotation * Math.PI) / 180);

  // Apply flip
  ctx.scale(t.flipH ? -1 : 1, t.flipV ? -1 : 1);

  // Draw image centered
  ctx.drawImage(img, -srcW / 2, -srcH / 2, srcW, srcH);

  ctx.restore();

  return { width: outW, height: outH };
}

// ─────────────────────────────────────────────────────────────
// Image Editor Component
// ─────────────────────────────────────────────────────────────

export function ImageEditor({ item, onSave, onClose }: ImageEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const transformRef = useRef<ImageTransform>({ ...DEFAULT_TRANSFORM });

  const [transform, setTransform] = useState<ImageTransform>({ ...DEFAULT_TRANSFORM });
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [zoom, setZoom] = useState(1);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  // Render to canvas helper
  const doRender = useCallback((t: ImageTransform) => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;
    const size = renderImageToCanvas(canvas, img, t);
    setCanvasSize(size);
  }, []);

  // Load the image
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      imageRef.current = img;
      // Save initial state
      const entry: HistoryEntry = {
        dataUrl: item.url,
        transform: { ...DEFAULT_TRANSFORM },
      };
      setHistory([entry]);
      setHistoryIndex(0);
      const canvas = canvasRef.current;
      if (canvas) {
        const size = renderImageToCanvas(canvas, img, DEFAULT_TRANSFORM);
        setCanvasSize(size);
      }
    };
    img.onerror = () => {
      toast.error('Error al cargar la imagen');
    };
    img.src = item.url;
  }, [item.url]);

  // Get current canvas data URL
  const getCanvasDataUrl = useCallback((): string => {
    if (!canvasRef.current) return item.url;
    return canvasRef.current.toDataURL('image/png');
  }, [item.url]);

  // Push to history
  const pushHistory = useCallback(
    (newTransform: ImageTransform) => {
      if (!canvasRef.current) return;
      const dataUrl = canvasRef.current.toDataURL('image/png');
      const entry: HistoryEntry = { dataUrl, transform: { ...newTransform } };

      setHistory((prev) => {
        // Remove future entries if we branched
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(entry);
        // Limit to 20 entries
        if (newHistory.length > 20) newHistory.shift();
        return newHistory;
      });
      setHistoryIndex((prev) => prev + 1);
    },
    [historyIndex],
  );

  // Apply transform and render
  const applyTransform = useCallback(
    (updater: (prev: ImageTransform) => ImageTransform, pushToHistory = true) => {
      const newTransform = updater(transform);
      setTransform(newTransform);
      transformRef.current = newTransform;
      doRender(newTransform);
      if (pushToHistory) {
        // Defer to allow canvas to update
        setTimeout(() => pushHistory(newTransform), 50);
      }
    },
    [transform, doRender, pushHistory],
  );

  // Undo
  const undo = useCallback(() => {
    if (historyIndex <= 0) return;
    const newIndex = historyIndex - 1;
    const entry = history[newIndex];
    if (entry) {
      setTransform(entry.transform);
      transformRef.current = entry.transform;
      doRender(entry.transform);
      setHistoryIndex(newIndex);
    }
  }, [historyIndex, history, doRender]);

  // Redo
  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;
    const newIndex = historyIndex + 1;
    const entry = history[newIndex];
    if (entry) {
      setTransform(entry.transform);
      transformRef.current = entry.transform;
      doRender(entry.transform);
      setHistoryIndex(newIndex);
    }
  }, [historyIndex, history, doRender]);

  // Rotate
  const rotateLeft = useCallback(() => {
    applyTransform((t) => ({
      ...t,
      rotation: (t.rotation + 270) % 360,
      crop: { ...DEFAULT_TRANSFORM.crop },
    }));
    setActiveTool(null);
  }, [applyTransform]);

  const rotateRight = useCallback(() => {
    applyTransform((t) => ({
      ...t,
      rotation: (t.rotation + 90) % 360,
      crop: { ...DEFAULT_TRANSFORM.crop },
    }));
    setActiveTool(null);
  }, [applyTransform]);

  // Flip
  const flipH = useCallback(() => {
    applyTransform((t) => ({ ...t, flipH: !t.flipH }));
    setActiveTool(null);
  }, [applyTransform]);

  const flipV = useCallback(() => {
    applyTransform((t) => ({ ...t, flipV: !t.flipV }));
    setActiveTool(null);
  }, [applyTransform]);

  // Crop toggle
  const toggleCrop = useCallback(() => {
    if (activeTool === 'crop') {
      setActiveTool(null);
      applyTransform((t) => ({ ...t, crop: { ...DEFAULT_TRANSFORM.crop } }), false);
    } else {
      setActiveTool('crop');
      applyTransform((t) => ({
        ...t,
        crop: {
          enabled: true,
          x: 0,
          y: 0,
          width: imageRef.current?.naturalWidth || 0,
          height: imageRef.current?.naturalHeight || 0,
        },
      }));
    }
  }, [activeTool, applyTransform]);

  // Adjustments
  const setBrightness = useCallback(
    (val: number) => {
      applyTransform((t) => ({ ...t, brightness: val }), false);
    },
    [applyTransform],
  );

  const setContrast = useCallback(
    (val: number) => {
      applyTransform((t) => ({ ...t, contrast: val }), false);
    },
    [applyTransform],
  );

  const setSaturation = useCallback(
    (val: number) => {
      applyTransform((t) => ({ ...t, saturation: val }), false);
    },
    [applyTransform],
  );

  const setBlur = useCallback(
    (val: number) => {
      applyTransform((t) => ({ ...t, blur: val }), false);
    },
    [applyTransform],
  );

  // Reset adjustments
  const resetAdjustments = useCallback(() => {
    applyTransform((t) => ({
      ...t,
      brightness: 0,
      contrast: 0,
      saturation: 0,
      blur: 0,
    }));
  }, [applyTransform]);

  // Reset all
  const resetAll = useCallback(() => {
    const newTransform = { ...DEFAULT_TRANSFORM };
    setTransform(newTransform);
    transformRef.current = newTransform;
    setActiveTool(null);
    doRender(newTransform);
  }, [doRender]);

  // Save
  const handleSave = useCallback(() => {
    setIsProcessing(true);
    try {
      // Create a final canvas at full resolution
      const finalCanvas = document.createElement('canvas');
      const img = imageRef.current;
      if (!img) {
        toast.error('No hay imagen cargada');
        setIsProcessing(false);
        return;
      }

      const size = renderImageToCanvas(finalCanvas, img, transform);
      const dataUrl = finalCanvas.toDataURL('image/png');
      onSave(dataUrl, size.width, size.height);
      toast.success('Imagen guardada correctamente');
    } catch {
      toast.error('Error al guardar la imagen');
    }
    setIsProcessing(false);
  }, [transform, onSave]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      }
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [undo, redo, onClose]);

  const hasChanges =
    transform.rotation !== 0 ||
    transform.flipH ||
    transform.flipV ||
    transform.brightness !== 0 ||
    transform.contrast !== 0 ||
    transform.saturation !== 0 ||
    transform.blur !== 0 ||
    transform.crop.enabled;

  return (
    <TooltipProvider delayDuration={300}>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#1a1a1a] rounded-xl shadow-2xl flex flex-col overflow-hidden"
          style={{ width: 'min(95vw, 1100px)', height: 'min(90vh, 750px)' }}
        >
          {/* ─── Header ─── */}
          <div className="flex items-center justify-between px-5 py-3 bg-[#1a1a1a] border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-emerald-600/20 p-2">
                <ImageIcon className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-white font-semibold text-sm">Editor de Imagen</h2>
                <p className="text-gray-500 text-xs mt-0.5">
                  {item.name} — {item.width}×{item.height}px
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Undo / Redo */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-500 hover:text-white hover:bg-white/10"
                    onClick={undo}
                    disabled={historyIndex <= 0}
                  >
                    <Undo2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Deshacer (Ctrl+Z)</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-500 hover:text-white hover:bg-white/10"
                    onClick={redo}
                    disabled={historyIndex >= history.length - 1}
                  >
                    <Redo2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Rehacer (Ctrl+Shift+Z)</TooltipContent>
              </Tooltip>

              <Separator orientation="vertical" className="h-6 bg-white/10 mx-1" />

              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-gray-500 hover:text-white hover:bg-white/10 gap-1.5"
                onClick={resetAll}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Restaurar
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-500 hover:text-white hover:bg-white/10"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* ─── Main Content ─── */}
          <div className="flex flex-1 overflow-hidden">
            {/* Left Toolbar */}
            <div className="w-14 bg-[#222222] border-r border-white/10 flex flex-col items-center py-3 gap-1 shrink-0">
              <ToolButton
                icon={<Move className="h-4 w-4" />}
                label="Mover"
                active={activeTool === null}
                onClick={() => { setActiveTool(null); }}
              />
              <Separator className="w-8 bg-white/10 my-1" />
              <ToolButton icon={<RotateCw className="h-4 w-4" />} label="Rotar 90° Derecha" onClick={rotateRight} />
              <ToolButton icon={<RotateCcw className="h-4 w-4" />} label="Rotar 90° Izquierda" onClick={rotateLeft} />
              <ToolButton icon={<FlipHorizontal2 className="h-4 w-4" />} label="Voltear Horizontal" onClick={flipH} />
              <ToolButton icon={<FlipVertical2 className="h-4 w-4" />} label="Voltear Vertical" onClick={flipV} />
              <Separator className="w-8 bg-white/10 my-1" />
              <ToolButton
                icon={<Crop className="h-4 w-4" />}
                label="Recortar"
                active={activeTool === 'crop'}
                onClick={toggleCrop}
              />
              <Separator className="w-8 bg-white/10 my-1" />
              <ToolButton
                icon={<SlidersHorizontal className="h-4 w-4" />}
                label="Ajustes"
                active={activeTool === 'adjust'}
                onClick={() => setActiveTool(activeTool === 'adjust' ? null : 'adjust')}
              />

              <div className="mt-auto flex flex-col items-center gap-1">
                <ToolButton
                  icon={<ZoomIn className="h-4 w-4" />}
                  label="Acercar"
                  onClick={() => setZoom((z) => Math.min(z + 0.25, 3))}
                />
                <ToolButton
                  icon={<ZoomOut className="h-4 w-4" />}
                  label="Alejar"
                  onClick={() => setZoom((z) => Math.max(z - 0.25, 0.25))}
                />
                <ToolButton
                  icon={<Maximize2 className="h-4 w-4" />}
                  label="Ajustar"
                  onClick={() => setZoom(1)}
                />
              </div>
            </div>

            {/* Canvas Area */}
            <div
              ref={containerRef}
              className="flex-1 flex items-center justify-center bg-[#0d0d0d] overflow-hidden relative"
            >
              {/* Checkered background for transparency */}
              <div
                className="relative"
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: 'center center',
                }}
              >
                <div
                  className="checkerboard"
                  style={{
                    width: canvasSize.width || item.width,
                    height: canvasSize.height || item.height,
                    maxWidth: '70vw',
                    maxHeight: '60vh',
                    objectFit: 'contain',
                  }}
                />
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0"
                  style={{
                    maxWidth: '70vw',
                    maxHeight: '60vh',
                    objectFit: 'contain',
                  }}
                />
              </div>

              {/* Zoom indicator */}
              <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-md">
                {Math.round(zoom * 100)}%
              </div>

              {/* Image size indicator */}
              <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-md">
                {canvasSize.width || item.width} × {canvasSize.height || item.height} px
              </div>
            </div>

            {/* Right Panel — Adjustments */}
            <AnimatePresence>
              {activeTool === 'adjust' && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 280, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="bg-[#222222] border-l border-white/10 overflow-hidden shrink-0"
                >
                  <div className="w-[280px] h-full overflow-y-auto p-4 space-y-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-semibold text-sm">Ajustes</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-gray-500 hover:text-white"
                        onClick={resetAdjustments}
                      >
                        Reiniciar
                      </Button>
                    </div>

                    {/* Brightness */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4 text-amber-400 shrink-0" />
                        <Label className="text-xs text-gray-500 flex-1">Brillo</Label>
                        <span className="text-xs text-gray-500 font-mono w-8 text-right">
                          {transform.brightness > 0 ? '+' : ''}{transform.brightness}
                        </span>
                      </div>
                      <Slider
                        value={[transform.brightness]}
                        onValueChange={([v]) => setBrightness(v)}
                        min={-100}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    {/* Contrast */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Contrast className="h-4 w-4 text-blue-400 shrink-0" />
                        <Label className="text-xs text-gray-500 flex-1">Contraste</Label>
                        <span className="text-xs text-gray-500 font-mono w-8 text-right">
                          {transform.contrast > 0 ? '+' : ''}{transform.contrast}
                        </span>
                      </div>
                      <Slider
                        value={[transform.contrast]}
                        onValueChange={([v]) => setContrast(v)}
                        min={-100}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    {/* Saturation */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Droplets className="h-4 w-4 text-purple-400 shrink-0" />
                        <Label className="text-xs text-gray-500 flex-1">Saturación</Label>
                        <span className="text-xs text-gray-500 font-mono w-8 text-right">
                          {transform.saturation > 0 ? '+' : ''}{transform.saturation}
                        </span>
                      </div>
                      <Slider
                        value={[transform.saturation]}
                        onValueChange={([v]) => setSaturation(v)}
                        min={-100}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    {/* Blur */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <SlidersHorizontal className="h-4 w-4 text-teal-400 shrink-0" />
                        <Label className="text-xs text-gray-500 flex-1">Desenfoque</Label>
                        <span className="text-xs text-gray-500 font-mono w-8 text-right">
                          {transform.blur}px
                        </span>
                      </div>
                      <Slider
                        value={[transform.blur]}
                        onValueChange={([v]) => setBlur(v)}
                        min={0}
                        max={20}
                        step={0.5}
                        className="w-full"
                      />
                    </div>

                    {/* Current settings summary */}
                    <Separator className="bg-white/10" />
                    <div className="space-y-1.5">
                      <Label className="text-xs text-gray-500">Resumen de cambios</Label>
                      <div className="space-y-1 text-xs text-gray-500">
                        {transform.rotation !== 0 && (
                          <div>Rotación: {transform.rotation}°</div>
                        )}
                        {transform.flipH && <div>Volteo horizontal: Sí</div>}
                        {transform.flipV && <div>Volteo vertical: Sí</div>}
                        {transform.brightness !== 0 && (
                          <div>Brillo: {transform.brightness > 0 ? '+' : ''}{transform.brightness}</div>
                        )}
                        {transform.contrast !== 0 && (
                          <div>Contraste: {transform.contrast > 0 ? '+' : ''}{transform.contrast}</div>
                        )}
                        {transform.saturation !== 0 && (
                          <div>Saturación: {transform.saturation > 0 ? '+' : ''}{transform.saturation}</div>
                        )}
                        {transform.blur !== 0 && <div>Desenfoque: {transform.blur}px</div>}
                        {!hasChanges && <div className="italic">Sin cambios</div>}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ─── Footer ─── */}
          <div className="flex items-center justify-between px-5 py-3 bg-[#1a1a1a] border-t border-white/10">
            <div className="text-xs text-gray-500">
              {hasChanges ? (
                <span className="text-amber-400">Cambios sin guardar</span>
              ) : (
                <span>Sin cambios</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 border-gray-600 text-gray-500 hover:bg-white/10 hover:text-white"
                onClick={onClose}
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                onClick={handleSave}
                disabled={isProcessing || !hasChanges}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Guardar Cambios
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </TooltipProvider>
  );
}

// ─────────────────────────────────────────────────────────────
// Toolbar Button
// ─────────────────────────────────────────────────────────────

function ToolButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          className={`
            w-10 h-10 flex items-center justify-center rounded-lg transition-colors
            ${active
              ? 'bg-emerald-600/20 text-emerald-400'
              : 'text-gray-500 hover:text-white hover:bg-white/10'
            }
          `}
          title={label}
        >
          {icon}
        </button>
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}

export default ImageEditor;
