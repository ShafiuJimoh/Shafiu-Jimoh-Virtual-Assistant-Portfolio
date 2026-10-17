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
    initTooltips();
    initThemeSwitcher();
    initSessionConsole();
    initStatusBar();
    initLightbox();
    initQuickFilters();
    initGithubPulse();
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

/* ----------------------------------------------------------------------
   Tooltip system: one floating element positioned over whichever element
   carries a data-tip attribute, shown on hover/focus. Adapted from the
   same lightweight single-instance pattern hancore.dev uses for its UI
   hints, applied here to the theme switcher, console trigger and
   lightbox triggers.
   ---------------------------------------------------------------------- */
function initTooltips() {
    const tip = document.createElement('div');
    tip.className = 'hc-tip';
    tip.hidden = true;
    tip.setAttribute('role', 'tooltip');
    document.body.appendChild(tip);

    let current = null;

    function place(target) {
        const text = target.getAttribute('data-tip');
        if (!text) { hide(); return; }
        tip.textContent = text;
        tip.hidden = false;
        current = target;
        const box = target.getBoundingClientRect();
        const w = tip.offsetWidth;
        const h = tip.offsetHeight;
        const x = Math.max(6, Math.min(window.innerWidth - w - 6, box.left + box.width / 2 - w / 2));
        const y = box.top - h - 8 < 6 ? box.bottom + 8 : box.top - h - 8;
        tip.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
    }

    function hide() {
        current = null;
        tip.hidden = true;
    }

    document.addEventListener('pointerover', (e) => {
        const target = e.target.closest ? e.target.closest('[data-tip]') : null;
        if (target) place(target); else if (current) hide();
    });
    document.addEventListener('pointerout', (e) => {
        if (current && !(e.relatedTarget instanceof Node && current.contains(e.relatedTarget))) hide();
    });
    document.addEventListener('focusin', (e) => {
        const target = e.target.closest ? e.target.closest('[data-tip]') : null;
        if (target) place(target);
    });
    document.addEventListener('focusout', hide);
    window.addEventListener('scroll', hide, { passive: true, capture: true });
    window.addEventListener('resize', hide);
}

/* ----------------------------------------------------------------------
   Theme switcher: four accent palettes swapped at runtime by toggling a
   class on <body>, directly inspired by hancore.dev's :colorscheme
   command (which recolors the whole editor from a palette file). The
   choice is remembered in localStorage and applies instantly, with no
   page reload and no extra network request.
   ---------------------------------------------------------------------- */
function initThemeSwitcher() {
    const dots = document.querySelectorAll('.theme-dot');
    if (!dots.length) return;
    const STORAGE_KEY = 'sj-portfolio-scheme';
    const schemes = ['default', 'wine', 'moss', 'parchment'];

    function apply(scheme, persist) {
        schemes.forEach((s) => {
            if (s !== 'default') document.body.classList.remove('scheme-' + s);
        });
        if (scheme !== 'default') document.body.classList.add('scheme-' + scheme);
        dots.forEach((dot) => dot.classList.toggle('active', dot.getAttribute('data-scheme') === scheme));
        if (persist) {
            try { localStorage.setItem(STORAGE_KEY, scheme); } catch (err) { /* storage unavailable */ }
        }
        return scheme;
    }

    let saved = 'default';
    try { saved = localStorage.getItem(STORAGE_KEY) || 'default'; } catch (err) { /* ignore */ }
    if (!schemes.includes(saved)) saved = 'default';
    apply(saved, false);

    dots.forEach((dot) => {
        dot.addEventListener('click', () => apply(dot.getAttribute('data-scheme'), true));
    });

    window.__sjApplyTheme = (name) => {
        const match = schemes.find((s) => s === name);
        if (!match) return null;
        return apply(match, true);
    };
}

/* ----------------------------------------------------------------------
   Session console: a small command-driven panel, directly inspired by
   hancore.dev's terminal-as-navigation concept (its editor reads ":e",
   ":colorscheme" and similar vim-style commands to move around). Here a
   short vocabulary of commands lets a visitor jump to any section, open
   quick actions or switch the accent colour without ever leaving the
   keyboard. It is entirely optional: every destination it reaches is
   also reachable from the normal nav and footer.
   ---------------------------------------------------------------------- */
