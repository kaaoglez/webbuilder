// ═══════════════════════════════════════════════════════════════
// PAGEFORGE v2 — WordPress Plugin Generator Engine
// Generates valid, installable WordPress plugin files from a
// TypeScript configuration object. Server-side code only.
// ═══════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────
// Types & Interfaces
// ─────────────────────────────────────────────────────────────

export type PluginType =
  | 'contact-form'
  | 'slider'
  | 'custom-post-type'
  | 'shortcodes'
  | 'widget'
  | 'social-share'
  | 'seo'
  | 'google-maps'
  | 'countdown'
  | 'pricing-table'
  | 'testimonials'
  | 'maintenance-mode'
  | 'custom-login'
  | 'breadcrumbs'
  | 'related-posts';

export interface PluginConfig {
  name: string;
  slug: string;
  description: string;
  version: string;
  author: string;
  authorUri: string;
  textDomain: string;
  pluginType: PluginType;
  options: Record<string, unknown>;
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function e(str: string): string {
  if (!str) return '';
  return str
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '');
}

function fn(slug: string, suffix: string): string {
  return `${slug.replace(/-/g, '_')}_${suffix}`;
}

// ─────────────────────────────────────────────────────────────
// Config Normalizer
// ─────────────────────────────────────────────────────────────

const PLUGIN_TYPES: PluginType[] = [
  'contact-form', 'slider', 'custom-post-type', 'shortcodes', 'widget',
  'social-share', 'seo', 'google-maps', 'countdown', 'pricing-table',
  'testimonials', 'maintenance-mode', 'custom-login', 'breadcrumbs', 'related-posts',
];

export function normalizePluginConfig(partial: Partial<PluginConfig> & Record<string, any>): PluginConfig {
  const slug = partial.slug || partial.textDomain || 'my-plugin';
  return {
    name: partial.name || 'Mi Plugin WordPress',
    slug,
    description: partial.description || 'Un plugin de WordPress generado con PageForge',
    version: partial.version || '1.0.0',
    author: partial.author || 'PageForge',
    authorUri: partial.authorUri || 'https://pageforge.dev',
    textDomain: partial.textDomain || slug,
    pluginType: partial.pluginType || 'contact-form',
    options: partial.options || {},
  };
}

export { PLUGIN_TYPES };

// ═══════════════════════════════════════════════════════════════
// 1. CONTACT FORM PLUGIN
// Shortcode: [pageforge_contact]
// ═══════════════════════════════════════════════════════════════

function generateContactForm(config: PluginConfig): Map<string, string> {
  const s = config.slug;
  const f = fn(s, '');
  const td = config.textDomain;
  const files = new Map<string, string>();

  const mainPHP = `<?php
/**
 * Plugin Name: ${config.name}
 * Plugin URI: https://pageforge.dev
 * Description: ${config.description}
 * Version: ${config.version}
 * Author: ${config.author}
 * Author URI: ${config.authorUri}
 * License: GPL-2.0+
 * Text Domain: ${td}
 * Domain Path: /languages
 *
 * @package ${s}
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

function ${f}_enqueue_assets() {
    wp_enqueue_style( '${s}-contact', plugin_dir_url( __FILE__ ) . 'assets/css/style.css', array(), '${config.version}' );
    wp_enqueue_script( '${s}-contact-js', plugin_dir_url( __FILE__ ) . 'assets/js/script.js', array(), '${config.version}', true );
    wp_localize_script( '${s}-contact-js', '${f}_ajax', array(
        'ajax_url' => admin_url( 'admin-ajax.php' ),
        'nonce'    => wp_create_nonce( '${f}_nonce' ),
    ) );
}
add_action( 'wp_enqueue_scripts', '${f}_enqueue_assets' );

function ${f}_shortcode() {
    ob_start();
    ?>
    <div class="pf-contact-form-wrap">
        <form id="pf-contact-form" class="pf-contact-form" method="post">
            <?php wp_nonce_field( '${f}_nonce_action', '${f}_nonce_field' ); ?>
            <input type="hidden" name="action" value="${f}_submit">
            <div class="pf-form-group">
                <label for="pf-name"><?php esc_html_e( 'Nombre', '${td}' ); ?> <span class="required">*</span></label>
                <input type="text" id="pf-name" name="pf_name" required placeholder="<?php esc_attr_e( 'Tu nombre', '${td}' ); ?>">
            </div>
            <div class="pf-form-group">
                <label for="pf-email"><?php esc_html_e( 'Correo electrónico', '${td}' ); ?> <span class="required">*</span></label>
                <input type="email" id="pf-email" name="pf_email" required placeholder="<?php esc_attr_e( 'tu@correo.com', '${td}' ); ?>">
            </div>
            <div class="pf-form-group">
                <label for="pf-subject"><?php esc_html_e( 'Asunto', '${td}' ); ?></label>
                <input type="text" id="pf-subject" name="pf_subject" placeholder="<?php esc_attr_e( 'Asunto del mensaje', '${td}' ); ?>">
            </div>
            <div class="pf-form-group">
                <label for="pf-message"><?php esc_html_e( 'Mensaje', '${td}' ); ?> <span class="required">*</span></label>
                <textarea id="pf-message" name="pf_message" rows="5" required placeholder="<?php esc_attr_e( 'Escribe tu mensaje aquí...', '${td}' ); ?>"></textarea>
            </div>
            <div class="pf-form-submit">
                <button type="submit" class="pf-btn pf-btn-primary"><?php esc_html_e( 'Enviar mensaje', '${td}' ); ?></button>
            </div>
            <div id="pf-form-response" class="pf-form-response"></div>
        </form>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode( 'pageforge_contact', '${f}_shortcode' );

function ${f}_handle_submit() {
    check_ajax_referer( '${f}_nonce', 'nonce' );

    $name    = sanitize_text_field( wp_unslash( $_POST['pf_name'] ?? '' ) );
    $email   = sanitize_email( wp_unslash( $_POST['pf_email'] ?? '' ) );
    $subject = sanitize_text_field( wp_unslash( $_POST['pf_subject'] ?? __( 'Formulario de contacto', '${td}' ) ) );
    $message = sanitize_textarea_field( wp_unslash( $_POST['pf_message'] ?? '' ) );

    if ( empty( $name ) || empty( $email ) || empty( $message ) ) {
        wp_send_json_error( array( 'message' => __( 'Por favor, completa todos los campos obligatorios.', '${td}' ) ) );
    }

    $to      = get_option( 'admin_email' );
    $headers = array(
        'Content-Type: text/html; charset=UTF-8',
        'From: ' . $name . ' <' . $email . '>',
        'Reply-To: ' . $email,
    );
    $body    = '<h2>' . esc_html( $subject ) . '</h2>';
    $body   .= '<p><strong>' . __( 'Nombre:', '${td}' ) . '</strong> ' . esc_html( $name ) . '</p>';
    $body   .= '<p><strong>' . __( 'Email:', '${td}' ) . '</strong> ' . esc_html( $email ) . '</p>';
    $body   .= '<p><strong>' . __( 'Mensaje:', '${td}' ) . '</strong></p><p>' . nl2br( esc_html( $message ) ) . '</p>';

    $sent = wp_mail( $to, $subject, $body, $headers );

    if ( $sent ) {
        wp_send_json_success( array( 'message' => __( '¡Mensaje enviado con éxito!', '${td}' ) ) );
    } else {
        wp_send_json_error( array( 'message' => __( 'Error al enviar el mensaje. Inténtalo de nuevo.', '${td}' ) ) );
    }
}
add_action( 'wp_ajax_${f}_submit', '${f}_handle_submit' );
add_action( 'wp_ajax_nopriv_${f}_submit', '${f}_handle_submit' );

register_activation_hook( __FILE__, function() {
    // La activación no requiere acciones adicionales
});
register_deactivation_hook( __FILE__, function() {
    // La desactivación no requiere acciones adicionales
});
`;

  const readme = generateReadme(config, 'Formulario de Contacto', 'Un formulario de contacto profesional con validación AJAX, envío por email y diseño responsive. Incluye campos de nombre, email, asunto y mensaje.');
  const css = `.pf-contact-form-wrap { max-width: 600px; margin: 2em auto; padding: 2em; background: #fff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
.pf-form-group { margin-bottom: 1.25em; }
.pf-form-group label { display: block; font-weight: 600; margin-bottom: 0.4em; color: #1f2937; font-size: 0.95rem; }
.pf-form-group label .required { color: #ef4444; }
.pf-form-group input, .pf-form-group textarea { width: 100%; padding: 0.75em 1em; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 1rem; transition: border-color 0.2s; box-sizing: border-box; }
.pf-form-group input:focus, .pf-form-group textarea:focus { outline: none; border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
.pf-form-group textarea { resize: vertical; min-height: 120px; }
.pf-btn-primary { display: inline-block; padding: 0.75em 2em; background: #2563eb; color: #fff; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: background 0.2s; }
.pf-btn-primary:hover { background: #1d4ed8; }
.pf-form-response { margin-top: 1em; padding: 0.75em 1em; border-radius: 8px; font-size: 0.95rem; }
.pf-form-response.success { background: #d1fae5; color: #065f46; }
.pf-form-response.error { background: #fee2e2; color: #991b1b; }
@media (max-width: 480px) { .pf-contact-form-wrap { padding: 1.25em; margin: 1em; } }`;

  const js = `(function($) {
    'use strict';
    $(document).on('submit', '#pf-contact-form', function(e) {
        e.preventDefault();
        var $form = $(this);
        var $btn = $form.find('.pf-btn-primary');
        var $response = $('#pf-form-response');
        $btn.prop('disabled', true).text('Enviando...');
        $.post(${f}_ajax.ajax_url, {
            action: '${f}_submit',
            nonce: ${f}_ajax.nonce,
            pf_name: $form.find('#pf-name').val(),
            pf_email: $form.find('#pf-email').val(),
            pf_subject: $form.find('#pf-subject').val(),
            pf_message: $form.find('#pf-message').val(),
        }, function(res) {
            $response.removeClass('success error').addClass(res.success ? 'success' : 'error').text(res.data.message);
            if (res.success) $form[0].reset();
        }).fail(function() {
            $response.removeClass('success').addClass('error').text('Error de conexión.');
        }).always(function() {
            $btn.prop('disabled', false).text('Enviar mensaje');
        });
    });
})(jQuery);`;

  files.set(`${s}.php`, mainPHP);
  files.set('readme.txt', readme);
  files.set('assets/css/style.css', css);
  files.set('assets/js/script.js', js);
  return files;
}

// ═══════════════════════════════════════════════════════════════
// 2. SLIDER PLUGIN
// Shortcode: [pageforge_slider]
// ═══════════════════════════════════════════════════════════════

