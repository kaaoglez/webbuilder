'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AdvancedOptions({ children, defaultOpen = false }: { children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-lg border border-dashed border-gray-400 bg-gray-100/50 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-2 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-200/60 transition-colors"
      >
        <span className="flex items-center gap-2 font-medium">
          <Settings2 className="h-4 w-4 text-gray-500" />
          Opciones Avanzadas
        </span>
        <ChevronDown className={cn("h-4 w-4 text-gray-500 transition-transform duration-200", open && "rotate-180")} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 space-y-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
