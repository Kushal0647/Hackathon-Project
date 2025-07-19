
// Global variables
let selectedService = '';
let userLocation = '';

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize form handlers
    setupFormHandlers();
    
    // Setup mobile menu
    setupMobileMenu();
    
    // Setup location detection
    setupLocationDetection();
}

function setupFormHandlers() {
    // Login form handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Signup form handler
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
}

function setupMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
}

function setupLocationDetection() {
    // Try to get user's location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                reverseGeocode(lat, lng);
            },
            function(error) {
                console.log('Location access denied or unavailable');
            }
        );
    }
}

function reverseGeocode(lat, lng) {
    // This would typically use a geocoding service
    // For demo purposes, we'll just set a placeholder
    const locationInput = document.getElementById('locationInput');
    if (locationInput) {
        locationInput.placeholder = 'Location detected...';
    }
}

// Service selection
function selectService(serviceType) {
    selectedService = serviceType;
    
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('userLoggedIn');
    
    if (!isLoggedIn) {
        openModal('loginModal');
        return;
    }
    
    // Redirect to booking page
    window.location.href = `booking.html?service=${serviceType}`;
}

// Location and service finding
function findServices() {
    const locationInput = document.getElementById('locationInput');
    const location = locationInput.value.trim();
    
    if (!location) {
        alert('Please enter your location');
        return;
    }
    
    userLocation = location;
    
    // Scroll to services section
    document.getElementById('services').scrollIntoView({
        behavior: 'smooth'
    });
    
    // Highlight services
    animateServices();
}

function animateServices() {
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.transform = 'scale(1.05)';
            setTimeout(() => {
                card.style.transform = 'scale(1)';
            }, 200);
        }, index * 100);
    });
}

// Modal functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function switchModal(currentModalId, targetModalId) {
    closeModal(currentModalId);
    setTimeout(() => {
        openModal(targetModalId);
    }, 300);
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
});

// Form handlers
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Basic validation
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    // Show loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Logging in...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // This would typically make an AJAX call to your PHP backend
        // For demo purposes, we'll simulate a successful login
        
        const loginData = {
            email: email,
            password: password,
            action: 'login'
        };
        
        // In a real application, you would send this to your PHP backend
        // fetch('auth.php', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(loginData)
        // })
        // .then(response => response.json())
        // .then(data => {
        //     if (data.success) {
        //         handleLoginSuccess(data.user);
        //     } else {
        //         alert(data.message);
        //     }
        // });
        
        // Simulate successful login
        handleLoginSuccess({
            id: 1,
            name: 'John Doe',
            email: email,
            type: 'customer'
        });
        
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 1500);
}

function handleSignup(event) {
    event.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const phone = document.getElementById('signupPhone').value;
    const password = document.getElementById('signupPassword').value;
    const userType = document.getElementById('userType').value;
    
    // Basic validation
    if (!name || !email || !phone || !password || !userType) {
        alert('Please fill in all fields');
        return;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
    }
    
    // Show loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Creating account...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        const signupData = {
            name: name,
            email: email,
            phone: phone,
            password: password,
            userType: userType,
            action: 'signup'
        };
        
        // In a real application, you would send this to your PHP backend
        // Similar to login, but for registration
        
        // Simulate successful signup
        handleLoginSuccess({
            id: Date.now(),
            name: name,
            email: email,
            type: userType
        });
        
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 1500);
}

function handleLoginSuccess(user) {
    // Store user data
    localStorage.setItem('userLoggedIn', 'true');
    localStorage.setItem('userData', JSON.stringify(user));
    
    // Close modal
    closeModal('loginModal');
    closeModal('signupModal');
    
    // Update UI
    updateUIForLoggedInUser(user);
    
    // Show success message
    showNotification('Welcome to HomeServe!', 'success');
    
    // If a service was selected, redirect to booking
    if (selectedService) {
        setTimeout(() => {
            window.location.href = `booking.html?service=${selectedService}`;
        }, 1000);
    }
}

function updateUIForLoggedInUser(user) {
    // Update header buttons
    const loginBtn = document.querySelector('.btn-login');
    const signupBtn = document.querySelector('.btn-signup');
    
    if (loginBtn && signupBtn) {
        loginBtn.textContent = `Hi, ${user.name.split(' ')[0]}`;
        loginBtn.onclick = () => window.location.href = 'dashboard.html';
        
        signupBtn.textContent = 'Logout';
        signupBtn.onclick = handleLogout;
    }
}

function handleLogout() {
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userData');
    
    // Reset UI
    const loginBtn = document.querySelector('.btn-login');
    const signupBtn = document.querySelector('.btn-signup');
    
    if (loginBtn && signupBtn) {
        loginBtn.textContent = 'Login';
        loginBtn.onclick = () => openModal('loginModal');
        
        signupBtn.textContent = 'Sign Up';
        signupBtn.onclick = () => openModal('signupModal');
    }
    
    showNotification('Logged out successfully', 'info');
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#00b894' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 3000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Check if user is already logged in on page load
document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('userLoggedIn');
    const userData = localStorage.getItem('userData');
    
    if (isLoggedIn && userData) {
        const user = JSON.parse(userData);
        updateUIForLoggedInUser(user);
    }
});

// Smooth scrolling for navigation links
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

// Add scroll effect to header
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = '#fff';
        header.style.backdropFilter = 'none';
    }
});
