// ===================================
// SHAFIU JIMOH - EXECUTIVE VA PORTFOLIO
// Interactive JavaScript Functionality
// ===================================

// === NAVIGATION ===
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Animate hamburger
    const spans = navToggle.querySelectorAll('span');
    if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translateY(10px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translateY(-10px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Close menu when clicking on link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');

function updateActiveNav() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (navLink && scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            navLink.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// === SMOOTH SCROLLING ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// === SLIDESHOW FUNCTIONALITY ===
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const indicators = document.querySelectorAll('.indicator');
let slideInterval;

function showSlide(index) {
    // Wrap around
    if (index >= slides.length) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = slides.length - 1;
    } else {
        currentSlide = index;
    }
    
    // Hide all slides
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // Update indicators
    indicators.forEach(indicator => {
        indicator.classList.remove('active');
    });
    
    // Show current slide
    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
}

function changeSlide(direction) {
    showSlide(currentSlide + direction);
    resetSlideInterval();
}

function goToSlide(index) {
    showSlide(index);
    resetSlideInterval();
}

// Auto-advance slides
function startSlideshow() {
    slideInterval = setInterval(() => {
        showSlide(currentSlide + 1);
    }, 7000); // Change slide every 7 seconds
}

function resetSlideInterval() {
    clearInterval(slideInterval);
    startSlideshow();
}

// Initialize slideshow
startSlideshow();

// Pause slideshow on hover
const slideshowContainer = document.querySelector('.slideshow-container');
if (slideshowContainer) {
    slideshowContainer.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    slideshowContainer.addEventListener('mouseleave', () => {
        startSlideshow();
    });
}

// Make changeSlide and goToSlide available globally for HTML onclick
window.changeSlide = changeSlide;
window.goToSlide = goToSlide;

// === SKILLS ANIMATION ===
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBars = entry.target.querySelectorAll('.skill-progress');
            progressBars.forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0';
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
            });
        }
    });
}, observerOptions);

const skillsSection = document.querySelector('.skills-section');
if (skillsSection) {
    skillsObserver.observe(skillsSection);
}

// === SCROLL ANIMATIONS ===
const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px'
});

// Apply fade-in animation to sections
const animatedElements = document.querySelectorAll('.service-card, .skill-category, .timeline-item, .cert-card');
animatedElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeInObserver.observe(element);
});

// === CONTACT FORM ===
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };
        
        // Show loading state
        const submitBtn = contactForm.querySelector('.btn-submit');
        const originalText = submitBtn.querySelector('span').textContent;
        submitBtn.querySelector('span').textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual API call)
        try {
            // In a real implementation, you would send this to your backend
            // For demo purposes, we'll simulate a successful submission
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success message
            formMessage.textContent = 'Thank you for your message! I\'ll get back to you soon.';
            formMessage.className = 'form-message success';
            
            // Reset form
            contactForm.reset();
            
            // Hide message after 5 seconds
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
            
        } catch (error) {
            // Show error message
            formMessage.textContent = 'Oops! Something went wrong. Please try again or email me directly.';
            formMessage.className = 'form-message error';
        } finally {
            // Reset button
            submitBtn.querySelector('span').textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// === STATS COUNTER ANIMATION ===
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        const current = Math.floor(progress * (end - start) + start);
        const text = element.textContent;
        
        if (text.includes('%')) {
            element.textContent = current + '%';
        } else if (text.includes('+')) {
            element.textContent = current + '+';
        } else if (text.includes('K')) {
            element.textContent = current + 'K+';
        } else {
            element.textContent = current;
        }
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            // Restore original text
            if (text.includes('%')) {
                element.textContent = end + '%';
            } else if (text.includes('+')) {
                element.textContent = end + '+';
            } else if (text.includes('K')) {
                element.textContent = end + 'K+';
            } else {
                element.textContent = end;
            }
        }
    };
    window.requestAnimationFrame(step);
}

// Observe stat cards
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            entry.target.classList.add('animated');
            const statNumber = entry.target.querySelector('.stat-number');
            if (statNumber) {
                const text = statNumber.textContent;
                let value = parseInt(text.replace(/[^0-9]/g, ''));
                
                // Handle different formats
                if (text.includes('K')) {
                    value = parseInt(text.replace('K+', ''));
                } else if (text.includes('%')) {
                    value = parseInt(text.replace('%', ''));
                } else if (text.includes('+')) {
                    value = parseInt(text.replace('+', ''));
                }
                
                animateValue(statNumber, 0, value, 2000);
            }
        }
    });
}, { threshold: 0.5 });

