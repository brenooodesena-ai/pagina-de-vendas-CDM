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

    // Reveal on Scroll Engine with Staggered Cascading
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -80px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // If the element is part of a grid, let's find its siblings for staggered entry
                const parentGroup = entry.target.closest('.benefits-grid, .access-grid, .module-track');
                if (parentGroup && !parentGroup.classList.contains('revealed')) {
                    parentGroup.classList.add('revealed');
                    const children = parentGroup.querySelectorAll('.reveal');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('active');
                        }, index * 150); // 150ms stagger
                    });
                } else if (!parentGroup) {
                    entry.target.classList.add('active');
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });

    // Elite Mouse Effects: Parallax and Internal Lighting
    const noiseLayer = document.querySelector('.noise-layer');
    const ambientLights = document.querySelectorAll('.ambient-light');
    const interactiveCards = document.querySelectorAll('.benefit-card, .access-card, .module-card, .offer-card');

    document.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const xPercent = (clientX / window.innerWidth - 0.5) * 2; // -1 to 1
        const yPercent = (clientY / window.innerHeight - 0.5) * 2;

        // 3D Parallax for Background
        if (noiseLayer) {
            noiseLayer.style.transform = `translate(${xPercent * 20}px, ${yPercent * 20}px)`;
        }

        ambientLights.forEach((light, index) => {
            const factor = (index + 1) * 15;
            light.style.transform = `translate(${xPercent * factor}px, ${yPercent * factor}px) scale(1.1)`;
        });

        // Dynamic Internal Light for Cards
        interactiveCards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = clientX - rect.left;
            const y = clientY - rect.top;
            
            // Set variables for CSS to use in gradients/glows
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
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

            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('open');
            });

            if (!isOpen) {
                faqItem.classList.add('open');
            }
        });
    });

    // Premium Button Interactions
    const btns = document.querySelectorAll('.btn-main');
    btns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            btn.style.setProperty('--x', `${x}px`);
            btn.style.setProperty('--y', `${y}px`);

            // Subtle 3D tilt
            const tiltX = (y / rect.height - 0.5) * 10;
            const tiltY = (x / rect.width - 0.5) * -10;
            btn.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.05)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
        });
    });
});
