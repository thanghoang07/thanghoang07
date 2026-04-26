/**
 * 🎨 Design System Enhancements
 * - Cursor glow effect (desktop)
 * - Project card hover (image zoom)
 * - ds-reveal scroll observer
 * - Nav scroll class
 * - Scroll progress bar
 *
 * Import this AFTER design-system.css is loaded.
 * Add to main.js or import separately:
 *   import './design-system-enhancements.js'
 */

/* ─────────────────────────────────────────────
   1. Cursor glow (desktop / fine pointer only)
   ─────────────────────────────────────────────  */
function initCursorGlow() {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const glow = document.createElement('div');
    glow.className = 'ds-cursor-glow';
    document.body.appendChild(glow);

    let rx = 0, ry = 0; // rendered position
    let tx = 0, ty = 0; // target position
    let raf = null;

    document.addEventListener('mousemove', (e) => {
        tx = e.clientX;
        ty = e.clientY;
        if (!raf) raf = requestAnimationFrame(updateGlow);
    }, { passive: true });

    function updateGlow() {
        // Smooth lerp so the glow lags slightly behind cursor
        rx += (tx - rx) * 0.08;
        ry += (ty - ry) * 0.08;
        glow.style.left = rx + 'px';
        glow.style.top = ry + 'px';
        raf = requestAnimationFrame(updateGlow);
    }

    // Fade out on idle
    let idleTimer;
    document.addEventListener('mousemove', () => {
        glow.style.opacity = '1';
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => { glow.style.opacity = '0'; }, 3000);
    }, { passive: true });
}

/* ─────────────────────────────────────────────
   2. Project card image hover zoom
   ─────────────────────────────────────────────  */
function initProjectCardHover() {
    document.querySelectorAll('.glass-card, article.glass-card').forEach((card) => {
        const img = card.querySelector('.project-image, img');
        if (!img) return;

        card.addEventListener('mouseenter', () => {
            img.style.transform = 'scale(1.06)';
            img.style.filter = 'brightness(0.95) saturate(1.3)';
            const title = card.querySelector('.project-title, h3');
            if (title) title.style.color = 'var(--c-violet-hi, #a78bfa)';
        }, { passive: true });

        card.addEventListener('mouseleave', () => {
            img.style.transform = 'scale(1)';
            img.style.filter = 'brightness(0.85) saturate(1.1)';
            const title = card.querySelector('.project-title, h3');
            if (title) title.style.color = '';
        }, { passive: true });
    });
}

/* ─────────────────────────────────────────────
   3. ds-reveal scroll observer
   Works in parallel with existing scroll-reveal — uses different class names.
   ─────────────────────────────────────────────  */
function initDsReveal() {
    const targets = document.querySelectorAll('.ds-reveal:not([data-ds-observed])');
    if (!targets.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
    );

    targets.forEach((el) => {
        el.setAttribute('data-ds-observed', '1');
        observer.observe(el);
    });
}

/* ─────────────────────────────────────────────
   4. Nav scroll class
   ─────────────────────────────────────────────  */
function initNavScroll() {
    const nav = document.querySelector('header, .ds-nav, nav');
    if (!nav) return;

    let ticking = false;
    const update = () => {
        nav.classList.toggle('scrolled', window.scrollY > 20);
        ticking = false;
    };
    window.addEventListener('scroll', () => {
        if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
}

/* ─────────────────────────────────────────────
   5. Scroll progress bar
   ─────────────────────────────────────────────  */
function initScrollProgress() {
    // Prefer the new design-system class
    let bar = document.querySelector('.ds-scroll-progress');
    if (!bar) {
        bar = document.querySelector('.scroll-progress');
    }
    if (!bar) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (ticking) return;
        requestAnimationFrame(() => {
            const scrolled = window.scrollY;
            const max = document.documentElement.scrollHeight - window.innerHeight;
            bar.style.width = (scrolled / max * 100) + '%';
            ticking = false;
        });
        ticking = true;
    }, { passive: true });
}

/* ─────────────────────────────────────────────
   6. Typed number counter for stats
   ─────────────────────────────────────────────  */
function initStatCounters() {
    const stats = document.querySelectorAll('[data-count]');
    if (!stats.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const target = parseInt(el.dataset.count, 10);
                const suffix = el.dataset.suffix || '';
                const dur = 1200;
                const step = 16;
                const steps = Math.floor(dur / step);
                let current = 0;

                const tick = setInterval(() => {
                    current++;
                    el.textContent = Math.round((target / steps) * current) + suffix;
                    if (current >= steps) {
                        el.textContent = target + suffix;
                        clearInterval(tick);
                    }
                }, step);

                observer.unobserve(el);
            });
        },
        { threshold: 0.5 }
    );

    stats.forEach((el) => observer.observe(el));
}

/* ─────────────────────────────────────────────
   7. Lazy image loader for new cards (data-src)
   ─────────────────────────────────────────────  */
function initLazyImages() {
    const images = document.querySelectorAll('img[data-src]:not([data-lazy-done])');
    if (!images.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const img = entry.target;
                const src = img.dataset.src;
                if (!src) return;

                img.style.filter = 'blur(8px) brightness(0.7)';
                img.style.transition = 'filter 0.5s ease';

                const tmp = new Image();
                tmp.onload = () => {
                    img.src = src;
                    img.style.filter = 'brightness(0.85) saturate(1.1)';
                    img.setAttribute('data-lazy-done', '1');
                };
                tmp.src = src;

                observer.unobserve(img);
            });
        },
        { rootMargin: '100px 0px', threshold: 0.01 }
    );

    images.forEach((img) => observer.observe(img));
}

/* ─────────────────────────────────────────────
   INIT — call once after DOM ready
   ─────────────────────────────────────────────  */
export function initDesignSystemEnhancements() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', _run, { once: true });
    } else {
        _run();
    }
}

function _run() {
    console.log('🎨 Design system enhancements init…');
    initCursorGlow();
    initProjectCardHover();
    initDsReveal();
    initNavScroll();
    initScrollProgress();
    initStatCounters();
    initLazyImages();
    console.log('✅ Design system enhancements ready');
}

export default initDesignSystemEnhancements;