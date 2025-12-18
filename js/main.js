// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mainNav = document.querySelector('.main-nav');
const navLinks = document.querySelectorAll('.main-nav a');

// Toggle mobile menu
function toggleMenu() {
    mobileMenuToggle.classList.toggle('active');
    mainNav.classList.toggle('active');
    document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
}

// Close menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 991) {
            toggleMenu();
        }
    });
});

// Toggle menu on mobile menu button click
if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', toggleMenu);
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 991 && 
        !e.target.closest('.main-nav') && 
        !e.target.closest('.mobile-menu-toggle')) {
        mainNav.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Back to Top Button
const backToTopButton = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }
});

backToTopButton.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Update current year in footer
document.getElementById('current-year').textContent = new Date().getFullYear();

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submit-btn');
const formMessage = document.getElementById('form-messages');
const successPopup = document.getElementById('success-popup');
const closePopup = document.getElementById('close-popup');

// Show popup function
function showPopup() {
    successPopup.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Hide popup function
function hidePopup() {
    successPopup.classList.remove('active');
    document.body.style.overflow = '';
}

// Close popup when clicking the close button
if (closePopup) {
    closePopup.addEventListener('click', hidePopup);
}

// Close popup when clicking outside the content
successPopup.addEventListener('click', (e) => {
    if (e.target === successPopup) {
        hidePopup();
    }
});

// Close popup when pressing Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && successPopup.classList.contains('active')) {
        hidePopup();
    }
});

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Show loading state
        const submitBtn = contactForm.querySelector('#submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        if (btnText) btnText.style.display = 'none';
        if (btnLoading) btnLoading.style.display = 'inline-block';
        submitBtn.disabled = true;
        
        try {
            const formData = new FormData(contactForm);
            // Add Formspree endpoint
            const response = await fetch('https://formspree.io/f/mnnekjrd', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                // Reset form
                contactForm.reset();
                // Show success popup
                showPopup();
            } else {
                const errorData = await response.json();
                console.error('Form submission error:', errorData);
                throw new Error(errorData.error || 'Form submission failed');
            }
        } catch (error) {
            console.error('Error:', error);
            // Show error message in form
            formMessage.textContent = 'Oops! There was a problem sending your message. Please try again later.';
            formMessage.className = 'form-message error';
            formMessage.style.display = 'block';
            
            // Scroll to form message
            formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Hide message after 5 seconds
            setTimeout(() => {
                formMessage.style.opacity = '0';
                setTimeout(() => {
                    formMessage.className = 'form-message';
                    formMessage.style.opacity = '';
                    formMessage.style.display = '';
                }, 300);
            }, 5000);
        } finally {
            // Reset button state
            if (btnText) btnText.style.display = 'inline-block';
            if (btnLoading) btnLoading.style.display = 'none';
            submitBtn.disabled = false;
        }
    });
}
