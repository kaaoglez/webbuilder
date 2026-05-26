'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Palette,
  Puzzle,
  BookOpen,
  FolderOpen,
  ArrowRight,
  Sparkles,
  Code,
  Layers,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SortableCardsProvider, SortableCardWrapper, DragHandle } from '@/components/pageforge/SortableCards';
import { useUIPreferencesStore } from '@/lib/ui-preferences-store';
import type { NavItem } from './Sidebar';

interface DashboardCardsProps {
  onNavigate: (item: NavItem) => void;
}

interface ActionCard {
  id: NavItem;
  title: string;
  description: string;
  buttonText: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  stats: string[];
  accentBorder: string;
}

const CARDS_MAP: Record<string, ActionCard> = {
  'create-theme': {
    id: 'create-theme',
    title: 'Crear WordPress Theme',
    description:
      'Disena visualmente tu theme de WordPress. Elige secciones, colores, fuentes. Exporta como ZIP listo para instalar.',
    buttonText: 'Crear Theme',
    icon: Palette,
    iconBg: 'bg-emerald-100 dark:bg-emerald-950',
    iconColor: 'text-emerald-700 dark:text-emerald-400',
    stats: ['15+ secciones', '7 categorias', 'PHP valido'],
    accentBorder: 'border-l-emerald-500',
  },
  'create-plugin': {
    id: 'create-plugin',
    title: 'Crear WordPress Plugin',
    description:
      'Genera plugins de WordPress sin codigo. Formularios, sliders, shortcodes, widgets y mas.',
    buttonText: 'Crear Plugin',
    icon: Puzzle,
    iconBg: 'bg-amber-100 dark:bg-amber-950',
    iconColor: 'text-amber-700 dark:text-amber-400',
    stats: ['15 tipos de plugins', 'Configuracion visual', 'ZIP descargable'],
    accentBorder: 'border-l-amber-500',
  },
  templates: {
    id: 'templates',
    title: 'Template Library',
    description:
      'Templates preconstruidos por industria: Restaurantes, Portafolios, SaaS, Agencias, E-commerce, Blogs.',
    buttonText: 'Explorar Templates',
    icon: BookOpen,
    iconBg: 'bg-violet-100 dark:bg-violet-950',
    iconColor: 'text-violet-700 dark:text-violet-400',
    stats: ['7 industrias', 'Demo content', '1-click import'],
    accentBorder: 'border-l-violet-500',
  },
  'my-projects': {
    id: 'my-projects',
    title: 'Mis Proyectos',
    description:
      'Tus themes y plugins guardados. Edita, re-exporta, gestiona tus creaciones.',
    buttonText: 'Ver Proyectos',
    icon: FolderOpen,
    iconBg: 'bg-sky-100 dark:bg-sky-950',
    iconColor: 'text-sky-700 dark:text-sky-400',
    stats: ['Auto-save', 'Re-export', 'Gestion central'],
    accentBorder: 'border-l-sky-500',
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

export function DashboardCards({ onNavigate }: DashboardCardsProps) {
  const { dashboardCardOrder, reorderDashboardCards } = useUIPreferencesStore();

  const orderedCards = useMemo(
    () => dashboardCardOrder.map((id) => CARDS_MAP[id]).filter(Boolean),
    [dashboardCardOrder],
  );

  return (
    <section>
      <div className="flex items-center gap-2 mb-5">
        <Sparkles className="h-5 w-5 text-emerald-600" />
        <h2 className="text-lg font-semibold text-foreground">Acciones Rapidas</h2>
      </div>

      <SortableCardsProvider
        items={dashboardCardOrder}
        onReorder={reorderDashboardCards}
      >
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5"
          initial="hidden"
          animate="visible"
        >
          {orderedCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.id}
                variants={cardVariants}
                transition={{ delay: i * 0.1 }}
              >
                <SortableCardWrapper id={card.id}>
                  <Card
                    className={cn(
                      'group relative overflow-hidden border-l-4 cursor-pointer transition-all duration-300',
                      'hover:shadow-md hover:-translate-y-0.5',
                      card.accentBorder
                    )}
                    onClick={() => onNavigate(card.id)}
                  >
                    {/* Subtle gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-emerald-50/50 dark:to-emerald-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-3">
                        <DragHandle className="mt-0.5" />
                        <div
                          className={cn(
                            'flex items-center justify-center w-11 h-11 rounded-xl flex-shrink-0 transition-transform duration-300 group-hover:scale-110',
                            card.iconBg
                          )}
                        >
                          <Icon className={cn('h-5 w-5', card.iconColor)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base">{card.title}</CardTitle>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pb-3">
                      <CardDescription className="text-sm leading-relaxed">
                        {card.description}
                      </CardDescription>
                    </CardContent>

                    <CardFooter className="flex items-center justify-between pt-0">
                      <div className="flex flex-wrap gap-1.5">
                        {card.stats.map((stat) => (
                          <Badge
                            key={stat}
                            variant="secondary"
                            className="text-[11px] font-medium bg-muted/60 text-muted-foreground px-2 py-0"
                          >
                            {stat}
                          </Badge>
                        ))}
                      </div>
                      <Button
                        size="sm"
                        className="gap-1.5 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white transition-all duration-200 group-hover:gap-2.5"
                      >
                        {card.buttonText}
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </Button>
                    </CardFooter>
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
