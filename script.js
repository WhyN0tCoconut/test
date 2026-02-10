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
    
    // Voice recording elements
    const promiseVoice = document.getElementById("promiseVoice");
    const playVoiceBtn = document.getElementById("playVoiceBtn");
    const pauseVoiceBtn = document.getElementById("pauseVoiceBtn");
    const voiceProgressBar = document.querySelector(".voice-progress-bar-centered");
    const voiceDuration = document.querySelector(".voice-duration-centered");
    
    // Variables to store music playback positions
    let bgMusicPosition = 0;
    let firstVideoMusicPosition = 0;
    let voiceMusicPosition = 0; // Added for voice recording
    let isVoicePlaying = false; // Track voice recording state
    let isMusicPlaying = false; // Track background music state
    let musicWasPlayingBeforeVoice = false; // Track if music was playing before voice

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
            music.volume = 0.5;
            music.play()
                .then(() => {
                    console.log("🎵 Background music started");
                    isMusicPlaying = true;
                })
                .catch(err => {
                    console.log("Audio blocked:", err);
                    // Set a flag to indicate music should be playing but was blocked
                    isMusicPlaying = true;
                });
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
    // Helper function to handle music pause/resume consistently
    // =========================
    function pauseBackgroundMusicForMedia(mediaType) {
        if (music && isMusicPlaying) {
            switch(mediaType) {
                case 'regularVideo':
                    firstVideoMusicPosition = music.currentTime;
                    break;
                case 'krishnaVideo':
                    bgMusicPosition = music.currentTime;
                    break;
                case 'voice':
                    voiceMusicPosition = music.currentTime;
                    break;
            }
            music.pause();
            isMusicPlaying = false;
            console.log(`🎵 Background music paused for ${mediaType}`);
        }
    }

    function resumeBackgroundMusicForMedia(mediaType) {
        if (music) {
            let position = 0;
            switch(mediaType) {
                case 'regularVideo':
                    position = firstVideoMusicPosition;
                    break;
                case 'krishnaVideo':
                    position = bgMusicPosition;
                    break;
                case 'voice':
                    position = voiceMusicPosition;
                    break;
            }
            music.currentTime = position;
            music.play()
                .then(() => {
                    isMusicPlaying = true;
                    console.log(`🎵 Background music resumed for ${mediaType} from position: ${position}`);
                })
                .catch(err => {
                    console.log(`❌ Music resume blocked for ${mediaType}:`, err);
                });
        }
    }

    // =========================
    // 3. Regular Hidden Video Section - IMPROVED
    // =========================
    if (openVideoBtn && videoWrapper && video && music) {
        let shouldManageMusicForSpecialVideo = false;
        let isRegularVideoPlaying = false;
        
        openVideoBtn.addEventListener("click", () => {
            console.log("🎥 Regular video button clicked");

            openVideoBtn.style.display = "none";

            // Expand container
            videoWrapper.style.maxHeight = "1200px";
            videoWrapper.style.opacity = "1";
            videoWrapper.style.transform = "scale(1)";

            // Pause background music
            pauseBackgroundMusicForMedia('regularVideo');
            shouldManageMusicForSpecialVideo = true;

            // Play video
            video.currentTime = 0;
            video.muted = false;

            video.play()
                .then(() => {
                    isRegularVideoPlaying = true;
                })
                .catch(err => {
                    console.log("❌ Special video play blocked:", err);
                    // If video fails to play, resume background music
                    if (shouldManageMusicForSpecialVideo) {
                        resumeBackgroundMusicForMedia('regularVideo');
                        shouldManageMusicForSpecialVideo = false;
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

        // Handle video play events
        video.addEventListener("play", () => {
            console.log("🎥 Regular video playing");
            isRegularVideoPlaying = true;
            
            // Ensure music is paused when video plays
            if (music && isMusicPlaying && shouldManageMusicForSpecialVideo) {
                pauseBackgroundMusicForMedia('regularVideo');
            }
        });

        // Handle video pause events
        video.addEventListener("pause", () => {
            console.log("🎥 Regular video paused");
            isRegularVideoPlaying = false;
            
            // Resume music if video was playing
            if (shouldManageMusicForSpecialVideo) {
                resumeBackgroundMusicForMedia('regularVideo');
            }
        });

        // Handle video seeking
        video.addEventListener("seeking", () => {
            console.log("🎥 Regular video seeking");
            // Pause music while seeking if video is playing
            if (isRegularVideoPlaying && music && isMusicPlaying) {
                pauseBackgroundMusicForMedia('regularVideo');
            }
        });

        // Handle video end
        video.addEventListener("ended", () => {
            console.log("🎥 Regular video ended");
            isRegularVideoPlaying = false;
            
            if (shouldManageMusicForSpecialVideo) {
                resumeBackgroundMusicForMedia('regularVideo');
                shouldManageMusicForSpecialVideo = false;
            }
        });
    }

    // =========================
    // 4. Krishna Video Section - IMPROVED
    // =========================
    if (krishnaVideoBtn && krishnaVideoWrapper && krishnaVideo && music) {
        let isKrishnaVideoPlaying = false;
        
        krishnaVideoBtn.addEventListener("click", () => {
            console.log("🎵 Krishna video button clicked");

            // Hide the button
            krishnaVideoBtn.style.display = "none";

            // Show video wrapper with animation
            krishnaVideoWrapper.classList.add("show");

            // Pause background music
            pauseBackgroundMusicForMedia('krishnaVideo');

            // Reset and play Krishna video
            krishnaVideo.currentTime = 0;
            krishnaVideo.volume = 1;
            krishnaVideo.muted = false;
            
            krishnaVideo.play()
                .then(() => {
                    isKrishnaVideoPlaying = true;
                })
                .catch(err => {
                    console.log("❌ Krishna video play blocked:", err);
                    // If video fails to play, resume background music
                    resumeBackgroundMusicForMedia('krishnaVideo');
                });

            // Smooth scroll to video
            setTimeout(() => {
                krishnaVideoWrapper.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            }, 500);
        });

        // Handle video play
        krishnaVideo.addEventListener("play", () => {
            console.log("🎵 Krishna video started playing");
            isKrishnaVideoPlaying = true;
            
            // Ensure music is paused
            if (music && isMusicPlaying) {
                pauseBackgroundMusicForMedia('krishnaVideo');
            }
        });

        // Handle video pause
        krishnaVideo.addEventListener("pause", () => {
            console.log("🎵 Krishna video paused by user");
            isKrishnaVideoPlaying = false;
            
            // Resume music if video was playing
            resumeBackgroundMusicForMedia('krishnaVideo');
        });

        // Handle video seeking
        krishnaVideo.addEventListener("seeking", () => {
            console.log("🎵 Krishna video seeking");
            // Pause music while seeking if video is playing
            if (isKrishnaVideoPlaying && music && isMusicPlaying) {
                pauseBackgroundMusicForMedia('krishnaVideo');
            }
        });

        // Handle video end
        krishnaVideo.addEventListener("ended", () => {
            console.log("🎵 Krishna video ended");
            isKrishnaVideoPlaying = false;
            resumeBackgroundMusicForMedia('krishnaVideo');
        });
    }

    // =========================
    // 5. Voice Recording Playback with Music Control - COMPLETELY REWRITTEN
    // =========================
    if (promiseVoice && playVoiceBtn && pauseVoiceBtn && music) {
        
        // Function to format time
        function formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        }
        
        // Update progress bar and time
        function updateProgress() {
            if (!promiseVoice.duration) return;
            
            const progress = (promiseVoice.currentTime / promiseVoice.duration) * 100;
            voiceProgressBar.style.width = `${progress}%`;
            voiceDuration.textContent = formatTime(promiseVoice.currentTime);
        }
        
        // Initialize voice recording
        function initVoiceRecording() {
            // Reset progress bar
            voiceProgressBar.style.width = "0%";
            voiceDuration.textContent = "0:00";
            
            // Show play button, hide pause button
            playVoiceBtn.style.display = "flex";
            pauseVoiceBtn.style.display = "none";
            
            // Reset state
            isVoicePlaying = false;
        }
        
        // Track seeking state
        let isSeeking = false;
        let isUserInteracting = false;
        
        // Play voice recording
        playVoiceBtn.addEventListener("click", () => {
            console.log("🎤 Voice recording play button clicked");
            
            // Check if music is playing
            musicWasPlayingBeforeVoice = isMusicPlaying;
            
            // Pause background music
            pauseBackgroundMusicForMedia('voice');
            
            // Play the voice recording
            promiseVoice.volume = 1;
            
            promiseVoice.play()
                .then(() => {
                    console.log("🎤 Voice recording started");
                    playVoiceBtn.style.display = "none";
                    pauseVoiceBtn.style.display = "flex";
                    isVoicePlaying = true;
                    
                    // Start progress updates
                    promiseVoice.addEventListener("timeupdate", updateProgress);
                })
                .catch(err => {
                    console.log("❌ Voice recording play blocked:", err);
                    // If voice recording fails to play, resume background music
                    if (musicWasPlayingBeforeVoice) {
                        resumeBackgroundMusicForMedia('voice');
                    }
                });
        });
        
        // Pause voice recording
        pauseVoiceBtn.addEventListener("click", () => {
            console.log("🎤 Voice recording pause button clicked");
            
            promiseVoice.pause();
            pauseVoiceBtn.style.display = "none";
            playVoiceBtn.style.display = "flex";
            isVoicePlaying = false;
            
            // Remove progress update listener
            promiseVoice.removeEventListener("timeupdate", updateProgress);
            
            // Resume background music if it was playing before voice
            if (musicWasPlayingBeforeVoice) {
                resumeBackgroundMusicForMedia('voice');
            }
        });
        
        // Handle voice recording end
        promiseVoice.addEventListener("ended", () => {
            console.log("🎤 Voice recording ended");
            
            pauseVoiceBtn.style.display = "none";
            playVoiceBtn.style.display = "flex";
            isVoicePlaying = false;
            
            // Remove progress update listener
            promiseVoice.removeEventListener("timeupdate", updateProgress);
            
            // Reset progress bar
            voiceProgressBar.style.width = "0%";
            voiceDuration.textContent = "0:00";
            
            // Resume background music if it was playing before voice
            if (musicWasPlayingBeforeVoice) {
                resumeBackgroundMusicForMedia('voice');
            }
            
            // Reset voice recording to beginning for next play
            promiseVoice.currentTime = 0;
        });
        
        // Handle user interaction with progress bar
        const voiceProgress = document.querySelector(".voice-progress-centered");
        if (voiceProgress) {
            // Mouse/touch events for dragging
            voiceProgress.addEventListener("mousedown", startSeeking);
            voiceProgress.addEventListener("touchstart", startSeeking);
            
            voiceProgress.addEventListener("mousemove", handleSeeking);
            voiceProgress.addEventListener("touchmove", handleSeeking);
            
            voiceProgress.addEventListener("mouseup", endSeeking);
            voiceProgress.addEventListener("touchend", endSeeking);
            voiceProgress.addEventListener("mouseleave", endSeeking);
            
            // Click event for direct jumps
            voiceProgress.addEventListener("click", handleProgressClick);
        }
        
        function startSeeking(e) {
            isSeeking = true;
            isUserInteracting = true;
            
            // Pause music when seeking starts
            if (isVoicePlaying && music && isMusicPlaying) {
                pauseBackgroundMusicForMedia('voice');
            }
            
            // Pause voice during drag
            if (!promiseVoice.paused) {
                promiseVoice.pause();
            }
            
            handleSeekPosition(e);
        }
        
        function handleSeeking(e) {
            if (isSeeking) {
                handleSeekPosition(e);
            }
        }
        
        function endSeeking() {
            if (isSeeking) {
                isSeeking = false;
                
                // If voice was playing before seeking, resume it
                if (isVoicePlaying) {
                    setTimeout(() => {
                        promiseVoice.play()
                            .then(() => {
                                console.log("🎤 Voice recording resumed after seeking");
                                // Ensure music stays paused while voice plays
                                if (music && !music.paused) {
                                    pauseBackgroundMusicForMedia('voice');
                                }
                            })
                            .catch(err => {
                                console.log("❌ Failed to resume after seeking:", err);
                            });
                    }, 100);
                }
                
                // Reset user interaction flag after delay
                setTimeout(() => {
                    isUserInteracting = false;
                }, 500);
            }
        }
        
        function handleSeekPosition(e) {
            if (!promiseVoice.duration) return;
            
            const rect = voiceProgress.getBoundingClientRect();
            let clientX;
            
            if (e.type.includes('touch')) {
                clientX = e.touches[0].clientX;
            } else {
                clientX = e.clientX;
            }
            
            const pos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
            const newTime = pos * promiseVoice.duration;
            
            promiseVoice.currentTime = newTime;
            updateProgress();
        }
        
        function handleProgressClick(e) {
            if (!isUserInteracting) { // Only handle if not already dragging
                if (!promiseVoice.duration) return;
                
                const rect = voiceProgress.getBoundingClientRect();
                const clientX = e.clientX || (e.touches ? e.touches[0].clientX : 0);
                const pos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
                const newTime = pos * promiseVoice.duration;
                
                console.log("🎤 Clicked to position:", newTime);
                
                // Pause music if voice will play from this position
                if (isVoicePlaying && music && isMusicPlaying) {
                    pauseBackgroundMusicForMedia('voice');
                }
                
                promiseVoice.currentTime = newTime;
                updateProgress();
                
                // If voice was playing, continue playing from new position
                if (isVoicePlaying) {
                    setTimeout(() => {
                        promiseVoice.play()
                            .then(() => {
                                console.log("🎤 Voice recording resumed from clicked position");
                            })
                            .catch(err => {
                                console.log("❌ Failed to play after click:", err);
                            });
                    }, 50);
                }
            }
        }
        
        // Handle voice seeking event
        promiseVoice.addEventListener("seeking", () => {
            console.log("🎤 Voice recording seeking");
            // Pause music while seeking if voice is playing
            if (isVoicePlaying && music && isMusicPlaying) {
                pauseBackgroundMusicForMedia('voice');
            }
        });
        
        // Handle voice play event
        promiseVoice.addEventListener("play", () => {
            console.log("🎤 Voice recording play event");
            isVoicePlaying = true;
            
            // Ensure music is paused when voice plays
            if (music && isMusicPlaying) {
                pauseBackgroundMusicForMedia('voice');
            }
        });
        
        // Handle voice pause event (only for manual pauses, not seeking)
        promiseVoice.addEventListener("pause", () => {
            // Only resume music if this is a manual pause (not during seeking)
            if (!isSeeking && !isUserInteracting && musicWasPlayingBeforeVoice) {
                console.log("🎤 Voice recording manually paused, resuming music");
                resumeBackgroundMusicForMedia('voice');
            }
        });
        
        // Initialize with total duration if available
        promiseVoice.addEventListener("loadedmetadata", () => {
            console.log("🎤 Voice recording duration:", promiseVoice.duration);
            initVoiceRecording();
        });
        
        // Initialize on page load
        initVoiceRecording();
    }

    // =========================
    // 6. Floating Particles
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
    // 7. Fade-in Animation Initialization
    // =========================
    function initializeAnimation() {
        const fadeElements = document.querySelectorAll('.fade-in');
        fadeElements.forEach((el, index) => {
            el.style.animationDelay = (index * 0.2) + 's';
        });
    }

    // =========================
    // 8. Photo Caption Animations
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
    // 9. Scroll Animations
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
    // 10. Animate Message Text
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
    // 11. Like Button & Floating Heart
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
    // 12. Parallax & Particle Scroll
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
    // 13. Mouse & Touch Movement for Floating Hearts
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
    // 14. Button Ripple Effect
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
    // 15. Add CSS Animations
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
    // 16. Photo Enter Animation
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
    // 17. I Love You Heart Animation
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
    // 18. Time Counter for Proposal Date
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
