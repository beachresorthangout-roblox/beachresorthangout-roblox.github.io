// ============================================
// Beach Resort Hangout - Main JavaScript
// ============================================

// Initialize EmailJS (Replace with your actual credentials)
emailjs.init('w7kR9sCIyzEVA0UqB'); // Get this from EmailJS dashboard

// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        // Animate hamburger menu
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = navMenu.classList.contains('active') 
            ? 'rotate(45deg) translateY(10px)' 
            : 'none';
        spans[1].style.opacity = navMenu.classList.contains('active') ? '0' : '1';
        spans[2].style.transform = navMenu.classList.contains('active') 
            ? 'rotate(-45deg) translateY(-10px)' 
            : 'none';
    });

    // Close menu when clicking on a link
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const spans = menuToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });
}

// Contact Form Handler with EmailJS
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const name = document.getElementById('user_name').value;
        const email = document.getElementById('user_email').value;
        const message = document.getElementById('message').value;
        const statusElement = document.getElementById('formStatus');
        
        // Basic validation
        if (!name || !email || !message) {
            showStatus('Bitte fülle alle Felder aus!', 'error', statusElement);
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showStatus('Bitte gib eine gültige E-Mail-Adresse ein!', 'error', statusElement);
            return;
        }
        
        // Show loading state
        showStatus('Nachricht wird gesendet...', 'loading', statusElement);
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        
        // Send email via EmailJS
        emailjs.send(
            'service_qutkmms',      // Replace with your Service ID
            'template_j7c8bi4',     // Replace with your Template ID
            {
                to_email: 'beachresorthangout-roblox@outlook.com',  // Replace with your email
                user_name: name,
                user_email: email,
                message: message
            }
        ).then(
            (response) => {
                showStatus('✓ Danke für deine Nachricht! Wir werden dich bald kontaktieren.', 'success', statusElement);
                contactForm.reset();
                submitBtn.disabled = false;
                
                // Clear success message after 5 seconds
                setTimeout(() => {
                    statusElement.classList.remove('show');
                }, 5000);
            },
            (error) => {
                console.error('EmailJS Error:', error);
                showStatus('✗ Fehler beim Senden. Bitte versuche es später erneut.', 'error', statusElement);
                submitBtn.disabled = false;
            }
        );
    });
}

// Helper function to show status messages
function showStatus(message, type, element) {
    element.textContent = message;
    element.className = `form-status show ${type}`;
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            // Calculate offset position (accounting for fixed navbar)
            const navbarHeight = document.querySelector('.navbar') ? document.querySelector('.navbar').offsetHeight : 0;
            const elementPosition = target.offsetTop - navbarHeight - 20; // 20px extra padding

            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Handle URL hash navigation on page load (for external links)
window.addEventListener('load', () => {
    const hash = window.location.hash;
    if (hash && hash !== '#') {
        // Prevent browser default scroll behavior by scrolling to top first
        window.scrollTo(0, 0);

        // Longer delay to ensure smooth transition
        setTimeout(() => {
            const target = document.querySelector(hash);
            if (target) {
                // Use the same scrolling logic as internal links
                const navbarHeight = document.querySelector('.navbar') ? document.querySelector('.navbar').offsetHeight : 0;
                const elementPosition = target.offsetTop - navbarHeight - 20; // 20px extra padding

                // Slower, more elegant scroll animation
                window.scrollTo({
                    top: elementPosition,
                    behavior: 'smooth'
                });
            }
        }, 800); // Increased delay for better visual effect
    }
});

// Also handle pageshow event (for cached pages/back button)
window.addEventListener('pageshow', (event) => {
    if (event.persisted) { // Page was loaded from cache
        const hash = window.location.hash;
        if (hash && hash !== '#') {
            window.scrollTo(0, 0);
            setTimeout(() => {
                const target = document.querySelector(hash);
                if (target) {
                    const navbarHeight = document.querySelector('.navbar') ? document.querySelector('.navbar').offsetHeight : 0;
                    const elementPosition = target.offsetTop - navbarHeight - 20;
                    window.scrollTo({
                        top: elementPosition,
                        behavior: 'smooth'
                    });
                }
            }, 800); // Same delay for consistency
        }
    }
});

// Development overlay close logic
const DEV_OVERLAY_PASSWORD = 'webdev'; // Change this to your desired unlock password

function setBodyScrollLocked(enabled) {
    if (enabled) {
        document.body.style.overflow = 'hidden';
        document.body.style.touchAction = 'none';
    } else {
        document.body.style.overflow = '';
        document.body.style.touchAction = '';
    }
}

function initDevOverlays() {
    document.querySelectorAll('.dev-overlay').forEach(overlay => {
        const form = overlay.querySelector('.dev-overlay-form');
        const passwordInput = overlay.querySelector('.dev-overlay-input');
        const feedback = overlay.querySelector('.dev-overlay-feedback');
        if (!form || !passwordInput || !feedback) return;

        const overlayPassword = overlay.dataset.overlayPassword || DEV_OVERLAY_PASSWORD;
        overlay.classList.add('visible');
        setBodyScrollLocked(true);

        const hideOverlay = () => {
            overlay.classList.add('hiding');
            overlay.classList.remove('visible');
            setBodyScrollLocked(false);

            const finishHide = () => {
                overlay.classList.add('dev-overlay-hidden');
                overlay.classList.remove('hiding');
                overlay.removeEventListener('transitionend', finishHide);
            };

            overlay.addEventListener('transitionend', finishHide);
        };

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const value = passwordInput.value.trim();
            if (value === overlayPassword) {
                hideOverlay();
            } else {
                feedback.textContent = 'Falsches Passwort. Versuche es erneut.';
                passwordInput.focus();
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', initDevOverlays);

// Add scroll animation for elements
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections and cards
document.querySelectorAll('.feature-card, .stat-card, .gallery-item, .team-card, .social-icon').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
});

// Scroll effect for navbar
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

if (navbar) {
    window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
}

// Animate numbers on stat cards
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + '+';
        }
    }, 16);
}

