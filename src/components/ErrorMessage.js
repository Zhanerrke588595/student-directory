import React from 'react';

const ErrorMessage = ({ message }) => {
  return (
    <div className="error-container">
      {message}
    </div>
  );
};

export default ErrorMessage;