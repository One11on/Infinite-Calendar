// src/components/CompactMonthBlock.jsx
import React, { useState, useEffect } from 'react';
import WaterDropEffect from './WaterDropEffect';
import './CompactMonthBlock.css';

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export default function CompactMonthBlock({ 
  month, year, todayYear, todayMonth, todayDate,
  events, holidays, onMonthClick, onDayClick, showWaterDrop
}) {
  const [isWaterActive, setIsWaterActive] = useState(false);

  useEffect(() => {
    if (year === todayYear) {
      setIsWaterActive(showWaterDrop);
    } else {
      setIsWaterActive(false);
    }
  }, [showWaterDrop, year, todayYear]);

  const handleDayClick = (day) => {
    if (onDayClick) {
      const dateStr = `${year}-${String(day.month + 1).padStart(2, '0')}-${String(day.dayNumber).padStart(2, '0')}`;
      onDayClick(dateStr);
    }
  };

  const handleMonthClick = () => {
    if (onMonthClick) {
      const monthIndex = monthNames.indexOf(month.name);
      onMonthClick(year, monthIndex);
    }
  };

  const shouldShowDrop = isWaterActive && year === todayYear;

  return (
    <div className="compact-month" onClick={handleMonthClick}>
      <div className="compact-month-label">{month.name}</div>
      <div className="compact-days-grid">
        {month.days.map((day, index) => {
          const dateStr = `${year}-${String(day.month + 1).padStart(2, '0')}-${String(day.dayNumber).padStart(2, '0')}`;
          const hasEvents = events && events[dateStr] && events[dateStr].length > 0;
          const hasHolidays = holidays && holidays[dateStr] && holidays[dateStr].length > 0;
          const isTodayFlag = day.isToday;
          const isOtherMonth = day.isOtherMonth;

          // ===== 3 LINES TO FIX THE COLORS =====
          let dayClassName = 'compact-day';
          if (isOtherMonth) dayClassName += ' other-month';
          else if (day.dayClass) dayClassName += ` ${day.dayClass}`;
          if (isTodayFlag) dayClassName += ' compact-today';

          return (
            <div 
              key={index} 
              className={dayClassName}
              onClick={(e) => {
                e.stopPropagation();
                handleDayClick(day);
              }}
              style={{ position: 'relative' }}
            >
              {day.dayNumber}
              
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                <WaterDropEffect isActive={shouldShowDrop && isTodayFlag} />
              </div>

              {hasEvents && <span className="compact-event-dot"></span>}
              {hasHolidays && <span className="compact-holiday-dot"></span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}