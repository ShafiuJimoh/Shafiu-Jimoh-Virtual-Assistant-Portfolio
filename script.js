/* ==========================================================================
   SHAFIU JIMOH PORTFOLIO
   Core interactivity (navigation state, scroll reveal, skills tabs, contact
   form, back-to-top) plus a cohesive immersive layer: an ink-and-brass
   preloader, a lantern cursor, drifting hero motes, a live Abuja time chip,
   a chapter progress rail, a keyboard-first command palette, an optional
   ambient sound toggle and magnetic buttons. Everything degrades cleanly
   and respects prefers-reduced-motion; nothing here fabricates data.
   ========================================================================== */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initNav();
    initMobileMenu();
    initReveal();
    initSkillTabs();
    initContactForm();
    initBackToTop();
    initLanternCursor();
    initHeroMotes();
    initLocalTimeChip();
    initProgressRail();
    initCommandPalette();
    initAmbientSound();
    initMagneticButtons();
    initPortraitTilt();
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

/* ----------------------------------------------------------------------
   Preloader: a brief ink-and-brass entrance, then reveal the page.
   Skipped instantly for reduced-motion users and capped at 1.4s so it
   never blocks access to content.
   ---------------------------------------------------------------------- */
function initPreloader() {
    const body = document.body;
    const preloader = document.getElementById('preloader');
    const arc = document.querySelector('.preloader-arc');
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!preloader || prefersReduced) {
        body.classList.remove('is-loading');
        body.classList.add('preloader-done');
        return;
    }

    requestAnimationFrame(() => {
        if (arc) arc.style.strokeDashoffset = '0';
    });

    const finish = () => {
        body.classList.remove('is-loading');
        body.classList.add('preloader-done');
    };

    window.addEventListener('load', () => setTimeout(finish, 500));
    setTimeout(finish, 1400); // hard cap so a slow asset never traps the visitor
}

/* ----------------------------------------------------------------------
   Lantern cursor: a soft brass glow and ring that trail the pointer,
   widening over interactive elements. Fine-pointer devices only.
   ---------------------------------------------------------------------- */
function initLanternCursor() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const glow = document.getElementById('lanternGlow');
    const ring = document.getElementById('cursorRing');
    const dot = document.getElementById('cursorDot');
    if (!glow || !ring || !dot) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let glowX = mouseX;
    let glowY = mouseY;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        ring.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    function animateGlow() {
        glowX += (mouseX - glowX) * 0.08;
        glowY += (mouseY - glowY) * 0.08;
        glow.style.transform = `translate(${glowX}px, ${glowY}px)`;
        requestAnimationFrame(animateGlow);
    }
    animateGlow();

    const interactive = 'a, button, .btn, .cert-card, .service-card, .timeline-card, input, textarea, .skill-tab';
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(interactive)) ring.classList.add('is-active');
    });
    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(interactive)) ring.classList.remove('is-active');
    });
}

/* ----------------------------------------------------------------------
   Hero motes: a handful of slow, drifting brass particles rendered on a
   canvas behind the hero copy, evoking dust in lamplight. Purely
   decorative, paused off-screen and for reduced-motion users.
   ---------------------------------------------------------------------- */
function initHeroMotes() {
    const canvas = document.getElementById('heroMotes');
    const hero = document.getElementById('top');
    if (!canvas || !hero) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    let width, height, motes, rafId;
    let running = true;

    function resize() {
        width = canvas.width = hero.offsetWidth;
        height = canvas.height = hero.offsetHeight;
        const count = width < 700 ? 18 : 34;
        motes = Array.from({ length: count }, () => spawnMote());
    }

    function spawnMote() {
        return {
            x: Math.random() * width,
            y: Math.random() * height,
            r: Math.random() * 1.6 + 0.4,
            speedY: Math.random() * 0.18 + 0.05,
            drift: Math.random() * 0.3 - 0.15,
            alpha: Math.random() * 0.35 + 0.1,
            phase: Math.random() * Math.PI * 2,
        };
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);
        motes.forEach((m) => {
            m.y -= m.speedY;
            m.x += Math.sin(m.phase) * 0.06 + m.drift * 0.01;
            m.phase += 0.01;
            if (m.y < -10) { m.y = height + 10; m.x = Math.random() * width; }
            ctx.beginPath();
            ctx.fillStyle = `rgba(201, 161, 90, ${m.alpha})`;
            ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
            ctx.fill();
        });
        if (running) rafId = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener('resize', resize, { passive: true });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            running = entry.isIntersecting;
            if (running && !rafId) draw();
        });
    }, { threshold: 0.05 });
    observer.observe(hero);
}

