import React, { useState } from 'react';
import {
  User,
  Bell,
  Palette,
  Shield,
  Save,
  CheckCircle2,
  Sliders,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import '../styles/Settings.css';

const avatarOptions = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80"
];

const Settings = () => {
  const { user, updateUserProfile } = useApp();

  const [activeSection, setActiveSection] = useState('profile'); // 'profile' | 'academic' | 'preferences'

  const [formData, setFormData] = useState({
    name: user.name || 'Alex Morgan',
    email: user.email || 'alex.morgan@scholarhub.edu',
    studentId: user.studentId || 'CS-2024-0492',
    department: user.department || 'Computer Science & Engineering',
    semester: user.semester || '5th Semester',
    university: user.university || 'Metropolitan Institute of Technology',
    bio: user.bio || '',
    avatar: user.avatar || avatarOptions[0],
    targetAttendance: user.targetAttendance || 75,
    notificationsEnabled: user.notificationsEnabled !== undefined ? user.notificationsEnabled : true,
    emailAlerts: user.emailAlerts !== undefined ? user.emailAlerts : true
  });

  const handleSave = (e) => {
    e.preventDefault();
    updateUserProfile(formData);
  };

  return (
    <div className="settings-container">
      {/* Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>Account & Academic Settings</h1>
          <p>Manage your profile, academic attendance thresholds, and system preferences.</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={handleSave}>
            <Save size={16} /> Save Changes
          </button>
        </div>
      </div>

      <div className="settings-layout">
        {/* Navigation Sidebar */}
        <div className="settings-nav-card">
          <button
            className={`settings-nav-item ${activeSection === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveSection('profile')}
          >
            <User size={16} /> Profile Details
          </button>
          <button
            className={`settings-nav-item ${activeSection === 'academic' ? 'active' : ''}`}
            onClick={() => setActiveSection('academic')}
          >
            <Sliders size={16} /> Academic Criteria
          </button>
          <button
            className={`settings-nav-item ${activeSection === 'preferences' ? 'active' : ''}`}
            onClick={() => setActiveSection('preferences')}
          >
            <Palette size={16} /> UI & Notifications
          </button>
        </div>

        {/* Content Card */}
        <div className="settings-content-card">
          {activeSection === 'profile' && (
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h3 className="settings-section-title">Personal Profile Information</h3>

              {/* Avatar Selector */}
              <div className="profile-photo-row">
                <img
                  src={formData.avatar}
                  alt={formData.name}
                  className="settings-avatar-preview"
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label className="form-label">Choose Avatar Preset</label>
                  <div className="avatar-selector-grid">
                    {avatarOptions.map((opt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`avatar-option-btn ${formData.avatar === opt ? 'selected' : ''}`}
                        onClick={() => setFormData({ ...formData, avatar: opt })}
                      >
                        <img src={opt} alt={`Preset ${idx + 1}`} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Student ID</label>
                  <input
                    type="text"
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Current Semester / Term</label>
                  <input
                    type="text"
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Academic Department</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">University / Institute</label>
                  <input
                    type="text"
                    value={formData.university}
                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Bio / Academic Interests</label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Share your research interests, tech stack, or study goals..."
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                <Save size={15} /> Save Profile
              </button>
            </form>
          )}

          {activeSection === 'academic' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h3 className="settings-section-title">Academic & Attendance Targets</h3>

              <div className="preference-toggle-item">
                <div className="toggle-info">
                  <h4>Minimum Attendance Requirement Threshold</h4>
                  <p>Institutes typically enforce 75% or 80% minimum mandatory attendance for exam clearance.</p>
                </div>
                <div style={{ width: '100px' }}>
                  <select
                    value={formData.targetAttendance}
                    onChange={(e) => setFormData({ ...formData, targetAttendance: Number(e.target.value) })}
                  >
                    <option value={70}>70%</option>
                    <option value={75}>75% (Standard)</option>
                    <option value={80}>80%</option>
                    <option value={85}>85%</option>
                  </select>
                </div>
              </div>

              <div className="preference-toggle-item">
                <div className="toggle-info">
                  <h4>Smart Bunk / Safe Absence Calculator</h4>
                  <p>Display real-time calculations of how many classes you can miss safely without dipping below threshold.</p>
                </div>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider" />
                </label>
              </div>

              <button
                type="button"
                className="btn btn-primary"
                style={{ alignSelf: 'flex-start' }}
                onClick={handleSave}
              >
                <Save size={15} /> Save Criteria
              </button>
            </div>
          )}

          {activeSection === 'preferences' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h3 className="settings-section-title">Theme & Notification Preferences</h3>

              <div className="preference-toggle-item">
                <div className="toggle-info">
                  <h4>Theme Style</h4>
                  <p>Light Modern SaaS (Optimized for academic readability and clean contrast).</p>
                </div>
                <span className="badge badge-purple">Modern Light SaaS</span>
              </div>

              <div className="preference-toggle-item">
                <div className="toggle-info">
                  <h4>Push & Browser Notifications</h4>
                  <p>Get notified 24 hours prior to assignment deadlines and upcoming exams.</p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={formData.notificationsEnabled}
                    onChange={(e) => setFormData({ ...formData, notificationsEnabled: e.target.checked })}
                  />
                  <span className="slider" />
                </label>
              </div>

              <div className="preference-toggle-item">
                <div className="toggle-info">
                  <h4>Project Discussion Digest Alerts</h4>
                  <p>Receive notifications when team members post updates or assign deliverables in project workspaces.</p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={formData.emailAlerts}
                    onChange={(e) => setFormData({ ...formData, emailAlerts: e.target.checked })}
                  />
                  <span className="slider" />
                </label>
              </div>

              <button
                type="button"
                className="btn btn-primary"
                style={{ alignSelf: 'flex-start' }}
                onClick={handleSave}
              >
                <Save size={15} /> Save Preferences
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
