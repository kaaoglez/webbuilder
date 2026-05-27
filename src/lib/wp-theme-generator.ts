// ═══════════════════════════════════════════════════════════════
// PAGEFORGE v2 — WordPress Theme Generator Engine
// Generates valid, installable WordPress theme files from a
// TypeScript configuration object. Server-side code only.
// ═══════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────
// Interfaces
// ─────────────────────────────────────────────────────────────

export interface ThemeConfig {
  // Theme metadata
  name: string;
  slug: string;
  description: string;
  version: string;
  author: string;
  authorUri: string;
  textDomain: string;

  // Branding
  siteTitle: string;
  logoUrl: string;
  tagline: string;

  // Design settings
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  headingFont: string;
  bodyFont: string;
  borderRadius: number;

  // Content sections (ordered array)
  sections: ThemeSection[];

  // Navigation
  navItems: NavItemConfig[];

  // Footer
  footerColumns: FooterColumn[];
  copyrightText: string;
  socialLinks: SocialLink[];

  // Page Templates (auxiliary templates)
  pageTemplates?: PageTemplateConfig[];
}

export interface ThemeSection {
  type: 'hero' | 'about' | 'services' | 'testimonials' | 'pricing' | 'cta' | 'contact' | 'gallery' | 'faq' | 'stats' | 'team' | 'blog_posts' | 'features';
  enabled: boolean;
  title: string;
  subtitle?: string;
  data: Record<string, any>;
}

export interface NavItemConfig {
  label: string;
  url: string;
}

export interface FooterColumn {
  title: string;
  links: Array<{ label: string; url: string }>;
}

export interface SocialLink {
  platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'youtube';
  url: string;
}

