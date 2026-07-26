// src/components/MonthCarouselView.jsx
import React, { useState, useCallback, useEffect } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isToday } from 'date-fns';
import './MonthCarouselView.css';

export default function MonthCarouselView({ 
  selectedDate,
  events = {},
  holidays = {},
  onDayClick,
  showWaterDrop,
  todayYear,
  todayMonth,
  todayDate
}) {
  
  const [centerDate, setCenterDate] = useState(selectedDate || new Date());

  // Sync center date
  useEffect(() => {
    setCenterDate(selectedDate || new Date());
  }, [selectedDate]);

  // Navigation functions
  const goPrevious = useCallback(() => {
    setCenterDate(prev => subMonths(prev, 1));
  }, []);

  const goNext = useCallback(() => {
    setCenterDate(prev => addMonths(prev, 1));
  }, []);

  // Get Previous, Current, and Next months
  const prevDate = subMonths(centerDate, 1);
  const nextDate = addMonths(centerDate, 1);

  // Helper to generate the days array for a month
  const getMonthDays = (date) => {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const startDayOfWeek = getDay(monthStart);
    const paddingDays = Array.from({ length: startDayOfWeek });

    return {
      monthLabel: format(date, 'MMMM'),
      yearLabel: format(date, 'yyyy'),
      days: daysInMonth,
      padding: paddingDays
    };
  };

  const currMonthData = getMonthDays(centerDate);
  const prevMonthData = getMonthDays(prevDate);
  const nextMonthData = getMonthDays(nextDate);

  // Helper to check if a day is today
  const checkIsToday = (day) => isToday(day);

  // Helper function to determine the CSS class for a side-panel day
  const getSideDayClass = (day) => {
    const dayOfWeek = getDay(day);
    let className = 'side-day';
    if (dayOfWeek === 0) className += ' sunday';
    else if (dayOfWeek === 6) className += ' saturday';
    else if (dayOfWeek === 5) className += ' friday';
    return className;
  };

  return (
    <div className="month-carousel-overlay">
      <div className="month-carousel-container">
        
        {/* 3-Section Stage */}
        <div className="month-carousel-stage">
          
          {/* === SECTION 1: Previous Month (Left Panel) === */}
          <div className="month-carousel-card side-month-card" onClick={goPrevious}>
            <div className="side-month-content">
              <div className="side-month-label">{prevMonthData.monthLabel} {prevMonthData.yearLabel}</div>
              <div className="side-days-grid">
                {prevMonthData.padding.map((_, i) => <div key={`p-${i}`} className="side-day empty"></div>)}
                {prevMonthData.days.map((day) => (
                  <div key={day} className={getSideDayClass(day)}>{format(day, 'd')}</div>
                ))}
              </div>
            </div>
          </div>

          {/* === SECTION 2: Current Month (Center Focus - Interactive) === */}
          <div className="month-carousel-card center-month-card">
            <div className="center-month-content">
              
              <div className="center-month-header">
                <button className="month-nav-arrow" onClick={goPrevious}>◀</button>
                <h2 className="center-month-label">{currMonthData.monthLabel} {currMonthData.yearLabel}</h2>
                <button className="month-nav-arrow" onClick={goNext}>▶</button>
              </div>

              {/* Weekday Headers */}
              <div className="month-weekdays">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                  <div key={d} className="month-weekday-label">{d}</div>
                ))}
              </div>

              {/* Days Grid */}
              <div className="center-days-grid">
                {currMonthData.padding.map((_, i) => <div key={`p-${i}`} className="center-day empty"></div>)}
                {currMonthData.days.map((day) => {
                  const dateKey = format(day, 'yyyy-MM-dd');
                  const dayEvents = events[dateKey] || [];
                  const dayHolidays = holidays[dateKey] || [];
                  const isCurrentDay = checkIsToday(day);

                  const dayOfWeek = getDay(day);
                  let dayClass = 'center-day';
                  
                  if (dayOfWeek === 0) dayClass += ' sunday'; 
                  else if (dayOfWeek === 6) dayClass += ' saturday';
                  else if (dayOfWeek === 5) dayClass += ' friday';
                  
                  if (isCurrentDay) dayClass += ' today';

                  return (
                    <div 
                      key={dateKey} 
                      className={dayClass}
                      onClick={() => onDayClick && onDayClick(dateKey)}
                      style={{ position: 'relative' }}
                    >
                      <span className="center-day-number">{format(day, 'd')}</span>
                      
                      {(dayEvents.length > 0 || dayHolidays.length > 0) && (
                        <div className="center-day-dots">
                          {dayEvents.length > 0 && <span className="dot event-dot"></span>}
                          {dayHolidays.length > 0 && <span className="dot holiday-dot"></span>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

          {/* === SECTION 3: Next Month (Right Panel) === */}
          <div className="month-carousel-card side-month-card" onClick={goNext}>
            <div className="side-month-content">
              <div className="side-month-label">{nextMonthData.monthLabel} {nextMonthData.yearLabel}</div>
              <div className="side-days-grid">
                {nextMonthData.padding.map((_, i) => <div key={`p-${i}`} className="side-day empty"></div>)}
                {nextMonthData.days.map((day) => (
                  <div key={day} className={getSideDayClass(day)}>{format(day, 'd')}</div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}