/* ----------------------------------------------------------------------
   Local time chip: shows the current time in Abuja (WAT, UTC+1) so a
   visitor anywhere can gauge overlap at a glance. Uses Intl time zone
   conversion rather than a hardcoded offset, and never fabricates data.
   ---------------------------------------------------------------------- */
function initLocalTimeChip() {
    const textEl = document.getElementById('localTimeText');
    const iconEl = document.getElementById('localTimeIcon');
    if (!textEl) return;

    function update() {
        try {
            const now = new Date();
            const formatter = new Intl.DateTimeFormat('en-GB', {
                timeZone: 'Africa/Lagos',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
            });
            const timeStr = formatter.format(now);
            const hour = parseInt(
                new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Lagos', hour: 'numeric', hour12: false }).format(now),
                10
            );
            const isDaytime = hour >= 6 && hour < 19;
            textEl.textContent = `${timeStr} in Abuja (WAT)`;
            if (iconEl) iconEl.className = isDaytime ? 'fas fa-sun' : 'fas fa-moon';
        } catch (err) {
            textEl.textContent = 'Abuja, Nigeria \u2014 WAT (UTC+1)';
        }
    }

    update();
    setInterval(update, 30000);
}

/* ----------------------------------------------------------------------
   The Ledger: fixed chapter progress rail. Highlights the active
   section and fills a hairline track with overall scroll depth.
   ---------------------------------------------------------------------- */
