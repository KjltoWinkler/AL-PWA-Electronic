class FullscreenManager {
    constructor() {
        this.copyrightBox = document.getElementById('copyrightBox');
        this.fullscreenIcon = document.getElementById('fullscreenIcon');
        this.isFullscreen = false;
        
        this.init();
    }
    
    init() {
        // Event Listener für Copyright Box
        this.copyrightBox.addEventListener('click', () => this.toggleFullscreen());
        
        // Event Listener für Fullscreen-Änderungen
        document.addEventListener('fullscreenchange', () => this.onFullscreenChange());
        document.addEventListener('webkitfullscreenchange', () => this.onFullscreenChange());
        document.addEventListener('mozfullscreenchange', () => this.onFullscreenChange());
        document.addEventListener('MSFullscreenChange', () => this.onFullscreenChange());
        
        // Keyboard shortcut (F11 alternative)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F11') {
                e.preventDefault();
                this.toggleFullscreen();
            }
        });
    }
    
    toggleFullscreen() {
        if (!this.isFullscreen) {
            this.enterFullscreen();
        } else {
            this.exitFullscreen();
        }
    }
    
    enterFullscreen() {
        const element = document.documentElement;
        
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    }
    
    exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
    
    onFullscreenChange() {
        this.isFullscreen = !!(
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement
        );
        
        this.updateIcon();
        this.updateTitle();
    }
    
    updateIcon() {
        if (this.isFullscreen) {
            this.fullscreenIcon.className = 'fas fa-compress fullscreen-icon';
        } else {
            this.fullscreenIcon.className = 'fas fa-expand fullscreen-icon';
        }
    }
    
    updateTitle() {
        if (this.isFullscreen) {
            this.copyrightBox.title = 'Vollbildmodus verlassen';
        } else {
            this.copyrightBox.title = 'Vollbildmodus aktivieren';
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FullscreenManager();
});