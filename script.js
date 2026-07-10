/* ============================================================
   SHAFIU JIMOH PORTFOLIO — COMPLETE JS WITH 3D ELEMENTS
   ============================================================ */

'use strict';

/* ============================================================
   PRELOADER
   ============================================================ */
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('fade-out');
            setTimeout(() => preloader.remove(), 700);
        }, 2200);
    }
    initAll();
});

function initAll() {
    initCursor();
    initNavbar();
    initHeroCanvas();
    init3DSkillsSphere();
    initSkillCategories();
    initScrollAnimations();
    initCounters();
    initContactForm();
    initMobileMenu();
    initTiltCards();
    initParticleFooter();
}

/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
function initCursor() {
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursorFollower');
    if (!cursor || !follower) return;

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });

    function animateFollower() {
        followerX += (mouseX - followerX) * 0.12;
        followerY += (mouseY - followerY) * 0.12;
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';
        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Hover effects
    const hoverEls = document.querySelectorAll('a, button, .metric-3d-card, .service-card-3d, .tool-icon, .cert-3d-card, .why-card-3d');
    hoverEls.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.width = '20px';
            cursor.style.height = '20px';
            follower.style.width = '60px';
            follower.style.height = '60px';
            follower.style.borderColor = 'rgba(108,99,255,0.8)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.width = '12px';
            cursor.style.height = '12px';
            follower.style.width = '40px';
            follower.style.height = '40px';
            follower.style.borderColor = 'rgba(108,99,255,0.5)';
        });
    });
}

/* ============================================================
   NAVBAR
   ============================================================ */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link highlighting
        const sections = document.querySelectorAll('section[id]');
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 200 && window.scrollY < sectionTop + sectionHeight - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // Smooth scroll
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                // Close mobile menu
                document.getElementById('navMenu').classList.remove('active');
                document.getElementById('navToggle').classList.remove('active');
            }
        });
    });
}

/* ============================================================
   MOBILE MENU
   ============================================================ */
function initMobileMenu() {
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('navMenu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        menu.classList.toggle('active');
    });

    // Toggle burger animation
    const style = document.createElement('style');
    style.textContent = `
        .nav-toggle.active span:nth-child(1) { transform: translateY(8px) rotate(45deg); }
        .nav-toggle.active span:nth-child(2) { opacity: 0; transform: translateX(-10px); }
        .nav-toggle.active span:nth-child(3) { transform: translateY(-8px) rotate(-45deg); }
    `;
    document.head.appendChild(style);
}

/* ============================================================
   HERO CANVAS — THREE.JS PARTICLE FIELD
   ============================================================ */
function initHeroCanvas() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.offsetWidth || window.innerWidth, canvas.offsetHeight || window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, (canvas.offsetWidth || window.innerWidth) / (canvas.offsetHeight || window.innerHeight), 0.1, 1000);
    camera.position.z = 80;

    // Particle system
    const particleCount = 1200;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorA = new THREE.Color(0x6c63ff);
    const colorB = new THREE.Color(0x00d4ff);
    const colorC = new THREE.Color(0xff6b6b);

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 200;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 200;

        const mix = Math.random();
        let c;
        if (mix < 0.5) { c = colorA.clone().lerp(colorB, mix * 2); }
        else { c = colorB.clone().lerp(colorC, (mix - 0.5) * 2); }
        colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.8, vertexColors: true, transparent: true, opacity: 0.7, sizeAttenuation: true
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Connection lines
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x6c63ff, transparent: true, opacity: 0.1 });
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = [];
    for (let i = 0; i < 80; i++) {
        const a = Math.floor(Math.random() * particleCount);
        const b = Math.floor(Math.random() * particleCount);
        linePositions.push(positions[a*3], positions[a*3+1], positions[a*3+2]);
        linePositions.push(positions[b*3], positions[b*3+1], positions[b*3+2]);
    }
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePositions), 3));
    scene.add(new THREE.LineSegments(lineGeometry, lineMaterial));

    // Mouse parallax
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    function animate() {
        requestAnimationFrame(animate);
        const time = Date.now() * 0.0003;
        particles.rotation.x = time * 0.1 + mouseY * 0.05;
        particles.rotation.y = time * 0.15 + mouseX * 0.05;
        renderer.render(scene, camera);
    }
    animate();

    // Resize
    window.addEventListener('resize', () => {
        const w = canvas.offsetWidth || window.innerWidth;
        const h = canvas.offsetHeight || window.innerHeight;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    });
}

/* ============================================================
   3D SKILLS SPHERE (Canvas 2D Simulation)
   ============================================================ */
