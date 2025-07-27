# Ontario Math Quiz Website

A comprehensive web-based math quiz application designed for Ontario Grade 7 and 8 curriculum. This application generates 20-question quizzes based on specific math units, provides automatic grading, and exports quiz data to CSV format via email.

## Features

### 🎯 Curriculum-Aligned Content
- **Grade 7 Math Units:**
  - Number - Integers (addition and subtraction)
  - Number - Fractions (equivalent fractions, addition/subtraction)
  - Algebra - Patterns (arithmetic, geometric, missing terms)
  - Algebra - Equations (one-step, two-step, multi-step)
  - Data - Circle Graphs (interpretation and percentages)
  - Spatial Sense - Circles (circumference, radius, area)
  - Spatial Sense - Surface Area and Volume (cylinders, 3D objects)
  - Financial Literacy - Exchange Rates (currency conversion)

- **Grade 8 Math Units:**
  - Number - Scientific Notation (standard to scientific, operations)
  - Number - Proportions (direct proportions, percentage change)
  - Number - Square Roots (perfect squares, estimation)
  - Algebra - Algebraic Relationships (formulas, substitution)
  - Algebra - Patterns with Integers (identification, extension)
  - Data - Scatter Plots (interpretation, correlation)
  - Spatial Sense - Pythagorean Theorem (hypotenuse, legs)
  - Spatial Sense - Angle Properties (parallel lines, intersecting lines)
  - Financial Literacy - Simple and Compound Interest

### 🚀 Quiz Features
- **20 Questions Per Quiz:** Each quiz contains exactly 20 randomly generated questions
- **Auto-Grading:** Instant feedback with detailed scoring
- **Progress Tracking:** Visual progress bar and question navigation grid
- **Flexible Navigation:** Jump between questions, save answers automatically
- **Detailed Results:** Review correct/incorrect answers with explanations
- **Time Tracking:** Monitor time spent on quizzes

### 📊 Data Management
- **CSV Export:** Export quiz results to CSV format
- **Email Integration:** Automatically send CSV files via email
- **Advanced Filtering:** Filter exports by grade, unit, date range
- **Statistics Dashboard:** View overall performance statistics
- **Data Persistence:** Quiz results stored for analysis

### 💻 Modern User Interface
- **Responsive Design:** Works on desktop, tablet, and mobile devices
- **Clean UI:** Modern, intuitive interface with smooth animations
- **Accessibility:** Keyboard navigation and screen reader friendly
- **Loading States:** Clear feedback during quiz generation and submission

## Technology Stack

- **Backend:** Node.js with Express
- **Frontend:** Vanilla HTML, CSS, and JavaScript
- **Styling:** Modern CSS with Flexbox and Grid
- **Email:** Nodemailer with Gmail integration
- **Data Export:** CSV-Writer for data formatting
- **Icons:** Font Awesome for UI icons
- **Fonts:** Google Fonts (Poppins)

## Installation and Setup

