 // App State
        const appState = {
            user: {
                name: "Alex Johnson",
                dailyStepsGoal: 10000,
                weeklyWorkoutsGoal: 5,
                weight: 75, // kg
                height: 180 // cm
            },
            stats: {
                steps: 8245,
                calories: 1280,
                distance: 6.2,
                heartRate: 72,
                sleep: 7.2,
                move: 75,
                exercise: 60,
                stand: 85
            },
            workouts: {
                today: [
                    { type: 'running', name: 'Morning Run', distance: 5.2, duration: 32, calories: 320 },
                    { type: 'strength', name: 'Strength Training', duration: 45, calories: 280 }
                ],
                weekly: [
                    { day: 'Mon', workouts: 2, calories: 850 },
                    { day: 'Tue', workouts: 1, calories: 420 },
                    { day: 'Wed', workouts: 3, calories: 1100 },
                    { day: 'Thu', workouts: 2, calories: 780 },
                    { day: 'Fri', workouts: 1, calories: 350 },
                    { day: 'Sat', workouts: 2, calories: 620 },
                    { day: 'Sun', workouts: 0, calories: 0 }
                ]
            },
            challenges: {
                steps: { current: 4, total: 7, progress: 57 },
                calories: { current: 4000, total: 5000, progress: 80 },
                yoga: { current: 12, total: 30, progress: 40 }
            },
            settings: {
                notifications: false,
                darkMode: true,
                autoPause: false
            }
        };

        // DOM Elements
        const screens = document.querySelectorAll('.screen');
        const navItems = document.querySelectorAll('.nav-item');
        const notification = document.getElementById('notification');
        const workoutModal = document.getElementById('workout-modal');

        // Initialize the app
        document.addEventListener('DOMContentLoaded', function() {
            initializeApp();
            setupEventListeners();
            startLiveUpdates();
        });

        function initializeApp() {
            // Update all stats displays
            updateStatsDisplay();
            updateActivityRings();
            updateChallenges();
            generateActivityChart();
            
            // Set initial progress bars
            setTimeout(() => {
                document.getElementById('weekly-goal-bar').style.width = '75%';
                document.getElementById('steps-challenge-bar').style.width = '57%';
                document.getElementById('calories-challenge-bar').style.width = '80%';
                document.getElementById('yoga-challenge-bar').style.width = '40%';
                
                // Set activity rings rotation
                document.getElementById('move-ring').style.transform = 'rotate(270deg)';
                document.getElementById('exercise-ring').style.transform = 'rotate(216deg)';
                document.getElementById('stand-ring').style.transform = 'rotate(306deg)';
            }, 500);
            
            // Add animations
            document.querySelectorAll('.fade-in').forEach((card, index) => {
                card.style.animationDelay = `${index * 0.1}s`;
            });
        }

        function setupEventListeners() {
            // Bottom navigation
            navItems.forEach(item => {
                item.addEventListener('click', function() {
                    const screenId = this.getAttribute('data-screen');
                    switchScreen(screenId);
                    
                    // Update active nav item
                    navItems.forEach(nav => nav.classList.remove('active'));
                    this.classList.add('active');
                });
            });

            // Header actions
            document.getElementById('notifications-icon').addEventListener('click', showNotifications);
            document.getElementById('profile-icon').addEventListener('click', showProfile);
            document.getElementById('app-title').addEventListener('click', refreshData);

            // View all buttons
            document.getElementById('view-workouts').addEventListener('click', () => switchScreen('workout-screen'));
            document.getElementById('view-challenges').addEventListener('click', showAllChallenges);
            document.getElementById('export-stats').addEventListener('click', exportStats);
            document.getElementById('add-workout').addEventListener('click', addNewWorkout);
            document.getElementById('save-settings').addEventListener('click', saveSettings);

            // Workout cards
            document.querySelectorAll('.workout-card').forEach(card => {
                card.addEventListener('click', function() {
                    const workoutType = this.getAttribute('data-workout');
                    startWorkout(workoutType);
                });
            });

            // Workout items
            document.querySelectorAll('.workout-item').forEach(item => {
                item.addEventListener('click', function() {
                    const workoutType = this.getAttribute('data-workout-type');
                    startWorkout(workoutType);
                });
            });

            // Stat cards
            document.querySelectorAll('.stat-card').forEach(card => {
                card.addEventListener('click', function() {
                    const statType = this.id.replace('-card', '');
                    showStatDetails(statType);
                });
            });

            // Challenge cards
            document.querySelectorAll('.challenge-card').forEach(card => {
                card.addEventListener('click', function() {
                    const challengeType = this.getAttribute('data-challenge');
                    showChallengeDetails(challengeType);
                });
            });

            // Settings toggles
            document.querySelectorAll('.toggle-switch').forEach(toggle => {
                toggle.addEventListener('click', function() {
                    this.classList.toggle('active');
                });
            });

            // Settings items
            document.getElementById('daily-steps-goal').addEventListener('click', () => editGoal('steps'));
            document.getElementById('weekly-workouts-goal').addEventListener('click', () => editGoal('workouts'));
            document.getElementById('edit-profile').addEventListener('click', editProfile);
            document.getElementById('privacy-settings').addEventListener('click', showPrivacySettings);
            document.getElementById('help-support').addEventListener('click', showHelpSupport);

            // Modal close
            document.getElementById('close-workout-modal').addEventListener('click', () => {
                workoutModal.classList.remove('active');
            });
        }

        function switchScreen(screenId) {
            screens.forEach(screen => {
                screen.classList.remove('active');
            });
            document.getElementById(screenId).classList.add('active');
        }

        function updateStatsDisplay() {
            // Update header stats
            document.getElementById('steps-value').textContent = formatNumber(appState.stats.steps);
            document.getElementById('calories-value').textContent = formatNumber(appState.stats.calories);
            document.getElementById('distance-value').textContent = appState.stats.distance;
            
            // Update stat cards
            document.getElementById('heart-rate-value').textContent = appState.stats.heartRate;
            document.getElementById('calories-card-value').textContent = formatNumber(appState.stats.calories);
            document.getElementById('steps-card-value').textContent = formatNumber(appState.stats.steps);
            document.getElementById('sleep-value').textContent = appState.stats.sleep;
            
            // Update activity rings
            document.getElementById('move-value').textContent = appState.stats.move + '%';
            document.getElementById('exercise-value').textContent = appState.stats.exercise + '%';
            document.getElementById('stand-value').textContent = appState.stats.stand + '%';
        }

        function updateActivityRings() {
            // These are set in CSS, but we can adjust them here if needed
        }

        function updateChallenges() {
            // Steps challenge
            document.getElementById('steps-challenge-text').textContent = 
                `${appState.challenges.steps.current}/${appState.challenges.steps.total} days completed`;
            
            // Calories challenge
            document.getElementById('calories-challenge-text').textContent = 
                `${formatNumber(appState.challenges.calories.current)}/${formatNumber(appState.challenges.calories.total)} calories`;
            
            // Yoga challenge
            document.getElementById('yoga-challenge-text').textContent = 
                `${appState.challenges.yoga.current}/${appState.challenges.yoga.total} sessions`;
        }

        function generateActivityChart() {
            const chart = document.getElementById('activity-chart');
            chart.innerHTML = '';
            
            appState.workouts.weekly.forEach(day => {
                const barHeight = (day.calories / 1200) * 100;
                const bar = document.createElement('div');
                bar.className = 'chart-bar';
                bar.style.height = `${barHeight}%`;
                bar.innerHTML = `<div class="chart-bar-label">${day.day}</div>`;
                chart.appendChild(bar);
            });
        }

        function startLiveUpdates() {
            // Simulate live data updates
            setInterval(() => {
                // Randomly increase steps
                const stepIncrease = Math.floor(Math.random() * 10) + 1;
                appState.stats.steps += stepIncrease;
                
                // Randomly adjust heart rate
                const hrChange = Math.floor(Math.random() * 5) - 2;
                appState.stats.heartRate = Math.max(60, Math.min(100, appState.stats.heartRate + hrChange));
                
                // Update displays
                updateStatsDisplay();
            }, 5000);
        }

        function showNotification(message, duration = 3000) {
            document.getElementById('notification-message').textContent = message;
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, duration);
        }

        function startWorkout(type) {
            const workoutTypes = {
                running: {
                    title: 'Running Workout',
                    content: `
                        <div class="workout-details">
                            <p>Get ready for your running session!</p>
                            <div class="workout-options">
                                <h3>Select Duration:</h3>
                                <button class="workout-option" data-duration="20">20 min</button>
                                <button class="workout-option" data-duration="30">30 min</button>
                                <button class="workout-option" data-duration="45">45 min</button>
                                <button class="workout-option" data-duration="60">60 min</button>
                            </div>
                            <button id="start-workout-btn" class="start-button">Start Workout</button>
                        </div>
                    `
                },
                strength: {
                    title: 'Strength Training',
                    content: `
                        <div class="workout-details">
                            <p>Time to build some muscle!</p>
                            <div class="workout-options">
                                <h3>Select Focus:</h3>
                                <button class="workout-option" data-focus="upper">Upper Body</button>
                                <button class="workout-option" data-focus="lower">Lower Body</button>
                                <button class="workout-option" data-focus="full">Full Body</button>
                                <button class="workout-option" data-focus="core">Core</button>
                            </div>
                            <button id="start-workout-btn" class="start-button">Start Workout</button>
                        </div>
                    `
                },
                cycling: {
                    title: 'Cycling Session',
                    content: `
                        <div class="workout-details">
                            <p>Let's hit the road or the stationary bike!</p>
                            <div class="workout-options">
                                <h3>Select Intensity:</h3>
                                <button class="workout-option" data-intensity="low">Low</button>
                                <button class="workout-option" data-intensity="medium">Medium</button>
                                <button class="workout-option" data-intensity="high">High</button>
                                <button class="workout-option" data-intensity="interval">Interval</button>
                            </div>
                            <button id="start-workout-btn" class="start-button">Start Workout</button>
                        </div>
                    `
                }
            };

            const workout = workoutTypes[type] || workoutTypes.running;
            
            document.getElementById('workout-modal-title').textContent = workout.title;
            document.getElementById('workout-modal-content').innerHTML = workout.content;
            
            workoutModal.classList.add('active');
            
            // Add event listeners to workout options
            document.querySelectorAll('.workout-option').forEach(option => {
                option.addEventListener('click', function() {
                    document.querySelectorAll('.workout-option').forEach(opt => {
                        opt.classList.remove('active');
                    });
                    this.classList.add('active');
                });
            });
            
            // Start workout button
            document.getElementById('start-workout-btn').addEventListener('click', function() {
                workoutModal.classList.remove('active');
                showNotification(`${workout.title} started! Good luck!`);
                
                // Simulate workout completion after a delay
                setTimeout(() => {
                    completeWorkout(type);
                }, 3000);
            });
        }

        function completeWorkout(type) {
            // Update stats based on workout type
            const calorieBurn = Math.floor(Math.random() * 200) + 100;
            appState.stats.calories += calorieBurn;
            
            const stepsIncrease = Math.floor(Math.random() * 1000) + 500;
            appState.stats.steps += stepsIncrease;
            
            updateStatsDisplay();
            showNotification(`Workout completed! You burned ${calorieBurn} calories.`);
        }

        function showStatDetails(statType) {
            const statMessages = {
                'heart-rate': 'Your heart rate is within normal range. Good job!',
                'calories': `You've burned ${appState.stats.calories} calories today.`,
                'steps': `You've taken ${formatNumber(appState.stats.steps)} steps today.`,
                'sleep': `You slept ${appState.stats.sleep} hours last night.`
            };
            
            showNotification(statMessages[statType] || 'Stat details not available.');
        }

        function showChallengeDetails(challengeType) {
            const challenge = appState.challenges[challengeType];
            let message = '';
            
            switch(challengeType) {
                case 'steps':
                    message = `Steps Challenge: ${challenge.current}/${challenge.total} days completed (${challenge.progress}%)`;
                    break;
                case 'calories':
                    message = `Calories Challenge: ${formatNumber(challenge.current)}/${formatNumber(challenge.total)} calories burned (${challenge.progress}%)`;
                    break;
                case 'yoga':
                    message = `Yoga Challenge: ${challenge.current}/${challenge.total} sessions completed (${challenge.progress}%)`;
                    break;
            }
            
            showNotification(message);
        }

        function showNotifications() {
            showNotification('You have 3 new notifications');
        }

        function showProfile() {
            showNotification(`Welcome back, ${appState.user.name}!`);
        }

        function refreshData() {
            showNotification('Refreshing your fitness data...');
            // In a real app, this would fetch new data from a server
            setTimeout(() => {
                showNotification('Data refreshed successfully!');
            }, 1500);
        }

        function showAllChallenges() {
            showNotification('Showing all available challenges');
            // In a full app, this would navigate to a challenges screen
        }

        function exportStats() {
            showNotification('Exporting your statistics...');
            // In a real app, this would generate a PDF or CSV file
        }

        function addNewWorkout() {
            showNotification('Add new workout feature coming soon!');
        }

        function saveSettings() {
            showNotification('Settings saved successfully!');
        }

        function editGoal(goalType) {
            const goalMessages = {
                'steps': `Current daily steps goal: ${formatNumber(appState.user.dailyStepsGoal)}`,
                'workouts': `Current weekly workouts goal: ${appState.user.weeklyWorkoutsGoal}`
            };
            
            showNotification(goalMessages[goalType]);
        }

        function editProfile() {
            showNotification('Edit profile feature coming soon!');
        }

        function showPrivacySettings() {
            showNotification('Privacy settings feature coming soon!');
        }

        function showHelpSupport() {
            showNotification('Help & support feature coming soon!');
        }

        function formatNumber(num) {
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }