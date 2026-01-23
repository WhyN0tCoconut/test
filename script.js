document.addEventListener("DOMContentLoaded", () => {
    const startBtn = document.getElementById("startBtn");
    const music = document.getElementById("bgMusic");

    // =========================
    // Start Button & Audio
    // =========================
    if (startBtn && music) {
        startBtn.addEventListener("click", () => {
            startBtn.style.display = "none";

            // Scroll to gallery smoothly
            document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" });

            // Play audio (mobile-friendly)
            music.currentTime = 0;
            music.volume = 0.8;
            music.play().catch(err => console.log("Audio blocked:", err));
        });
    }

    // =========================
    // Initial Animations
    // =========================
    createParticles();
    initializeAnimation();
    setupScrollAnimations();
    setupPhotoCaptionAnimations();

    // =========================
    // Floating Particles
    // =========================
    function createParticles() {
        const particles = document.getElementById('particles');
        if (!particles) return;

        const particleEmojis = ['❤️', '❤️‍🩹', '💝', '💍', '🎉', '🦋','✨', '🌸', '💞'];

        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.innerHTML = particleEmojis[Math.floor(Math.random() * particleEmojis.length)];

            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDuration = (Math.random() * 3 + 4) + 's';
            particle.style.animationDelay = Math.random() * 2 + 's';

            particles.appendChild(particle);
        }
    }

    // =========================
    // Fade-in Animation Initialization
    // =========================
    function initializeAnimation() {
        const fadeElements = document.querySelectorAll('.fade-in');
        fadeElements.forEach((el, index) => {
            el.style.animationDelay = (index * 0.2) + 's';
        });
    }

    // =========================
    // Photo Caption Animations
    // =========================
    function setupPhotoCaptionAnimations() {
        const photoCards = document.querySelectorAll('.photo-card');

        photoCards.forEach(card => {
            const overlay = card.querySelector('.photo-overlay');
            const caption = card.querySelector('.photo-caption');

            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        overlay?.classList.add('aos-animate-caption');
                        caption?.classList.add('aos-animate');
                    }
                });
            }, { threshold: 0.2, rootMargin: "0px 0px -50px 0px" });

            if (overlay) observer.observe(overlay);
        });
    }

    // =========================
    // Scroll Animations
    // =========================
    function setupScrollAnimations() {
        const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-animate');

                    if (entry.target.classList.contains('message-card')) {
                        animateMessageText();
                    }
                }
            });
        }, observerOptions);

        const elementsToObserve = document.querySelectorAll('[data-aos], .section-title, .message-card');
        elementsToObserve.forEach(element => {
            observer.observe(element);

            const delay = element.getAttribute('data-delay');
            if (delay) element.style.transitionDelay = delay + 'ms';
        });
    }

    // =========================
    // Animate Message Text
    // =========================
    function animateMessageText() {
        const messageTexts = document.querySelectorAll('.message-text');
        messageTexts.forEach((text, index) => {
            setTimeout(() => {
                text.classList.add('fade-in-animate');
            }, index * 500);
        });
    }

    // =========================
    // Like Button & Floating Heart
    // =========================
    function toggleLike(button) {
        const heartIcon = button.querySelector('.heart-icon');
        button.classList.toggle('liked');

        if (button.classList.contains('liked')) {
            heartIcon.textContent = '❤️';
            createFloatingHeart(button);
        } else {
            heartIcon.textContent = '🤍';
        }
    }

    function createFloatingHeart(button) {
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.style.position = 'absolute';
        heart.style.fontSize = '1.5rem';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '1000';

        const rect = button.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        heart.style.left = rect.left + scrollLeft + 'px';
        heart.style.top = rect.top + scrollTop + 'px';

        document.body.appendChild(heart);

        heart.animate([
            { transform: 'translateY(0px) scale(1)', opacity: 1 },
            { transform: 'translateY(-60px) scale(1.5)', opacity: 0 }
        ], { duration: 1500, easing: 'ease-out' })
        .onfinish = () => document.body.removeChild(heart);
    }

    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.addEventListener('click', () => toggleLike(btn));
    });

    // =========================
    // Parallax & Particle Scroll
    // =========================
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) hero.style.transform = `translateY(${scrolled * 0.5}px)`;

        document.querySelectorAll('.particle').forEach((particle, index) => {
            const speed = 0.2 + (index % 3) * 0.1;
            particle.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // =========================
    // Mouse & Touch Movement for Floating Hearts
    // =========================
    function moveFloatingHearts(xRatio, yRatio) {
        const moveX = (xRatio - 0.5) * 20;
        const moveY = (yRatio - 0.5) * 20;
        const floatingHearts = document.querySelector('.floating-hearts');
        if (floatingHearts) floatingHearts.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }

    document.addEventListener('mousemove', e => moveFloatingHearts(e.clientX / window.innerWidth, e.clientY / window.innerHeight));
    document.addEventListener('touchmove', e => {
        const touch = e.touches[0];
        moveFloatingHearts(touch.clientX / window.innerWidth, touch.clientY / window.innerHeight);
    });

    // =========================
    // Button Ripple Effect
    // =========================
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });

    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to { transform: scale(2); opacity: 0; }
        }
        @keyframes photoEnter {
            from { transform: scale(0.8) rotate(-5deg); opacity: 0; }
            to { transform: scale(1) rotate(0deg); opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    // =========================
    // Photo Enter Animation
    // =========================
    const photoObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target.querySelector('img');
                if (img) img.style.animation = 'photoEnter 0.8s ease-out forwards';
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.photo-card').forEach(card => photoObserver.observe(card));
});
