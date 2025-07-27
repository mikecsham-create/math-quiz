#!/bin/bash

# Ontario Math Quiz Application Launcher
echo "🧮 Starting Ontario Math Quiz Application..."
echo "📚 Grade 7 & 8 Curriculum-Based Math Practice"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚙️  Creating .env file from example..."
    cp .env.example .env
    echo "✏️  Please edit .env file with your email settings for CSV export functionality"
fi

echo ""
echo "🚀 Starting server..."
echo "📱 Access the application at: http://localhost:3000"
echo "🛑 Press Ctrl+C to stop the server"
echo ""

# Start the application
npm start