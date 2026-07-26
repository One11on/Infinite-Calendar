// src/components/CalendarMonthView.jsx
import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, isToday } from 'date-fns';
import './CalendarMonthView.css';

export default function CalendarMonthView({ 
  selectedDate, 
  events = {}, 
  holidays = {}, 
  onDayClick 
}) {
  // Calculate the days for the current month
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  
  // Get all days in the month
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Calculate padding days (empty slots before the 1st)
  const startDayOfWeek = getDay(monthStart); // 0 = Sunday, 6 = Saturday
  const paddingDays = Array.from({ length: startDayOfWeek });

  // Helper to get date string key
  const getDateKey = (date) => format(date, 'yyyy-MM-dd');

  return (
    <div className="calendar-month-view">
      <div className="month-header">
        <h2 className="month-title">{format(selectedDate, 'MMMM yyyy')}</h2>
      </div>

      {/* Weekday Headers */}
      <div className="month-weekdays">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="weekday-label">{day}</div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="month-days-grid">
        {/* Empty padding cells */}
        {paddingDays.map((_, index) => (
          <div key={`empty-${index}`} className="day-cell empty"></div>
        ))}

        {/* Actual Days */}
        {daysInMonth.map((day) => {
          const dateKey = getDateKey(day);
          const dayEvents = events[dateKey] || [];
          const dayHolidays = holidays[dateKey] || [];
          const isCurrentDay = isToday(day);

          return (
            <div 
              key={dateKey} 
              className={`day-cell ${isCurrentDay ? 'today' : ''}`}
              onClick={() => onDayClick && onDayClick(dateKey)}
            >
              <span className="day-number">{format(day, 'd')}</span>
              
              {/* Render Event/Holiday dots */}
              {(dayEvents.length > 0 || dayHolidays.length > 0) && (
                <div className="day-dots">
                  {dayEvents.length > 0 && <span className="dot event-dot" title="Has events"></span>}
                  {dayHolidays.length > 0 && <span className="dot holiday-dot" title="Has holidays"></span>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}