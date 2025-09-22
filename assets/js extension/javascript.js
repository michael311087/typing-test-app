
document.addEventListener('DOMContentLoaded', function() {
	const startBtn = document.getElementById('startTestBtn');
	const stopBtn = document.getElementById('stopTestBtn');
	const retryBtn = document.getElementById('retryBtn');
	const typingInput = document.getElementById('typingInput');
	const testText = document.getElementById('testText');
	const feedback = document.getElementById('feedback');
	const difficultySelect = document.getElementById('difficulty');

		// Sample text for typing test

			// Passages by difficulty
				const passages = {
					easy: [
						"The quick brown fox jumps over the lazy dog.",
						"Typing is fun and easy when you practise regularly.",
						"Start with simple words and build up speed.",
						"Every expert was once a beginner at typing.",
						"Good posture helps improve typing accuracy."
					],
					medium: [
						"Typing fast and accurately is a valuable skill in today's digital world.",
						"Improve your typing speed with regular practise and proper technique.",
						"Medium level passages require more focus and concentration than easy ones.",
						"Professional typists often reach speeds of sixty words per minute or more.",
						"The key to success is consistent practise and attention to detail."
					],
					hard: [
						"Accuracy and speed are both important in typing tests, but accuracy should come first.",
						"Hard passages may include punctuation, numbers, and longer sentences that challenge your skills.",
						"Consistent practise leads to better results in typing tests, improving both speed and precision.",
						"Advanced typists can maintain high accuracy while typing at speeds exceeding 80 WPM.",
						"Touch typing involves muscle memory, proper finger placement, and rhythmic keystrokes."
					]
				};

			let currentText = "";
			let timerInterval = null;
			let startTime = null;
			let endTime = null;
			let timerStartTime = null; // For the real-time timer display
			let ended = false;
			let bestScore = localStorage.getItem('bestWPM') ? parseInt(localStorage.getItem('bestWPM')) : null;
			
			// Session tracking for advanced features
			let sessionStats = {
				testsCompleted: 0,
				totalWords: 0,
				totalTime: 0,
				totalAccuracy: 0,
				sessionBest: 0
			};
			
			// Performance history tracking
			let performanceHistory = JSON.parse(localStorage.getItem('performanceHistory')) || [];
			
			// Load session stats if they exist
			const savedSession = localStorage.getItem('currentSession');
			if (savedSession) {
				sessionStats = JSON.parse(savedSession);
			}
			
			function savePerformanceRecord(wpm, accuracy, difficulty, time) {
				const record = {
					date: new Date().toISOString(),
					wpm: wpm,
					accuracy: accuracy,
					difficulty: difficulty,
					time: time,
					timestamp: Date.now()
				};
				
				performanceHistory.push(record);
				
				// Keep only last 50 records to prevent localStorage bloat
				if (performanceHistory.length > 50) {
					performanceHistory = performanceHistory.slice(-50);
				}
				
				localStorage.setItem('performanceHistory', JSON.stringify(performanceHistory));
			}
			
			function getPerformanceStats() {
				if (performanceHistory.length === 0) return null;
				
				const recent = performanceHistory.slice(-10); // Last 10 tests
				const avgWPM = recent.reduce((sum, record) => sum + record.wpm, 0) / recent.length;
				const avgAccuracy = recent.reduce((sum, record) => sum + record.accuracy, 0) / recent.length;
				const improvement = performanceHistory.length > 1 
					? recent[recent.length - 1].wpm - performanceHistory[0].wpm 
					: 0;
				
				return {
					totalTests: performanceHistory.length,
					averageWPM: Math.round(avgWPM),
					averageAccuracy: Math.round(avgAccuracy),
					improvement: Math.round(improvement),
					lastTest: recent[recent.length - 1]
				};
			}

			// Function to get random text based on difficulty level
			function getRandomText(difficulty) {
				const textArray = passages[difficulty] || passages.easy;
				const randomIndex = Math.floor(Math.random() * textArray.length);
				return textArray[randomIndex];
			}

			function showBestScore() {
				const bestScoreCard = document.getElementById('bestScore');
				const bestScoreValue = document.getElementById('bestScoreValue');
				if (bestScore) {
					bestScoreValue.textContent = `${bestScore} WPM`;
					bestScoreCard.style.display = 'block';
				} else {
					bestScoreCard.style.display = 'none';
				}
			}
			
			function updateSessionStats() {
				const sessionCard = document.getElementById('sessionStats');
				const sessionContent = document.getElementById('sessionStatsContent');
				const stats = getPerformanceStats();
				
				if (sessionStats.testsCompleted > 0) {
					const avgWPM = Math.round(sessionStats.totalWords / (sessionStats.totalTime / 60));
					const avgAccuracy = Math.round(sessionStats.totalAccuracy / sessionStats.testsCompleted);
					
					let html = `
						<div class="row text-center">
							<div class="col-6 mb-2">
								<span class="text-muted small">Tests:</span><br>
								<span class="fw-bold">${sessionStats.testsCompleted}</span>
							</div>
							<div class="col-6 mb-2">
								<span class="text-muted small">Avg WPM:</span><br>
								<span class="fw-bold text-primary">${avgWPM}</span>
							</div>
							<div class="col-6 mb-2">
								<span class="text-muted small">Accuracy:</span><br>
								<span class="fw-bold text-success">${avgAccuracy}%</span>
							</div>
							<div class="col-6 mb-2">
								<span class="text-muted small">Best:</span><br>
								<span class="fw-bold text-warning">${sessionStats.sessionBest}</span>
							</div>
						</div>
					`;
					
					// Add historical stats if available
					if (stats) {
						html += `
							<hr class="my-2">
							<div class="text-center">
								<small class="text-muted">Historical (${stats.totalTests} tests)</small><br>
								<small>Avg: ${stats.averageWPM} WPM | Acc: ${stats.averageAccuracy}%</small>
								${stats.improvement > 0 
									? `<br><small class="text-success">↗ +${stats.improvement} WPM improvement</small>`
									: stats.improvement < 0 
										? `<br><small class="text-danger">↘ ${stats.improvement} WPM</small>`
										: '<br><small class="text-muted">Keep practicing!</small>'
								}
							</div>
						`;
					}
					
					sessionContent.innerHTML = html;
					sessionCard.style.display = 'block';
				} else {
					// Show historical stats even if no current session
					if (stats) {
						sessionContent.innerHTML = `
							<div class="text-center">
								<div class="mb-2">
									<span class="text-muted small">Total Tests:</span><br>
									<span class="fw-bold">${stats.totalTests}</span>
								</div>
								<div class="mb-2">
									<span class="text-muted small">Average WPM:</span><br>
									<span class="fw-bold text-primary">${stats.averageWPM}</span>
								</div>
								<div class="mb-2">
									<span class="text-muted small">Average Accuracy:</span><br>
									<span class="fw-bold text-success">${stats.averageAccuracy}%</span>
								</div>
								${stats.improvement > 0 
									? `<small class="text-success">Total improvement: +${stats.improvement} WPM 📈</small>`
									: '<small class="text-muted">Keep practicing to see improvement!</small>'
								}
							</div>
						`;
						sessionCard.style.display = 'block';
					} else {
						sessionCard.style.display = 'none';
					}
				}
			}
			
			// Named functions for time recording functionality
			function recordStartTime() {
				startTime = new Date();
				timerStartTime = Date.now(); // For real-time timer
				endTime = null;
			}
			
			function recordEndTime() {
				endTime = new Date();
			}
			
			function calculateTestTime() {
				if (startTime && endTime) {
					const timeInSeconds = (endTime - startTime) / 1000;
					return Math.round(timeInSeconds * 100) / 100; // Round to 2 decimal places
				}
				return 0;
			}
			
			function disableStartButton() {
				startBtn.disabled = true;
			}
			
			function enableStartButton() {
				startBtn.disabled = false;
			}
			
			function disableStopButton() {
				stopBtn.disabled = true;
			}
			
			function enableStopButton() {
				stopBtn.disabled = false;
			}
			
			function prepareNextTest() {
				// Clear the input field
				typingInput.value = "";
				
				// Generate new text for the same difficulty level
				const difficulty = difficultySelect.value;
				currentText = getRandomText(difficulty);
				testText.textContent = currentText;
				
				// Update current level display
				document.getElementById('currentLevel').textContent = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
				
				// Clear feedback and hide results
				feedback.innerHTML = "";
				document.getElementById('results').style.display = 'none';
				
				// Hide spelling hint initially
				const spellingHint = document.getElementById('spellingHint');
				spellingHint.style.display = 'none';
				
				// Reset timer display
				document.getElementById('timer').textContent = "0s";
				document.getElementById('wpm').textContent = "--";
				document.getElementById('accuracy').textContent = "--";
				
				// Enable input field and ensure proper button states
				typingInput.disabled = true; // Will be enabled when start is clicked
				enableStartButton();
				disableStopButton();
				retryBtn.style.display = 'none';
				
				// Reset state variables
				ended = false;
				startTime = null;
				endTime = null;
				timerStartTime = null;
				if (timerInterval) clearInterval(timerInterval);
			}

						function startTest() {
								// Record start time and update button states
								recordStartTime();
								disableStartButton();
								enableStopButton();
								
								// Get selected difficulty and random text
								const difficulty = difficultySelect.value;
								currentText = getRandomText(difficulty);
								testText.textContent = currentText;
								typingInput.value = "";
								typingInput.disabled = false;
								typingInput.focus();
								
								// Update current level display
								document.getElementById('currentLevel').textContent = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
								
								// Reset displays
								document.getElementById('timer').textContent = "0s";
								document.getElementById('wpm').textContent = "--";
								document.getElementById('accuracy').textContent = "--";
								document.getElementById('results').style.display = 'none';
								retryBtn.style.display = 'none';
								feedback.innerHTML = "";
								
								showBestScore();
								updateSessionStats();
								
								// Show spelling hint only if passage contains 'practice' or 'practise'
								const spellingHint = document.getElementById('spellingHint');
								if (/\bpractice\b|\bpractise\b/i.test(currentText)) {
									spellingHint.style.display = 'block';
								} else {
									spellingHint.style.display = 'none';
								}
								startTime = null;
								ended = false;
								if (timerInterval) clearInterval(timerInterval);
						}

		startBtn.addEventListener('click', function() {
			startTest();
		});
		
		// Add stop button functionality
		stopBtn.addEventListener('click', function() {
			if (!ended && startTime) {
				endTest();
			}
		});

			typingInput.addEventListener('input', function() {
				if (ended) return;
				
				// Start timing on first keystroke if not already started
				if (!startTime) {
					recordStartTime();
					timerInterval = setInterval(updateTimer, 1000);
				}
				
				updateFeedback();
				
				// End test when user has typed the full text
				if (typingInput.value.length >= currentText.length) {
					// Give a small delay to ensure the last character is processed
					setTimeout(() => {
						if (!ended) {
							endTest();
						}
					}, 100);
				}
			});

			// Prevent cheating by blocking paste events
			typingInput.addEventListener('paste', function(event) {
				event.preventDefault();
				// Show a brief message to inform user
				const originalPlaceholder = typingInput.placeholder;
				typingInput.placeholder = "❌ Pasting is not allowed - Type the text manually!";
				setTimeout(() => {
					typingInput.placeholder = originalPlaceholder;
				}, 2000);
			});

			// Block clipboard shortcuts (Ctrl+V, Ctrl+Shift+V, etc.)
			typingInput.addEventListener('keydown', function(event) {
				// Block Ctrl+V (paste)
				if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
					event.preventDefault();
					const originalPlaceholder = typingInput.placeholder;
					typingInput.placeholder = "❌ Pasting shortcuts are blocked!";
					setTimeout(() => {
						typingInput.placeholder = originalPlaceholder;
					}, 2000);
				}
				
				// Block Ctrl+Shift+V (paste and match style)
				if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'V') {
					event.preventDefault();
				}
			});

			// Block right-click context menu on input field
			typingInput.addEventListener('contextmenu', function(event) {
				event.preventDefault();
			});

			// Block drag and drop
			typingInput.addEventListener('drop', function(event) {
				event.preventDefault();
			});

			typingInput.addEventListener('dragover', function(event) {
				event.preventDefault();
			});

			function updateFeedback() {
				const input = typingInput.value;
				let html = "";
				for (let i = 0; i < currentText.length; i++) {
					if (i < input.length) {
						if (input[i] === currentText[i]) {
							html += `<span class='correct'>${currentText[i]}</span>`;
						} else {
							html += `<span class='wrong'>${currentText[i]}</span>`;
						}
					} else {
						html += `<span class='pending'>${currentText[i]}</span>`;
					}
				}
				feedback.innerHTML = html;
			}

		function updateTimer() {
			if (!timerStartTime) return;
			const elapsed = Math.floor((Date.now() - timerStartTime) / 1000);
			document.getElementById('timer').textContent = `${elapsed}s`;
		}


			function endTest() {
				// Record end time and update button states
				recordEndTime();
				enableStartButton();
				disableStopButton();
				
				ended = true;
				typingInput.disabled = true;
				if (timerInterval) clearInterval(timerInterval);
				
				const testTime = calculateTestTime();
				const elapsed = (endTime - startTime) / 1000;
				const wpm = calculateWPM(currentText, typingInput.value, elapsed);
				const accuracy = calculateAccuracy(currentText, typingInput.value);
				const difficulty = difficultySelect.value;
				
				// Save performance record
				savePerformanceRecord(wpm, accuracy, difficulty, elapsed);
				
				// Update session statistics
				sessionStats.testsCompleted++;
				sessionStats.totalWords += currentText.trim().split(/\s+/).length;
				sessionStats.totalTime += elapsed;
				sessionStats.totalAccuracy += accuracy;
				if (wpm > sessionStats.sessionBest) {
					sessionStats.sessionBest = wpm;
				}
				
				// Save session stats
				localStorage.setItem('currentSession', JSON.stringify(sessionStats));
				
				document.getElementById('wpm').textContent = `${wpm}`;
				document.getElementById('accuracy').textContent = `${accuracy}%`;
				
				// Enhanced results display with performance insights
				let resultMessage = `
					<div class="text-center">
						<h5 class="text-success mb-3">🎉 Test Complete!</h5>
						<div class="alert alert-secondary mb-3 py-2">
							<strong>Difficulty Level: ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</strong>
						</div>
						<div class="row">
							<div class="col-4">
								<div class="text-muted small">WPM</div>
								<div class="h4 text-primary">${wpm}</div>
							</div>
							<div class="col-4">
								<div class="text-muted small">Accuracy</div>
								<div class="h4 text-success">${accuracy}%</div>
							</div>
							<div class="col-4">
								<div class="text-muted small">Time</div>
								<div class="h4 text-info">${testTime}s</div>
							</div>
						</div>
				`;
				
				// Get performance stats for comparison
				const stats = getPerformanceStats();
				if (stats && stats.totalTests > 1) {
					const recentAvg = stats.averageWPM;
					if (wpm > recentAvg + 5) {
						resultMessage += `<div class="alert alert-success mt-3 mb-0 py-2">🚀 Great improvement! (+${wpm - recentAvg} WPM vs recent average)</div>`;
					} else if (wpm > recentAvg) {
						resultMessage += `<div class="alert alert-info mt-3 mb-0 py-2">👍 Above average performance!</div>`;
					}
				}
				
				// Save and display best score with celebration
				if (!bestScore || wpm > bestScore) {
					bestScore = wpm;
					localStorage.setItem('bestWPM', bestScore);
					resultMessage += `<div class="alert alert-warning mt-3 mb-0 py-2">🎉 New Personal Best!</div>`;
					showBestScore();
				} else if (wpm === sessionStats.sessionBest && sessionStats.testsCompleted > 1) {
					resultMessage += `<div class="alert alert-primary mt-3 mb-0 py-2">✨ Session Best!</div>`;
				}
				
				resultMessage += '</div>';
				
				document.getElementById('results').innerHTML = resultMessage;
				document.getElementById('results').style.display = 'block';
				
				// Show retry button
				retryBtn.style.display = 'inline-block';
				
				updateSessionStats();
				
				// Automatically prepare the next test after a short delay
				setTimeout(() => {
					prepareNextTest();
				}, 2000); // 2 second delay to let user see results
			}

		function calculateCorrectWords(originalText, userInput) {
			const originalWords = originalText.trim().split(/\s+/);
			const userWords = userInput.trim().split(/\s+/);
			let correctWords = 0;
			
			// Compare each word to count correctly typed words
			for (let i = 0; i < Math.min(originalWords.length, userWords.length); i++) {
				if (originalWords[i] === userWords[i]) {
					correctWords++;
				}
			}
			
			return correctWords;
		}

		function calculateWPM(originalText, userInput, seconds) {
			const correctWords = calculateCorrectWords(originalText, userInput);
			return seconds > 0 ? Math.round((correctWords / seconds) * 60) : 0;
		}

		function calculateAccuracy(text, input) {
			let correct = 0;
			for (let i = 0; i < input.length; i++) {
				if (input[i] === text[i]) correct++;
			}
			return text.length > 0 ? Math.round((correct / text.length) * 100) : 0;
		}


			retryBtn.addEventListener('click', function() {
				startTest();
				typingInput.disabled = false;
				typingInput.focus();
			});

			// Difficulty change event listener - displays sample text immediately
			difficultySelect.addEventListener('change', function() {
				const selectedDifficulty = difficultySelect.value;
				
				if (!ended && startTime) {
					if (confirm('Changing difficulty will restart the test. Continue?')) {
						startTest();
					} else {
						// Revert to previous selection
						difficultySelect.value = document.getElementById('currentLevel').textContent.toLowerCase();
					}
				} else {
					// Display sample text for the selected difficulty without starting the test
					const sampleText = getRandomText(selectedDifficulty);
					testText.textContent = sampleText;
					
					// Update the current level display
					document.getElementById('currentLevel').textContent = selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1);
				}
			});
			
			// Add session management functions
			function clearSession() {
				sessionStats = {
					testsCompleted: 0,
					totalWords: 0,
					totalTime: 0,
					totalAccuracy: 0,
					sessionBest: 0
				};
				localStorage.removeItem('currentSession');
				updateSessionStats();
			}
			
			function clearAllHistory() {
				if (confirm('Are you sure you want to clear all performance history? This cannot be undone.')) {
					localStorage.removeItem('performanceHistory');
					localStorage.removeItem('bestWPM');
					localStorage.removeItem('currentSession');
					performanceHistory = [];
					bestScore = null;
					sessionStats = {
						testsCompleted: 0,
						totalWords: 0,
						totalTime: 0,
						totalAccuracy: 0,
						sessionBest: 0
					};
					showBestScore();
					updateSessionStats();
					alert('All performance history has been cleared.');
				}
			}
			
			// Initialize display on page load
			showBestScore();
			updateSessionStats();
			
			// Add keyboard shortcuts for power users
			document.addEventListener('keydown', function(e) {
				// Enter key to start test when input is disabled
				if (e.key === 'Enter' && typingInput.disabled && !ended) {
					startTest();
					return;
				}
				
				// Ctrl/Cmd + R to retry (if test completed)
				if ((e.ctrlKey || e.metaKey) && e.key === 'r' && ended) {
					e.preventDefault();
					startTest();
					typingInput.disabled = false;
					typingInput.focus();
				}
				
				// Escape to restart test
				if (e.key === 'Escape' && !ended && startTime) {
					if (confirm('Are you sure you want to restart the test?')) {
						startTest();
					}
				}
			});
			
			// Display initial sample text on page load
			const initialDifficulty = difficultySelect.value;
			const initialText = getRandomText(initialDifficulty);
			testText.textContent = initialText;
			document.getElementById('currentLevel').textContent = initialDifficulty.charAt(0).toUpperCase() + initialDifficulty.slice(1);
			
			// Set initial button and input states
			startBtn.disabled = false;
			stopBtn.disabled = true;
			retryBtn.style.display = 'none';
			typingInput.disabled = true;
			typingInput.value = "";
			
			// Initialize other state variables
			ended = false;
			startTime = null;
			timerStartTime = null;
			if (timerInterval) clearInterval(timerInterval);
});
