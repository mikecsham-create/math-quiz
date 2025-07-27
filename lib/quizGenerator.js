class QuizGenerator {
    constructor() {
        this.mathUnits = {
            grade7: {
                "number-integers": {
                    title: "Number - Integers",
                    description: "Addition and subtraction of integers",
                    instructions: "Solve each problem. Show your work where applicable."
                },
                "number-fractions": {
                    title: "Number - Fractions",
                    description: "Adding and subtracting fractions with equivalent fractions",
                    instructions: "Add or subtract the fractions. Simplify your answers to lowest terms."
                },
                "algebra-patterns": {
                    title: "Algebra - Patterns",
                    description: "Identify and extend patterns involving whole numbers and decimals",
                    instructions: "Identify the pattern and find the missing terms."
                },
                "algebra-equations": {
                    title: "Algebra - Equations",
                    description: "Solving equations with multiple terms and decimal numbers",
                    instructions: "Solve for the variable. Check your answer by substitution."
                },
                "data-circle-graphs": {
                    title: "Data - Circle Graphs",
                    description: "Interpreting circle graphs and calculating percentages",
                    instructions: "Use the circle graph to answer the questions."
                },
                "spatial-circles": {
                    title: "Spatial Sense - Circles",
                    description: "Circumference, diameter, radius and area of circles",
                    instructions: "Calculate the measurements. Use π = 3.14 or leave answers in terms of π."
                },
                "spatial-surface-area": {
                    title: "Spatial Sense - Surface Area and Volume",
                    description: "Surface area and volume of cylinders and 3D objects",
                    instructions: "Calculate the surface area and volume. Show your work."
                },
                "financial-exchange-rates": {
                    title: "Financial Literacy - Exchange Rates",
                    description: "Currency conversion and exchange rates",
                    instructions: "Calculate currency conversions using the given exchange rates."
                }
            },
            grade8: {
                "number-scientific-notation": {
                    title: "Number - Scientific Notation",
                    description: "Representing very large and small numbers in scientific notation",
                    instructions: "Convert between standard form and scientific notation."
                },
                "number-proportions": {
                    title: "Number - Proportions",
                    description: "Solving problems involving proportions and percentages",
                    instructions: "Solve the proportion problems. Show your work."
                },
                "number-square-roots": {
                    title: "Number - Square Numbers and Square Roots",
                    description: "Square numbers to 144 and their square roots",
                    instructions: "Calculate the square roots or square numbers."
                },
                "algebra-relationships": {
                    title: "Algebra - Algebraic Relationships",
                    description: "Using algebraic notation to represent relationships",
                    instructions: "Write algebraic expressions and solve equations."
                },
                "algebra-integers": {
                    title: "Algebra - Patterns with Integers",
                    description: "Creating and analyzing patterns involving integers",
                    instructions: "Identify patterns and solve for missing values."
                },
                "data-scatter-plots": {
                    title: "Data - Scatter Plots",
                    description: "Analyzing relationships between two variables",
                    instructions: "Interpret the scatter plot and answer the questions."
                },
                "spatial-pythagorean": {
                    title: "Spatial Sense - Pythagorean Theorem",
                    description: "Finding unknown side lengths in right triangles",
                    instructions: "Use the Pythagorean theorem to find the missing side length."
                },
                "spatial-angles": {
                    title: "Spatial Sense - Angle Properties",
                    description: "Calculating angles using properties of parallel and intersecting lines",
                    instructions: "Find the missing angle measurements."
                },
                "financial-compound-interest": {
                    title: "Financial Literacy - Simple and Compound Interest",
                    description: "Calculating simple and compound interest",
                    instructions: "Calculate the interest and final amounts."
                }
            }
        };
    }

    getAvailableUnits() {
        return this.mathUnits;
    }

    generateQuiz(unit, grade, questionCount = 20) {
        const gradeStr = `grade${grade}`;
        const unitData = this.mathUnits[gradeStr]?.[unit];
        
        if (!unitData) {
            throw new Error(`Unit ${unit} not found for grade ${grade}`);
        }

        const questions = [];
        const questionTypes = this.getQuestionTypesForUnit(unit);
        
        for (let i = 0; i < questionCount; i++) {
            const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
            const question = this.generateQuestion(unit, questionType, i + 1);
            questions.push(question);
        }

        return {
            unit,
            grade,
            title: unitData.title,
            instructions: unitData.instructions,
            questions
        };
    }

    getQuestionTypesForUnit(unit) {
        const questionTypeMap = {
            "number-integers": ["addition", "subtraction", "word-problem"],
            "number-fractions": ["addition", "subtraction", "equivalent"],
            "algebra-patterns": ["arithmetic", "geometric", "missing-term"],
            "algebra-equations": ["one-step", "two-step", "multi-step"],
            "data-circle-graphs": ["percentage", "interpretation", "calculation"],
            "spatial-circles": ["circumference", "area", "radius"],
            "spatial-surface-area": ["cylinder-surface", "cylinder-volume", "composite"],
            "financial-exchange-rates": ["currency-conversion", "percentage-change", "comparison"],
            "number-scientific-notation": ["standard-to-scientific", "scientific-to-standard", "operations"],
            "number-proportions": ["direct", "percentage-change", "word-problem"],
            "number-square-roots": ["perfect-squares", "estimation", "application"],
            "algebra-relationships": ["formula", "substitution", "rearrangement"],
            "algebra-integers": ["pattern-identification", "extension", "rule"],
            "data-scatter-plots": ["interpretation", "correlation", "prediction"],
            "spatial-pythagorean": ["find-hypotenuse", "find-leg", "word-problem"],
            "spatial-angles": ["parallel-lines", "intersecting-lines", "triangles"],
            "financial-compound-interest": ["simple-interest", "compound-interest", "comparison"]
        };
        
        return questionTypeMap[unit] || ["basic"];
    }

    generateQuestion(unit, questionType, questionNumber) {
        const generators = {
            // Number - Integers
            "addition": () => this.generateIntegerAddition(),
            "subtraction": () => this.generateIntegerSubtraction(),
            
            // Number - Fractions
            "equivalent": () => this.generateEquivalentFractions(),
            
            // Algebra - Patterns
            "arithmetic": () => this.generateArithmeticPattern(),
            "geometric": () => this.generateGeometricPattern(),
            "missing-term": () => this.generateMissingTermPattern(),
            
            // Algebra - Equations
            "one-step": () => this.generateOneStepEquation(),
            "two-step": () => this.generateTwoStepEquation(),
            "multi-step": () => this.generateMultiStepEquation(),
            
            // Spatial - Circles
            "circumference": () => this.generateCircumferenceQuestion(),
            "area": () => this.generateCircleAreaQuestion(),
            "radius": () => this.generateRadiusQuestion(),
            
            // Spatial - Surface Area and Volume
            "cylinder-surface": () => this.generateCylinderSurfaceArea(),
            "cylinder-volume": () => this.generateCylinderVolume(),
            
            // Scientific Notation
            "standard-to-scientific": () => this.generateStandardToScientific(),
            "scientific-to-standard": () => this.generateScientificToStandard(),
            
            // Proportions
            "direct": () => this.generateDirectProportion(),
            "percentage-change": () => this.generatePercentageChange(),
            
            // Square Roots
            "perfect-squares": () => this.generatePerfectSquares(),
            
            // Pythagorean Theorem
            "find-hypotenuse": () => this.generatePythagoreanHypotenuse(),
            "find-leg": () => this.generatePythagoreanLeg(),
            
            // Financial Literacy
            "simple-interest": () => this.generateSimpleInterest(),
            "compound-interest": () => this.generateCompoundInterest(),
            
            // Default
            "basic": () => this.generateBasicQuestion(unit)
        };

        const generator = generators[questionType] || generators["basic"];
        const question = generator();
        
        return {
            id: questionNumber,
            type: questionType,
            ...question
        };
    }

    // Question Generators
    generateIntegerAddition() {
        const a = Math.floor(Math.random() * 21) - 10; // -10 to 10
        const b = Math.floor(Math.random() * 21) - 10; // -10 to 10
        const answer = a + b;
        
        return {
            question: `Calculate: ${a} + (${b})`,
            answer: answer.toString(),
            workShown: `${a} + (${b}) = ${answer}`,
            type: "number"
        };
    }

    generateIntegerSubtraction() {
        const a = Math.floor(Math.random() * 21) - 10; // -10 to 10
        const b = Math.floor(Math.random() * 21) - 10; // -10 to 10
        const answer = a - b;
        
        return {
            question: `Calculate: ${a} - (${b})`,
            answer: answer.toString(),
            workShown: `${a} - (${b}) = ${a} + (${-b}) = ${answer}`,
            type: "number"
        };
    }

    generateEquivalentFractions() {
        const numerator = Math.floor(Math.random() * 8) + 1;
        const denominator = Math.floor(Math.random() * 8) + 2;
        const multiplier = Math.floor(Math.random() * 4) + 2;
        const newNumerator = numerator * multiplier;
        const newDenominator = denominator * multiplier;
        
        return {
            question: `What is the equivalent fraction for ${numerator}/${denominator} with denominator ${newDenominator}?`,
            answer: `${newNumerator}/${newDenominator}`,
            workShown: `${numerator}/${denominator} = ${newNumerator}/${newDenominator} (multiply both by ${multiplier})`,
            type: "fraction"
        };
    }

    generateArithmeticPattern() {
        const start = Math.floor(Math.random() * 10) + 1;
        const diff = Math.floor(Math.random() * 5) + 1;
        const terms = [start, start + diff, start + 2*diff, start + 3*diff];
        const nextTerm = start + 4*diff;
        
        return {
            question: `What is the next term in the pattern: ${terms.join(', ')}, ___?`,
            answer: nextTerm.toString(),
            workShown: `Pattern: add ${diff} each time. Next term: ${terms[3]} + ${diff} = ${nextTerm}`,
            type: "number"
        };
    }

    generateOneStepEquation() {
        const x = Math.floor(Math.random() * 10) + 1;
        const operation = Math.random() < 0.5 ? 'add' : 'multiply';
        
        if (operation === 'add') {
            const b = Math.floor(Math.random() * 10) + 1;
            const result = x + b;
            return {
                question: `Solve for x: x + ${b} = ${result}`,
                answer: x.toString(),
                workShown: `x + ${b} = ${result}, so x = ${result} - ${b} = ${x}`,
                type: "number"
            };
        } else {
            const b = Math.floor(Math.random() * 5) + 2;
            const result = x * b;
            return {
                question: `Solve for x: ${b}x = ${result}`,
                answer: x.toString(),
                workShown: `${b}x = ${result}, so x = ${result} ÷ ${b} = ${x}`,
                type: "number"
            };
        }
    }

    generateTwoStepEquation() {
        const x = Math.floor(Math.random() * 8) + 1;
        const a = Math.floor(Math.random() * 4) + 2;
        const b = Math.floor(Math.random() * 8) + 1;
        const result = a * x + b;
        
        return {
            question: `Solve for x: ${a}x + ${b} = ${result}`,
            answer: x.toString(),
            workShown: `${a}x + ${b} = ${result}; ${a}x = ${result - b}; x = ${x}`,
            type: "number"
        };
    }

    generateCircumferenceQuestion() {
        const radius = Math.floor(Math.random() * 8) + 2;
        const circumference = 2 * Math.PI * radius;
        
        return {
            question: `Find the circumference of a circle with radius ${radius} cm. (Use π = 3.14)`,
            answer: (2 * 3.14 * radius).toFixed(2),
            workShown: `C = 2πr = 2 × 3.14 × ${radius} = ${(2 * 3.14 * radius).toFixed(2)} cm`,
            type: "number",
            unit: "cm"
        };
    }

    generateCircleAreaQuestion() {
        const radius = Math.floor(Math.random() * 6) + 2;
        
        return {
            question: `Find the area of a circle with radius ${radius} cm. (Use π = 3.14)`,
            answer: (3.14 * radius * radius).toFixed(2),
            workShown: `A = πr² = 3.14 × ${radius}² = 3.14 × ${radius * radius} = ${(3.14 * radius * radius).toFixed(2)} cm²`,
            type: "number",
            unit: "cm²"
        };
    }

    generateStandardToScientific() {
        const exponent = Math.floor(Math.random() * 6) + 3; // 3 to 8
        const coefficient = (Math.random() * 9 + 1).toFixed(1); // 1.0 to 9.9
        const standardForm = parseFloat(coefficient) * Math.pow(10, exponent);
        
        return {
            question: `Write ${standardForm.toLocaleString()} in scientific notation.`,
            answer: `${coefficient} × 10^${exponent}`,
            workShown: `${standardForm.toLocaleString()} = ${coefficient} × 10^${exponent}`,
            type: "text"
        };
    }

    generatePythagoreanHypotenuse() {
        const a = Math.floor(Math.random() * 8) + 3;
        const b = Math.floor(Math.random() * 8) + 3;
        const c = Math.sqrt(a*a + b*b);
        
        return {
            question: `In a right triangle, if the legs are ${a} cm and ${b} cm, what is the length of the hypotenuse?`,
            answer: c.toFixed(2),
            workShown: `c² = a² + b² = ${a}² + ${b}² = ${a*a} + ${b*b} = ${a*a + b*b}; c = √${a*a + b*b} = ${c.toFixed(2)} cm`,
            type: "number",
            unit: "cm"
        };
    }

    generateSimpleInterest() {
        const principal = (Math.floor(Math.random() * 10) + 1) * 1000; // $1000 to $10000
        const rate = Math.floor(Math.random() * 8) + 2; // 2% to 9%
        const time = Math.floor(Math.random() * 4) + 1; // 1 to 4 years
        const interest = (principal * rate * time) / 100;
        
        return {
            question: `Calculate the simple interest on $${principal.toLocaleString()} at ${rate}% per year for ${time} years.`,
            answer: interest.toFixed(2),
            workShown: `I = Prt = $${principal.toLocaleString()} × ${rate}% × ${time} = $${interest.toFixed(2)}`,
            type: "number",
            unit: "$"
        };
    }

    generateBasicQuestion(unit) {
        return {
            question: `This is a sample question for ${unit}. What is 2 + 2?`,
            answer: "4",
            workShown: "2 + 2 = 4",
            type: "number"
        };
    }

    // Additional generators for other question types...
    generateGeometricPattern() {
        const start = Math.floor(Math.random() * 3) + 2;
        const ratio = Math.floor(Math.random() * 3) + 2;
        const terms = [start, start * ratio, start * ratio * ratio, start * ratio * ratio * ratio];
        const nextTerm = start * Math.pow(ratio, 4);
        
        return {
            question: `What is the next term in the pattern: ${terms.join(', ')}, ___?`,
            answer: nextTerm.toString(),
            workShown: `Pattern: multiply by ${ratio} each time. Next term: ${terms[3]} × ${ratio} = ${nextTerm}`,
            type: "number"
        };
    }

    generateDirectProportion() {
        const x1 = Math.floor(Math.random() * 8) + 2;
        const y1 = Math.floor(Math.random() * 8) + 2;
        const x2 = Math.floor(Math.random() * 8) + 2;
        const y2 = (y1 * x2) / x1;
        
        return {
            question: `If ${x1} items cost $${y1}, how much do ${x2} items cost?`,
            answer: y2.toFixed(2),
            workShown: `${x1}/${y1} = ${x2}/y; y = ${y1} × ${x2} ÷ ${x1} = $${y2.toFixed(2)}`,
            type: "number",
            unit: "$"
        };
    }

    generatePerfectSquares() {
        const numbers = [1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144];
        const randomSquare = numbers[Math.floor(Math.random() * numbers.length)];
        const squareRoot = Math.sqrt(randomSquare);
        
        return {
            question: `What is the square root of ${randomSquare}?`,
            answer: squareRoot.toString(),
            workShown: `√${randomSquare} = ${squareRoot} because ${squareRoot}² = ${randomSquare}`,
            type: "number"
        };
    }

    gradeQuiz(quiz, answers) {
        let score = 0;
        const totalQuestions = quiz.questions.length;
        const detailedResults = [];
        const correctAnswers = [];
        const incorrectAnswers = [];

        quiz.questions.forEach((question, index) => {
            const userAnswer = answers[index]?.toString().trim().toLowerCase();
            const correctAnswer = question.answer.toString().trim().toLowerCase();
            const isCorrect = userAnswer === correctAnswer;
            
            if (isCorrect) {
                score++;
                correctAnswers.push(`Q${question.id}: ${question.question} - Your answer: ${userAnswer}`);
            } else {
                incorrectAnswers.push(`Q${question.id}: ${question.question} - Your answer: ${userAnswer || 'No answer'} - Correct answer: ${correctAnswer}`);
            }
            
            detailedResults.push({
                questionId: question.id,
                question: question.question,
                userAnswer: userAnswer || 'No answer',
                correctAnswer: question.answer,
                isCorrect,
                workShown: question.workShown
            });
        });

        const percentage = Math.round((score / totalQuestions) * 100);

        return {
            score,
            totalQuestions,
            percentage,
            correctAnswers,
            incorrectAnswers,
            detailedResults
        };
    }
}

module.exports = QuizGenerator;