function generateSlider(config: PluginConfig): Map<string, string> {
  const s = config.slug;
  const f = fn(s, '');
  const td = config.textDomain;
  const files = new Map<string, string>();

  const mainPHP = `<?php
/**
 * Plugin Name: ${config.name}
 * Plugin URI: https://pageforge.dev
 * Description: ${config.description}
 * Version: ${config.version}
 * Author: ${config.author}
 * Author URI: ${config.authorUri}
 * License: GPL-2.0+
 * Text Domain: ${td}
 *
 * @package ${s}
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

function ${f}_register_cpt() {
    register_post_type( 'pf_slider', array(
        'labels' => array(
            'name'               => __( 'Sliders', '${td}' ),
            'singular_name'      => __( 'Slider', '${td}' ),
            'add_new'            => __( 'Añadir diapositiva', '${td}' ),
            'add_new_item'       => __( 'Añadir nueva diapositiva', '${td}' ),
            'edit_item'          => __( 'Editar diapositiva', '${td}' ),
            'view_item'          => __( 'Ver diapositiva', '${td}' ),
            'all_items'          => __( 'Todas las diapositivas', '${td}' ),
            'search_items'       => __( 'Buscar diapositivas', '${td}' ),
            'not_found'          => __( 'No se encontraron diapositivas.', '${td}' ),
        ),
        'public'       => true,
        'has_archive'  => false,
        'menu_icon'    => 'dashicons-format-gallery',
        'supports'     => array( 'title', 'thumbnail', 'page-attributes', 'editor' ),
        'show_in_rest' => true,
    ) );
}
add_action( 'init', '${f}_register_cpt' );

function ${f}_enqueue() {
    wp_enqueue_style( '${s}-slider', plugin_dir_url( __FILE__ ) . 'assets/css/style.css', array(), '${config.version}' );
    wp_enqueue_script( '${s}-slider-js', plugin_dir_url( __FILE__ ) . 'assets/js/script.js', array(), '${config.version}', true );
}
add_action( 'wp_enqueue_scripts', '${f}_enqueue' );

function ${f}_shortcode( $atts ) {
    $atts = shortcode_atts( array( 'id' => '' ), $atts, 'pageforge_slider' );

    $args = array(
        'post_type'      => 'pf_slider',
        'posts_per_page' => -1,
        'orderby'        => 'menu_order',
        'order'          => 'ASC',
    );

    $slides = get_posts( $args );
    if ( empty( $slides ) ) return '';

    ob_start();
    ?>
    <div class="pf-slider" id="pf-slider-<?php echo esc_attr( $atts['id'] ? $atts['id'] : uniqid() ); ?>">
        <div class="pf-slider-track">
            <?php foreach ( $slides as $slide ) : ?>
                <div class="pf-slide">
                    <?php if ( has_post_thumbnail( $slide->ID ) ) : ?>
                        <div class="pf-slide-bg" style="background-image:url('<?php echo esc_url( get_the_post_thumbnail_url( $slide->ID, 'full' ) ); ?>');">
                            <div class="pf-slide-overlay"></div>
                        </div>
                    <?php endif; ?>
                    <div class="pf-slide-content">
                        <h2 class="pf-slide-title"><?php echo esc_html( get_the_title( $slide->ID ) ); ?></h2>
                        <?php $subtitle = get_post_meta( $slide->ID, '_pf_slide_subtitle', true ); ?>
                        <?php if ( $subtitle ) : ?>
                            <p class="pf-slide-subtitle"><?php echo esc_html( $subtitle ); ?></p>
                        <?php endif; ?>
                        <?php $link = get_post_meta( $slide->ID, '_pf_slide_link', true ); ?>
                        <?php if ( $link ) : ?>
                            <a href="<?php echo esc_url( $link ); ?>" class="pf-slide-btn"><?php esc_html_e( 'Más información', '${td}' ); ?></a>
                        <?php endif; ?>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
        <button class="pf-slider-prev" aria-label="<?php esc_attr_e( 'Anterior', '${td}' ); ?>">&#10094;</button>
        <button class="pf-slider-next" aria-label="<?php esc_attr_e( 'Siguiente', '${td}' ); ?>">&#10095;</button>
        <div class="pf-slider-dots"></div>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode( 'pageforge_slider', '${f}_shortcode' );

function ${f}_meta_boxes() {
    add_meta_box( 'pf_slide_details', __( 'Detalles de diapositiva', '${td}' ), function( $post ) {
        wp_nonce_field( '${f}_save_meta', '${f}_meta_nonce' );
        $subtitle = get_post_meta( $post->ID, '_pf_slide_subtitle', true );
        $link = get_post_meta( $post->ID, '_pf_slide_link', true );
        echo '<p><label>' . esc_html__( 'Subtítulo:', '${td}' ) . '</label><br>';
        echo '<input type="text" name="pf_slide_subtitle" value="' . esc_attr( $subtitle ) . '" style="width:100%;"></p>';
        echo '<p><label>' . esc_html__( 'Enlace (opcional):', '${td}' ) . '</label><br>';
        echo '<input type="url" name="pf_slide_link" value="' . esc_attr( $link ) . '" style="width:100%;"></p>';
    }, 'pf_slider', 'normal', 'high' );
}
add_action( 'add_meta_boxes', '${f}_meta_boxes' );

function ${f}_save_meta( $post_id ) {
    if ( ! isset( $_POST['${f}_meta_nonce'] ) || ! wp_verify_nonce( $_POST['${f}_meta_nonce'], '${f}_save_meta' ) ) return;
    if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) return;
    if ( isset( $_POST['pf_slide_subtitle'] ) ) update_post_meta( $post_id, '_pf_slide_subtitle', sanitize_text_field( wp_unslash( $_POST['pf_slide_subtitle'] ) ) );
    if ( isset( $_POST['pf_slide_link'] ) ) update_post_meta( $post_id, '_pf_slide_link', esc_url_raw( wp_unslash( $_POST['pf_slide_link'] ) ) );
}
add_action( 'save_post_pf_slider', '${f}_save_meta' );

register_activation_hook( __FILE__, function() { flush_rewrite_rules(); });
register_deactivation_hook( __FILE__, function() { flush_rewrite_rules(); });
`;

  const readme = generateReadme(config, 'Slider de Imágenes', 'Crea sliders de imágenes profesionales con transiciones suaves. Usa un custom post type para gestionar diapositivas desde el panel de administración.');
  const css = `.pf-slider { position: relative; width: 100%; overflow: hidden; border-radius: 12px; background: #111; }
.pf-slider-track { display: flex; transition: transform 0.5s ease; }
.pf-slide { min-width: 100%; position: relative; height: 500px; }
.pf-slide-bg { width: 100%; height: 100%; background-size: cover; background-position: center; position: absolute; top: 0; left: 0; }
.pf-slide-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.35); }
.pf-slide-content { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; text-align: center; color: #fff; padding: 2rem; }
.pf-slide-title { font-size: 2.5rem; font-weight: 800; text-shadow: 0 2px 8px rgba(0,0,0,0.3); margin: 0 0 0.5rem; }
.pf-slide-subtitle { font-size: 1.2rem; max-width: 600px; opacity: 0.9; margin: 0 0 1.5rem; }
.pf-slide-btn { display: inline-block; padding: 0.75em 2em; background: #2563eb; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600; transition: background 0.2s; }
.pf-slide-btn:hover { background: #1d4ed8; }
.pf-slider-prev, .pf-slider-next { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,0.85); border: none; width: 48px; height: 48px; border-radius: 50%; font-size: 1.2rem; cursor: pointer; z-index: 5; transition: background 0.2s; }
.pf-slider-prev { left: 16px; }
.pf-slider-next { right: 16px; }
.pf-slider-prev:hover, .pf-slider-next:hover { background: #fff; }
.pf-slider-dots { position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); display: flex; gap: 8px; z-index: 5; }
.pf-slider-dots .dot { width: 12px; height: 12px; border-radius: 50%; background: rgba(255,255,255,0.5); cursor: pointer; transition: background 0.2s; border: none; }
.pf-slider-dots .dot.active { background: #fff; }
@media (max-width: 768px) { .pf-slide { height: 350px; } .pf-slide-title { font-size: 1.5rem; } }`;

  const js = `(function(){
    document.querySelectorAll('.pf-slider').forEach(function(slider){
        var track = slider.querySelector('.pf-slider-track');
        var slides = slider.querySelectorAll('.pf-slide');
        var prevBtn = slider.querySelector('.pf-slider-prev');
        var nextBtn = slider.querySelector('.pf-slider-next');
        var dotsWrap = slider.querySelector('.pf-slider-dots');
        var current = 0;
        var total = slides.length;
        if (!total) return;
        for (var i = 0; i < total; i++) {
            var dot = document.createElement('button');
            dot.className = 'dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', 'Diapositiva ' + (i+1));
            dot.dataset.index = i;
            dot.addEventListener('click', function(){ goTo(parseInt(this.dataset.index)); });
            dotsWrap.appendChild(dot);
        }
        function goTo(n) {
            current = ((n % total) + total) % total;
            track.style.transform = 'translateX(-' + (current * 100) + '%)';
            dotsWrap.querySelectorAll('.dot').forEach(function(d, i){
                d.classList.toggle('active', i === current);
            });
        }
        prevBtn.addEventListener('click', function(){ goTo(current - 1); });
        nextBtn.addEventListener('click', function(){ goTo(current + 1); });
        setInterval(function(){ goTo(current + 1); }, 5000);
    });
})();`;

  files.set(`${s}.php`, mainPHP);
  files.set('readme.txt', readme);
  files.set('assets/css/style.css', css);
  files.set('assets/js/script.js', js);
  return files;
}

// ═══════════════════════════════════════════════════════════════
// 3. CUSTOM POST TYPES PLUGIN
// ═══════════════════════════════════════════════════════════════

function generateCustomPostType(config: PluginConfig): Map<string, string> {
  const s = config.slug;
  const f = fn(s, '');
  const td = config.textDomain;
  const opts = config.options;
  const labels = (opts.labels as { singular?: string; plural?: string }) || {};
  const cptName = (opts.postTypeName as string) || (opts.cptName as string) || 'Producto';
  const cptSlug = (opts.postTypeSlug as string) || (opts.cptSlug as string) || 'producto';
  const cptSingular = labels.singular || (opts.cptSingular as string) || cptName;
  const cptPlural = labels.plural || (opts.cptPlural as string) || cptName + 's';
  const supports = (opts.supports as string[]) || ['title', 'editor', 'thumbnail', 'excerpt'];
  const publicOpt = (opts.public as boolean) !== false;
  const hasArchive = (opts.hasArchive as boolean) !== false;
  const showInRest = (opts.showInRest as boolean) !== false;
  const menuIcon = (opts.menuIcon as string) || 'dashicons-admin-page';
  const taxonomies = (opts.taxonomies as Array<{ name: string; slug: string }>) || [];
  const files = new Map<string, string>();

  const cptFn = cptSlug.replace(/-/g, '_');
  const supportsStr = supports.map(sup => `'${sup}'`).join(', ');

  const taxPHP = taxonomies.map(tax => {
    const taxFn = `${cptFn}_${tax.slug.replace(/-/g, '_')}`;
    return `
function ${taxFn}_register() {
    register_taxonomy( '${tax.slug}', '${cptSlug}', array(
        'labels' => array(
            'name'          => __( '${tax.name}', '${td}' ),
            'singular_name' => __( '${tax.name}', '${td}' ),
            'search_items'  => __( 'Buscar ${tax.name}', '${td}' ),
            'all_items'     => __( 'Todas las ${tax.name}', '${td}' ),
            'edit_item'     => __( 'Editar ${tax.name}', '${td}' ),
            'add_new_item'  => __( 'Añadir nueva ${tax.name}', '${td}' ),
        ),
        'hierarchical'      => true,
        'public'            => ${publicOpt},
        'show_ui'           => true,
        'show_admin_column' => true,
        'rewrite'           => array( 'slug' => '${tax.slug}' ),
        'show_in_rest'      => true,
    ) );
}
add_action( 'init', '${taxFn}_register' );`;
  }).join('\n');

  const mainPHP = `<?php
/**
 * Plugin Name: ${config.name}
 * Plugin URI: https://pageforge.dev
 * Description: ${config.description}
 * Version: ${config.version}
 * Author: ${config.author}
 * Author URI: ${config.authorUri}
 * License: GPL-2.0+
 * Text Domain: ${td}
 *
 * @package ${s}
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

function ${f}_register_cpt() {
    register_post_type( '${cptSlug}', array(
        'labels' => array(
            'name'               => __( '${cptPlural}', '${td}' ),
            'singular_name'      => __( '${cptSingular}', '${td}' ),
            'add_new'            => __( 'Añadir ${cptSingular}', '${td}' ),
            'add_new_item'       => __( 'Añadir nuevo ${cptSingular}', '${td}' ),
            'edit_item'          => __( 'Editar ${cptSingular}', '${td}' ),
            'new_item'           => __( 'Nuevo ${cptSingular}', '${td}' ),
            'view_item'          => __( 'Ver ${cptSingular}', '${td}' ),
            'view_items'         => __( 'Ver ${cptPlural}', '${td}' ),
            'search_items'       => __( 'Buscar ${cptPlural}', '${td}' ),
            'not_found'          => __( 'No se encontraron ${cptPlural}.', '${td}' ),
            'not_found_in_trash' => __( 'No hay ${cptPlural} en la papelera.', '${td}' ),
            'menu_name'          => __( '${cptPlural}', '${td}' ),
        ),
        'public'       => ${publicOpt},
        'has_archive'  => ${hasArchive},
        'menu_icon'    => '${menuIcon}',
        'supports'     => array( ${supportsStr} ),
        'rewrite'      => array( 'slug' => '${cptSlug}' ),
        'show_in_rest' => ${showInRest},
    ) );
}
add_action( 'init', '${f}_register_cpt' );
${taxPHP}

register_activation_hook( __FILE__, function() { flush_rewrite_rules(); });
register_deactivation_hook( __FILE__, function() { flush_rewrite_rules(); });
`;

  const readme = generateReadme(config, 'Custom Post Type', `Registra el tipo de contenido personalizado "${cptPlural}" en WordPress. ${taxonomies.length > 0 ? 'Incluye taxonomías personalizadas: ' + taxonomies.map(t => t.name).join(', ') + '.' : ''}`);
  files.set(`${s}.php`, mainPHP);
  files.set('readme.txt', readme);
  return files;
}

// ═══════════════════════════════════════════════════════════════
// 4. SHORTCODES PLUGIN
// Shortcodes: [pf_button], [pf_box], [pf_alert], [pf_divider], [pf_countdown]
// ═══════════════════════════════════════════════════════════════

