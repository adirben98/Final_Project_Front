import React from 'react';
import './background.css'

interface BackgroundProps {
  children: React.ReactNode;
}

const Background: React.FC<BackgroundProps> = ({ children }) => {
  return (
    <div className="background">
      <div className="content">
        {children}
      </div>
    </div>
  );
};

export default Background;
