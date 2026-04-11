// Core JS v4.0 - CDM Performance
const initPreloader = () => {
    const preloader = document.getElementById('preloader');
    if (preloader && !preloader.classList.contains('loaded')) {
        preloader.classList.add('loaded');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 800);
    }
};

// Start hiding preloader as soon as DOM is ready, don't wait for heavy assets/iframes
document.addEventListener('DOMContentLoaded', initPreloader);

// Safety timeout: if DOMContentLoaded takes too long (e.g. slow scripts), hide preloader anyway after 2s
setTimeout(initPreloader, 2000);

document.addEventListener('DOMContentLoaded', () => {
    console.log('CDM v4.0 Initialized');

    // Reveal on Scroll Engine
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });

    // Mobile Check & Optimization
    const handleResize = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // FAQ Accordion Logic
    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', () => {
            const faqItem = button.parentElement;
            const isOpen = faqItem.classList.contains('open');

            // Close all other items (optional, but requested frequently for 'exclusive' feel)
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('open');
            });

            // Toggle current item
            if (!isOpen) {
                faqItem.classList.add('open');
            }
        });
    });

    // Objection Cards Slide-Out Logic
    document.querySelectorAll('.obj-question').forEach(button => {
        button.addEventListener('click', () => {
            const objItem = button.parentElement;
            const isOpen = objItem.classList.contains('open');

            // Close all others so cards overlap cleanly
            document.querySelectorAll('.obj-container').forEach(item => {
                item.classList.remove('open');
            });

            // Re-open clicked one
            if (!isOpen) {
                objItem.classList.add('open');
            }
        });
    });

    // Fast Smooth Scroll Engine
    const fastScrollTo = (targetId, duration = 800) => {
        const target = document.querySelector(targetId);
        if (!target) return;

        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        };

        // Cubic Easing for a "Fast Start, Smooth End" feel
        const ease = (t, b, c, d) => {
            t /= d;
            return -c * t * (t - 2) + b;
        };

        requestAnimationFrame(animation);
    };

    // Bind Hero Button to Fast Scroll
    const heroBtn = document.querySelector('.btn-main'); // Target the main hero button
    if (heroBtn) {
        heroBtn.addEventListener('click', (e) => {
            const targetId = heroBtn.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                fastScrollTo(targetId, 850); // Fast but smooth descent
            }
        });
    }

    // --- Elite Benefits Slider Engine (Rewind Mode) ---
    const sliderContainer = document.querySelector('.benefits-slider-container');
    const track = document.querySelector('.benefits-track');
    const cards = document.querySelectorAll('.benefit-card');
    const prevBtn = document.querySelector('.slider-nav.prev');
    const nextBtn = document.querySelector('.slider-nav.next');
    const progressBar = document.querySelector('.slider-progress-bar');

    if (track && cards.length > 0) {
        let currentIndex = 0;
        const totalSlides = cards.length;
        let isTransitioning = false;

        const updateSlider = (instant = false) => {
            // Transition control
            track.style.transition = instant ? 'none' : 'transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)';
            
            const containerWidth = sliderContainer.offsetWidth;
            const cardWidth = cards[0].offsetWidth;
            // Use a safer way to get the margin
            const style = window.getComputedStyle(cards[0]);
            const marginLeft = parseFloat(style.marginLeft) || 0;
            const marginRight = parseFloat(style.marginRight) || 0;
            const fullCardWidth = cardWidth + marginLeft + marginRight;
            
            // Math for centering: Position = (ContainerMiddle) - (CurrentCardMiddle) - (CurrentCardPositionWithinTrack)
            // But within the track, the card is at index * fullCardWidth
            // So we need to shift the track left by (index * fullCardWidth) and then shift right by compensate to center
            const centerOffset = (containerWidth / 2) - (cardWidth / 2) - marginLeft;
            const finalX = (currentIndex * fullCardWidth) - centerOffset;
            
            // Use Template literal carefully to avoid double negatives in CSS
            track.style.transform = `translate3d(${-finalX}px, 0, 0)`;

            // Update States (Depth & Opacity)
            cards.forEach((card, i) => {
                const distance = Math.abs(i - currentIndex);
                card.classList.toggle('active', i === currentIndex);
                
                if (window.innerWidth > 992) {
                    const scale = 1 - (distance * 0.15);
                    const opacity = 1 - (distance * 0.6);
                    const z = -200 * distance;
                    card.style.opacity = Math.max(0.1, opacity);
                    card.style.transform = `translateZ(${z}px) scale(${scale})`;
                } else {
                    card.style.opacity = i === currentIndex ? '1' : '0.3';
                    card.style.transform = i === currentIndex ? 'scale(1)' : 'scale(0.9)';
                }
            });

            // Sync Progress Bar
            const progress = ((currentIndex + 1) / totalSlides) * 100;
            if (progressBar) progressBar.style.width = `${progress}%`;

            if (instant) track.offsetHeight; // Force reflow
        };

        const nextSlide = () => {
            if (isTransitioning) return;
            isTransitioning = true;
            
            currentIndex = (currentIndex >= totalSlides - 1) ? 0 : currentIndex + 1;
            updateSlider();
            
            setTimeout(() => { isTransitioning = false; }, 850);
        };

        const prevSlide = () => {
            if (isTransitioning) return;
            isTransitioning = true;
            
            currentIndex = (currentIndex <= 0) ? totalSlides - 1 : currentIndex - 1;
            updateSlider();
            
            setTimeout(() => { isTransitioning = false; }, 850);
        };

        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);

        // Magnetic Tilt
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                if (window.innerWidth <= 992 || !card.classList.contains('active')) return;
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.transform = `translateZ(50px) rotateX(${(y - rect.height/2) / -20}deg) rotateY(${(x - rect.width/2) / 20}deg)`;
            });
            card.addEventListener('mouseleave', () => {
                if (window.innerWidth > 992) updateSlider(); 
            });
        });

        // Swipe (Mobile)
        let startX = 0;
        track.addEventListener('touchstart', (e) => startX = e.touches[0].clientX, {passive: true});
        track.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            if (startX - endX > 50) nextSlide();
            else if (endX - startX > 50) prevSlide();
        }, {passive: true});

        // Initialization & Resize
        updateSlider(true);
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            updateSlider(true);
            resizeTimeout = setTimeout(() => updateSlider(true), 150);
        });
    }

    // --- Journey Path Drawing Logic ---
    const desktopPath = document.querySelector('#desktop-journey-path');
    const mobilePath = document.querySelector('#mobile-journey-path');
    const journeySection = document.querySelector('#journey-v5');
    
    if ((desktopPath || mobilePath) && journeySection) {
        
        const initPath = (path) => {
            if (!path) return;
            // Since we set pathLength="100" in HTML to avoid getTotalLength() bugs with non-scaling-stroke,
            // we hardcode length logic to 100 user units.
            const len = 100;
            path.style.strokeDasharray = `${len} ${len}`;
            path.style.strokeDashoffset = len;
            path.dataset.length = len;
        };
        
        initPath(desktopPath);
        initPath(mobilePath);

        const firstItem = journeySection.querySelector('.journey-item');
        const buttonRoot = journeySection.querySelector('#journey-button-root');
        
        const updatePathOnScroll = () => {
            if (!firstItem || !buttonRoot) return;
            const firstItemRect = firstItem.getBoundingClientRect();
            const btnBottom = buttonRoot.getBoundingClientRect().bottom;
            const windowHeight = window.innerHeight;
            
            // Começa a desenhar quando o topo do PRIMEIRO QUADRADINHO aparece na tela (em 65%)
            const drawStart = windowHeight * 0.65; 
            const currentScroll = drawStart - firstItemRect.top;
            
            // Finaliza EXACTAMENTE quando a base do botão "MATRICULE-SE" aparece (toca o fim da tela, i.e btnBottom === windowHeight)
            const totalScrollNeeded = (btnBottom - firstItemRect.top) - (windowHeight - drawStart);
            
            let progress = currentScroll / totalScrollNeeded;
            progress = Math.max(0, Math.min(1, progress));
            
            if (desktopPath) desktopPath.style.strokeDashoffset = 100 * (1 - progress);
            if (mobilePath) mobilePath.style.strokeDashoffset = 100 * (1 - progress);
        };

        window.addEventListener('scroll', updatePathOnScroll, { passive: true });
        setTimeout(updatePathOnScroll, 100);
    }
});
