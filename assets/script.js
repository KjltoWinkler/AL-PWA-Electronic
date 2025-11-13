// PWA Electronic Presentation JavaScript
class PresentationController {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 12;
        this.isAnimating = false;
        
        this.init();
    }
    
    init() {
        this.updateSlideIndicator();
        this.setupKeyboardNavigation();
        this.setupTouchNavigation();
        this.setupAutoplay();
        this.addClickHandlersToTOC();
        this.preloadSlides();
    }
    
    updateSlideIndicator() {
        document.getElementById('current-slide').textContent = this.currentSlide;
        document.getElementById('total-slides').textContent = this.totalSlides;
        
        // Update navigation buttons
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        
        prevBtn.disabled = this.currentSlide === 1;
        nextBtn.disabled = this.currentSlide === this.totalSlides;
        
        // Update dots
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.classList.toggle('active', index + 1 === this.currentSlide);
        });
    }
    
    goToSlide(slideNumber) {
        if (this.isAnimating || slideNumber === this.currentSlide || 
            slideNumber < 1 || slideNumber > this.totalSlides) {
            return;
        }
        
        this.isAnimating = true;
        const currentSlideEl = document.getElementById(`slide-${this.currentSlide}`);
        const targetSlideEl = document.getElementById(`slide-${slideNumber}`);
        
        // Determine animation direction
        const direction = slideNumber > this.currentSlide ? 'next' : 'prev';
        
        // Hide current slide
        currentSlideEl.classList.add(direction);
        currentSlideEl.classList.remove('active');
        
        // Show new slide after a brief delay
        setTimeout(() => {
            currentSlideEl.style.display = 'none';
            currentSlideEl.classList.remove(direction);
            
            targetSlideEl.style.display = 'flex';
            targetSlideEl.classList.add('active');
            
            this.currentSlide = slideNumber;
            this.updateSlideIndicator();
            this.triggerSlideAnimations(slideNumber);
            
            setTimeout(() => {
                this.isAnimating = false;
            }, 300);
        }, 200);
    }
    
    nextSlide() {
        if (this.currentSlide < this.totalSlides) {
            this.goToSlide(this.currentSlide + 1);
        }
    }
    
    previousSlide() {
        if (this.currentSlide > 1) {
            this.goToSlide(this.currentSlide - 1);
        }
    }
    
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowRight':
                case ' ':
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.previousSlide();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToSlide(1);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToSlide(this.totalSlides);
                    break;
                case 'Escape':
                    this.toggleFullscreen();
                    break;
            }
        });
    }
    
    setupTouchNavigation() {
        let startX = 0;
        let startY = 0;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // Only trigger if horizontal swipe is dominant
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.nextSlide();
                } else {
                    this.previousSlide();
                }
            }
            
            startX = 0;
            startY = 0;
        });
    }
    
    setupAutoplay() {
        // Optional: Auto-advance slides (disabled by default)
        this.autoplayInterval = null;
        this.autoplayDelay = 10000; // 10 seconds
        
        // Uncomment to enable autoplay
        // this.startAutoplay();
    }
    
    startAutoplay() {
        this.stopAutoplay();
        this.autoplayInterval = setInterval(() => {
            if (this.currentSlide < this.totalSlides) {
                this.nextSlide();
            } else {
                this.goToSlide(1); // Loop back to first slide
            }
        }, this.autoplayDelay);
    }
    
    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
    
    addClickHandlersToTOC() {
        document.querySelectorAll('.toc-item').forEach(item => {
            item.addEventListener('click', () => {
                const slideNumber = parseInt(item.dataset.slide);
                if (slideNumber) {
                    this.goToSlide(slideNumber);
                }
            });
        });
    }
    
    triggerSlideAnimations(slideNumber) {
        const slide = document.getElementById(`slide-${slideNumber}`);
        
        // Reset animations
        slide.querySelectorAll('[data-animate]').forEach(el => {
            el.classList.remove('animated');
        });
        
        // Trigger new animations
        setTimeout(() => {
            slide.querySelectorAll('[data-animate]').forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add('animated');
                }, index * 200);
            });
        }, 100);
        
        // Specific slide animations
        switch(slideNumber) {
            case 1:
                this.animateHeroElements();
                break;
            case 3:
                this.animateCircuitElements();
                break;
            case 4:
                this.animateRequirementCards();
                break;
            case 5:
                this.animateDurationElements();
                break;
        }
    }
    
    animateHeroElements() {
        const icons = document.querySelectorAll('.electronic-animation i');
        icons.forEach((icon, index) => {
            setTimeout(() => {
                icon.style.animationPlayState = 'running';
            }, index * 500);
        });
    }
    
    animateCircuitElements() {
        const components = document.querySelectorAll('.component');
        components.forEach((component, index) => {
            setTimeout(() => {
                component.style.animationPlayState = 'running';
            }, index * 300);
        });
    }
    
    animateRequirementCards() {
        const cards = document.querySelectorAll('.req-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.transform = 'translateY(0)';
                card.style.opacity = '1';
            }, index * 200);
        });
    }
    
    animateDurationElements() {
        const circle = document.querySelector('.duration-circle');
        const options = document.querySelectorAll('.duration-option');
        
        if (circle) {
            circle.style.animationPlayState = 'running';
        }
        
        options.forEach((option, index) => {
            setTimeout(() => {
                option.style.transform = 'translateX(0)';
                option.style.opacity = '1';
            }, index * 300);
        });
    }
    
    preloadSlides() {
        // Preload all slide content for smooth transitions
        for (let i = 1; i <= this.totalSlides; i++) {
            const slide = document.getElementById(`slide-${i}`);
            if (slide) {
                // Force layout calculation
                slide.offsetHeight;
            }
        }
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }
    
    // Progress tracking
    trackProgress() {
        const progress = (this.currentSlide / this.totalSlides) * 100;
        
        // Update progress bar if exists
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
        
        // Store progress in localStorage
        localStorage.setItem('presentation-progress', this.currentSlide);
    }
    
    loadProgress() {
        const savedSlide = localStorage.getItem('presentation-progress');
        if (savedSlide) {
            const slideNumber = parseInt(savedSlide);
            if (slideNumber > 1 && slideNumber <= this.totalSlides) {
                this.goToSlide(slideNumber);
            }
        }
    }
}