function generateShortcodes(config: PluginConfig): Map<string, string> {
  const s = config.slug;
  const f = fn(s, '');
  const td = config.textDomain;
  const files = new Map<string, string>();

  const mainPHP = `<?php
/**
 * Plugin Name: ${config.name}
 * Plugin URI: https://pageforge.dev
 * Description: ${config.description}
 * Version: ${config.version}
 * Author: ${config.author}
 * Author URI: ${config.authorUri}
 * License: GPL-2.0+
 * Text Domain: ${td}
 *
 * @package ${s}
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

function ${f}_enqueue() {
    wp_enqueue_style( '${s}-shortcodes', plugin_dir_url( __FILE__ ) . 'assets/css/style.css', array(), '${config.version}' );
    wp_enqueue_script( '${s}-shortcodes-js', plugin_dir_url( __FILE__ ) . 'assets/js/script.js', array(), '${config.version}', true );
}
add_action( 'wp_enqueue_scripts', '${f}_enqueue' );

// ─── [pf_button] ────────────────────────────────────────
function ${f}_sc_button( $atts, $content = null ) {
    $atts = shortcode_atts( array(
        'url'    => '#',
        'color'  => '#2563eb',
        'target' => '_self',
        'size'   => 'medium',
        'style'  => 'filled',
    ), $atts, 'pf_button' );
    $color = esc_attr( $atts['color'] );
    $bg = $atts['style'] === 'filled' ? "background:{$color};color:#fff;border:2px solid {$color};" : "background:transparent;color:{$color};border:2px solid {$color};";
    return '<a href="' . esc_url( $atts['url'] ) . '" class="pf-sc-btn pf-sc-btn-' . esc_attr( $atts['size'] ) . ' pf-sc-btn-' . esc_attr( $atts['style'] ) . '" target="' . esc_attr( $atts['target'] ) . '" style="' . $bg . '">' . do_shortcode( $content ) . '</a>';
}
add_shortcode( 'pf_button', '${f}_sc_button' );

// ─── [pf_box] ───────────────────────────────────────────
function ${f}_sc_box( $atts, $content = null ) {
    $atts = shortcode_atts( array(
        'title' => '',
        'color' => '#2563eb',
        'bg'    => '#f0f9ff',
    ), $atts, 'pf_box' );
    $output = '<div class="pf-sc-box" style="border-left:4px solid ' . esc_attr( $atts['color'] ) . ';background:' . esc_attr( $atts['bg'] ) . ';">';
    if ( $atts['title'] ) $output .= '<div class="pf-sc-box-title">' . esc_html( $atts['title'] ) . '</div>';
    $output .= '<div class="pf-sc-box-body">' . do_shortcode( $content ) . '</div></div>';
    return $output;
}
add_shortcode( 'pf_box', '${f}_sc_box' );

// ─── [pf_alert] ─────────────────────────────────────────
function ${f}_sc_alert( $atts, $content = null ) {
    $atts = shortcode_atts( array(
        'type' => 'info',
    ), $atts, 'pf_alert' );
    $types = array( 'info' => '#2563eb', 'success' => '#16a34a', 'warning' => '#d97706', 'error' => '#dc2626' );
    $color = isset( $types[ $atts['type'] ] ) ? $types[ $atts['type'] ] : $types['info'];
    return '<div class="pf-sc-alert pf-sc-alert-' . esc_attr( $atts['type'] ) . '" style="border-left:4px solid ' . $color . ';background:rgba(' . hexToRgbStr( $color ) . ',0.08);"><div class="pf-sc-alert-content">' . do_shortcode( $content ) . '</div></div>';
}
add_shortcode( 'pf_alert', '${f}_sc_alert' );

// ─── [pf_divider] ───────────────────────────────────────
function ${f}_sc_divider( $atts ) {
    $atts = shortcode_atts( array( 'color' => '#e5e7eb', 'style' => 'solid', 'width' => '100%' ), $atts, 'pf_divider' );
    return '<hr class="pf-sc-divider" style="border:none;border-top:2px ' . esc_attr( $atts['style'] ) . ' ' . esc_attr( $atts['color'] ) . ';width:' . esc_attr( $atts['width'] ) . ';margin:2em auto;">';
}
add_shortcode( 'pf_divider', '${f}_sc_divider' );

// ─── [pf_countdown] ────────────────────────────────────
function ${f}_sc_countdown( $atts ) {
    $atts = shortcode_atts( array( 'date' => '2025-12-31 23:59:59' ), $atts, 'pf_countdown' );
    $id = 'pf-cd-' . uniqid();
    return '<div class="pf-sc-countdown" id="' . $id . '" data-date="' . esc_attr( $atts['date'] ) . '">
        <div class="pf-cd-item"><span class="pf-cd-num">00</span><span class="pf-cd-label">' . __( 'Días', '${td}' ) . '</span></div>
        <div class="pf-cd-sep">:</div>
        <div class="pf-cd-item"><span class="pf-cd-num">00</span><span class="pf-cd-label">' . __( 'Horas', '${td}' ) . '</span></div>
        <div class="pf-cd-sep">:</div>
        <div class="pf-cd-item"><span class="pf-cd-num">00</span><span class="pf-cd-label">' . __( 'Minutos', '${td}' ) . '</span></div>
        <div class="pf-cd-sep">:</div>
        <div class="pf-cd-item"><span class="pf-cd-num">00</span><span class="pf-cd-label">' . __( 'Segundos', '${td}' ) . '</span></div>
    </div>';
}
add_shortcode( 'pf_countdown', '${f}_sc_countdown' );

function hexToRgbStr( $hex ) {
    $hex = str_replace( '#', '', $hex );
    $r = hexdec( substr( $hex, 0, 2 ) );
    $g = hexdec( substr( $hex, 2, 2 ) );
    $b = hexdec( substr( $hex, 4, 2 ) );
    return "{$r},{$g},{$b}";
}
`;

  const readme = generateReadme(config, 'Shortcodes Múltiples', 'Colección de shortcodes útiles: [pf_button] (botones), [pf_box] (cajas), [pf_alert] (alertas), [pf_divider] (separadores), [pf_countdown] (cuenta regresiva). Todos personalizables con atributos.');
  const css = `.pf-sc-btn { display:inline-block; padding:0.65em 1.6em; border-radius:8px; font-weight:600; text-decoration:none; cursor:pointer; transition:all 0.2s; text-align:center; }
.pf-sc-btn:hover { filter:brightness(0.9); transform:translateY(-1px); }
.pf-sc-btn-small { font-size:0.85rem; padding:0.5em 1.2em; }
.pf-sc-btn-large { font-size:1.1rem; padding:0.8em 2em; }
.pf-sc-box { padding:1.25em 1.5em; border-radius:8px; margin:1em 0; }
.pf-sc-box-title { font-weight:700; font-size:1.1rem; margin-bottom:0.5em; }
.pf-sc-box-body { font-size:0.95rem; line-height:1.6; }
.pf-sc-alert { padding:1em 1.25em; border-radius:8px; margin:1em 0; }
.pf-sc-alert-content { font-size:0.95rem; line-height:1.6; }
.pf-sc-divider { margin:2em auto; }
.pf-sc-countdown { display:flex; justify-content:center; gap:0.5rem; flex-wrap:wrap; padding:1.5em; }
.pf-cd-item { text-align:center; min-width:70px; }
.pf-cd-num { display:block; font-size:2rem; font-weight:800; color:#1f2937; line-height:1.2; }
.pf-cd-label { font-size:0.75rem; text-transform:uppercase; color:#6b7280; font-weight:600; letter-spacing:0.05em; }
.pf-cd-sep { font-size:2rem; font-weight:700; color:#d1d5db; align-self:center; }`;

  const js = `(function(){
    function initCountdowns() {
        document.querySelectorAll('.pf-sc-countdown').forEach(function(el){
            var target = new Date(el.dataset.date).getTime();
            function tick() {
                var now = Date.now();
                var diff = target - now;
                if (diff <= 0) { diff = 0; }
                var d = Math.floor(diff / 86400000);
                var h = Math.floor((diff % 86400000) / 3600000);
                var m = Math.floor((diff % 3600000) / 60000);
                var s = Math.floor((diff % 60000) / 1000);
                var nums = el.querySelectorAll('.pf-cd-num');
                if (nums[0]) nums[0].textContent = String(d).padStart(2,'0');
                if (nums[1]) nums[1].textContent = String(h).padStart(2,'0');
                if (nums[2]) nums[2].textContent = String(m).padStart(2,'0');
                if (nums[3]) nums[3].textContent = String(s).padStart(2,'0');
                if (diff > 0) requestAnimationFrame(tick);
            }
            tick();
            setInterval(tick, 1000);
        });
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initCountdowns);
    else initCountdowns();
})();`;

  files.set(`${s}.php`, mainPHP);
  files.set('readme.txt', readme);
  files.set('assets/css/style.css', css);
  files.set('assets/js/script.js', js);
  return files;
}

// ═══════════════════════════════════════════════════════════════
// 5. WIDGET PLUGIN
// ═══════════════════════════════════════════════════════════════

function generateWidget(config: PluginConfig): Map<string, string> {
  const s = config.slug;
  const f = fn(s, '');
  const td = config.textDomain;
  const files = new Map<string, string>();

  const mainPHP = `<?php
/**
 * Plugin Name: ${config.name}
 * Plugin URI: https://pageforge.dev
 * Description: ${config.description}
 * Version: ${config.version}
 * Author: ${config.author}
 * Author URI: ${config.authorUri}
 * License: GPL-2.0+
 * Text Domain: ${td}
 *
 * @package ${s}
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

function ${f}_enqueue() {
    wp_enqueue_style( '${s}-widget', plugin_dir_url( __FILE__ ) . 'assets/css/style.css', array(), '${config.version}' );
}
add_action( 'wp_enqueue_scripts', '${f}_enqueue' );

class ${f.replace(/(^|_)(.)/g, (_, __, c) => c.toUpperCase())}_Recent_Posts_Widget extends WP_Widget {

    public function __construct() {
        parent::__construct(
            '${s}_recent_posts',
            __( 'Posts Recientes con Miniatura', '${td}' ),
            array( 'description' => __( 'Muestra los posts más recientes con imagen destacada.', '${td}' ) )
        );
    }

    public function widget( $args, $instance ) {
        echo $args['before_widget'];
        if ( ! empty( $instance['title'] ) ) {
            echo $args['before_title'] . esc_html( $instance['title'] ) . $args['after_title'];
        }
        $count = absint( $instance['count'] ?? 5 );
        $posts = get_posts( array(
            'post_type'      => 'post',
            'posts_per_page' => $count,
            'post_status'    => 'publish',
        ) );
        if ( ! empty( $posts ) ) :
            echo '<div class="pf-recent-posts">';
            foreach ( $posts as $post ) :
                echo '<div class="pf-recent-post">';
                if ( has_post_thumbnail( $post->ID ) ) {
                    echo '<a href="' . esc_url( get_permalink( $post->ID ) ) . '" class="pf-recent-thumb">';
                    echo get_the_post_thumbnail( $post->ID, 'thumbnail' );
                    echo '</a>';
                }
                echo '<div class="pf-recent-info">';
                echo '<a href="' . esc_url( get_permalink( $post->ID ) ) . '" class="pf-recent-title">' . esc_html( $post->post_title ) . '</a>';
                echo '<span class="pf-recent-date">' . esc_html( get_the_date( '', $post->ID ) ) . '</span>';
                echo '</div></div>';
            endforeach;
            echo '</div>';
        else :
            echo '<p>' . esc_html__( 'No hay posts disponibles.', '${td}' ) . '</p>';
        endif;
        echo $args['after_widget'];
    }

    public function form( $instance ) {
        $title = ! empty( $instance['title'] ) ? $instance['title'] : __( 'Posts Recientes', '${td}' );
        $count = ! empty( $instance['count'] ) ? absint( $instance['count'] ) : 5;
        ?>
        <p>
            <label for="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>"><?php esc_html_e( 'Título:', '${td}' ); ?></label>
            <input class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'title' ) ); ?>" type="text" value="<?php echo esc_attr( $title ); ?>">
        </p>
        <p>
            <label for="<?php echo esc_attr( $this->get_field_id( 'count' ) ); ?>"><?php esc_html_e( 'Número de posts:', '${td}' ); ?></label>
            <input class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'count' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'count' ) ); ?>" type="number" min="1" max="20" value="<?php echo esc_attr( $count ); ?>">
        </p>
        <?php
    }

    public function update( $new_instance, $old_instance ) {
        $instance = array();
        $instance['title'] = sanitize_text_field( $new_instance['title'] ?? '' );
        $instance['count'] = absint( $new_instance['count'] ?? 5 );
        return $instance;
    }
}

function ${f}_register_widget() {
    register_widget( '${f.replace(/(^|_)(.)/g, (_, __, c) => c.toUpperCase())}_Recent_Posts_Widget' );
}
add_action( 'widgets_init', '${f}_register_widget' );
`;

  const readme = generateReadme(config, 'Widget de Posts Recientes', 'Widget personalizado que muestra los posts más recientes con miniaturas. Configuración de título y número de posts desde el panel de widgets.');
  const css = `.pf-recent-posts { display: flex; flex-direction: column; gap: 1em; }
.pf-recent-post { display: flex; gap: 0.75em; align-items: flex-start; }
.pf-recent-thumb img { width: 64px; height: 64px; object-fit: cover; border-radius: 8px; flex-shrink: 0; }
.pf-recent-info { flex: 1; min-width: 0; }
.pf-recent-title { display: block; font-weight: 600; font-size: 0.9rem; color: #1f2937; text-decoration: none; line-height: 1.3; }
.pf-recent-title:hover { color: #2563eb; }
.pf-recent-date { display: block; font-size: 0.78rem; color: #9ca3af; margin-top: 0.25em; }`;

  files.set(`${s}.php`, mainPHP);
  files.set('readme.txt', readme);
  files.set('assets/css/style.css', css);
  return files;
}

