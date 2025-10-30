/*
  ملف JAVASCRIPT مُبسط
  تم إزالة أكواد الأنيميشن (GSAP) التي تسبب توقف السكريبت
  يحتوي فقط على الأكواد الأساسية
*/

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. (Unchanged) Mobile Navigation ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    // --- 2. (Unchanged) Stats Counter ---
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsSection = document.querySelector('.stats-section'); 

    const startCounter = (el) => {
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

    // --- 3. (Unchanged) Sticky Nav Styling ---
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

    // --- 4. (The Fix) Portfolio Tabs (Services Page) ---
    // هذا هو الكود المسؤول عن تبديل المحتوى
    const tabContainer = document.querySelector('.portfolio-tabs');
    if (tabContainer) {
        
        const tabButtons = tabContainer.querySelectorAll('.tab-btn');
        const portfolioContents = document.querySelectorAll('.portfolio-content');

        tabContainer.addEventListener('click', (e) => {
            const clickedButton = e.target.closest('.tab-btn');
            if (!clickedButton) return;

            // 1. إخفاء كل المحتويات وإلغاء تنشيط كل الأزرار
            tabButtons.forEach(btn => btn.classList.remove('active'));
            portfolioContents.forEach(content => content.classList.remove('active'));

            // 2. تنشيط الزر المضغوط والمحتوى الخاص به
            clickedButton.classList.add('active');
            const tabId = clickedButton.getAttribute('data-tab');
            const activeContent = document.getElementById(tabId);
            
            if (activeContent) {
                activeContent.classList.add('active');
            }
        });
    }

}); // <-- نهاية السكريبت