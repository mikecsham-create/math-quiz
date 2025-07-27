// Global variables for quiz functionality
let currentQuiz = null;
let studentInfo = null;
let currentQuestionIndex = 0;
let userAnswers = {};
let quizStartTime = null;

// Initialize the quiz page
document.addEventListener('DOMContentLoaded', function() {
    loadQuizData();
    setupQuizEventListeners();
});

// Load quiz data from session storage
function loadQuizData() {
    try {
        const quizData = sessionStorage.getItem('currentQuiz');
        const studentData = sessionStorage.getItem('studentInfo');

        if (!quizData) {
            showError('No quiz data found. Redirecting to home page.');
            setTimeout(() => {
                window.location.href = '/';
            }, 2000);
            return;
        }

        currentQuiz = JSON.parse(quizData);
        studentInfo = studentData ? JSON.parse(studentData) : {};

        console.log('Quiz loaded:', currentQuiz);
        console.log('Student info:', studentInfo);

        initializeQuiz();
    } catch (error) {
        console.error('Error loading quiz data:', error);
        showError('Error loading quiz data. Redirecting to home page.');
        setTimeout(() => {
            window.location.href = '/';
        }, 2000);
    }
}

// Initialize the quiz interface
function initializeQuiz() {
    if (!currentQuiz || !currentQuiz.questions) {
        showError('Invalid quiz data.');
        return;
    }

    // Set quiz title and instructions
    document.getElementById('quizTitle').textContent = currentQuiz.metadata.title;
    document.getElementById('instructionsText').textContent = currentQuiz.metadata.instructions;

    // Initialize user answers array
    currentQuiz.questions.forEach((_, index) => {
        userAnswers[index] = '';
    });

    // Initialize question grid
    createQuestionGrid();

    // Show instructions first
    showInstructions();
}

// Setup event listeners for quiz functionality
function setupQuizEventListeners() {
    // Begin quiz button
    const beginQuizBtn = document.getElementById('beginQuizBtn');
    if (beginQuizBtn) {
        beginQuizBtn.addEventListener('click', startQuiz);
    }

    // Navigation buttons
    const prevBtn = document.getElementById('prevQuestion');
    const nextBtn = document.getElementById('nextQuestion');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', previousQuestion);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', nextQuestion);
    }

    // Answer input
    const answerInput = document.getElementById('answerInput');
    if (answerInput) {
        answerInput.addEventListener('input', saveCurrentAnswer);
        answerInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                nextQuestion();
            }
        });
    }

    // Submit quiz button
    const submitQuizBtn = document.getElementById('submitQuizBtn');
    if (submitQuizBtn) {
        submitQuizBtn.addEventListener('click', showSubmitConfirmation);
    }

    // Results buttons
    const reviewAnswersBtn = document.getElementById('reviewAnswersBtn');
    const newQuizBtn = document.getElementById('newQuizBtn');
    const homeBtn = document.getElementById('homeBtn');

    if (reviewAnswersBtn) {
        reviewAnswersBtn.addEventListener('click', showDetailedResults);
    }

    if (newQuizBtn) {
        newQuizBtn.addEventListener('click', () => window.location.href = '/');
    }

    if (homeBtn) {
        homeBtn.addEventListener('click', () => window.location.href = '/');
    }

    // Confirmation modal buttons
    const confirmSubmit = document.getElementById('confirmSubmit');
    const cancelSubmit = document.getElementById('cancelSubmit');

    if (confirmSubmit) {
        confirmSubmit.addEventListener('click', submitQuiz);
    }

    if (cancelSubmit) {
        cancelSubmit.addEventListener('click', hideSubmitConfirmation);
    }
}

// Create the question navigation grid
function createQuestionGrid() {
    const questionGrid = document.getElementById('questionGrid');
    if (!questionGrid || !currentQuiz.questions) return;

    const gridHTML = currentQuiz.questions.map((_, index) => {
        const questionNumber = index + 1;
        return `<div class="question-number" data-question="${index}">${questionNumber}</div>`;
    }).join('');

    questionGrid.innerHTML = gridHTML;

    // Add click event listeners to question numbers
    const questionNumbers = document.querySelectorAll('.question-number');
    questionNumbers.forEach((element, index) => {
        element.addEventListener('click', () => goToQuestion(index));
    });
}

// Show instructions section
function showInstructions() {
    document.getElementById('quizInstructions').style.display = 'block';
    document.getElementById('quizQuestions').style.display = 'none';
    document.getElementById('quizResults').style.display = 'none';
}

