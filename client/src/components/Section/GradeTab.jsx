import React from 'react';

const GradeTab = ({ grade, feedback, gradedAt, graderName }) => {
  const showContent = grade || feedback || gradedAt || graderName;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Assignment Grade</h2>

      {showContent ? (
        <div className="p-4 rounded bg-gray-50 border space-y-2">
          {graderName && (
            <p>
              <strong>Graded By:</strong> {graderName}
            </p>
          )}
          {gradedAt && (
            <p>
              <strong>Graded At:</strong> {new Date(gradedAt).toLocaleString()}
            </p>
          )}
          {grade && (
            <p>
              <strong>Grade:</strong> {grade}
            </p>
          )}
          {feedback && (
            <p>
              <strong>Feedback:</strong> {feedback}
            </p>
          )}
        </div>
      ) : (
        <p className="text-gray-500">This assignment has not been graded yet.</p>
      )}
    </div>
  );
};

export default GradeTab;
