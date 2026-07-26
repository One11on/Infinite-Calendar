import React from 'react';
import './LoadingIndicator.css';

export default function LoadingIndicator({ isLoading }) {
  if (!isLoading) return null;
  
  return (
    <div className="loading-indicator visible">
      <span className="spinner"></span>
      Loading more years...
    </div>
  );
}