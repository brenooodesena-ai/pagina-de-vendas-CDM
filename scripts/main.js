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

    // --- Benefits Slider Logic ---
    const track = document.querySelector('.benefits-track');
    const cards = document.querySelectorAll('.benefit-card');
    const prevBtn = document.querySelector('.slider-nav.prev');
    const nextBtn = document.querySelector('.slider-nav.next');
    const dotsContainer = document.querySelector('.slider-dots');

    if (track && cards.length > 0) {
        let currentIndex = 0;
        const totalSlides = cards.length;

        // Create Dots
        cards.forEach((_, x) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (x === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(x));
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.dot');

        const updateSlider = () => {
            const cardWidth = cards[0].offsetWidth + 20; // Gap included
            const moveX = currentIndex * cardWidth;
            track.style.transform = `translateX(-${moveX}px)`;

            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        };

        const goToSlide = (index) => {
            const isMobile = window.innerWidth <= 992;
            const isTablet = window.innerWidth > 992 && window.innerWidth <= 1200;
            
            let maxIndex;
            if (isMobile) maxIndex = totalSlides - 1;
            else if (isTablet) maxIndex = totalSlides - 2;
            else maxIndex = totalSlides - 3;

            currentIndex = Math.max(0, Math.min(index, maxIndex));
            updateSlider();
        };

        nextBtn.addEventListener('click', () => {
            const isMobile = window.innerWidth <= 992;
            const isTablet = window.innerWidth > 992 && window.innerWidth <= 1200;
            let max;
            if (isMobile) max = totalSlides - 1;
            else if (isTablet) max = totalSlides - 2;
            else max = totalSlides - 3;

            if (currentIndex < max) {
                currentIndex++;
            } else {
                currentIndex = 0; // Loop to start
            }
            updateSlider();
        });

        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                // Loop to end
                const isMobile = window.innerWidth <= 992;
                const isTablet = window.innerWidth > 992 && window.innerWidth <= 1200;
                if (isMobile) currentIndex = totalSlides - 1;
                else if (isTablet) currentIndex = totalSlides - 2;
                else currentIndex = totalSlides - 3;
            }
            updateSlider();
        });

        // Touch Swipe Support
        let touchStartX = 0;
        let touchEndX = 0;

        track.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        track.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            if (touchStartX - touchEndX > 50) nextBtn.click();
            if (touchEndX - touchStartX > 50) prevBtn.click();
        }, { passive: true });

        window.addEventListener('resize', updateSlider);
    }
});
