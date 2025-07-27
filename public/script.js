// Global variables
let selectedGrade = null;
let selectedUnit = null;
let availableUnits = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadAvailableUnits();
    setupEventListeners();
});

// Load available math units from the server
async function loadAvailableUnits() {
    try {
        const response = await fetch('/api/units');
        availableUnits = await response.json();
        console.log('Available units loaded:', availableUnits);
    } catch (error) {
        console.error('Error loading units:', error);
        showError('Failed to load available math units. Please refresh the page.');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Grade selection buttons
    const gradeButtons = document.querySelectorAll('.grade-btn');
    gradeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const grade = this.dataset.grade;
            selectGrade(grade);
        });
    });

    // Start quiz button
    const startQuizBtn = document.getElementById('startQuizBtn');
    if (startQuizBtn) {
        startQuizBtn.addEventListener('click', startQuiz);
    }

    // Export and stats buttons
    const exportBtn = document.getElementById('exportBtn');
    const statsBtn = document.getElementById('statsBtn');
    
    if (exportBtn) {
        exportBtn.addEventListener('click', showExportModal);
    }
    
    if (statsBtn) {
        statsBtn.addEventListener('click', showStatsModal);
    }

    // Modal event listeners
    setupModalEventListeners();
}

// Setup modal event listeners
function setupModalEventListeners() {
    // Export modal
    const exportModal = document.getElementById('exportModal');
    const closeExportModal = document.getElementById('closeExportModal');
    const exportForm = document.getElementById('exportForm');

    if (closeExportModal) {
        closeExportModal.addEventListener('click', () => {
            exportModal.style.display = 'none';
        });
    }

    if (exportForm) {
        exportForm.addEventListener('submit', handleExportSubmission);
    }

    // Stats modal
    const statsModal = document.getElementById('statsModal');
    const closeStatsModal = document.getElementById('closeStatsModal');

    if (closeStatsModal) {
        closeStatsModal.addEventListener('click', () => {
            statsModal.style.display = 'none';
        });
    }

    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === exportModal) {
            exportModal.style.display = 'none';
        }
        if (event.target === statsModal) {
            statsModal.style.display = 'none';
        }
    });
}

// Select a grade and display available units
function selectGrade(grade) {
    selectedGrade = grade;
    selectedUnit = null;

    // Update grade button styles
    const gradeButtons = document.querySelectorAll('.grade-btn');
    gradeButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.grade === grade) {
            btn.classList.add('active');
        }
    });

    // Display units for the selected grade
    displayUnitsForGrade(grade);
    
    // Hide start section until a unit is selected
    document.getElementById('startSection').style.display = 'none';
}

// Display available units for the selected grade
function displayUnitsForGrade(grade) {
    const unitsList = document.getElementById('unitsList');
    const gradeUnits = availableUnits[`grade${grade}`];

    if (!gradeUnits) {
        unitsList.innerHTML = '<p class="select-grade-message">No units available for this grade.</p>';
        return;
    }

    const unitsHTML = Object.entries(gradeUnits).map(([unitKey, unitData]) => {
        return `
            <div class="unit-card" data-unit="${unitKey}">
                <h5>${unitData.title}</h5>
                <p>${unitData.description}</p>
            </div>
        `;
    }).join('');

    unitsList.innerHTML = unitsHTML;

    // Add click event listeners to unit cards
    const unitCards = document.querySelectorAll('.unit-card');
    unitCards.forEach(card => {
        card.addEventListener('click', function() {
            selectUnit(this.dataset.unit);
        });
    });
}

// Select a math unit
function selectUnit(unit) {
    selectedUnit = unit;

    // Update unit card styles
    const unitCards = document.querySelectorAll('.unit-card');
    unitCards.forEach(card => {
        card.classList.remove('selected');
        if (card.dataset.unit === unit) {
            card.classList.add('selected');
        }
    });

    // Show start section
    document.getElementById('startSection').style.display = 'block';
}

// Start a new quiz
async function startQuiz() {
    if (!selectedGrade || !selectedUnit) {
        showError('Please select both a grade and a math unit.');
        return;
    }

    const studentName = document.getElementById('studentName').value.trim();
    const studentEmail = document.getElementById('studentEmail').value.trim();

    const studentInfo = {
        name: studentName || null,
        email: studentEmail || null
    };

    showLoading('Generating your quiz...');

    try {
        const response = await fetch('/api/generate-quiz', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                unit: selectedUnit,
                grade: parseInt(selectedGrade)
            })
        });

        if (!response.ok) {
            throw new Error('Failed to generate quiz');
        }

        const quizData = await response.json();
        
        // Store quiz data and student info for the quiz page
        sessionStorage.setItem('currentQuiz', JSON.stringify(quizData));
        sessionStorage.setItem('studentInfo', JSON.stringify(studentInfo));

        // Redirect to quiz page
        window.location.href = 'quiz.html';

    } catch (error) {
        console.error('Error starting quiz:', error);
        showError('Failed to generate quiz. Please try again.');
    } finally {
        hideLoading();
    }
}

// Show export modal
function showExportModal() {
    const exportModal = document.getElementById('exportModal');
    exportModal.style.display = 'flex';
    
    // Populate filter options
    populateExportFilters();
}

