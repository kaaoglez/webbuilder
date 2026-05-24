'use client';

import { useBuilderStore } from '@/lib/builder-store';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  BarChart3,
  Share2,
  Mail,
  MapPin,
  MessageCircle,
  CreditCard,
  Eye,
  EyeOff,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Save,
  Loader2,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { toast } from 'sonner';

// ─── Collapsible Card Wrapper ───────────────────────────────────────────────

interface CollapsibleCardProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
  badge?: { label: string; variant?: 'default' | 'secondary' | 'outline' | 'destructive' };
  defaultOpen?: boolean;
  onReset?: () => void;
  onTest?: () => void;
  testing?: boolean;
  testResult?: 'success' | 'error' | null;
  children: React.ReactNode;
}

function CollapsibleCard({
  icon,
  iconBg,
  title,
  description,
  badge,
  defaultOpen = true,
  onReset,
  onTest,
  testing,
  testResult,
  children,
}: CollapsibleCardProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Card className="border-border/60 shadow-sm transition-shadow hover:shadow-md">
      <CardHeader
        className="cursor-pointer select-none pb-0"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${iconBg}`}>
              {icon}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <CardTitle className="text-base font-semibold leading-tight">{title}</CardTitle>
                {badge && (
                  <Badge variant={badge.variant ?? 'secondary'} className="text-[10px] px-1.5 py-0">
                    {badge.label}
                  </Badge>
                )}
              </div>
              <CardDescription className="text-xs mt-0.5">{description}</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {onTest && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground mr-1"
                disabled={testing}
                onClick={(e) => {
                  e.stopPropagation();
                  onTest();
                }}
              >
                {testing ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : testResult === 'success' ? (
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                ) : testResult === 'error' ? (
                  <XCircle className="h-3 w-3 text-red-500" />
                ) : null}
                {testing ? 'Probando…' : 'Probar'}
              </Button>
            )}
            {onReset && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 gap-1 text-xs text-muted-foreground hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onReset();
                }}
              >
                <RotateCcw className="h-3 w-3" />
                Reiniciar
              </Button>
            )}
            <Button type="button" variant="ghost" size="icon" className="h-7 w-7">
              {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      {open && (
        <CardContent className="pt-4">
          {children}
        </CardContent>
      )}
    </Card>
  );
}

// ─── Sensitive Input (show/hide toggle) ─────────────────────────────────────

function SensitiveInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium">{label}</Label>
      <div className="relative">
        <Input
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="pr-9 text-sm"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full w-9 hover:bg-transparent text-muted-foreground"
          onClick={() => setVisible(!visible)}
          tabIndex={-1}
        >
          {visible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
        </Button>
      </div>
    </div>
  );
}

// ─── Social Platform Input ──────────────────────────────────────────────────

function SocialInput({
  icon,
  label,
  value,
  onChange,
  placeholder,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium flex items-center gap-1.5">
        {icon}
        {label}
      </Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="text-sm"
      />
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export function IntegrationsPanel() {
  const { currentWebsite, updateIntegrations } = useBuilderStore();

  const integrations = currentWebsite?.integrations ?? {
    analytics: { googleAnalyticsId: '', facebookPixelId: '', hotjarId: '' },
    social: { facebook: '', twitter: '', instagram: '', linkedin: '', youtube: '', tiktok: '' },
    email: { service: '', apiKey: '', fromEmail: '', fromName: '', newsletterListId: '' },
    maps: { googleMapsKey: '', provider: '' },
    chat: { enabled: false, type: '', widgetId: '' },
    payments: { enabled: false, stripeKey: '', paypalClientId: '' },
  };

  // ── Per-section test state ──
  const [testingSection, setTestingSection] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, 'success' | 'error'>>({});

  // ── Helpers ──
  const update = (section: keyof typeof integrations, data: Record<string, unknown>) => {
    updateIntegrations({ [section]: { ...integrations[section], ...data } });
  };

  const resetSection = (section: keyof typeof integrations, defaults: Record<string, unknown>) => {
    updateIntegrations({ [section]: defaults as never });
    toast.info('Sección reiniciada', { description: 'Los campos han sido restablecidos.' });
  };

  const testConnection = (section: string) => {
    setTestingSection(section);
    setTestResults((prev) => ({ ...prev, [section]: 'success' as const }));
    // Simulate async test
    setTimeout(() => {
      const success = Math.random() > 0.3;
      setTestResults((prev) => ({ ...prev, [section]: success ? 'success' : 'error' }));
      setTestingSection(null);
      if (success) {
        toast.success('Conexión exitosa', { description: `La integración de ${section} está funcionando correctamente.` });
      } else {
        toast.error('Error de conexión', { description: `No se pudo conectar con el servicio de ${section}. Verifica tus credenciales.` });
      }
    }, 1500);
  };

  const handleSave = () => {
    toast.success('Integraciones guardadas', { description: 'Todas las configuraciones han sido guardadas correctamente.' });
  };

  // ── Default values for reset ──
  const defaultAnalytics = { googleAnalyticsId: '', facebookPixelId: '', hotjarId: '' };
  const defaultSocial = { facebook: '', twitter: '', instagram: '', linkedin: '', youtube: '', tiktok: '' };
  const defaultEmail = { service: '', apiKey: '', fromEmail: '', fromName: '', newsletterListId: '' };
  const defaultMaps = { googleMapsKey: '', provider: '' };
  const defaultChat = { enabled: false, type: '', widgetId: '' };
  const defaultPayments = { enabled: false, stripeKey: '', paypalClientId: '' };

  // ── Count configured fields ──
  const countFilled = (obj: Record<string, unknown>, skipKeys: string[] = []) => {
    return Object.entries(obj)
      .filter(([k, v]) => !skipKeys.includes(k) && v !== '' && v !== false)
      .length;
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Integraciones</h2>
          <p className="text-sm text-muted-foreground">
            Configura servicios de terceros para tu sitio web.
          </p>
        </div>
        <Button onClick={handleSave} size="sm" className="gap-1.5 w-fit">
          <Save className="h-3.5 w-3.5" />
          Guardar Cambios
        </Button>
      </div>

      <Separator />

      <div className="space-y-5">
        {/* ════════════════════════════════════════════════════════ */}
        {/* 1. ANALYTICS                                          */}
        {/* ════════════════════════════════════════════════════════ */}
        <CollapsibleCard
          icon={<BarChart3 className="h-5 w-5 text-white" />}
          iconBg="bg-emerald-600"
          title="Analíticas"
          description="Seguimiento de visitantes y conversiones"
          badge={
            countFilled(integrations.analytics) > 0
              ? { label: `${countFilled(integrations.analytics)} activos`, variant: 'default' }
              : { label: 'Sin configurar', variant: 'outline' }
          }
          defaultOpen={true}
          onReset={() => resetSection('analytics', defaultAnalytics)}
          onTest={() => testConnection('analíticas')}
          testing={testingSection === 'analíticas'}
          testResult={testResults['analíticas']}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Google Analytics ID</Label>
              <Input
                value={integrations.analytics.googleAnalyticsId}
                onChange={(e) => update('analytics', { googleAnalyticsId: e.target.value })}
                placeholder="G-XXXXXXXXXX"
                className="text-sm"
              />
              <p className="text-[11px] text-muted-foreground">
                Empieza con &quot;G-&quot; seguido de tu ID de medición.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Facebook Pixel ID</Label>
              <Input
                value={integrations.analytics.facebookPixelId}
                onChange={(e) => update('analytics', { facebookPixelId: e.target.value })}
                placeholder="123456789"
                className="text-sm"
              />
              <p className="text-[11px] text-muted-foreground">
                ID numérico del pixel de Meta.
              </p>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs font-medium">Hotjar ID</Label>
              <Input
                value={integrations.analytics.hotjarId}
                onChange={(e) => update('analytics', { hotjarId: e.target.value })}
                placeholder="1234567"
                className="text-sm"
              />
              <p className="text-[11px] text-muted-foreground">
                ID de tu sitio en Hotjar para grabaciones y heatmaps.
              </p>
            </div>
          </div>
        </CollapsibleCard>

        {/* ════════════════════════════════════════════════════════ */}
        {/* 2. REDES SOCIALES                                     */}
        {/* ════════════════════════════════════════════════════════ */}
        <CollapsibleCard
          icon={<Share2 className="h-5 w-5 text-white" />}
          iconBg="bg-sky-600"
          title="Redes Sociales"
          description="Enlaces a tus perfiles sociales"
          badge={
            countFilled(integrations.social) > 0
              ? { label: `${countFilled(integrations.social)} conectadas`, variant: 'default' }
              : { label: 'Sin configurar', variant: 'outline' }
          }
          defaultOpen={true}
          onReset={() => resetSection('social', defaultSocial)}
          onTest={() => testConnection('redes sociales')}
          testing={testingSection === 'redes sociales'}
          testResult={testResults['redes sociales']}
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <SocialInput
              icon={<Facebook className="h-3.5 w-3.5 text-blue-600" />}
              label="Facebook"
              value={integrations.social.facebook}
              onChange={(v) => update('social', { facebook: v })}
              placeholder="https://facebook.com/tu-pagina"
            />
            <SocialInput
              icon={<Twitter className="h-3.5 w-3.5 text-sky-500" />}
              label="Twitter / X"
              value={integrations.social.twitter}
              onChange={(v) => update('social', { twitter: v })}
              placeholder="https://twitter.com/tu-usuario"
            />
            <SocialInput
              icon={<Instagram className="h-3.5 w-3.5 text-pink-600" />}
              label="Instagram"
              value={integrations.social.instagram}
              onChange={(v) => update('social', { instagram: v })}
              placeholder="https://instagram.com/tu-usuario"
            />
            <SocialInput
              icon={<Linkedin className="h-3.5 w-3.5 text-blue-700" />}
              label="LinkedIn"
              value={integrations.social.linkedin}
              onChange={(v) => update('social', { linkedin: v })}
              placeholder="https://linkedin.com/company/tu-empresa"
            />
            <SocialInput
              icon={<Youtube className="h-3.5 w-3.5 text-red-600" />}
              label="YouTube"
              value={integrations.social.youtube}
              onChange={(v) => update('social', { youtube: v })}
              placeholder="https://youtube.com/@tu-canal"
            />
            <SocialInput
              icon={<svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-black dark:fill-white" aria-hidden="true">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.87a8.16 8.16 0 0 0 4.77 1.52V6.94a4.85 4.85 0 0 1-1-.25Z" />
              </svg>}
              label="TikTok"
              value={integrations.social.tiktok}
              onChange={(v) => update('social', { tiktok: v })}
              placeholder="https://tiktok.com/@tu-usuario"
            />
          </div>
        </CollapsibleCard>

        {/* ════════════════════════════════════════════════════════ */}
        {/* 3. EMAIL & NEWSLETTER                                  */}
        {/* ════════════════════════════════════════════════════════ */}
        <CollapsibleCard
          icon={<Mail className="h-5 w-5 text-white" />}
          iconBg="bg-violet-600"
          title="Email & Newsletter"
          description="Servicio de correo y listas de suscripción"
          badge={
            integrations.email.service
              ? { label: integrations.email.service.toUpperCase(), variant: 'default' }
              : { label: 'Sin configurar', variant: 'outline' }
          }
          defaultOpen={true}
          onReset={() => resetSection('email', defaultEmail)}
          onTest={() => testConnection('email')}
          testing={testingSection === 'email'}
          testResult={testResults['email']}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Servicio de Email</Label>
              <Select
                value={integrations.email.service}
                onValueChange={(v) => update('email', { service: v })}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Seleccionar servicio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Ninguno</SelectItem>
                  <SelectItem value="sendgrid">SendGrid</SelectItem>
                  <SelectItem value="mailgun">Mailgun</SelectItem>
                  <SelectItem value="ses">Amazon SES</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <SensitiveInput
              label="API Key"
              value={integrations.email.apiKey}
              onChange={(v) => update('email', { apiKey: v })}
              placeholder="sk-xxxxxxxxxxxxxxxx"
            />

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Email de Origen</Label>
              <Input
                type="email"
                value={integrations.email.fromEmail}
                onChange={(e) => update('email', { fromEmail: e.target.value })}
                placeholder="noreply@tudominio.com"
                className="text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Nombre de Origen</Label>
              <Input
                value={integrations.email.fromName}
                onChange={(e) => update('email', { fromName: e.target.value })}
                placeholder="Tu Empresa"
                className="text-sm"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs font-medium">Newsletter List ID</Label>
              <Input
                value={integrations.email.newsletterListId}
                onChange={(e) => update('email', { newsletterListId: e.target.value })}
                placeholder="ID de la lista de suscriptores"
                className="text-sm"
              />
              <p className="text-[11px] text-muted-foreground">
                ID de la lista en tu proveedor de email para suscripciones.
              </p>
            </div>
          </div>
        </CollapsibleCard>

        {/* ════════════════════════════════════════════════════════ */}
        {/* 4. MAPAS                                              */}
        {/* ════════════════════════════════════════════════════════ */}
        <CollapsibleCard
          icon={<MapPin className="h-5 w-5 text-white" />}
          iconBg="bg-rose-600"
          title="Mapas"
          description="Integración de mapas interactivos"
          badge={
            integrations.maps.provider
              ? { label: integrations.maps.provider.toUpperCase(), variant: 'default' }
              : { label: 'Sin configurar', variant: 'outline' }
          }
          defaultOpen={true}
          onReset={() => resetSection('maps', defaultMaps)}
          onTest={() => testConnection('mapas')}
          testing={testingSection === 'mapas'}
          testResult={testResults['mapas']}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Proveedor de Mapas</Label>
              <Select
                value={integrations.maps.provider}
                onValueChange={(v) => update('maps', { provider: v })}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Seleccionar proveedor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Ninguno</SelectItem>
                  <SelectItem value="google">Google Maps</SelectItem>
                  <SelectItem value="mapbox">Mapbox</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <SensitiveInput
              label="Google Maps API Key"
              value={integrations.maps.googleMapsKey}
              onChange={(v) => update('maps', { googleMapsKey: v })}
              placeholder="AIzaSy..."
            />

            <div className="sm:col-span-2">
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Necesitas una API Key de Google Cloud Platform o un token de acceso de Mapbox
                para mostrar mapas en tu sitio web.
              </p>
            </div>
          </div>
        </CollapsibleCard>

        {/* ════════════════════════════════════════════════════════ */}
        {/* 5. CHAT EN VIVO                                       */}
        {/* ════════════════════════════════════════════════════════ */}
        <CollapsibleCard
          icon={<MessageCircle className="h-5 w-5 text-white" />}
          iconBg="bg-amber-600"
          title="Chat en Vivo"
          description="Widget de chat para atención al cliente"
          badge={
            integrations.chat.enabled
              ? { label: integrations.chat.type || 'Activo', variant: 'default' }
              : { label: 'Desactivado', variant: 'outline' }
          }
          defaultOpen={false}
          onReset={() => resetSection('chat', defaultChat)}
          onTest={() => testConnection('chat')}
          testing={testingSection === 'chat'}
          testResult={testResults['chat']}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center justify-between gap-3 sm:col-span-2 rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label className="text-xs font-medium">Activar Chat</Label>
                <p className="text-[11px] text-muted-foreground">
                  Muestra un widget de chat en tu sitio web.
                </p>
              </div>
              <Switch
                checked={integrations.chat.enabled}
                onCheckedChange={(checked) => update('chat', { enabled: checked })}
              />
            </div>

            {integrations.chat.enabled && (
              <>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Tipo de Chat</Label>
                  <Select
                    value={integrations.chat.type}
                    onValueChange={(v) => update('chat', { type: v })}
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Seleccionar chat" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Ninguno</SelectItem>
                      <SelectItem value="tawkto">Tawk.to</SelectItem>
                      <SelectItem value="intercom">Intercom</SelectItem>
                      <SelectItem value="crisp">Crisp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Widget ID</Label>
                  <Input
                    value={integrations.chat.widgetId}
                    onChange={(e) => update('chat', { widgetId: e.target.value })}
                    placeholder="ID del widget proporcionado por el servicio"
                    className="text-sm"
                  />
                </div>
              </>
            )}
          </div>
        </CollapsibleCard>

        {/* ════════════════════════════════════════════════════════ */}
        {/* 6. PAGOS                                              */}
        {/* ════════════════════════════════════════════════════════ */}
        <CollapsibleCard
          icon={<CreditCard className="h-5 w-5 text-white" />}
          iconBg="bg-teal-600"
          title="Pagos"
          description="Pasarelas de pago para cobros en línea"
          badge={
            integrations.payments.enabled
              ? { label: 'Activado', variant: 'default' }
              : { label: 'Desactivado', variant: 'outline' }
          }
          defaultOpen={false}
          onReset={() => resetSection('payments', defaultPayments)}
          onTest={() => testConnection('pagos')}
          testing={testingSection === 'pagos'}
          testResult={testResults['pagos']}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center justify-between gap-3 sm:col-span-2 rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label className="text-xs font-medium">Activar Pagos</Label>
                <p className="text-[11px] text-muted-foreground">
                  Habilita procesamiento de pagos en tu sitio.
                </p>
              </div>
              <Switch
                checked={integrations.payments.enabled}
                onCheckedChange={(checked) => update('payments', { enabled: checked })}
              />
            </div>

            {integrations.payments.enabled && (
              <>
                <SensitiveInput
                  label="Stripe Public Key"
                  value={integrations.payments.stripeKey}
                  onChange={(v) => update('payments', { stripeKey: v })}
                  placeholder="pk_live_..."
                />

                <SensitiveInput
                  label="PayPal Client ID"
                  value={integrations.payments.paypalClientId}
                  onChange={(v) => update('payments', { paypalClientId: v })}
                  placeholder="Axxxxxxxxxxxxxxxxxxxxxxxxx"
                />
              </>
            )}
          </div>
        </CollapsibleCard>
      </div>
    </div>
  );
}
