// Auth Module - Handles login, signup, and authentication state

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const authContainer = document.getElementById('auth-container');
    const dashboardContainer = document.getElementById('dashboard-container');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const showSignupLink = document.getElementById('show-signup');
    const showLoginLink = document.getElementById('show-login');
    const loginButton = document.getElementById('login-button');
    const signupButton = document.getElementById('signup-button');
    const logoutButton = document.getElementById('logout-button');
    const userNameDisplay = document.getElementById('user-name');
    
    // Toggle between login and signup forms
    showSignupLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
    });
    
    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        signupForm.style.display = 'none';
        loginForm.style.display = 'block';
    });
    
    // Handle login
    loginButton.addEventListener('click', () => {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        if (!email || !password) {
            alert('Please enter both email and password');
            return;
        }
        
        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Clear login form
                document.getElementById('login-email').value = '';
                document.getElementById('login-password').value = '';
            })
            .catch((error) => {
                alert(`Login failed: ${error.message}`);
            });
    });
    
    // Handle signup
    signupButton.addEventListener('click', () => {
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        
        if (!name || !email || !password) {
            alert('Please fill in all fields');
            return;
        }
        
        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Add user to Firestore with additional data
                return db.collection('users').doc(userCredential.user.uid).set({
                    name: name,
                    email: email,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            })
            .then(() => {
                // Clear signup form
                document.getElementById('signup-name').value = '';
                document.getElementById('signup-email').value = '';
                document.getElementById('signup-password').value = '';
                
                // Switch back to login form
                signupForm.style.display = 'none';
                loginForm.style.display = 'block';
                
                alert('Account created successfully! Please log in.');
            })
            .catch((error) => {
                alert(`Signup failed: ${error.message}`);
            });
    });
    
    // Handle logout
    logoutButton.addEventListener('click', () => {
        auth.signOut()
            .catch((error) => {
                console.error('Logout error:', error);
            });
    });
    
    // Auth state observer
    auth.onAuthStateChanged((user) => {
        if (user) {
            // User is signed in
            db.collection('users').doc(user.uid).get()
                .then((doc) => {
                    if (doc.exists) {
                        userNameDisplay.textContent = doc.data().name;
                    }
                })
                .catch((error) => {
                    console.error('Error getting user data:', error);
                });
            
            // Show dashboard, hide auth container
            authContainer.style.display = 'none';
            dashboardContainer.style.display = 'block';
            
            // Load user data
            loadUserData(user.uid);
        } else {
            // User is signed out
            authContainer.style.display = 'block';
            dashboardContainer.style.display = 'none';
        }
    });
});

// Function to load user data for all modules
function loadUserData(userId) {
    // Load finance data
    if (typeof loadFinanceData === 'function') {
        loadFinanceData(userId);
    }
    
    // Load calisthenics data
    if (typeof loadCalisthenicsData === 'function') {
        loadCalisthenicsData(userId);
    }
    
    // Load study data
    if (typeof loadStudyData === 'function') {
        loadStudyData(userId);
    }
}