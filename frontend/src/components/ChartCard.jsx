import React from 'react';
import '../styles/Components.css';

const ChartCard = ({ title, subtitle, action, children }) => {
  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <div className="chart-title-group">
          <h3>{title}</h3>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {action && <div className="chart-action">{action}</div>}
      </div>
      <div className="chart-content">{children}</div>
    </div>
  );
};

export default ChartCard;
