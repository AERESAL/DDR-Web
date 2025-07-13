class GameSelector {
    constructor() {
        this.games = [
            {
                id: 'fnf',
                name: 'Friday Night Funkin\'',
                description: 'Battle opponents in rhythm-based rap battles!',
                icon: '🎵',
                difficulty: '★★★☆☆',
                url: 'https://ninja-muffin24.itch.io/funkin'
            },
            {
                id: 'snake',
                name: 'Snake',
                description: 'Classic arcade game with a rhythmic twist!',
                icon: '🐍',
                difficulty: '★★☆☆☆',
                url: 'https://www.coolmathgames.com/0-snake/play'
            },
            {
                id: 'tetris',
                name: 'Tetris',
                description: 'Stack blocks to the beat of the music!',
                icon: '🧱',
                difficulty: '★★★★☆',
                url: 'https://poki.com/en/g/tetra-blocks'
            },
            {
                id: 'run3',
                name: 'Run 3',
                description: 'Run and jump through space tunnels!',
                icon: '🏃',
                difficulty: '★★★☆☆',
                url: 'https://www.coolmathgames.com/0-run-3/play'
            }
        ];
        
        this.currentIndex = 0;
        this.isAnimating = false;
        
        this.init();
    }
    
    init() {
        this.gameCards = document.querySelectorAll('.game-card');
        this.leftArrow = document.getElementById('leftArrow');
        this.rightArrow = document.getElementById('rightArrow');
        this.playButton = document.getElementById('playButton');
        
        this.setupEventListeners();
        this.updateDisplay();
        
        // Add entrance animation
        setTimeout(() => {
            document.querySelector('.container').style.opacity = '1';
        }, 100);
    }
    
    setupEventListeners() {
        // Arrow button clicks
        this.leftArrow.addEventListener('click', () => this.navigateLeft());
        this.rightArrow.addEventListener('click', () => this.navigateRight());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.navigateLeft();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.navigateRight();
                    break;
                case 'Enter':
                    e.preventDefault();
                    this.selectGame();
                    break;
            }
        });
        
        // Play button click
        this.playButton.addEventListener('click', () => this.selectGame());
        
        // Game card click
        this.gameCards.forEach((card, index) => {
            card.addEventListener('click', () => {
                if (index === this.currentIndex) {
                    this.selectGame();
                } else {
                    this.currentIndex = index;
                    this.updateDisplay();
                }
            });
        });
        
        // Add hover effects to arrows
        this.setupArrowEffects();
    }
    
    setupArrowEffects() {
        [this.leftArrow, this.rightArrow].forEach(arrow => {
            arrow.addEventListener('mouseenter', () => {
                arrow.style.transform = 'scale(1.1)';
            });
            
            arrow.addEventListener('mouseleave', () => {
                arrow.style.transform = 'scale(1)';
            });
        });
    }
    
    navigateLeft() {
        if (this.isAnimating) return;
        
        this.currentIndex = (this.currentIndex - 1 + this.games.length) % this.games.length;
        this.updateDisplay();
        this.addNavigationEffect('left');
    }
    
    navigateRight() {
        if (this.isAnimating) return;
        
        this.currentIndex = (this.currentIndex + 1) % this.games.length;
        this.updateDisplay();
        this.addNavigationEffect('right');
    }
    
    updateDisplay() {
        this.isAnimating = true;
        
        // Remove active class from all cards
        this.gameCards.forEach(card => {
            card.classList.remove('active');
        });
        
        // Add active class to current card
        setTimeout(() => {
            this.gameCards[this.currentIndex].classList.add('active');
            this.isAnimating = false;
        }, 100);
        
        // Update play button text
        const currentGame = this.games[this.currentIndex];
        this.playButton.querySelector('.play-text').textContent = `PLAY ${currentGame.name.toUpperCase()}`;
        
        // Add pulse effect to current game icon
        const activeIcon = this.gameCards[this.currentIndex].querySelector('.game-icon');
        activeIcon.style.animation = 'none';
        setTimeout(() => {
            activeIcon.style.animation = 'bounce 2s infinite';
        }, 10);
    }
    
    addNavigationEffect(direction) {
        const arrow = direction === 'left' ? this.leftArrow : this.rightArrow;
        
        // Add click effect
        arrow.style.transform = 'scale(0.95)';
        arrow.style.background = 'rgba(78, 205, 196, 0.3)';
        
        setTimeout(() => {
            arrow.style.transform = 'scale(1)';
            arrow.style.background = 'rgba(255, 255, 255, 0.1)';
        }, 150);
        
        // Add sound effect (if audio is available)
        this.playNavigationSound();
    }
    
    playNavigationSound() {
        // Create a simple beep sound using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (e) {
            // Audio not supported or blocked
        }
    }
    
    selectGame() {
        const currentGame = this.games[this.currentIndex];
        
        // Add selection animation
        this.playButton.style.transform = 'scale(0.95)';
        this.gameCards[this.currentIndex].style.transform = 'scale(1.05)';
        
        // Play selection sound
        this.playSelectionSound();
        
        setTimeout(() => {
            this.playButton.style.transform = 'scale(1)';
            this.gameCards[this.currentIndex].style.transform = 'scale(1)';
            
            // Show loading screen and redirect
            this.showLoadingScreen(currentGame);
        }, 200);
    }
    
    playSelectionSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(1200, audioContext.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (e) {
            // Audio not supported or blocked
        }
    }
    
    showLoadingScreen(game) {
        // Create loading overlay
        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'loading-overlay';
        loadingOverlay.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <h2>Loading ${game.name}...</h2>
                <p>Get ready to feel the rhythm!</p>
                <div class="loading-bar">
                    <div class="loading-progress"></div>
                </div>
            </div>
        `;
        
        // Add loading styles
        const loadingStyles = `
            .loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
                animation: fadeIn 0.5s ease;
            }
            
            .loading-content {
                text-align: center;
                color: white;
            }
            
            .loading-spinner {
                width: 80px;
                height: 80px;
                border: 4px solid rgba(78, 205, 196, 0.3);
                border-left: 4px solid #4ecdc4;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 2rem;
            }
            
            .loading-bar {
                width: 300px;
                height: 6px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 3px;
                margin: 2rem auto;
                overflow: hidden;
            }
            
            .loading-progress {
                height: 100%;
                background: linear-gradient(90deg, #ff6b6b, #4ecdc4);
                border-radius: 3px;
                animation: loadingProgress 3s ease-in-out;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            @keyframes loadingProgress {
                0% { width: 0%; }
                100% { width: 100%; }
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = loadingStyles;
        document.head.appendChild(styleSheet);
        
        document.body.appendChild(loadingOverlay);
        
        // Simulate loading and redirect
        setTimeout(() => {
            // Redirect to the actual game URL
            if (game.url) {
                window.open(game.url, '_blank');
            } else {
                alert(`Launching ${game.name}!\n\n${game.description}\n\nDifficulty: ${game.difficulty}\n\nNote: Game URL not available.`);
            }
            document.body.removeChild(loadingOverlay);
        }, 3000);
    }
}

// Initialize the game selector when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new GameSelector();
});