// Populate export filter options
function populateExportFilters() {
    const filterUnit = document.getElementById('filterUnit');
    if (!filterUnit) return;

    // Clear existing options except the first one
    filterUnit.innerHTML = '<option value="">All Units</option>';

    // Add units from both grades
    Object.entries(availableUnits).forEach(([gradeKey, gradeUnits]) => {
        const grade = gradeKey.replace('grade', '');
        Object.entries(gradeUnits).forEach(([unitKey, unitData]) => {
            const option = document.createElement('option');
            option.value = unitKey;
            option.textContent = `Grade ${grade}: ${unitData.title}`;
            filterUnit.appendChild(option);
        });
    });
}

// Handle export form submission
async function handleExportSubmission(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const email = formData.get('exportEmail');
    const filters = {
        grade: document.getElementById('filterGrade').value || null,
        unit: document.getElementById('filterUnit').value || null,
        dateFrom: document.getElementById('dateFrom').value || null,
        dateTo: document.getElementById('dateTo').value || null
    };

    // Remove null values from filters
    Object.keys(filters).forEach(key => {
        if (filters[key] === null || filters[key] === '') {
            delete filters[key];
        }
    });

    try {
        showLoading('Exporting data...');

        const response = await fetch('/api/export-csv', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, filters })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Export failed');
        }

        showSuccess(`Export successful! ${result.recordCount} records exported. Check your email for the CSV file.`);
        document.getElementById('exportModal').style.display = 'none';
        document.getElementById('exportForm').reset();

    } catch (error) {
        console.error('Export error:', error);
        showError(`Export failed: ${error.message}`);
    } finally {
        hideLoading();
    }
}

// Show statistics modal
async function showStatsModal() {
    const statsModal = document.getElementById('statsModal');
    const statsContent = document.getElementById('statsContent');
    
    statsModal.style.display = 'flex';
    statsContent.innerHTML = '<div class="loading">Loading statistics...</div>';

    try {
        const response = await fetch('/api/admin/stats');
        const stats = await response.json();

        if (!response.ok) {
            throw new Error('Failed to load statistics');
        }

        displayStatistics(stats);

    } catch (error) {
        console.error('Stats error:', error);
        statsContent.innerHTML = '<p style="color: red;">Failed to load statistics.</p>';
    }
}

// Display statistics data
function displayStatistics(stats) {
    const statsContent = document.getElementById('statsContent');
    
    const unitBreakdownHTML = Object.entries(stats.unitBreakdown)
        .map(([unit, count]) => `<div class="stat-item"><strong>${unit}:</strong> ${count} quizzes</div>`)
        .join('');

    const gradeBreakdownHTML = Object.entries(stats.gradeBreakdown)
        .map(([grade, count]) => `<div class="stat-item"><strong>Grade ${grade}:</strong> ${count} quizzes</div>`)
        .join('');

    statsContent.innerHTML = `
        <div class="stats-summary">
            <div class="stat-card">
                <h4>Total Quizzes</h4>
                <p class="stat-number">${stats.totalQuizzes}</p>
            </div>
            <div class="stat-card">
                <h4>Average Score</h4>
                <p class="stat-number">${stats.avgScore}%</p>
            </div>
        </div>
        
        <div class="stats-breakdown">
            <div class="breakdown-section">
                <h4>Quizzes by Unit</h4>
                <div class="breakdown-list">
                    ${unitBreakdownHTML || '<p>No data available</p>'}
                </div>
            </div>
            
            <div class="breakdown-section">
                <h4>Quizzes by Grade</h4>
                <div class="breakdown-list">
                    ${gradeBreakdownHTML || '<p>No data available</p>'}
                </div>
            </div>
        </div>
    `;

    // Add some inline styles for statistics
    const style = document.createElement('style');
    style.textContent = `
        .stats-summary {
            display: flex;
            gap: 1rem;
            margin-bottom: 2rem;
            flex-wrap: wrap;
        }
        .stat-card {
            flex: 1;
            min-width: 150px;
            padding: 1rem;
            background: #f8fafc;
            border-radius: 8px;
            text-align: center;
        }
        .stat-number {
            font-size: 2rem;
            font-weight: 700;
            color: #4f46e5;
            margin: 0;
        }
        .breakdown-section {
            margin-bottom: 1.5rem;
        }
        .breakdown-section h4 {
            color: #374151;
            margin-bottom: 0.5rem;
        }
        .stat-item {
            padding: 0.5rem 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .stat-item:last-child {
            border-bottom: none;
        }
    `;
    document.head.appendChild(style);
}

// Utility functions
function showLoading(message = 'Loading...') {
    const loadingOverlay = document.getElementById('loadingOverlay');
    const loadingText = loadingOverlay.querySelector('p');
    if (loadingText) {
        loadingText.textContent = message;
    }
    loadingOverlay.style.display = 'flex';
}

function hideLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.style.display = 'none';
}

function showError(message) {
    alert('Error: ' + message);
}

function showSuccess(message) {
    alert('Success: ' + message);
}

// Export functions for potential use by other scripts
window.MathQuizApp = {
    selectGrade,
    selectUnit,
    startQuiz,
    showExportModal,
    showStatsModal
};