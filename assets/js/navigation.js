class Nav {
    constructor() {
        this.curr = 1;
        this.total = 15;
        this.animating = false;
        this.setup();
    }
    
    setup() {
        this.updateUI();
        this.bindKeys();
        this.bindTouch();
        this.bindClicks();
    }
    
    updateUI() {
        document.getElementById('current-slide').textContent = this.curr;
        document.getElementById('total-slides').textContent = this.total;
        
        // Update progress bar
        const progressCurrent = document.getElementById('progress-current');
        const progressBarFill = document.getElementById('progressBarFill');
        const progressPercentage = document.getElementById('progressPercentage');
        
        if (progressCurrent) progressCurrent.textContent = this.curr;
        if (progressBarFill) {
            const percentage = (this.curr / this.total) * 100;
            progressBarFill.style.width = percentage + '%';
        }
        if (progressPercentage) {
            const percentage = Math.round((this.curr / this.total) * 100);
            progressPercentage.textContent = percentage + '%';
        }
        
        const prev = document.querySelector('.prev-btn');
        const next = document.querySelector('.next-btn');
        
        prev.disabled = this.curr === 1;
        next.disabled = this.curr === this.total;
        
        document.querySelectorAll('.dot').forEach((dot, i) => {
            dot.classList.toggle('active', i + 1 === this.curr);
        });
    }
    
    go(n) {
        if (this.animating || n === this.curr || n < 1 || n > this.total) return;
        
        this.animating = true;
        const current = document.getElementById(`slide-${this.curr}`);
        const target = document.getElementById(`slide-${n}`);
        
        const isNext = n > this.curr;
        
        // Exit animation für aktuelle Slide
        current.classList.add(isNext ? 'exit-right' : 'exit-left');
        
        setTimeout(() => {
            current.classList.remove('active', 'exit-right', 'exit-left');
            
            // Enter animation für neue Slide
            target.classList.add('active');
            target.classList.add(isNext ? 'from-right' : 'from-left');
            
            setTimeout(() => {
                target.classList.remove('from-left', 'from-right');
            }, 600);
            
            this.curr = n;
            this.updateUI();
            this.animate(n);
            
            setTimeout(() => {
                this.animating = false;
            }, 600);
        }, 500);
    }
    
    next() {
        if (this.curr < this.total) this.go(this.curr + 1);
    }
    
    prev() {
        if (this.curr > 1) this.go(this.curr - 1);
    }
    
    bindKeys() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowRight':
                case ' ':
                    e.preventDefault();
                    this.next();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.prev();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.go(1);
                    break;
                case 'End':
                    e.preventDefault();
                    this.go(this.total);
                    break;
                case 'Escape':
                    this.toggleFS();
                    break;
            }
        });
    }
    
    bindTouch() {
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
            
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.next();
                } else {
                    this.prev();
                }
            }
            
            startX = 0;
            startY = 0;
        });
    }
    
    bindClicks() {
        document.querySelectorAll('.toc-item').forEach(item => {
            item.addEventListener('click', () => {
                const n = parseInt(item.dataset.slide);
                if (n) this.go(n);
            });
        });
    }
    
    animate(n) {
        const slide = document.getElementById(`slide-${n}`);
        
        slide.querySelectorAll('[data-animate]').forEach(el => {
            el.classList.remove('animated');
        });
        
        setTimeout(() => {
            slide.querySelectorAll('[data-animate]').forEach((el, i) => {
                setTimeout(() => {
                    el.classList.add('animated');
                }, i * 200);
            });
        }, 100);
        
        switch(n) {
            case 1:
                this.animHero();
                break;
            case 3:
                this.animCircuit();
                break;
            case 4:
                this.animCards();
                break;
            case 5:
                this.animDuration();
                break;
        }
    }
    
    animHero() {
        const icons = document.querySelectorAll('.electronic-animation i');
        icons.forEach((icon, i) => {
            setTimeout(() => {
                icon.style.animationPlayState = 'running';
            }, i * 500);
        });
    }
    
    animCircuit() {
        const comps = document.querySelectorAll('.component');
        comps.forEach((comp, i) => {
            setTimeout(() => {
                comp.style.animationPlayState = 'running';
            }, i * 300);
        });
    }
    
    animCards() {
        const cards = document.querySelectorAll('.req-card');
        cards.forEach((card, i) => {
            setTimeout(() => {
                card.style.transform = 'translateY(0)';
                card.style.opacity = '1';
            }, i * 200);
        });
    }
    
    animDuration() {
        const circle = document.querySelector('.duration-circle');
        const opts = document.querySelectorAll('.duration-option');
        
        if (circle) circle.style.animationPlayState = 'running';
        
        opts.forEach((opt, i) => {
            setTimeout(() => {
                opt.style.transform = 'translateX(0)';
                opt.style.opacity = '1';
            }, i * 300);
        });
    }
    
    toggleFS() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(err.message);
            });
        } else {
            document.exitFullscreen();
        }
    }
}

function nextSlide() {
    window.nav.next();
}

function previousSlide() {
    window.nav.prev();
}

function goToSlide(n) {
    window.nav.go(n);
}

function openWebsite() {
    window.open('https://kjltowinkler.info', '_blank');
}

document.addEventListener('DOMContentLoaded', () => {
    window.nav = new Nav();
});