// Add some extra visual effects
document.addEventListener('DOMContentLoaded', () => {
    // Create floating particles
    createFloatingParticles();
    
    // Add mouse follow effect
    addMouseFollowEffect();
});

function createFloatingParticles() {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particles';
    particleContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 2;
    `;
    
    document.body.appendChild(particleContainer);
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createParticle(particleContainer);
        }, i * 200);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: rgba(78, 205, 196, 0.6);
        border-radius: 50%;
        pointer-events: none;
    `;
    
    const startX = Math.random() * window.innerWidth;
    const startY = window.innerHeight + 10;
    const endY = -10;
    const duration = 10000 + Math.random() * 5000;
    
    particle.style.left = startX + 'px';
    particle.style.top = startY + 'px';
    
    container.appendChild(particle);
    
    particle.animate([
        { transform: `translate(0, 0) scale(0)`, opacity: 0 },
        { transform: `translate(0, -100px) scale(1)`, opacity: 1, offset: 0.1 },
        { transform: `translate(0, ${endY - startY}px) scale(0)`, opacity: 0 }
    ], {
        duration: duration,
        easing: 'linear'
    }).addEventListener('finish', () => {
        container.removeChild(particle);
        // Create a new particle to replace this one
        setTimeout(() => createParticle(container), Math.random() * 2000);
    });
}

function addMouseFollowEffect() {
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Create subtle glow effect that follows mouse
        const glow = document.createElement('div');
        glow.style.cssText = `
            position: fixed;
            top: ${mouseY}px;
            left: ${mouseX}px;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, rgba(78, 205, 196, 0.3) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 3;
            animation: fadeOut 1s ease-out forwards;
            transform: translate(-50%, -50%);
        `;
        
        document.body.appendChild(glow);
        
        setTimeout(() => {
            if (glow.parentNode) {
                glow.parentNode.removeChild(glow);
            }
        }, 1000);
    });
}
