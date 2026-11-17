import React, { useState, useRef, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  X,
  CalendarDays,
  CheckCheck,
  LogOut,
  Settings as SettingsIcon,
  User as UserIcon,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    user,
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    searchQuery,
    setSearchQuery,
    logout
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifRef = useRef(null);
  const userMenuRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute page title based on path
  const getPageInfo = () => {
    const path = location.pathname;
    if (path === '/' || path === '/dashboard') return { title: 'Academic Dashboard', subtitle: 'Overview & key metrics' };
    if (path === '/attendance') return { title: 'Attendance Management', subtitle: 'Track subject percentages & logs' };
    if (path === '/tasks') return { title: 'Task Management', subtitle: 'Academic to-dos & Kanban board' };
    if (path.startsWith('/projects/')) return { title: 'Project Workspace', subtitle: 'Team collaboration & tasks' };
    if (path === '/projects') return { title: 'Project Collaboration', subtitle: 'Active research & course projects' };
    if (path === '/calendar') return { title: 'Academic Calendar', subtitle: 'Assignments, exams & milestone dates' };
    if (path === '/notifications') return { title: 'Notifications & Alerts', subtitle: 'Reminders & activity feed' };
    if (path === '/settings') return { title: 'Account Settings', subtitle: 'Profile & preferences' };
    return { title: 'Scholar Hub', subtitle: 'Student Dashboard' };
  };

  const pageInfo = getPageInfo();

  // Current formatted date
  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  }).format(new Date());

  const handleLogout = () => {
    setShowUserMenu(false);
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      {/* Left: Title & Date */}
      <div className="navbar-left">
        <div className="navbar-page-info">
          <h2 className="navbar-page-title">{pageInfo.title}</h2>
          <span className="navbar-date">
            <CalendarDays size={13} />
            {todayFormatted} • {pageInfo.subtitle}
          </span>
        </div>
      </div>

      {/* Middle: Universal Search */}
      <div className="navbar-search">
        <Search size={16} className="search-icon" />
        <input
          type="text"
          placeholder="Search tasks, projects, subjects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            className="search-clear-btn"
            onClick={() => setSearchQuery('')}
            title="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Right: Notification Dropdown & Profile */}
      <div className="navbar-right">
        {/* Notifications Icon Button */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button
            className="notification-bell-btn"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            title="Notifications"
            aria-label="View notifications"
          >
            <Bell size={18} />
            {unreadNotificationsCount > 0 && (
              <span className="notification-badge-dot" />
            )}
          </button>

          {showNotifications && (
            <div className="notifications-dropdown">
              <div className="dropdown-header">
                <h4>Notifications ({unreadNotificationsCount} unread)</h4>
                {unreadNotificationsCount > 0 && (
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={markAllNotificationsAsRead}
                    style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}
                  >
                    <CheckCheck size={12} /> Mark all read
                  </button>
                )}
              </div>

              <div className="dropdown-list">
                {notifications.slice(0, 4).map((notif) => (
                  <Link
                    key={notif.id}
                    to={notif.link || '/notifications'}
                    className={`dropdown-item ${!notif.read ? 'unread' : ''}`}
                    onClick={() => {
                      markNotificationAsRead(notif.id);
                      setShowNotifications(false);
                    }}
                  >
                    <div className="dropdown-item-title">{notif.title}</div>
                    <div className="dropdown-item-desc">{notif.message}</div>
                    <div className="dropdown-item-time">{notif.timestamp}</div>
                  </Link>
                ))}
              </div>

              <div className="dropdown-footer">
                <Link
                  to="/notifications"
                  onClick={() => setShowNotifications(false)}
                >
                  View all notifications →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown Pill */}
        <div ref={userMenuRef} style={{ position: 'relative' }}>
          <button
            type="button"
            className="user-dropdown-trigger"
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            title="Account Menu"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="user-dropdown-avatar"
            />
            <div className="user-dropdown-text">
              <span className="user-dropdown-name">{user.name}</span>
              <span className="user-dropdown-role">{user.semester || user.department}</span>
            </div>
            <ChevronDown size={14} color="var(--text-muted)" />
          </button>

          {showUserMenu && (
            <div className="user-menu-dropdown">
              <div className="user-menu-header">
                <span className="user-menu-name">{user.name}</span>
                <span className="user-menu-email">{user.email}</span>
                <span className="user-menu-department">
                  {user.department} • {user.studentId}
                </span>
              </div>

              <div className="user-menu-items">
                <Link
                  to="/settings"
                  className="user-menu-btn"
                  onClick={() => setShowUserMenu(false)}
                >
                  <SettingsIcon size={15} />
                  <span>Account Settings</span>
                </Link>

                <button
                  type="button"
                  className="user-menu-btn logout"
                  onClick={handleLogout}
                >
                  <LogOut size={15} />
                  <span>Sign Out / Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
