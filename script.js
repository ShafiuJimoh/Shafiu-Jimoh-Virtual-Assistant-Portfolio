/* ==========================================================================
   SHAFIU JIMOH PORTFOLIO
   Restrained interactivity: navigation state, one scroll reveal, a skills
   tab switcher, the contact form, and a back-to-top control. No cursor
   trails, no tilt effects, no fabricated counters.
   ========================================================================== */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initMobileMenu();
    initReveal();
    initSkillTabs();
    initContactForm();
    initBackToTop();
});

/* ----------------------------------------------------------------------
   Navigation: background on scroll + active link highlighting
   ---------------------------------------------------------------------- */
function initNav() {
    const nav = document.getElementById('siteNav');
    const links = document.querySelectorAll('.nav-link');
    if (!nav) return;

    const sections = document.querySelectorAll('section[id]');

    function onScroll() {
        if (window.scrollY > 40) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');

        let current = '';
        sections.forEach((section) => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            if (window.scrollY >= top - 180 && window.scrollY < top + height - 180) {
                current = section.id;
            }
        });

        links.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + current);
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    links.forEach((link) => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
            closeMobileMenu();
        });
    });
}

/* ----------------------------------------------------------------------
   Mobile menu
   ---------------------------------------------------------------------- */
function initMobileMenu() {
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    if (!toggle || !links) return;

    toggle.addEventListener('click', () => {
        const isOpen = links.classList.toggle('active');
        toggle.classList.toggle('active', isOpen);
        toggle.setAttribute('aria-expanded', String(isOpen));
    });
}

function closeMobileMenu() {
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    if (!toggle || !links) return;
    links.classList.remove('active');
    toggle.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
}

/* ----------------------------------------------------------------------
   Scroll reveal: a single restrained fade-up, respects reduced motion
   ---------------------------------------------------------------------- */
function initReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
        items.forEach((el) => el.classList.add('in'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    items.forEach((el) => observer.observe(el));
}

/* ----------------------------------------------------------------------
   Skills tabs
   ---------------------------------------------------------------------- */
function initSkillTabs() {
    const tabs = document.querySelectorAll('.skill-tab');
    if (!tabs.length) return;

    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            const targetId = tab.getAttribute('data-target');

            tabs.forEach((t) => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');

            document.querySelectorAll('.skill-panel').forEach((panel) => {
                panel.classList.toggle('active', panel.id === targetId);
            });
        });
    });
}

/* ----------------------------------------------------------------------
   Contact form
   ---------------------------------------------------------------------- */
function initContactForm() {
    const form = document.getElementById('contactForm');
    const note = document.getElementById('formNote');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const button = form.querySelector('button[type="submit"]');
        const originalContent = button.innerHTML;
        button.innerHTML = '<span>Sending</span><i class="fas fa-spinner fa-spin"></i>';
        button.disabled = true;

        const data = new FormData(form);
        const payload = Object.fromEntries(data);

        try {
            const response = await fetch('https://formsubmit.co/ajax/shafiujimoh2003@gmail.com', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                showNote(note, 'Message sent. I aim to respond within one business day.', 'success');
                form.reset();
            } else {
                throw new Error('Delivery failed');
            }
        } catch (err) {
            showNote(note, 'Something went wrong sending that message. Please email me directly at shafiujimoh2003@gmail.com.', 'error');
        }

        button.innerHTML = originalContent;
        button.disabled = false;
    });
}

function showNote(el, text, type) {
    if (!el) return;
    el.textContent = text;
    el.className = `form-note ${type}`;
    setTimeout(() => {
        el.className = 'form-note';
    }, 7000);
}

/* ----------------------------------------------------------------------
   Back to top
   ---------------------------------------------------------------------- */
function initBackToTop() {
    const button = document.getElementById('backTop');
    if (!button) return;

    window.addEventListener('scroll', () => {
        button.classList.toggle('show', window.scrollY > 600);
    }, { passive: true });

    button.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
