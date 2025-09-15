
document.addEventListener('DOMContentLoaded', function() {
	const startBtn = document.getElementById('startTestBtn');
	const instructions = document.getElementById('instructions');
	const typingTest = document.getElementById('typingTest');

		// Sample text for typing test

			// Passages by difficulty
				const passages = {
					easy: [
						"The quick brown fox jumps over the lazy dog.",
						"Typing is fun and easy.",
						"Practise typing every day."
					],
					medium: [
						"Typing fast and accurately is a valuable skill.",
						"Improve your typing speed with regular practise.",
						"Medium level passages require more focus."
					],
					hard: [
						"Accuracy and speed are both important in typing tests.",
						"Hard passages may include punctuation, numbers, and longer sentences.",
						"Consistent practise leads to better results in typing tests."
					]
				};

			let currentText = "";
			let timerInterval = null;
			let startTime = null;
			let ended = false;
			let bestScore = localStorage.getItem('bestWPM') ? parseInt(localStorage.getItem('bestWPM')) : null;

			function showBestScore() {
				const bestScoreDiv = document.getElementById('bestScore');
				if (bestScore) {
					bestScoreDiv.textContent = `Best WPM: ${bestScore}`;
					bestScoreDiv.style.display = 'block';
				} else {
					bestScoreDiv.style.display = 'none';
				}
			}

						function startTest() {
								// Get selected difficulty
								const difficulty = document.getElementById('difficulty').value;
								const pool = passages[difficulty] || passages.easy;
								currentText = pool[Math.floor(Math.random() * pool.length)];
								document.getElementById('testText').textContent = currentText;
								document.getElementById('typingInput').value = "";
								document.getElementById('typingInput').disabled = false;
								document.getElementById('typingInput').focus();
								document.getElementById('timer').textContent = "Time: 0s";
								document.getElementById('wpm').textContent = "WPM: --";
								document.getElementById('accuracy').textContent = "Accuracy: --";
								document.getElementById('results').style.display = 'none';
								document.getElementById('retryBtn').style.display = 'none';
								document.getElementById('feedback').innerHTML = "";
								showBestScore();
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
			instructions.style.display = 'none';
			startBtn.style.display = 'none';
			typingTest.style.display = 'block';
			startTest();
		});

		const typingInput = document.getElementById('typingInput');

			typingInput.addEventListener('input', function() {
				if (ended) return;
				if (!startTime) {
					startTime = Date.now();
					timerInterval = setInterval(updateTimer, 1000);
				}
				updateFeedback();
				// End test if text matches
				if (typingInput.value === currentText) {
					endTest();
				}
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
				document.getElementById('feedback').innerHTML = html;
			}

		function updateTimer() {
			if (!startTime) return;
			const elapsed = Math.floor((Date.now() - startTime) / 1000);
			document.getElementById('timer').textContent = `Time: ${elapsed}s`;
		}


			function endTest() {
				ended = true;
				typingInput.disabled = true;
				if (timerInterval) clearInterval(timerInterval);
				const elapsed = (Date.now() - startTime) / 1000;
				const wpm = calculateWPM(currentText, elapsed);
				const accuracy = calculateAccuracy(currentText, typingInput.value);
				document.getElementById('wpm').textContent = `WPM: ${wpm}`;
				document.getElementById('accuracy').textContent = `Accuracy: ${accuracy}%`;
				document.getElementById('results').innerHTML = `<strong>Test Complete!</strong><br>WPM: ${wpm}<br>Accuracy: ${accuracy}%`;
				document.getElementById('results').style.display = 'block';
				document.getElementById('retryBtn').style.display = 'block';
				// Save best score
				if (!bestScore || wpm > bestScore) {
					bestScore = wpm;
					localStorage.setItem('bestWPM', bestScore);
					showBestScore();
				}
			}

		function calculateWPM(text, seconds) {
			const words = text.trim().split(/\s+/).length;
			return seconds > 0 ? Math.round((words / seconds) * 60) : 0;
		}

		function calculateAccuracy(text, input) {
			let correct = 0;
			for (let i = 0; i < input.length; i++) {
				if (input[i] === text[i]) correct++;
			}
			return text.length > 0 ? Math.round((correct / text.length) * 100) : 0;
		}


			document.getElementById('retryBtn').addEventListener('click', function() {
				startTest();
				typingInput.disabled = false;
				typingInput.focus();
			});

			// Difficulty change resets test
			document.getElementById('difficulty').addEventListener('change', function() {
				startTest();
			});
});
