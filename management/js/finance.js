// Finance Module - Handles financial goals and transactions

// Global variables
let currentUserId = null;

// Load finance data when user logs in
function loadFinanceData(userId) {
    currentUserId = userId;
    
    // Load financial goals
    loadFinancialGoals();
    
    // Load transactions
    loadTransactions();
}

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const addFinanceGoalBtn = document.getElementById('add-finance-goal');
    const addTransactionBtn = document.getElementById('add-transaction');
    
    // Add financial goal
    addFinanceGoalBtn.addEventListener('click', () => {
        const goalName = document.getElementById('finance-goal-name').value;
        const goalAmount = parseFloat(document.getElementById('finance-goal-amount').value);
        const goalType = document.getElementById('finance-goal-type').value;
        
        if (!goalName || isNaN(goalAmount) || goalAmount <= 0) {
            alert('Please enter a valid goal name and amount');
            return;
        }
        
        addFinancialGoal(goalName, goalAmount, goalType);
    });
    
    // Add transaction
    addTransactionBtn.addEventListener('click', () => {
        const transactionName = document.getElementById('transaction-name').value;
        const transactionAmount = parseFloat(document.getElementById('transaction-amount').value);
        const transactionType = document.getElementById('transaction-type').value;
        
        if (!transactionName || isNaN(transactionAmount) || transactionAmount <= 0) {
            alert('Please enter a valid transaction description and amount');
            return;
        }
        
        addTransaction(transactionName, transactionAmount, transactionType);
    });
});

// Add a financial goal
function addFinancialGoal(name, amount, type) {
    if (!currentUserId) return;
    
    const goalData = {
        name: name,
        amount: amount,
        type: type,
        currentAmount: 0,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    db.collection('users').doc(currentUserId).collection('financialGoals').add(goalData)
        .then(() => {
            // Clear form
            document.getElementById('finance-goal-name').value = '';
            document.getElementById('finance-goal-amount').value = '';
            
            // Reload goals
            loadFinancialGoals();
        })
        .catch((error) => {
            console.error('Error adding goal:', error);
            alert('Failed to add goal. Please try again.');
        });
}

// Load financial goals from Firestore
function loadFinancialGoals() {
    if (!currentUserId) return;
    
    const goalsList = document.getElementById('finance-goals-list');
    goalsList.innerHTML = '<p>Loading goals...</p>';
    
    db.collection('users').doc(currentUserId).collection('financialGoals')
        .orderBy('createdAt', 'desc')
        .get()
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
                goalsList.innerHTML = '<p>No financial goals yet. Add your first goal above.</p>';
                return;
            }
            
            goalsList.innerHTML = '';
            
            querySnapshot.forEach((doc) => {
                const goal = doc.data();
                const goalId = doc.id;
                const progressPercentage = (goal.currentAmount / goal.amount) * 100;
                
                const goalElement = document.createElement('div');
                goalElement.className = 'card';
                goalElement.innerHTML = `
                    <div class="card-header">
                        <h4>${goal.name} (${goal.type})</h4>
                        <div>Target: ${formatCurrency(goal.amount)}</div>
                        <div>Current: ${formatCurrency(goal.currentAmount)}</div>
                    </div>
                    <div class="progress-container">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progressPercentage}%"></div>
                        </div>
                        <div>${Math.round(progressPercentage)}% complete</div>
                    </div>
                    <div class="card-actions">
                        <button class="btn update-goal" data-id="${goalId}">Update Progress</button>
                        <button class="btn delete-goal" data-id="${goalId}">Delete</button>
                    </div>
                `;
                
                goalsList.appendChild(goalElement);
            });
            
            // Add event listeners to buttons
            document.querySelectorAll('.update-goal').forEach(button => {
                button.addEventListener('click', (e) => {
                    const goalId = e.target.getAttribute('data-id');
                    const newAmount = prompt('Enter current amount:');
                    if (newAmount !== null && !isNaN(parseFloat(newAmount))) {
                        updateGoalProgress(goalId, parseFloat(newAmount));
                    }
                });
            });
            
            document.querySelectorAll('.delete-goal').forEach(button => {
                button.addEventListener('click', (e) => {
                    const goalId = e.target.getAttribute('data-id');
                    if (confirm('Are you sure you want to delete this goal?')) {
                        deleteGoal(goalId);
                    }
                });
            });
            
            // Update last updated timestamp
            const lastUpdated = querySnapshot.docs.length > 0 ? 
                querySnapshot.docs[0].data().updatedAt : null;
            document.getElementById('finance-last-updated').textContent = formatDate(lastUpdated);
        })
        .catch((error) => {
            console.error('Error loading goals:', error);
            goalsList.innerHTML = '<p>Error loading goals. Please try again later.</p>';
        });
}

