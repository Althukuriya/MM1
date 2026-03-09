// js/animations.js
document.addEventListener('DOMContentLoaded', () => {
    // Parallax effect
    window.addEventListener('scroll', () => {
        const hero = document.querySelector('.hero-banner-slider');
        if (hero) {
            const scrolled = window.pageYOffset;
            hero.style.transform = `translateY(${scrolled * 0.05}px)`;
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Counter animation for stats
    const stats = document.querySelectorAll('.stat-number');
    if (stats.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const target = parseInt(element.textContent.replace(/[^0-9]/g, ''));
                    let current = 0;
                    const increment = target / 50;
                    
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            element.textContent = target + (element.textContent.includes('+') ? '+' : '');
                            clearInterval(timer);
                        } else {
                            element.textContent = Math.floor(current) + (element.textContent.includes('+') ? '+' : '');
                        }
                    }, 20);
                    
                    observer.unobserve(element);
                }
            });
        }, { threshold: 0.5 });
        
        stats.forEach(stat => observer.observe(stat));
    }

    // Floating animation for cards
    const cards = document.querySelectorAll('.vehicle-card, .category-card, .feature-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});