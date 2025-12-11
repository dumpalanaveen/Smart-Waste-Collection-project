// Contact form functionality
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const resultDiv = document.getElementById('contactFormResult');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };

            // Simulate form submission (in a real app, this would send to a backend)
            resultDiv.className = 'form-result success';
            resultDiv.innerHTML = 'Thank you for your message! We will get back to you soon.';
            
            // Reset form
            contactForm.reset();
            
            // Clear result after 5 seconds
            setTimeout(() => {
                resultDiv.className = 'form-result';
                resultDiv.innerHTML = '';
            }, 5000);
        });
    }
});