function initSessionConsole() {
    const panel = document.getElementById('sessionConsole');
    const trigger = document.getElementById('consoleTrigger');
    const backdrop = document.getElementById('consoleBackdrop');
    const closeBtn = document.getElementById('consoleClose');
    const log = document.getElementById('consoleLog');
    const input = document.getElementById('consoleInput');
    const hints = document.querySelectorAll('.console-hints button');
    if (!panel || !log || !input) return;

    const SECTION_IDS = ['about', 'results', 'skills', 'services', 'experience', 'credentials', 'contact'];

    function printLine(text, className) {
        const p = document.createElement('p');
        p.className = className || 'line-out';
        p.innerHTML = text;
        log.appendChild(p);
        log.scrollTop = log.scrollHeight;
    }

    function printCommand(text) {
        printLine(escapeHtml(text), 'line-cmd');
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function printTable(rows) {
        const table = document.createElement('table');
        table.className = 'console-table';
        rows.forEach(([key, value]) => {
            const tr = document.createElement('tr');
            const tdKey = document.createElement('td');
            tdKey.textContent = key;
            const tdVal = document.createElement('td');
            tdVal.innerHTML = value;
            tr.append(tdKey, tdVal);
            table.appendChild(tr);
        });
        log.appendChild(table);
        log.scrollTop = log.scrollHeight;
    }

    function greet() {
        log.innerHTML = '';
        printLine('<strong>Session console</strong> &mdash; type <strong>help</strong> for a list of commands.', 'line-out');
    }

    function scrollToSection(id) {
        const target = document.getElementById(id);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    async function runCommand(raw) {
        const text = raw.trim();
        if (!text) return;
        printCommand(text);
        const [cmd, ...rest] = text.toLowerCase().split(/\s+/);
        const arg = rest.join(' ');

        if (cmd === 'help' || cmd === '?') {
            printTable([
                ['open &lt;section&gt;', 'Scroll to about, results, skills, services, experience, credentials or contact'],
                ['whoami', 'A one-line summary'],
                ['stats', 'Live GitHub numbers for this profile'],
                ['resume', 'Open the LinkedIn profile (treated as the public resume)'],
                ['email', 'Open a pre-addressed email'],
                ['theme &lt;name&gt;', 'default, wine, moss or parchment'],
                ['clear', 'Clear this console'],
                ['exit / esc', 'Close the console'],
            ]);
            return;
        }
        if (cmd === 'whoami') {
            printLine('Shafiu Jimoh &mdash; Executive Virtual Assistant &amp; Remote Operations Specialist, Abuja, Nigeria. Calendar management, workflow automation, project coordination.', 'line-out');
            return;
        }
        if (cmd === 'clear') {
            log.innerHTML = '';
            return;
        }
        if (cmd === 'exit' || cmd === 'quit' || cmd === 'q') {
            closeConsole();
            return;
        }
        if (cmd === 'open' || cmd === 'go' || cmd === 'cd') {
            const id = SECTION_IDS.find((section) => section === arg || section.startsWith(arg));
            if (id) {
                printLine(`Opening <strong>#${id}</strong>&hellip;`, 'line-out');
                scrollToSection(id);
                setTimeout(closeConsole, 350);
            } else {
                printLine(`No section matches "${escapeHtml(arg)}". Try: ${SECTION_IDS.join(', ')}`, 'line-err');
            }
            return;
        }
        if (SECTION_IDS.includes(cmd) && !arg) {
            printLine(`Opening <strong>#${cmd}</strong>&hellip;`, 'line-out');
            scrollToSection(cmd);
            setTimeout(closeConsole, 350);
            return;
        }
        if (cmd === 'resume' || cmd === 'linkedin') {
            printLine('Opening LinkedIn in a new tab&hellip;', 'line-link');
            window.open('https://www.linkedin.com/in/shafiujimoh', '_blank', 'noopener');
            return;
        }
        if (cmd === 'email' || cmd === 'contact') {
            printLine('Opening your mail client&hellip;', 'line-out');
            window.location.href = 'mailto:shafiujimoh2003@gmail.com';
            return;
        }
        if (cmd === 'github') {
            printLine('Opening GitHub in a new tab&hellip;', 'line-link');
            window.open('https://github.com/ShafiuJimoh', '_blank', 'noopener');
            return;
        }
        if (cmd === 'theme' || cmd === 'colorscheme' || cmd === 'colo') {
            const valid = ['default', 'wine', 'moss', 'parchment'];
            if (!arg) { printLine(`Current theme hints: ${valid.join(', ')}`, 'line-out'); return; }
            const applied = window.__sjApplyTheme ? window.__sjApplyTheme(arg) : null;
            if (applied) printLine(`Theme set to <strong>${applied}</strong>.`, 'line-out');
            else printLine(`Unknown theme "${escapeHtml(arg)}". Try: ${valid.join(', ')}`, 'line-err');
            return;
        }
        if (cmd === 'stats') {
            printLine('Fetching live GitHub stats&hellip;', 'line-out');
            try {
                const res = await fetch('https://api.github.com/users/ShafiuJimoh');
                if (!res.ok) throw new Error('request failed');
                const data = await res.json();
                printTable([
                    ['public_repos', String(data.public_repos ?? '—')],
                    ['followers', String(data.followers ?? '—')],
                    ['following', String(data.following ?? '—')],
                    ['member since', data.created_at ? new Date(data.created_at).getFullYear() : '—'],
                ]);
            } catch (err) {
                printLine('Could not reach the GitHub API right now. Try again shortly.', 'line-err');
            }
            return;
        }
        if (cmd === 'time') {
            printLine(document.getElementById('localTimeText')?.textContent || 'Time unavailable.', 'line-out');
            return;
        }
        printLine(`Unknown command: "${escapeHtml(cmd)}". Type <strong>help</strong> for options.`, 'line-err');
    }

    function openConsole() {
        panel.hidden = false;
        document.body.style.overflow = 'hidden';
        if (!log.childElementCount) greet();
        setTimeout(() => input.focus(), 20);
    }

    function closeConsole() {
        panel.hidden = true;
        document.body.style.overflow = '';
    }

    if (trigger) trigger.addEventListener('click', openConsole);
    const mobileTrigger = document.getElementById('consoleTriggerMobile');
    if (mobileTrigger) mobileTrigger.addEventListener('click', () => { closeMobileMenu(); openConsole(); });
    if (backdrop) backdrop.addEventListener('click', closeConsole);
    if (closeBtn) closeBtn.addEventListener('click', closeConsole);

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const value = input.value;
            input.value = '';
            runCommand(value);
        } else if (e.key === 'Escape') {
            closeConsole();
        }
    });

    hints.forEach((btn) => {
        btn.addEventListener('click', () => {
            const cmd = btn.getAttribute('data-cmd');
            if (cmd) runCommand(cmd);
            input.focus();
        });
    });

    document.addEventListener('keydown', (e) => {
        const tag = (e.target.tagName || '').toLowerCase();
        const typing = tag === 'input' || tag === 'textarea' || e.target.isContentEditable;
        if (e.key === '`' && !typing) {
            e.preventDefault();
            panel.hidden ? openConsole() : closeConsole();
        } else if (e.key === 'Escape' && !panel.hidden) {
            closeConsole();
        }
    });
}

