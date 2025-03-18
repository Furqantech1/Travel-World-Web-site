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

// User Authentication & Profile Management
const userProfile = document.getElementById('userProfile');
const loginLink = document.getElementById('loginLink');
const userDisplayName = document.getElementById('userDisplayName');
const dropdownUserName = document.getElementById('dropdownUserName');
const dropdownUserEmail = document.getElementById('dropdownUserEmail');
const logoutLink = document.getElementById('logoutLink');
const welcomeToast = document.getElementById('welcomeToast');
const welcomeUserName = document.getElementById('welcomeUserName');
const closeWelcomeToast = document.getElementById('closeWelcomeToast');
const loginModal = document.getElementById('loginModal');
const signUpModal = document.getElementById('signUpModal');
const forgotPasswordModal = document.getElementById('forgotPasswordModal');
const showSignUpLink = document.getElementById('showSignUp');
const showForgotPasswordLink = document.getElementById('showForgotPassword');
const showLoginLink = document.getElementById('showLogin');
const backToLoginLink = document.getElementById('backToLogin');
const signUpForm = document.getElementById('signUpForm');
const forgotPasswordForm = document.getElementById('forgotPasswordForm');
const myBookingsModal = document.getElementById('myBookingsModal');
const closeBookingsBtn = document.getElementById('closeBookings');
const bookingsContainer = document.getElementById('bookingsContainer');
const noBookings = document.getElementById('noBookings');
const bookNowBtn = document.getElementById('bookNowBtn');
const myBookingsLink = document.getElementById('myBookingsLink');

// Store user data
let currentUser = null;

// Handle Form Submission with Formspree
document.getElementById("contact-form").addEventListener("submit", function(event) {
    event.preventDefault();
    var form = this;
    var formData = new FormData(form);
    const contactSection = document.querySelector('.contact');
    const successAnimation = document.getElementById('success-animation');
    
    // Show a loading state on the button
    const submitButton = form.querySelector('button');
    const originalButtonText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitButton.disabled = true;
    
    fetch(form.action, {
        method: form.method,
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => response.json())
    .then(data => {
        if (data.ok) {
            // Reset the form
            form.reset();
            
            // Hide the form completely and show success animation
            form.style.display = 'none';
            contactSection.classList.add('success-state');
            
            // Scroll to the success message if needed
            successAnimation.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Reset after 5 seconds
            setTimeout(() => {
                contactSection.classList.remove('success-state');
                form.style.display = 'flex';
                form.style.flexDirection = 'column';
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
            }, 5000);
        } else {
            throw new Error(data.error || "Something went wrong. Please try again.");
        }
    })
    .catch(error => {
        alert(error.message);
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
    });
});

// Show modal
loginLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginModal.style.display = 'flex';
});

// Close modal
document.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        loginModal.style.display = 'none';
        signUpModal.style.display = 'none';
        forgotPasswordModal.style.display = 'none';
        myBookingsModal.style.display = 'none';
    });
});

// Close when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.style.display = 'none';
    }
    if (e.target === signUpModal) {
        signUpModal.style.display = 'none';
        signUpForm.reset();
    }
    if (e.target === forgotPasswordModal) {
        forgotPasswordModal.style.display = 'none';
        forgotPasswordForm.reset();
    }
    if (e.target === myBookingsModal) {
        myBookingsModal.style.display = 'none';
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
        // Check if this is a recognized user from localStorage
        // For demo, we'll just use the email as the key to check previous sign-ups
        const userData = localStorage.getItem(email.value);
        
        if (userData) {
            // User exists, retrieve their info
            currentUser = JSON.parse(userData);
            
            // Check password - this is just a demo, don't store real passwords like this!
            if (currentUser.password !== password.value) {
                passwordError.textContent = 'Incorrect password';
                passwordError.style.display = 'block';
                return;
            }
            
            // Password correct, login the user
            loginUser(currentUser);
        } else {
            // For demo purposes, create a new user if not found
            // In a real app, you would validate against a backend
            alert('User not found. Please sign up first.');
            loginModal.style.display = 'none';
            signUpModal.style.display = 'flex';
            return;
        }
        
        // Close the login modal and reset the form
        loginModal.style.display = 'none';
        this.reset();
    }
});

// Book Pass Modal Functionality
const bookPassModal = document.getElementById('bookPassModal');
const bookPassLink = document.getElementById('bookPassLink');
const closeBookPassBtn = document.getElementById('closeBookPass');
const bookPassForm = document.getElementById('bookPassForm');
const travelPassModal = document.getElementById('travelPassModal');
const closePassBtn = document.getElementById('closePass');
const printPassBtn = document.getElementById('printPass');

// Show Book Pass modal
bookPassLink.addEventListener('click', (e) => {
    e.preventDefault();
    bookPassModal.style.display = 'flex';
});

// Close Book Pass modal
closeBookPassBtn.addEventListener('click', () => {
    bookPassModal.style.display = 'none';
    bookPassForm.reset();
});

// Close Travel Pass modal
closePassBtn.addEventListener('click', () => {
    travelPassModal.style.display = 'none';
});

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === bookPassModal) {
        bookPassModal.style.display = 'none';
        bookPassForm.reset();
    }
    if (e.target === travelPassModal) {
        travelPassModal.style.display = 'none';
    }
});

// Update amount based on validity selection
document.getElementById('validity').addEventListener('change', function() {
    const validity = this.value;
    const amountDisplay = document.getElementById('amountDisplay');
    let amount = 0;
    
    switch(validity) {
        case '1':
            amount = 25000;
            break;
        case '2':
            amount = 40000;
            break;
        case '3':
            amount = 60000;
            break;
    }
    
    amountDisplay.textContent = `₹${amount.toLocaleString()}`;
});

// Form Validation and Pass Generation
bookPassForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form elements
    const fullName = document.getElementById('fullName');
    const email = document.getElementById('passEmail');
    const mobileNo = document.getElementById('mobileNo');
    const validity = document.getElementById('validity');
    const destination = document.getElementById('destination');
    
    // Get error elements
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('passEmailError');
    const mobileError = document.getElementById('mobileError');
    const validityError = document.getElementById('validityError');
    const destinationError = document.getElementById('destinationError');
    
    // Reset errors
    [nameError, emailError, mobileError, validityError, destinationError].forEach(error => {
        error.style.display = 'none';
    });
    
    let isValid = true;
    
    // Name validation
    if (!fullName.value.trim()) {
        nameError.textContent = 'Full name is required';
        nameError.style.display = 'block';
        isValid = false;
    }
    
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
    
    // Mobile number validation
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileNo.value.trim()) {
        mobileError.textContent = 'Mobile number is required';
        mobileError.style.display = 'block';
        isValid = false;
    } else if (!mobileRegex.test(mobileNo.value)) {
        mobileError.textContent = 'Please enter a valid 10-digit mobile number';
        mobileError.style.display = 'block';
        isValid = false;
    }
    
    // Validity validation
    if (!validity.value) {
        validityError.textContent = 'Please select validity period';
        validityError.style.display = 'block';
        isValid = false;
    }
    
    // Destination validation
    if (!destination.value) {
        destinationError.textContent = 'Please select a destination';
        destinationError.style.display = 'block';
        isValid = false;
    }
    
    if (isValid) {
        // Generate pass
        generatePass();
    }
});

// Generate Travel Pass
function generatePass() {
    // Get form values
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('passEmail').value;
    const mobileNo = document.getElementById('mobileNo').value;
    const validity = document.getElementById('validity').value;
    const destination = document.getElementById('destination').value;
    const amount = document.getElementById('amountDisplay').textContent;
    
    // Calculate validity dates
    const today = new Date();
    const validFrom = today.toLocaleDateString();
    const validTo = new Date(today.setDate(today.getDate() + (parseInt(validity) * 7))).toLocaleDateString();
    
    // Set pass details
    document.getElementById('passName').textContent = fullName;
    document.getElementById('passEmailDisplay').textContent = email;
    document.getElementById('passMobile').textContent = mobileNo;
    document.getElementById('passValidity').textContent = `${validity} Week${validity > 1 ? 's' : ''}`;
    document.getElementById('passDestination').textContent = destination;
    document.getElementById('passAmount').textContent = amount;
    document.getElementById('validFrom').textContent = validFrom;
    document.getElementById('validTo').textContent = validTo;
    
    // Get destination image path
    let imagePath = '';
    switch(destination) {
        case 'Paris':
            imagePath = '/images/paris.jpg';
            break;
        case 'Tokyo':
            imagePath = '/images/tokoyo.jpg';
            break;
        case 'New York':
            imagePath = '/images/new york.jpg';
            break;
    }
    
    // Set destination image
    const passImage = document.getElementById('passImage');
    passImage.src = imagePath;
    
    // Save pass data if user is logged in
    if (currentUser) {
        console.log("Saving pass for user:", currentUser.email);
        // Create a pass object
        const newPass = {
            id: Date.now().toString(),
            fullName,
            email,
            mobileNo,
            validity: `${validity} Week${validity > 1 ? 's' : ''}`,
            destination,
            amount,
            validFrom,
            validTo,
            imagePath,
            bookingDate: new Date().toISOString(),
            status: 'Active'
        };
        
        // Get existing bookings or create empty array
        let userBookings = JSON.parse(localStorage.getItem(`bookings_${currentUser.email}`)) || [];
        console.log("Existing bookings:", userBookings);
        
        // Add new booking
        userBookings.push(newPass);
        
        // Save updated bookings
        localStorage.setItem(`bookings_${currentUser.email}`, JSON.stringify(userBookings));
        console.log("Booking saved successfully");
    } else {
        console.log("No user logged in, booking not saved to profile");
    }
    
    // Show travel pass modal
    bookPassModal.style.display = 'none';
    travelPassModal.style.display = 'flex';
    bookPassForm.reset();
}

