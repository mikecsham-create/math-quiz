const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Store quiz sessions and results
let quizSessions = new Map();
let quizResults = [];

// Import quiz generators
const QuizGenerator = require('./lib/quizGenerator');
const quizGenerator = new QuizGenerator();

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/quiz/:unit', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'quiz.html'));
});

// API Routes
app.get('/api/units', (req, res) => {
    res.json(quizGenerator.getAvailableUnits());
});

app.post('/api/generate-quiz', (req, res) => {
    try {
        const { unit, grade } = req.body;
        const quizId = uuidv4();
        const quiz = quizGenerator.generateQuiz(unit, grade, 20);
        
        quizSessions.set(quizId, {
            quiz,
            startTime: new Date(),
            completed: false
        });
        
        res.json({
            quizId,
            questions: quiz.questions,
            metadata: {
                unit: quiz.unit,
                grade: quiz.grade,
                title: quiz.title,
                instructions: quiz.instructions
            }
        });
    } catch (error) {
        console.error('Error generating quiz:', error);
        res.status(500).json({ error: 'Failed to generate quiz' });
    }
});

app.post('/api/submit-quiz', (req, res) => {
    try {
        const { quizId, answers, studentInfo } = req.body;
        const session = quizSessions.get(quizId);
        
        if (!session) {
            return res.status(404).json({ error: 'Quiz session not found' });
        }
        
        const results = quizGenerator.gradeQuiz(session.quiz, answers);
        const endTime = new Date();
        const timeSpent = Math.round((endTime - session.startTime) / 1000); // seconds
        
        const quizResult = {
            quizId,
            studentInfo,
            unit: session.quiz.unit,
            grade: session.quiz.grade,
            score: results.score,
            totalQuestions: results.totalQuestions,
            percentage: results.percentage,
            timeSpent,
            completedAt: endTime,
            correctAnswers: results.correctAnswers,
            incorrectAnswers: results.incorrectAnswers,
            detailedResults: results.detailedResults
        };
        
        quizResults.push(quizResult);
        session.completed = true;
        
        res.json(results);
    } catch (error) {
        console.error('Error submitting quiz:', error);
        res.status(500).json({ error: 'Failed to submit quiz' });
    }
});

app.post('/api/export-csv', async (req, res) => {
    try {
        const { email, filters } = req.body;
        
        // Filter results based on criteria
        let filteredResults = quizResults;
        if (filters) {
            if (filters.unit) {
                filteredResults = filteredResults.filter(r => r.unit === filters.unit);
            }
            if (filters.grade) {
                filteredResults = filteredResults.filter(r => r.grade === filters.grade);
            }
            if (filters.dateFrom) {
                filteredResults = filteredResults.filter(r => new Date(r.completedAt) >= new Date(filters.dateFrom));
            }
            if (filters.dateTo) {
                filteredResults = filteredResults.filter(r => new Date(r.completedAt) <= new Date(filters.dateTo));
            }
        }
        
        if (filteredResults.length === 0) {
            return res.status(400).json({ error: 'No data found for the specified criteria' });
        }
        
        // Generate CSV
        const filename = `math_quiz_results_${new Date().toISOString().split('T')[0]}.csv`;
        const filepath = path.join(__dirname, 'exports', filename);
        
        // Ensure exports directory exists
        if (!fs.existsSync(path.join(__dirname, 'exports'))) {
            fs.mkdirSync(path.join(__dirname, 'exports'));
        }
        
        const csvWriter = createCsvWriter({
            path: filepath,
            header: [
                { id: 'studentName', title: 'Student Name' },
                { id: 'studentEmail', title: 'Student Email' },
                { id: 'unit', title: 'Unit' },
                { id: 'grade', title: 'Grade' },
                { id: 'score', title: 'Score' },
                { id: 'totalQuestions', title: 'Total Questions' },
                { id: 'percentage', title: 'Percentage' },
                { id: 'timeSpent', title: 'Time Spent (seconds)' },
                { id: 'completedAt', title: 'Completed At' },
                { id: 'correctAnswers', title: 'Correct Answers' },
                { id: 'incorrectAnswers', title: 'Incorrect Answers' }
            ]
        });
        
        const csvData = filteredResults.map(result => ({
            studentName: result.studentInfo?.name || 'Anonymous',
            studentEmail: result.studentInfo?.email || 'Not provided',
            unit: result.unit,
            grade: result.grade,
            score: result.score,
            totalQuestions: result.totalQuestions,
            percentage: result.percentage,
            timeSpent: result.timeSpent,
            completedAt: result.completedAt.toISOString(),
            correctAnswers: result.correctAnswers.join('; '),
            incorrectAnswers: result.incorrectAnswers.join('; ')
        }));
        
        await csvWriter.writeRecords(csvData);
        
        // Send email with CSV attachment
        if (email) {
            await sendEmailWithAttachment(email, filepath, filename);
        }
        
        res.json({ 
            message: 'CSV exported successfully',
            filename,
            recordCount: filteredResults.length
        });
        
    } catch (error) {
        console.error('Error exporting CSV:', error);
        res.status(500).json({ error: 'Failed to export CSV' });
    }
});

async function sendEmailWithAttachment(email, filepath, filename) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('Email credentials not configured. Skipping email send.');
        return;
    }
    
    const transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Math Quiz Results Export',
        text: `Please find attached the math quiz results export generated on ${new Date().toLocaleString()}.`,
        attachments: [
            {
                filename: filename,
                path: filepath
            }
        ]
    };
    
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', email);
}

app.get('/api/admin/stats', (req, res) => {
    const stats = {
        totalQuizzes: quizResults.length,
        avgScore: quizResults.length > 0 ? 
            (quizResults.reduce((sum, r) => sum + r.percentage, 0) / quizResults.length).toFixed(1) : 0,
        unitBreakdown: {},
        gradeBreakdown: {}
    };
    
    quizResults.forEach(result => {
        stats.unitBreakdown[result.unit] = (stats.unitBreakdown[result.unit] || 0) + 1;
        stats.gradeBreakdown[result.grade] = (stats.gradeBreakdown[result.grade] || 0) + 1;
    });
    
    res.json(stats);
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`Math Quiz Server running on port ${PORT}`);
    console.log(`Open http://localhost:${PORT} to access the application`);
});