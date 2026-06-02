'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Palette,
  Layout,
  Monitor,
  Download,
  Sparkles,
  Eye,
  Layers,
  FileCode2,
  Globe,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSettingsStore } from '@/lib/settings-store';

interface Step {
  icon: React.ReactNode;
  title: string;
  description: string;
  tip?: string;
}

const STEPS: Step[] = [
  {
    icon: <Globe className="h-8 w-8" />,
    title: 'Bienvenido a PageForge v2',
    description:
      'Crea themes de WordPress de forma 100% visual. Sin escribir código PHP, CSS o HTML. Arrastra, configura y exporta.',
    tip: 'Todo lo que crees aquí se genera como archivos WordPress listos para instalar.',
  },
  {
    icon: <Layers className="h-8 w-8" />,
    title: 'Elige una Plantilla Profesional',
    description:
      'No empieces desde cero. Selecciona entre 16 plantillas por industria: restaurantes, clínicas, portafolios, SaaS y más. Cada una incluye contenido demo real.',
  },
  {
    icon: <Layout className="h-8 w-8" />,
    title: 'Personaliza Cada Sección',
    description:
      'Modifica textos, colores, fuentes e imágenes con clicks. Organiza secciones con drag & drop. El editor se adapta a ti, no al revés.',
  },
  {
    icon: <Monitor className="h-8 w-8" />,
    title: 'Vista Previa en Tiempo Real',
    description:
      'Mira cómo queda tu theme en Desktop, Tablet o Móvil mientras editas. Sin necesidad de instalar WordPress.',
  },
  {
    icon: <Eye className="h-8 w-8" />,
    title: 'Campos Técnicos Ocultos',
    description:
      'Los campos técnicos (slugs, versiones, widgets de WordPress) están ocultos por defecto. Encuéntralos en "Opciones Avanzadas" cuando los necesites.',
  },
  {
    icon: <FileCode2 className="h-8 w-8" />,
    title: 'Exporta tu Theme WordPress',
    description:
      'Cuando estés listo, genera un ZIP con todos los archivos PHP necesarios. Súbelo a tu WordPress como cualquier otro theme.',
  },
];

export function OnboardingOverlay() {
  const { hasOnboarded, updateSettings } = useSettingsStore();
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(true);

  if (hasOnboarded) return null;
  if (!visible) return null;

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const isFirst = step === 0;

  const handleFinish = () => {
    updateSettings({ hasOnboarded: true });
    setVisible(false);
  };

  const handleSkip = () => {
    updateSettings({ hasOnboarded: true });
    setVisible(false);
  };

  const handleNext = () => {
    if (isLast) {
      handleFinish();
    } else {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleSkip} />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header gradient */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 px-6 pt-6 pb-8 relative">
              {/* Close button */}
              <button
                onClick={handleSkip}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <X className="h-4 w-4 text-white" />
              </button>

              {/* Step icon */}
              <motion.div
                key={step}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white mb-4"
              >
                {current.icon}
              </motion.div>

              {/* Progress dots */}
              <div className="flex items-center gap-2 mt-2">
                {STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === step
                        ? 'w-8 bg-white'
                        : i < step
                          ? 'w-3 bg-white/60'
                          : 'w-3 bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="px-6 pb-6 -mt-4">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <motion.h2
                  key={`title-${step}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="text-xl font-bold text-gray-900 mb-3"
                >
                  {current.title}
                </motion.h2>

                <motion.p
                  key={`desc-${step}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: 0.05 }}
                  className="text-sm text-gray-600 leading-relaxed mb-4"
                >
                  {current.description}
                </motion.p>

                {current.tip && (
                  <motion.div
                    key={`tip-${step}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: 0.1 }}
                    className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-4"
                  >
                    <div className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                      <p className="text-xs text-amber-800 leading-relaxed">{current.tip}</p>
                    </div>
                  </motion.div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between gap-3 mt-5">
                  <div className="flex items-center gap-2">
                    {!isFirst && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePrev}
                        className="gap-1.5 text-gray-600"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Anterior
                      </Button>
                    )}
                    {!isFirst && (
                      <button
                        onClick={handleSkip}
                        className="text-xs text-gray-400 hover:text-gray-600 transition-colors px-2"
                      >
                        Saltar
                      </button>
                    )}
                  </div>

                  <Button
                    onClick={handleNext}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                  >
                    {isLast ? 'Comenzar' : 'Siguiente'}
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Step counter */}
              <p className="text-center text-[11px] text-gray-400 mt-3">
                Paso {step + 1} de {STEPS.length}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
