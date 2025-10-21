// Study Module - Handles study tracking and subject management

// Global variables
let currentUserId = null;
let studySummaryChart = null;

// Load study data when user logs in
function loadStudyData(userId) {
    currentUserId = userId;
    
    // Load subjects list
    loadSubjectsList();
    
    // Load study sessions
    loadStudySessions();
    
    // Generate weekly summary
    generateWeeklySummary();
}

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const addSubjectBtn = document.getElementById('add-subject');
    const addStudySessionBtn = document.getElementById('add-study-session');
    
    // Add subject
    addSubjectBtn.addEventListener('click', () => {
        const subjectName = document.getElementById('subject-name').value;
        const subjectGoal = parseInt(document.getElementById('subject-goal').value);
        
        if (!subjectName || isNaN(subjectGoal) || subjectGoal <= 0) {
            alert('Please enter a valid subject name and weekly goal (in minutes)');
            return;
        }
        
        addSubject(subjectName, subjectGoal);
    });
    
    // Add study session
    addStudySessionBtn.addEventListener('click', () => {
        const subjectId = document.getElementById('session-subject').value;
        const duration = parseInt(document.getElementById('session-duration').value);
        const focusScore = parseInt(document.getElementById('session-focus').value);
        const notes = document.getElementById('session-notes').value;
        
        if (!subjectId || isNaN(duration) || duration <= 0 || isNaN(focusScore)) {
            alert('Please enter valid session details');
            return;
        }
        
        addStudySession(subjectId, duration, focusScore, notes);
    });
});

// Add a new subject
function addSubject(name, weeklyGoal) {
    if (!currentUserId) return;
    
    const subjectData = {
        name: name,
        weeklyGoal: weeklyGoal, // in minutes
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    db.collection('users').doc(currentUserId).collection('studySubjects').add(subjectData)
        .then(() => {
            // Clear form
            document.getElementById('subject-name').value = '';
            document.getElementById('subject-goal').value = '';
            
            // Reload subjects
            loadSubjectsList();
        })
        .catch((error) => {
            console.error('Error adding subject:', error);
            alert('Failed to add subject. Please try again.');
        });
}

// Load subjects list from Firestore
function loadSubjectsList() {
    if (!currentUserId) return;
    
    const subjectsDropdown = document.getElementById('session-subject');
    const subjectsList = document.getElementById('subjects-list');
    
    // Clear existing options (keep the default)
    while (subjectsDropdown.options.length > 1) {
        subjectsDropdown.remove(1);
    }
    
    subjectsList.innerHTML = '<p>Loading subjects...</p>';
    
    db.collection('users').doc(currentUserId).collection('studySubjects')
        .orderBy('name')
        .get()
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
                subjectsList.innerHTML = '<p>No subjects added yet. Add your first subject above.</p>';
                return;
            }
            
            subjectsList.innerHTML = '';
            
            querySnapshot.forEach((doc) => {
                const subject = doc.data();
                const subjectId = doc.id;
                
                // Add to dropdown
                const option = document.createElement('option');
                option.value = subjectId;
                option.textContent = subject.name;
                subjectsDropdown.appendChild(option);
                
                // Add to subjects list
                const subjectElement = document.createElement('div');
                subjectElement.className = 'card';
                subjectElement.innerHTML = `
                    <div class="card-header">
                        <h4>${subject.name}</h4>
                        <div>Weekly Goal: ${subject.weeklyGoal} minutes</div>
                    </div>
                    <div class="card-actions">
                        <button class="btn view-subject-progress" data-id="${subjectId}" data-name="${subject.name}">View Progress</button>
                        <button class="btn edit-subject" data-id="${subjectId}" data-goal="${subject.weeklyGoal}">Edit Goal</button>
                        <button class="btn delete-subject" data-id="${subjectId}">Delete</button>
                    </div>
                `;
                
                subjectsList.appendChild(subjectElement);
            });
            
            // Add event listeners to buttons
            document.querySelectorAll('.view-subject-progress').forEach(button => {
                button.addEventListener('click', (e) => {
                    const subjectId = e.target.getAttribute('data-id');
                    const subjectName = e.target.getAttribute('data-name');
                    viewSubjectProgress(subjectId, subjectName);
                });
            });
            
            document.querySelectorAll('.edit-subject').forEach(button => {
                button.addEventListener('click', (e) => {
                    const subjectId = e.target.getAttribute('data-id');
                    const currentGoal = e.target.getAttribute('data-goal');
                    const newGoal = prompt('Enter new weekly goal (in minutes):', currentGoal);
                    
                    if (newGoal !== null && !isNaN(parseInt(newGoal)) && parseInt(newGoal) > 0) {
                        updateSubjectGoal(subjectId, parseInt(newGoal));
                    }
                });
            });
            
            document.querySelectorAll('.delete-subject').forEach(button => {
                button.addEventListener('click', (e) => {
                    const subjectId = e.target.getAttribute('data-id');
                    if (confirm('Are you sure you want to delete this subject? All related study sessions will also be deleted.')) {
                        deleteSubject(subjectId);
                    }
                });
            });
        })
        .catch((error) => {
            console.error('Error loading subjects:', error);
            subjectsList.innerHTML = '<p>Error loading subjects. Please try again later.</p>';
        });
}

// Update subject goal
function updateSubjectGoal(subjectId, newGoal) {
    if (!currentUserId) return;
    
    db.collection('users').doc(currentUserId).collection('studySubjects').doc(subjectId)
        .update({
            weeklyGoal: newGoal
        })
        .then(() => {
            loadSubjectsList();
        })
        .catch((error) => {
            console.error('Error updating subject goal:', error);
            alert('Failed to update subject goal. Please try again.');
        });
}

// Delete a subject
function deleteSubject(subjectId) {
    if (!currentUserId) return;
    
    // Delete the subject
    db.collection('users').doc(currentUserId).collection('studySubjects').doc(subjectId)
        .delete()
        .then(() => {
            // Also delete all study sessions for this subject
            db.collection('users').doc(currentUserId).collection('studySessions')
                .where('subjectId', '==', subjectId)
                .get()
                .then((querySnapshot) => {
                    const batch = db.batch();
                    querySnapshot.forEach((doc) => {
                        batch.delete(doc.ref);
                    });
                    return batch.commit();
                })
                .then(() => {
                    loadSubjectsList();
                    loadStudySessions();
                    generateWeeklySummary();
                })
                .catch((error) => {
                    console.error('Error deleting study sessions:', error);
                });
        })
        .catch((error) => {
            console.error('Error deleting subject:', error);
            alert('Failed to delete subject. Please try again.');
        });
}

// Add a study session
function addStudySession(subjectId, duration, focusScore, notes) {
    if (!currentUserId) return;
    
    // Get subject name first
    db.collection('users').doc(currentUserId).collection('studySubjects').doc(subjectId)
        .get()
        .then((doc) => {
            if (!doc.exists) {
                alert('Selected subject not found');
                return;
            }
            
            const subjectName = doc.data().name;
            
            const sessionData = {
                subjectId: subjectId,
                subjectName: subjectName,
                duration: duration, // in minutes
                focusScore: focusScore, // 1-10
                notes: notes,
                date: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            return db.collection('users').doc(currentUserId).collection('studySessions').add(sessionData);
        })
        .then(() => {
            // Clear form
            document.getElementById('session-duration').value = '';
            document.getElementById('session-focus').value = '8';
            document.getElementById('session-notes').value = '';
            
            // Reload study sessions
            loadStudySessions();
            
            // Update weekly summary
            generateWeeklySummary();
        })
        .catch((error) => {
            console.error('Error adding study session:', error);
            alert('Failed to add study session. Please try again.');
        });
}

// Load study sessions from Firestore
function loadStudySessions() {
    if (!currentUserId) return;
    
    const sessionsList = document.getElementById('sessions-list');
    sessionsList.innerHTML = '<p>Loading study sessions...</p>';
    
    db.collection('users').doc(currentUserId).collection('studySessions')
        .orderBy('date', 'desc')
        .limit(10) // Limit to recent sessions
        .get()
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
                sessionsList.innerHTML = '<p>No study sessions yet. Add your first session above.</p>';
                return;
            }
            
            sessionsList.innerHTML = '';
            
            querySnapshot.forEach((doc) => {
                const session = doc.data();
                const sessionId = doc.id;
                
                const sessionElement = document.createElement('div');
                sessionElement.className = 'card';
                sessionElement.innerHTML = `
                    <div class="card-header">
                        <h4>${session.subjectName}</h4>
                        <div>${session.duration} minutes | Focus: ${session.focusScore}/10</div>
                        <div>${formatDate(session.date)}</div>
                    </div>
                    <div class="card-body">
                        <p>${session.notes || 'No notes'}</p>
                    </div>
                    <div class="card-actions">
                        <button class="btn delete-session" data-id="${sessionId}">Delete</button>
                    </div>
                `;
                
                sessionsList.appendChild(sessionElement);
            });
            
            // Add event listeners to delete buttons
            document.querySelectorAll('.delete-session').forEach(button => {
                button.addEventListener('click', (e) => {
                    const sessionId = e.target.getAttribute('data-id');
                    if (confirm('Are you sure you want to delete this study session?')) {
                        deleteStudySession(sessionId);
                    }
                });
            });
            
            // Update last updated timestamp
            const lastUpdated = querySnapshot.docs.length > 0 ? 
                querySnapshot.docs[0].data().date : null;
            document.getElementById('study-last-updated').textContent = formatDate(lastUpdated);
        })
        .catch((error) => {
            console.error('Error loading study sessions:', error);
            sessionsList.innerHTML = '<p>Error loading study sessions. Please try again later.</p>';
        });
}