// ═══════════════════════════════════════════════════════════════
// 6. SOCIAL SHARE PLUGIN
// ═══════════════════════════════════════════════════════════════

function generateSocialShare(config: PluginConfig): Map<string, string> {
  const s = config.slug;
  const f = fn(s, '');
  const td = config.textDomain;
  const files = new Map<string, string>();

  const mainPHP = `<?php
/**
 * Plugin Name: ${config.name}
 * Plugin URI: https://pageforge.dev
 * Description: ${config.description}
 * Version: ${config.version}
 * Author: ${config.author}
 * Author URI: ${config.authorUri}
 * License: GPL-2.0+
 * Text Domain: ${td}
 *
 * @package ${s}
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

function ${f}_enqueue() {
    wp_enqueue_style( '${s}-social', plugin_dir_url( __FILE__ ) . 'assets/css/style.css', array(), '${config.version}' );
    wp_enqueue_script( '${s}-social-js', plugin_dir_url( __FILE__ ) . 'assets/js/script.js', array(), '${config.version}', true );
}
add_action( 'wp_enqueue_scripts', '${f}_enqueue' );

function ${f}_render_buttons( $content ) {
    if ( ! is_single() ) return $content;
    $url   = urlencode( get_permalink() );
    $title = urlencode( get_the_title() );
    $img   = urlencode( wp_get_attachment_url( get_post_thumbnail_id() ) ?: '' );

    $buttons = '<div class="pf-social-share">';
    $buttons .= '<span class="pf-social-label">' . esc_html__( 'Compartir:', '${td}' ) . '</span>';
    $buttons .= '<a href="https://www.facebook.com/sharer/sharer.php?u=' . $url . '" class="pf-social-btn pf-facebook" target="_blank" rel="noopener" aria-label="Facebook">f</a>';
    $buttons .= '<a href="https://twitter.com/intent/tweet?url=' . $url . '&text=' . $title . '" class="pf-social-btn pf-twitter" target="_blank" rel="noopener" aria-label="Twitter/X">X</a>';
    $buttons .= '<a href="https://www.linkedin.com/shareArticle?mini=true&url=' . $url . '&title=' . $title . '" class="pf-social-btn pf-linkedin" target="_blank" rel="noopener" aria-label="LinkedIn">in</a>';
    $buttons .= '<a href="https://api.whatsapp.com/send?text=' . $title . '%20' . $url . '" class="pf-social-btn pf-whatsapp" target="_blank" rel="noopener" aria-label="WhatsApp">W</a>';
    $buttons .= '<a href="https://pinterest.com/pin/create/button/?url=' . $url . '&description=' . $title . '&media=' . $img . '" class="pf-social-btn pf-pinterest" target="_blank" rel="noopener" aria-label="Pinterest">P</a>';
    $buttons .= '</div>';

    return $content . $buttons;
}
add_filter( 'the_content', '${f}_render_buttons' );

function ${f}_floating_bar() {
    if ( ! is_single() ) return;
    echo '<div class="pf-social-floating" id="pf-social-floating">';
    echo '<a href="#" class="pf-social-float-btn pf-facebook" data-platform="facebook" aria-label="Facebook">f</a>';
    echo '<a href="#" class="pf-social-float-btn pf-twitter" data-platform="twitter" aria-label="Twitter/X">X</a>';
    echo '<a href="#" class="pf-social-float-btn pf-linkedin" data-platform="linkedin" aria-label="LinkedIn">in</a>';
    echo '<a href="#" class="pf-social-float-btn pf-whatsapp" data-platform="whatsapp" aria-label="WhatsApp">W</a>';
    echo '</div>';
}
add_action( 'wp_footer', '${f}_floating_bar' );
`;

  const readme = generateReadme(config, 'Botones de Redes Sociales', 'Añade botones para compartir en Facebook, Twitter/X, LinkedIn, WhatsApp y Pinterest debajo del contenido de cada post. Incluye barra flotante lateral.');
  const css = `.pf-social-share { display:flex; align-items:center; gap:0.6em; padding:1.5em 0; border-top:1px solid #e5e7eb; margin-top:2em; flex-wrap:wrap; }
.pf-social-label { font-weight:600; color:#6b7280; font-size:0.9rem; }
.pf-social-btn { display:inline-flex; align-items:center; justify-content:center; width:38px; height:38px; border-radius:50%; color:#fff; text-decoration:none; font-weight:700; font-size:0.85rem; transition:transform 0.2s, box-shadow 0.2s; }
.pf-social-btn:hover { transform:scale(1.1); box-shadow:0 4px 12px rgba(0,0,0,0.15); }
.pf-facebook { background:#1877f2; }
.pf-twitter { background:#000; }
.pf-linkedin { background:#0a66c2; }
.pf-whatsapp { background:#25d366; }
.pf-pinterest { background:#e60023; }
.pf-social-floating { position:fixed; left:16px; top:50%; transform:translateY(-50%); display:flex; flex-direction:column; gap:0.5em; z-index:9998; }
.pf-social-float-btn { display:flex; align-items:center; justify-content:center; width:40px; height:40px; border-radius:50%; color:#fff; text-decoration:none; font-weight:700; font-size:0.85rem; transition:transform 0.2s; opacity:0.85; }
.pf-social-float-btn:hover { transform:scale(1.15); opacity:1; }
@media (max-width:768px) { .pf-social-floating { left:auto; right:16px; top:auto; bottom:80px; transform:none; flex-direction:row; } }`;

  const js = `(function(){
    var url = encodeURIComponent(window.location.href);
    var title = encodeURIComponent(document.title);
    document.querySelectorAll('.pf-social-float-btn').forEach(function(btn){
        btn.addEventListener('click', function(e){
            e.preventDefault();
            var p = this.dataset.platform;
            var shareUrl = '';
            if (p==='facebook') shareUrl = 'https://www.facebook.com/sharer/sharer.php?u='+url;
            else if (p==='twitter') shareUrl = 'https://twitter.com/intent/tweet?url='+url+'&text='+title;
            else if (p==='linkedin') shareUrl = 'https://www.linkedin.com/shareArticle?mini=true&url='+url+'&title='+title;
            else if (p==='whatsapp') shareUrl = 'https://api.whatsapp.com/send?text='+title+'%20'+url;
            window.open(shareUrl, '_blank', 'width=600,height=400');
        });
    });
})();`;

  files.set(`${s}.php`, mainPHP);
  files.set('readme.txt', readme);
  files.set('assets/css/style.css', css);
  files.set('assets/js/script.js', js);
  return files;
}

// ═══════════════════════════════════════════════════════════════
// 7. SEO PLUGIN
// ═══════════════════════════════════════════════════════════════

function generateSEO(config: PluginConfig): Map<string, string> {
  const s = config.slug;
  const f = fn(s, '');
  const td = config.textDomain;
  const files = new Map<string, string>();

  const mainPHP = `<?php
/**
 * Plugin Name: ${config.name}
 * Plugin URI: https://pageforge.dev
 * Description: ${config.description}
 * Version: ${config.version}
 * Author: ${config.author}
 * Author URI: ${config.authorUri}
 * License: GPL-2.0+
 * Text Domain: ${td}
 *
 * @package ${s}
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

// ─── Meta Box en el editor ──────────────────────────────
function ${f}_add_meta_box() {
    add_meta_box( 'pf_seo_box', __( 'SEO — PageForge', '${td}' ), '${f}_render_meta_box', array( 'post', 'page' ), 'normal', 'high' );
}
add_action( 'add_meta_boxes', '${f}_add_meta_box' );

function ${f}_render_meta_box( $post ) {
    wp_nonce_field( '${f}_save_seo', '${f}_seo_nonce' );
    $title = get_post_meta( $post->ID, '_pf_seo_title', true );
    $desc  = get_post_meta( $post->ID, '_pf_seo_desc', true );
    echo '<p><label><strong>' . esc_html__( 'Meta Título', '${td}' ) . '</strong></label>';
    echo '<input type="text" name="pf_seo_title" value="' . esc_attr( $title ) . '" style="width:100%;margin-top:4px;" placeholder="' . esc_attr( get_the_title( $post ) ) . '">';
    echo '<small class="pf-seo-counter" data-max="60">' . esc_html( strlen( $title ?: get_the_title( $post ) ) ) . '/60</small></p>';
    echo '<p><label><strong>' . esc_html__( 'Meta Descripción', '${td}' ) . '</strong></label>';
    echo '<textarea name="pf_seo_desc" rows="3" style="width:100%;margin-top:4px;" placeholder="' . esc_attr( wp_trim_words( $post->post_content, 25 ) ) . '">' . esc_textarea( $desc ) . '</textarea>';
    echo '<small class="pf-seo-counter" data-max="160">' . esc_html( strlen( $desc ) ) . '/160</small></p>';
}

function ${f}_save_seo( $post_id ) {
    if ( ! isset( $_POST['${f}_seo_nonce'] ) || ! wp_verify_nonce( $_POST['${f}_seo_nonce'], '${f}_save_seo' ) ) return;
    if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) return;
    if ( isset( $_POST['pf_seo_title'] ) ) update_post_meta( $post_id, '_pf_seo_title', sanitize_text_field( wp_unslash( $_POST['pf_seo_title'] ) ) );
    if ( isset( $_POST['pf_seo_desc'] ) ) update_post_meta( $post_id, '_pf_seo_desc', sanitize_textarea_field( wp_unslash( $_POST['pf_seo_desc'] ) ) );
}
add_action( 'save_post', '${f}_save_seo' );

// ─── Output meta tags in head ───────────────────────────
function ${f}_output_meta() {
    if ( is_singular() ) {
        $post_id = get_the_ID();
        $title   = get_post_meta( $post_id, '_pf_seo_title', true ) ?: get_the_title();
        $desc    = get_post_meta( $post_id, '_pf_seo_desc', true );
        $url     = get_permalink( $post_id );
        $img     = wp_get_attachment_url( get_post_thumbnail_id( $post_id ) ) ?: '';

        echo '<meta name="description" content="' . esc_attr( $desc ) . '">' . "\\n";
        echo '<meta property="og:title" content="' . esc_attr( $title ) . '">' . "\\n";
        echo '<meta property="og:description" content="' . esc_attr( $desc ) . '">' . "\\n";
        echo '<meta property="og:url" content="' . esc_url( $url ) . '">' . "\\n";
        echo '<meta property="og:type" content="article">' . "\\n";
        echo '<meta property="og:site_name" content="' . esc_attr( get_bloginfo( 'name' ) ) . '">' . "\\n";
        if ( $img ) echo '<meta property="og:image" content="' . esc_url( $img ) . '">' . "\\n";
        echo '<meta name="twitter:card" content="summary_large_image">' . "\\n";
        echo '<meta name="twitter:title" content="' . esc_attr( $title ) . '">' . "\\n";
        echo '<meta name="twitter:description" content="' . esc_attr( $desc ) . '">' . "\\n";
        if ( $img ) echo '<meta name="twitter:image" content="' . esc_url( $img ) . '">' . "\\n";
    }
}
add_action( 'wp_head', '${f}_output_meta' );

// ─── Sitemap XML ────────────────────────────────────────
function ${f}_sitemap() {
    if ( get_query_var( 'pf_sitemap' ) !== 'xml' ) return;
    header( 'Content-Type: application/xml; charset=utf-8' );
    echo '<?xml version="1.0" encoding="UTF-8"?>';
    echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    $posts = get_posts( array( 'post_type' => array( 'post', 'page' ), 'posts_per_page' => 1000, 'post_status' => 'publish' ) );
    foreach ( $posts as $post ) {
        echo '<url><loc>' . esc_url( get_permalink( $post->ID ) ) . '</loc><lastmod>' . esc_html( get_post_modified_date( 'Y-m-d', false, $post ) ) . '</lastmod><changefreq>weekly</changefreq><priority>' . ( $post->post_type === 'page' ? '0.8' : '0.6' ) . '</priority></url>';
    }
    echo '</urlset>';
    exit;
}
add_action( 'init', function() {
    add_rewrite_rule( '^sitemap\\.xml$', 'index.php?pf_sitemap=xml', 'top' );
} );
add_action( 'template_redirect', '${f}_sitemap' );
add_filter( 'query_vars', function( $vars ) { $vars[] = 'pf_sitemap'; return $vars; } );

register_activation_hook( __FILE__, function() { flush_rewrite_rules(); } );
register_deactivation_hook( __FILE__, function() { flush_rewrite_rules(); } );
`;

  const readme = generateReadme(config, 'SEO Básico', 'Meta títulos, meta descripciones, etiquetas Open Graph y Twitter Cards para cada post/página. Genera sitemap.xml automáticamente. Incluye meta box en el editor.');
  files.set(`${s}.php`, mainPHP);
  files.set('readme.txt', readme);
  return files;
}

