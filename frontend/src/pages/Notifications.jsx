import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  Trash2,
  Clock,
  AlertTriangle,
  FolderGit2,
  CheckCircle2,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import '../styles/Notifications.css';

const Notifications = () => {
  const {
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearAllNotifications
  } = useApp();

  const [activeTab, setActiveTab] = useState('All'); // 'All' | 'Unread' | 'deadline' | 'attendance' | 'project' | 'task'

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Unread') return !n.read;
    return n.category?.toLowerCase() === activeTab.toLowerCase();
  });

  const getNotifIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'attendance': return <AlertTriangle size={20} />;
      case 'deadline': return <Clock size={20} />;
      case 'project': return <FolderGit2 size={20} />;
      case 'task': return <CheckCircle2 size={20} />;
      default: return <Bell size={20} />;
    }
  };

  return (
    <div className="notifications-page-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>Notifications & Reminders</h1>
          <p>
            Stay notified about impending deadlines, low attendance alerts, and project discussions.
          </p>
        </div>
        <div className="page-actions">
          {unreadNotificationsCount > 0 && (
            <button
              className="btn btn-secondary"
              onClick={markAllNotificationsAsRead}
            >
              <CheckCheck size={16} /> Mark all as read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              className="btn btn-danger-outline"
              onClick={clearAllNotifications}
            >
              <Trash2 size={16} /> Clear inbox
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="notifications-filter-card">
        <div className="notif-category-tabs">
          {[
            { id: 'All', label: `All (${notifications.length})` },
            { id: 'Unread', label: `Unread (${unreadNotificationsCount})` },
            { id: 'attendance', label: 'Attendance' },
            { id: 'deadline', label: 'Deadlines' },
            { id: 'project', label: 'Projects' },
            { id: 'task', label: 'Tasks' }
          ].map(tab => (
            <button
              key={tab.id}
              className={`notif-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notification Items Feed */}
      <div className="notif-feed">
        {filteredNotifications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Bell size={26} />
            </div>
            <h3>No notifications here</h3>
            <p>You're all caught up! You'll receive alerts as new deadlines approach.</p>
          </div>
        ) : (
          filteredNotifications.map(notif => (
            <div
              key={notif.id}
              className={`notif-card ${!notif.read ? 'unread' : ''} ${notif.category}`}
            >
              <div className={`notif-icon-circle ${notif.category}`}>
                {getNotifIcon(notif.category)}
              </div>

              <div className="notif-main-content">
                <div className="notif-title-row">
                  <h4 className="notif-title">{notif.title}</h4>
                  <span className="notif-timestamp">{notif.timestamp}</span>
                </div>

                <p className="notif-message-text">{notif.message}</p>

                <div className="notif-actions-bottom">
                  {notif.link && (
                    <Link
                      to={notif.link}
                      className="btn btn-sm btn-secondary"
                      onClick={() => markNotificationAsRead(notif.id)}
                      style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                    >
                      View Details <ExternalLink size={12} />
                    </Link>
                  )}
                  {!notif.read && (
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => markNotificationAsRead(notif.id)}
                      style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
