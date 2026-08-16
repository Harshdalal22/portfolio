/**
 * Harsh Dalal - Portfolio JavaScript
 * Handles 3D interactions, particle systems, scroll animations, and UI logic.
 */

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initCursorGlow();
    initScrollAnimations();
    initTiltCards();
    initStatsCounter();
    initNavbar();
    initTimeline();
    initContactForm();
});

/* ============================================
   PARTICLE SYSTEM
   ============================================ */
function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 80;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }

        draw() {
            ctx.fillStyle = `rgba(162, 89, 255, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }

    animate();
}

/* ============================================
   CURSOR GLOW EFFECT
   ============================================ */
function initCursorGlow() {
    const glow = document.getElementById('cursor-glow');
    if (!glow) return;

    window.addEventListener('mousemove', (e) => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    });

    document.addEventListener('mouseleave', () => {
        glow.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        glow.style.opacity = '1';
    });
}

/* ============================================
   SCROLL REVEAL ANIMATIONS
   ============================================ */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // If it's a skill card, trigger bar animation
                if (entry.target.classList.contains('skill-card')) {
                    const bar = entry.target.querySelector('.skill-bar');
                    if (bar) bar.classList.add('animated');
                }
            }
        });
    }, observerOptions);

    // Target multiple elements for reveal
    const animatedElements = document.querySelectorAll('.animate-in, .skill-card, .project-card, .stat-card, .timeline-item, .contact-info-card');
    animatedElements.forEach(el => observer.observe(el));
}

/* ============================================
   3D TILT INTERACTION
   ============================================ */
function initTiltCards() {
    const cards = document.querySelectorAll('.tilt-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        });
    });
}

/* ============================================
   STATS COUNTER
   ============================================ */
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.started) {
                entry.target.dataset.started = 'true';
                animateNumber(entry.target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => observer.observe(stat));

    function animateNumber(card) {
        const numberEl = card.querySelector('.stat-number');
        const countTo = parseInt(card.dataset.count);
        const suffix = card.dataset.suffix;
        let current = 0;
        const duration = 2000;
        const start = performance.now();

        function update(timestamp) {
            const elapsed = timestamp - start;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out function
            const easeOutQuad = t => t * (2 - t);
            current = Math.floor(easeOutQuad(progress) * countTo);

            numberEl.textContent = current + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                numberEl.textContent = countTo + suffix;
            }
        }

        requestAnimationFrame(update);
    }
}

/* ============================================
   NAVBAR LOGIC
   ============================================ */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    const links = document.querySelectorAll('.nav-link');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link tracking
        let current = '';
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // Mobile toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('open');
        });
    }

    // Close menu on link click
    links.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });
}

/* ============================================
   TIMELINE PROGRESS
   ============================================ */
function initTimeline() {
    const progress = document.getElementById('timeline-progress');
    const experienceSection = document.getElementById('experience');

    if (!progress || !experienceSection) return;

    window.addEventListener('scroll', () => {
        const rect = experienceSection.getBoundingClientRect();
        const sectionHeight = experienceSection.offsetHeight;
        const viewHeight = window.innerHeight;

        if (rect.top < viewHeight && rect.bottom > 0) {
            const scrollPercentage = ((viewHeight - rect.top) / (sectionHeight + viewHeight)) * 100;
            progress.style.height = Math.min(Math.max(scrollPercentage, 0), 100) + '%';
        }
    });
}

/* ============================================
   CONTACT FORM
   ============================================ */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const btn = form.querySelector('.btn-submit');
        const originalText = btn.innerHTML;

        // Simple UI feedback
        btn.disabled = true;
        btn.innerHTML = '<span>Sending...</span><i class="fas fa-circle-notch fa-spin"></i>';

        setTimeout(() => {
            btn.innerHTML = '<span>Message Sent!</span><i class="fas fa-check"></i>';
            btn.style.background = '#4ade80';
            form.reset();

            setTimeout(() => {
                btn.disabled = false;
                btn.innerHTML = originalText;
                btn.style.background = '';
            }, 3000);
        }, 1500);
    });
}

// Obsolete 3D interaction code removed as Spline viewer handles its own interactions.
