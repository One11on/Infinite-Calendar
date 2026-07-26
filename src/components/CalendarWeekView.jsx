// src/components/CalendarWeekView.jsx
import React, { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, isSameDay, isToday, getHours, getMinutes } from 'date-fns';
import './CalendarWeekView.css';

export default function CalendarWeekView({ selectedDate, events = {}, onDayClick }) {
  const [currentTimePos, setCurrentTimePos] = useState(null);

  // Calculate the start of the week (Sunday)
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 });
  
  // Generate array of 7 days for the week
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Update the red line position every minute
  useEffect(() => {
    const updateTimeLine = () => {
      const now = new Date();
      const minutesSinceMidnight = getHours(now) * 60 + getMinutes(now);
      const totalMinutes = 24 * 60;
      setCurrentTimePos((minutesSinceMidnight / totalMinutes) * 100);
    };

    updateTimeLine();
    const timer = setInterval(updateTimeLine, 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  // Define time slots (e.g., 6 AM to 10 PM)
  const timeSlots = [];
  for (let i = 6; i <= 22; i++) {
    timeSlots.push(`${i > 12 ? i - 12 : i} ${i >= 12 ? 'PM' : 'AM'}`);
  }

  const formatDateKey = (date) => format(date, 'yyyy-MM-dd');

  return (
    <div className="calendar-week-view">
      {/* Week Header */}
      <div className="week-header">
        <div className="time-col-header"></div>
        {weekDays.map((day, index) => (
          <div 
            key={index} 
            className={`week-day-header ${isToday(day) ? 'today-header' : ''}`}
            onClick={() => onDayClick && onDayClick(day)}
          >
            <span className="day-name">{format(day, 'EEE')}</span>
            <span className="day-number">{format(day, 'd')}</span>
          </div>
        ))}
      </div>

      {/* Time Grid Container */}
      <div className="week-grid-scroll-container">
        <div className="week-grid">
          {/* Time Column */}
          <div className="time-col">
            {timeSlots.map((time, i) => (
              <div key={i} className="time-slot-label">{time}</div>
            ))}
          </div>

          {/* 7 Day Columns */}
          {weekDays.map((day, dayIndex) => {
            const dateKey = formatDateKey(day);
            const dayEvents = events[dateKey] || [];
            
            return (
              <div key={dayIndex} className="day-col">
                {/* Current Time Red Line (Only draw if today) */}
                {isToday(day) && currentTimePos !== null && (
                  <div 
                    className="current-time-line" 
                    style={{ top: `${currentTimePos}%` }}
                  >
                    <div className="time-dot"></div>
                  </div>
                )}

                {/* Render Events */}
                {dayEvents.map((event, eIndex) => (
                  <div 
                    key={eIndex} 
                    className="week-event-item"
                    style={{ borderLeftColor: event.color || '#8b8bff' }}
                    title={event.description}
                  >
                    <span className="event-title">{event.title}</span>
                  </div>
                ))}

                {/* Render empty grid lines */}
                {timeSlots.map((_, i) => (
                  <div key={i} className="grid-cell"></div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}