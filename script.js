/* ملف JAVASCRIPT مُعاد تصميمه بالكامل
  - يستخدم GSAP للأنيميشن الاحترافية
  - يضيف Page Loader
  - يضيف Scroll Animations (Stagger)
  - يحتفظ بالكود الحالي للـ Custom Cursor + Mobile Nav
*/

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. (NEW) Page Load Animation ---
    const startLoader = () => {
        const counter = document.querySelector('.loader-counter');
        const overlay = document.querySelector('.loader-overlay');
        if (!counter || !overlay) return;

        let currentValue = 0;

        function updateCounter() {
            if (currentValue === 100) {
                // Start fade out animation
                gsap.to(counter, { duration: 0.5, opacity: 0, delay: 0.2 });
                gsap.to(overlay, { 
                    duration: 0.8, 
                    y: '-100%', // Slide up
                    ease: 'power3.inOut', 
                    delay: 0.5,
                    onComplete: runHeroAnimation // Run hero animation *after* loader finishes
                });
                return;
            }

            currentValue += Math.floor(Math.random() * 10) + 1;
            if (currentValue > 100) currentValue = 100;

            counter.textContent = currentValue;

            let delay = Math.floor(Math.random() * 150) + 50;
            setTimeout(updateCounter, delay);
        }
        updateCounter();
    };
    
    // Run the loader
    // startLoader(); // <-- تم إلغاء اللودر
    runHeroAnimation(); // <-- تم إضافة هذا السطر لتشغيل الأنيميشن مباشرة


    // --- 2. (NEW) Hero Section Animation (Runs after loader) ---
    const runHeroAnimation = () => {
        // This targets elements in index.html specifically
        const heroTitle = document.querySelector('.js-hero-title');
        const heroP = document.querySelector('.js-hero-p');
        const heroBtn = document.querySelector('.js-hero-btn');

        if (!heroTitle || !heroP || !heroBtn) return; // Only run on homepage

        // A timeline to control animation order
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.to(heroTitle, {
            duration: 1,
            y: 0,
            opacity: 1,
            delay: 0.2
        })
        .to(heroP, {
            duration: 1,
            y: 0,
            opacity: 1
        }, "-=0.8") // Starts 0.8s before the previous one ends
        .to(heroBtn, {
            duration: 0.8,
            y: 0,
            opacity: 1
        }, "-=0.8"); // Starts 0.8s before the previous one ends
    };
    

    // --- 3. (NEW) GSAP Scroll Animations ---
    // We replace the simple IntersectionObserver with GSAP's ScrollTrigger
    
    // Animate elements fading up
    const fadeUpElements = document.querySelectorAll('.js-fade-up');
    fadeUpElements.forEach(el => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 85%', // When the top of the element hits 85% of the viewport height
                toggleActions: 'play none none none' // Play animation once
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });
    });

    // Animate elements with a "stagger" (one by one)
    const staggerContainers = document.querySelectorAll('.js-stagger-container');
    staggerContainers.forEach(container => {
        const elements = container.querySelectorAll('.js-stagger-child');
        if (elements.length > 0) {
            gsap.from(elements, {
                scrollTrigger: {
                    trigger: container,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                y: 40,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out',
                stagger: 0.2 // This is the magic: animates each child 0.2s after the previous one
            });
        }
    });

    // Animate the image reveal (curtain effect)
    const revealWrappers = document.querySelectorAll('.image-reveal-wrapper');
    revealWrappers.forEach(wrapper => {
        const img = wrapper.querySelector('img');
        
        // Timeline for curtain and image
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: wrapper,
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });

        // The "::before" pseudo-element (the curtain)
        tl.from(wrapper, { 
            '--reveal-width': '0%', // This animates the CSS variable we'll create
            duration: 1.2, 
            ease: 'power3.inOut' 
        })
        .from(img, {
            scale: 1.2,
            duration: 1.2,
            ease: 'power3.inOut'
        }, '<'); // '<' means "start at the same time as the previous animation"
    });


    // --- 4. (Unchanged) Custom Cursor ---
    // (تم حذف هذا القسم بالكامل)


    // --- 5. (Unchanged) Mobile Navigation ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    // --- 6. (Unchanged) Stats Counter ---
    // (This code remains the same, GSAP ScrollTrigger will still activate it correctly)
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsSection = document.querySelector('.stats-section'); 

    const startCounter = (el) => {
        // ... (الكود الخاص بالعداد كما هو) ...
        const target = +el.getAttribute('data-target');
        const duration = 2000;
        const stepTime = 20;
        const steps = duration / stepTime;
        const increment = target / steps;
        let current = 0;

        const updateCount = () => {
            current += increment;
            if (current < target) {
                el.innerText = `+${Math.ceil(current)}`;
                setTimeout(updateCount, stepTime);
            } else {
                el.innerText = `+${target}`;
            }
        };
        // Check if already counted
        if (!el.classList.contains('counted')) {
            updateCount();
            el.classList.add('counted');
        }
    };

    if (statsSection) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    statNumbers.forEach(num => startCounter(num));
                    observer.unobserve(statsSection);
                }
            });
        }, { threshold: 0.5 });
        
        counterObserver.observe(statsSection);
    }

    // --- 7. (Unchanged) Sticky Nav Styling ---
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });

    // --- 8. (Unchanged) Portfolio Tabs (Services Page) ---
    const tabContainer = document.querySelector('.portfolio-tabs');
    if (tabContainer) {
        // ... (الكود الخاص بالتابات كما هو) ...
        const tabButtons = tabContainer.querySelectorAll('.tab-btn');
        const portfolioContents = document.querySelectorAll('.portfolio-content');

        tabContainer.addEventListener('click', (e) => {
            const clickedButton = e.target.closest('.tab-btn');
            if (!clickedButton) return;

            tabButtons.forEach(btn => btn.classList.remove('active'));
            portfolioContents.forEach(content => content.classList.remove('active'));

            clickedButton.classList.add('active');

            const tabId = clickedButton.getAttribute('data-tab');
            const activeContent = document.getElementById(tabId);
            if (activeContent) {
                activeContent.classList.add('active');
            }
        });
    }

});
// --- 8. (Unchanged) Portfolio Tabs (Services Page) ---
    const tabContainer = document.querySelector('.portfolio-tabs');
    if (tabContainer) {
        
        const tabButtons = tabContainer.querySelectorAll('.tab-btn');
        const portfolioContents = document.querySelectorAll('.portfolio-content');

        tabContainer.addEventListener('click', (e) => {
            const clickedButton = e.target.closest('.tab-btn');
            if (!clickedButton) return;

            // إخفاء كل المحتويات وإلغاء تنشيط كل الأزرار
            tabButtons.forEach(btn => btn.classList.remove('active'));
            portfolioContents.forEach(content => content.classList.remove('active'));

            // تنشيط الزر المضغوط والمحتوى الخاص به
            clickedButton.classList.add('active');
            const tabId = clickedButton.getAttribute('data-tab');
            const activeContent = document.getElementById(tabId);
            
            if (activeContent) {
                activeContent.classList.add('active');
            }
        });
    }