// ═══════════════════════════════════════════════════════════════
// 8. GOOGLE MAPS PLUGIN
// Shortcode: [pf_map]
// ═══════════════════════════════════════════════════════════════

function generateGoogleMaps(config: PluginConfig): Map<string, string> {
  const s = config.slug;
  const f = fn(s, '');
  const td = config.textDomain;
  const files = new Map<string, string>();

  const mainPHP = `<?php
/**
 * Plugin Name: ${config.name}
 * Plugin URI: https://pageforge.dev
 * Description: ${config.description}
 * Version: ${config.version}
 * Author: ${config.author}
 * Author URI: ${config.authorUri}
 * License: GPL-2.0+
 * Text Domain: ${td}
 *
 * @package ${s}
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

function ${f}_enqueue() {
    wp_enqueue_style( '${s}-map', plugin_dir_url( __FILE__ ) . 'assets/css/style.css', array(), '${config.version}' );
}
add_action( 'wp_enqueue_scripts', '${f}_enqueue' );

function ${f}_settings_page() {
    add_options_page( __( 'Configuración del Mapa — PageForge', '${td}' ), __( 'PageForge Mapa', '${td}' ), 'manage_options', '${s}-settings', '${f}_render_settings' );
}
add_action( 'admin_menu', '${f}_settings_page' );

function ${f}_render_settings() {
    if ( ! current_user_can( 'manage_options' ) ) return;
    if ( isset( $_POST['${f}_save'] ) && check_admin_referer( '${f}_settings_nonce', '${f}_nonce' ) ) {
        update_option( '${f}_api_key', sanitize_text_field( wp_unslash( $_POST['pf_map_api_key'] ?? '' ) ) );
        echo '<div class="notice notice-success"><p>' . esc_html__( 'Configuración guardada.', '${td}' ) . '</p></div>';
    }
    $api_key = get_option( '${f}_api_key', '' );
    echo '<div class="wrap"><h1>' . esc_html__( 'Configuración del Mapa', '${td}' ) . '</h1>';
    echo '<form method="post">';
    wp_nonce_field( '${f}_settings_nonce', '${f}_nonce' );
    echo '<table class="form-table"><tr><th>' . esc_html__( 'API Key de Google Maps', '${td}' ) . '</th>';
    echo '<td><input type="text" name="pf_map_api_key" value="' . esc_attr( $api_key ) . '" style="width:100%;" placeholder="AIza..."></td></tr></table>';
    echo '<p class="submit"><button type="submit" name="${f}_save" class="button button-primary">' . esc_html__( 'Guardar', '${td}' ) . '</button></p>';
    echo '</form></div>';
}

function ${f}_shortcode( $atts ) {
    $atts = shortcode_atts( array(
        'address' => '',
        'lat'     => '40.4168',
        'lng'     => '-3.7038',
        'zoom'    => '14',
        'width'   => '100%',
        'height'  => '400px',
    ), $atts, 'pf_map' );

    $api_key = get_option( '${f}_api_key', '' );
    if ( empty( $api_key ) && empty( $atts['address'] ) ) {
        return '<p style="color:#dc2626;padding:1em;background:#fee2e2;border-radius:8px;">' . esc_html__( 'Configura tu API Key de Google Maps en Ajustes > PageForge Mapa.', '${td}' ) . '</p>';
    }

    $id = 'pf-map-' . uniqid();
    wp_enqueue_script( 'google-maps', 'https://maps.googleapis.com/maps/api/js?key=' . esc_attr( $api_key ) . '&callback=Function.prototype', array(), null, true );

    ob_start();
    ?>
    <div id="<?php echo esc_attr( $id ); ?>" class="pf-google-map" style="width:<?php echo esc_attr( $atts['width'] ); ?>;height:<?php echo esc_attr( $atts['height'] ); ?>;" data-lat="<?php echo esc_attr( $atts['lat'] ); ?>" data-lng="<?php echo esc_attr( $atts['lng'] ); ?>" data-zoom="<?php echo esc_attr( $atts['zoom'] ); ?>" data-address="<?php echo esc_attr( $atts['address'] ); ?>"></div>
    <script>
    (function(){
        var el = document.getElementById('<?php echo esc_js( $id ); ?>');
        if (!el || !window.google || !window.google.maps) return;
        var lat = parseFloat(el.dataset.lat);
        var lng = parseFloat(el.dataset.lng);
        var address = el.dataset.address;
        var map = new google.maps.Map(el, { zoom: parseInt(el.dataset.zoom), center: {lat:lat,lng:lng} });
        if (address) {
            new google.maps.Geocoder().geocode({address:address}, function(results,status){
                if (status === 'OK') { map.setCenter(results[0].geometry.location); new google.maps.Marker({map:map, position:results[0].geometry.location}); }
            });
        } else {
            new google.maps.Marker({map:map, position:{lat:lat,lng:lng}});
        }
    })();
    </script>
    <?php
    return ob_get_clean();
}
add_shortcode( 'pf_map', '${f}_shortcode' );
`;

  const readme = generateReadme(config, 'Google Maps', 'Inserta mapas de Google con el shortcode [pf_map]. Configura la API key desde Ajustes. Soporta direcciones o coordenadas, zoom y dimensiones personalizables.');
  const css = `.pf-google-map { border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.1); margin: 1em 0; }`;

  files.set(`${s}.php`, mainPHP);
  files.set('readme.txt', readme);
  files.set('assets/css/style.css', css);
  return files;
}

// ═══════════════════════════════════════════════════════════════
// 9. COUNTDOWN PLUGIN
// Shortcode: [pf_countdown date="2025-12-31"]
// ═══════════════════════════════════════════════════════════════

function generateCountdown(config: PluginConfig): Map<string, string> {
  const s = config.slug;
  const f = fn(s, '');
  const td = config.textDomain;
  const files = new Map<string, string>();

  const mainPHP = `<?php
/**
 * Plugin Name: ${config.name}
 * Plugin URI: https://pageforge.dev
 * Description: ${config.description}
 * Version: ${config.version}
 * Author: ${config.author}
 * Author URI: ${config.authorUri}
 * License: GPL-2.0+
 * Text Domain: ${td}
 *
 * @package ${s}
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

function ${f}_enqueue() {
    wp_enqueue_style( '${s}-countdown', plugin_dir_url( __FILE__ ) . 'assets/css/style.css', array(), '${config.version}' );
    wp_enqueue_script( '${s}-countdown-js', plugin_dir_url( __FILE__ ) . 'assets/js/script.js', array(), '${config.version}', true );
}
add_action( 'wp_enqueue_scripts', '${f}_enqueue' );

function ${f}_shortcode( $atts ) {
    $atts = shortcode_atts( array(
        'date'    => '2025-12-31 23:59:59',
        'title'   => '',
        'bg'      => '#2563eb',
        'text'    => '#ffffff',
    ), $atts, 'pf_countdown' );

    $id = 'pf-cd-' . uniqid();
    ob_start();
    ?>
    <div class="pf-countdown-wrap" id="<?php echo esc_attr( $id ); ?>" data-date="<?php echo esc_attr( $atts['date'] ); ?>" style="background:<?php echo esc_attr( $atts['bg'] ); ?>;color:<?php echo esc_attr( $atts['text'] ); ?>;">
        <?php if ( $atts['title'] ) : ?>
            <h3 class="pf-cd-title"><?php echo esc_html( $atts['title'] ); ?></h3>
        <?php endif; ?>
        <div class="pf-cd-grid">
            <div class="pf-cd-item"><span class="pf-cd-num" data-unit="days">00</span><span class="pf-cd-label"><?php esc_html_e( 'Días', '${td}' ); ?></span></div>
            <div class="pf-cd-sep">:</div>
            <div class="pf-cd-item"><span class="pf-cd-num" data-unit="hours">00</span><span class="pf-cd-label"><?php esc_html_e( 'Horas', '${td}' ); ?></span></div>
            <div class="pf-cd-sep">:</div>
            <div class="pf-cd-item"><span class="pf-cd-num" data-unit="minutes">00</span><span class="pf-cd-label"><?php esc_html_e( 'Minutos', '${td}' ); ?></span></div>
            <div class="pf-cd-sep">:</div>
            <div class="pf-cd-item"><span class="pf-cd-num" data-unit="seconds">00</span><span class="pf-cd-label"><?php esc_html_e( 'Segundos', '${td}' ); ?></span></div>
        </div>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode( 'pf_countdown', '${f}_shortcode' );
`;

  const readme = generateReadme(config, 'Cuenta Regresiva', 'Temporizador de cuenta regresiva con el shortcode [pf_countdown date="2025-12-31"]. Personalizable con colores y título.');
  const css = `.pf-countdown-wrap { padding:2.5em; text-align:center; border-radius:16px; }
.pf-cd-title { font-size:1.5rem; font-weight:700; margin:0 0 1.5rem; }
.pf-cd-grid { display:flex; justify-content:center; align-items:center; gap:0.75rem; flex-wrap:wrap; }
.pf-cd-item { text-align:center; min-width:80px; }
.pf-cd-num { display:block; font-size:3rem; font-weight:800; line-height:1; }
.pf-cd-label { display:block; font-size:0.75rem; text-transform:uppercase; opacity:0.8; font-weight:600; letter-spacing:0.1em; margin-top:0.5rem; }
.pf-cd-sep { font-size:2.5rem; font-weight:300; opacity:0.5; }
@media(max-width:480px){ .pf-cd-num{font-size:2rem;} .pf-cd-item{min-width:55px;} }`;

  const js = `(function(){
    document.querySelectorAll('.pf-countdown-wrap').forEach(function(wrap){
        var target = new Date(wrap.dataset.date).getTime();
        function tick(){
            var diff = Math.max(0, target - Date.now());
            var d = Math.floor(diff/86400000);
            var h = Math.floor((diff%86400000)/3600000);
            var m = Math.floor((diff%3600000)/60000);
            var s = Math.floor((diff%60000)/1000);
            var data = {days:d, hours:h, minutes:m, seconds:s};
            wrap.querySelectorAll('.pf-cd-num').forEach(function(el){
                var unit = el.dataset.unit;
                if (data[unit] !== undefined) el.textContent = String(data[unit]).padStart(2,'0');
            });
        }
        tick();
        setInterval(tick, 1000);
    });
})();`;

  files.set(`${s}.php`, mainPHP);
  files.set('readme.txt', readme);
  files.set('assets/css/style.css', css);
  files.set('assets/js/script.js', js);
  return files;
}

// ═══════════════════════════════════════════════════════════════
// 10. PRICING TABLE PLUGIN
// Shortcode: [pf_pricing]
// ═══════════════════════════════════════════════════════════════