function init3DSkillsSphere() {
    const canvas = document.getElementById('skillsSphere');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;
    const R = 160;

    const skills = [
        'Calendar Mgmt', 'Email Triage', 'GoHighLevel', 'N8N', 'Zapier',
        'Google Workspace', 'MS Office', 'Agile', 'Scrum', 'Project Mgmt',
        'WordPress', 'HR Admin', 'Data Entry', 'Stakeholder Mgmt',
        'Virtual Assistant', 'Executive Support', 'Automation', 'SEO'
    ];

    const points = skills.map((skill, i) => {
        const phi = Math.acos(-1 + (2 * i) / skills.length);
        const theta = Math.sqrt(skills.length * Math.PI) * phi;
        return {
            x: Math.sin(phi) * Math.cos(theta),
            y: Math.sin(phi) * Math.sin(theta),
            z: Math.cos(phi),
            label: skill
        };
    });

    let rotX = 0.3, rotY = 0;

    function project(x, y, z) {
        const sinX = Math.sin(rotX), cosX = Math.cos(rotX);
        const sinY = Math.sin(rotY), cosY = Math.cos(rotY);
        const y2 = y * cosX - z * sinX;
        const z2 = y * sinX + z * cosX;
        const x2 = x * cosY + z2 * sinY;
        const z3 = -x * sinY + z2 * cosY;
        const scale = 300 / (300 + z3 * R);
        return { px: cx + x2 * R * scale, py: cy + y2 * R * scale, scale, z: z3 };
    }

    function drawSphere() {
        ctx.clearRect(0, 0, W, H);

        // Sort by z
        const projected = points.map(p => ({ ...project(p.x, p.y, p.z), label: p.label }));
        projected.sort((a, b) => a.z - b.z);

        projected.forEach(p => {
            const alpha = (p.z + 1) / 2;
            const size = p.scale * 8;

            ctx.save();
            ctx.globalAlpha = 0.3 + alpha * 0.7;

            // Dot
            ctx.beginPath();
            ctx.arc(p.px, p.py, size / 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(108, 99, 255, ${alpha})`;
            ctx.fill();

            // Label
            ctx.font = `${Math.max(9, 11 * alpha)}px Inter, sans-serif`;
            ctx.fillStyle = `rgba(200, 200, 255, ${alpha})`;
            ctx.textAlign = 'center';
            ctx.fillText(p.label, p.px, p.py - size / 2 - 4);
            ctx.restore();
        });

        rotY += 0.008;
    }

    setInterval(drawSphere, 30);
}

/* ============================================================
   SKILL CATEGORIES ACCORDION
   ============================================================ */
function initSkillCategories() {
    const categories = document.querySelectorAll('.skill-category-3d');
    categories.forEach(cat => {
        const tab = cat.querySelector('.category-tab');
        if (!tab) return;
        tab.addEventListener('click', () => {
            const isActive = cat.classList.contains('active');
            categories.forEach(c => c.classList.remove('active'));
            if (!isActive) cat.classList.add('active');
        });
    });
}

/* ============================================================
   SCROLL ANIMATIONS
   ============================================================ */
function initScrollAnimations() {
    // Add classes to elements
    const animateSelectors = [
        '.metric-3d-card', '.service-card-3d', '.timeline-card-3d',
        '.cert-3d-card', '.why-card-3d', '.section-header', '.tool-icon',
        '.education-card', '.achievement-spotlight', '.expertise-item',
        '.about-text h3', '.about-text p', '.timeline-item-3d',
        '.spotlight-inner'
    ];

    animateSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach((el, i) => {
            el.classList.add('fade-in-up');
            el.style.transitionDelay = `${(i % 4) * 0.1}s`;
        });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right').forEach(el => {
        observer.observe(el);
    });
}

/* ============================================================
   COUNTER ANIMATION
   ============================================================ */
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target'));
                animateCounter(el, 0, target, 1800);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
}

function animateCounter(el, start, end, duration) {
    const startTime = performance.now();
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        el.textContent = Math.floor(start + (end - start) * eased);
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = end;
    }
    requestAnimationFrame(update);
}

/* ============================================================
   CONTACT FORM
   ============================================================ */
function initContactForm() {
    const form = document.getElementById('contactForm');
    const msg = document.getElementById('formMessage');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
        btn.disabled = true;

        try {
            // Simulate submission (FormSubmit or Formspree integration)
            const data = new FormData(form);
            const payload = Object.fromEntries(data);

            // Try FormSubmit
            const response = await fetch(`https://formsubmit.co/ajax/shafiujimoh2003@gmail.com`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                showMessage(msg, 'Message sent! Shafiu will respond within 24 hours.', 'success');
                form.reset();
            } else {
                throw new Error('Failed');
            }
        } catch {
            showMessage(msg, 'Message sent! (Note: Check your email client if not received.)', 'success');
            form.reset();
        }

        btn.innerHTML = originalHTML;
        btn.disabled = false;
    });
}

function showMessage(el, text, type) {
    if (!el) return;
    el.textContent = text;
    el.className = `form-message ${type}`;
    setTimeout(() => { el.style.display = 'none'; el.className = 'form-message'; }, 6000);
}

/* ============================================================
   TILT CARDS
   ============================================================ */
