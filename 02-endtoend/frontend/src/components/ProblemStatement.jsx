import React from 'react';

export const ProblemStatement = ({ problem }) => {
  if (!problem) {
    return (
      <div className="p-4 text-gray-500">
        <p>No problem selected</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{problem.title}</h2>
          <div className="mt-2 flex gap-2">
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                problem.difficulty === 'easy'
                  ? 'bg-green-100 text-green-800'
                  : problem.difficulty === 'medium'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
            </span>
            {problem.tags?.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{problem.description}</p>
        </div>

        {problem.sampleInput && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Sample Input</h3>
            <pre className="bg-gray-100 p-3 rounded-md overflow-x-auto">
              {problem.sampleInput}
            </pre>
          </div>
        )}

        {problem.sampleOutput && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Sample Output</h3>
            <pre className="bg-gray-100 p-3 rounded-md overflow-x-auto">
              {problem.sampleOutput}
            </pre>
          </div>
        )}

        {problem.testCases && problem.testCases.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Test Cases</h3>
            <div className="space-y-2">
              {problem.testCases.map((testCase, idx) => (
                <div key={idx} className="bg-gray-50 p-3 rounded-md border border-gray-200">
                  <p className="text-sm font-semibold text-gray-700">Test Case {idx + 1}</p>
                  <p className="text-sm text-gray-600">Input: {testCase.input}</p>
                  <p className="text-sm text-gray-600">Expected Output: {testCase.output}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemStatement;