// Update goal progress
function updateGoalProgress(goalId, newAmount) {
    if (!currentUserId) return;
    
    db.collection('users').doc(currentUserId).collection('financialGoals').doc(goalId)
        .update({
            currentAmount: newAmount,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
            loadFinancialGoals();
        })
        .catch((error) => {
            console.error('Error updating goal:', error);
            alert('Failed to update goal. Please try again.');
        });
}

// Delete a goal
function deleteGoal(goalId) {
    if (!currentUserId) return;
    
    db.collection('users').doc(currentUserId).collection('financialGoals').doc(goalId)
        .delete()
        .then(() => {
            loadFinancialGoals();
        })
        .catch((error) => {
            console.error('Error deleting goal:', error);
            alert('Failed to delete goal. Please try again.');
        });
}

// Add a transaction
function addTransaction(name, amount, type) {
    if (!currentUserId) return;
    
    const transactionData = {
        name: name,
        amount: amount,
        type: type,
        date: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    db.collection('users').doc(currentUserId).collection('transactions').add(transactionData)
        .then(() => {
            // Clear form
            document.getElementById('transaction-name').value = '';
            document.getElementById('transaction-amount').value = '';
            
            // Reload transactions
            loadTransactions();
            
            // Update financial goals if this is income
            if (type === 'income') {
                updateGoalsWithIncome(amount);
            }
        })
        .catch((error) => {
            console.error('Error adding transaction:', error);
            alert('Failed to add transaction. Please try again.');
        });
}

// Load transactions from Firestore
function loadTransactions() {
    if (!currentUserId) return;
    
    const transactionsList = document.getElementById('transactions-list');
    transactionsList.innerHTML = '<p>Loading transactions...</p>';
    
    db.collection('users').doc(currentUserId).collection('transactions')
        .orderBy('date', 'desc')
        .limit(10) // Limit to recent transactions
        .get()
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
                transactionsList.innerHTML = '<p>No transactions yet. Add your first transaction above.</p>';
                return;
            }
            
            transactionsList.innerHTML = '';
            
            querySnapshot.forEach((doc) => {
                const transaction = doc.data();
                const transactionId = doc.id;
                
                const transactionElement = document.createElement('div');
                transactionElement.className = 'card';
                transactionElement.innerHTML = `
                    <div class="card-header">
                        <h4>${transaction.name}</h4>
                        <div class="${transaction.type === 'income' ? 'income' : 'expense'}">
                            ${transaction.type === 'income' ? '+' : '-'} ${formatCurrency(transaction.amount)}
                        </div>
                        <div>${formatDate(transaction.date)}</div>
                    </div>
                    <div class="card-actions">
                        <button class="btn delete-transaction" data-id="${transactionId}">Delete</button>
                    </div>
                `;
                
                transactionsList.appendChild(transactionElement);
            });
            
            // Add event listeners to delete buttons
            document.querySelectorAll('.delete-transaction').forEach(button => {
                button.addEventListener('click', (e) => {
                    const transactionId = e.target.getAttribute('data-id');
                    if (confirm('Are you sure you want to delete this transaction?')) {
                        deleteTransaction(transactionId);
                    }
                });
            });
        })
        .catch((error) => {
            console.error('Error loading transactions:', error);
            transactionsList.innerHTML = '<p>Error loading transactions. Please try again later.</p>';
        });
}

// Delete a transaction
function deleteTransaction(transactionId) {
    if (!currentUserId) return;
    
    db.collection('users').doc(currentUserId).collection('transactions').doc(transactionId)
        .delete()
        .then(() => {
            loadTransactions();
        })
        .catch((error) => {
            console.error('Error deleting transaction:', error);
            alert('Failed to delete transaction. Please try again.');
        });
}

// Update goals with income
function updateGoalsWithIncome(incomeAmount) {
    if (!currentUserId) return;
    
    // Get savings goals
    db.collection('users').doc(currentUserId).collection('financialGoals')
        .where('type', '==', 'savings')
        .get()
        .then((querySnapshot) => {
            if (querySnapshot.empty) return;
            
            // For simplicity, update the first savings goal found
            const firstSavingsGoal = querySnapshot.docs[0];
            const currentAmount = firstSavingsGoal.data().currentAmount || 0;
            
            // Update the goal with the new income
            firstSavingsGoal.ref.update({
                currentAmount: currentAmount + incomeAmount,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            })
            .then(() => {
                loadFinancialGoals();
            })
            .catch((error) => {
                console.error('Error updating savings goal:', error);
            });
        })
        .catch((error) => {
            console.error('Error finding savings goals:', error);
        });
}