// --- Core Logic ---
    const container = document.getElementById('questions-container');
    const timerDisplay = document.getElementById('timer');
    const form = document.getElementById('quiz-form');
    let timerInterval;

    // 1. Render Quiz
    function renderQuiz() {
        quizData.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'question-card';
            card.id = `q-card-${index}`;

            const qText = document.createElement('div');
            qText.className = 'question-text';
            qText.textContent = item.q;
            card.appendChild(qText);

            const grid = document.createElement('div');
            grid.className = 'options-grid';

            item.options.forEach((opt, optIndex) => {
                const label = document.createElement('label');
                label.id = `label-${index}-${optIndex}`;
                
                const input = document.createElement('input');
                input.type = 'radio';
                input.name = `question-${index}`;
                input.value = optIndex;
                
                label.appendChild(input);
                label.appendChild(document.createTextNode(opt));
                grid.appendChild(label);
            });

            card.appendChild(grid);
            container.appendChild(card);
        });
    }

    // 2. Timer Logic
    function startTimer(durationMinutes) {
        let time = durationMinutes * 60;
        
        timerInterval = setInterval(() => {
            const minutes = Math.floor(time / 60);
            const seconds = time % 60;

            timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

            if (time <= 300) { // Warning at 5 mins
                timerDisplay.classList.add('timer-warning');
            }

            if (time <= 0) {
                clearInterval(timerInterval);
                finishQuiz(true); // Force finish
            }
            time--;
        }, 1000);
    }

    // 3. Scoring Logic
    function finishQuiz(isTimeout = false) {
        clearInterval(timerInterval);
        const submitBtn = document.getElementById('submit-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = isTimeout ? "Time's Up! Submitting..." : "Submitted";

        let score = 0;
        const total = quizData.length;

        quizData.forEach((item, index) => {
            const selected = document.querySelector(`input[name="question-${index}"]:checked`);
            const card = document.getElementById(`q-card-${index}`);
            const correctIndex = item.ans;
            
            // Highlight Correct Answer visually
            const correctLabel = document.getElementById(`label-${index}-${correctIndex}`);
            correctLabel.classList.add('correct-answer');

            if (selected) {
                const userVal = parseInt(selected.value);
                if (userVal === correctIndex) {
                    score++;
                    // Optional: add checkmark icon
                } else {
                    // Highlight Wrong Answer
                    const wrongLabel = document.getElementById(`label-${index}-${userVal}`);
                    wrongLabel.classList.add('wrong-answer');
                }
            } else {
                // Unanswered - visually mark as missed (optional, sticking to minimal)
                card.style.borderLeft = "5px solid #fbbf24"; // Yellow border for skipped
            }
        });

        // Show Results
        const resultArea = document.getElementById('result-area');
        document.getElementById('score-display').textContent = `${score} / ${total}`;
        document.getElementById('percentage-display').textContent = `${Math.round((score/total)*100)}%`;
        resultArea.style.display = 'block';

        // Scroll to top to see score
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Event Listeners
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if(confirm("Are you sure you want to submit?")) {
            finishQuiz();
        }
    });

    // Initialize
    renderQuiz();
    startTimer(TIME_LIMIT_MINUTES);