// Print Pass
printPassBtn.addEventListener('click', () => {
    // Set the visibility before printing
    const travelPass = document.querySelector('.travel-pass');
    const originalPosition = travelPass.style.position;
    const originalZIndex = travelPass.style.zIndex;
    
    // Prepare for printing
    travelPass.style.position = 'fixed';
    travelPass.style.zIndex = '9999';
    travelPass.style.top = '0';
    travelPass.style.left = '0';
    
    // Print the document
    window.print();
    
    // Restore original styles after printing
    setTimeout(() => {
        travelPass.style.position = originalPosition;
        travelPass.style.zIndex = originalZIndex;
    }, 500);
});

// Show Sign Up modal
showSignUpLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginModal.style.display = 'none';
    signUpModal.style.display = 'flex';
});

// Show Forgot Password modal
showForgotPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginModal.style.display = 'none';
    forgotPasswordModal.style.display = 'flex';
});

// Show Login modal from Sign Up
showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    signUpModal.style.display = 'none';
    loginModal.style.display = 'flex';
});

// Show Login modal from Forgot Password
backToLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    forgotPasswordModal.style.display = 'none';
    loginModal.style.display = 'flex';
});

// Sign Up Form Validation
signUpForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('signUpName');
    const email = document.getElementById('signUpEmail');
    const password = document.getElementById('signUpPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    
    const nameError = document.getElementById('signUpNameError');
    const emailError = document.getElementById('signUpEmailError');
    const passwordError = document.getElementById('signUpPasswordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');
    
    // Reset errors
    [nameError, emailError, passwordError, confirmPasswordError].forEach(error => {
        error.style.display = 'none';
    });
    
    let isValid = true;
    
    // Name validation
    if (!name.value.trim()) {
        nameError.textContent = 'Full name is required';
        nameError.style.display = 'block';
        isValid = false;
    }
    
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
    
    // Check if email already exists
    if (localStorage.getItem(email.value)) {
        emailError.textContent = 'Email already registered';
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
    
    // Confirm password validation
    if (!confirmPassword.value.trim()) {
        confirmPasswordError.textContent = 'Please confirm your password';
        confirmPasswordError.style.display = 'block';
        isValid = false;
    } else if (password.value !== confirmPassword.value) {
        confirmPasswordError.textContent = 'Passwords do not match';
        confirmPasswordError.style.display = 'block';
        isValid = false;
    }
    
    if (isValid) {
        // Create user object
        const newUser = {
            name: name.value,
            email: email.value,
            password: password.value, // Note: In a real app, NEVER store plain text passwords
            createdAt: new Date().toISOString()
        };
        
        // Save to localStorage (for demo only - use proper backend authentication in production)
        localStorage.setItem(email.value, JSON.stringify(newUser));
        
        // Auto-login after signup
        currentUser = newUser;
        
        alert('Account created successfully!');
        signUpModal.style.display = 'none';
        
        // Login the user
        loginUser(newUser);
        
        this.reset();
    }
});

// Forgot Password Form Validation
forgotPasswordForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('resetEmail');
    const emailError = document.getElementById('resetEmailError');
    
    // Reset error
    emailError.style.display = 'none';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
        emailError.textContent = 'Email is required';
        emailError.style.display = 'block';
    } else if (!emailRegex.test(email.value)) {
        emailError.textContent = 'Invalid email format';
        emailError.style.display = 'block';
    } else {
        // Here you would typically send the reset link to the user's email
        // For demo purposes, we'll just show a success message
        alert('Password reset link has been sent to your email!');
        forgotPasswordModal.style.display = 'none';
        loginModal.style.display = 'flex';
        this.reset();
    }
});

// Logout functionality
logoutLink.addEventListener('click', (e) => {
    e.preventDefault();
    logoutUser();
});

// Close welcome toast
closeWelcomeToast.addEventListener('click', () => {
    welcomeToast.classList.remove('show');
});

// Function to login user
function loginUser(user) {
    currentUser = user;
    
    // Update UI
    loginLink.style.display = 'none';
    userProfile.style.display = 'block';
    
    // Set user info in profile
    userDisplayName.textContent = user.name.split(' ')[0]; // Show first name only
    dropdownUserName.textContent = user.name;
    dropdownUserEmail.textContent = user.email;
    
    // Show welcome toast
    welcomeUserName.textContent = user.name.split(' ')[0];
    welcomeToast.classList.add('show');
    
    // Hide toast after 5 seconds
    setTimeout(() => {
        welcomeToast.classList.remove('show');
    }, 5000);
    
    // Save to session
    sessionStorage.setItem('currentUser', JSON.stringify(user));
}

