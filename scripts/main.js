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
    if (!journeySection) return;

    const desktopSVG = document.getElementById('svg-desktop');
    const mobileSVG = document.getElementById('svg-mobile');
    const desktopPathMain = document.getElementById('desktop-path-main');
    const desktopPathBg = document.getElementById('desktop-path-bg');
    const mobilePathMain = document.getElementById('mobile-path-main');
    const mobilePathBg = document.getElementById('mobile-path-bg');

    const updateJourneyPath = () => {
        const container = journeySection.querySelector('.container');
        const items = journeySection.querySelectorAll('.journey-item');
        const button = journeySection.querySelector('#journey-button-root');
        if (!container || items.length === 0 || !button) return;

        const containerRect = container.getBoundingClientRect();
        const width = containerRect.width;
        const height = containerRect.height;

        // Set viewBox to match pixel dimensions 1:1
        [desktopSVG, mobileSVG].forEach(svg => {
            if (svg) {
                svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
                svg.style.height = `${height}px`;
            }
        });

        // Calculate points
        let points = [];
        
        // Start at top center of section (after header)
        const header = journeySection.querySelector('.journey-header');
        const headerRect = header.getBoundingClientRect();
        points.push({ x: width / 2, y: headerRect.bottom - containerRect.top });

        // Add each step's icon center
        items.forEach((item, index) => {
            const icon = item.querySelector('.journey-icon');
            if (icon) {
                const iconRect = icon.getBoundingClientRect();
                const centerX = (iconRect.left + iconRect.right) / 2 - containerRect.left;
                const centerY = (iconRect.top + iconRect.bottom) / 2 - containerRect.top;
                
                // For a zig-zag, we need a vertical then horizontal move
                const lastPoint = points[points.length - 1];
                points.push({ x: lastPoint.x, y: centerY }); // Down to item level
                points.push({ x: centerX, y: centerY });     // Side to icon center
            }
        });

        // Connect to final button
        const btnRect = button.getBoundingClientRect();
        const btnCenterX = (btnRect.left + btnRect.right) / 2 - containerRect.left;
        const btnCenterY = (btnRect.top + btnRect.bottom) / 2 - containerRect.top;
        
        const lastStepPoint = points[points.length - 1];
        points.push({ x: lastStepPoint.x, y: btnCenterY }); // Down to button level
        points.push({ x: btnCenterX, y: btnCenterY });     // Over to button center

        // Build SVG path string
        let d = `M ${points[0].x} ${points[0].y}`;
        for (let i = 1; i < points.length; i++) {
            d += ` L ${points[i].x} ${points[i].y}`;
        }

        // Apply to SVG
        [desktopPathMain, desktopPathBg, mobilePathMain, mobilePathBg].forEach(path => {
            if (path) path.setAttribute('d', d);
        });

        // Setup scroll length
        const totalLength = desktopPathMain ? desktopPathMain.getTotalLength() : 0;
        [desktopPathMain, mobilePathMain].forEach(path => {
            if (path) {
                path.style.strokeDasharray = totalLength;
                path.style.strokeDashoffset = totalLength;
                path.dataset.totalLen = totalLength;
            }
        });
    };

    const handleScroll = () => {
        const desktopPath = desktopPathMain;
        const mobilePath = mobilePathMain;
        const firstItem = journeySection.querySelector('.journey-item');
        const button = journeySection.querySelector('#journey-button-root');
        
        if (!firstItem || !button) return;
        
        const firstItemRect = firstItem.getBoundingClientRect();
        const buttonRect = button.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Progress 0% at 75% scroll, 100% at 85% scroll (button center)
        const startMarker = windowHeight * 0.75;
        const endMarker = windowHeight * 0.85;
        
        const currentProgress = (startMarker - firstItemRect.top) / (buttonRect.top + (buttonRect.height/2) - firstItemRect.top + (startMarker - endMarker));
        const progress = Math.max(0, Math.min(1, currentProgress));

        [desktopPath, mobilePath].forEach(path => {
            if (path && path.dataset.totalLen) {
                const len = parseFloat(path.dataset.totalLen);
                path.style.strokeDashoffset = len * (1 - progress);
            }
        });
    };

    // Initial setup
    setTimeout(() => {
        updateJourneyPath();
        handleScroll();
    }, 500);

    window.addEventListener('resize', updateJourneyPath);
    window.addEventListener('scroll', handleScroll, { passive: true });
});