const statCards = document.querySelectorAll('.stat-card');
statCards.forEach(card => {
    statsObserver.observe(card);
});

// === PARALLAX EFFECT FOR HERO ===
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroShapes = document.querySelectorAll('.hero-shape');
    
    heroShapes.forEach((shape, index) => {
        const speed = 0.5 + (index * 0.1);
        shape.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// === KEYBOARD NAVIGATION FOR SLIDESHOW ===
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        changeSlide(-1);
    } else if (e.key === 'ArrowRight') {
        changeSlide(1);
    }
});

// === LAZY LOADING IMAGES ===
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }
            imageObserver.unobserve(img);
        }
    });
});

document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
});

// === TYPING EFFECT FOR HERO (Optional Enhancement) ===
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// === CURSOR TRAIL EFFECT (Subtle) ===
const cursorDot = document.createElement('div');
cursorDot.className = 'cursor-dot';
document.body.appendChild(cursorDot);

let mouseX = 0, mouseY = 0;
let dotX = 0, dotY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    const delay = 0.1;
    dotX += (mouseX - dotX) * delay;
    dotY += (mouseY - dotY) * delay;
    
    cursorDot.style.left = dotX + 'px';
    cursorDot.style.top = dotY + 'px';
    
    requestAnimationFrame(animateCursor);
}

animateCursor();

// Add cursor dot styles dynamically
const cursorStyle = document.createElement('style');
cursorStyle.textContent = `
    .cursor-dot {
        position: fixed;
        width: 8px;
        height: 8px;
        background: linear-gradient(135deg, #14B8A6, #1E3A5F);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        opacity: 0.6;
        transition: transform 0.15s ease;
    }
    
    @media (max-width: 768px) {
        .cursor-dot {
            display: none;
        }
    }
`;
document.head.appendChild(cursorStyle);

// === SCROLL PROGRESS INDICATOR ===
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.pageYOffset / windowHeight) * 100;
    progressBar.style.width = scrolled + '%';
});

// Add progress bar styles
const progressStyle = document.createElement('style');
progressStyle.textContent = `
    .scroll-progress {
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #14B8A6, #8B5CF6);
        z-index: 10000;
        transition: width 0.1s ease;
    }
`;
document.head.appendChild(progressStyle);

// === BACK TO TOP BUTTON ===
const backToTop = document.createElement('button');
backToTop.className = 'back-to-top';
backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
document.body.appendChild(backToTop);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Add back to top styles
const backToTopStyle = document.createElement('style');
backToTopStyle.textContent = `
    .back-to-top {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #14B8A6, #1E3A5F);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        opacity: 0;
        visibility: hidden;
        transform: scale(0);
        transition: all 0.3s ease;
        z-index: 1000;
    }
    
    .back-to-top.visible {
        opacity: 1;
        visibility: visible;
        transform: scale(1);
    }
    
    .back-to-top:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
    }
    
    @media (max-width: 768px) {
        .back-to-top {
            bottom: 20px;
            right: 20px;
            width: 45px;
            height: 45px;
        }
    }
`;
document.head.appendChild(backToTopStyle);

// === PRELOADER (Optional) ===
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 1000);
    }
});

// === CONSOLE MESSAGE ===
console.log('%c🚀 Shafiu Jimoh - Executive Virtual Assistant', 'font-size: 20px; font-weight: bold; color: #14B8A6;');
console.log('%c✨ Portfolio designed with precision and passion', 'font-size: 14px; color: #1E3A5F;');
console.log('%c💼 Let\'s work together: Shafiujimoh2003@gmail.com', 'font-size: 12px; color: #666;');

// === EASTER EGG ===
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join('') === konamiPattern.join('')) {
        document.body.style.animation = 'rainbow 2s infinite';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
        
        alert('🎉 You found the easter egg! You\'re awesome! 🌟');
    }
});

const rainbowAnimation = document.createElement('style');
rainbowAnimation.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(rainbowAnimation);

console.log('%c🎮 Hint: Try the Konami Code!', 'font-size: 10px; color: #999;');