function generatePricingTable(config: PluginConfig): Map<string, string> {
  const s = config.slug;
  const f = fn(s, '');
  const td = config.textDomain;
  const files = new Map<string, string>();

  const mainPHP = `<?php
/**
 * Plugin Name: ${config.name}
 * Plugin URI: https://pageforge.dev
 * Description: ${config.description}
 * Version: ${config.version}
 * Author: ${config.author}
 * Author URI: ${config.authorUri}
 * License: GPL-2.0+
 * Text Domain: ${td}
 *
 * @package ${s}
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

function ${f}_enqueue() {
    wp_enqueue_style( '${s}-pricing', plugin_dir_url( __FILE__ ) . 'assets/css/style.css', array(), '${config.version}' );
}
add_action( 'wp_enqueue_scripts', '${f}_enqueue' );

function ${f}_shortcode() {
    $plans = get_option( '${f}_plans', array() );
    if ( empty( $plans ) ) {
        $plans = array(
            array( 'name' => 'Básico', 'price' => '$9', 'period' => '/mes', 'features' => 'Funcionalidad 1, Funcionalidad 2, Funcionalidad 3', 'highlighted' => false, 'cta' => 'Elegir plan', 'cta_url' => '#' ),
            array( 'name' => 'Pro', 'price' => '$29', 'period' => '/mes', 'features' => 'Todo lo de Básico, Funcionalidad 4, Funcionalidad 5, Funcionalidad 6, Soporte prioritario', 'highlighted' => true, 'cta' => 'Elegir plan', 'cta_url' => '#' ),
            array( 'name' => 'Enterprise', 'price' => '$79', 'period' => '/mes', 'features' => 'Todo lo de Pro, Funcionalidad 7, Funcionalidad 8, Funcionalidad 9, Cuenta dedicada, SLA garantizado', 'highlighted' => false, 'cta' => 'Elegir plan', 'cta_url' => '#' ),
        );
    }

    ob_start();
    ?>
    <div class="pf-pricing-grid">
    <?php foreach ( $plans as $plan ) :
        $features = explode( ',', $plan['features'] ?? '' );
        $hl = ! empty( $plan['highlighted'] );
    ?>
        <div class="pf-pricing-card<?php echo $hl ? ' pf-pricing-featured' : ''; ?>">
            <?php if ( $hl ) : ?><div class="pf-pricing-badge"><?php esc_html_e( 'Popular', '${td}' ); ?></div><?php endif; ?>
            <h3 class="pf-pricing-name"><?php echo esc_html( $plan['name'] ?? '' ); ?></h3>
            <div class="pf-pricing-price"><?php echo esc_html( $plan['price'] ?? '' ); ?><span class="pf-pricing-period"><?php echo esc_html( $plan['period'] ?? '' ); ?></span></div>
            <ul class="pf-pricing-features">
                <?php foreach ( $features as $feat ) : ?>
                    <li><?php echo esc_html( trim( $feat ) ); ?></li>
                <?php endforeach; ?>
            </ul>
            <a href="<?php echo esc_url( $plan['cta_url'] ?? '#' ); ?>" class="pf-pricing-btn<?php echo $hl ? ' pf-pricing-btn-featured' : ''; ?>"><?php echo esc_html( $plan['cta'] ?? __( 'Elegir plan', '${td}' ) ); ?></a>
        </div>
    <?php endforeach; ?>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode( 'pf_pricing', '${f}_shortcode' );

function ${f}_settings_page() {
    add_options_page( __( 'Tabla de Precios — PageForge', '${td}' ), __( 'PF Precios', '${td}' ), 'manage_options', '${s}-settings', '${f}_render_settings' );
}
add_action( 'admin_menu', '${f}_settings_page' );

function ${f}_render_settings() {
    if ( ! current_user_can( 'manage_options' ) ) return;
    if ( isset( $_POST['${f}_save'] ) && check_admin_referer( '${f}_nonce', '${f}_nonce' ) ) {
        $plans = array();
        $count = absint( $_POST['pf_plan_count'] ?? 0 );
        for ( $i = 0; $i < $count; $i++ ) {
            $plans[] = array(
                'name'        => sanitize_text_field( wp_unslash( $_POST['pf_plan_name_' . $i] ?? '' ) ),
                'price'       => sanitize_text_field( wp_unslash( $_POST['pf_plan_price_' . $i] ?? '' ) ),
                'period'      => sanitize_text_field( wp_unslash( $_POST['pf_plan_period_' . $i] ?? '' ) ),
                'features'    => sanitize_textarea_field( wp_unslash( $_POST['pf_plan_features_' . $i] ?? '' ) ),
                'highlighted' => ! empty( $_POST['pf_plan_hl_' . $i] ),
                'cta'         => sanitize_text_field( wp_unslash( $_POST['pf_plan_cta_' . $i] ?? '' ) ),
                'cta_url'     => esc_url_raw( wp_unslash( $_POST['pf_plan_url_' . $i] ?? '' ) ),
            );
        }
        update_option( '${f}_plans', $plans );
        echo '<div class="notice notice-success"><p>' . esc_html__( 'Planes guardados.', '${td}' ) . '</p></div>';
    }
    $plans = get_option( '${f}_plans', array() );
    echo '<div class="wrap"><h1>' . esc_html__( 'Configuración de Precios', '${td}' ) . '</h1>';
    echo '<form method="post">';
    wp_nonce_field( '${f}_nonce', '${f}_nonce' );
    echo '<p><button type="button" class="button" onclick="addPlan()">+ Añadir plan</button></p>';
    echo '<div id="pf-plans-container">';
    foreach ( $plans as $i => $plan ) :
        $hl = ! empty( $plan['highlighted'] );
        echo '<div class="pf-plan-row">';
        echo '<strong>Plan ' . ($i+1) . '</strong><br>';
        echo 'Nombre: <input name="pf_plan_name_' . $i . '" value="' . esc_attr( $plan['name'] ?? '' ) . '"> ';
        echo 'Precio: <input name="pf_plan_price_' . $i . '" value="' . esc_attr( $plan['price'] ?? '' ) . '" style="width:80px;"> ';
        echo 'Período: <input name="pf_plan_period_' . $i . '" value="' . esc_attr( $plan['period'] ?? '' ) . '" style="width:60px;"> ';
        echo 'Destacar: <input type="checkbox" name="pf_plan_hl_' . $i . '" ' . checked( $hl, true, false ) . '><br>';
        echo 'Funciones (separadas por coma): <textarea name="pf_plan_features_' . $i . '" rows="2" style="width:100%;">' . esc_textarea( $plan['features'] ?? '' ) . '</textarea><br>';
        echo 'Texto botón: <input name="pf_plan_cta_' . $i . '" value="' . esc_attr( $plan['cta'] ?? '' ) . '"> ';
        echo 'URL botón: <input name="pf_plan_url_' . $i . '" value="' . esc_attr( $plan['cta_url'] ?? '' ) . '">';
        echo '</div>';
    endforeach;
    echo '</div>';
    echo '<input type="hidden" name="pf_plan_count" value="' . count( $plans ) . '" id="pf_plan_count">';
    echo '<p class="submit"><button type="submit" name="${f}_save" class="button button-primary">Guardar planes</button></p>';
    echo '</form></div>';
}
`;

  const readme = generateReadme(config, 'Tabla de Precios', 'Muestra una tabla de precios profesional con el shortcode [pf_pricing]. Configurable desde Ajustes: planes, precios, funciones, destacado y botones de acción.');
  const css = `.pf-pricing-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:1.5rem; padding:2em 0; max-width:1200px; margin:0 auto; }
.pf-pricing-card { background:#fff; border:2px solid #e5e7eb; border-radius:16px; padding:2em; text-align:center; position:relative; transition:transform 0.2s, box-shadow 0.2s; }
.pf-pricing-card:hover { transform:translateY(-4px); box-shadow:0 8px 30px rgba(0,0,0,0.1); }
.pf-pricing-featured { border-color:#2563eb; box-shadow:0 8px 30px rgba(37,99,235,0.15); }
.pf-pricing-badge { position:absolute; top:-12px; left:50%; transform:translateX(-50%); background:#2563eb; color:#fff; padding:0.25em 1em; border-radius:20px; font-size:0.8rem; font-weight:600; }
.pf-pricing-name { font-size:1.3rem; font-weight:700; margin:0 0 0.5rem; color:#374151; }
.pf-pricing-price { font-size:2.5rem; font-weight:800; color:#111827; }
.pf-pricing-period { font-size:1rem; font-weight:400; color:#6b7280; }
.pf-pricing-features { list-style:none; padding:0; margin:1.5em 0; text-align:left; }
.pf-pricing-features li { padding:0.5em 0; border-bottom:1px solid #f3f4f6; font-size:0.95rem; color:#4b5563; }
.pf-pricing-features li::before { content:"✓"; color:#16a34a; font-weight:700; margin-right:0.5em; }
.pf-pricing-btn { display:block; padding:0.8em 2em; border:2px solid #2563eb; color:#2563eb; border-radius:10px; font-weight:600; text-decoration:none; transition:all 0.2s; }
.pf-pricing-btn:hover { background:#2563eb; color:#fff; }
.pf-pricing-btn-featured { background:#2563eb; color:#fff; border-color:#2563eb; }
.pf-pricing-btn-featured:hover { background:#1d4ed8; }`;

  files.set(`${s}.php`, mainPHP);
  files.set('readme.txt', readme);
  files.set('assets/css/style.css', css);
  return files;
}

// ═══════════════════════════════════════════════════════════════
// 11. TESTIMONIALS PLUGIN
// Shortcode: [pf_testimonials]
// ═══════════════════════════════════════════════════════════════

function generateTestimonials(config: PluginConfig): Map<string, string> {
  const s = config.slug;
  const f = fn(s, '');
  const td = config.textDomain;
  const files = new Map<string, string>();

  const mainPHP = `<?php
/**
 * Plugin Name: ${config.name}
 * Plugin URI: https://pageforge.dev
 * Description: ${config.description}
 * Version: ${config.version}
 * Author: ${config.author}
 * Author URI: ${config.authorUri}
 * License: GPL-2.0+
 * Text Domain: ${td}
 *
 * @package ${s}
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

function ${f}_register_cpt() {
    register_post_type( 'pf_testimonial', array(
        'labels' => array(
            'name'               => __( 'Testimonios', '${td}' ),
            'singular_name'      => __( 'Testimonio', '${td}' ),
            'add_new'            => __( 'Añadir testimonio', '${td}' ),
            'add_new_item'       => __( 'Añadir nuevo testimonio', '${td}' ),
            'edit_item'          => __( 'Editar testimonio', '${td}' ),
            'view_item'          => __( 'Ver testimonio', '${td}' ),
            'all_items'          => __( 'Todos los testimonios', '${td}' ),
            'search_items'       => __( 'Buscar testimonios', '${td}' ),
            'not_found'          => __( 'No se encontraron testimonios.', '${td}' ),
        ),
        'public'       => false,
        'show_ui'      => true,
        'menu_icon'    => 'dashicons-format-quote',
        'supports'     => array( 'title', 'editor', 'thumbnail' ),
        'show_in_rest' => true,
    ) );
}
add_action( 'init', '${f}_register_cpt' );

function ${f}_meta_boxes() {
    add_meta_box( 'pf_testimonial_details', __( 'Detalles del testimonio', '${td}' ), function( $post ) {
        wp_nonce_field( '${f}_save_meta', '${f}_meta_nonce' );
        $role   = get_post_meta( $post->ID, '_pf_testimonial_role', true );
        $rating = get_post_meta( $post->ID, '_pf_testimonial_rating', true );
        echo '<p><label>' . esc_html__( 'Cargo / Rol:', '${td}' ) . '</label><br>';
        echo '<input type="text" name="pf_testimonial_role" value="' . esc_attr( $role ) . '" style="width:100%;"></p>';
        echo '<p><label>' . esc_html__( 'Valoración (1-5):', '${td}' ) . '</label><br>';
        echo '<select name="pf_testimonial_rating">';
        for ( $i = 1; $i <= 5; $i++ ) {
            echo '<option value="' . $i . '"' . selected( $rating, $i, false ) . '>' . str_repeat( '★', $i ) . '</option>';
        }
        echo '</select></p>';
    }, 'pf_testimonial', 'normal', 'high' );
}
add_action( 'add_meta_boxes', '${f}_meta_boxes' );

function ${f}_save_meta( $post_id ) {
    if ( ! isset( $_POST['${f}_meta_nonce'] ) || ! wp_verify_nonce( $_POST['${f}_meta_nonce'], '${f}_save_meta' ) ) return;
    if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) return;
    if ( isset( $_POST['pf_testimonial_role'] ) ) update_post_meta( $post_id, '_pf_testimonial_role', sanitize_text_field( wp_unslash( $_POST['pf_testimonial_role'] ) ) );
    if ( isset( $_POST['pf_testimonial_rating'] ) ) update_post_meta( $post_id, '_pf_testimonial_rating', absint( $_POST['pf_testimonial_rating'] ) );
}
add_action( 'save_post_pf_testimonial', '${f}_save_meta' );

function ${f}_enqueue() {
    wp_enqueue_style( '${s}-testimonials', plugin_dir_url( __FILE__ ) . 'assets/css/style.css', array(), '${config.version}' );
}
add_action( 'wp_enqueue_scripts', '${f}_enqueue' );

function ${f}_shortcode( $atts ) {
    $atts = shortcode_atts( array( 'count' => 6, 'columns' => 3 ), $atts, 'pf_testimonials' );
    $testimonials = get_posts( array(
        'post_type'      => 'pf_testimonial',
        'posts_per_page' => absint( $atts['count'] ),
        'orderby'        => 'date',
        'order'          => 'DESC',
    ) );
    if ( empty( $testimonials ) ) return '';

    ob_start();
    echo '<div class="pf-testimonials-grid" style="grid-template-columns:repeat(' . min( absint( $atts['columns'] ), count( $testimonials ) ) . ',1fr);">';
    foreach ( $testimonials as $t ) :
        $role   = get_post_meta( $t->ID, '_pf_testimonial_role', true );
        $rating = absint( get_post_meta( $t->ID, '_pf_testimonial_rating', true ) ?: 5 );
        $stars  = str_repeat( '★', $rating ) . str_repeat( '☆', 5 - $rating );
    ?>
        <div class="pf-testimonial-card">
            <div class="pf-t-stars"><?php echo esc_html( $stars ); ?></div>
            <div class="pf-t-quote"><?php echo wp_kses_post( wp_trim_words( $t->post_content, 30 ) ); ?></div>
            <div class="pf-t-author">
                <?php if ( has_post_thumbnail( $t->ID ) ) : ?>
                    <?php echo get_the_post_thumbnail( $t->ID, 'thumbnail', array( 'class' => 'pf-t-avatar' ) ); ?>
                <?php endif; ?>
                <div class="pf-t-info">
                    <strong class="pf-t-name"><?php echo esc_html( $t->post_title ); ?></strong>
                    <?php if ( $role ) : ?><span class="pf-t-role"><?php echo esc_html( $role ); ?></span><?php endif; ?>
                </div>
            </div>
        </div>
    <?php endforeach;
    echo '</div>';
    return ob_get_clean();
}
add_shortcode( 'pf_testimonials', '${f}_shortcode' );

register_activation_hook( __FILE__, function() { flush_rewrite_rules(); });
register_deactivation_hook( __FILE__, function() { flush_rewrite_rules(); });
`;

  const readme = generateReadme(config, 'Testimonios', 'Sistema de testimonios con custom post type y el shortcode [pf_testimonials]. Incluye valoración con estrellas, avatar, cargo y diseño en cuadrícula.');
  const css = `.pf-testimonials-grid { display:grid; gap:1.5rem; padding:2em 0; }
.pf-testimonial-card { background:#fff; border:1px solid #e5e7eb; border-radius:12px; padding:1.5em; transition:box-shadow 0.2s; }
.pf-testimonial-card:hover { box-shadow:0 4px 16px rgba(0,0,0,0.08); }
.pf-t-stars { color:#f59e0b; font-size:1.1rem; margin-bottom:0.75rem; letter-spacing:2px; }
.pf-t-quote { color:#4b5563; font-size:0.95rem; line-height:1.6; margin-bottom:1rem; font-style:italic; }
.pf-t-author { display:flex; align-items:center; gap:0.75rem; }
.pf-t-avatar { width:48px; height:48px; border-radius:50%; object-fit:cover; }
.pf-t-name { display:block; font-weight:600; color:#1f2937; font-size:0.95rem; }
.pf-t-role { display:block; font-size:0.82rem; color:#9ca3af; }
@media(max-width:768px){ .pf-testimonials-grid{grid-template-columns:1fr!important;} }`;

  files.set(`${s}.php`, mainPHP);
  files.set('readme.txt', readme);
  files.set('assets/css/style.css', css);
  return files;
}

