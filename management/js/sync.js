// Real-time Data Synchronization Module

// Set up real-time listeners for different data collections
function setupRealTimeListeners(userId) {
    if (!userId) return;
    
    // Set up listeners for financial goals
    setupFinancialGoalsListener(userId);
    
    // Set up listeners for transactions
    setupTransactionsListener(userId);
    
    // Set up listeners for calisthenics skills and workouts
    setupCalisthenicsListener(userId);
    
    // Set up listeners for study subjects and sessions
    setupStudyListener(userId);
}

// Financial goals real-time listener
function setupFinancialGoalsListener(userId) {
    db.collection('users').doc(userId).collection('financialGoals')
        .onSnapshot((snapshot) => {
            // Handle real-time updates
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added' || change.type === 'modified') {
                    // Refresh financial goals display
                    loadFinancialGoals();
                }
            });
            
            // Update last updated timestamp
            if (snapshot.docs.length > 0) {
                document.getElementById('finance-last-updated').textContent = 
                    formatDate(new Date()) + ' (auto-updated)';
            }
        }, (error) => {
            console.error('Error setting up financial goals listener:', error);
        });
}

// Transactions real-time listener
function setupTransactionsListener(userId) {
    db.collection('users').doc(userId).collection('transactions')
        .orderBy('date', 'desc')
        .limit(10)
        .onSnapshot((snapshot) => {
            // Handle real-time updates
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added' || change.type === 'modified' || change.type === 'removed') {
                    // Refresh transactions display
                    loadTransactions();
                }
            });
        }, (error) => {
            console.error('Error setting up transactions listener:', error);
        });
}

// Calisthenics skills and workouts real-time listener
function setupCalisthenicsListener(userId) {
    // Skills listener
    db.collection('users').doc(userId).collection('calisthenicsSkills')
        .onSnapshot((snapshot) => {
            // Handle real-time updates
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added' || change.type === 'modified' || change.type === 'removed') {
                    // Refresh skills list
                    loadSkillsList();
                }
            });
        }, (error) => {
            console.error('Error setting up calisthenics skills listener:', error);
        });
    
    // Workout logs listener
    db.collection('users').doc(userId).collection('workoutLogs')
        .orderBy('date', 'desc')
        .limit(10)
        .onSnapshot((snapshot) => {
            // Handle real-time updates
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added' || change.type === 'modified' || change.type === 'removed') {
                    // Refresh workout logs
                    loadWorkoutLogs();
                }
            });
            
            // Update last updated timestamp
            if (snapshot.docs.length > 0) {
                document.getElementById('calisthenics-last-updated').textContent = 
                    formatDate(new Date()) + ' (auto-updated)';
            }
        }, (error) => {
            console.error('Error setting up workout logs listener:', error);
        });
}

// Study subjects and sessions real-time listener
function setupStudyListener(userId) {
    // Subjects listener
    db.collection('users').doc(userId).collection('studySubjects')
        .onSnapshot((snapshot) => {
            // Handle real-time updates
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added' || change.type === 'modified' || change.type === 'removed') {
                    // Refresh subjects list
                    loadSubjectsList();
                }
            });
        }, (error) => {
            console.error('Error setting up study subjects listener:', error);
        });
    
    // Study sessions listener
    db.collection('users').doc(userId).collection('studySessions')
        .orderBy('date', 'desc')
        .limit(10)
        .onSnapshot((snapshot) => {
            // Handle real-time updates
            let needsUpdate = false;
            
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added' || change.type === 'modified' || change.type === 'removed') {
                    needsUpdate = true;
                }
            });
            
            if (needsUpdate) {
                // Refresh study sessions
                loadStudySessions();
                
                // Update weekly summary
                generateWeeklySummary();
            }
            
            // Update last updated timestamp
            if (snapshot.docs.length > 0) {
                document.getElementById('study-last-updated').textContent = 
                    formatDate(new Date()) + ' (auto-updated)';
            }
        }, (error) => {
            console.error('Error setting up study sessions listener:', error);
        });
}

// Update auth.js to call setupRealTimeListeners when user logs in
document.addEventListener('DOMContentLoaded', () => {
    // Listen for user login events
    document.addEventListener('userLoggedIn', (e) => {
        const userId = e.detail.userId;
        if (userId) {
            // Set up real-time listeners
            setupRealTimeListeners(userId);
        }
    });
});