// Start the quiz
function startQuiz() {
    quizStartTime = new Date();
    currentQuestionIndex = 0;
    
    document.getElementById('quizInstructions').style.display = 'none';
    document.getElementById('quizQuestions').style.display = 'block';
    
    displayCurrentQuestion();
    updateProgressBar();
}

// Display the current question
function displayCurrentQuestion() {
    if (!currentQuiz.questions || currentQuestionIndex >= currentQuiz.questions.length) {
        return;
    }

    const question = currentQuiz.questions[currentQuestionIndex];
    const questionText = document.getElementById('currentQuestionText');
    const answerInput = document.getElementById('answerInput');
    const questionCounter = document.getElementById('questionCounter');

    if (questionText) {
        questionText.textContent = `${currentQuestionIndex + 1}. ${question.question}`;
    }

    if (answerInput) {
        answerInput.value = userAnswers[currentQuestionIndex] || '';
        answerInput.focus();
    }

    if (questionCounter) {
        questionCounter.textContent = `Question ${currentQuestionIndex + 1} of ${currentQuiz.questions.length}`;
    }

    // Update navigation buttons
    updateNavigationButtons();

    // Update question grid
    updateQuestionGrid();

    // Update progress
    updateProgressBar();
}

// Update navigation buttons state
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevQuestion');
    const nextBtn = document.getElementById('nextQuestion');
    const submitBtn = document.getElementById('submitQuizBtn');

    if (prevBtn) {
        prevBtn.disabled = currentQuestionIndex === 0;
    }

    if (nextBtn) {
        nextBtn.textContent = currentQuestionIndex === currentQuiz.questions.length - 1 ? 
            'Finish' : 'Next';
    }

    // Show submit button when all questions are answered or on last question
    const answeredCount = Object.values(userAnswers).filter(answer => answer.trim() !== '').length;
    if (submitBtn) {
        submitBtn.style.display = 
            (currentQuestionIndex === currentQuiz.questions.length - 1 || answeredCount === currentQuiz.questions.length) 
            ? 'inline-flex' : 'none';
    }
}

// Update question grid highlighting
function updateQuestionGrid() {
    const questionNumbers = document.querySelectorAll('.question-number');
    questionNumbers.forEach((element, index) => {
        element.classList.remove('current', 'answered');
        
        if (index === currentQuestionIndex) {
            element.classList.add('current');
        } else if (userAnswers[index] && userAnswers[index].trim() !== '') {
            element.classList.add('answered');
        }
    });
}

// Update progress bar
function updateProgressBar() {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    if (progressFill && currentQuiz.questions) {
        const progress = ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100;
        progressFill.style.width = `${progress}%`;
    }

    if (progressText) {
        progressText.textContent = `Question ${currentQuestionIndex + 1} of ${currentQuiz.questions.length}`;
    }
}

// Save the current answer
function saveCurrentAnswer() {
    const answerInput = document.getElementById('answerInput');
    if (answerInput) {
        userAnswers[currentQuestionIndex] = answerInput.value.trim();
        updateQuestionGrid();
        updateNavigationButtons();
    }
}

// Navigate to previous question
function previousQuestion() {
    saveCurrentAnswer();
    
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayCurrentQuestion();
    }
}

// Navigate to next question
function nextQuestion() {
    saveCurrentAnswer();
    
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
        currentQuestionIndex++;
        displayCurrentQuestion();
    } else {
        // On last question, show submit confirmation
        showSubmitConfirmation();
    }
}

// Go to specific question
function goToQuestion(questionIndex) {
    saveCurrentAnswer();
    
    if (questionIndex >= 0 && questionIndex < currentQuiz.questions.length) {
        currentQuestionIndex = questionIndex;
        displayCurrentQuestion();
    }
}

// Show submit confirmation modal
function showSubmitConfirmation() {
    const answeredCount = Object.values(userAnswers).filter(answer => answer.trim() !== '').length;
    const totalQuestions = currentQuiz.questions.length;

    document.getElementById('answeredCount').textContent = answeredCount;
    document.getElementById('confirmModal').style.display = 'flex';
}

// Hide submit confirmation modal
function hideSubmitConfirmation() {
    document.getElementById('confirmModal').style.display = 'none';
}

