document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const toggleIcon = togglePasswordBtn.querySelector('svg');

    // Toggle Password Visibility
    togglePasswordBtn.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        // Update Icon
        if (type === 'text') {
            toggleIcon.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>';
        } else {
            toggleIcon.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>';
        }
    });

    // Handle Form Submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const submitBtn = loginForm.querySelector('.btn-primary');
        const originalBtnText = submitBtn.innerText;

        // Basic Validation
        if (!email || !password) {
            showNotification('Please fill in all fields', 'error');
            return;
        }

        // State
        let isLoginMode = true;

        // Toggle Login/Register Mode
        const formTitle = document.querySelector('.login-header h1');
        const formSubtitle = document.querySelector('.login-header p');
        const submitBtn = document.querySelector('.btn-primary');
        const toggleModeLink = document.querySelector('.login-footer a');
        const footerText = document.querySelector('.login-footer p');

        if (toggleModeLink) {
            toggleModeLink.addEventListener('click', (e) => {
                e.preventDefault();
                isLoginMode = !isLoginMode;

                if (isLoginMode) {
                    formTitle.innerText = 'Welcome Back';
                    formSubtitle.innerText = 'Please enter your details to sign in.';
                    submitBtn.innerText = 'Sign in';
                    footerText.innerHTML = 'Don\'t have an account? <a href="#">Sign up</a>';
                } else {
                    formTitle.innerText = 'Create Account';
                    formSubtitle.innerText = 'Start your journey with us.';
                    submitBtn.innerText = 'Sign up';
                    footerText.innerHTML = 'Already have an account? <a href="#">Sign in</a>';
                }

                // Re-attach event listener to new link (or just use delegation, but simple re-query or static check is fine if specific element is targeted. 
                // Better: update text content only and keep element.)
                // Simplified approach: usage of innerHTML replaces the anchor, so we need to re-bind or just change text.
                // Let's just change text node.

                // Re-rendering logic fix:
                // Actually, let's just reload the page or keep it simple.
                // Correct approach for this snippet:
                updateFooterLink();
            });
        }

        function updateFooterLink() {
            // This is a bit hacky for a simple script, let's just use static logic in the listener
            // detailed above is complex to maintain in a simple replace.
            // Let's just REPLACE the entire listener logic with a cleaner one in the file if possible, 
            // OR just handle the API call based on current button text.
        }

        // Handle Form Submission
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const originalBtnText = submitBtn.innerText;

            // Basic Validation
            if (!email || !password) {
                showNotification('Please fill in all fields', 'error');
                return;
            }

            // Determine Mode based on Button Text or State
            const mode = submitBtn.innerText.includes('Sign in') ? 'login' : 'register';
            const endpoint = mode === 'login' ? '/api/login' : '/api/register';

            // API Interaction
            submitBtn.disabled = true;
            submitBtn.innerText = 'Processing...';

            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    showNotification(mode === 'login' ? 'Successfully logged in!' : 'Account created! Please sign in.', 'success');
                    if (mode === 'register') {
                        // Switch to login mode automatically
                        // Trigger click on toggle or just reset form
                        loginForm.reset();
                        // Optional: switch back to login view
                        toggleModeLink.click();
                    }
                } else {
                    showNotification(data.error || 'Action failed', 'error');
                }
            } catch (error) {
                showNotification('Network error occurred. Ensure server is running.', 'error');
                console.error('Error:', error);
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerText = originalBtnText;
            }
        });

        // Toggle Mode Logic (Separate from submission to keep clean)
        // We need to fetch the footer link again or listener.
        // Let's rewrite the footer handling completely.
        document.querySelector('.login-footer').addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                e.preventDefault();
                isLoginMode = !isLoginMode;
                if (isLoginMode) {
                    formTitle.innerText = 'Welcome Back';
                    formSubtitle.innerText = 'Please enter your details to sign in.';
                    submitBtn.innerText = 'Sign in';
                    footerText.innerHTML = 'Don\'t have an account? <a href="#">Sign up</a>';
                } else {
                    formTitle.innerText = 'Create Account';
                    formSubtitle.innerText = 'Start your journey with us.';
                    submitBtn.innerText = 'Sign up';
                    footerText.innerHTML = 'Already have an account? <a href="#">Sign in</a>';
                }
            }
        });
    });

    // Simple Notification System
    function showNotification(message, type = 'info') {
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) existingNotification.remove();

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerText = message;

        // Style the notification dynamically to keep CSS file clean for now
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 24px',
            borderRadius: '12px',
            background: type === 'success' ? '#10b981' : '#ef4444',
            color: 'white',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            zIndex: '1000',
            animation: 'slideIn 0.3s ease-out',
            fontFamily: "'Outfit', sans-serif",
            fontSize: '0.9rem'
        });

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            notification.style.transition = 'all 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Add keyframes for notification
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        @keyframes slideIn {
            from { transform: translateY(-100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    document.head.appendChild(styleSheet);
});
