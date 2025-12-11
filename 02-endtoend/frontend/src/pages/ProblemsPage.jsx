import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { problemService, interviewService } from '../services/api.js';

export const ProblemsPage = () => {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [page, setPage] = useState(1);
  const [practicing, setPracticing] = useState(null);

  useEffect(() => {
    const loadProblems = async () => {
      setLoading(true);
      try {
        const res = await problemService.getProblems(page, 10, difficulty || null);
        setProblems(res.data.problems);
      } catch (err) {
        setError('Failed to load problems');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProblems();
  }, [page, difficulty]);

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      hard: 'bg-red-100 text-red-800',
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl font-semibold">Loading problems...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Coding Problems</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Filter */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Difficulty
        </label>
        <select
          value={difficulty}
          onChange={(e) => {
            setDifficulty(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      {/* Problems Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {problems.map((problem) => (
          <div
            key={problem.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-2">{problem.title}</h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{problem.description}</p>

            <div className="flex items-center gap-2 mb-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(
                  problem.difficulty
                )}`}
              >
                {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
              </span>
              {problem.tags && problem.tags.length > 0 && (
                <span className="text-xs text-gray-500">+{problem.tags.length} tags</span>
              )}
            </div>

            <button
              onClick={() => {
                setPracticing(problem.id);
                interviewService.createInterview({
                  problem_id: problem.id,
                  title: `Practice: ${problem.title}`
                })
                  .then((res) => {
                    navigate(`/interview/${res.data.interview.id}`);
                  })
                  .catch((err) => {
                    alert('Failed to start interview: ' + err.message);
                    setPracticing(null);
                  });
              }}
              disabled={practicing === problem.id}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {practicing === problem.id ? 'Starting...' : 'Practice'}
            </button>
          </div>
        ))}
      </div>

      {problems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No problems found</p>
        </div>
      )}
    </div>
  );
};

export default ProblemsPage;