// ═══════════════════════════════════════════════════════════════
// 12. MAINTENANCE MODE PLUGIN
// ═══════════════════════════════════════════════════════════════

function generateMaintenanceMode(config: PluginConfig): Map<string, string> {
  const s = config.slug;
  const f = fn(s, '');
  const td = config.textDomain;
  const files = new Map<string, string>();

  const mainPHP = `<?php
/**
 * Plugin Name: ${config.name}
 * Plugin URI: https://pageforge.dev
 * Description: ${config.description}
 * Version: ${config.version}
 * Author: ${config.author}
 * Author URI: ${config.authorUri}
 * License: GPL-2.0+
 * Text Domain: ${td}
 *
 * @package ${s}
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

function ${f}_enqueue() {
    wp_enqueue_style( '${s}-maintenance', plugin_dir_url( __FILE__ ) . 'assets/css/style.css', array(), '${config.version}' );
}
add_action( 'wp_enqueue_scripts', '${f}_enqueue' );

function ${f}_settings_page() {
    add_options_page( __( 'Modo Mantenimiento — PageForge', '${td}' ), __( 'PF Mantenimiento', '${td}' ), 'manage_options', '${s}-settings', '${f}_render_settings' );
}
add_action( 'admin_menu', '${f}_settings_page' );

function ${f}_render_settings() {
    if ( ! current_user_can( 'manage_options' ) ) return;
    if ( isset( $_POST['${f}_save'] ) && check_admin_referer( '${f}_nonce', '${f}_nonce' ) ) {
        update_option( '${f}_enabled', ! empty( $_POST['pf_maintenance_enabled'] ) );
        update_option( '${f}_message', sanitize_textarea_field( wp_unslash( $_POST['pf_maintenance_message'] ?? '' ) ) );
        update_option( '${f}_bg', sanitize_hex_color( wp_unslash( $_POST['pf_maintenance_bg'] ?? '#1f2937' ) ) );
        echo '<div class="notice notice-success"><p>' . esc_html__( 'Configuración guardada.', '${td}' ) . '</p></div>';
    }
    $enabled = get_option( '${f}_enabled', false );
    $message = get_option( '${f}_message', __( 'Estamos realizando mejoras en nuestro sitio. Vuelve pronto.', '${td}' ) );
    $bg      = get_option( '${f}_bg', '#1f2937' );
    echo '<div class="wrap"><h1>' . esc_html__( 'Modo Mantenimiento', '${td}' ) . '</h1>';
    echo '<form method="post">';
    wp_nonce_field( '${f}_nonce', '${f}_nonce' );
    echo '<table class="form-table">';
    echo '<tr><th>Activar</th><td><label><input type="checkbox" name="pf_maintenance_enabled" ' . checked( $enabled, true, false ) . '> Activar modo mantenimiento</label></td></tr>';
    echo '<tr><th>Mensaje</th><td><textarea name="pf_maintenance_message" rows="4" style="width:100%;">' . esc_textarea( $message ) . '</textarea></td></tr>';
    echo '<tr><th>Color de fondo</th><td><input type="color" name="pf_maintenance_bg" value="' . esc_attr( $bg ) . '"></td></tr>';
    echo '</table>';
    echo '<p class="submit"><button type="submit" name="${f}_save" class="button button-primary">' . esc_html__( 'Guardar', '${td}' ) . '</button></p>';
    echo '</form></div>';
}

function ${f}_template_redirect() {
    if ( ! get_option( '${f}_enabled', false ) ) return;
    if ( current_user_can( 'manage_options' ) || is_user_logged_in() ) return;

    $message = get_option( '${f}_message', __( 'Estamos realizando mejoras. Vuelve pronto.', '${td}' ) );
    $bg      = get_option( '${f}_bg', '#1f2937' );

    wp_die(
        '<div class="pf-maintenance-page" style="background:' . esc_attr( $bg ) . ';color:#fff;min-height:100vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:2rem;font-family:sans-serif;">
            <div>
                <h1 style="font-size:3rem;margin-bottom:1rem;">🔧</h1>
                <h2 style="font-size:1.5rem;margin-bottom:1rem;">' . esc_html__( 'Sitio en Mantenimiento', '${td}' ) . '</h2>
                <p style="font-size:1.1rem;opacity:0.85;max-width:500px;margin:0 auto;">' . esc_html( $message ) . '</p>
            </div>
        </div>',
        '',
        array( 'response' => 503 )
    );
}
add_action( 'template_redirect', '${f}_template_redirect' );
`;

  const readme = generateReadme(config, 'Modo Mantenimiento', 'Activa una página de mantenimiento para los visitantes. Los administradores pueden ver el sitio normalmente. Configurable: mensaje, color de fondo. Código HTTP 503.');
  const css = `.pf-maintenance-page { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }`;

  files.set(`${s}.php`, mainPHP);
  files.set('readme.txt', readme);
  files.set('assets/css/style.css', css);
  return files;
}

// ═══════════════════════════════════════════════════════════════
// 13. CUSTOM LOGIN PLUGIN
// ═══════════════════════════════════════════════════════════════

function generateCustomLogin(config: PluginConfig): Map<string, string> {
  const s = config.slug;
  const f = fn(s, '');
  const td = config.textDomain;
  const files = new Map<string, string>();

  const mainPHP = `<?php
/**
 * Plugin Name: ${config.name}
 * Plugin URI: https://pageforge.dev
 * Description: ${config.description}
 * Version: ${config.version}
 * Author: ${config.author}
 * Author URI: ${config.authorUri}
 * License: GPL-2.0+
 * Text Domain: ${td}
 *
 * @package ${s}
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

function ${f}_settings_page() {
    add_options_page( __( 'Login Personalizado — PageForge', '${td}' ), __( 'PF Login', '${td}' ), 'manage_options', '${s}-settings', '${f}_render_settings' );
}
add_action( 'admin_menu', '${f}_settings_page' );

function ${f}_render_settings() {
    if ( ! current_user_can( 'manage_options' ) ) return;
    if ( isset( $_POST['${f}_save'] ) && check_admin_referer( '${f}_nonce', '${f}_nonce' ) ) {
        update_option( '${f}_logo_url', esc_url_raw( wp_unslash( $_POST['pf_login_logo'] ?? '' ) ) );
        update_option( '${f}_bg_color', sanitize_hex_color( wp_unslash( $_POST['pf_login_bg'] ?? '#f3f4f6' ) ) );
        update_option( '${f}_form_bg', sanitize_hex_color( wp_unslash( $_POST['pf_login_form_bg'] ?? '#ffffff' ) ) );
        update_option( '${f}_btn_color', sanitize_hex_color( wp_unslash( $_POST['pf_login_btn'] ?? '#2563eb' ) ) );
        echo '<div class="notice notice-success"><p>' . esc_html__( 'Configuración guardada.', '${td}' ) . '</p></div>';
    }
    $logo   = get_option( '${f}_logo_url', '' );
    $bg     = get_option( '${f}_bg_color', '#f3f4f6' );
    $formBg = get_option( '${f}_form_bg', '#ffffff' );
    $btnC   = get_option( '${f}_btn_color', '#2563eb' );
    echo '<div class="wrap"><h1>' . esc_html__( 'Login Personalizado', '${td}' ) . '</h1>';
    echo '<form method="post">';
    wp_nonce_field( '${f}_nonce', '${f}_nonce' );
    echo '<table class="form-table">';
    echo '<tr><th>Logo URL</th><td><input type="url" name="pf_login_logo" value="' . esc_attr( $logo ) . '" style="width:100%;" placeholder="https://..."></td></tr>';
    echo '<tr><th>Fondo de la página</th><td><input type="color" name="pf_login_bg" value="' . esc_attr( $bg ) . '"></td></tr>';
    echo '<tr><th>Fondo del formulario</th><td><input type="color" name="pf_login_form_bg" value="' . esc_attr( $formBg ) . '"></td></tr>';
    echo '<tr><th>Color del botón</th><td><input type="color" name="pf_login_btn" value="' . esc_attr( $btnC ) . '"></td></tr>';
    echo '</table>';
    echo '<p class="submit"><button type="submit" name="${f}_save" class="button button-primary">Guardar</button></p>';
    echo '</form></div>';
}

function ${f}_login_styles() {
    $bg     = esc_attr( get_option( '${f}_bg_color', '#f3f4f6' ) );
    $formBg = esc_attr( get_option( '${f}_form_bg', '#ffffff' ) );
    $btnC   = esc_attr( get_option( '${f}_btn_color', '#2563eb' ) );
    echo '<style>';
    echo 'body.login{background:' . $bg . ';}';
    echo '#loginform{background:' . $formBg . ';border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.08);padding:2em;}';
    echo '.login #loginform .button-primary{background:' . $btnC . ';border-color:' . $btnC . ';border-radius:8px;height:46px;font-size:1rem;}';
    echo '.login #loginform .button-primary:hover{filter:brightness(0.9);}';
    echo '.login #loginform input[type=text],.login #loginform input[type=password]{border-radius:8px;border:2px solid #e5e7eb;padding:0.75em;}';
    echo '</style>';
}
add_action( 'login_enqueue_scripts', '${f}_login_styles' );

function ${f}_login_logo() {
    $logo = get_option( '${f}_logo_url', '' );
    if ( $logo ) {
        echo '<style>#login h1 a { background-image:url(' . esc_url( $logo ) . ') !important; background-size:contain !important; width:auto !important; }</style>';
    }
}
add_action( 'login_enqueue_scripts', '${f}_login_logo' );
`;

  const readme = generateReadme(config, 'Login Personalizado', 'Personaliza la página de login de WordPress. Configura logo, colores de fondo, del formulario y del botón. Sin código CSS manual.');
  files.set(`${s}.php`, mainPHP);
  files.set('readme.txt', readme);
  return files;
}

// ═══════════════════════════════════════════════════════════════
// 14. BREADCRUMBS PLUGIN
// ═══════════════════════════════════════════════════════════════