// Initialize counters when they come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
            const number = entry.target.textContent;
            const numValue = parseInt(number);
            animateCounter(entry.target, numValue);
            entry.target.dataset.counted = 'true';
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-card h3').forEach(element => {
    statsObserver.observe(element);
});

// Add active state to navigation links based on scroll
window.addEventListener('scroll', () => {
    let current = '';

    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    // Remove all section highlights first
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('section-active');
    });

    // Add section highlight if we're on index.html
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('section-active');
            }
        });
    }
});

function highlightCurrentPage() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');

        // Handle different link types
        if (href === currentPath ||
            (currentPath === 'index.html' && href.startsWith('#')) ||
            (href.includes(currentPath) && !href.startsWith('#'))) {
            link.classList.add('active');
        }
    });
}

// Initialize page highlighting
document.addEventListener('DOMContentLoaded', highlightCurrentPage);

// Handle URL hash navigation with smooth scroll
window.addEventListener('load', () => {
    const hash = window.location.hash;
    console.log('Hash detected:', hash); // Debug log
    if (hash) {
        console.log('Scrolling to:', hash); // Debug log
        // Remove hash from URL to prevent browser default behavior
        history.replaceState(null, null, window.location.pathname);

        // Wait for page to fully load before scrolling
        setTimeout(() => {
            const targetElement = document.querySelector(hash);
            console.log('Target element found:', targetElement); // Debug log
            if (targetElement) {
                // Calculate offset position (accounting for fixed navbar)
                const navbarHeight = document.querySelector('.navbar') ? document.querySelector('.navbar').offsetHeight : 0;
                const elementPosition = targetElement.offsetTop - navbarHeight - 20; // 20px extra padding

                window.scrollTo({
                    top: elementPosition,
                    behavior: 'smooth'
                });
                console.log('Scrolled to element at position:', elementPosition); // Debug log
            } else {
                console.log('Element not found for hash:', hash); // Debug log
            }
        }, 100);
    } else {
        console.log('No hash found in URL'); // Debug log
    }
});

// FAQ functionality
document.addEventListener('DOMContentLoaded', () => {
    const faqButtons = document.querySelectorAll('.faq-question');
    faqButtons.forEach(button => {
        button.addEventListener('click', () => {
            const faqItem = button.closest('.faq-item');
            const isExpanded = button.getAttribute('aria-expanded') === 'true';
            button.setAttribute('aria-expanded', String(!isExpanded));
            faqItem.classList.toggle('open');
        });
    });
});

// Console message
console.log('%c🏖️ Welcome to Beach Resort Hangout!', 'font-size: 20px; color: #FF6B35; font-weight: bold;');
console.log('%cBuilt with ❤️ for amazing players', 'font-size: 14px; color: #16A8D8;');
console.log('%c⚙️ Kontaktformular-Setup:', 'font-size: 12px; color: #FFD560;');
console.log('1. Gehe zu https://www.emailjs.com');
console.log('2. Erstelle ein Konto und einen Email Service');
console.log('3. Kopiere deine Public Key, Service ID und Template ID');
console.log('4. Ersetze die Werte in script-index.js Zeile 11, 55 und 56');

