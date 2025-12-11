#!/bin/bash

# Startup script for Unix/Mac - Runs both backend and frontend

echo "Starting Coding Interview Platform..."
echo ""
echo "Installing dependencies..."
npm run install:all

if [ $? -ne 0 ]; then
    echo "Error installing dependencies"
    exit 1
fi

echo ""
echo "Starting services..."
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:5173"
echo ""
npm run dev
