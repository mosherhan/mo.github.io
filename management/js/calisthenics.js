// Calisthenics Module - Handles workout tracking and progression

// Global variables
let currentUserId = null;
let progressChart = null;

// Load calisthenics data when user logs in
function loadCalisthenicsData(userId) {
    currentUserId = userId;
    
    // Load skills list
    loadSkillsList();
    
    // Load workout logs
    loadWorkoutLogs();
    
    // Initialize chart (if needed)
    initializeProgressChart();
}

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const addWorkoutBtn = document.getElementById('add-workout');
    const addSkillBtn = document.getElementById('add-skill');
    
    // Add workout log
    addWorkoutBtn.addEventListener('click', () => {
        const skillId = document.getElementById('workout-skill').value;
        const sets = parseInt(document.getElementById('workout-sets').value);
        const reps = parseInt(document.getElementById('workout-reps').value);
        const notes = document.getElementById('workout-notes').value;
        
        if (!skillId || isNaN(sets) || isNaN(reps) || sets <= 0 || reps <= 0) {
            alert('Please enter valid workout details');
            return;
        }
        
        addWorkoutLog(skillId, sets, reps, notes);
    });
    
    // Add new skill
    addSkillBtn.addEventListener('click', () => {
        const skillName = document.getElementById('skill-name').value;
        const skillCategory = document.getElementById('skill-category').value;
        
        if (!skillName || !skillCategory) {
            alert('Please enter a valid skill name and category');
            return;
        }
        
        addSkill(skillName, skillCategory);
    });
});

// Add a new calisthenics skill
function addSkill(name, category) {
    if (!currentUserId) return;
    
    const skillData = {
        name: name,
        category: category,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    db.collection('users').doc(currentUserId).collection('calisthenicsSkills').add(skillData)
        .then(() => {
            // Clear form
            document.getElementById('skill-name').value = '';
            
            // Reload skills
            loadSkillsList();
        })
        .catch((error) => {
            console.error('Error adding skill:', error);
            alert('Failed to add skill. Please try again.');
        });
}

// Load skills list from Firestore
function loadSkillsList() {
    if (!currentUserId) return;
    
    const skillsDropdown = document.getElementById('workout-skill');
    const skillsList = document.getElementById('skills-list');
    
    // Clear existing options (keep the default)
    while (skillsDropdown.options.length > 1) {
        skillsDropdown.remove(1);
    }
    
    skillsList.innerHTML = '<p>Loading skills...</p>';
    
    db.collection('users').doc(currentUserId).collection('calisthenicsSkills')
        .orderBy('name')
        .get()
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
                skillsList.innerHTML = '<p>No skills added yet. Add your first skill above.</p>';
                return;
            }
            
            skillsList.innerHTML = '';
            
            querySnapshot.forEach((doc) => {
                const skill = doc.data();
                const skillId = doc.id;
                
                // Add to dropdown
                const option = document.createElement('option');
                option.value = skillId;
                option.textContent = skill.name;
                skillsDropdown.appendChild(option);
                
                // Add to skills list
                const skillElement = document.createElement('div');
                skillElement.className = 'card';
                skillElement.innerHTML = `
                    <div class="card-header">
                        <h4>${skill.name}</h4>
                        <div>Category: ${skill.category}</div>
                    </div>
                    <div class="card-actions">
                        <button class="btn view-progress" data-id="${skillId}" data-name="${skill.name}">View Progress</button>
                        <button class="btn delete-skill" data-id="${skillId}">Delete</button>
                    </div>
                `;
                
                skillsList.appendChild(skillElement);
            });
            
            // Add event listeners to buttons
            document.querySelectorAll('.view-progress').forEach(button => {
                button.addEventListener('click', (e) => {
                    const skillId = e.target.getAttribute('data-id');
                    const skillName = e.target.getAttribute('data-name');
                    viewSkillProgress(skillId, skillName);
                });
            });
            
            document.querySelectorAll('.delete-skill').forEach(button => {
                button.addEventListener('click', (e) => {
                    const skillId = e.target.getAttribute('data-id');
                    if (confirm('Are you sure you want to delete this skill? All related workout logs will also be deleted.')) {
                        deleteSkill(skillId);
                    }
                });
            });
        })
        .catch((error) => {
            console.error('Error loading skills:', error);
            skillsList.innerHTML = '<p>Error loading skills. Please try again later.</p>';
        });
}

// Delete a skill
function deleteSkill(skillId) {
    if (!currentUserId) return;
    
    // Delete the skill
    db.collection('users').doc(currentUserId).collection('calisthenicsSkills').doc(skillId)
        .delete()
        .then(() => {
            // Also delete all workout logs for this skill
            db.collection('users').doc(currentUserId).collection('workoutLogs')
                .where('skillId', '==', skillId)
                .get()
                .then((querySnapshot) => {
                    const batch = db.batch();
                    querySnapshot.forEach((doc) => {
                        batch.delete(doc.ref);
                    });
                    return batch.commit();
                })
                .then(() => {
                    loadSkillsList();
                    loadWorkoutLogs();
                })
                .catch((error) => {
                    console.error('Error deleting workout logs:', error);
                });
        })
        .catch((error) => {
            console.error('Error deleting skill:', error);
            alert('Failed to delete skill. Please try again.');
        });
}