// Delete a study session
function deleteStudySession(sessionId) {
    if (!currentUserId) return;
    
    db.collection('users').doc(currentUserId).collection('studySessions').doc(sessionId)
        .delete()
        .then(() => {
            loadStudySessions();
            generateWeeklySummary();
        })
        .catch((error) => {
            console.error('Error deleting study session:', error);
            alert('Failed to delete study session. Please try again.');
        });
}

// View progress for a specific subject
function viewSubjectProgress(subjectId, subjectName) {
    if (!currentUserId) return;
    
    // Show progress modal or section
    const progressSection = document.getElementById('subject-progress-section');
    progressSection.style.display = 'block';
    document.getElementById('progress-subject-name').textContent = subjectName;
    
    // Get study sessions for this subject
    db.collection('users').doc(currentUserId).collection('studySessions')
        .where('subjectId', '==', subjectId)
        .orderBy('date')
        .limit(30) // Limit to recent sessions for performance
        .get()
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
                document.getElementById('subject-progress-chart-container').innerHTML = 
                    '<p>No study data available for this subject yet.</p>';
                return;
            }
            
            // Prepare data for chart
            const dates = [];
            const durationData = [];
            const focusData = [];
            
            querySnapshot.forEach((doc) => {
                const session = doc.data();
                dates.push(formatDate(session.date, true));
                durationData.push(session.duration);
                focusData.push(session.focusScore);
            });
            
            // Create or update chart
            updateSubjectProgressChart(dates, durationData, focusData, subjectName);
        })
        .catch((error) => {
            console.error('Error loading subject progress:', error);
            document.getElementById('subject-progress-chart-container').innerHTML = 
                '<p>Error loading progress data. Please try again later.</p>';
        });
}

