// src/components/Header.jsx
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import './Header.css';

export default function Header({ 
  viewType, setViewType, focusedDate, goToToday, onAddEvent, onHomeClick
}) {
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [theme, setTheme] = useState('dark');

  // Update the clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Apply theme to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const isYearView = viewType === 'year';

  const getHeaderDate = () => {
    if (viewType === 'year') return format(focusedDate, 'MMMM yyyy');
    else if (viewType === 'month') return format(focusedDate, 'MMMM yyyy');
    else if (viewType === 'today') {
      const end = new Date(focusedDate); 
      end.setDate(focusedDate.getDate() + 6);
      return `${format(focusedDate, 'MMM d')} – ${format(end, 'MMM d, yyyy')}`;
    }
    return '';
  };

  const handleViewChange = (newView) => {
    if (newView === viewType) return;
    setViewType(newView);
  };

  return (
    <header className="app-header">
      {/* ===== LEFT: HOME BUTTON ===== */}
      <div className="header-left">
        <button className="glass-btn small-icon" onClick={onHomeClick} title="Go Home">⌂</button>
      </div>

      {/* ===== CENTER: DYNAMIC LAYOUT ===== */}
      <div className="header-center-wrapper">
        
        {/* HOME VIEW: SEPARATE CAPSULES (Gap perfectly centered) */}
        <div className={`home-capsule ${isYearView ? '' : 'hidden'}`}>
          <span className="header-date-title visible">{getHeaderDate()}</span>
        </div>
        <div className={`home-capsule ${isYearView ? '' : 'hidden'}`}>
          <div className="time-capsule">
            <span className="clock-hours-minutes">{format(currentTime, 'hh:mm')}</span>
            <span className="clock-seconds">{format(currentTime, 'ss')}</span>
          </div>
        </div>

        {/* DETAIL VIEW: SINGLE CONTINUOUS PILL */}
        <div className={`header-center-line ${isYearView ? 'hidden' : ''}`}>
          <span className="header-date-title visible">{getHeaderDate()}</span>
          <div className={`segmented-controls visible`}>
            <button className={`segmented-btn ${viewType === 'year' ? 'active' : ''}`} onClick={() => handleViewChange('year')}>Year</button>
            <button className={`segmented-btn ${viewType === 'month' ? 'active' : ''}`} onClick={() => handleViewChange('month')}>Month</button>
            <button className={`segmented-btn ${viewType === 'today' ? 'active' : ''}`} onClick={() => handleViewChange('today')}>Now</button>
          </div>
          <div className="time-capsule">
            <span className="clock-hours-minutes">{format(currentTime, 'hh:mm')}</span>
            <span className="clock-seconds">{format(currentTime, 'ss')}</span>
          </div>
        </div>

      </div>

      {/* ===== RIGHT: ACTIONS ===== */}
      <div className="header-right">
        {/* Today Button (Always Visible) */}
        <button className="glass-btn" onClick={goToToday}>Today</button>

        {/* + Button (Hidden in Year View) */}
        <button className={`action-btn add-btn ${isYearView ? 'hidden' : 'visible'}`} onClick={onAddEvent}>+</button>

        {/* ... Button (Hidden in Year View) */}
        <button className={`action-btn menu-btn ${isYearView ? 'hidden' : 'visible'}`}>⋮</button>

        {/* Theme Toggle (Hidden in Year View) */}
        <button className={`theme-toggle ${isYearView ? 'hidden' : 'visible'}`} onClick={toggleTheme} title="Toggle Day/Night Theme">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
}