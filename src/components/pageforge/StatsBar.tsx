'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Globe, DollarSign, Zap, Layers } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SortableCardsProvider, SortableCardWrapper, DragHandle } from '@/components/pageforge/SortableCards';
import { useUIPreferencesStore } from '@/lib/ui-preferences-store';

interface Stat {
  key: string;
  value: string;
  label: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

const STATS_MAP: Record<string, Stat> = {
  'wp-sites': {
    key: 'wp-sites',
    value: '830M+',
    label: 'Sitios WordPress en el mundo',
    icon: Globe,
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-100 dark:bg-emerald-950',
  },
  'template-market': {
    key: 'template-market',
    value: '$4.7B',
    label: 'Mercado de templates/themes',
    icon: DollarSign,
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-950',
  },
  tools: {
    key: 'tools',
    value: '0',
    label: 'Herramientas como PageForge (somos la primera)',
    icon: Zap,
    color: 'text-rose-600 dark:text-rose-400',
    bgColor: 'bg-rose-100 dark:bg-rose-950',
  },
  'wp-themes': {
    key: 'wp-themes',
    value: '14K+',
    label: 'Themes en WordPress.org',
    icon: Layers,
    color: 'text-sky-600 dark:text-sky-400',
    bgColor: 'bg-sky-100 dark:bg-sky-950',
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.35,
      ease: 'easeOut',
    },
  },
};

export function StatsBar() {
  const { statsBarOrder, reorderStatsBarCards } = useUIPreferencesStore();

  const orderedStats = useMemo(
    () => statsBarOrder.map((key) => STATS_MAP[key]).filter(Boolean),
    [statsBarOrder],
  );

  return (
    <section className="mt-6">
      <Separator className="mb-6" />
      <SortableCardsProvider
        items={statsBarOrder}
        onReorder={reorderStatsBarCards}
      >
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
          initial="hidden"
          animate="visible"
        >
          {orderedStats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.key}
                variants={itemVariants}
                transition={{ delay: 0.4 + i * 0.08 }}
              >
                <SortableCardWrapper id={stat.key}>
                  <Card className="bg-gradient-to-br from-card to-muted/30 border-border/60 hover:shadow-sm transition-shadow duration-200">
                    <CardContent className="p-4 flex items-center gap-3">
                      <DragHandle className="text-gray-300 hover:text-gray-500" />
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0 ${stat.bgColor}`}
                      >
                        <Icon className={`h-5 w-5 ${stat.color}`} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xl font-bold text-foreground tracking-tight leading-none">
                          {stat.value}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 leading-snug line-clamp-2">
                          {stat.label}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </SortableCardWrapper>
              </motion.div>
            );
          })}
        </motion.div>
      </SortableCardsProvider>
    </section>
  );
}
