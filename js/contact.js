document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
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
            const formMessage = document.getElementById('form-messages');
            
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
});
