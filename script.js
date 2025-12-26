// Translation System
let currentLang = 'ar';
let translations = {};

// Load translations
async function loadTranslations(lang) {
    try {
        const response = await fetch(`./translations/${lang}.json`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading translations:', error);
        return null;
    }
}

// Initialize translations
async function initializeI18n() {
    // Load both languages
    translations.ar = await loadTranslations('ar');
    translations.en = await loadTranslations('en');
    
    // Set initial language
    const savedLang = localStorage.getItem('language') || 'ar';
    await switchLanguage(savedLang, false);
}

// Switch language
async function switchLanguage(lang, savePreference = true) {
    currentLang = lang;
    
    if (savePreference) {
        localStorage.setItem('language', lang);
    }
    
    // Update HTML lang and dir attributes
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    
    // Update all translatable elements
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = getNestedTranslation(translations[lang], key);
        if (translation) {
            element.textContent = translation;
        }
    });
    
    // Update language toggle button
    const langText = document.getElementById('langText');
    if (langText) {
        langText.textContent = lang === 'ar' ? 'EN' : 'ع';
    }
    
    // Update placeholders
    updatePlaceholders();
}

// Get nested translation value
function getNestedTranslation(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
}

// Update form placeholders
function updatePlaceholders() {
    const t = translations[currentLang];
    
    // Contact form
    const contactName = document.querySelector('#contactForm input[type="text"]');
    const contactEmail = document.querySelector('#contactForm input[type="email"]');
    const contactMessage = document.querySelector('#contactForm textarea');
    
    if (contactName) contactName.placeholder = t.contact.nameField;
    if (contactEmail) contactEmail.placeholder = t.contact.emailField;
    if (contactMessage) contactMessage.placeholder = t.contact.messageField;
    
    // Order modal
    const orderName = document.querySelector('#orderForm input[type="text"]');
    const orderEmail = document.querySelector('#orderForm input[type="email"]');
    const orderPhone = document.querySelector('#orderForm input[type="tel"]');
    const orderNotes = document.querySelector('#orderForm textarea');
    const orderSize = document.querySelector('#orderForm select');
    
    if (orderName) orderName.placeholder = t.modal.nameField;
    if (orderEmail) orderEmail.placeholder = t.modal.emailField;
    if (orderPhone) orderPhone.placeholder = t.modal.phoneField;
    if (orderNotes) orderNotes.placeholder = t.modal.notesField;
    
    if (orderSize) {
        orderSize.innerHTML = `
            <option value="">${t.modal.sizeField}</option>
            <option>${t.modal.size1}</option>
            <option>${t.modal.size2}</option>
            <option>${t.modal.size3}</option>
            <option>${t.modal.size4}</option>
        `;
    }
    
    // Custom modal
    const customName = document.querySelector('#customForm input[type="text"]');
    const customEmail = document.querySelector('#customForm input[type="email"]');
    const customPhone = document.querySelector('#customForm input[type="tel"]');
    const customText = document.querySelectorAll('#customForm input[type="text"]')[1];
    const customDetails = document.querySelector('#customForm textarea');
    const customType = document.querySelectorAll('#customForm select')[0];
    const customSize = document.querySelectorAll('#customForm select')[1];
    
    if (customName) customName.placeholder = t.modal.nameField;
    if (customEmail) customEmail.placeholder = t.modal.emailField;
    if (customPhone) customPhone.placeholder = t.modal.phoneField;
    if (customText) customText.placeholder = t.modal.textField;
    if (customDetails) customDetails.placeholder = t.modal.detailsField;
    
    if (customType) {
        customType.innerHTML = `
            <option value="">${t.modal.calligraphyType}</option>
            <option>${t.modal.type1}</option>
            <option>${t.modal.type2}</option>
            <option>${t.modal.type3}</option>
            <option>${t.modal.type4}</option>
        `;
    }
    
    if (customSize) {
        customSize.innerHTML = `
            <option value="">${t.modal.sizeField}</option>
            <option>${t.modal.size1}</option>
            <option>${t.modal.size2}</option>
            <option>${t.modal.size3}</option>
            <option>${t.modal.size4}</option>
            <option>${t.modal.sizeCustom}</option>
        `;
    }
}

// Product filtering
function initializeProductFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            productCards.forEach(card => {
                if (filter === 'all') {
                    card.style.display = 'block';
                } else {
                    const categories = card.getAttribute('data-category').split(' ');
                    if (categories.includes(filter)) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    });
}

// Modal functions
function openOrderModal(button) {
    const modal = document.getElementById('orderModal');
    const productName = button.closest('.product-card').querySelector('h3').textContent;
    document.getElementById('productName').value = productName;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function openCustomModal() {
    const modal = document.getElementById('customModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
    document.body.style.overflow = '';
}

// Mobile menu toggle
function initializeMobileMenu() {
    const toggle = document.getElementById('navbarToggle');
    const menu = document.getElementById('navbarMenu');
    
    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            menu.classList.toggle('active');
        });

        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('active');
            });
        });
    }
}

// Language toggle
function initializeLanguageToggle() {
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        langToggle.addEventListener('click', () => {
            const newLang = currentLang === 'ar' ? 'en' : 'ar';
            switchLanguage(newLang);
        });
    }
}

// Form handling
function initializeFormHandling() {
    const t = translations[currentLang];
    
    // Order form
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert(t.modal.successOrder);
            closeModal();
            orderForm.reset();
        });
    }

    // Custom order form
    const customForm = document.getElementById('customForm');
    if (customForm) {
        customForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert(t.modal.successCustom);
            closeModal();
            customForm.reset();
        });
    }

    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert(t.modal.successContact);
            contactForm.reset();
        });
    }
}

// Smooth scroll
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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
}

// Navbar scroll effect
function initializeNavbarScroll() {
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            navbar.style.boxShadow = '0 4px 20px rgba(15, 23, 42, 0.15)';
        } else {
            navbar.style.boxShadow = '0 1px 10px rgba(15, 23, 42, 0.1)';
        }
    });
}

// Scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section-header, .about__img, .about__content, .contact__container').forEach(el => {
        el.classList.add('scroll-reveal');
        observer.observe(el);
    });
}

// Smooth page transitions
function initializePageTransitions() {
    document.body.style.opacity = '0';
    window.addEventListener('load', () => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    });
}

// Close modal on outside click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        closeModal();
    }
});

// Close modal on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
    await initializeI18n();
    initializeProductFilters();
    initializeSmoothScroll();
    initializeFormHandling();
    initializeMobileMenu();
    initializeLanguageToggle();
    initializeNavbarScroll();
    initializeScrollAnimations();
    initializePageTransitions();
});
