import React from 'react';
import '../styles/Components.css';

const StatCard = ({
  title,
  value,
  unit,
  icon: Icon,
  variant = 'blue',
  trend,
  trendType = 'positive',
  footerText
}) => {
  return (
    <div className={`stat-card ${variant}`}>
      <div className="stat-card-header">
        <span className="stat-card-title">{title}</span>
        {Icon && (
          <div className="stat-card-icon-wrapper">
            <Icon size={20} />
          </div>
        )}
      </div>

      <div className="stat-card-body">
        <span className="stat-card-value">{value}</span>
        {unit && <span className="stat-card-unit">{unit}</span>}
      </div>

      <div className="stat-card-footer">
        {trend ? (
          <span className={`stat-card-trend ${trendType}`}>
            {trend}
          </span>
        ) : (
          <span>Target: 75%+</span>
        )}
        {footerText && <span>{footerText}</span>}
      </div>
    </div>
  );
};

export default StatCard;