// Utility functions for slide interactions
function nextSlide() {
    window.presentation.nextSlide();
}

function previousSlide() {
    window.presentation.previousSlide();
}

function goToSlide(slideNumber) {
    window.presentation.goToSlide(slideNumber);
}

// Enhanced animations
class AnimationController {
    static fadeIn(element, duration = 500) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }
    
    static slideInFromLeft(element, duration = 500) {
        element.style.transform = 'translateX(-100px)';
        element.style.opacity = '0';
        element.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;
        
        requestAnimationFrame(() => {
            element.style.transform = 'translateX(0)';
            element.style.opacity = '1';
        });
    }
    
    static slideInFromRight(element, duration = 500) {
        element.style.transform = 'translateX(100px)';
        element.style.opacity = '0';
        element.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;
        
        requestAnimationFrame(() => {
            element.style.transform = 'translateX(0)';
            element.style.opacity = '1';
        });
    }
    
    static scaleIn(element, duration = 500) {
        element.style.transform = 'scale(0.8)';
        element.style.opacity = '0';
        element.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;
        
        requestAnimationFrame(() => {
            element.style.transform = 'scale(1)';
            element.style.opacity = '1';
        });
    }
    
    static typeWriter(element, text, speed = 50) {
        element.innerHTML = '';
        let i = 0;
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }
}

// Accessibility enhancements
class AccessibilityController {
    static init() {
        // Add ARIA labels
        document.querySelectorAll('.nav-btn').forEach(btn => {
            const direction = btn.classList.contains('prev-btn') ? 'Previous' : 'Next';
            btn.setAttribute('aria-label', `${direction} slide`);
        });
        
        // Add slide landmarks
        document.querySelectorAll('.slide').forEach((slide, index) => {
            slide.setAttribute('role', 'region');
            slide.setAttribute('aria-label', `Slide ${index + 1}`);
        });
        
        // Keyboard focus management
        this.manageFocus();
    }
    
    static manageFocus() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                // Trap focus within current slide
                const currentSlide = document.querySelector('.slide.active');
                const focusableElements = currentSlide.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                
                if (focusableElements.length > 0) {
                    const firstElement = focusableElements[0];
                    const lastElement = focusableElements[focusableElements.length - 1];
                    
                    if (e.shiftKey && document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    } else if (!e.shiftKey && document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
    }
}

// Performance optimization
class PerformanceController {
    static init() {
        // Lazy load content
        this.lazyLoadImages();
        
        // Optimize animations for low-end devices
        this.optimizeAnimations();
        
        // Preload critical resources
        this.preloadResources();
    }
    
    static lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    static optimizeAnimations() {
        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            document.body.classList.add('reduced-motion');
        }
        
        // Monitor performance
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                this.monitorPerformance();
            });
        }
    }
    
    static preloadResources() {
        const criticalResources = [
            'assets/style.css',
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
        ];
        
        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = resource.endsWith('.css') ? 'style' : 'font';
            if (link.as === 'font') {
                link.crossOrigin = 'anonymous';
            }
            document.head.appendChild(link);
        });
    }
    
    static monitorPerformance() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach(entry => {
                    if (entry.duration > 16) { // Frame rate threshold
                        console.warn('Performance issue detected:', entry);
                    }
                });
            });
            
            observer.observe({ entryTypes: ['measure'] });
        }
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main presentation controller
    window.presentation = new PresentationController();
    
    // Initialize additional controllers
    AccessibilityController.init();
    PerformanceController.init();
    
    // Load saved progress
    window.presentation.loadProgress();
    
    console.log('PWA Electronic Presentation initialized successfully!');
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        PresentationController, 
        AnimationController, 
        AccessibilityController, 
        PerformanceController 
    };
}