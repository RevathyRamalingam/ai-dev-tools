import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { interviewService } from '../services/api.js';
import { useAuthStore, useInterviewStore } from '../store/index.js';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { interviews, setInterviews } = useInterviewStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadInterviews = async () => {
      try {
        const res = await interviewService.getUserInterviews();
        setInterviews(res.data.interviews || res.data);
      } catch (err) {
        setError('Failed to load interviews');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadInterviews();
  }, [setInterviews]);

  const getStatusColor = (status) => {
    const colors = {
      scheduled: 'bg-blue-100 text-blue-800',
      ongoing: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl font-semibold">Loading interviews...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
        <button
          onClick={() => navigate('/problems')}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Browse Problems
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Interviews</h2>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {interviews.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">No interviews scheduled yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="text-left px-6 py-3 font-semibold text-gray-700">
                    Problem
                  </th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-700">
                    Scheduled
                  </th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {interviews.map((interview) => (
                  <tr key={interview.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-700">
                      {interview.problem?.title || 'Problem'}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                          interview.status
                        )}`}
                      >
                        {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {new Date(interview.scheduledAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      {interview.status === 'scheduled' && (
                        <button
                          onClick={() => navigate(`/interview/${interview.id}`)}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition text-sm"
                        >
                          Join
                        </button>
                      )}
                      {interview.status === 'ongoing' && (
                        <button
                          onClick={() => navigate(`/interview/${interview.id}`)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm"
                        >
                          Continue
                        </button>
                      )}
                      {interview.status === 'completed' && (
                        <button
                          onClick={() => navigate(`/interview/${interview.id}`)}
                          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition text-sm"
                        >
                          Review
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