/* ----------------------------------------------------------------------
   Live status bar: local Abuja time (same Intl conversion as the hero
   chip), a GitHub-sourced pulse, and a genuine visit counter from a free
   public counting service (abacus.jasoncameron.dev). Every number here
   is fetched or computed live; nothing is hardcoded, and each item
   degrades to a quiet placeholder if its request fails, rather than
   displaying a fabricated figure.
   ---------------------------------------------------------------------- */
function initStatusBar() {
    const timeEl = document.querySelector('#statusTime span:last-child');
    const visitsEl = document.querySelector('#statusVisits span:last-child');
    if (!timeEl && !visitsEl) return;

    function updateTime() {
        if (!timeEl) return;
        try {
            const formatter = new Intl.DateTimeFormat('en-GB', {
                timeZone: 'Africa/Lagos', hour: '2-digit', minute: '2-digit', hour12: false,
            });
            timeEl.textContent = formatter.format(new Date()) + ' WAT';
        } catch (err) {
            timeEl.textContent = 'WAT unavailable';
        }
    }
    updateTime();
    setInterval(updateTime, 30000);

    if (visitsEl) {
        const NAMESPACE = 'shafiujimoh-va-portfolio';
        const KEY = 'visits';
        const SESSION_FLAG = 'sj-portfolio-counted';
        let alreadyCounted = false;
        try { alreadyCounted = sessionStorage.getItem(SESSION_FLAG) === '1'; } catch (err) { /* ignore */ }

        const endpoint = alreadyCounted
            ? `https://abacus.jasoncameron.dev/get/${NAMESPACE}/${KEY}`
            : `https://abacus.jasoncameron.dev/hit/${NAMESPACE}/${KEY}`;

        fetch(endpoint)
            .then((res) => {
                if (!res.ok) throw new Error('counter unavailable');
                return res.json();
            })
            .then((data) => {
                const value = typeof data.value === 'number' ? data.value : null;
                if (value === null) throw new Error('no value');
                visitsEl.textContent = value.toLocaleString('en-US') + ' visits';
                if (!alreadyCounted) {
                    try { sessionStorage.setItem(SESSION_FLAG, '1'); } catch (err) { /* ignore */ }
                }
            })
            .catch(() => {
                visitsEl.textContent = 'counter offline';
            });
    }
}

/* ----------------------------------------------------------------------
   Lightbox: click-to-enlarge viewer for the hero and about portraits.
   Modelled on hancore.dev's project-shot viewer: an overlay that opens on
   click or Enter/Space, closes on Escape, backdrop click, or the close
   button, and returns focus sensibly.
   ---------------------------------------------------------------------- */