export interface PageTemplateConfig {
  id: string;
  name: string;
  description: string;
  type: 'predesigned' | 'custom';
  slug: string;
  enabled: boolean;
  layout: 'full-width' | 'with-sidebar-left' | 'with-sidebar-right';
  options: Record<string, boolean>;
  sections: ThemeSection[];
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function esc(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function fontImportUrl(font: string): string {
  if (!font) return 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap';
  return `https://fonts.googleapis.com/css2?family=${font.replace(/ /g, '+')}:wght@400;500;600;700;800&display=swap`;
}

// ─────────────────────────────────────────────────────────────
// Config Normalizer — Fills missing fields with sensible defaults
// ─────────────────────────────────────────────────────────────

export function normalizeConfig(partial: Partial<ThemeConfig> | any): ThemeConfig {
  const theme = partial.theme || {};
  return {
    name: partial.name || 'My WordPress Theme',
    slug: partial.slug || partial.textDomain || 'my-theme',
    description: partial.description || 'A professional WordPress theme generated with PageForge',
    version: partial.version || '1.0.0',
    author: partial.author || 'PageForge',
    authorUri: partial.authorUri || 'https://pageforge.dev',
    textDomain: partial.textDomain || partial.slug || 'my-theme',
    siteTitle: partial.siteTitle || partial.name || 'Mi Sitio Web',
    logoUrl: partial.logoUrl || '',
    tagline: partial.tagline || partial.description || '',
    primaryColor: partial.primaryColor || theme.primaryColor || '#2563EB',
    secondaryColor: partial.secondaryColor || theme.secondaryColor || '#7C3AED',
    accentColor: partial.accentColor || theme.accentColor || '#F59E0B',
    backgroundColor: partial.backgroundColor || theme.backgroundColor || '#FFFFFF',
    textColor: partial.textColor || theme.textColor || '#1F2937',
    headingFont: partial.headingFont || theme.headingFont || 'Inter',
    bodyFont: partial.bodyFont || theme.bodyFont || 'Inter',
    borderRadius: partial.borderRadius || (typeof theme.borderRadius === 'number' ? theme.borderRadius : 8),
    sections: partial.sections || DEFAULT_THEME_CONFIG.sections,
    navItems: partial.navItems || DEFAULT_THEME_CONFIG.navItems,
    footerColumns: partial.footerColumns || DEFAULT_THEME_CONFIG.footerColumns,
    copyrightText: partial.copyrightText || DEFAULT_THEME_CONFIG.copyrightText,
    socialLinks: partial.socialLinks || DEFAULT_THEME_CONFIG.socialLinks,
    pageTemplates: partial.pageTemplates || [],
  };
}

function br(radius: number): string {
  return `${radius}px`;
}

function slug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// ═══════════════════════════════════════════════════════════════
// 1. style.css — WordPress Theme Header
// ═══════════════════════════════════════════════════════════════

export function generateStyleCSS(config: ThemeConfig): string {
  return `/*
Theme Name: ${config.name}
Theme URI: https://pageforge.com
Author: ${config.author}
Author URI: ${config.authorUri}
Description: ${config.description}
Version: ${config.version}
Requires at least: 6.0
Tested up to: 6.7
Requires PHP: 7.4
License: GNU General Public License v2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
Text Domain: ${config.textDomain}
Tags: one-column, two-columns, right-sidebar, custom-colors, custom-header, custom-background, custom-logo, featured-images, full-width-template, theme-options
*/
`;
}

// ═══════════════════════════════════════════════════════════════
// 2. functions.php
// ═══════════════════════════════════════════════════════════════

export function generateFunctionsPHP(config: ThemeConfig): string {
  const td = config.textDomain;
  const slug = config.slug;
  const headingFont = config.headingFont;
  const bodyFont = config.bodyFont;

  return `<?php
/**
 * ${config.name} - Functions
 *
 * @package ${slug}
 * @version ${config.version}
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// ─── Theme Setup ───────────────────────────────────────────
function ${slug}_setup() {
    // Theme supports
    add_theme_support( 'title-tag' );
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'custom-logo', array(
        'height'      => 60,
        'width'       => 200,
        'flex-height' => true,
        'flex-width'  => true,
    ) );

    add_theme_support( 'html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
        'style',
        'script',
    ) );
    add_theme_support( 'custom-background', array(
        'default-color' => '${config.backgroundColor}',
    ) );
    add_theme_support( 'custom-header', array(
        'default-image'      => '',
        'width'              => 1920,
        'height'             => 800,
        'flex-width'         => true,
        'flex-height'        => true,
    ) );

    // Navigation menus
    register_nav_menus( array(
        'primary-menu' => esc_html__( 'Primary Menu', '${td}' ),
        'footer-menu'  => esc_html__( 'Footer Menu', '${td}' ),
    ) );

    // Set content width
    if ( ! isset( $content_width ) ) {
        $content_width = 1200;
    }
}
add_action( 'after_setup_theme', '${slug}_setup' );

// ─── WordPress Customizer ───────────────────────────────────
function ${slug}_customize_register( $wp_customize ) {
    // === Site Identity Section ===
    $wp_customize->add_section( '${slug}_identity', array(
        'title'    => __( 'Identidad del Sitio', '${td}' ),
        'priority' => 30,
    ) );

    $wp_customize->add_setting( '${slug}_logo_url', array(
        'default'           => '${esc(config.logoUrl || '')}',
        'sanitize_callback' => 'esc_url_raw',
        'transport'         => 'refresh',
    ) );
    $wp_customize->add_control( '${slug}_logo_url', array(
        'label'       => __( 'URL del Logo', '${td}' ),
        'section'     => '${slug}_identity',
        'type'        => 'url',
    ) );

    $wp_customize->add_setting( '${slug}_tagline_display', array(
        'default'           => '${esc(config.tagline || '')}',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'refresh',
    ) );
    $wp_customize->add_control( '${slug}_tagline_display', array(
        'label'       => __( 'Eslogan del Sitio', '${td}' ),
        'section'     => '${slug}_identity',
        'type'        => 'text',
    ) );

    // === Colors Section ===
    $wp_customize->add_section( '${slug}_colors', array(
        'title'    => __( 'Colores del Theme', '${td}' ),
        'priority' => 40,
    ) );

    $colors = array(
        'primary_color'    => array( 'default' => '${config.primaryColor}', 'label' => 'Color Primario' ),
        'secondary_color'  => array( 'default' => '${config.secondaryColor}', 'label' => 'Color Secundario' ),
        'accent_color'     => array( 'default' => '${config.accentColor}', 'label' => 'Color de Acento' ),
        'background_color' => array( 'default' => '${config.backgroundColor}', 'label' => 'Color de Fondo' ),
        'text_color'       => array( 'default' => '${config.textColor}', 'label' => 'Color de Texto' ),
    );

    foreach ( $colors as $key => $color ) {
        $wp_customize->add_setting( '${slug}_' . $key, array(
            'default'           => $color['default'],
            'sanitize_callback' => 'sanitize_hex_color',
            'transport'         => 'refresh',
        ) );
        $wp_customize->add_control( new WP_Customize_Color_Control( $wp_customize, '${slug}_' . $key, array(
            'label'   => __( $color['label'], '${td}' ),
            'section' => '${slug}_colors',
        ) ) );
    }

    // === Typography Section ===
    $wp_customize->add_section( '${slug}_typography', array(
        'title'    => __( 'Tipografía', '${td}' ),
        'priority' => 50,
    ) );

    $fonts = array(
        'heading_font' => '${headingFont}',
        'body_font'    => '${bodyFont}',
    );

    foreach ( $fonts as $key => $default ) {
        $wp_customize->add_setting( '${slug}_' . $key, array(
            'default'           => $default,
            'sanitize_callback' => 'sanitize_text_field',
            'transport'         => 'refresh',
        ) );
        $wp_customize->add_control( '${slug}_' . $key, array(
            'label'   => __( $key === 'heading_font' ? 'Fuente de Títulos' : 'Fuente del Cuerpo', '${td}' ),
            'section' => '${slug}_typography',
            'type'    => 'select',
            'choices' => array(
                'Inter'            => 'Inter',
                'Poppins'          => 'Poppins',
                'Montserrat'       => 'Montserrat',
                'Roboto'           => 'Roboto',
                'Open Sans'        => 'Open Sans',
                'Lato'             => 'Lato',
                'Playfair Display' => 'Playfair Display',
                'Merriweather'     => 'Merriweather',
                'Oswald'           => 'Oswald',
                'Raleway'          => 'Raleway',
                'Nunito'           => 'Nunito',
                'Source Sans Pro'  => 'Source Sans Pro',
            ),
        ) );
    }

    // === Border Radius ===
    $wp_customize->add_setting( '${slug}_border_radius', array(
        'default'           => ${config.borderRadius},
        'sanitize_callback' => 'absint',
        'transport'         => 'refresh',
    ) );
    $wp_customize->add_control( '${slug}_border_radius', array(
        'label'       => __( 'Radio de Bordes (px)', '${td}' ),
        'section'     => '${slug}_typography',
        'type'        => 'range',
        'input_attrs' => array( 'min' => 0, 'max' => 20, 'step' => 1 ),
    ) );
}
add_action( 'customize_register', '${slug}_customize_register' );

// ─── Customizer CSS Output ───────────────────────────────────
function ${slug}_customize_css() {
    ?>
    <style type="text/css">
        :root {
            --pf-primary: <?php echo esc_attr( get_theme_mod( '${slug}_primary_color', '${config.primaryColor}' ) ); ?>;
            --pf-secondary: <?php echo esc_attr( get_theme_mod( '${slug}_secondary_color', '${config.secondaryColor}' ) ); ?>;
            --pf-accent: <?php echo esc_attr( get_theme_mod( '${slug}_accent_color', '${config.accentColor}' ) ); ?>;
            --pf-bg: <?php echo esc_attr( get_theme_mod( '${slug}_background_color', '${config.backgroundColor}' ) ); ?>;
            --pf-text: <?php echo esc_attr( get_theme_mod( '${slug}_text_color', '${config.textColor}' ) ); ?>;
            --pf-radius: <?php echo esc_attr( get_theme_mod( '${slug}_border_radius', '${config.borderRadius}' ) ); ?>px;
            --pf-heading-font: '<?php echo esc_attr( get_theme_mod( '${slug}_heading_font', '${config.headingFont}' ) ); ?>', sans-serif;
            --pf-body-font: '<?php echo esc_attr( get_theme_mod( '${slug}_body_font', '${config.bodyFont}' ) ); ?>', sans-serif;
        }
    </style>
    <?php
}
add_action( 'wp_head', '${slug}_customize_css' );

// ─── Enqueue Styles and Scripts ────────────────────────────
function ${slug}_scripts() {
    // Google Fonts (dedup if heading === body)
    ${headingFont === bodyFont ? `wp_enqueue_style(
        '${slug}-google-fonts',
        '${fontImportUrl(headingFont)}',
        array(),
        null
    );` : `wp_enqueue_style(
        '${slug}-google-fonts',
        '${fontImportUrl(headingFont)}&family=${bodyFont.replace(/ /g, '+')}:wght@400;500;600;700&display=swap',
        array(),
        null
    );`}

    // Theme stylesheet
    wp_enqueue_style(
        '${slug}-style',
        get_stylesheet_uri(),
        array(),
        '${config.version}'
    );

    // Main CSS
    wp_enqueue_style(
        '${slug}-main',
        get_template_directory_uri() . '/assets/css/styles.css',
        array( '${slug}-style' ),
        '${config.version}'
    );

    // Main JS
    wp_enqueue_script(
        '${slug}-main',
        get_template_directory_uri() . '/assets/js/main.js',
        array(),
        '${config.version}',
        true
    );

    // Pass PHP data to JS
    wp_localize_script( '${slug}-main', '${slug}Data', array(
        'ajaxUrl'  => admin_url( 'admin-ajax.php' ),
        'themeUrl' => get_template_directory_uri(),
        'homeUrl'  => home_url( '/' ),
    ) );
}
add_action( 'wp_enqueue_scripts', '${slug}_scripts' );

// ─── Widget Areas ──────────────────────────────────────────
function ${slug}_widgets_init() {
    register_sidebar( array(
        'name'          => esc_html__( 'Sidebar', '${td}' ),
        'id'            => 'sidebar-1',
        'description'   => esc_html__( 'Main sidebar area.', '${td}' ),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h3 class="widget-title">',
        'after_title'   => '</h3>',
    ) );

    register_sidebar( array(
        'name'          => esc_html__( 'Footer Column 1', '${td}' ),
        'id'            => 'footer-1',
        'description'   => esc_html__( 'Footer column 1.', '${td}' ),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4 class="widget-title">',
        'after_title'   => '</h4>',
    ) );

    register_sidebar( array(
        'name'          => esc_html__( 'Footer Column 2', '${td}' ),
        'id'            => 'footer-2',
        'description'   => esc_html__( 'Footer column 2.', '${td}' ),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4 class="widget-title">',
        'after_title'   => '</h4>',
    ) );

    register_sidebar( array(
        'name'          => esc_html__( 'Footer Column 3', '${td}' ),
        'id'            => 'footer-3',
        'description'   => esc_html__( 'Footer column 3.', '${td}' ),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4 class="widget-title">',
        'after_title'   => '</h4>',
    ) );

    register_sidebar( array(
        'name'          => esc_html__( 'Footer Column 4', '${td}' ),
        'id'            => 'footer-4',
        'description'   => esc_html__( 'Footer column 4.', '${td}' ),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4 class="widget-title">',
        'after_title'   => '</h4>',
    ) );
}
add_action( 'widgets_init', '${slug}_widgets_init' );

// ─── Custom Excerpt Length ──────────────────────────────────
function ${slug}_excerpt_length( $length ) {
    return 25;
}
add_filter( 'excerpt_length', '${slug}_excerpt_length' );

function ${slug}_excerpt_more( $more ) {
    return ' &hellip;';
}
add_filter( 'excerpt_more', '${slug}_excerpt_more' );

`;
}

// ═══════════════════════════════════════════════════════════════
// 3. header.php
// ═══════════════════════════════════════════════════════════════

function generateHeaderPHP(config: ThemeConfig): string {
  return `<?php
/**
 * Theme Header
 * @package ${config.slug}
 */
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="profile" href="https://gmpg.org/xfn/11">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<header class="site-header" id="site-header">
    <div class="header-container">
        <div class="header-inner">
            <!-- Logo / Site Title -->
            <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="site-brand" rel="home">
                <?php if ( has_custom_logo() ) : ?>
                    <?php the_custom_logo(); ?>
                <?php elseif ( function_exists( 'get_theme_mod' ) && get_theme_mod( '${config.slug}_logo_url', '' ) ) : ?>
                    <img src="<?php echo esc_url( get_theme_mod( '${config.slug}_logo_url', '' ) ); ?>" alt="<?php echo esc_attr( get_bloginfo( 'name' ) ); ?>" class="site-logo-img" />
                <?php else : ?>
                    <span class="site-title-text">${esc(config.siteTitle || config.name)}</span>
                <?php endif; ?>
                <?php if ( is_front_page() || is_home() ) : ?>
                    <span class="screen-reader-text"><?php bloginfo( 'name' ); ?></span>
                <?php endif; ?>
            </a>
            <?php $tagline = get_bloginfo( 'description', 'display' ); ?>
            <?php if ( $tagline || '${esc(config.tagline || '')}' ) : ?>
                <span class="site-tagline"><?php echo esc_html( $tagline ?: '${esc(config.tagline || '')}' ); ?></span>
            <?php endif; ?>

            <!-- Primary Navigation -->
            <nav class="main-nav" id="main-nav" aria-label="<?php esc_attr_e( 'Primary Menu', '${config.textDomain}' ); ?>">
                <?php
                wp_nav_menu( array(
                    'theme_location' => 'primary-menu',
                    'container'      => false,
                    'menu_class'     => 'nav-menu',
                    'fallback_cb'    => function() {
                        echo '<ul class="nav-menu"><li><a href="' . esc_url( home_url( '/' ) ) . '">' . esc_html__( 'Home', '${config.textDomain}' ) . '</a></li></ul>';
                    },
                    'depth'          => 3,
                ) );
                ?>
            </nav>

            <!-- Mobile Hamburger -->
            <button class="mobile-toggle" id="mobile-toggle" aria-label="<?php esc_attr_e( 'Toggle Menu', '${config.textDomain}' ); ?>" aria-expanded="false">
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
            </button>
        </div>
    </div>

    <!-- Mobile Menu Overlay -->
    <div class="mobile-menu-overlay" id="mobile-menu-overlay"></div>
    <div class="mobile-menu-panel" id="mobile-menu-panel">
        <?php
        wp_nav_menu( array(
            'theme_location' => 'primary-menu',
            'container'      => false,
            'menu_class'     => 'mobile-nav-menu',
            'fallback_cb'    => function() {
                echo '<ul class="mobile-nav-menu"><li><a href="' . esc_url( home_url( '/' ) ) . '">' . esc_html__( 'Home', '${config.textDomain}' ) . '</a></li></ul>';
            },
            'depth'          => 2,
        ) );
        ?>
    </div>
</header>
`;
}

// ═══════════════════════════════════════════════════════════════
// 4. footer.php
// ═══════════════════════════════════════════════════════════════

function generateFooterPHP(config: ThemeConfig): string {
  const socialIcons: Record<string, string> = {
    facebook: 'facebook-f',
    twitter: 'twitter',
    instagram: 'instagram',
    linkedin: 'linkedin-in',
    youtube: 'youtube',
  };

  const socialHTML = config.socialLinks.map(s => {
    const icon = socialIcons[s.platform] || s.platform;
    return `                    <a href="<?php echo esc_url( '${s.url}' ); ?>" class="social-link" target="_blank" rel="noopener noreferrer" aria-label="<?php esc_attr_e( '${s.platform}', '${config.textDomain}' ); ?>">
                        <i class="fab fa-${icon}"></i>
                    </a>`;
  }).join('\n');

  return `<?php
/**
 * Theme Footer
 * @package ${config.slug}
 */
?>

<footer class="site-footer">
    <div class="container">
        <div class="footer-grid">
            <!-- Footer Column 1: Brand -->
            <div class="footer-brand-col">
                <?php if ( has_custom_logo() ) : ?>
                    <div class="footer-logo"><?php the_custom_logo(); ?></div>
                <?php else : ?>
                    <div class="footer-brand-name"><?php bloginfo( 'name' ); ?></div>
                <?php endif; ?>
                <p class="footer-description"><?php bloginfo( 'description' ); ?></p>
                <div class="footer-social">
${socialHTML}
                </div>
            </div>

            <!-- Footer Columns 2-5 -->
            <div class="footer-col">
                <?php if ( is_active_sidebar( 'footer-1' ) ) : ?>
                    <?php dynamic_sidebar( 'footer-1' ); ?>
                <?php endif; ?>
            </div>
            <div class="footer-col">
                <?php if ( is_active_sidebar( 'footer-2' ) ) : ?>
                    <?php dynamic_sidebar( 'footer-2' ); ?>
                <?php endif; ?>
            </div>
            <div class="footer-col">
                <?php if ( is_active_sidebar( 'footer-3' ) ) : ?>
                    <?php dynamic_sidebar( 'footer-3' ); ?>
                <?php endif; ?>
            </div>
            <div class="footer-col">
                <?php if ( is_active_sidebar( 'footer-4' ) ) : ?>
                    <?php dynamic_sidebar( 'footer-4' ); ?>
                <?php else : ?>
                    <h4 class="widget-title"><?php esc_html_e( 'Quick Links', '${config.textDomain}' ); ?></h4>
                    <?php
                    wp_nav_menu( array(
                        'theme_location' => 'footer-menu',
                        'container'      => false,
                        'menu_class'     => 'footer-menu',
                        'fallback_cb'    => false,
                        'depth'          => 1,
                    ) );
                    ?>
                <?php endif; ?>
            </div>
        </div>

        <div class="footer-bottom">
            <p class="copyright"><?php echo esc_html( '${config.copyrightText}' ); ?> &copy; <?php echo date( 'Y' ); ?> <?php bloginfo( 'name' ); ?>. <?php esc_html_e( 'All rights reserved.', '${config.textDomain}' ); ?></p>
        </div>
    </div>
</footer>

<button class="back-to-top" id="back-to-top" aria-label="<?php esc_attr_e( 'Back to top', '${config.textDomain}' ); ?>">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>
</button>

<?php wp_footer(); ?>
</body>
</html>
`;
}

// ═══════════════════════════════════════════════════════════════
// 5. index.php — Fallback Template
// ═══════════════════════════════════════════════════════════════

function generateIndexPHP(config: ThemeConfig): string {
  return `<?php
/**
 * The main template file (fallback)
 * @package ${config.slug}
 */
get_header();
?>

<main class="site-main">
    <div class="container">
        <?php if ( is_home() && ! is_front_page() ) : ?>
            <header class="page-header">
                <h1 class="page-title"><?php single_post_title(); ?></h1>
            </header>
        <?php endif; ?>

        <?php if ( have_posts() ) : ?>
            <div class="posts-grid">
                <?php while ( have_posts() ) : the_post(); ?>
                    <?php get_template_part( 'template-parts/content', get_post_type() ); ?>
                <?php endwhile; ?>
            </div>

            <nav class="pagination" aria-label="<?php esc_attr_e( 'Posts navigation', '${config.textDomain}' ); ?>">
                <?php
                the_posts_pagination( array(
                    'mid_size'  => 2,
                    'prev_text' => '&laquo; ' . esc_html__( 'Previous', '${config.textDomain}' ),
                    'next_text' => esc_html__( 'Next', '${config.textDomain}' ) . ' &raquo;',
                ) );
                ?>
            </nav>

        <?php else : ?>
            <?php get_template_part( 'template-parts/content', 'none' ); ?>
        <?php endif; ?>
    </div>
</main>

<?php get_footer(); ?>
`;
}

// ═══════════════════════════════════════════════════════════════
// 6. front-page.php — Homepage Template
// ═══════════════════════════════════════════════════════════════

function generateFrontPagePHP(config: ThemeConfig): string {
  const enabledSections = config.sections.filter(s => s.enabled);

  const sectionGenerators: Record<string, (section: ThemeSection) => string> = {
    hero: generateSectionHero,
    about: generateSectionAbout,
    services: generateSectionServices,
    features: generateSectionFeatures,
    testimonials: generateSectionTestimonials,
    pricing: generateSectionPricing,
    cta: generateSectionCTA,
    contact: generateSectionContact,
    gallery: generateSectionGallery,
    faq: generateSectionFAQ,
    stats: generateSectionStats,
    team: generateSectionTeam,
    blog_posts: generateSectionBlogPosts,
  };

  const sectionsHTML = enabledSections.map(s => {
    // Inject text domain into section data for translations
    if (!s.data._td) s.data._td = config.textDomain;
    const gen = sectionGenerators[s.type];
    if (gen) return gen(s);
    return '';
  }).join('\n\n');

  return `<?php
/**
 * Front Page Template
 * @package ${config.slug}
 */
get_header();
?>

<main class="site-main front-page-main">
${sectionsHTML}
</main>

<?php get_footer(); ?>
`;
}

// ─── Section Generators for front-page.php ──────────────────

function generateSectionHero(s: ThemeSection): string {
  const d = s.data;
  const bgImage = d.backgroundImage ? `<div class="pf-hero-bg" style="background-image: url('<?php echo esc_url( get_theme_mod( '${s.type}_bg_image', '${d.backgroundImage}' ) ); ?>');"></div>` : '';
  const overlayOpacity = d.overlayOpacity ?? 0.5;

  return `    <!-- Hero Section -->
    <section class="pf-section pf-hero">
        ${bgImage}
        <div class="pf-hero-overlay" style="background: rgba(0,0,0,${overlayOpacity});"></div>
        <div class="pf-hero-content">
            <h1 class="pf-hero-title"><?php echo esc_html( get_theme_mod( '${s.type}_title', '${esc(d.title || s.title)}' ) ); ?></h1>
            <?php
            $hero_subtitle = get_theme_mod( '${s.type}_subtitle', '${esc(d.subtitle || '')}' );
            if ( $hero_subtitle ) :
            ?>
                <p class="pf-hero-subtitle"><?php echo esc_html( $hero_subtitle ); ?></p>
            <?php endif; ?>
            <div class="pf-hero-actions">
                <?php
                $hero_cta_text = get_theme_mod( '${s.type}_cta_text', '${esc(d.ctaText || '')}' );
                $hero_cta_link = get_theme_mod( '${s.type}_cta_link', '${esc(d.ctaLink || '#')}' );
                if ( $hero_cta_text ) :
                ?>
                    <a href="<?php echo esc_url( $hero_cta_link ); ?>" class="pf-btn pf-btn-primary"><?php echo esc_html( $hero_cta_text ); ?></a>
                <?php endif; ?>
                <?php
                $hero_cta2_text = get_theme_mod( '${s.type}_cta2_text', '${esc(d.secondaryCtaText || '')}' );
                $hero_cta2_link = get_theme_mod( '${s.type}_cta2_link', '${esc(d.secondaryCtaLink || '#')}' );
                if ( $hero_cta2_text ) :
                ?>
                    <a href="<?php echo esc_url( $hero_cta2_link ); ?>" class="pf-btn pf-btn-outline-white"><?php echo esc_html( $hero_cta2_text ); ?></a>
                <?php endif; ?>
            </div>
        </div>
    </section>`;
}

function generateSectionAbout(s: ThemeSection): string {
  const d = s.data;
  return `    <!-- About Section -->
    <section class="pf-section pf-about" id="section-${s.type}">
        <div class="container">
            <div class="pf-about-grid">
                <div class="pf-about-image">
                    <?php
                    $about_img_id = get_theme_mod( '${s.type}_image' );
                    if ( $about_img_id ) {
                        echo wp_get_attachment_image( $about_img_id, 'large' );
                    } else {
                        echo '<div class="pf-image-placeholder">' . esc_html__( 'Image', '${esc(d._td)}' ) . '</div>';
                    }
                    ?>
                </div>
                <div class="pf-about-text">
                    <h2 class="pf-section-title"><?php echo esc_html( get_theme_mod( '${s.type}_title', '${esc(s.title)}' ) ); ?></h2>
                    <p class="pf-section-subtitle"><?php echo esc_html( get_theme_mod( '${s.type}_subtitle', '${esc(d.subtitle || '')}' ) ); ?></p>
                    <?php
                    $_about_stats = array(${d.stats?.map((st: any) => `array('value' => '${esc(st.value)}', 'label' => '${esc(st.label)}')`).join(', ') || ''});
                    if ( ! empty( $_about_stats ) ) :
                    ?>
                    <div class="pf-about-stats">
                        <?php foreach ( array(${d.stats?.map((st: any) => `array('value' => '${esc(st.value)}', 'label' => '${esc(st.label)}')`).join(', ') || ''}) as $stat ) : ?>
                        <div class="pf-stat">
                            <div class="pf-stat-value"><?php echo esc_html( $stat['value'] ); ?></div>
                            <div class="pf-stat-label"><?php echo esc_html( $stat['label'] ); ?></div>
                        </div>
                        <?php endforeach; ?>
                    </div>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </section>`;
}

function generateSectionServices(s: ThemeSection): string {
  return generateFeatureCards(s, 'services');
}

function generateSectionFeatures(s: ThemeSection): string {
  return generateFeatureCards(s, 'features');
}

function generateFeatureCards(s: ThemeSection, key: string): string {
  const d = s.data;
  const items = d.items || d.features || [];
  const cols = d.columns || 3;

  const cardsHTML = items.map((item: any) =>
    `                <div class="pf-card pf-feature-card">
                            <div class="pf-feature-icon"><?php echo esc_html( '${esc(item.icon || '✦')}' ); ?></div>
                            <h3><?php echo esc_html( '${esc(item.title)}' ); ?></h3>
                            <p><?php echo esc_html( '${esc(item.description || '')}' ); ?></p>
                </div>`
  ).join('\n');

  return `    <!-- ${s.type.charAt(0).toUpperCase() + s.type.slice(1)} Section -->
    <section class="pf-section pf-${s.type} pf-section-alt" id="section-${s.type}">
        <div class="container">
            <div class="pf-section-header">
                <h2 class="pf-section-title"><?php echo esc_html( '${esc(s.title)}' ); ?></h2>
                <?php $sub = '${esc(d.subtitle || '')}'; if ( $sub ) : ?>
                    <p class="pf-section-subtitle"><?php echo esc_html( $sub ); ?></p>
                <?php endif; ?>
            </div>
            <div class="pf-grid pf-grid-${cols}">
${cardsHTML}
            </div>
        </div>
    </section>`;
}

function generateSectionTestimonials(s: ThemeSection): string {
  const d = s.data;
  const testimonials = d.testimonials || d.items || [];
  const cols = testimonials.length <= 2 ? 2 : 3;

  const cardsPHP = testimonials.map((t: any) => {
    const stars = '★'.repeat(t.rating || 5) + '☆'.repeat(5 - (t.rating || 5));
    return `                <div class="pf-card pf-testimonial-card">
                    <div class="pf-testimonial-stars"><?php echo esc_html( '${stars}' ); ?></div>
                    <p class="pf-testimonial-quote">"${esc(t.quote || t.text || '')}"</p>
                    <div class="pf-testimonial-author"><?php echo esc_html( '${esc(t.name)}' ); ?></div>
                    <div class="pf-testimonial-role"><?php echo esc_html( '${esc(t.role || '')}' ); ?></div>
                </div>`;
  }).join('\n');

  return `    <!-- Testimonials Section -->
    <section class="pf-section pf-testimonials pf-section-alt" id="section-testimonials">
        <div class="container">
            <div class="pf-section-header">
                <h2 class="pf-section-title"><?php echo esc_html( '${esc(s.title)}' ); ?></h2>
                <?php $sub = '${esc(d.subtitle || '')}'; if ( $sub ) : ?>
                    <p class="pf-section-subtitle"><?php echo esc_html( $sub ); ?></p>
                <?php endif; ?>
            </div>
            <div class="pf-grid pf-grid-${cols}">
${cardsPHP}
            </div>
        </div>
    </section>`;
}

function generateSectionPricing(s: ThemeSection): string {
  const d = s.data;
  const plans = d.plans || d.items || [];
  const cols = plans.length <= 2 ? 2 : plans.length >= 4 ? 4 : 3;

  const cardsPHP = plans.map((p: any) => {
    const featured = p.highlighted || p.featured ? ' featured' : '';
    const badge = p.highlighted || p.featured ? `<div class="pf-pricing-badge">Popular</div>` : '';
    const features = (p.features || []).map((f: string) => `                                <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg> <?php echo esc_html( '${esc(f)}' ); ?></li>`).join('\n');
    const btnClass = p.highlighted || p.featured ? 'pf-btn-accent' : 'pf-btn-outline';
    return `                <div class="pf-card pf-pricing-card${featured}">
                    ${badge}
                    <div class="pf-pricing-name"><?php echo esc_html( '${esc(p.name)}' ); ?></div>
                    <?php if ( '${esc(p.description || '')}' ) : ?>
                        <div class="pf-pricing-desc"><?php echo esc_html( '${esc(p.description)}' ); ?></div>
                    <?php endif; ?>
                    <div class="pf-pricing-price"><?php echo esc_html( '${esc(p.price || '')}' ); ?></div>
                    <div class="pf-pricing-period"><?php echo esc_html( '${esc(p.period || '')}' ); ?></div>
                    <ul class="pf-pricing-features">
${features}
                    </ul>
                    <a href="#" class="pf-btn ${btnClass}" style="width:100%"><?php echo esc_html( '${esc(p.ctaText || 'Get Started')}' ); ?></a>
                </div>`;
  }).join('\n');

  return `    <!-- Pricing Section -->
    <section class="pf-section pf-pricing" id="section-pricing">
        <div class="container">
            <div class="pf-section-header">
                <h2 class="pf-section-title"><?php echo esc_html( '${esc(s.title)}' ); ?></h2>
                <?php $sub = '${esc(d.subtitle || '')}'; if ( $sub ) : ?>
                    <p class="pf-section-subtitle"><?php echo esc_html( $sub ); ?></p>
                <?php endif; ?>
            </div>
            <div class="pf-grid pf-grid-${cols}">
${cardsPHP}
            </div>
        </div>
    </section>`;
}

function generateSectionCTA(s: ThemeSection): string {
  const d = s.data;
  return `    <!-- CTA Section -->
    <section class="pf-section pf-cta" id="section-cta">
        <div class="pf-cta-bg"></div>
        <div class="pf-cta-decor" style="width:400px;height:400px;top:-200px;right:-100px;"></div>
        <div class="pf-cta-decor" style="width:300px;height:300px;bottom:-150px;left:-80px;"></div>
        <div class="container">
            <div class="pf-cta-content">
                <h2><?php echo esc_html( '${esc(s.title)}' ); ?></h2>
                <?php if ( '${esc(d.subtitle || '')}' ) : ?>
                    <p><?php echo esc_html( '${esc(d.subtitle)}' ); ?></p>
                <?php endif; ?>
                <a href="<?php echo esc_url( '${esc(d.ctaLink || '#')}' ); ?>" class="pf-btn pf-btn-white"><?php echo esc_html( '${esc(d.ctaText || 'Learn More')}' ); ?></a>
            </div>
        </div>
    </section>`;
}

function generateSectionContact(s: ThemeSection): string {
  const d = s.data;
  return `    <!-- Contact Section -->
    <section class="pf-section pf-contact pf-section-alt" id="section-contact">
        <div class="container">
            <div class="pf-section-header">
                <h2 class="pf-section-title"><?php echo esc_html( '${esc(s.title)}' ); ?></h2>
                <?php $sub = '${esc(d.subtitle || '')}'; if ( $sub ) : ?>
                    <p class="pf-section-subtitle"><?php echo esc_html( $sub ); ?></p>
                <?php endif; ?>
            </div>
            <div class="pf-contact-cards">
                <div class="pf-card pf-contact-card">
                    <div class="pf-contact-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                    </div>
                    <div class="pf-contact-label"><?php esc_html_e( 'Email', '${esc(d._td)}' ); ?></div>
                    <div class="pf-contact-value"><?php echo esc_html( '${esc(d.email || 'email@example.com')}' ); ?></div>
                </div>
                <div class="pf-card pf-contact-card">
                    <div class="pf-contact-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    </div>
                    <div class="pf-contact-label"><?php esc_html_e( 'Phone', '${esc(d._td)}' ); ?></div>
                    <div class="pf-contact-value"><?php echo esc_html( '${esc(d.phone || '+1 234 567 890')}' ); ?></div>
                </div>
                <div class="pf-card pf-contact-card">
                    <div class="pf-contact-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                    </div>
                    <div class="pf-contact-label"><?php esc_html_e( 'Address', '${esc(d._td)}' ); ?></div>
                    <div class="pf-contact-value"><?php echo esc_html( '${esc(d.address || '')}' ); ?></div>
                </div>
            </div>
            <?php if ( ${d.showForm ? 'true' : 'false'} ) : ?>
            <div class="pf-contact-form-wrap">
                <?php if ( function_exists( 'wpcf7_contact_form' ) ) { echo do_shortcode( '[contact-form-7 id="1"]' ); } else { echo '<p>' . esc_html__( 'Contact Form 7 plugin is required for this form.', '${esc(d._td)}' ) . '</p>'; } ?>
            </div>
            <?php endif; ?>
        </div>
    </section>`;
}

function generateSectionGallery(s: ThemeSection): string {
  const d = s.data;
  const images = d.images || [];
  const cols = d.columns || 3;

  const imagesPHP = images.map((img: any) =>
    `                    <div class="pf-gallery-item">
                        <img src="<?php echo esc_url( '${esc(img.src)}' ); ?>" alt="<?php echo esc_attr( '${esc(img.alt || '')}' ); ?>" loading="lazy">
                        ${img.caption ? `<div class="pf-gallery-caption"><?php echo esc_html( '${esc(img.caption)}' ); ?></div>` : ''}
                    </div>`
  ).join('\n');

  return `    <!-- Gallery Section -->
    <section class="pf-section pf-gallery" id="section-gallery">
        <div class="container">
            <div class="pf-section-header">
                <h2 class="pf-section-title"><?php echo esc_html( '${esc(s.title)}' ); ?></h2>
                <?php $sub = '${esc(d.subtitle || '')}'; if ( $sub ) : ?>
                    <p class="pf-section-subtitle"><?php echo esc_html( $sub ); ?></p>
                <?php endif; ?>
            </div>
            <div class="pf-gallery-grid pf-gallery-cols-${cols}">
${imagesPHP}
            </div>
        </div>
    </section>`;
}

function generateSectionFAQ(s: ThemeSection): string {
  const d = s.data;
  const items = d.items || [];

  const itemsPHP = items.map((item: any) =>
    `                <div class="pf-faq-item">
                    <button class="pf-faq-question">
                        <span><?php echo esc_html( '${esc(item.question)}' ); ?></span>
                        <span class="pf-faq-chevron">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="m6 9 6 6 6-6"/></svg>
                        </span>
                    </button>
                    <div class="pf-faq-answer">
                        <div class="pf-faq-answer-inner"><?php echo esc_html( '${esc(item.answer)}' ); ?></div>
                    </div>
                </div>`
  ).join('\n');

  return `    <!-- FAQ Section -->
    <section class="pf-section pf-faq pf-section-alt" id="section-faq">
        <div class="container" style="max-width:800px;">
            <div class="pf-section-header">
                <h2 class="pf-section-title"><?php echo esc_html( '${esc(s.title)}' ); ?></h2>
                <?php $sub = '${esc(d.subtitle || '')}'; if ( $sub ) : ?>
                    <p class="pf-section-subtitle"><?php echo esc_html( $sub ); ?></p>
                <?php endif; ?>
            </div>
${itemsPHP}
        </div>
    </section>`;
}

function generateSectionStats(s: ThemeSection): string {
  const d = s.data;
  const items = d.items || [];
  const cols = items.length <= 3 ? 3 : 4;

  const itemsPHP = items.map((item: any) =>
    `                <div>
                    <div class="pf-stat-icon"><?php echo esc_html( '${esc(item.icon || '📊')}' ); ?></div>
                    <div class="pf-stat-value"><?php echo esc_html( '${esc(item.value)}' ); ?></div>
                    <div class="pf-stat-label"><?php echo esc_html( '${esc(item.label)}' ); ?></div>
                </div>`
  ).join('\n');

  return `    <!-- Stats Section -->
    <section class="pf-section pf-stats" id="section-stats">
        <div class="container">
            ${s.title ? `<?php if ( '${esc(s.title)}' ) : ?>\n            <div class="pf-section-header"><h2 class="pf-section-title"><?php echo esc_html( '${esc(s.title)}' ); ?></h2></div>\n            <?php endif; ?>` : ''}
            <div class="pf-stats-bar" style="grid-template-columns:repeat(${cols},1fr);">
${itemsPHP}
            </div>
        </div>
    </section>`;
}

function generateSectionTeam(s: ThemeSection): string {
  const d = s.data;
  const members = d.members || [];
  const cols = members.length <= 2 ? 2 : members.length >= 4 ? 4 : 3;

  const cardsPHP = members.map((m: any) => {
    const socials = (m.socials || []).map((sl: any) =>
      `                        <a href="<?php echo esc_url( '${esc(sl.url)}' ); ?>" class="pf-team-social-link" target="_blank" rel="noopener" aria-label="<?php esc_attr_e( '${esc(sl.platform)}', '${esc(d._td)}' ); ?>"><?php echo esc_html( '${esc(sl.platform.charAt(0).toUpperCase())}' ); ?></a>`
    ).join('\n');

    return `                <div class="pf-card pf-team-card">
                    <div class="pf-team-avatar">
                        ${m.avatar ? `<?php echo '<img src="' . esc_url( '${esc(m.avatar)}' ) . '" alt="' . esc_attr( '${esc(m.name)}' ) . '">'; ?>` : `<?php echo esc_html( '${esc(m.name.charAt(0).toUpperCase())}' ); ?>`}
                    </div>
                    <div class="pf-team-name"><?php echo esc_html( '${esc(m.name)}' ); ?></div>
                    <div class="pf-team-role"><?php echo esc_html( '${esc(m.role)}' ); ?></div>
                    <?php if ( '${esc(m.bio || '')}' ) : ?>
                        <p class="pf-team-bio"><?php echo esc_html( '${esc(m.bio)}' ); ?></p>
                    <?php endif; ?>
                    <div class="pf-team-socials">
${socials}
                    </div>
                </div>`;
  }).join('\n');

  return `    <!-- Team Section -->
    <section class="pf-section pf-team pf-section-alt" id="section-team">
        <div class="container">
            <div class="pf-section-header">
                <h2 class="pf-section-title"><?php echo esc_html( '${esc(s.title)}' ); ?></h2>
                <?php $sub = '${esc(d.subtitle || '')}'; if ( $sub ) : ?>
                    <p class="pf-section-subtitle"><?php echo esc_html( $sub ); ?></p>
                <?php endif; ?>
            </div>
            <div class="pf-grid pf-grid-${cols}">
${cardsPHP}
            </div>
        </div>
    </section>`;
}

function generateSectionBlogPosts(s: ThemeSection): string {
  const d = s.data;
  const count = d.count || 3;
  return `    <!-- Blog Posts Section -->
    <section class="pf-section pf-blog-posts pf-section-alt" id="section-blog-posts">
        <div class="container">
            <div class="pf-section-header">
                <h2 class="pf-section-title"><?php echo esc_html( '${esc(s.title || 'Latest Posts')}' ); ?></h2>
                <?php $sub = '${esc(d.subtitle || '')}'; if ( $sub ) : ?>
                    <p class="pf-section-subtitle"><?php echo esc_html( $sub ); ?></p>
                <?php endif; ?>
            </div>
            <?php
            $latest_posts = new WP_Query( array(
                'posts_per_page' => ${count},
                'post_status'    => 'publish',
            ) );
            if ( $latest_posts->have_posts() ) :
            ?>
            <div class="pf-grid pf-grid-3">
                <?php while ( $latest_posts->have_posts() ) : $latest_posts->the_post(); ?>
                <article <?php post_class( 'pf-card pf-blog-card' ); ?>>
                    <?php if ( has_post_thumbnail() ) : ?>
                        <div class="pf-blog-card-image">
                            <a href="<?php the_permalink(); ?>">
                                <?php the_post_thumbnail( 'medium_large' ); ?>
                            </a>
                        </div>
                    <?php endif; ?>
                    <div class="pf-blog-card-content">
                        <div class="pf-blog-card-meta">
                            <time datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>"><?php echo esc_html( get_the_date() ); ?></time>
                        </div>
                        <h3 class="pf-blog-card-title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
                        <p class="pf-blog-card-excerpt"><?php echo esc_html( get_the_excerpt() ); ?></p>
                        <a href="<?php the_permalink(); ?>" class="pf-btn pf-btn-secondary pf-btn-sm"><?php esc_html_e( 'Read More', '${esc(d._td)}' ); ?></a>
                    </div>
                </article>
                <?php endwhile; wp_reset_postdata(); ?>
            </div>
            <?php endif; ?>
        </div>
    </section>`;
}

// ═══════════════════════════════════════════════════════════════
// 7. page.php — Static Pages Template
// ═══════════════════════════════════════════════════════════════

function generatePagePHP(config: ThemeConfig, tpl?: PageTemplateConfig): string {
  const td = config.textDomain;
  const showSidebar = tpl?.layout === 'with-sidebar-left' || tpl?.layout === 'with-sidebar-right';
  const sidebarLeft = tpl?.layout === 'with-sidebar-left';
  const showHeroBanner = tpl?.options?.showHeroBanner !== false;
  const showTitle = tpl?.options?.showTitle !== false;

  const heroBanner = showHeroBanner ? `
            <header class="page-header">
                <?php the_title( '<h1 class="page-title">', '</h1>' ); ?>
            </header>` : '';

  const titleBlock = (!showHeroBanner && showTitle) ? `
                <?php the_title( '<h1 class="page-title">', '</h1>' ); ?>` : '';

  return `<?php
/**
 * Page Template
 * @package ${config.slug}
 */
get_header();
?>

<main class="site-main">
    <div class="container">
        <?php while ( have_posts() ) : the_post(); ?>
${heroBanner}
            <div class="page-content${showSidebar ? ' page-with-sidebar' : ''}">
                ${showSidebar && sidebarLeft ? '<?php get_sidebar(); ?>' : ''}
                <div class="${showSidebar ? 'page-main-content' : ''}">
                    <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
${titleBlock}
                        <div class="entry-content">
                            <?php
                            the_content();

                            wp_link_pages( array(
                                'before' => '<div class="page-links">',
                                'after'  => '</div>',
                            ) );
                            ?>
                        </div>
                    </article>
                </div>
                ${showSidebar && !sidebarLeft ? '<?php get_sidebar(); ?>' : ''}
            </div>
        <?php endwhile; ?>
    </div>
</main>

<?php get_footer(); ?>
`;
}

// ═══════════════════════════════════════════════════════════════
// 8. single.php — Single Post Template
// ═══════════════════════════════════════════════════════════════

function generateSinglePHP(config: ThemeConfig, tpl?: PageTemplateConfig): string {
  const showFeaturedImage = tpl?.options.showFeaturedImage !== false;
  const showSidebar = tpl?.options.showSidebar !== false;

  return `<?php
/**
 * Single Post Template
 * @package ${config.slug}
 */
get_header();
?>

<main class="site-main">
    <div class="container">
        <?php while ( have_posts() ) : the_post(); ?>
            <article <?php post_class(); ?>>
                <header class="single-header">
                    <h1 class="single-title"><?php the_title(); ?></h1>
                    <div class="single-meta">
                        <time class="single-date" datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>">
                            <?php echo esc_html( get_the_date() ); ?>
                        </time>
                        <span class="single-author">
                            <?php esc_html_e( 'by', '${config.textDomain}' ); ?>
                            <a href="<?php echo esc_url( get_author_posts_url( get_the_author_meta( 'ID' ) ) ); ?>">
                                <?php echo esc_html( get_the_author() ); ?>
                            </a>
                        </span>
                        <?php if ( has_category() ) : ?>
                            <span class="single-categories">
                                <?php the_category( ', ' ); ?>
                            </span>
                        <?php endif; ?>
                    </div>
                </header>

                ${showFeaturedImage ? `<?php if ( has_post_thumbnail() ) : ?>
                    <div class="single-featured-image">
                        <?php the_post_thumbnail( 'large' ); ?>
                    </div>
                <?php endif; ?>

` : ''}                <div class="single-content">
                    <?php
                    the_content();
                    wp_link_pages( array(
                        'before' => '<div class="page-links">' . esc_html__( 'Pages:', '${config.textDomain}' ),
                        'after'  => '</div>',
                    ) );
                    ?>
                </div>

                <footer class="single-footer">
                    <?php if ( has_tag() ) : ?>
                        <div class="single-tags">
                            <?php the_tags( '<span class="tag-label">' . esc_html__( 'Tags:', '${config.textDomain}' ) . '</span> ', ', ' ); ?>
                        </div>
                    <?php endif; ?>

                    <nav class="post-navigation">
                        <div class="nav-previous"><?php previous_post_link( '%link', '&laquo; %title' ); ?></div>
                        <div class="nav-next"><?php next_post_link( '%link', '%title &raquo;' ); ?></div>
                    </nav>
                </footer>
            </article>

            <?php
            if ( comments_open() || get_comments_number() ) {
                comments_template();
            }
            ?>
        <?php endwhile; ?>
    </div>
</main>

${showSidebar ? `<?php get_sidebar(); ?>
` : ''}<?php get_footer(); ?>
`;
}

// ═══════════════════════════════════════════════════════════════
// 9. archive.php — Archive Template
// ═══════════════════════════════════════════════════════════════

function generateArchivePHP(config: ThemeConfig, tpl?: PageTemplateConfig): string {
  const showFeaturedImage = tpl?.options.showFeaturedImage !== false;
  const showSidebar = tpl?.options.showSidebar !== false;

  return `<?php
/**
 * Archive Template
 * @package ${config.slug}
 */
get_header();
?>

<main class="site-main">
    <div class="container">
        <header class="archive-header">
            <?php the_archive_title( '<h1 class="archive-title">', '</h1>' ); ?>
            <?php the_archive_description( '<div class="archive-description">', '</div>' ); ?>
        </header>

        <?php if ( have_posts() ) : ?>
            <div class="posts-grid">
                <?php while ( have_posts() ) : the_post(); ?>
                    <article <?php post_class( 'pf-card pf-post-card' ); ?>>
                        ${showFeaturedImage ? `<?php if ( has_post_thumbnail() ) : ?>
                            <a href="<?php the_permalink(); ?>" class="post-card-thumb">
                                <?php the_post_thumbnail( 'medium' ); ?>
                            </a>
                        <?php endif; ?>
                        ` : ''}<div class="post-card-body">
                            <div class="post-card-meta">
                                <time datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>"><?php echo esc_html( get_the_date() ); ?></time>
                            </div>
                            <h2 class="post-card-title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
                            <p class="post-card-excerpt"><?php echo esc_html( get_the_excerpt() ); ?></p>
                            <a href="<?php the_permalink(); ?>" class="pf-btn pf-btn-secondary pf-btn-sm"><?php esc_html_e( 'Read More', '${config.textDomain}' ); ?></a>
                        </div>
                    </article>
                <?php endwhile; ?>
            </div>

            <nav class="pagination" aria-label="<?php esc_attr_e( 'Posts navigation', '${config.textDomain}' ); ?>">
                <?php
                the_posts_pagination( array(
                    'mid_size'  => 2,
                    'prev_text' => '&laquo; ' . esc_html__( 'Previous', '${config.textDomain}' ),
                    'next_text' => esc_html__( 'Next', '${config.textDomain}' ) . ' &raquo;',
                ) );
                ?>
            </nav>

        <?php else : ?>
            <p class="no-results"><?php esc_html_e( 'No posts found.', '${config.textDomain}' ); ?></p>
        <?php endif; ?>
    </div>
</main>

${showSidebar ? `<?php get_sidebar(); ?>
` : ''}<?php get_footer(); ?>
`;
}

// ═══════════════════════════════════════════════════════════════
// 10. search.php — Search Results
// ═══════════════════════════════════════════════════════════════

function generateSearchPHP(config: ThemeConfig, tpl?: PageTemplateConfig): string {
  const showSidebar = tpl?.options.showSidebar !== false;

  return `<?php
/**
 * Search Results Template
 * @package ${config.slug}
 */
get_header();
?>

<main class="site-main">
    <div class="container">
        <header class="search-header">
            <h1 class="search-title">
                <?php printf( esc_html__( 'Search Results for: %s', '${config.textDomain}' ), '<span>' . get_search_query() . '</span>' ); ?>
            </h1>
        </header>

        <?php if ( have_posts() ) : ?>
            <div class="posts-grid">
                <?php while ( have_posts() ) : the_post(); ?>
                    <article <?php post_class( 'pf-card pf-post-card' ); ?>>
                        <div class="post-card-body">
                            <h2 class="post-card-title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
                            <p class="post-card-excerpt"><?php echo esc_html( get_the_excerpt() ); ?></p>
                            <a href="<?php the_permalink(); ?>" class="pf-btn pf-btn-secondary pf-btn-sm"><?php esc_html_e( 'Read More', '${config.textDomain}' ); ?></a>
                        </div>
                    </article>
                <?php endwhile; ?>
            </div>

            <nav class="pagination" aria-label="<?php esc_attr_e( 'Search results navigation', '${config.textDomain}' ); ?>">
                <?php
                the_posts_pagination( array(
                    'mid_size'  => 2,
                    'prev_text' => '&laquo; ' . esc_html__( 'Previous', '${config.textDomain}' ),
                    'next_text' => esc_html__( 'Next', '${config.textDomain}' ) . ' &raquo;',
                ) );
                ?>
            </nav>

        <?php else : ?>
            <div class="no-results">
                <h2><?php esc_html_e( 'Nothing Found', '${config.textDomain}' ); ?></h2>
                <p><?php esc_html_e( 'Sorry, no results matched your search. Please try again with different keywords.', '${config.textDomain}' ); ?></p>
                <?php get_search_form(); ?>
            </div>
        <?php endif; ?>
    </div>
</main>

${showSidebar ? `<?php get_sidebar(); ?>
` : ''}<?php get_footer(); ?>
`;
}

// ═══════════════════════════════════════════════════════════════
// 11. 404.php — Error Page
// ═══════════════════════════════════════════════════════════════

function generate404PHP(config: ThemeConfig, tpl?: PageTemplateConfig): string {
  const showSearchForm = tpl?.options.showSearchForm !== false;

  return `<?php
/**
 * 404 Error Page
 * @package ${config.slug}
 */
get_header();
?>

<main class="site-main">
    <div class="container">
        <div class="error-404">
            <div class="error-404-content">
                <h1 class="error-404-title">404</h1>
                <h2 class="error-404-heading"><?php esc_html_e( 'Page Not Found', '${config.textDomain}' ); ?></h2>
                <p class="error-404-message"><?php esc_html_e( 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.', '${config.textDomain}' ); ?></p>
                <div class="error-404-actions">
                    <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="pf-btn pf-btn-primary"><?php esc_html_e( 'Go Home', '${config.textDomain}' ); ?></a>
                </div>
                ${showSearchForm ? '<?php get_search_form(); ?>' : ''}
            </div>
        </div>
    </div>
</main>

<?php get_footer(); ?>
`;
}

// ═══════════════════════════════════════════════════════════════
// 12. sidebar.php
// ═══════════════════════════════════════════════════════════════

function generateSidebarPHP(config: ThemeConfig, _tpl?: PageTemplateConfig): string {
  return `<?php
/**
 * Sidebar Template
 * @package ${config.slug}
 */
if ( ! is_active_sidebar( 'sidebar-1' ) ) {
    return;
}
?>

<aside class="site-sidebar" id="secondary">
    <?php dynamic_sidebar( 'sidebar-1' ); ?>
</aside>
`;
}

// ═══════════════════════════════════════════════════════════════
// 13. searchform.php
// ═══════════════════════════════════════════════════════════════

function generateSearchformPHP(textDomain: string): string {
  return `<?php
/**
 * Search Form Template
 * @package ${textDomain}
 */
?>
<form role="search" method="get" class="search-form" action="<?php echo esc_url( home_url( '/' ) ); ?>">
    <label class="screen-reader-text" for="search-field"><?php esc_html_e( 'Search for:', '${textDomain}' ); ?></label>
    <div class="search-form-inner">
        <input type="search" id="search-field" class="search-field" placeholder="<?php esc_attr_e( 'Search &hellip;', '${textDomain}' ); ?>" value="<?php echo esc_attr( get_search_query() ); ?>" name="s" />
        <button type="submit" class="search-submit pf-btn pf-btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </button>
    </div>
</form>
`;
}

// ═══════════════════════════════════════════════════════════════
// 14. comments.php
// ═══════════════════════════════════════════════════════════════

function generateCommentsPHP(textDomain: string): string {
  return `<?php
/**
 * Comments Template
 * @package ${textDomain}
 */

if ( post_password_required() ) {
    return;
}
?>

<div id="comments" class="comments-area">

    <?php if ( have_comments() ) : ?>
        <h2 class="comments-title">
            <?php
            $comment_count = get_comments_number();
            if ( '1' === $comment_count ) {
                printf(
                    esc_html__( 'One response to &ldquo;%1$s&rdquo;', '${textDomain}' ),
                    '<span>' . esc_html( get_the_title() ) . '</span>'
                );
            } else {
                printf(
                    esc_html( _n(
                        '%1$s response to &ldquo;%2$s&rdquo;',
                        '%1$s responses to &ldquo;%2$s&rdquo;',
                        $comment_count,
                        '${textDomain}'
                    ) ),
                    esc_html( number_format_i18n( $comment_count ) ),
                    '<span>' . esc_html( get_the_title() ) . '</span>'
                );
            }
            ?>
        </h2>

        <ol class="comment-list">
            <?php
            wp_list_comments( array(
                'style'       => 'ol',
                'short_ping'  => true,
                'avatar_size' => 48,
            ) );
            ?>
        </ol>

        <?php the_comments_navigation(); ?>

    <?php endif; ?>

    <?php
    if ( ! comments_open() && get_comments_number() && post_type_supports( get_post_type(), 'comments' ) ) :
    ?>
        <p class="no-comments"><?php esc_html_e( 'Comments are closed.', '${textDomain}' ); ?></p>
    <?php endif; ?>

    <?php comment_form(); ?>

</div>
`;
}

// ═══════════════════════════════════════════════════════════════
// 15. Template Parts (content.php, content-none.php)
// ═══════════════════════════════════════════════════════════════

function generateContentPHP(textDomain: string): string {
  return `<?php
/**
 * Template part for displaying posts
 * @package ${textDomain}
 */
?>

<article <?php post_class( 'pf-card pf-post-card' ); ?>>
    <?php if ( has_post_thumbnail() ) : ?>
        <a href="<?php the_permalink(); ?>" class="post-card-thumb">
            <?php the_post_thumbnail( 'medium' ); ?>
        </a>
    <?php endif; ?>
    <div class="post-card-body">
        <div class="post-card-meta">
            <time datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>"><?php echo esc_html( get_the_date() ); ?></time>
        </div>
        <h2 class="post-card-title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
        <p class="post-card-excerpt"><?php echo esc_html( get_the_excerpt() ); ?></p>
        <a href="<?php the_permalink(); ?>" class="pf-btn pf-btn-secondary pf-btn-sm"><?php esc_html_e( 'Read More', '${textDomain}' ); ?></a>
    </div>
</article>
`;
}

function generateContentNonePHP(textDomain: string): string {
  return `<?php
/**
 * Template part for displaying no results
 * @package ${textDomain}
 */
?>

<section class="no-results not-found">
    <header class="page-header">
        <h1 class="page-title"><?php esc_html_e( 'Nothing Found', '${textDomain}' ); ?></h1>
    </header>
    <div class="page-content">
        <p><?php esc_html_e( 'It seems we cannot find what you are looking for. Perhaps searching can help.', '${textDomain}' ); ?></p>
        <?php get_search_form(); ?>
    </div>
</section>
`;
}

// ═══════════════════════════════════════════════════════════════
// 16. assets/css/styles.css — Complete Responsive CSS
// ═══════════════════════════════════════════════════════════════

export function generateThemeCSS(config: ThemeConfig): string {
  const c = config;
  const r = br(c.borderRadius);
  const hf = esc(c.headingFont);
  const bf = esc(c.bodyFont);

  return `/* ═══════════════════════════════════════════════════════════
   ${c.name} — Generated by PageForge v2
   ═══════════════════════════════════════════════════════════ */

/* ─── Reset & Base ─────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; scroll-padding-top: 80px; }
body {
    font-family: var(--pf-body-font, '${bf}', sans-serif);
    color: var(--pf-text, ${c.textColor});
    background: var(--pf-bg, ${c.backgroundColor});
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: 1.6;
}
h1, h2, h3, h4, h5, h6 {
    font-family: var(--pf-heading-font, '${hf}', sans-serif);
    line-height: 1.2;
    color: var(--pf-text, ${c.textColor});
}
img { max-width: 100%; height: auto; display: block; }
a { color: inherit; text-decoration: none; transition: color 0.2s ease; }
ul, ol { list-style: none; }
.screen-reader-text { clip: rect(1px,1px,1px,1px); position: absolute; width: 1px; height: 1px; overflow: hidden; }

/* ─── Layout ───────────────────────────────────────────── */
.container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
.site-main { min-height: 60vh; }

/* ─── Header / Navigation ──────────────────────────────── */
.site-header {
    position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
    transition: all 0.3s ease; background: transparent;
}
.site-header.scrolled {
    background: rgba(255,255,255,0.97);
    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}
.header-container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
.header-inner {
    display: flex; align-items: center; justify-content: space-between;
    height: 72px; transition: height 0.3s;
}
.site-brand {
    display: flex; align-items: center; gap: 12px;
    font-family: var(--pf-heading-font, '${hf}', sans-serif);
    font-size: 1.5rem; font-weight: 800; color: #fff;
    text-decoration: none; transition: color 0.3s;
}
.site-brand img { height: 48px; width: auto; }
.site-header.scrolled .site-brand { color: var(--pf-text, ${c.textColor}); }

/* Nav Menu */
.main-nav { display: flex; align-items: center; }
.nav-menu { display: flex; gap: 32px; list-style: none; }
.nav-menu li { position: relative; }
.nav-menu a {
    color: rgba(255,255,255,0.9); font-size: 0.9rem; font-weight: 500;
    padding: 8px 0; transition: color 0.2s;
}
.site-header.scrolled .nav-menu a { color: var(--pf-text, ${c.textColor}); opacity: 0.8; }
.nav-menu a:hover, .nav-menu .current-menu-item > a {
    color: var(--pf-accent, ${c.accentColor}); opacity: 1;
}
.nav-menu .sub-menu {
    position: absolute; top: 100%; left: 0; min-width: 200px;
    background: #fff; border-radius: var(--pf-radius, ${r});
    box-shadow: 0 8px 24px rgba(0,0,0,0.12); padding: 8px 0;
    opacity: 0; visibility: hidden; transform: translateY(8px);
    transition: all 0.2s ease;
}
.nav-menu li:hover > .sub-menu { opacity: 1; visibility: visible; transform: translateY(0); }
.nav-menu .sub-menu a { color: var(--pf-text, ${c.textColor}); padding: 10px 20px; display: block; }
.nav-menu .sub-menu a:hover { background: var(--pf-primary, ${c.primaryColor})08; color: var(--pf-primary, ${c.primaryColor}); }

/* Mobile Toggle */
.mobile-toggle {
    display: none; flex-direction: column; gap: 5px; cursor: pointer;
    padding: 4px; background: none; border: none; z-index: 1001;
}
.hamburger-line {
    width: 24px; height: 2px; background: #fff;
    transition: all 0.3s; border-radius: 2px;
}
.site-header.scrolled .hamburger-line { background: var(--pf-text, ${c.textColor}); }
.mobile-toggle.active .hamburger-line:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
.mobile-toggle.active .hamburger-line:nth-child(2) { opacity: 0; }
.mobile-toggle.active .hamburger-line:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

/* Mobile Menu */
.mobile-menu-overlay {
    display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 999;
}
.mobile-menu-overlay.open { display: block; }
.mobile-menu-panel {
    position: fixed; top: 0; right: -300px; width: 300px; height: 100%; z-index: 1000;
    background: #fff; padding: 80px 32px 32px;
    box-shadow: -4px 0 20px rgba(0,0,0,0.1);
    transition: right 0.3s ease; overflow-y: auto;
}
.mobile-menu-panel.open { right: 0; }
.mobile-nav-menu { display: flex; flex-direction: column; gap: 0; }
.mobile-nav-menu a {
    display: block; padding: 16px 0; font-size: 1rem;
    color: var(--pf-text, ${c.textColor}); border-bottom: 1px solid #f0f0f0;
    font-weight: 500; transition: color 0.2s;
}
.mobile-nav-menu a:hover { color: var(--pf-primary, ${c.primaryColor}); }

/* ─── Buttons ──────────────────────────────────────────── */
.pf-btn {
    display: inline-flex; align-items: center; justify-content: center;
    padding: 14px 32px; font-weight: 600; border-radius: var(--pf-radius, ${r});
    transition: all 0.2s; text-decoration: none; cursor: pointer; border: none;
    font-size: 1rem; font-family: var(--pf-body-font, '${bf}', sans-serif); line-height: 1;
}
.pf-btn-sm { padding: 10px 20px; font-size: 0.875rem; }
.pf-btn-primary { background: var(--pf-primary, ${c.primaryColor}); color: #fff; }
.pf-btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
.pf-btn-secondary { background: var(--pf-secondary, ${c.secondaryColor}); color: #fff; }
.pf-btn-secondary:hover { opacity: 0.9; transform: translateY(-1px); }
.pf-btn-accent { background: var(--pf-accent, ${c.accentColor}); color: #fff; }
.pf-btn-accent:hover { transform: translateY(-1px); box-shadow: 0 8px 24px ${c.accentColor}40; }
.pf-btn-outline { background: transparent; border: 2px solid var(--pf-primary, ${c.primaryColor}); color: var(--pf-primary, ${c.primaryColor}); }
.pf-btn-outline:hover { background: var(--pf-primary, ${c.primaryColor}); color: #fff; }
.pf-btn-white { background: #fff; color: var(--pf-primary, ${c.primaryColor}); }
.pf-btn-white:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
.pf-btn-outline-white { background: transparent; border: 2px solid rgba(255,255,255,0.4); color: #fff; }
.pf-btn-outline-white:hover { background: rgba(255,255,255,0.1); border-color: #fff; }

/* ─── Cards ────────────────────────────────────────────── */
.pf-card {
    background: #fff; border-radius: var(--pf-radius, ${r});
    padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    transition: all 0.3s ease;
}
.pf-card:hover { box-shadow: 0 20px 40px rgba(0,0,0,0.08); transform: translateY(-4px); }

/* ─── Sections ─────────────────────────────────────────── */
.pf-section { padding: 96px 0; }
.pf-section-alt { padding: 96px 0; background: var(--pf-primary, ${c.primaryColor})04; }
.pf-section-header { text-align: center; margin-bottom: 64px; }
.pf-section-title {
    font-size: 2.5rem; font-weight: 800; color: var(--pf-text, ${c.textColor});
    margin-bottom: 16px; letter-spacing: -0.02em;
}
.pf-section-subtitle {
    font-size: 1.125rem; color: var(--pf-text, ${c.textColor});
    opacity: 0.65; max-width: 640px; margin: 0 auto; line-height: 1.7;
}

/* Grids */
.pf-grid { display: grid; gap: 32px; }
.pf-grid-2 { grid-template-columns: repeat(2, 1fr); }
.pf-grid-3 { grid-template-columns: repeat(3, 1fr); }
.pf-grid-4 { grid-template-columns: repeat(4, 1fr); }

/* ─── Hero ─────────────────────────────────────────────── */
.pf-hero {
    position: relative; display: flex; align-items: center;
    justify-content: center; overflow: hidden; min-height: 100vh;
}
.pf-hero-bg {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, var(--pf-primary, ${c.primaryColor}), var(--pf-secondary, ${c.secondaryColor}));
    background-size: cover; background-position: center;
}
.pf-hero-overlay { position: absolute; inset: 0; }
.pf-hero-content {
    position: relative; z-index: 2; text-align: center;
    padding: 120px 24px 80px; max-width: 800px;
}
.pf-hero-title {
    font-size: 3.5rem; font-weight: 800; color: #fff;
    line-height: 1.1; margin-bottom: 24px; letter-spacing: -0.03em;
}
.pf-hero-subtitle {
    font-size: 1.25rem; color: rgba(255,255,255,0.85);
    line-height: 1.7; margin-bottom: 40px;
}
.pf-hero-actions { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }

/* ─── About ────────────────────────────────────────────── */
.pf-about-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 64px; align-items: center;
}
.pf-about-text .pf-section-subtitle { margin: 0 0 24px; text-align: left; max-width: none; }
.pf-about-image {
    aspect-ratio: 4/3; border-radius: var(--pf-radius, ${r});
    overflow: hidden;
    background: linear-gradient(135deg, var(--pf-primary, ${c.primaryColor})15, var(--pf-secondary, ${c.secondaryColor})15);
    display: flex; align-items: center; justify-content: center;
}
.pf-about-image img { width: 100%; height: 100%; object-fit: cover; }
.pf-image-placeholder {
    font-size: 3rem; opacity: 0.3; color: var(--pf-primary, ${c.primaryColor});
}
.pf-about-stats { display: flex; gap: 48px; margin-top: 40px; flex-wrap: wrap; }
.pf-stat-value {
    font-size: 2.5rem; font-weight: 800;
    color: var(--pf-primary, ${c.primaryColor});
    font-family: var(--pf-heading-font, '${hf}', sans-serif);
}
.pf-stat-label { font-size: 0.875rem; color: var(--pf-text, ${c.textColor}); opacity: 0.6; margin-top: 4px; }

/* ─── Feature Cards ────────────────────────────────────── */
.pf-feature-icon {
    width: 56px; height: 56px; border-radius: var(--pf-radius, ${r});
    background: var(--pf-primary, ${c.primaryColor})12;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 20px; font-size: 1.5rem;
}
.pf-feature-card h3 { font-size: 1.25rem; font-weight: 700; color: var(--pf-text, ${c.textColor}); margin-bottom: 8px; }
.pf-feature-card p { font-size: 0.9375rem; color: var(--pf-text, ${c.textColor}); opacity: 0.7; line-height: 1.7; }

/* ─── Testimonials ─────────────────────────────────────── */
.pf-testimonial-card { text-align: center; }
.pf-testimonial-stars { color: var(--pf-accent, ${c.accentColor}); font-size: 1rem; margin-bottom: 16px; letter-spacing: 2px; }
.pf-testimonial-quote {
    font-size: 1.0625rem; color: var(--pf-text, ${c.textColor});
    font-style: italic; line-height: 1.8; margin-bottom: 24px;
}
.pf-testimonial-author { font-weight: 700; color: var(--pf-text, ${c.textColor}); font-size: 0.9375rem; }
.pf-testimonial-role { font-size: 0.8125rem; color: var(--pf-text, ${c.textColor}); opacity: 0.5; margin-top: 2px; }

/* ─── Pricing ──────────────────────────────────────────── */
.pf-pricing-card { text-align: center; padding: 40px 32px; }
.pf-pricing-card.featured {
    border: 2px solid var(--pf-primary, ${c.primaryColor});
    transform: scale(1.05);
    box-shadow: 0 24px 48px var(--pf-primary, ${c.primaryColor})20;
    position: relative;
}
.pf-pricing-badge {
    position: absolute; top: -14px; left: 50%; transform: translateX(-50%);
    background: var(--pf-primary, ${c.primaryColor}); color: #fff;
    padding: 4px 20px; border-radius: 9999px;
    font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;
}
.pf-pricing-name { font-size: 1.25rem; font-weight: 700; color: var(--pf-text, ${c.textColor}); margin-bottom: 8px; }
.pf-pricing-desc { font-size: 0.875rem; color: var(--pf-text, ${c.textColor}); opacity: 0.5; margin-bottom: 24px; }
.pf-pricing-price {
    font-size: 3rem; font-weight: 800; color: var(--pf-primary, ${c.primaryColor});
    margin-bottom: 4px; font-family: var(--pf-heading-font, '${hf}', sans-serif);
}
.pf-pricing-period { font-size: 0.875rem; color: var(--pf-text, ${c.textColor}); opacity: 0.5; margin-bottom: 32px; }
.pf-pricing-features { list-style: none; text-align: left; margin-bottom: 32px; }
.pf-pricing-features li {
    padding: 10px 0; font-size: 0.9375rem; color: var(--pf-text, ${c.textColor});
    display: flex; align-items: center; gap: 12px; border-bottom: 1px solid #f5f5f5;
}
.pf-pricing-features li svg { color: var(--pf-primary, ${c.primaryColor}); flex-shrink: 0; }

/* ─── CTA ──────────────────────────────────────────────── */
.pf-cta { position: relative; overflow: hidden; padding: 96px 0; }
.pf-cta-bg {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, var(--pf-primary, ${c.primaryColor}), var(--pf-secondary, ${c.secondaryColor}));
}
.pf-cta-decor { position: absolute; border-radius: 50%; background: rgba(255,255,255,0.05); }
.pf-cta-content { position: relative; z-index: 2; text-align: center; }
.pf-cta-content h2 { font-size: 2.5rem; font-weight: 800; color: #fff; margin-bottom: 16px; }
.pf-cta-content p {
    font-size: 1.125rem; color: rgba(255,255,255,0.8);
    margin-bottom: 40px; max-width: 600px; margin-left: auto; margin-right: auto;
}

/* ─── Contact ──────────────────────────────────────────── */
.pf-contact-cards {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 24px; max-width: 900px; margin: 0 auto;
}
.pf-contact-card { text-align: center; padding: 40px 24px; }
.pf-contact-icon {
    width: 56px; height: 56px; border-radius: 50%;
    background: var(--pf-primary, ${c.primaryColor})12;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 16px; color: var(--pf-primary, ${c.primaryColor});
}
.pf-contact-label {
    font-size: 0.8125rem; color: var(--pf-text, ${c.textColor});
    text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;
}
.pf-contact-value { font-size: 1rem; font-weight: 600; color: var(--pf-text, ${c.textColor}); }

/* ─── Gallery ──────────────────────────────────────────── */
.pf-gallery-grid { display: grid; gap: 16px; }
.pf-gallery-cols-2 { grid-template-columns: repeat(2, 1fr); }
.pf-gallery-cols-3 { grid-template-columns: repeat(3, 1fr); }
.pf-gallery-cols-4 { grid-template-columns: repeat(4, 1fr); }
.pf-gallery-item {
    position: relative; overflow: hidden;
    border-radius: var(--pf-radius, ${r}); aspect-ratio: 1;
    background: linear-gradient(135deg, var(--pf-primary, ${c.primaryColor})15, var(--pf-secondary, ${c.secondaryColor})15);
}
.pf-gallery-item img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
.pf-gallery-item:hover img { transform: scale(1.05); }
.pf-gallery-caption {
    position: absolute; bottom: 0; left: 0; right: 0; padding: 16px;
    background: linear-gradient(transparent, rgba(0,0,0,0.7));
    color: #fff; font-size: 0.875rem; font-weight: 500;
    transform: translateY(100%); transition: transform 0.3s;
}
.pf-gallery-item:hover .pf-gallery-caption { transform: translateY(0); }

/* ─── FAQ ──────────────────────────────────────────────── */
.pf-faq-item {
    background: #fff; border-radius: var(--pf-radius, ${r});
    overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.06); margin-bottom: 12px;
}
.pf-faq-question {
    width: 100%; padding: 20px 24px; display: flex;
    justify-content: space-between; align-items: center;
    border: none; background: none; cursor: pointer;
    font-size: 1rem; font-weight: 600;
    color: var(--pf-text, ${c.textColor});
    font-family: var(--pf-body-font, '${bf}', sans-serif); text-align: left;
}
.pf-faq-chevron {
    transition: transform 0.3s; color: var(--pf-primary, ${c.primaryColor});
    width: 32px; height: 32px; border-radius: 50%;
    background: var(--pf-primary, ${c.primaryColor})12;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.pf-faq-item.open .pf-faq-chevron { transform: rotate(180deg); background: var(--pf-primary, ${c.primaryColor}); color: #fff; }
.pf-faq-answer { max-height: 0; overflow: hidden; transition: max-height 0.3s ease; }
.pf-faq-item.open .pf-faq-answer { max-height: 300px; }
.pf-faq-answer-inner { padding: 0 24px 20px; font-size: 0.9375rem; color: var(--pf-text, ${c.textColor}); opacity: 0.7; line-height: 1.7; }

/* ─── Stats ────────────────────────────────────────────── */
.pf-stats-bar {
    background: linear-gradient(135deg, var(--pf-primary, ${c.primaryColor}), var(--pf-secondary, ${c.secondaryColor}));
    border-radius: var(--pf-radius, ${r}); padding: 80px 48px;
    display: grid; gap: 32px; text-align: center;
}
.pf-stat-icon {
    width: 48px; height: 48px; border-radius: 50%;
    background: rgba(255,255,255,0.15);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 12px; font-size: 1.25rem; color: #fff;
}

/* ─── Team ─────────────────────────────────────────────── */
.pf-team-card { text-align: center; padding: 40px 24px; }
.pf-team-avatar {
    width: 96px; height: 96px; border-radius: 50%; margin: 0 auto 20px;
    background: linear-gradient(135deg, var(--pf-primary, ${c.primaryColor}), var(--pf-secondary, ${c.secondaryColor}));
    overflow: hidden; display: flex; align-items: center;
    justify-content: center; color: #fff; font-weight: 700; font-size: 1.5rem;
}
.pf-team-avatar img { width: 100%; height: 100%; object-fit: cover; }
.pf-team-name { font-size: 1.125rem; font-weight: 700; color: var(--pf-text, ${c.textColor}); margin-bottom: 4px; }
.pf-team-role { font-size: 0.875rem; color: var(--pf-primary, ${c.primaryColor}); font-weight: 500; margin-bottom: 12px; }
.pf-team-bio { font-size: 0.875rem; color: var(--pf-text, ${c.textColor}); opacity: 0.5; line-height: 1.6; margin-bottom: 16px; }
.pf-team-socials { display: flex; gap: 8px; justify-content: center; }
.pf-team-social-link {
    width: 32px; height: 32px; border-radius: 50%;
    background: var(--pf-primary, ${c.primaryColor})12;
    display: flex; align-items: center; justify-content: center;
    color: var(--pf-primary, ${c.primaryColor}); transition: all 0.2s; text-decoration: none;
    font-size: 0.75rem; font-weight: 700;
}
.pf-team-social-link:hover { background: var(--pf-primary, ${c.primaryColor}); color: #fff; }

/* ─── Blog Posts ───────────────────────────────────────── */
.pf-blog-card { padding: 0; overflow: hidden; }
.pf-blog-card-image a { display: block; overflow: hidden; }
.pf-blog-card-image img { width: 100%; aspect-ratio: 16/10; object-fit: cover; transition: transform 0.3s; }
.pf-blog-card:hover .pf-blog-card-image img { transform: scale(1.03); }
.pf-blog-card-content { padding: 24px; }
.pf-blog-card-meta { font-size: 0.8125rem; color: var(--pf-text, ${c.textColor}); opacity: 0.5; margin-bottom: 8px; }
.pf-blog-card-title { font-size: 1.125rem; font-weight: 700; margin-bottom: 8px; }
.pf-blog-card-title a { color: var(--pf-text, ${c.textColor}); transition: color 0.2s; }
.pf-blog-card-title a:hover { color: var(--pf-primary, ${c.primaryColor}); }
.pf-blog-card-excerpt { font-size: 0.9rem; color: var(--pf-text, ${c.textColor}); opacity: 0.65; line-height: 1.6; margin-bottom: 16px; }

/* ─── Post Cards (Archive/Index) ───────────────────────── */
.pf-post-card { display: flex; flex-direction: column; padding: 0; overflow: hidden; }
.post-card-thumb { display: block; overflow: hidden; }
.post-card-thumb img { width: 100%; aspect-ratio: 16/10; object-fit: cover; transition: transform 0.3s; }
.pf-post-card:hover .post-card-thumb img { transform: scale(1.03); }
.post-card-body { padding: 24px; flex: 1; display: flex; flex-direction: column; }
.post-card-meta { font-size: 0.8125rem; color: var(--pf-text, ${c.textColor}); opacity: 0.5; margin-bottom: 8px; }
.post-card-title { font-size: 1.125rem; font-weight: 700; margin-bottom: 8px; }
.post-card-title a { color: var(--pf-text, ${c.textColor}); transition: color 0.2s; }
.post-card-title a:hover { color: var(--pf-primary, ${c.primaryColor}); }
.post-card-excerpt { font-size: 0.9rem; color: var(--pf-text, ${c.textColor}); opacity: 0.65; line-height: 1.6; margin-bottom: 16px; }

/* ─── Single Post / Page ───────────────────────────────── */
.page-header { margin-bottom: 48px; }
.page-title {
    font-size: 2.5rem; font-weight: 800; margin-bottom: 16px;
    color: var(--pf-text, ${c.textColor});
}
.page-content { line-height: 1.8; }
.page-content h2 { font-size: 1.75rem; margin: 32px 0 16px; }
.page-content h3 { font-size: 1.375rem; margin: 24px 0 12px; }
.page-content p { margin-bottom: 16px; }
.page-content ul, .page-content ol { margin-bottom: 16px; padding-left: 24px; }
.page-content li { margin-bottom: 8px; list-style: inherit; }
.page-content img { border-radius: var(--pf-radius, ${r}); margin: 16px 0; }

.single-header { margin-bottom: 48px; text-align: center; max-width: 800px; margin-left: auto; margin-right: auto; }
.single-title { font-size: 2.5rem; font-weight: 800; margin-bottom: 16px; }
.single-meta {
    display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;
    font-size: 0.875rem; color: var(--pf-text, ${c.textColor}); opacity: 0.6;
}
.single-featured-image { margin-bottom: 48px; border-radius: var(--pf-radius, ${r}); overflow: hidden; }
.single-featured-image img { width: 100%; }
.single-content { max-width: 800px; margin: 0 auto; line-height: 1.8; padding-bottom: 48px; }
.single-footer { max-width: 800px; margin: 0 auto; padding-top: 32px; border-top: 1px solid #eee; }
.single-tags { margin-bottom: 24px; }
.tag-label { font-weight: 600; color: var(--pf-text, ${c.textColor}); margin-right: 8px; }
.post-navigation { display: flex; justify-content: space-between; gap: 24px; margin-top: 32px; }
.nav-previous a, .nav-next a { color: var(--pf-primary, ${c.primaryColor}); font-weight: 500; }

/* ─── Archive Header ───────────────────────────────────── */
.archive-header, .search-header { margin-bottom: 48px; text-align: center; }
.archive-title, .search-title {
    font-size: 2.5rem; font-weight: 800; margin-bottom: 16px;
    color: var(--pf-text, ${c.textColor});
}
.archive-description { opacity: 0.65; max-width: 640px; margin: 0 auto; }

/* ─── Posts Grid (Index/Archive) ────────────────────────── */
.posts-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 32px; margin-bottom: 48px; }

/* ─── Pagination ────────────────────────────────────────── */
.pagination { display: flex; justify-content: center; gap: 8px; margin-top: 48px; }
.pagination .page-numbers {
    display: inline-flex; align-items: center; justify-content: center;
    min-width: 40px; height: 40px; border-radius: var(--pf-radius, ${r});
    font-weight: 500; transition: all 0.2s; text-decoration: none;
}
.pagination .page-numbers.current { background: var(--pf-primary, ${c.primaryColor}); color: #fff; }
.pagination .page-numbers:hover { background: var(--pf-primary, ${c.primaryColor}); color: #fff; }

/* ─── Sidebar ──────────────────────────────────────────── */
.site-sidebar { padding: 24px 0; }
.site-sidebar .widget { margin-bottom: 32px; }
.site-sidebar .widget-title {
    font-size: 1.125rem; font-weight: 700; margin-bottom: 16px;
    padding-bottom: 12px; border-bottom: 2px solid var(--pf-primary, ${c.primaryColor});
}
.site-sidebar ul { display: flex; flex-direction: column; gap: 8px; }
.site-sidebar ul li a {
    color: var(--pf-text, ${c.textColor}); opacity: 0.7; font-size: 0.9rem;
    padding: 6px 0; transition: all 0.2s;
}
.site-sidebar ul li a:hover { opacity: 1; color: var(--pf-primary, ${c.primaryColor}); }

/* ─── Page Layout with Sidebar ─────────────────────────── */
.page-with-sidebar { display: grid; grid-template-columns: 1fr 300px; gap: 48px; }
.page-with-sidebar.sidebar-left { grid-template-columns: 300px 1fr; }
.page-main-content { min-width: 0; }

/* ─── Footer ───────────────────────────────────────────── */
.site-footer { background: #0f0f0f; padding: 80px 0 0; color: #9ca3af; }
.footer-grid {
    display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
    gap: 48px; max-width: 1200px; margin: 0 auto; padding-bottom: 48px;
}
.footer-logo { margin-bottom: 16px; }
.footer-logo img { height: 40px; width: auto; filter: brightness(0) invert(1); }
.footer-brand-name {
    font-size: 1.5rem; font-weight: 800; color: #fff;
    margin-bottom: 16px; font-family: var(--pf-heading-font, '${hf}', sans-serif);
}
.footer-description { font-size: 0.875rem; line-height: 1.7; margin-bottom: 24px; max-width: 320px; }
.footer-social { display: flex; gap: 12px; }
.footer-social .social-link {
    width: 40px; height: 40px; border-radius: 50%;
    background: rgba(255,255,255,0.08);
    display: flex; align-items: center; justify-content: center;
    color: #9ca3af; font-size: 0.875rem; transition: all 0.2s;
}
.footer-social .social-link:hover { background: var(--pf-primary, ${c.primaryColor}); color: #fff; }
.footer-col .widget-title {
    font-size: 0.8125rem; font-weight: 700; color: #fff;
    text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 20px;
}
.footer-menu { display: flex; flex-direction: column; gap: 12px; }
.footer-menu a { color: #9ca3af; font-size: 0.875rem; transition: color 0.2s; }
.footer-menu a:hover { color: #fff; }
.footer-bottom {
    border-top: 1px solid rgba(255,255,255,0.08);
    padding: 24px 0; text-align: center; font-size: 0.8125rem; color: #6b7280;
}

/* ─── Back to Top ──────────────────────────────────────── */
.back-to-top {
    position: fixed; bottom: 32px; right: 32px; width: 48px; height: 48px;
    border-radius: 50%; background: var(--pf-primary, ${c.primaryColor}); color: #fff;
    border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 12px var(--pf-primary, ${c.primaryColor})40;
    opacity: 0; transform: translateY(20px); transition: all 0.3s; z-index: 999;
}
.back-to-top.visible { opacity: 1; transform: translateY(0); }
.back-to-top:hover { transform: translateY(-2px); box-shadow: 0 8px 24px var(--pf-primary, ${c.primaryColor})50; }

/* ─── 404 ──────────────────────────────────────────────── */
.error-404 {
    text-align: center; padding: 120px 24px 96px;
}
.error-404-title {
    font-size: 8rem; font-weight: 800; line-height: 1;
    color: var(--pf-primary, ${c.primaryColor}); margin-bottom: 16px;
}
.error-404-heading { font-size: 1.75rem; font-weight: 700; margin-bottom: 16px; }
.error-404-message { font-size: 1.0625rem; opacity: 0.65; margin-bottom: 32px; max-width: 480px; margin-left: auto; margin-right: auto; }
.error-404-actions { margin-bottom: 32px; }

/* ─── Search Form ──────────────────────────────────────── */
.search-form { max-width: 480px; margin: 32px auto 0; }
.search-form-inner {
    display: flex; gap: 8px; background: #fff; border-radius: var(--pf-radius, ${r});
    padding: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
.search-field {
    flex: 1; border: none; padding: 12px 16px; font-size: 1rem;
    background: transparent; outline: none; font-family: var(--pf-body-font, '${bf}', sans-serif);
    color: var(--pf-text, ${c.textColor});
}
.search-submit { flex-shrink: 0; }

/* ─── Comments ─────────────────────────────────────────── */
.comments-area { max-width: 800px; margin: 48px auto 0; }
.comments-title { font-size: 1.5rem; font-weight: 700; margin-bottom: 32px; }
.comment-list { display: flex; flex-direction: column; gap: 24px; }
.comment-body { display: flex; gap: 16px; padding: 24px; background: #fff; border-radius: var(--pf-radius, ${r}); box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
.comment-author-avatar img { width: 48px; height: 48px; border-radius: 50%; }
.comment-content { flex: 1; }
.comment-content p { margin-bottom: 8px; }
.no-comments { text-align: center; padding: 48px 24px; opacity: 0.6; }
.no-results { text-align: center; padding: 48px 24px; }

/* ─── Animations ───────────────────────────────────────── */
@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
}
.pf-animate {
    opacity: 0; transform: translateY(30px);
    transition: opacity 0.6s ease, transform 0.6s ease;
}
.pf-animate.visible { opacity: 1; transform: translateY(0); }

/* ─── Responsive: 1024px ───────────────────────────────── */
@media (max-width: 1024px) {
    .pf-grid-4 { grid-template-columns: repeat(2, 1fr); }
    .footer-grid { grid-template-columns: 1fr 1fr 1fr; }
    .footer-grid > :first-child { grid-column: span 3; }
    .pf-gallery-cols-4 { grid-template-columns: repeat(3, 1fr); }
}

/* ─── Responsive: 768px ────────────────────────────────── */
@media (max-width: 768px) {
    .pf-grid-2, .pf-grid-3, .pf-grid-4 { grid-template-columns: 1fr; }
    .pf-about-grid { grid-template-columns: 1fr; }
    .pf-contact-cards { grid-template-columns: 1fr; }
    .pf-stats-bar { grid-template-columns: repeat(2, 1fr) !important; padding: 48px 24px; }
    .pf-hero-title { font-size: 2.5rem; }
    .pf-hero-subtitle { font-size: 1.0625rem; }
    .pf-section { padding: 64px 0; }
    .pf-section-alt { padding: 64px 0; }
    .pf-section-title { font-size: 2rem; }
    .main-nav { display: none; }
    .mobile-toggle { display: flex; }
    .footer-grid { grid-template-columns: 1fr; gap: 32px; }
    .footer-grid > :first-child { grid-column: span 1; }
    .pf-cta-content h2 { font-size: 2rem; }
    .pf-pricing-card.featured { transform: scale(1); }
    .pf-gallery-cols-3, .pf-gallery-cols-4 { grid-template-columns: repeat(2, 1fr); }
    .posts-grid { grid-template-columns: 1fr; }
    .single-title { font-size: 2rem; }
    .page-title { font-size: 2rem; }
    .post-navigation { flex-direction: column; }
}

/* ─── Responsive: 480px ────────────────────────────────── */
@media (max-width: 480px) {
    .pf-hero-title { font-size: 2rem; }
    .pf-hero-actions { flex-direction: column; align-items: center; }
    .pf-hero-actions .pf-btn { width: 100%; }
    .pf-about-stats { gap: 24px; }
    .pf-gallery-cols-2, .pf-gallery-cols-3, .pf-gallery-cols-4 { grid-template-columns: 1fr; }
    .pf-stat-value { font-size: 2rem; }
    .error-404-title { font-size: 5rem; }
}
`;
}

// ═══════════════════════════════════════════════════════════════
// 17. assets/js/main.js — JavaScript Interactions
// ═══════════════════════════════════════════════════════════════

export function generateThemeJS(): string {
  return `/**
 * PageForge Theme — Main JavaScript
 * Handles mobile menu, sticky header, FAQ accordion,
 * smooth scroll, back to top, and scroll animations.
 */
(function() {
    'use strict';

    // ─── Mobile Menu Toggle ───────────────────────────────
    var toggle = document.getElementById('mobile-toggle');
    var overlay = document.getElementById('mobile-menu-overlay');
    var panel = document.getElementById('mobile-menu-panel');

    if (toggle && overlay && panel) {
        function openMenu() {
            toggle.classList.add('active');
            toggle.setAttribute('aria-expanded', 'true');
            overlay.classList.add('open');
            panel.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
        function closeMenu() {
            toggle.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
            overlay.classList.remove('open');
            panel.classList.remove('open');
            document.body.style.overflow = '';
        }
        toggle.addEventListener('click', function() {
            if (panel.classList.contains('open')) { closeMenu(); }
            else { openMenu(); }
        });
        overlay.addEventListener('click', closeMenu);
        var mobileLinks = panel.querySelectorAll('a');
        for (var i = 0; i < mobileLinks.length; i++) {
            mobileLinks[i].addEventListener('click', closeMenu);
        }
    }

    // ─── Sticky Header on Scroll ──────────────────────────
    var header = document.getElementById('site-header');
    if (header) {
        function handleScroll() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    }

    // ─── FAQ Accordion ───────────────────────────────────
    var faqItems = document.querySelectorAll('.pf-faq-item');
    for (var f = 0; f < faqItems.length; f++) {
        var btn = faqItems[f].querySelector('.pf-faq-question');
        if (btn) {
            btn.addEventListener('click', function() {
                var parent = this.parentElement;
                var isOpen = parent.classList.contains('open');
                // Close all
                for (var j = 0; j < faqItems.length; j++) {
                    faqItems[j].classList.remove('open');
                }
                // Toggle clicked
                if (!isOpen) {
                    parent.classList.add('open');
                }
            });
        }
    }

    // ─── Smooth Scroll for anchor links ───────────────────
    var anchors = document.querySelectorAll('a[href^="#"]');
    for (var a = 0; a < anchors.length; a++) {
        anchors[a].addEventListener('click', function(e) {
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                var offset = 80;
                var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    }

    // ─── Back to Top Button ───────────────────────────────
    var btt = document.getElementById('back-to-top');
    if (btt) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 500) { btt.classList.add('visible'); }
            else { btt.classList.remove('visible'); }
        }, { passive: true });
        btt.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ─── Scroll Animations ───────────────────────────────
    var animEls = document.querySelectorAll('.pf-animate');
    if (animEls.length > 0 && 'IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        for (var o = 0; o < animEls.length; o++) {
            observer.observe(animEls[o]);
        }
    }
})();
`;
}

// ═══════════════════════════════════════════════════════════════
// Image Processing — Embed uploaded images into theme ZIP
// ═══════════════════════════════════════════════════════════════

/**
 * Represents a base64 data URL found in the theme config that needs
 * to be embedded as a real image file in the WordPress theme ZIP.
 */
export interface ImageDataUrl {
  /** Original data URL string (e.g., "data:image/png;base64,iVBOR...") */
  dataUrl: string;
  /** Filename for the ZIP under assets/img/ (e.g., "hero-bg-a1b2c3d4.png") */
  filename: string;
  /** Decoded binary buffer of the image */
  buffer: Buffer;
  /** Descriptive context label (e.g., "logo", "hero-bg", "gallery-0") */
  context: string;
}

/** Check if a string is a base64-encoded data:image URL */
function isDataUrl(value: unknown): value is string {
  return typeof value === 'string' && value.startsWith('data:image/') && value.includes(';base64,');
}

/** Extract file extension from a data URL's MIME type */
function getExtFromDataUrl(dataUrl: string): string {
  const match = dataUrl.match(/^data:image\/([a-zA-Z0-9.+_-]+)/);
  if (!match) return 'png';
  const mime = match[1].toLowerCase();
  const extMap: Record<string, string> = {
    jpeg: 'jpg',
    jpg: 'jpg',
    png: 'png',
    gif: 'gif',
    webp: 'webp',
    'svg+xml': 'svg',
    bmp: 'bmp',
  };
  return extMap[mime] || 'png';
}

/** Decode the base64 payload of a data URL into a Buffer */
function decodeDataUrl(dataUrl: string): Buffer {
  const base64Part = dataUrl.split(',')[1] || '';
  return Buffer.from(base64Part, 'base64');
}

/** Generate a unique filename using context prefix + content hash + extension */
function makeImageFilename(context: string, buffer: Buffer, ext: string): string {
  const hash = buffer.subarray(0, 16).toString('hex').slice(0, 8);
  return `${context}-${hash}.${ext}`;
}

/**
 * Recursively scan a ThemeConfig for all data:image;base64 URLs.
 * Returns a Map keyed by the original data URL string, with each entry
 * containing the filename, buffer, and context label.
 *
 * Scans: config.logoUrl, hero backgroundImage, about image,
 * gallery images[].src, team members[].avatar, and any other
 * string values that match data:image/...;base64,.
 */
export function collectDataUrlsFromConfig(config: ThemeConfig): Map<string, ImageDataUrl> {
  const images = new Map<string, ImageDataUrl>();

  function add(dataUrl: string, context: string): void {
    if (!isDataUrl(dataUrl) || images.has(dataUrl)) return;
    const ext = getExtFromDataUrl(dataUrl);
    const buf = decodeDataUrl(dataUrl);
    images.set(dataUrl, {
      dataUrl,
      filename: makeImageFilename(context, buf, ext),
      buffer: buf,
      context,
    });
  }

  // Known top-level image field: logoUrl
  add(config.logoUrl, 'logo');

  // Scan each section's data for image fields
  if (Array.isArray(config.sections)) {
    config.sections.forEach((section, sIdx) => {
      if (!section?.data) return;
      const d = section.data;
      const t = section.type || `s${sIdx}`;

      // Known image fields with descriptive context names
      add(d.backgroundImage, `${t}-bg`);
      add(d.image, `${t}-img`);

      // Gallery images array: images[].src
      if (Array.isArray(d.images)) {
        (d.images as any[]).forEach((img: any, i: number) => {
          if (img && typeof img.src === 'string') add(img.src, `${t}-gallery-${i}`);
        });
      }

      // Team member avatars: members[].avatar
      if (Array.isArray(d.members)) {
        (d.members as any[]).forEach((m: any, i: number) => {
          if (m && typeof m.avatar === 'string') add(m.avatar, `${t}-avatar-${i}`);
        });
      }

      // Catch-all: scan remaining keys for any data:image URLs
      const skipKeys = new Set(['backgroundImage', 'image', 'images', 'members']);
      for (const [key, val] of Object.entries(d)) {
        if (skipKeys.has(key)) continue;
        if (typeof val === 'string') {
          add(val, `${t}-${key}`);
        } else if (Array.isArray(val)) {
          (val as any[]).forEach((item: any, i: number) => {
            if (typeof item?.src === 'string') add(item.src, `${t}-${key}-${i}`);
            else if (typeof item?.avatar === 'string') add(item.avatar, `${t}-${key}-${i}`);
            else if (typeof item?.image === 'string') add(item.image, `${t}-${key}-${i}`);
            else if (typeof item?.url === 'string') add(item.url, `${t}-${key}-${i}`);
          });
        }
      }
    });
  }

  return images;
}

/**
 * Replace all data:image URLs in generated file content with
 * WordPress-correct paths.
 *
 * - PHP files: 'data:image/...;base64,...' → get_template_directory_uri() . '/assets/img/file.ext'
 * - CSS files: data:image/...;base64,... → ../img/file.ext
 */
export function processImagesInContent(
  content: string,
  images: Map<string, ImageDataUrl>,
  fileType: 'php' | 'css' | 'js'
): string {
  if (images.size === 0) return content;

  for (const [dataUrl, entry] of images) {
    // Escape all regex-special characters in the data URL
    const escaped = dataUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    if (fileType === 'php') {
      // In PHP, data URLs appear inside single-quoted string literals: 'data:image/...'
      // or double-quoted: "data:image/..."
      // Replace the entire quoted value with a WordPress PHP expression (no surrounding quotes).
      content = content.replace(
        new RegExp(`'${escaped}'|"${escaped}"`, 'g'),
        `get_template_directory_uri() . '/assets/img/${entry.filename}'`
      );
    } else if (fileType === 'css') {
      // In CSS, replace bare data URLs with relative path from css/ to ../img/
      content = content.replace(
        new RegExp(escaped, 'g'),
        `../img/${entry.filename}`
      );
    }
    // For JS files, no replacement needed (images referenced via PHP in WordPress)
  }

  return content;
}

// ═══════════════════════════════════════════════════════════════
// N+1. Custom Page Template Generator
// ═══════════════════════════════════════════════════════════════

function generateCustomTemplatePHP(config: ThemeConfig, tpl: PageTemplateConfig): string {
  const td = config.textDomain;
  const slug = config.slug;
  const hasSidebar = tpl.layout === 'with-sidebar-left' || tpl.layout === 'with-sidebar-right';
  const sidebarLeft = tpl.layout === 'with-sidebar-left';
  const safeName = tpl.name.replace(/'/g, "\\'");

  // Generate sections HTML using the same section generators as front-page.php
  const sectionGenerators: Record<string, (section: ThemeSection) => string> = {
    hero: generateSectionHero,
    about: generateSectionAbout,
    services: generateSectionServices,
    features: generateSectionFeatures,
    testimonials: generateSectionTestimonials,
    pricing: generateSectionPricing,
    cta: generateSectionCTA,
    contact: generateSectionContact,
    gallery: generateSectionGallery,
    faq: generateSectionFAQ,
    stats: generateSectionStats,
    team: generateSectionTeam,
    blog_posts: generateSectionBlogPosts,
  };

  const enabledSections = (tpl.sections || []).filter(s => s.enabled);
  const sectionsHTML = enabledSections.map(s => {
    if (!s.data._td) s.data._td = config.textDomain;
    const gen = sectionGenerators[s.type];
    if (gen) return gen(s);
    return '';
  }).join('\n\n');

  return `<?php
/**
 * Template Name: ${safeName}
 *
 * ${tpl.description || 'Custom page template generated by PageForge'}
 *
 * @package ${slug}
 */
get_header();
?>

<main class="site-main">
${sectionsHTML}
    <div class="container">
        <div class="page-content${hasSidebar ? ' page-with-sidebar' : ''}">
            ${hasSidebar && sidebarLeft ? '<?php get_sidebar(); ?>' : ''}
            <div class="${hasSidebar ? 'page-main-content' : ''}">
                <?php while ( have_posts() ) : the_post(); ?>
                    <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
                        <div class="entry-content">
                            <?php the_content(); ?>
                        </div>
                    </article>
                <?php endwhile; ?>
            </div>
            ${hasSidebar && !sidebarLeft ? '<?php get_sidebar(); ?>' : ''}
        </div>
    </div>
</main>

<?php get_footer(); ?>
`;
}

// ═══════════════════════════════════════════════════════════════
// readme.txt Generator
// ═══════════════════════════════════════════════════════════════

function generateReadmeTxt(config: ThemeConfig): string {
  const name = config.name || 'My Theme';
  const slug = config.slug || 'my-theme';
  const desc = config.description || 'A custom WordPress theme generated by PageForge.';
  const author = config.author || 'PageForge User';
  const version = config.version || '1.0.0';
  const sections = config.sections || [];

  // Count section types
  const sectionList = sections.filter(s => s.enabled).map(s => s.title || s.type).join(', ');

  return `=== ${name} ===
Contributors: ${author}
Requires at least: 5.0
Tested up to: 6.7
Requires PHP: 7.4
Stable tag: ${version}
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

${desc}

== Description ==

${name} is a custom WordPress theme built with PageForge — the visual WordPress theme builder.

Theme features:
- Responsive design (mobile-first)
- Custom navigation menu
- Customizable footer with social links
- SEO-optimized markup
- Accessible (WCAG 2.1 AA)
${sectionList ? `- Sections: ${sectionList}` : ''}

== Installation ==

1. Upload the theme folder \`${slug}\` to the \`/wp-content/themes/\` directory.
2. Activate the theme through the "Themes" menu in WordPress.
3. Go to Appearance > Customize to adjust settings.

== Changelog ==

= ${version} =
* Initial release — generated by PageForge.
`;
}

// ═══════════════════════════════════════════════════════════════
// Main Orchestrator: generateThemeFiles()
// ═══════════════════════════════════════════════════════════════

export function generateThemeFiles(config: ThemeConfig): Map<string, string> {
  const files = new Map<string, string>();

  // Helper to find a template config by slug
  const findTemplate = (slug: string): PageTemplateConfig | undefined => {
    return (config.pageTemplates || []).find(t => t.slug === slug && t.enabled);
  };

  // ─── Standard Theme Files ──────────────────────────────────
  files.set('style.css', generateStyleCSS(config));
  files.set('functions.php', generateFunctionsPHP(config));
  files.set('header.php', generateHeaderPHP(config));
  files.set('footer.php', generateFooterPHP(config));
  files.set('index.php', generateIndexPHP(config));
  files.set('front-page.php', generateFrontPagePHP(config));

  // ─── Auxiliary Templates (controlled by pageTemplates config) ─
  const singleTpl = findTemplate('single');
  if (singleTpl) {
    files.set('single.php', generateSinglePHP(config, singleTpl));
  }

  const archiveTpl = findTemplate('archive');
  if (archiveTpl) {
    files.set('archive.php', generateArchivePHP(config, archiveTpl));
  }

  const pageTpl = findTemplate('page');
  if (pageTpl) {
    files.set('page.php', generatePagePHP(config, pageTpl));
  }

  const searchTpl = findTemplate('search');
  if (searchTpl) {
    files.set('search.php', generateSearchPHP(config, searchTpl));
  }

  const notFoundTpl = findTemplate('404');
  if (notFoundTpl) {
    files.set('404.php', generate404PHP(config, notFoundTpl));
  }

  const sidebarTpl = findTemplate('sidebar');
  if (sidebarTpl) {
    files.set('sidebar.php', generateSidebarPHP(config, sidebarTpl));
  }

  // ─── Custom Page Templates ─────────────────────────────────
  const customTemplates = (config.pageTemplates || []).filter(t => t.type === 'custom' && t.enabled);
  for (const tpl of customTemplates) {
    const phpContent = generateCustomTemplatePHP(config, tpl);
    files.set(`template-${tpl.slug}.php`, phpContent);
  }

  // ─── Comments ──────────────────────────────────────────────
  files.set('comments.php', generateCommentsPHP(config.textDomain));

  // ─── Search Form ────────────────────────────────────────────
  files.set('searchform.php', generateSearchformPHP(config.textDomain));

  // ─── Template Parts ────────────────────────────────────────
  files.set('template-parts/content.php', generateContentPHP(config.textDomain));
  files.set('template-parts/content-none.php', generateContentNonePHP(config.textDomain));

  // ─── Assets ─────────────────────────────────────────────────
  files.set('assets/css/styles.css', generateThemeCSS(config));
  files.set('assets/js/main.js', generateThemeJS());

  // ─── readme.txt ─────────────────────────────────────────────
  files.set('readme.txt', generateReadmeTxt(config));

  return files;
}

// ═══════════════════════════════════════════════════════════════
// Default Theme Config — Restaurant Theme
// ═══════════════════════════════════════════════════════════════

export const DEFAULT_THEME_CONFIG: ThemeConfig = {
  // Theme metadata
  name: 'Mi Restaurante',
  slug: 'mi-restaurante',
  description: 'A beautiful, modern restaurant theme generated by PageForge. Perfect for showcasing menus, making reservations, and sharing the dining experience.',
  version: '1.0.0',
  author: 'PageForge',
  authorUri: 'https://pageforge.com',
  textDomain: 'mi-restaurante',

  // Design settings
  primaryColor: '#1B5E20',
  secondaryColor: '#2E7D32',
  accentColor: '#FF6F00',
  backgroundColor: '#FFFFFF',
  textColor: '#1A1A2E',
  headingFont: 'Playfair Display',
  bodyFont: 'Lato',
  borderRadius: 8,

  // Content sections
  sections: [
    {
      type: 'hero',
      enabled: true,
      title: 'Bienvenidos',
      subtitle: 'Una experiencia culinaria inolvidable',
      data: {
        title: 'Sabores que Cuentan Historias',
        subtitle: 'Descubre la fusión perfecta de tradición y creatividad en cada plato. Una experiencia gastronómica que deleitará todos tus sentidos.',
        ctaText: 'Reservar Mesa',
        ctaLink: '#contact',
        secondaryCtaText: 'Ver Menú',
        secondaryCtaLink: '#features',
        backgroundImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80',
        overlayOpacity: 0.55,
      },
    },
    {
      type: 'features',
      enabled: true,
      title: 'Nuestra Especialidad',
      subtitle: 'Cada detalle importa en nuestra cocina',
      data: {
        title: 'Lo Que Nos Hace Únicos',
        subtitle: 'Nos dedicamos a ofrecer una experiencia gastronómica excepcional con los mejores ingredientes y técnicas culinarias.',
        columns: 3,
        items: [
          { icon: '🍽️', title: 'Entrantes Exquisitos', description: 'Selección de entrantes elaborados con ingredientes frescos de temporada y presentación artística.' },
          { icon: '🥩', title: 'Platos Principales', description: 'Cortes premium de carne, pescados del día y opciones vegetarianas preparadas al momento.' },
          { icon: '🍰', title: 'Postres Artesanales', description: 'Creaciones dulces elaboradas por nuestro pastry chef con recetas únicas.' },
          { icon: '🍷', title: 'Carta de Vinos', description: 'Más de 150 referencias de vinos nacionales e internacionales seleccionados por expertos.' },
          { icon: '☀️', title: 'Brunch Dominical', description: 'El mejor brunch de la ciudad cada domingo de 10:00 a 15:00 con música en vivo.' },
          { icon: '🎉', title: 'Eventos Privados', description: 'Salones privados para celebraciones corporativas y eventos especiales.' },
        ],
      },
    },
    {
      type: 'about',
      enabled: true,
      title: 'Sobre Nosotros',
      data: {
        title: 'Tradición y Pasión desde 2016',
        description: 'Fundado por el Chef Andrés Morales, nuestro restaurante nace de la pasión por la cocina mediterránea fusionada con sabores locales. Cada plato cuenta una historia, cada ingrediente tiene un propósito, y cada visita es una experiencia para recordar.',
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
        imagePosition: 'right',
        stats: [
          { value: '8+', label: 'Años de Experiencia' },
          { value: '15,000+', label: 'Clientes Felices' },
          { value: '3', label: 'Premios Gastronómicos' },
        ],
      },
    },
    {
      type: 'testimonials',
      enabled: true,
      title: 'Lo Que Dicen Nuestros Clientes',
      subtitle: 'Opiniones reales de comensales satisfechos',
      data: {
        testimonials: [
          { name: 'María García López', role: 'Crítica Gastronómica', quote: 'Una experiencia culinaria que supera cualquier expectativa. La atención al detalle en cada plato es digna de una estrella Michelin.', rating: 5 },
          { name: 'Carlos Rodríguez', role: 'Food Blogger', quote: 'El brunch dominical es simplemente espectacular. Los sabores, la presentación, el ambiente... todo conspira para una experiencia perfecta.', rating: 5 },
          { name: 'Ana Martínez', role: 'Cliente Frecuente', quote: 'Llevo 3 años siendo cliente habitual y cada visita me sorprende. Los postres artesanales son mi debilidad absoluta.', rating: 5 },
        ],
      },
    },
    {
      type: 'gallery',
      enabled: true,
      title: 'Nuestra Galería',
      subtitle: 'Momentos y sabores capturados',
      data: {
        columns: 3,
        images: [
          { src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80', alt: 'Plato gourmet', caption: 'Risotto de Hongos Silvestres' },
          { src: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80', alt: 'Interior restaurante', caption: 'Nuestro Espacio' },
          { src: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80', alt: 'Pizza artesanal', caption: 'Pizza al Horno de Leña' },
          { src: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&q=80', alt: 'Cóctel', caption: 'Coctelería Premium' },
          { src: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=600&q=80', alt: 'Ensalada fresca', caption: 'Ensalada Mediterránea' },
          { src: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80', alt: 'Postre', caption: 'Tiramisu Artesanal' },
        ],
      },
    },
    {
      type: 'contact',
      enabled: true,
      title: 'Contáctanos',
      subtitle: 'Estamos aquí para atenderte',
      data: {
        email: 'reservas@mirestaurante.com',
        phone: '+34 912 345 678',
        address: 'Calle Gran Vía 42, 28013 Madrid, España',
        showForm: false,
        _td: 'mi-restaurante',
      },
    },
  ],

  // Navigation
  navItems: [
    { label: 'Inicio', url: '#hero' },
    { label: 'Especialidades', url: '#features' },
    { label: 'Nosotros', url: '#about' },
    { label: 'Testimonios', url: '#testimonials' },
    { label: 'Galería', url: '#gallery' },
    { label: 'Contacto', url: '#contact' },
  ],

  // Footer
  footerColumns: [
    {
      title: 'Menú',
      links: [
        { label: 'Entrantes', url: '#' },
        { label: 'Platos Principales', url: '#' },
        { label: 'Postres', url: '#' },
        { label: 'Carta de Vinos', url: '#' },
      ],
    },
    {
      title: 'Reservas',
      links: [
        { label: 'Reservar Mesa', url: '#contact' },
        { label: 'Eventos', url: '#' },
        { label: 'Catering', url: '#' },
        { label: 'Gift Cards', url: '#' },
      ],
    },
    {
      title: 'Empresa',
      links: [
        { label: 'Sobre Nosotros', url: '#about' },
        { label: 'Nuestro Equipo', url: '#' },
        { label: 'Blog', url: '#' },
        { label: 'Trabaja con Nosotros', url: '#' },
      ],
    },
  ],
  copyrightText: 'Todos los derechos reservados',
  socialLinks: [
    { platform: 'instagram', url: 'https://instagram.com/mirestaurante' },
    { platform: 'facebook', url: 'https://facebook.com/mirestaurante' },
    { platform: 'twitter', url: 'https://twitter.com/mirestaurante' },
    { platform: 'youtube', url: 'https://youtube.com/@mirestaurante' },
  ],
};
