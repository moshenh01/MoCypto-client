import React from 'react';
import './DashboardSkeleton.css';

function DashboardSkeleton() {
  return (
    <div className="dashboard-container">
      <div className="container">
        <div className="skeleton-header">
          <div className="skeleton-avatar"></div>
          <div className="skeleton-text-group">
            <div className="skeleton-text skeleton-text-title"></div>
            <div className="skeleton-text skeleton-text-subtitle"></div>
          </div>
          <div className="skeleton-buttons">
            <div className="skeleton-button"></div>
            <div className="skeleton-button"></div>
          </div>
        </div>
        
        <div className="dashboard-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-card-header"></div>
              <div className="skeleton-card-content">
                <div className="skeleton-line"></div>
                <div className="skeleton-line"></div>
                <div className="skeleton-line skeleton-line-short"></div>
                <div className="skeleton-buttons-row">
                  <div className="skeleton-small-button"></div>
                  <div className="skeleton-small-button"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardSkeleton;

