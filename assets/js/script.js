class PresentationController {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupAnimations();
        this.preloadContent();
        this.bindEvents();
    }
    
    setupAnimations() {
        this.observers = new Map();
        this.createObservers();
    }
    
    createObservers() {
        const config = { threshold: 0.1, rootMargin: '50px' };
        
        this.observers.set('fade', new IntersectionObserver(this.handleFade, config));
        this.observers.set('slide', new IntersectionObserver(this.handleSlide, config));
        this.observers.set('scale', new IntersectionObserver(this.handleScale, config));
        
        this.bindObservers();
    }
    
    bindObservers() {
        document.querySelectorAll('[data-anim="fade"]').forEach(el => {
            this.observers.get('fade').observe(el);
        });
        
        document.querySelectorAll('[data-anim="slide"]').forEach(el => {
            this.observers.get('slide').observe(el);
        });
        
        document.querySelectorAll('[data-anim="scale"]').forEach(el => {
            this.observers.get('scale').observe(el);
        });
    }
    
    handleFade(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }
    
    handleSlide(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const dir = entry.target.dataset.dir || 'left';
                entry.target.style.transform = 'translateX(0)';
                entry.target.style.opacity = '1';
            }
        });
    }
    
    handleScale(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.transform = 'scale(1)';
                entry.target.style.opacity = '1';
            }
        });
    }
    
    preloadContent() {
        const slides = document.querySelectorAll('.slide');
        slides.forEach(slide => {
            slide.offsetHeight;
        });
    }
    
    bindEvents() {
        this.bindPerformance();
        this.bindAccessibility();
        this.bindVisibility();
    }
    
    bindPerformance() {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                this.optimizePerformance();
            });
        }
    }
    
    bindAccessibility() {
        document.addEventListener('keydown', this.handleA11yKeys);
        this.setupFocusTrap();
    }
    
    handleA11yKeys(e) {
        if (e.key === 'Tab') {
            const current = document.querySelector('.slide.active');
            const focusable = current.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            
            if (focusable.length > 0) {
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        }
    }
    
    setupFocusTrap() {
        document.querySelectorAll('.slide').forEach((slide, i) => {
            slide.setAttribute('role', 'region');
            slide.setAttribute('aria-label', `Slide ${i + 1}`);
        });
    }
    
    bindVisibility() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAnimations();
            } else {
                this.resumeAnimations();
            }
        });
    }
    
    pauseAnimations() {
        document.querySelectorAll('[data-anim]').forEach(el => {
            el.style.animationPlayState = 'paused';
        });
    }
    
    resumeAnimations() {
        document.querySelectorAll('[data-anim]').forEach(el => {
            el.style.animationPlayState = 'running';
        });
    }
    
    optimizePerformance() {
        if (window.devicePixelRatio > 1.5) {
            document.body.classList.add('high-dpi');
        }
        
        const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)');
        if (prefersReduced.matches) {
            document.body.classList.add('reduced-motion');
        }
    }
}

class AnimUtils {
    static fade(el, dur = 500) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity ${dur}ms ease, transform ${dur}ms ease`;
        
        requestAnimationFrame(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
    }
    
    static slideL(el, dur = 500) {
        el.style.transform = 'translateX(-100px)';
        el.style.opacity = '0';
        el.style.transition = `transform ${dur}ms ease, opacity ${dur}ms ease`;
        
        requestAnimationFrame(() => {
            el.style.transform = 'translateX(0)';
            el.style.opacity = '1';
        });
    }
    
    static slideR(el, dur = 500) {
        el.style.transform = 'translateX(100px)';
        el.style.opacity = '0';
        el.style.transition = `transform ${dur}ms ease, opacity ${dur}ms ease`;
        
        requestAnimationFrame(() => {
            el.style.transform = 'translateX(0)';
            el.style.opacity = '1';
        });
    }
    
    static scale(el, dur = 500) {
        el.style.transform = 'scale(0.8)';
        el.style.opacity = '0';
        el.style.transition = `transform ${dur}ms ease, opacity ${dur}ms ease`;
        
        requestAnimationFrame(() => {
            el.style.transform = 'scale(1)';
            el.style.opacity = '1';
        });
    }
    
    static type(el, txt, spd = 50) {
        el.innerHTML = '';
        let i = 0;
        
        function t() {
            if (i < txt.length) {
                el.innerHTML += txt.charAt(i);
                i++;
                setTimeout(t, spd);
            }
        }
        
        t();
    }
}

class OptController {
    static init() {
        this.lazy();
        this.perf();
        this.preload();
    }
    
    static lazy() {
        const imgs = document.querySelectorAll('img[data-src]');
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    obs.unobserve(img);
                }
            });
        });
        
        imgs.forEach(img => obs.observe(img));
    }
    
    static perf() {
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (reduced.matches) {
            document.body.classList.add('reduced-motion');
        }
        
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                this.monitor();
            });
        }
    }
    
    static preload() {
        const res = [
            'assets/style.css',
            'assets/nav.css'
        ];
        
        res.forEach(resource => {
            const lnk = document.createElement('link');
            lnk.rel = 'preload';
            lnk.href = resource;
            lnk.as = 'style';
            document.head.appendChild(lnk);
        });
    }
    
    static monitor() {
        if ('PerformanceObserver' in window) {
            const obs = new PerformanceObserver((list) => {
                list.getEntries().forEach(entry => {
                    if (entry.duration > 16) {
                        console.warn('Perf issue:', entry.name);
                    }
                });
            });
            
            obs.observe({ entryTypes: ['measure'] });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.presentation = new PresentationController();
    OptController.init();
});