// Add a workout log
function addWorkoutLog(skillId, sets, reps, notes) {
    if (!currentUserId) return;
    
    // Get skill name first
    db.collection('users').doc(currentUserId).collection('calisthenicsSkills').doc(skillId)
        .get()
        .then((doc) => {
            if (!doc.exists) {
                alert('Selected skill not found');
                return;
            }
            
            const skillName = doc.data().name;
            
            const workoutData = {
                skillId: skillId,
                skillName: skillName,
                sets: sets,
                reps: reps,
                notes: notes,
                date: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            return db.collection('users').doc(currentUserId).collection('workoutLogs').add(workoutData);
        })
        .then(() => {
            // Clear form
            document.getElementById('workout-sets').value = '';
            document.getElementById('workout-reps').value = '';
            document.getElementById('workout-notes').value = '';
            
            // Reload workout logs
            loadWorkoutLogs();
        })
        .catch((error) => {
            console.error('Error adding workout log:', error);
            alert('Failed to add workout log. Please try again.');
        });
}

// Load workout logs from Firestore
function loadWorkoutLogs() {
    if (!currentUserId) return;
    
    const workoutsList = document.getElementById('workouts-list');
    workoutsList.innerHTML = '<p>Loading workout logs...</p>';
    
    db.collection('users').doc(currentUserId).collection('workoutLogs')
        .orderBy('date', 'desc')
        .limit(10) // Limit to recent logs
        .get()
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
                workoutsList.innerHTML = '<p>No workout logs yet. Add your first workout above.</p>';
                return;
            }
            
            workoutsList.innerHTML = '';
            
            querySnapshot.forEach((doc) => {
                const workout = doc.data();
                const workoutId = doc.id;
                
                const workoutElement = document.createElement('div');
                workoutElement.className = 'card';
                workoutElement.innerHTML = `
                    <div class="card-header">
                        <h4>${workout.skillName}</h4>
                        <div>${workout.sets} sets × ${workout.reps} reps</div>
                        <div>${formatDate(workout.date)}</div>
                    </div>
                    <div class="card-body">
                        <p>${workout.notes || 'No notes'}</p>
                    </div>
                    <div class="card-actions">
                        <button class="btn delete-workout" data-id="${workoutId}">Delete</button>
                    </div>
                `;
                
                workoutsList.appendChild(workoutElement);
            });
            
            // Add event listeners to delete buttons
            document.querySelectorAll('.delete-workout').forEach(button => {
                button.addEventListener('click', (e) => {
                    const workoutId = e.target.getAttribute('data-id');
                    if (confirm('Are you sure you want to delete this workout log?')) {
                        deleteWorkoutLog(workoutId);
                    }
                });
            });
            
            // Update last updated timestamp
            const lastUpdated = querySnapshot.docs.length > 0 ? 
                querySnapshot.docs[0].data().date : null;
            document.getElementById('calisthenics-last-updated').textContent = formatDate(lastUpdated);
        })
        .catch((error) => {
            console.error('Error loading workout logs:', error);
            workoutsList.innerHTML = '<p>Error loading workout logs. Please try again later.</p>';
        });
}

// Delete a workout log
function deleteWorkoutLog(workoutId) {
    if (!currentUserId) return;
    
    db.collection('users').doc(currentUserId).collection('workoutLogs').doc(workoutId)
        .delete()
        .then(() => {
            loadWorkoutLogs();
        })
        .catch((error) => {
            console.error('Error deleting workout log:', error);
            alert('Failed to delete workout log. Please try again.');
        });
}

// View progress for a specific skill
function viewSkillProgress(skillId, skillName) {
    if (!currentUserId) return;
    
    // Show progress modal or section
    const progressSection = document.getElementById('skill-progress-section');
    progressSection.style.display = 'block';
    document.getElementById('progress-skill-name').textContent = skillName;
    
    // Get workout logs for this skill
    db.collection('users').doc(currentUserId).collection('workoutLogs')
        .where('skillId', '==', skillId)
        .orderBy('date')
        .limit(20) // Limit to recent logs for performance
        .get()
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
                document.getElementById('progress-chart-container').innerHTML = 
                    '<p>No workout data available for this skill yet.</p>';
                return;
            }
            
            // Prepare data for chart
            const dates = [];
            const repData = [];
            
            querySnapshot.forEach((doc) => {
                const workout = doc.data();
                dates.push(formatDate(workout.date, true));
                repData.push(workout.sets * workout.reps); // Total volume (sets × reps)
            });
            
            // Update or create chart
            updateProgressChart(dates, repData, skillName);
        })
        .catch((error) => {
            console.error('Error loading skill progress:', error);
            document.getElementById('progress-chart-container').innerHTML = 
                '<p>Error loading progress data. Please try again later.</p>';
        });
}

// Initialize progress chart
function initializeProgressChart() {
    const chartCanvas = document.getElementById('progress-chart');
    if (!chartCanvas) return;
    
    // If chart already exists, destroy it
    if (progressChart) {
        progressChart.destroy();
    }
    
    // Create empty chart
    progressChart = new Chart(chartCanvas, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Total Volume (Sets × Reps)',
                data: [],
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Total Volume'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                }
            }
        }
    });
}

// Update progress chart with new data
function updateProgressChart(dates, repData, skillName) {
    const chartCanvas = document.getElementById('progress-chart');
    if (!chartCanvas) return;
    
    // If chart doesn't exist, initialize it
    if (!progressChart) {
        initializeProgressChart();
    }
    
    // Update chart data
    progressChart.data.labels = dates;
    progressChart.data.datasets[0].data = repData;
    progressChart.data.datasets[0].label = `${skillName} - Total Volume (Sets × Reps)`;
    
    // Update chart
    progressChart.update();
}