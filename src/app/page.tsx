'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Sidebar, Topbar, type NavItem } from '@/components/pageforge/Sidebar';
import TemplateLibrary from '@/components/pageforge/TemplateLibrary';
import MediosView from '@/components/pageforge/MediosView';

const DashboardCards = dynamic(() => import('@/components/pageforge/DashboardCards').then(m => ({ default: m.DashboardCards })));
const StatsBar = dynamic(() => import('@/components/pageforge/StatsBar').then(m => ({ default: m.StatsBar })));
const ThemeEditor = dynamic(() => import('@/components/pageforge/ThemeEditor'));
const PluginEditor = dynamic(() => import('@/components/pageforge/PluginEditor'));
const MyProjects = dynamic(() => import('@/components/pageforge/MyProjects'));
import {
  Palette,
  Puzzle,
  BookOpen,
  FolderOpen,
  ImageIcon,
  Settings,
  LayoutDashboard,
  Construction,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

/* ─── Placeholder panels for non-dashboard views ─── */
function PlaceholderPanel({
  item,
  onNavigate,
}: {
  item: NavItem;
  onNavigate: (item: NavItem) => void;
}) {
  const configs: Record<
    NavItem,
    { icon: React.ElementType; title: string; description: string; status: string }
  > = {
    dashboard: {
      icon: LayoutDashboard,
      title: 'Dashboard',
      description: 'Vista general de PageForge v2',
      status: 'active',
    },
    'create-theme': {
      icon: Palette,
      title: 'Crear WordPress Theme',
      description:
        'Motor visual de generacion de themes WordPress. Disena secciones, elige colores y fuentes, configura la jerarquia de templates de WordPress y exporta un ZIP listo para instalar.',
      status: 'pronto',
    },
    'create-plugin': {
      icon: Puzzle,
      title: 'Crear WordPress Plugin',
      description:
        'Generador visual de plugins WordPress. Formularios de contacto, sliders, custom post types, shortcodes, widgets, social share y mas. Sin escribir una sola linea de PHP.',
      status: 'pronto',
    },
    'my-projects': {
      icon: FolderOpen,
      title: 'Mis Proyectos',
      description:
        'Gestiona todos tus themes y plugins creados. Re-edita, re-exporta, duplica o elimina proyectos. Historial completo de versiones.',
      status: 'pronto',
    },
    templates: {
      icon: BookOpen,
      title: 'Template Library',
      description:
        'Biblioteca de templates preconstruidos por industria. Restaurantes, Portafolios, SaaS, Agencias, E-commerce, Blogs. Contenido demo real incluido.',
      status: 'pronto',
    },
    medios: {
      icon: ImageIcon,
      title: 'Biblioteca de Medios',
      description:
        'Gestiona tus imagenes y archivos multimedia. Sube, edita, recorta y organiza todos los medios de tus proyectos WordPress.',
      status: 'active',
    },
    settings: {
      icon: Settings,
      title: 'Configuracion',
      description:
        'Ajustes de cuenta, preferencias de exportacion, configuracion de servidor, API keys y mas.',
      status: 'pronto',
    },
  };

  const config = configs[item];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-center min-h-[60vh]"
    >
      <Card className="max-w-lg w-full border-dashed border-2 border-border/80">
        <CardContent className="p-8 text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center mb-5">
            <Icon className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">{config.title}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            {config.description}
          </p>
          <div className="flex items-center justify-center gap-2 mb-6">
            <Construction className="h-4 w-4 text-amber-500" />
            <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400 border-0">
              En desarrollo
            </Badge>
          </div>
          <Button
            variant="outline"
            onClick={() => onNavigate('dashboard')}
            className="gap-2"
          >
            <LayoutDashboard className="h-4 w-4" />
            Volver al Dashboard
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ─── Main Page ─── */
export default function PageForgeApp() {
  const [activeItem, setActiveItem] = useState<NavItem>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleNavigate = (item: NavItem) => {
    setActiveItem(item);
  };

  const isDashboard = activeItem === 'dashboard';
  const isThemeEditor = activeItem === 'create-theme';
  const isPluginEditor = activeItem === 'create-plugin';
  const isTemplates = activeItem === 'templates';
  const isMyProjects = activeItem === 'my-projects';
  const isMedios = activeItem === 'medios';

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-background">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          activeItem={activeItem}
          onNavigate={handleNavigate}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Topbar */}
          <Topbar activeItem={activeItem} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

          {/* Scrollable content */}
          <main className={(isThemeEditor || isPluginEditor) ? 'flex-1 overflow-hidden' : 'flex-1 overflow-y-auto'}>
            <div className={isThemeEditor || isPluginEditor ? 'h-full' : isMedios ? 'max-w-7xl mx-auto' : 'p-4 md:p-6 lg:p-8 max-w-7xl mx-auto'}>
              {isDashboard ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Welcome header */}
                  <div className="mb-8">
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                    >
                      <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                        Bienvenido a PageForge{' '}
                        <span className="text-emerald-600 dark:text-emerald-400">v2</span>
                      </h1>
                      <p className="text-muted-foreground text-sm mt-2 max-w-2xl">
                        El primer generador visual de themes y plugins de WordPress que funciona
                        sin WordPress. Disena, genera y exporta.
                      </p>
                    </motion.div>
                  </div>

                  {/* Quick stats banner */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.15 }}
                    className="mb-8"
                  >
                    <Card className="border-emerald-200 dark:border-emerald-900 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 overflow-hidden">
                      <CardContent className="p-5 relative">
                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-200/30 dark:bg-emerald-800/20 rounded-full -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-1/3 w-24 h-24 bg-teal-200/20 dark:bg-teal-800/15 rounded-full translate-y-1/2" />

                        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-emerald-900 dark:text-emerald-200 text-base">
                              WordPress Theme & Plugin Generator
                            </h3>
                            <p className="text-emerald-700/80 dark:text-emerald-400/80 text-sm mt-1 leading-relaxed">
                              Crea themes y plugins de WordPress de forma visual. Exporta archivos PHP
                              validos como ZIP, listo para instalar en cualquier sitio WordPress.
                            </p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Badge className="bg-emerald-600 text-white border-0 text-[11px] font-semibold">
                              v2.0
                            </Badge>
                            <Badge variant="outline" className="border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400 text-[11px]">
                              Beta
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Dashboard action cards */}
                  <DashboardCards onNavigate={handleNavigate} />

                  {/* Stats bar */}
                  <StatsBar />
                </motion.div>
              ) : isThemeEditor ? (
                <ThemeEditor />
              ) : isPluginEditor ? (
                <PluginEditor />
              ) : isTemplates ? (
                <TemplateLibrary onNavigate={handleNavigate} />
              ) : isMyProjects ? (
                <MyProjects onNavigate={handleNavigate} />
              ) : isMedios ? (
                <MediosView />
              ) : (
                <PlaceholderPanel item={activeItem} onNavigate={handleNavigate} />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