// Function to logout user
function logoutUser() {
    // Update UI
    loginLink.style.display = 'block';
    userProfile.style.display = 'none';
    
    // Clear current user
    currentUser = null;
    sessionStorage.removeItem('currentUser');
    
    // Show confirmation
    alert('You have been logged out successfully');
}

// Check if user is already logged in (from previous session)
window.addEventListener('DOMContentLoaded', () => {
    const savedUser = sessionStorage.getItem('currentUser');
    if (savedUser) {
        loginUser(JSON.parse(savedUser));
    }
});

// Replace the My Bookings event listener with this
myBookingsLink.addEventListener('click', function(e) {
    e.preventDefault();
    openBookingsModal();
});

// Close My Bookings modal
closeBookingsBtn.addEventListener('click', () => {
    myBookingsModal.style.display = 'none';
});

// Book Now button in the empty bookings state
bookNowBtn.addEventListener('click', (e) => {
    e.preventDefault();
    myBookingsModal.style.display = 'none';
    bookPassModal.style.display = 'flex';
});

// Function to open the bookings modal and display user's bookings
function openBookingsModal() {
    console.log("Opening bookings modal");
    
    // Clear previous bookings display
    while (bookingsContainer.firstChild) {
        bookingsContainer.removeChild(bookingsContainer.firstChild);
    }
    
    // Append the "no bookings" message back (we'll hide it if there are bookings)
    bookingsContainer.appendChild(noBookings);
    
    if (currentUser) {
        console.log("Current user found:", currentUser.email);
        // Get user's bookings
        const userBookings = JSON.parse(localStorage.getItem(`bookings_${currentUser.email}`)) || [];
        console.log("User bookings:", userBookings);
        
        if (userBookings.length > 0) {
            console.log("User has bookings, displaying them");
            // Hide the "no bookings" message
            noBookings.style.display = 'none';
            
            // Create booking cards
            userBookings.forEach(booking => {
                const bookingCard = createBookingCard(booking);
                bookingsContainer.appendChild(bookingCard);
            });
        } else {
            console.log("No bookings found, showing empty state");
            // Show the "no bookings" message
            noBookings.style.display = 'block';
        }
    } else {
        console.log("No user is logged in");
        // If no user is logged in, show no bookings
        noBookings.style.display = 'block';
    }
    
    // Show the modal
    myBookingsModal.style.display = 'flex';
}

// Function to create a booking card element
function createBookingCard(booking) {
    const card = document.createElement('div');
    card.className = 'booking-card';
    
    card.innerHTML = `
        <div class="booking-header">
            <h3>${booking.destination} Travel Pass</h3>
            <p>Booking ID: ${booking.id.slice(-8)}</p>
            <span class="booking-status">${booking.status}</span>
        </div>
        <div class="booking-content">
            <div class="booking-details">
                <p><strong>Name:</strong> ${booking.fullName}</p>
                <p><strong>Email:</strong> ${booking.email}</p>
                <p><strong>Mobile:</strong> ${booking.mobileNo}</p>
                <p><strong>Validity:</strong> ${booking.validity}</p>
                <p><strong>Amount Paid:</strong> ${booking.amount}</p>
            </div>
            <div class="booking-image">
                <img src="${booking.imagePath}" alt="${booking.destination}">
            </div>
        </div>
        <div class="booking-footer">
            <div class="booking-dates">
                Valid from: ${booking.validFrom} to ${booking.validTo}
            </div>
            <button class="view-pass-btn" data-booking-id="${booking.id}">
                <i class="fas fa-ticket-alt"></i> View Pass
            </button>
        </div>
    `;
    
    // Add event listener to the View Pass button
    card.querySelector('.view-pass-btn').addEventListener('click', function() {
        showBookedPass(booking);
    });
    
    return card;
}

// Function to show a previously booked pass
function showBookedPass(booking) {
    // Fill in the travel pass modal with the booking data
    document.getElementById('passName').textContent = booking.fullName;
    document.getElementById('passEmailDisplay').textContent = booking.email;
    document.getElementById('passMobile').textContent = booking.mobileNo;
    document.getElementById('passValidity').textContent = booking.validity;
    document.getElementById('passDestination').textContent = booking.destination;
    document.getElementById('passAmount').textContent = booking.amount;
    document.getElementById('validFrom').textContent = booking.validFrom;
    document.getElementById('validTo').textContent = booking.validTo;
    
    // Set destination image
    const passImage = document.getElementById('passImage');
    passImage.src = booking.imagePath;
    
    // Close bookings modal and show travel pass modal
    myBookingsModal.style.display = 'none';
    travelPassModal.style.display = 'flex';
}