// Generate weekly summary
function generateWeeklySummary() {
    if (!currentUserId) return;
    
    const summaryContainer = document.getElementById('weekly-summary');
    summaryContainer.innerHTML = '<p>Generating weekly summary...</p>';
    
    // Get start of current week (Sunday)
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    // Get all study sessions for this week
    db.collection('users').doc(currentUserId).collection('studySessions')
        .where('date', '>=', startOfWeek)
        .get()
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
                summaryContainer.innerHTML = '<p>No study sessions recorded this week.</p>';
                return;
            }
            
            // Group sessions by subject
            const subjectSummary = {};
            let totalMinutes = 0;
            let totalSessions = 0;
            
            querySnapshot.forEach((doc) => {
                const session = doc.data();
                const subjectId = session.subjectId;
                
                if (!subjectSummary[subjectId]) {
                    subjectSummary[subjectId] = {
                        name: session.subjectName,
                        totalMinutes: 0,
                        sessions: 0,
                        avgFocus: 0
                    };
                }
                
                subjectSummary[subjectId].totalMinutes += session.duration;
                subjectSummary[subjectId].sessions += 1;
                subjectSummary[subjectId].avgFocus += session.focusScore;
                
                totalMinutes += session.duration;
                totalSessions += 1;
            });
            
            // Calculate averages
            Object.keys(subjectSummary).forEach(subjectId => {
                const subject = subjectSummary[subjectId];
                subject.avgFocus = Math.round(subject.avgFocus / subject.sessions);
            });
            
            // Get weekly goals for comparison
            db.collection('users').doc(currentUserId).collection('studySubjects')
                .get()
                .then((subjectsSnapshot) => {
                    subjectsSnapshot.forEach((doc) => {
                        const subject = doc.data();
                        const subjectId = doc.id;
                        
                        if (subjectSummary[subjectId]) {
                            subjectSummary[subjectId].weeklyGoal = subject.weeklyGoal;
                            subjectSummary[subjectId].progress = Math.min(
                                Math.round((subjectSummary[subjectId].totalMinutes / subject.weeklyGoal) * 100),
                                100
                            );
                        }
                    });
                    
                    // Generate summary HTML
                    let summaryHTML = `
                        <div class="summary-header">
                            <h3>This Week's Study Summary</h3>
                            <div>Total Study Time: ${totalMinutes} minutes</div>
                            <div>Total Sessions: ${totalSessions}</div>
                        </div>
                        <div class="summary-subjects">
                    `;
                    
                    Object.keys(subjectSummary).forEach(subjectId => {
                        const subject = subjectSummary[subjectId];
                        summaryHTML += `
                            <div class="summary-subject">
                                <h4>${subject.name}</h4>
                                <div>Time: ${subject.totalMinutes} minutes</div>
                                <div>Sessions: ${subject.sessions}</div>
                                <div>Avg Focus: ${subject.avgFocus}/10</div>
                                <div class="progress-container">
                                    <div class="progress-bar">
                                        <div class="progress-fill" style="width: ${subject.progress || 0}%"></div>
                                    </div>
                                    <div>${subject.progress || 0}% of weekly goal</div>
                                </div>
                            </div>
                        `;
                    });
                    
                    summaryHTML += '</div>';
                    
                    // Update summary container
                    summaryContainer.innerHTML = summaryHTML;
                    
                    // Create or update summary chart
                    createWeeklySummaryChart(subjectSummary);
                })
                .catch((error) => {
                    console.error('Error loading subject goals:', error);
                });
        })
        .catch((error) => {
            console.error('Error generating weekly summary:', error);
            summaryContainer.innerHTML = '<p>Error generating weekly summary. Please try again later.</p>';
        });
}

// Create weekly summary chart
function createWeeklySummaryChart(subjectSummary) {
    const chartCanvas = document.getElementById('weekly-summary-chart');
    if (!chartCanvas) return;
    
    // If chart already exists, destroy it
    if (studySummaryChart) {
        studySummaryChart.destroy();
    }
    
    // Prepare data for chart
    const labels = [];
    const data = [];
    const backgroundColors = [
        'rgba(75, 192, 192, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(255, 99, 132, 0.6)',
        'rgba(153, 102, 255, 0.6)'
    ];
    
    let colorIndex = 0;
    Object.keys(subjectSummary).forEach(subjectId => {
        const subject = subjectSummary[subjectId];
        labels.push(subject.name);
        data.push(subject.totalMinutes);
        colorIndex = (colorIndex + 1) % backgroundColors.length;
    });
    
    // Create chart
    studySummaryChart = new Chart(chartCanvas, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Minutes Studied This Week',
                data: data,
                backgroundColor: backgroundColors.slice(0, labels.length)
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Minutes'
                    }
                }
            }
        }
    });
}

// Update subject progress chart
function updateSubjectProgressChart(dates, durationData, focusData, subjectName) {
    const chartCanvas = document.getElementById('subject-progress-chart');
    if (!chartCanvas) return;
    
    // If chart already exists, destroy it
    if (window.subjectProgressChart) {
        window.subjectProgressChart.destroy();
    }
    
    // Create chart
    window.subjectProgressChart = new Chart(chartCanvas, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [
                {
                    label: 'Duration (minutes)',
                    data: durationData,
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    yAxisID: 'y',
                    tension: 0.1
                },
                {
                    label: 'Focus Score (1-10)',
                    data: focusData,
                    borderColor: '#FF9800',
                    backgroundColor: 'rgba(255, 152, 0, 0.1)',
                    yAxisID: 'y1',
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Duration (minutes)'
                    }
                },
                y1: {
                    beginAtZero: true,
                    position: 'right',
                    min: 0,
                    max: 10,
                    title: {
                        display: true,
                        text: 'Focus Score'
                    },
                    grid: {
                        drawOnChartArea: false
                    }
                }
            }
        }
    });
}