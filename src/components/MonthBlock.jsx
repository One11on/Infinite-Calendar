// src/components/MonthBlock.jsx
import React from 'react';
import './MonthBlock.css';

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export default function MonthBlock({ 
  month, year, todayYear, todayMonth, todayDate,
  onMonthClick, onDayClick, events, holidays
}) {
  
  // CLICKABLE 2: MONTH -> REDIRECT TO MONTH VIEW
  const handleMonthClick = () => {
    if (onMonthClick) {
      const monthIndex = monthNames.indexOf(month.name);
      const firstDayString = `${year}-${String(monthIndex + 1).padStart(2, '0')}-01`;
      onMonthClick(firstDayString);
    }
  };

  // CLICKABLE 3: SPECIFIC DATE -> REDIRECT TO NOW VIEW
  const handleDayClick = (day) => {
    if (onDayClick) {
      // Generate "2020-01-15" and send it up
      const dateStr = `${year}-${String(day.month + 1).padStart(2, '0')}-${String(day.dayNumber).padStart(2, '0')}`;
      onDayClick(dateStr);
    }
  };

  return (
    <div className="month-mini" onClick={handleMonthClick}>
      <div className="month-label">{month.name}</div>
      <div className="days-mini">
        {month.days.map((day, index) => {
          const dateStr = `${year}-${String(day.month + 1).padStart(2, '0')}-${String(day.dayNumber).padStart(2, '0')}`;
          const hasEvents = events && events[dateStr] && events[dateStr].length > 0;
          const hasHolidays = holidays && holidays[dateStr] && holidays[dateStr].length > 0;
          const isTodayFlag = day.isToday;
          const isOtherMonth = day.isOtherMonth;

          let dayClass = 'day-mini';
          if (isOtherMonth) dayClass += ' other-month';
          else if (day.dayClass) dayClass += ` ${day.dayClass}`;
          if (isTodayFlag) dayClass += ' today';

          return (
            <div
              key={index}
              className={dayClass}
              onClick={(e) => {
                e.stopPropagation(); // Prevent Month Click
                handleDayClick(day);  // Fire Date Click
              }}
              style={{ position: 'relative' }}
            >
              {day.dayNumber}
              {hasEvents && <span className="event-dot"></span>}
              {hasHolidays && <span className="holiday-dot"></span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}