// Submit the quiz for grading
async function submitQuiz() {
    hideSubmitConfirmation();
    showLoading('Grading your quiz...');

    try {
        // Convert answers to array format
        const answersArray = currentQuiz.questions.map((_, index) => userAnswers[index] || '');

        const response = await fetch('/api/submit-quiz', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                quizId: currentQuiz.quizId,
                answers: answersArray,
                studentInfo: studentInfo
            })
        });

        if (!response.ok) {
            throw new Error('Failed to submit quiz');
        }

        const results = await response.json();
        displayResults(results);

    } catch (error) {
        console.error('Error submitting quiz:', error);
        showError('Failed to submit quiz. Please try again.');
    } finally {
        hideLoading();
    }
}

// Display quiz results
function displayResults(results) {
    // Hide questions, show results
    document.getElementById('quizQuestions').style.display = 'none';
    document.getElementById('quizResults').style.display = 'block';

    // Calculate grade
    const grade = getLetterGrade(results.percentage);

    // Update score display
    document.getElementById('scorePercentage').textContent = `${results.percentage}%`;
    document.getElementById('scoreText').textContent = `${results.score} out of ${results.totalQuestions} correct`;
    document.getElementById('gradeText').textContent = `Grade: ${grade}`;

    // Update summary
    document.getElementById('correctCount').textContent = results.score;
    document.getElementById('incorrectCount').textContent = results.totalQuestions - results.score;

    // Calculate time spent
    const timeSpent = quizStartTime ? Math.round((new Date() - quizStartTime) / 1000) : 0;
    document.getElementById('timeSpent').textContent = timeSpent;

    // Store results for detailed view
    window.currentResults = results;

    // Update score circle animation
    updateScoreCircle(results.percentage);

    // Clear session storage
    sessionStorage.removeItem('currentQuiz');
    sessionStorage.removeItem('studentInfo');
}

// Get letter grade from percentage
function getLetterGrade(percentage) {
    if (percentage >= 90) return 'A+';
    if (percentage >= 85) return 'A';
    if (percentage >= 80) return 'A-';
    if (percentage >= 77) return 'B+';
    if (percentage >= 73) return 'B';
    if (percentage >= 70) return 'B-';
    if (percentage >= 67) return 'C+';
    if (percentage >= 63) return 'C';
    if (percentage >= 60) return 'C-';
    if (percentage >= 57) return 'D+';
    if (percentage >= 53) return 'D';
    if (percentage >= 50) return 'D-';
    return 'F';
}

// Update score circle with animation
function updateScoreCircle(percentage) {
    const scoreCircle = document.querySelector('.score-circle');
    if (scoreCircle) {
        scoreCircle.style.setProperty('--score-percentage', `${percentage}%`);
    }
}

// Show detailed results
function showDetailedResults() {
    const detailedResults = document.getElementById('detailedResults');
    const detailedResultsList = document.getElementById('detailedResultsList');

    if (!window.currentResults || !detailedResultsList) {
        return;
    }

    const results = window.currentResults;
    
    const resultsHTML = results.detailedResults.map((result, index) => {
        const statusClass = result.isCorrect ? 'correct' : 'incorrect';
        const statusIcon = result.isCorrect ? '✓' : '✗';
        
        return `
            <div class="result-item ${statusClass}">
                <div class="result-question">
                    ${statusIcon} Question ${result.questionId}: ${result.question}
                </div>
                <div class="result-answer">
                    Your Answer: <strong>${result.userAnswer || 'No answer'}</strong>
                    ${!result.isCorrect ? `<br>Correct Answer: <strong>${result.correctAnswer}</strong>` : ''}
                </div>
                ${result.workShown ? `<div class="result-work">Work: ${result.workShown}</div>` : ''}
            </div>
        `;
    }).join('');

    detailedResultsList.innerHTML = resultsHTML;
    detailedResults.style.display = 'block';

    // Scroll to detailed results
    detailedResults.scrollIntoView({ behavior: 'smooth' });
}

// Utility functions
function showLoading(message = 'Loading...') {
    const loadingOverlay = document.getElementById('loadingOverlay');
    const loadingText = document.getElementById('loadingText');
    
    if (loadingText) {
        loadingText.textContent = message;
    }
    
    if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
    }
}

function hideLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
}

function showError(message) {
    alert('Error: ' + message);
}

// Handle page visibility change to prevent data loss
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'hidden' && currentQuiz) {
        saveCurrentAnswer();
    }
});

// Handle page unload to save progress
window.addEventListener('beforeunload', function(event) {
    if (currentQuiz && Object.keys(userAnswers).length > 0) {
        saveCurrentAnswer();
        // You could implement auto-save functionality here
    }
});

// Export quiz functions for debugging/testing
window.QuizApp = {
    currentQuiz,
    userAnswers,
    goToQuestion,
    submitQuiz,
    displayResults
};