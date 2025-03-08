// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add a class to the header when scrolling
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Handle Form Submission with Formspree
document.getElementById("contact-form").addEventListener("submit", function(event) {
    event.preventDefault();
    var form = this;
    var formData = new FormData(form);
    
    fetch(form.action, {
        method: form.method,
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => response.json())
    .then(data => {
        if (data.ok) {
            document.getElementById("success-message").style.display = "block";
            document.getElementById("success-message").innerText = "Message sent successfully!";
            form.reset();
        } else {
            throw new Error(data.error || "Something went wrong. Please try again.");
        }
    })
    .catch(error => {
        alert(error.message);
    });
});

// Login Modal Functionality
const loginModal = document.getElementById('loginModal');
const loginLink = document.getElementById('loginLink');
const closeBtn = document.querySelector('.close-btn');

// Show modal
loginLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginModal.style.display = 'flex';
});

// Close modal
closeBtn.addEventListener('click', () => {
    loginModal.style.display = 'none';
});

// Close when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.style.display = 'none';
    }
});

// Form Validation
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');

    // Reset errors
    emailError.style.display = 'none';
    passwordError.style.display = 'none';

    let isValid = true;

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
        emailError.textContent = 'Email is required';
        emailError.style.display = 'block';
        isValid = false;
    } else if (!emailRegex.test(email.value)) {
        emailError.textContent = 'Invalid email format';
        emailError.style.display = 'block';
        isValid = false;
    }

    // Password validation
    if (!password.value.trim()) {
        passwordError.textContent = 'Password is required';
        passwordError.style.display = 'block';
        isValid = false;
    } else if (password.value.length < 8) {
        passwordError.textContent = 'Password must be at least 8 characters';
        passwordError.style.display = 'block';
        isValid = false;
    }

    if (isValid) {
        // Here you would typically handle the login request
        alert('Login successful! (This is a demo)');
        loginModal.style.display = 'none';
        this.reset();
    }
});