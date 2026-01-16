/* ============================================
   MELODIA INÉDITA - MAIN JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    LoadingScreen.init();
    Navigation.init();
    ScrollEffects.init();
    AudioPlayer.init();
    PortfolioFilter.init();
    FAQ.init();
    BackToTop.init();
    Animations.init();
});

/* ============================================
   LOADING SCREEN
   ============================================ */
const LoadingScreen = {
    init() {
        const loadingScreen = document.getElementById('loading-screen');

        window.addEventListener('load', () => {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                document.body.style.overflow = 'visible';
            }, 1000);
        });
    }
};

/* ============================================
   NAVIGATION
   ============================================ */
const Navigation = {
    init() {
        this.header = document.getElementById('header');
        this.hamburger = document.getElementById('hamburger');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');

        this.bindEvents();
    },

    bindEvents() {
        // Hamburger menu toggle
        if (this.hamburger) {
            this.hamburger.addEventListener('click', () => this.toggleMenu());
        }

        // Close menu on link click
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        // Scroll event for header
        window.addEventListener('scroll', () => this.handleScroll());

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (!this.hamburger.contains(e.target) && !this.navMenu.contains(e.target)) {
                this.closeMenu();
            }
        });
    },

    toggleMenu() {
        this.hamburger.classList.toggle('active');
        this.navMenu.classList.toggle('active');
    },

    closeMenu() {
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
    },

    handleScroll() {
        if (window.scrollY > 100) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }
    }
};

/* ============================================
   SCROLL EFFECTS
   ============================================ */
const ScrollEffects = {
    init() {
        this.smoothScroll();
    },

    smoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));

                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
};

/* ============================================
   AUDIO PLAYER
   ============================================ */
const AudioPlayer = {
    currentAudio: null,
    currentButton: null,

    init() {
        this.initHeroPlayer();
        this.initPortfolioPlayers();
    },

    initHeroPlayer() {
        const playBtn = document.getElementById('hero-play-btn');
        const audio = document.getElementById('hero-audio');
        const progress = document.getElementById('hero-progress');
        const currentTime = document.getElementById('hero-current');
        const duration = document.getElementById('hero-duration');
        const progressBar = document.querySelector('#hero-player .progress-bar');

        if (!playBtn || !audio) return;

        playBtn.addEventListener('click', () => {
            this.togglePlay(audio, playBtn);
        });

        audio.addEventListener('loadedmetadata', () => {
            duration.textContent = this.formatTime(audio.duration);
        });

        audio.addEventListener('timeupdate', () => {
            const percent = (audio.currentTime / audio.duration) * 100;
            progress.style.width = percent + '%';
            currentTime.textContent = this.formatTime(audio.currentTime);
        });

        audio.addEventListener('ended', () => {
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
            progress.style.width = '0%';
            currentTime.textContent = '0:00';
        });

        if (progressBar) {
            progressBar.addEventListener('click', (e) => {
                const rect = progressBar.getBoundingClientRect();
                const percent = (e.clientX - rect.left) / rect.width;
                audio.currentTime = percent * audio.duration;
            });
        }
    },

    initPortfolioPlayers() {
        const playButtons = document.querySelectorAll('.portfolio-play');

        playButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const audioSrc = btn.dataset.audio;
                this.playPortfolioAudio(audioSrc, btn);
            });
        });
    },

    playPortfolioAudio(src, button) {
        // Stop current audio if playing
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
            if (this.currentButton) {
                this.currentButton.innerHTML = '<i class="fas fa-play"></i>';
            }
        }

        // If clicking same button, just stop
        if (this.currentButton === button) {
            this.currentAudio = null;
            this.currentButton = null;
            return;
        }

        // Create new audio
        const audio = new Audio(src);
        this.currentAudio = audio;
        this.currentButton = button;

        audio.play().then(() => {
            button.innerHTML = '<i class="fas fa-pause"></i>';
        }).catch(err => {
            console.log('Audio playback failed:', err);
        });

        audio.addEventListener('ended', () => {
            button.innerHTML = '<i class="fas fa-play"></i>';
            this.currentAudio = null;
            this.currentButton = null;
        });
    },

    togglePlay(audio, button) {
        if (audio.paused) {
            // Stop other audio
            if (this.currentAudio && this.currentAudio !== audio) {
                this.currentAudio.pause();
                this.currentAudio.currentTime = 0;
                if (this.currentButton) {
                    this.currentButton.innerHTML = '<i class="fas fa-play"></i>';
                }
            }

            audio.play().then(() => {
                button.innerHTML = '<i class="fas fa-pause"></i>';
                this.currentAudio = audio;
                this.currentButton = button;
            }).catch(err => {
                console.log('Audio playback failed:', err);
            });
        } else {
            audio.pause();
            button.innerHTML = '<i class="fas fa-play"></i>';
        }
    },

    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
};

/* ============================================
   PORTFOLIO FILTER
   ============================================ */
const PortfolioFilter = {
    init() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.portfolioItems = document.querySelectorAll('.portfolio-item');

        this.bindEvents();
    },

    bindEvents() {
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                this.filterItems(filter);
                this.updateActiveButton(btn);
            });
        });
    },

    filterItems(filter) {
        this.portfolioItems.forEach(item => {
            const category = item.dataset.category;

            if (filter === 'all' || category === filter) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 10);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    },

    updateActiveButton(activeBtn) {
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
    }
};

/* ============================================
   FAQ ACCORDION
   ============================================ */
const FAQ = {
    init() {
        this.faqItems = document.querySelectorAll('.faq-item');
        this.bindEvents();
    },

    bindEvents() {
        this.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');

            question.addEventListener('click', () => {
                this.toggleItem(item);
            });
        });
    },

    toggleItem(item) {
        const isActive = item.classList.contains('active');

        // Close all items
        this.faqItems.forEach(faqItem => {
            faqItem.classList.remove('active');
        });

        // Open clicked item if it wasn't active
        if (!isActive) {
            item.classList.add('active');
        }
    }
};

/* ============================================
   BACK TO TOP BUTTON
   ============================================ */
const BackToTop = {
    init() {
        this.button = document.getElementById('back-to-top');

        if (!this.button) return;

        this.bindEvents();
    },

    bindEvents() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                this.button.classList.add('visible');
            } else {
                this.button.classList.remove('visible');
            }
        });

        this.button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
};

/* ============================================
   ANIMATIONS ON SCROLL
   ============================================ */
const Animations = {
    init() {
        this.animatedElements = document.querySelectorAll(
            '.service-card, .step-card, .portfolio-card, .testimonial-card, .faq-item'
        );

        this.observeElements();
    },

    observeElements() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        this.animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
};

// Add animation class styles
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

/* ============================================
   FORM VALIDATION (Future Implementation)
   ============================================ */
const FormValidation = {
    init() {
        // Placeholder for future form implementation
    }
};

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */
const Utils = {
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};
