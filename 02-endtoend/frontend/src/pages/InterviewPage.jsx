import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { interviewService, problemService } from '../services/api.js';
import { useAuthStore, useInterviewStore, useEditorStore } from '../store/index.js';
import CodeEditor from '../components/CodeEditor.jsx';
import OutputPanel from '../components/OutputPanel.jsx';
import ChatPanel from '../components/ChatPanel.jsx';
import ProblemStatement from '../components/ProblemStatement.jsx';
import { joinInterview, leaveInterview, onCodeUpdate } from '../services/websocket.js';

export const InterviewPage = () => {
  const { interviewId } = useParams();
  const { user } = useAuthStore();
  const { currentInterview, setCurrentInterview } = useInterviewStore();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadInterview = async () => {
      try {
        const interviewRes = await interviewService.getInterview(interviewId);
        setCurrentInterview(interviewRes.data.interview);

        const problemId = interviewRes.data.interview.problem_id;
        const problemRes = await problemService.getProblem(problemId);
        setProblem(problemRes.data.problem);

        // Join WebSocket room (non-critical, don't block UI)
        try {
          joinInterview(interviewId, user.id);
          onCodeUpdate((data) => {
            useEditorStore.setState({ code: data.code });
          });
        } catch (wsErr) {
          console.warn('WebSocket connection failed (non-critical):', wsErr);
        }
      } catch (err) {
        setError('Failed to load interview');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadInterview();

    return () => {
      try {
        leaveInterview(interviewId, user.id);
      } catch (err) {
        console.warn('Error leaving interview:', err);
      }
    };
  }, [interviewId, user?.id, setCurrentInterview]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-xl font-semibold">Loading interview...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-gray-800 text-white p-4">
        <h2 className="text-2xl font-bold">Interview Session</h2>
        {currentInterview && (
          <p className="text-gray-400">
            Status: <span className="font-semibold capitalize">{currentInterview.status}</span>
          </p>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden gap-4 p-4">
        {/* Problem Statement */}
        <div className="w-1/4 bg-white rounded-lg shadow-md overflow-hidden">
          <ProblemStatement problem={problem} />
        </div>

        {/* Code Editor and Output */}
        <div className="w-1/2 flex flex-col gap-4">
          <div className="flex-1 bg-white rounded-lg shadow-md overflow-hidden">
            <CodeEditor height="100%" />
          </div>
          <div className="flex-1 bg-white rounded-lg shadow-md overflow-hidden">
            <OutputPanel interviewId={interviewId} />
          </div>
        </div>

        {/* Chat Panel */}
        <div className="w-1/4 bg-white rounded-lg shadow-md overflow-hidden">
          <ChatPanel interviewId={interviewId} currentUserId={user?.id} />
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;