function initLightbox() {
    const lightbox = document.getElementById('hcLightbox');
    const backdrop = document.getElementById('lightboxBackdrop');
    const closeBtn = document.getElementById('lightboxClose');
    const img = document.getElementById('lightboxImg');
    const caption = document.getElementById('lightboxCaption');
    const triggers = document.querySelectorAll('.lightbox-trigger');
    if (!lightbox || !img || !triggers.length) return;

    let lastFocused = null;

    function open(trigger) {
        const src = trigger.getAttribute('data-lightbox');
        if (!src) return;
        lastFocused = document.activeElement;
        img.src = src;
        img.alt = trigger.getAttribute('data-caption') || '';
        caption.textContent = trigger.getAttribute('data-caption') || '';
        lightbox.hidden = false;
        document.body.style.overflow = 'hidden';
        closeBtn.focus();
    }

    function close() {
        lightbox.hidden = true;
        document.body.style.overflow = '';
        img.src = '';
        if (lastFocused && lastFocused.focus) lastFocused.focus();
    }

    triggers.forEach((trigger) => {
        trigger.addEventListener('click', () => open(trigger));
        trigger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                open(trigger);
            }
        });
    });

    if (backdrop) backdrop.addEventListener('click', close);
    if (closeBtn) closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !lightbox.hidden) close();
    });
}

/* ----------------------------------------------------------------------
   Quick filters: live-filter inputs above the skills tag cloud / tool
   stack and the credentials grid, functionally equivalent to hancore.dev's
   instant search over its project wheel, applied here to skills and
   certifications. Matching is a simple case-insensitive substring test
   against each item's visible text, with a live match count.
   ---------------------------------------------------------------------- */
function initQuickFilters() {
    wireFilter('skillsFilter', 'skillsFilterCount', [
        '.tag-cloud span',
        '.tool-chip',
    ]);
    wireFilter('credFilter', 'credFilterCount', [
        '.cert-card',
    ]);
}

function wireFilter(inputId, countId, selectors) {
    const input = document.getElementById(inputId);
    const countEl = document.getElementById(countId);
    if (!input) return;

    const items = Array.from(document.querySelectorAll(selectors.join(', ')));
    if (!items.length) return;

    function apply() {
        const q = input.value.trim().toLowerCase();
        let visible = 0;
        items.forEach((item) => {
            const text = item.textContent.toLowerCase();
            const match = !q || text.includes(q);
            item.classList.toggle('is-filtered-hidden', !match);
            if (match) visible++;
        });
        if (countEl) {
            countEl.textContent = q ? `${visible} of ${items.length}` : '';
        }
        // Also reveal skill panels so a match inside a hidden tab is visible.
        if (q && selectors[0] === '.tag-cloud span') {
            document.querySelectorAll('.skill-panel').forEach((panel) => {
                const hasMatch = Array.from(panel.querySelectorAll('span')).some((span) => !span.classList.contains('is-filtered-hidden'));
                panel.style.display = hasMatch ? 'block' : 'none';
            });
        } else if (!q && selectors[0] === '.tag-cloud span') {
            document.querySelectorAll('.skill-panel').forEach((panel) => { panel.style.display = ''; });
            const activeTab = document.querySelector('.skill-tab.active');
            document.querySelectorAll('.skill-panel').forEach((panel) => panel.classList.remove('active'));
            const targetId = activeTab ? activeTab.getAttribute('data-target') : null;
            const target = targetId && document.getElementById(targetId);
            if (target) target.classList.add('active');
        }
    }

    input.addEventListener('input', apply);
}

/* ----------------------------------------------------------------------
   Live GitHub pulse: a small strip fetched client-side from the public
   GitHub REST API (no auth, no proxy), showing real repo and follower
   counts for this exact profile. Echoes hancore.dev's own "fetch user"
   blocks in spirit without copying their layout, and never substitutes a
   fabricated number if the request fails.
   ---------------------------------------------------------------------- */
function initGithubPulse() {
    const wrap = document.getElementById('githubPulse');
    if (!wrap) return;
    const repos = wrap.querySelector('[data-stat="repos"]');
    const followers = wrap.querySelector('[data-stat="followers"]');
    const since = wrap.querySelector('[data-stat="since"]');

    fetch('https://api.github.com/users/ShafiuJimoh')
        .then((res) => {
            if (!res.ok) throw new Error('GitHub API unavailable');
            return res.json();
        })
        .then((data) => {
            if (repos) repos.textContent = data.public_repos ?? '—';
            if (followers) followers.textContent = data.followers ?? '—';
            if (since) since.textContent = data.created_at ? new Date(data.created_at).getFullYear() : '—';
            wrap.classList.remove('is-loading');
        })
        .catch(() => {
            if (repos) repos.textContent = '—';
            if (followers) followers.textContent = '—';
            if (since) since.textContent = '—';
            wrap.classList.remove('is-loading');
            const label = wrap.querySelector('.github-pulse-label span');
            if (label) label.textContent = 'GitHub stats are temporarily unavailable.';
        });
}