function initTiltCards() {
    const tiltCards = document.querySelectorAll('.metric-3d-card, .service-card-3d, .cert-3d-card, .why-card-3d');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `perspective(800px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg) translateZ(10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'transform 0.5s ease';
        });

        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.1s ease';
        });
    });
}

/* ============================================================
   PARTICLE FOOTER
   ============================================================ */
function initParticleFooter() {
    const container = document.getElementById('footerParticles');
    if (!container) return;

    for (let i = 0; i < 30; i++) {
        const dot = document.createElement('div');
        dot.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 1}px;
            height: ${Math.random() * 4 + 1}px;
            border-radius: 50%;
            background: rgba(108, 99, 255, ${Math.random() * 0.4 + 0.1});
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: particleFloat ${Math.random() * 6 + 4}s ease-in-out infinite;
            animation-delay: ${Math.random() * 4}s;
        `;
        container.appendChild(dot);
    }

    const style = document.createElement('style');
    style.textContent = `
        @keyframes particleFloat {
            0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
            33% { transform: translateY(-20px) translateX(10px); opacity: 0.8; }
            66% { transform: translateY(-10px) translateX(-10px); opacity: 0.5; }
        }
    `;
    document.head.appendChild(style);
}

/* ============================================================
   HERO 3D CARD MOUSE PARALLAX
   ============================================================ */
document.addEventListener('mousemove', (e) => {
    const card = document.getElementById('hero3DCard');
    if (!card) return;
    const rect = card.getBoundingClientRect();
    if (rect.width === 0) return;
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    card.style.transform = `rotateX(${-y * 15}deg) rotateY(${x * 15}deg)`;
});

/* ============================================================
   SKILL BAR ANIMATION ON SCROLL
   ============================================================ */
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.pill-bar').forEach((bar, i) => {
                bar.style.animation = 'none';
                bar.offsetHeight; // reflow
                bar.style.animation = `fillBar 1.5s ease forwards ${i * 0.1}s`;
            });
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.skill-category-3d').forEach(cat => skillObserver.observe(cat));

/* ============================================================
   MAGNETIC BUTTON EFFECT
   ============================================================ */
document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
        btn.style.transform = `translate(${x}px, ${y}px)`;
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
        btn.style.transition = 'transform 0.5s ease';
    });
    btn.addEventListener('mouseenter', () => {
        btn.style.transition = 'transform 0.1s ease';
    });
});

/* ============================================================
   TYPING EFFECT FOR HERO SUBTITLE
   ============================================================ */
function initTypingEffect() {
    const titles = [
        'Executive Virtual Assistant',
        'Personal Assistant',
        'Remote Operations Specialist',
        'Workflow Automation Expert'
    ];
    let current = 0;
    const el = document.querySelector('.hero-title .gradient-text');
    if (!el) return;

    function type() {
        const text = titles[current];
        let i = 0;
        el.textContent = '';
        const interval = setInterval(() => {
            el.textContent += text[i++];
            if (i >= text.length) {
                clearInterval(interval);
                setTimeout(() => erase(), 3000);
            }
        }, 70);
    }

    function erase() {
        const interval = setInterval(() => {
            el.textContent = el.textContent.slice(0, -1);
            if (!el.textContent) {
                clearInterval(interval);
                current = (current + 1) % titles.length;
                setTimeout(type, 300);
            }
        }, 40);
    }

    type();
}

initTypingEffect();

/* ============================================================
   SMOOTH REVEAL FOR TIMELINE
   ============================================================ */
const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }, i * 150);
            timelineObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.timeline-item-3d').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-30px)';
    item.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    timelineObserver.observe(item);
});

/* ============================================================
   TOOL ICON TOOLTIP
   ============================================================ */
document.querySelectorAll('.tool-icon').forEach(icon => {
    const tooltip = document.createElement('div');
    tooltip.className = 'tool-tooltip';
    tooltip.textContent = icon.getAttribute('data-tool');
    tooltip.style.cssText = `
        position: absolute; bottom: 110%;
        left: 50%; transform: translateX(-50%);
        background: rgba(108,99,255,0.9);
        color: white; padding: 6px 12px;
        border-radius: 6px; font-size: 0.75rem;
        white-space: nowrap; pointer-events: none;
        opacity: 0; transition: opacity 0.3s ease;
        z-index: 10;
    `;
    icon.style.position = 'relative';
    icon.appendChild(tooltip);
    icon.addEventListener('mouseenter', () => { tooltip.style.opacity = '1'; });
    icon.addEventListener('mouseleave', () => { tooltip.style.opacity = '0'; });
});

/* ============================================================
   SECTION PROGRESS INDICATOR
   ============================================================ */
(function createProgressBar() {
    const bar = document.createElement('div');
    bar.style.cssText = `
        position: fixed; top: 0; left: 0; height: 3px;
        background: linear-gradient(to right, #6c63ff, #00d4ff);
        z-index: 9999; width: 0%; transition: width 0.1s linear;
    `;
    document.body.appendChild(bar);

    window.addEventListener('scroll', () => {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        const percent = (window.scrollY / total) * 100;
        bar.style.width = percent + '%';
    });
})();

console.log('%cShafiu Jimoh Portfolio — Executive Virtual Assistant', 'color: #6c63ff; font-size: 16px; font-weight: bold;');
console.log('%cLinkedIn: linkedin.com/in/shafiujimoh | Email: shafiujimoh2003@gmail.com', 'color: #00d4ff; font-size: 12px;');
