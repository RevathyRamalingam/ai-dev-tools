import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/index.js';

export const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-4">Online Coding Interview Platform</h1>
          <p className="text-xl mb-8 text-blue-100">
            Real-time collaborative coding interviews with instant feedback
          </p>
          {!isAuthenticated && (
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate('/register')}
                className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition"
              >
                Get Started
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-3 bg-blue-500 border-2 border-white rounded-lg hover:bg-blue-700 transition"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4 text-blue-600">Real-time Collaboration</h3>
              <p className="text-gray-600">
                Share code in real-time with your interviewer. See changes instantly as they happen.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4 text-blue-600">Multiple Languages</h3>
              <p className="text-gray-600">
                Write code in Python, JavaScript, Java, C++, or C. Execute and test instantly.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4 text-blue-600">Live Chat</h3>
              <p className="text-gray-600">
                Communicate with your interviewer through the built-in chat during the session.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4 text-blue-600">Code Execution</h3>
              <p className="text-gray-600">
                Run your code with custom test inputs and see output in real-time.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4 text-blue-600">Problem Library</h3>
              <p className="text-gray-600">
                Access a library of coding problems ranging from easy to hard difficulty levels.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4 text-blue-600">Interview Tracking</h3>
              <p className="text-gray-600">
                Track your interviews, review solutions, and get feedback from interviewers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {isAuthenticated ? (
        <section className="bg-blue-600 text-white py-16">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Start an Interview?</h2>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition"
            >
              Go to Dashboard
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
};

export default HomePage;