function generateBreadcrumbs(config: PluginConfig): Map<string, string> {
  const s = config.slug;
  const f = fn(s, '');
  const td = config.textDomain;
  const files = new Map<string, string>();

  const mainPHP = `<?php
/**
 * Plugin Name: ${config.name}
 * Plugin URI: https://pageforge.dev
 * Description: ${config.description}
 * Version: ${config.version}
 * Author: ${config.author}
 * Author URI: ${config.authorUri}
 * License: GPL-2.0+
 * Text Domain: ${td}
 *
 * @package ${s}
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

function ${f}_enqueue() {
    wp_enqueue_style( '${s}-breadcrumbs', plugin_dir_url( __FILE__ ) . 'assets/css/style.css', array(), '${config.version}' );
}
add_action( 'wp_enqueue_scripts', '${f}_enqueue' );

function ${f}_render() {
    if ( is_front_page() ) return '';

    $items = array( array( 'label' => __( 'Inicio', '${td}' ), 'url' => home_url( '/' ) ) );

    if ( is_category() || is_single() ) {
        if ( is_category() ) {
            $cat = get_queried_object();
            $items[] = array( 'label' => $cat->name, 'url' => '' );
        } elseif ( is_single() ) {
            $cats = get_the_category();
            if ( ! empty( $cats ) ) {
                $items[] = array( 'label' => $cats[0]->name, 'url' => get_category_link( $cats[0]->term_id ) );
            }
            $items[] = array( 'label' => get_the_title(), 'url' => '' );
        }
    } elseif ( is_tag() ) {
        $items[] = array( 'label' => __( 'Etiqueta: ', '${td}' ) . single_tag_title( '', false ), 'url' => '' );
    } elseif ( is_date() ) {
        $items[] = array( 'label' => get_the_date( 'F Y' ), 'url' => '' );
    } elseif ( is_author() ) {
        $items[] = array( 'label' => get_the_author(), 'url' => '' );
    } elseif ( is_search() ) {
        $items[] = array( 'label' => __( 'Resultados de: ', '${td}' ) . get_search_query(), 'url' => '' );
    } elseif ( is_404() ) {
        $items[] = array( 'label' => __( 'Página no encontrada', '${td}' ), 'url' => '' );
    } elseif ( is_page() ) {
        $post = get_post();
        if ( $post && $post->post_parent ) {
            $ancestors = array_reverse( get_post_ancestors( $post->ID ) );
            foreach ( $ancestors as $ancestor ) {
                $items[] = array( 'label' => get_the_title( $ancestor ), 'url' => get_permalink( $ancestor ) );
            }
        }
        $items[] = array( 'label' => get_the_title(), 'url' => '' );
    }

    // Schema.org BreadcrumbList
    $schema = array(
        '@context'        => 'https://schema.org',
        '@type'           => 'BreadcrumbList',
        'itemListElement' => array(),
    );
    $html = '<nav class="pf-breadcrumbs" aria-label="' . esc_attr__( 'Ruta de navegación', '${td}' ) . '"><ol class="pf-breadcrumb-list">';

    foreach ( $items as $i => $item ) {
        $pos = $i + 1;
        $schema['itemListElement'][] = array(
            '@type'    => 'ListItem',
            'position' => $pos,
            'name'     => $item['label'],
            'item'     => ! empty( $item['url'] ) ? $item['url'] : get_permalink(),
        );
        $html .= '<li class="pf-breadcrumb-item">';
        if ( ! empty( $item['url'] ) ) {
            $html .= '<a href="' . esc_url( $item['url'] ) . '" class="pf-breadcrumb-link">' . esc_html( $item['label'] ) . '</a>';
        } else {
            $html .= '<span class="pf-breadcrumb-current" aria-current="page">' . esc_html( $item['label'] ) . '</span>';
        }
        $html .= '</li>';
    }

    $html .= '</ol></nav>';
    $html .= '<script type="application/ld+json">' . wp_json_encode( $schema, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES ) . '</script>';

    return $html;
}

function ${f}_auto_insert( $content ) {
    if ( is_singular() ) {
        return ${f}_render() . $content;
    }
    return $content;
}
add_filter( 'the_content', '${f}_auto_insert' );
`;

  const readme = generateReadme(config, 'Breadcrumbs (Migas de Pan)', 'Navegación de migas de pan automática con marcado schema.org/BreadcrumbList. Soporta páginas, posts, categorías, tags, archivos, autor, búsqueda y 404.');
  const css = `.pf-breadcrumbs { padding:0.75em 0; margin-bottom:1.5em; }
.pf-breadcrumb-list { display:flex; flex-wrap:wrap; align-items:center; list-style:none; padding:0; margin:0; gap:0.25rem; font-size:0.85rem; }
.pf-breadcrumb-item { display:flex; align-items:center; }
.pf-breadcrumb-item::after { content:'›'; margin:0 0.4rem; color:#9ca3af; }
.pf-breadcrumb-item:last-child::after { content:none; }
.pf-breadcrumb-link { color:#6b7280; text-decoration:none; transition:color 0.2s; }
.pf-breadcrumb-link:hover { color:#2563eb; }
.pf-breadcrumb-current { color:#374151; font-weight:600; }`;

  files.set(`${s}.php`, mainPHP);
  files.set('readme.txt', readme);
  files.set('assets/css/style.css', css);
  return files;
}

// ═══════════════════════════════════════════════════════════════
// 15. RELATED POSTS PLUGIN
// ═══════════════════════════════════════════════════════════════

function generateRelatedPosts(config: PluginConfig): Map<string, string> {
  const s = config.slug;
  const f = fn(s, '');
  const td = config.textDomain;
  const files = new Map<string, string>();

  const mainPHP = `<?php
/**
 * Plugin Name: ${config.name}
 * Plugin URI: https://pageforge.dev
 * Description: ${config.description}
 * Version: ${config.version}
 * Author: ${config.author}
 * Author URI: ${config.authorUri}
 * License: GPL-2.0+
 * Text Domain: ${td}
 *
 * @package ${s}
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

function ${f}_enqueue() {
    wp_enqueue_style( '${s}-related', plugin_dir_url( __FILE__ ) . 'assets/css/style.css', array(), '${config.version}' );
}
add_action( 'wp_enqueue_scripts', '${f}_enqueue' );

function ${f}_get_related() {
    $post_id = get_the_ID();
    if ( ! is_singular( 'post' ) || ! $post_id ) return '';

    $count   = absint( get_option( '${f}_count', 4 ) );
    $cats    = wp_get_post_categories( $post_id );
    $tags    = wp_get_post_tags( $post_id );
    $related = array();

    // First try by category
    if ( ! empty( $cats ) ) {
        $related = get_posts( array(
            'post_type'      => 'post',
            'posts_per_page' => $count + 1,
            'post__not_in'   => array( $post_id ),
            'category__in'   => $cats,
            'orderby'        => 'rand',
        ) );
    }

    // Fallback to tags
    if ( empty( $related ) && ! empty( $tags ) ) {
        $tag_ids = wp_list_pluck( $tags, 'term_id' );
        $related = get_posts( array(
            'post_type'      => 'post',
            'posts_per_page' => $count + 1,
            'post__not_in'   => array( $post_id ),
            'tag__in'        => $tag_ids,
            'orderby'        => 'rand',
        ) );
    }

    // Fallback to recent
    if ( empty( $related ) ) {
        $related = get_posts( array(
            'post_type'      => 'post',
            'posts_per_page' => $count,
            'post__not_in'   => array( $post_id ),
            'orderby'        => 'date',
        ) );
    }

    $related = array_slice( $related, 0, $count );
    if ( empty( $related ) ) return '';

    ob_start();
    ?>
    <div class="pf-related-posts">
        <h3 class="pf-related-title"><?php esc_html_e( 'Posts Relacionados', '${td}' ); ?></h3>
        <div class="pf-related-grid">
            <?php foreach ( $related as $post ) : ?>
                <a href="<?php echo esc_url( get_permalink( $post->ID ) ); ?>" class="pf-related-card">
                    <?php if ( has_post_thumbnail( $post->ID ) ) : ?>
                        <div class="pf-related-thumb"><?php echo get_the_post_thumbnail( $post->ID, 'medium' ); ?></div>
                    <?php else : ?>
                        <div class="pf-related-thumb pf-related-placeholder"><?php esc_html_e( 'Sin imagen', '${td}' ); ?></div>
                    <?php endif; ?>
                    <div class="pf-related-info">
                        <span class="pf-related-cat"><?php echo esc_html( get_the_category_list( ', ', '', $post->ID ) ); ?></span>
                        <h4 class="pf-related-name"><?php echo esc_html( $post->post_title ); ?></h4>
                        <span class="pf-related-date"><?php echo esc_html( get_the_date( '', $post->ID ) ); ?></span>
                    </div>
                </a>
            <?php endforeach; ?>
        </div>
    </div>
    <?php
    return ob_get_clean();
}

function ${f}_auto_insert( $content ) {
    if ( is_singular( 'post' ) ) {
        return $content . ${f}_get_related();
    }
    return $content;
}
add_filter( 'the_content', '${f}_auto_insert' );

function ${f}_settings_page() {
    add_options_page( __( 'Posts Relacionados — PageForge', '${td}' ), __( 'PF Relacionados', '${td}' ), 'manage_options', '${s}-settings', '${f}_render_settings' );
}
add_action( 'admin_menu', '${f}_settings_page' );

function ${f}_render_settings() {
    if ( ! current_user_can( 'manage_options' ) ) return;
    if ( isset( $_POST['${f}_save'] ) && check_admin_referer( '${f}_nonce', '${f}_nonce' ) ) {
        update_option( '${f}_count', absint( $_POST['pf_related_count'] ?? 4 ) );
        echo '<div class="notice notice-success"><p>Configuración guardada.</p></div>';
    }
    $count = get_option( '${f}_count', 4 );
    echo '<div class="wrap"><h1>' . esc_html__( 'Posts Relacionados', '${td}' ) . '</h1>';
    echo '<form method="post">';
    wp_nonce_field( '${f}_nonce', '${f}_nonce' );
    echo '<table class="form-table"><tr><th>Número de posts</th>';
    echo '<td><input type="number" name="pf_related_count" value="' . esc_attr( $count ) . '" min="1" max="12"></td></tr></table>';
    echo '<p class="submit"><button type="submit" name="${f}_save" class="button button-primary">Guardar</button></p>';
    echo '</form></div>';
}
`;

  const readme = generateReadme(config, 'Posts Relacionados', 'Muestra posts relacionados automáticamente al final de cada entrada. Relaciona por categoría y etiquetas con fallback. Incluye miniaturas y diseño en cuadrícula.');
  const css = `.pf-related-posts { padding:2em 0; border-top:1px solid #e5e7eb; margin-top:2em; }
.pf-related-title { font-size:1.4rem; font-weight:700; margin:0 0 1.25rem; color:#1f2937; }
.pf-related-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(250px,1fr)); gap:1.25rem; }
.pf-related-card { text-decoration:none; color:inherit; background:#fff; border:1px solid #e5e7eb; border-radius:12px; overflow:hidden; transition:transform 0.2s, box-shadow 0.2s; display:block; }
.pf-related-card:hover { transform:translateY(-3px); box-shadow:0 6px 20px rgba(0,0,0,0.08); }
.pf-related-thumb img { width:100%; height:180px; object-fit:cover; }
.pf-related-placeholder { width:100%; height:180px; background:#f3f4f6; display:flex; align-items:center; justify-content:center; color:#9ca3af; font-size:0.9rem; }
.pf-related-info { padding:1em; }
.pf-related-cat { font-size:0.78rem; color:#6b7280; }
.pf-related-name { font-size:1rem; font-weight:600; color:#1f2937; margin:0.4em 0; line-height:1.3; }
.pf-related-date { font-size:0.78rem; color:#9ca3af; }
@media(max-width:640px){ .pf-related-grid{grid-template-columns:1fr;} }`;

  files.set(`${s}.php`, mainPHP);
  files.set('readme.txt', readme);
  files.set('assets/css/style.css', css);
  return files;
}

// ═══════════════════════════════════════════════════════════════
// README GENERATOR
// ═══════════════════════════════════════════════════════════════

function generateReadme(config: PluginConfig, shortName: string, description: string): string {
  return `=== ${config.name} ===
Contributors: ${config.author}
Tags: wordpress plugin, pageforge, ${config.pluginType}
Requires at least: 6.0
Tested up to: 6.7
Requires PHP: 7.4
Stable tag: ${config.version}
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

${shortName} — Generado con PageForge

== Descripción ==

${description}

== Instalación ==

1. Sube el archivo ZIP a \`wp-content/plugins/\`
2. Activa el plugin desde el panel de administración
3. Configura las opciones según el tipo de plugin

== Changelog ==

= ${config.version} =
* Versión inicial generada con PageForge v2
`;
}

// ═══════════════════════════════════════════════════════════════
// MAIN ORCHESTRATOR
// ═══════════════════════════════════════════════════════════════

const PLUGIN_GENERATORS: Record<PluginType, (config: PluginConfig) => Map<string, string>> = {
  'contact-form':      generateContactForm,
  'slider':            generateSlider,
  'custom-post-type':  generateCustomPostType,
  'shortcodes':        generateShortcodes,
  'widget':            generateWidget,
  'social-share':      generateSocialShare,
  'seo':               generateSEO,
  'google-maps':       generateGoogleMaps,
  'countdown':         generateCountdown,
  'pricing-table':     generatePricingTable,
  'testimonials':      generateTestimonials,
  'maintenance-mode':  generateMaintenanceMode,
  'custom-login':      generateCustomLogin,
  'breadcrumbs':       generateBreadcrumbs,
  'related-posts':     generateRelatedPosts,
};

/**
 * Generates all plugin files for a given PluginConfig.
 * Returns a Map<filePath, content> relative to the plugin root folder.
 */
export function generatePluginFiles(config: PluginConfig): Map<string, string> {
  const generator = PLUGIN_GENERATORS[config.pluginType];
  if (!generator) {
    throw new Error(`Tipo de plugin desconocido: ${config.pluginType}`);
  }
  return generator(config);
}