### Prerequisites
- Node.js (version 14 or higher)
- npm (comes with Node.js)
- Gmail account for email functionality (optional)

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd ontario-math-quiz-website
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Environment Configuration
1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` file with your configuration:
```env
PORT=3000
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
NODE_ENV=development
```

**Setting up Gmail App Password:**
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Factor Authentication if not already enabled
3. Go to [App Passwords](https://myaccount.google.com/apppasswords)
4. Generate a new app password for "Mail"
5. Use this password in the `EMAIL_PASS` field

### Step 4: Start the Application
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

### Step 5: Access the Application
Open your browser and navigate to:
```
http://localhost:3000
```

## Usage Guide

### For Students

1. **Starting a Quiz:**
   - Enter your name and email (optional)
   - Select your grade (7 or 8)
   - Choose a math unit
   - Click "Start Quiz"

2. **Taking the Quiz:**
   - Read the instructions carefully
   - Answer questions in any order
   - Use the navigation grid to jump between questions
   - Questions are automatically saved as you type
   - Submit when ready (you can submit with incomplete answers)

3. **Viewing Results:**
   - See your score, percentage, and letter grade
   - Review detailed results to see correct answers
   - View explanations for each question

### For Teachers/Administrators

1. **Monitoring Usage:**
   - Click "View Statistics" to see overall quiz performance
   - View breakdowns by grade and unit

2. **Exporting Data:**
   - Click "Export Quiz Data to CSV"
   - Choose filters (grade, unit, date range)
   - Enter email address to receive CSV file
   - CSV includes student info, scores, and detailed results

## Quiz Question Types

The application generates various types of math questions based on the Ontario curriculum:

### Grade 7 Examples:
- **Integers:** Calculate: -5 + (-3)
- **Fractions:** What is the equivalent fraction for 2/3 with denominator 12?
- **Patterns:** What is the next term in: 5, 8, 11, 14, ___?
- **Equations:** Solve for x: 3x + 4 = 19
- **Circles:** Find the circumference of a circle with radius 6 cm
- **Interest:** Calculate simple interest on $5000 at 4% for 2 years

### Grade 8 Examples:
- **Scientific Notation:** Write 45,000 in scientific notation
- **Proportions:** If 3 items cost $12, how much do 7 items cost?
- **Square Roots:** What is the square root of 81?
- **Pythagorean Theorem:** Find the hypotenuse when legs are 3 cm and 4 cm
- **Compound Interest:** Calculate compound interest with given parameters

## File Structure

```
ontario-math-quiz-website/
├── server.js                 # Main server file
├── package.json              # Dependencies and scripts
├── .env.example              # Environment variables example
├── README.md                 # This file
├── lib/
│   └── quizGenerator.js      # Quiz generation logic
├── public/
│   ├── index.html            # Main page
│   ├── quiz.html             # Quiz interface
│   ├── styles.css            # Styling
│   ├── script.js             # Main page JavaScript
│   └── quiz.js               # Quiz interface JavaScript
└── exports/                  # CSV export directory (created automatically)
```

## API Endpoints

### Public Endpoints
- `GET /` - Main application page
- `GET /quiz/:unit` - Quiz interface page

### API Endpoints
- `GET /api/units` - Get available math units
- `POST /api/generate-quiz` - Generate a new quiz
- `POST /api/submit-quiz` - Submit quiz for grading
- `POST /api/export-csv` - Export quiz data to CSV
- `GET /api/admin/stats` - Get usage statistics

## Customization

### Adding New Question Types
1. Edit `lib/quizGenerator.js`
2. Add new question types to `questionTypeMap`
3. Create generator functions for new question types
4. Test thoroughly

### Modifying Curriculum Units
1. Edit the `mathUnits` object in `lib/quizGenerator.js`
2. Add or modify unit definitions
3. Ensure question generators exist for new units

### Styling Changes
1. Edit `public/styles.css`
2. The CSS uses CSS custom properties for easy theming
3. Responsive design uses CSS Grid and Flexbox

## Troubleshooting

### Common Issues

**Quiz won't start:**
- Check browser console for JavaScript errors
- Ensure server is running on correct port
- Clear browser cache and reload

**Email not sending:**
- Verify Gmail app password is correct
- Check `.env` file configuration
- Ensure 2FA is enabled on Gmail account

**Questions not loading:**
- Check server console for errors
- Verify QuizGenerator is working properly
- Check API endpoints are responding

**CSV export fails:**
- Ensure exports directory exists and is writable
- Check email configuration
- Verify there is quiz data to export

### Development Tips

1. Use browser developer tools to debug JavaScript
2. Check server console for backend errors
3. Use `npm run dev` for auto-restart during development
4. Test on different screen sizes for responsive design

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support or questions:
1. Check this README file
2. Review the troubleshooting section
3. Check the browser and server console for errors
4. Create an issue in the repository

## Future Enhancements

Potential improvements for future versions:
- Database integration for persistent data storage
- User authentication and progress tracking
- More advanced question types (multiple choice, drag-and-drop)
- Detailed analytics and reporting
- Classroom management features
- Integration with Learning Management Systems (LMS)
- Offline mode capability
- Print-friendly quiz formats