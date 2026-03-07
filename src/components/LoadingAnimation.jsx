import React from 'react';
import './LoadingAnimation.css';

const LoadingAnimation = () => {
  return (
    <div className="card">
      <div className="loader">
        <p>loading</p>
        <div className="words">
          <span className="word">buttons</span>
          <span className="word">forms</span>
          <span className="word">switches</span>
          <span className="word">cards</span>
          <span className="word">buttons</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimation;  // Make sure this line exists