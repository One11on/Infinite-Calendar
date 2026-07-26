// src/components/CalendarDayView.jsx
import React from 'react';
import { format, isToday } from 'date-fns';
import './CalendarDayView.css';

export default function CalendarDayView({ selectedDate, events = {} }) {
  const dateKey = format(selectedDate, 'yyyy-MM-dd');
  const dayEvents = events[dateKey] || [];

  // Time slots for Day View
  const timeSlots = [];
  for (let i = 6; i <= 22; i++) {
    timeSlots.push(`${i > 12 ? i - 12 : i} ${i >= 12 ? 'PM' : 'AM'}`);
  }

  return (
    <div className="calendar-day-view">
      {/* Left Column: The Time Grid */}
      <div className="day-grid-container">
        <div className="day-time-col">
          {timeSlots.map((time, i) => (
            <div key={i} className="day-time-label">{time}</div>
          ))}
        </div>
        
        <div className="day-events-col">
          {timeSlots.map((_, i) => (
            <div key={i} className="day-grid-cell"></div>
          ))}
          
          {/* Render Events overlayed on grid */}
          {dayEvents.map((event, index) => (
            <div 
              key={index} 
              className="day-event-item"
              style={{ borderLeftColor: event.color || '#8b8bff' }}
            >
              <div className="event-title">{event.title}</div>
              <div className="event-desc">{event.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Info Panel */}
      <div className="day-info-panel">
        <div className="day-number-large">
          {format(selectedDate, 'd')}
        </div>
        <div className="day-name-large">
          {format(selectedDate, 'EEEE')}
        </div>
      </div>
    </div>
  );
}