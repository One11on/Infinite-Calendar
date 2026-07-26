// src/components/AgendaView.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { 
  format, addDays, subDays, startOfWeek, endOfWeek, 
  eachDayOfInterval, isSameDay, isToday, getDay, 
  getHours, getMinutes, getDaysInMonth, startOfMonth, endOfMonth
} from 'date-fns';
import './AgendaView.css';

export default function AgendaView({ 
  selectedDate, 
  events = {}, 
  holidays = {},
  onDayClick,
  onMonthClick,
  onAddEvent,
  onRemoveEvent,
  notes = {},
  onAddNote,
  onRemoveNote
}) {
  const [centerDate, setCenterDate] = useState(selectedDate || new Date());
  const [currentTimePos, setCurrentTimePos] = useState(null);
  const [slideDirection, setSlideDirection] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [quickEventTitle, setQuickEventTitle] = useState('');
  const [showQuickEventInput, setShowQuickEventInput] = useState(false);
  const [selectedDateForAction, setSelectedDateForAction] = useState(null);

  useEffect(() => {
    setCenterDate(selectedDate || new Date());
  }, [selectedDate]);

  // Red line timer
  useEffect(() => {
    const updateTimeLine = () => {
      const now = new Date();
      const minutesSinceMidnight = getHours(now) * 60 + getMinutes(now);
      const totalMinutes = 24 * 60;
      setCurrentTimePos((minutesSinceMidnight / totalMinutes) * 100);
    };
    updateTimeLine();
    const timer = setInterval(updateTimeLine, 60000);
    return () => clearInterval(timer);
  }, []);

  // ===== LEFT SIDEBAR: MINI MONTH (COLORIZED) =====
  const monthStart = startOfMonth(centerDate);
  const monthEnd = endOfMonth(centerDate);
  const daysInMonth = getDaysInMonth(monthStart);
  const startDayOfWeek = getDay(monthStart);
  const paddingDays = Array.from({ length: startDayOfWeek });
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // ===== RIGHT GRID: 7 DAYS =====
  const weekStart = startOfWeek(centerDate, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Time slots: 6 AM to 10 PM
  const timeSlots = [];
  for (let i = 6; i <= 22; i++) {
    timeSlots.push(`${i > 12 ? i - 12 : i} ${i >= 12 ? 'PM' : 'AM'}`);
  }

  // Navigation with Sliding Effect
  const goPrevious = useCallback(() => {
    setSlideDirection('slide-right');
    setCenterDate(prev => subDays(prev, 7));
    setTimeout(() => setSlideDirection(''), 300);
  }, []);

  const goNext = useCallback(() => {
    setSlideDirection('slide-left');
    setCenterDate(prev => addDays(prev, 7));
    setTimeout(() => setSlideDirection(''), 300);
  }, []);

  const goToday = useCallback(() => {
    setSlideDirection('slide-left');
    setCenterDate(new Date());
    setTimeout(() => setSlideDirection(''), 300);
  }, []);

  // Handle date click from mini calendar
  const handleDateClick = (dateObj) => {
    setCenterDate(dateObj);
    setSelectedDateForAction(dateObj);
    if (onDayClick) {
      onDayClick(format(dateObj, 'yyyy-MM-dd'));
    }
  };

  // Handle adding a note
  const handleAddNote = () => {
    if (noteText.trim() && selectedDateForAction) {
      const dateKey = format(selectedDateForAction, 'yyyy-MM-dd');
      if (onAddNote) {
        onAddNote(dateKey, {
          text: noteText,
          timestamp: new Date().toISOString()
        });
      }
      setNoteText('');
      setShowNoteInput(false);
    }
  };

  // Handle adding a quick event
  const handleAddQuickEvent = () => {
    if (quickEventTitle.trim() && selectedDateForAction) {
      const dateKey = format(selectedDateForAction, 'yyyy-MM-dd');
      if (onAddEvent) {
        onAddEvent(dateKey, {
          title: quickEventTitle,
          color: '#8b8bff',
          timestamp: new Date().toISOString()
        });
      }
      setQuickEventTitle('');
      setShowQuickEventInput(false);
    }
  };

  // Get notes for selected date
  const getNotesForDate = (dateObj) => {
    const dateKey = format(dateObj, 'yyyy-MM-dd');
    return notes[dateKey] || [];
  };

  return (
    <div className="agenda-view">
      
      {/* ===== LEFT SIDEBAR ===== */}
      <div className="agenda-sidebar">
        <div className="mini-month-header">
          <button className="mini-nav-btn" onClick={() => setCenterDate(subDays(centerDate, 30))}>◀</button>
          <span className="mini-month-title">{format(centerDate, 'MMMM yyyy')}</span>
          <button className="mini-nav-btn" onClick={() => setCenterDate(addDays(centerDate, 30))}>▶</button>
        </div>

        <div className="mini-month-grid">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
            <div key={d} className="mini-weekday">{d}</div>
          ))}
          {paddingDays.map((_, i) => <div key={`p-${i}`} className="mini-day empty"></div>)}
          {daysArray.map(day => {
            const dateObj = new Date(centerDate.getFullYear(), centerDate.getMonth(), day);
            const isSelected = isSameDay(dateObj, centerDate);
            const isTodayFlag = isToday(dateObj);
            const dayOfWeek = getDay(dateObj);
            const dateKey = format(dateObj, 'yyyy-MM-dd');
            const hasNotes = notes[dateKey] && notes[dateKey].length > 0;
            const hasEvents = events[dateKey] && events[dateKey].length > 0;
            
            let dayClass = 'mini-day';
            if (isTodayFlag) dayClass += ' today-mini';
            if (isSelected) dayClass += ' selected-mini';
            if (dayOfWeek === 0) dayClass += ' mini-sunday';
            else if (dayOfWeek === 6) dayClass += ' mini-saturday';
            else if (dayOfWeek === 5) dayClass += ' mini-friday';
            if (hasNotes) dayClass += ' has-note';
            if (hasEvents) dayClass += ' has-event';

            return (
              <div 
                key={day} 
                className={dayClass}
                onClick={() => handleDateClick(dateObj)}
              >
                {day}
                {hasNotes && <span className="mini-dot note-dot">•</span>}
                {hasEvents && !hasNotes && <span className="mini-dot event-dot">•</span>}
              </div>
            );
          })}
        </div>

        {/* ===== NOTES & QUICK EVENT SECTION ===== */}
        <div className="mini-actions">
          <div className="mini-actions-header">
            <span className="mini-actions-title">
              {selectedDateForAction ? format(selectedDateForAction, 'MMM d') : 'Select a date'}
            </span>
          </div>

          {/* Notes Section */}
          <div className="mini-notes-section">
            <div className="notes-header">
              <span className="notes-label">📝 Notes</span>
              <button 
                className="mini-action-btn"
                onClick={() => {
                  setShowNoteInput(!showNoteInput);
                  setShowQuickEventInput(false);
                  if (!selectedDateForAction) setSelectedDateForAction(centerDate);
                }}
              >
                +
              </button>
            </div>
            
            {showNoteInput && (
              <div className="mini-input-container">
                <textarea
                  className="mini-textarea"
                  placeholder="Write a note..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  rows="2"
                />
                <div className="mini-input-actions">
                  <button className="mini-save-btn" onClick={handleAddNote}>Save</button>
                  <button className="mini-cancel-btn" onClick={() => {
                    setShowNoteInput(false);
                    setNoteText('');
                  }}>Cancel</button>
                </div>
              </div>
            )}

            <div className="notes-list">
              {selectedDateForAction && getNotesForDate(selectedDateForAction).map((note, index) => (
                <div key={index} className="mini-note-item">
                  <span className="mini-note-text">{note.text}</span>
                  <button 
                    className="mini-delete-btn"
                    onClick={() => {
                      const dateKey = format(selectedDateForAction, 'yyyy-MM-dd');
                      if (onRemoveNote) onRemoveNote(dateKey, index);
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Event Section */}
          <div className="mini-event-section">
            <div className="event-header">
              <span className="event-label">⚡ Quick Event</span>
              <button 
                className="mini-action-btn"
                onClick={() => {
                  setShowQuickEventInput(!showQuickEventInput);
                  setShowNoteInput(false);
                  if (!selectedDateForAction) setSelectedDateForAction(centerDate);
                }}
              >
                +
              </button>
            </div>
            
            {showQuickEventInput && (
              <div className="mini-input-container">
                <input
                  className="mini-input"
                  type="text"
                  placeholder="Event title..."
                  value={quickEventTitle}
                  onChange={(e) => setQuickEventTitle(e.target.value)}
                />
                <div className="mini-input-actions">
                  <button className="mini-save-btn" onClick={handleAddQuickEvent}>Add</button>
                  <button className="mini-cancel-btn" onClick={() => {
                    setShowQuickEventInput(false);
                    setQuickEventTitle('');
                  }}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== RIGHT GRID ===== */}
      <div className="agenda-grid-container">
        
        {/* SLIDING WRAPPER */}
        <div className={`agenda-slide-wrapper ${slideDirection}`}>
          
          {/* Grid Header */}
          <div className="agenda-header">
            <div className="time-col-header arrow-col-header">
              <button className="big-nav-arrow prev-arrow" onClick={goPrevious}>◀</button>
            </div>

            {weekDays.map((day, idx) => (
              <div 
                key={idx} 
                className={`agenda-day-header ${isToday(day) ? 'today-header' : ''}`}
                onClick={() => onDayClick && onDayClick(format(day, 'yyyy-MM-dd'))}
              >
                <span className="agenda-day-name">{format(day, 'EEE')}</span>
                <span className="agenda-day-number">{format(day, 'd')}</span>
              </div>
            ))}

            <div className="arrow-col-header">
              <button className="big-nav-arrow next-arrow" onClick={goNext}>▶</button>
            </div>
          </div>

          {/* Grid Body */}
          <div className="agenda-scroll-area">
            <div className="agenda-grid">
              <div className="agenda-time-col">
                {timeSlots.map((time, i) => (
                  <div key={i} className="agenda-time-label">{time}</div>
                ))}
              </div>

              {weekDays.map((day, dIndex) => {
                const dateKey = format(day, 'yyyy-MM-dd');
                const dayEvents = events[dateKey] || [];

                return (
                  <div key={dIndex} className="agenda-day-col">
                    {isToday(day) && currentTimePos !== null && (
                      <div className="agenda-current-time-line" style={{ top: `${currentTimePos}%` }}>
                        <div className="agenda-time-dot"></div>
                      </div>
                    )}

                    {dayEvents.map((event, eIndex) => (
                      <div 
                        key={eIndex} 
                        className="agenda-event-item"
                        style={{ borderLeftColor: event.color || '#8b8bff' }}
                      >
                        <span className="event-title">{event.title}</span>
                      </div>
                    ))}

                    {timeSlots.map((_, i) => (
                      <div key={i} className="agenda-grid-cell"></div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}