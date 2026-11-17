import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  LayoutDashboard,
  CheckCircle2,
  CheckSquare,
  FolderGit2,
  Calendar,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import '../styles/Sidebar.css';

const Sidebar = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const { user, unreadNotificationsCount, stats, logout } = useApp();

  const navItems = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      to: '/attendance',
      label: 'Attendance',
      icon: CheckCircle2,
      badge: `${stats.overallAttendance}%`
    },
    {
      to: '/tasks',
      label: 'Tasks',
      icon: CheckSquare,
      badge: stats.pendingTasks > 0 ? stats.pendingTasks : null
    },
    {
      to: '/projects',
      label: 'Projects',
      icon: FolderGit2,
      badge: stats.activeProjects > 0 ? stats.activeProjects : null
    },
    {
      to: '/calendar',
      label: 'Calendar',
      icon: Calendar,
      badge: null
    },
    {
      to: '/notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : null,
      isAlert: unreadNotificationsCount > 0
    },
    {
      to: '/settings',
      label: 'Settings',
      icon: Settings,
      badge: null
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-header">
        <NavLink to="/dashboard" className="sidebar-logo" title="Scholar Hub">
          <div className="logo-icon-wrapper">
            <GraduationCap size={22} />
          </div>
          {!collapsed && (
            <div className="logo-text">
              <span className="logo-title">
                Scholar<span>Hub</span>
              </span>
              <span className="logo-tag">Academic Suite</span>
            </div>
          )}
        </NavLink>
        <button
          className="collapse-toggle-btn"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label="Toggle sidebar collapse"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nav Menu */}
      <nav className="sidebar-nav">
        {!collapsed && <div className="nav-section-title">Navigation</div>}
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <span className="link-icon">
                <Icon size={19} />
              </span>
              {!collapsed && <span className="link-label">{item.label}</span>}
              {!collapsed && item.badge !== null && (
                <span className={`link-badge ${item.isAlert ? 'alert' : ''}`}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Profile Section at Bottom */}
      <div className="sidebar-footer">
        <div className="sidebar-footer-row">
          <NavLink
            to="/settings"
            className="user-profile-card"
            style={{ flex: 1, minWidth: 0 }}
            title="Account Settings"
          >
            <div className="avatar-wrapper">
              <img
                src={user.avatar}
                alt={user.name}
                className="user-avatar"
              />
              <span className="online-status-dot" />
            </div>
            {!collapsed && (
              <div className="user-info">
                <span className="user-name">{user.name}</span>
                <span className="user-role">{user.department}</span>
              </div>
            )}
          </NavLink>

          {!collapsed && (
            <button
              type="button"
              className="sidebar-logout-btn"
              onClick={handleLogout}
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