function initProgressRail() {
    const rail = document.getElementById('progressRail');
    const fill = document.getElementById('progressRailFill');
    if (!rail || !fill) return;

    const links = rail.querySelectorAll('a[data-rail]');
    const sections = Array.from(links)
        .map((link) => document.getElementById(link.getAttribute('data-rail')))
        .filter(Boolean);

    function onScroll() {
        const doc = document.documentElement;
        const scrollTop = window.scrollY;
        const total = doc.scrollHeight - window.innerHeight;
        const pct = total > 0 ? Math.min(100, (scrollTop / total) * 100) : 0;
        fill.style.height = pct + '%';

        let current = sections[0];
        sections.forEach((section) => {
            if (scrollTop >= section.offsetTop - window.innerHeight * 0.5) {
                current = section;
            }
        });

        links.forEach((link) => {
            link.classList.toggle('active', current && link.getAttribute('data-rail') === current.id);
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();
}

/* ----------------------------------------------------------------------
   The Call Bell: a keyboard-first command palette (press "/" or the
   nav button) for jumping to any section or firing a quick action.
   ---------------------------------------------------------------------- */
function initCommandPalette() {
    const palette = document.getElementById('commandPalette');
    const trigger = document.getElementById('paletteTrigger');
    const backdrop = document.getElementById('paletteBackdrop');
    const input = document.getElementById('paletteInput');
    const list = document.getElementById('paletteList');
    if (!palette || !input || !list) return;

    const commands = [
        { label: 'About', hint: 'Section', icon: 'fa-user', action: () => scrollToId('about') },
        { label: 'Results', hint: 'Section', icon: 'fa-chart-line', action: () => scrollToId('results') },
        { label: 'Skills', hint: 'Section', icon: 'fa-toolbox', action: () => scrollToId('skills') },
        { label: 'Services', hint: 'Section', icon: 'fa-briefcase', action: () => scrollToId('services') },
        { label: 'Experience', hint: 'Section', icon: 'fa-timeline', action: () => scrollToId('experience') },
        { label: 'Credentials', hint: 'Section', icon: 'fa-award', action: () => scrollToId('credentials') },
        { label: 'Contact', hint: 'Section', icon: 'fa-envelope', action: () => scrollToId('contact') },
        { label: 'Send an email', hint: 'Action', icon: 'fa-paper-plane', action: () => { window.location.href = 'mailto:shafiujimoh2003@gmail.com'; } },
        { label: 'Open LinkedIn', hint: 'Action', icon: 'fa-linkedin', action: () => window.open('https://www.linkedin.com/in/shafiujimoh', '_blank', 'noopener') },
        { label: 'Back to top', hint: 'Action', icon: 'fa-arrow-up', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
    ];

    let selectedIndex = 0;
    let filtered = commands.slice();

    function scrollToId(id) {
        const target = document.getElementById(id);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function render() {
        list.innerHTML = '';
        if (!filtered.length) {
            const empty = document.createElement('div');
            empty.className = 'command-palette-empty';
            empty.textContent = 'No matches. Try “services” or “contact”.';
            list.appendChild(empty);
            return;
        }
        filtered.forEach((cmd, i) => {
            const li = document.createElement('li');
            li.className = i === selectedIndex ? 'is-selected' : '';
            li.innerHTML = `<i class="fas ${cmd.icon}"></i><span>${cmd.label}</span><span class="pk-hint">${cmd.hint}</span>`;
            li.addEventListener('click', () => runCommand(cmd));
            list.appendChild(li);
        });
    }

    function runCommand(cmd) {
        cmd.action();
        closePalette();
    }

    function openPalette() {
        palette.hidden = false;
        selectedIndex = 0;
        filtered = commands.slice();
        input.value = '';
        render();
        setTimeout(() => input.focus(), 20);
        document.body.style.overflow = 'hidden';
    }

    function closePalette() {
        palette.hidden = true;
        document.body.style.overflow = '';
    }

    if (trigger) trigger.addEventListener('click', openPalette);
    if (backdrop) backdrop.addEventListener('click', closePalette);

    input.addEventListener('input', () => {
        const q = input.value.trim().toLowerCase();
        filtered = commands.filter((cmd) => cmd.label.toLowerCase().includes(q) || cmd.hint.toLowerCase().includes(q));
        selectedIndex = 0;
        render();
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedIndex = Math.min(selectedIndex + 1, filtered.length - 1);
            render();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedIndex = Math.max(selectedIndex - 1, 0);
            render();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (filtered[selectedIndex]) runCommand(filtered[selectedIndex]);
        } else if (e.key === 'Escape') {
            closePalette();
        }
    });

    document.addEventListener('keydown', (e) => {
        const tag = (e.target.tagName || '').toLowerCase();
        const typing = tag === 'input' || tag === 'textarea' || e.target.isContentEditable;
        if (e.key === '/' && !typing) {
            e.preventDefault();
            openPalette();
        } else if (e.key === 'Escape' && !palette.hidden) {
            closePalette();
        }
    });
}

/* ----------------------------------------------------------------------
   Ambient sound toggle: a muted-by-default gramophone control. Audio
   only ever plays after an explicit click, respecting autoplay norms
   and quiet preferences.
   ---------------------------------------------------------------------- */
function initAmbientSound() {
    const toggle = document.getElementById('ambientToggle');
    const audio = document.getElementById('ambientAudio');
    if (!toggle || !audio) return;

    audio.volume = 0.35;

    toggle.addEventListener('click', () => {
        const isPlaying = toggle.getAttribute('aria-pressed') === 'true';
        if (isPlaying) {
            audio.pause();
            toggle.setAttribute('aria-pressed', 'false');
            toggle.setAttribute('aria-label', 'Play ambient study sound');
        } else {
            audio.play().catch(() => { /* ignore autoplay restrictions */ });
            toggle.setAttribute('aria-pressed', 'true');
            toggle.setAttribute('aria-label', 'Pause ambient study sound');
        }
    });
}

/* ----------------------------------------------------------------------
   Magnetic buttons: primary buttons drift a few pixels toward the
   cursor while hovered, snapping back on leave. Fine-pointer only.
   ---------------------------------------------------------------------- */
function initMagneticButtons() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const targets = document.querySelectorAll('.btn-primary, .ambient-toggle');
    targets.forEach((el) => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            el.style.transform = `translate(${x * 0.18}px, ${y * 0.28}px)`;
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = '';
        });
    });
}

/* ----------------------------------------------------------------------
   Portrait tilt: the hero portrait tilts a few degrees toward the
   pointer for a light sense of depth. Fine-pointer only.
   ---------------------------------------------------------------------- */
function initPortraitTilt() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const card = document.getElementById('heroProfileCard');
    const frame = document.getElementById('heroPortraitFrame');
    if (!card || !frame) return;

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `rotateY(${x * 6}deg) rotateX(${y * -6}deg)`;
        frame.style.transform = `translate(${x * -6}px, ${y * -6}px)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        frame.style.transform = '';
    });
}
