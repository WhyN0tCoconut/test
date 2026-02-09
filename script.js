// =========================
// DOM Content Loaded - Main Entry Point
// =========================
document.addEventListener("DOMContentLoaded", () => {
    
    
    // =========================
    // Variables and References
    // =========================
    const startBtn = document.getElementById("startBtn");
    const music = document.getElementById("bgMusic");
    const krishnaVideoBtn = document.getElementById("krishnaVideoBtn");
    const krishnaVideoWrapper = document.getElementById("krishnaVideoWrapper");
    const krishnaVideo = document.getElementById("krishnaSpecialVideo");
    const openVideoBtn = document.getElementById("openVideoBtn");
    const videoWrapper = document.getElementById("videoWrapper");
    const video = document.getElementById("specialVideo");
    
    // Variables to store music playback positions
    let bgMusicPosition = 0;
    let firstVideoMusicPosition = 0;

    // =========================
    // 1. Start Button & Audio Initialization
    // =========================
    if (startBtn && music) {
        startBtn.addEventListener("click", () => {
            startBtn.style.display = "none";

            // Scroll to gallery smoothly
            document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" });

            // Play audio (mobile-friendly)
            music.currentTime = 0;
            music.volume = 0.7;
            music.play().catch(err => console.log("Audio blocked:", err));
        });
    }

    // =========================
    // 2. Initial Animations Setup
    // =========================
    createParticles();
    initializeAnimation();
    setupScrollAnimations();
    setupPhotoCaptionAnimations();

    // =========================
    // 3. Regular Hidden Video Section
    // =========================
    if (openVideoBtn && videoWrapper && video && music) {
        openVideoBtn.addEventListener("click", () => {
            console.log("🎥 Regular video button clicked");

            openVideoBtn.style.display = "none";

            // Expand container
            videoWrapper.style.maxHeight = "1200px";
            videoWrapper.style.opacity = "1";
            videoWrapper.style.transform = "scale(1)";

            // Store current background music position and pause
            if (music && !music.paused) {
                firstVideoMusicPosition = music.currentTime;
                music.pause();
                console.log("🎵 Background music paused at position:", firstVideoMusicPosition);
            }

            // Play video
            video.currentTime = 0;
            video.muted = false;

            video.play().catch(err => {
                console.log("❌ Regular video play blocked:", err);
                // If video fails to play, resume background music
                if (music) {
                    music.currentTime = firstVideoMusicPosition;
                    music.play().catch(e => console.log("Music resume also blocked:", e));
                }
            });

            // Smooth scroll
            setTimeout(() => {
                videoWrapper.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            }, 400);
        });

        // When regular video ends, resume background music FROM WHERE IT LEFT OFF
        video.addEventListener("ended", () => {
            console.log("🎵 Regular video ended, resuming background music");

            if (music) {
                music.currentTime = firstVideoMusicPosition;
                music.play().catch(err => {
                    console.log("❌ Music resume blocked:", err);
                });
                console.log("🎵 Background music resumed from:", firstVideoMusicPosition);
            }
        });
    }

    // =========================
    // 4. Krishna Video Section
    // =========================
    if (krishnaVideoBtn && krishnaVideoWrapper && krishnaVideo && music) {
        krishnaVideoBtn.addEventListener("click", () => {
            console.log("🎵 Krishna video button clicked");

            // Hide the button
            krishnaVideoBtn.style.display = "none";

            // Show video wrapper with animation
            krishnaVideoWrapper.classList.add("show");

            // Store current background music position and pause
            if (music && !music.paused) {
                bgMusicPosition = music.currentTime;
                music.pause();
                console.log("🎵 Background music paused at position:", bgMusicPosition);
            }

            // Reset and play Krishna video
            krishnaVideo.currentTime = 0;
            krishnaVideo.volume = 1;
            krishnaVideo.muted = false;
            
            const playPromise = krishnaVideo.play();
            
            if (playPromise !== undefined) {
                playPromise.catch(err => {
                    console.log("❌ Krishna video play blocked:", err);
                    // If video fails to play, resume background music from stored position
                    if (music) {
                        music.currentTime = bgMusicPosition;
                        music.play().catch(e => console.log("Music resume also blocked:", e));
                    }
                });
            }

            // Smooth scroll to video
            setTimeout(() => {
                krishnaVideoWrapper.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            }, 500);
        });

        // When Krishna video ends, resume background music FROM WHERE IT LEFT OFF
        krishnaVideo.addEventListener("ended", () => {
            console.log("🎵 Krishna video ended, resuming background music");
            
            // Hide video wrapper after a delay
            setTimeout(() => {
                krishnaVideoWrapper.classList.remove("show");
                krishnaVideoBtn.style.display = "inline-block";
            }, 2000);

            // Resume background music FROM STORED POSITION
            if (music) {
                music.currentTime = bgMusicPosition;
                music.play().catch(err => {
                    console.log("❌ Music resume blocked:", err);
                });
                console.log("🎵 Background music resumed from:", bgMusicPosition);
            }
        });

        // Handle video pause/stop - if user manually pauses Krishna video
        krishnaVideo.addEventListener("pause", () => {
            console.log("🎵 Krishna video paused by user");
        });
        
        // Optional: If user clicks outside or closes video early, resume music
        document.addEventListener('click', (e) => {
            if (krishnaVideoWrapper.classList.contains('show') && 
                !krishnaVideoWrapper.contains(e.target) && 
                e.target !== krishnaVideoBtn && 
                e.target !== krishnaVideo) {
                
                // User clicked outside the video, resume music
                if (!krishnaVideo.paused) {
                    krishnaVideo.pause();
                }
                
                // Hide video wrapper
                krishnaVideoWrapper.classList.remove("show");
                krishnaVideoBtn.style.display = "inline-block";
                
                // Resume background music
                if (music) {
                    music.currentTime = bgMusicPosition;
                    music.play().catch(err => {
                        console.log("❌ Music resume blocked:", err);
                    });
                }
            }
        });
    }

    // =========================
    // 5. Floating Particles
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
    // 6. Fade-in Animation Initialization
    // =========================
    function initializeAnimation() {
        const fadeElements = document.querySelectorAll('.fade-in');
        fadeElements.forEach((el, index) => {
            el.style.animationDelay = (index * 0.2) + 's';
        });
    }

    // =========================
    // 7. Photo Caption Animations
    // =========================
    function setupPhotoCaptionAnimations() {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const overlay = entry.target.querySelector('.photo-overlay');
                        const caption = entry.target.querySelector('.photo-caption');

                        overlay?.classList.add('aos-animate-caption');
                        caption?.classList.add('aos-animate');

                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.15,
                rootMargin: "0px 0px -80px 0px"
            }
        );

        document.querySelectorAll('.photo-card').forEach(card => {
            observer.observe(card);
        });
    }

    // =========================
    // 8. Scroll Animations
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
    // 9. Animate Message Text
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
    // 10. Like Button & Floating Heart
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
        heart.style.zIndex = '10000';

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
    // 11. Parallax & Particle Scroll
    // =========================
    window.addEventListener('scroll', () => {
        document.querySelectorAll('.photo-card img').forEach(img => {
            const rect = img.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // percent of the element visible in viewport
            let visible = 1 - (rect.top / windowHeight);
            if(visible > 1) visible = 1;
            if(visible < 0) visible = 0;

            // scale and opacity based on scroll position
            img.style.transform = `scale(${0.8 + 0.2 * visible}) rotate(${(1 - visible) * -5}deg)`;
            img.style.opacity = visible;
        });
    });

    // =========================
    // 12. Mouse & Touch Movement for Floating Hearts
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
    // 13. Button Ripple Effect
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

    // =========================
    // 14. Add CSS Animations
    // =========================
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
    // 15. Photo Enter Animation
    // =========================
    const photoObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target.querySelector('img');
                if (img) img.style.animation = 'photoEnter 0.01s ease-out forwards';
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.photo-card').forEach(card => photoObserver.observe(card));

    // =========================
    // 16. I Love You Heart Animation
    // =========================
    const container = document.getElementById("loveHeartWrapper");
    if (container) {
        const total = 80;
        const texts = [];

        function center() {
            const r = container.getBoundingClientRect();
            return { x: r.width / 2, y: r.height / 2 };
        }

        let { x, y } = center();
        let scale = Math.min(container.offsetWidth, container.offsetHeight) / 30;

        for (let i = 0; i < total; i++) {
            const span = document.createElement("span");
            span.className = "heart-text";
            span.textContent = "I Love You";
            container.appendChild(span);
            texts.push(span);
        }

        function animate() {
            const t = Date.now() / 1000;
            texts.forEach((s, i) => {
                const a = (i / total) * Math.PI * 2 + t * 0.6;
                const px = 16 * Math.sin(a) ** 3;
                const py =
                    13 * Math.cos(a) -
                    5 * Math.cos(2 * a) -
                    2 * Math.cos(3 * a) -
                    Math.cos(4 * a);

                s.style.left = x + px * scale + "px";
                s.style.top = y - py * scale + "px";
            });
            requestAnimationFrame(animate);
        }

        animate();

        window.addEventListener("resize", () => {
            ({ x, y } = center());
            scale = Math.min(container.offsetWidth, container.offsetHeight) / 30;
        });
    }

    // =========================
    // 17. Time Counter for Proposal Date
    // =========================
    const proposalDate = new Date("2025-10-22T00:00:00");

    function updateTimeCounter() {
        const now = new Date();
        const diff = now - proposalDate;

        if (diff < 0) {
            document.getElementById("timeCounter").innerText =
                "The day I will always remember 🤍";
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        document.getElementById("timeCounter").innerText =
            `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
    }

    setInterval(updateTimeCounter, 1000);
    updateTimeCounter();
});

// =========================
// Additional Event Listeners
// =========================

// Add this at the end for any additional global event listeners
window.addEventListener('load', () => {
    console.log("🎉 Valentine's Day website fully loaded!");
    
    // Ensure music is ready
    const music = document.getElementById("bgMusic");
    if (music) {
        music.volume = 0.7;
        console.log("🎵 Background music ready");
    }
});
// =========================
// 18. Centered Voice Recording Player - Mobile Volume Fixed
// =========================
const voiceAudio = document.getElementById('promiseVoice');
const playVoiceBtn = document.getElementById('playVoiceBtn');
const pauseVoiceBtn = document.getElementById('pauseVoiceBtn');
const voiceProgressBar = document.querySelector('.voice-progress-bar-centered');
const voiceDuration = document.querySelector('.voice-duration-centered');
const bgMusic = document.getElementById('bgMusic');

// Check if we're on mobile
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// For mobile: we'll PAUSE background music during voice playback
// For desktop: we'll REDUCE volume
let wasMusicPlaying = false;
let musicPosition = 0;

// Format time function
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Update progress bar and time
function updateVoiceProgress() {
    if (!voiceAudio.duration) return;
    
    const percent = (voiceAudio.currentTime / voiceAudio.duration) * 100;
    voiceProgressBar.style.width = `${percent}%`;
    voiceDuration.textContent = formatTime(voiceAudio.currentTime);
}

// Setup voice audio events
if (voiceAudio && playVoiceBtn && pauseVoiceBtn) {
    // Set mobile-specific attributes
    voiceAudio.setAttribute('playsinline', '');
    voiceAudio.setAttribute('webkit-playsinline', '');
    voiceAudio.muted = false;
    voiceAudio.volume = 1.0;
    
    // Set initial duration
    voiceAudio.addEventListener('loadedmetadata', () => {
        voiceDuration.textContent = formatTime(voiceAudio.duration);
    });
    
    // Update progress while playing
    voiceAudio.addEventListener('timeupdate', updateVoiceProgress);
    
    // Click progress bar to seek
    document.querySelector('.voice-progress-centered').addEventListener('click', (e) => {
        if (!voiceAudio.duration) return;
        
        const progressRect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - progressRect.left;
        const width = progressRect.width;
        const percent = clickX / width;
        
        voiceAudio.currentTime = percent * voiceAudio.duration;
        updateVoiceProgress();
    });
    
    // Play button click
    playVoiceBtn.addEventListener('click', function playVoice() {
        console.log("🎵 Play button clicked");
        
        // Handle background music based on device
        if (bgMusic && !bgMusic.paused) {
            if (isMobile) {
                // On mobile: PAUSE the background music
                wasMusicPlaying = true;
                musicPosition = bgMusic.currentTime;
                bgMusic.pause();
                console.log("📱 Mobile: Background music paused");
            } else {
                // On desktop: REDUCE volume
                bgMusic.volume = 0.2; // Reduced to 20%
                console.log("💻 Desktop: Background music volume reduced to 20%");
            }
        }
        
        // Prepare and play voice recording
        voiceAudio.currentTime = 0;
        
        // Try to play the voice recording
        const playPromise = voiceAudio.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    console.log("✅ Voice recording started successfully");
                    playVoiceBtn.style.display = 'none';
                    pauseVoiceBtn.style.display = 'flex';
                })
                .catch(err => {
                    console.log("❌ Voice play error:", err);
                    
                    // If voice fails to play, restore background music
                    restoreBackgroundMusic();
                    
                    // Show user-friendly error message
                    if (isMobile) {
                        alert("Please tap the screen once, then try playing again. Mobile browsers require user interaction for audio.");
                    }
                });
        }
    });
    
    // Pause button click
    pauseVoiceBtn.addEventListener('click', () => {
        console.log("⏸️ Pause button clicked");
        voiceAudio.pause();
        pauseVoiceBtn.style.display = 'none';
        playVoiceBtn.style.display = 'flex';
        
        // Restore background music
        restoreBackgroundMusic();
    });
    
    // Function to restore background music
    function restoreBackgroundMusic() {
        if (bgMusic) {
            if (isMobile && wasMusicPlaying) {
                // On mobile: RESUME from saved position
                bgMusic.currentTime = musicPosition;
                bgMusic.play().catch(e => console.log("Music resume error:", e));
                wasMusicPlaying = false;
                console.log("📱 Mobile: Background music resumed");
            } else if (!isMobile) {
                // On desktop: RESTORE volume
                bgMusic.volume = 0.7; // Restore to 70%
                console.log("💻 Desktop: Background music volume restored to 70%");
            }
        }
    }
    
    // When voice recording ends
    voiceAudio.addEventListener('ended', () => {
        console.log("✅ Voice recording ended");
        pauseVoiceBtn.style.display = 'none';
        playVoiceBtn.style.display = 'flex';
        
        // Reset progress
        voiceProgressBar.style.width = '0%';
        voiceDuration.textContent = formatTime(voiceAudio.duration);
        
        // Restore background music
        restoreBackgroundMusic();
    });
    
    // Handle voice audio errors
    voiceAudio.addEventListener('error', (e) => {
        console.log("❌ Voice audio error:", e);
        pauseVoiceBtn.style.display = 'none';
        playVoiceBtn.style.display = 'flex';
        
        // Restore background music
        restoreBackgroundMusic();
    });
    
    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && !voiceAudio.paused) {
            voiceAudio.pause();
            pauseVoiceBtn.style.display = 'none';
            playVoiceBtn.style.display = 'flex';
            restoreBackgroundMusic();
        }
    });
    
    // Ensure voice audio can play on mobile
    if (isMobile) {
        console.log("📱 Mobile optimization active");
        
        // Create a user interaction handler for mobile
        function handleFirstInteraction() {
            console.log("👆 Mobile user interaction detected");
            
            // Try to play/pause quickly to unlock audio
            voiceAudio.play().then(() => {
                voiceAudio.pause();
                voiceAudio.currentTime = 0;
            }).catch(e => console.log("Mobile audio unlock attempt:", e));
            
            // Remove listeners after first interaction
            document.removeEventListener('touchstart', handleFirstInteraction);
            document.removeEventListener('click', handleFirstInteraction);
        }
        
        // Listen for first user interaction
        document.addEventListener('touchstart', handleFirstInteraction, { once: true });
        document.addEventListener('click', handleFirstInteraction, { once: true });
    }
    
    // Smooth transitions for button changes
    [playVoiceBtn, pauseVoiceBtn].forEach(btn => {
        btn.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    });
    
    // Debug: Log audio state
    console.log("🎵 Voice audio element:", voiceAudio);
    console.log("🎵 Background music element:", bgMusic);
    console.log("📱 Is mobile device:", isMobile);
}

// Additional mobile audio helper
document.addEventListener('DOMContentLoaded', () => {
    // Mobile: Pre-load audio files on user interaction
    if (isMobile) {
        const preloadAudio = () => {
            if (voiceAudio) {
                voiceAudio.load();
                console.log("📱 Audio pre-loaded for mobile");
            }
        };
        
        // Pre-load on first user interaction
        document.addEventListener('touchstart', preloadAudio, { once: true });
    }
});
