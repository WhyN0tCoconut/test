document.addEventListener("DOMContentLoaded", () => {
    const startBtn = document.getElementById("startBtn");
    const music = document.getElementById("bgMusic");

    // ---------- START BUTTON + MUSIC (MOBILE SAFE) ----------
    if (startBtn && music) {
        startBtn.addEventListener("click", () => {
            music.muted = false;
            music.volume = 1;
            music.currentTime = 0;

            const playPromise = music.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => console.log("Music started successfully"))
                    .catch(err => console.log("Audio blocked on mobile:", err));
            }

            document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" });
            startBtn.style.display = "none";
        }, { once: true });
    }

    // ---------- INITIALIZERS ----------
    createParticles();
    initializeAnimation();
    setupScrollAnimations();
    setupPhotoCaptionAnimations();
});

// =========================
// Floating Particles
// =========================
function createParticles() {
    const particles = document.getElementById('particles');
    if (!particles) return;

    const particleEmojis = ['❤️','❤️‍🩹','💝','💍','🎉','🦋','✨','🌸','💞'];

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
// Fade/typewriter
// =========================
function initializeAnimation() {
    document.querySelectorAll('.fade-in').forEach((el, index) => {
        el.style.animationDelay = (index * 0.2) + 's';
    });
}

// =========================
// Photo captions
// =========================
function setupPhotoCaptionAnimations() {
    document.querySelectorAll('.photo-card').forEach(card => {
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
// Scroll animations
// =========================
function setupScrollAnimations() {
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                if (entry.target.classList.contains('message-card')) animateMessageText();
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-aos], .section-title, .message-card').forEach(element => {
        observer.observe(element);
        const delay = element.getAttribute('data-delay');
        if (delay) element.style.transitionDelay = delay + 'ms';
    });
}

// =========================
// Message text animation
// =========================
function animateMessageText() {
    document.querySelectorAll('.message-text').forEach((text, index) => {
        setTimeout(() => text.classList.add('fade-in-animate'), index * 500);
    });
}

// =========================
// Smooth scroll helper
// =========================
function scrollToSection(sectionId) {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// =========================
// Like & floating hearts
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
    heart.style.cssText = 'position:absolute;font-size:1.5rem;pointer-events:none;z-index:1000';

    const rect = button.getBoundingClientRect();
    heart.style.left = rect.left + 'px';
    heart.style.top = rect.top + 'px';

    document.body.appendChild(heart);

    heart.animate([
        { transform: 'translateY(0px) scale(1)', opacity: 1 },
        { transform: 'translateY(-60px) scale(1.5)', opacity: 0 }
    ], { duration: 1500, easing: 'ease-out' }).onfinish = () => heart.remove();
}

// =========================
// Parallax & particle scroll
// =========================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    document.querySelector('.hero')?.style.transform = `translateY(${scrolled * 0.5}px)`;

    document.querySelectorAll('.particle').forEach((particle, index) => {
        const speed = 0.2 + (index % 3) * 0.1;
        particle.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// =========================
// Mouse movement floating hearts
// =========================
document.addEventListener('mousemove', e => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    const moveX = (x - 0.5) * 20;
    const moveY = (y - 0.5) * 20;
    document.querySelector('.floating-hearts')?.style.setProperty('transform', `translate(${moveX}px, ${moveY}px)`);
});

// =========================
// Button ripple
// =========================
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute; width: ${size}px; height: ${size}px;
            left: ${x}px; top: ${y}px;
            background: rgba(255,255,255,0.5);
            border-radius: 50%; transform: scale(0);
            animation: ripple 0.6s ease-out; pointer-events: none;
        `;

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

// Ripple keyframes
const style = document.createElement('style');
style.textContent = `@keyframes ripple { to { transform: scale(2); opacity: 0; } }`;
document.head.appendChild(style);

// =========================
// Photo enter animation
// =========================
const photoObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelector('img')?.style.setProperty('animation','photoEnter 0.8s ease-out forwards');
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.photo-card').forEach(card => photoObserver.observe(card));

const photoStyle = document.createElement('style');
photoStyle.textContent = `
@keyframes photoEnter {
    from { transform: scale(0.8) rotate(-5deg); opacity: 0; }
    to { transform: scale(1) rotate(0deg); opacity: 1; }
}`;
document.head.appendChild(photoStyle);
