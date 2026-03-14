// Core JS v4.0 - CDM Performance
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('loaded');
        // Fully remove after transition to free up resources
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 800);
    }
});

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

    // --- Elite Benefits Slider Engine (Infinite Loop Mode) ---
    const sliderContainer = document.querySelector('.benefits-slider-container');
    const track = document.querySelector('.benefits-track');
    const allCards = document.querySelectorAll('.benefit-card');
    const prevBtn = document.querySelector('.slider-nav.prev');
    const nextBtn = document.querySelector('.slider-nav.next');
    const progressBar = document.querySelector('.slider-progress-bar');

    if (track && allCards.length > 0) {
        // Find real slides vs clones
        const originalCardsCount = 6;
        let currentIndex = 1; // Start at the first "real" slide (index 0 is clone of last)
        let isTransitioning = false;

        const updateSlider = (instant = false) => {
            if (instant) track.style.transition = 'none';
            else track.style.transition = 'transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)';
            
            const containerWidth = sliderContainer.offsetWidth;
            const cardWidth = allCards[0].offsetWidth;
            const cardMargin = parseFloat(window.getComputedStyle(allCards[0]).marginLeft);
            
            // Calculate center position
            const offset = (containerWidth / 2) - (cardWidth / 2) - cardMargin;
            const moveX = (currentIndex * (cardWidth + (cardMargin * 2))) - offset;
            
            track.style.transform = `translateX(-${moveX}px)`;

            // Update Class and Individual Card States
            allCards.forEach((card, i) => {
                // Determine logical index for active state
                let logicalIndex = currentIndex;
                if (currentIndex === 0) logicalIndex = originalCardsCount;
                if (currentIndex === originalCardsCount + 1) logicalIndex = 1;

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
                    card.style.transform = i === currentIndex ? 'scale(1)' : 'scale(0.9) translateZ(0)';
                }
            });

            // Update Progress Bar based on "Real" items (1 to 6)
            let displayIndex = currentIndex;
            if (currentIndex === 0) displayIndex = originalCardsCount;
            else if (currentIndex === originalCardsCount + 1) displayIndex = 1;
            
            const progress = (displayIndex / originalCardsCount) * 100;
            if (progressBar) progressBar.style.width = `${progress}%`;

            if (instant) {
                track.offsetHeight; // Force reflow
            }
        };

        const handleLoop = () => {
            isTransitioning = false;
            // If at Clone-First (end), jump to Real-First (index 1)
            if (currentIndex === originalCardsCount + 1) {
                currentIndex = 1;
                updateSlider(true);
            }
            // If at Clone-Last (start), jump to Real-Last (index 6)
            if (currentIndex === 0) {
                currentIndex = originalCardsCount;
                updateSlider(true);
            }
        };

        track.addEventListener('transitionend', handleLoop);

        const nextSlide = () => {
            if (isTransitioning) return;
            isTransitioning = true;
            currentIndex++;
            updateSlider();
        };

        const prevSlide = () => {
            if (isTransitioning) return;
            isTransitioning = true;
            currentIndex--;
            updateSlider();
        };

        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);

        // Magnetic Tilt Effect
        allCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                if (window.innerWidth <= 992 || !card.classList.contains('active')) return;
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const xc = rect.width / 2;
                const yc = rect.height / 2;
                const dx = x - xc;
                const dy = y - yc;
                card.style.transform = `translateZ(50px) rotateX(${dy/-20}deg) rotateY(${dx/20}deg)`;
            });

            card.addEventListener('mouseleave', () => {
                if (window.innerWidth > 992) updateSlider(); 
            });
        });

        // Swipe support
        let startX = 0;
        track.addEventListener('touchstart', (e) => {
            if (isTransitioning) return;
            startX = e.touches[0].clientX;
        }, {passive: true});
        
        track.addEventListener('touchend', (e) => {
            if (isTransitioning) return;
            const endX = e.changedTouches[0].clientX;
            if (startX - endX > 50) nextSlide();
            if (endX - startX > 50) prevSlide();
        }, {passive: true});

        // Initialize & Improved Resize Handling
        updateSlider(true);
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            updateSlider(true);
            resizeTimer = setTimeout(() => updateSlider(true), 150);
        });
    }
});
