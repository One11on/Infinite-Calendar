// src/components/YearBlock.jsx
import React from 'react';
import MonthBlock from './MonthBlock';
import './YearBlock.css';

export default function YearBlock({ 
  yearData, 
  todayYear, 
  todayMonth, 
  todayDate, 
  isZoomed, 
  isActive,
  onClick,      // For Year Carousel
  onMonthClick,  // For Month View
  onDayClick,    // <--- RECEIVE THIS
  onClose,
  events,
  holidays
}) {
  return (
    <div 
      className={`year-block ${isActive ? 'active-year' : ''} ${yearData.year === todayYear ? 'today-year' : ''}`}
      data-year={yearData.year}
    >
      {isActive && (
        <button 
          className="close-year-btn" 
          onClick={(e) => {
            e.stopPropagation();
            if (onClose) onClose();
          }}
        >
          ✕
        </button>
      )}
      
      {/* CLICKABLE 1: YEAR LABEL -> OPENS YEAR CAROUSEL */}
      <div 
        className="year-label" 
        onClick={() => onClick && onClick()}
      >
        {yearData.year}
      </div>

      {/* CLICKABLE 2 & 3: MONTH & DAYS -> HANDLED INSIDE MONTHBLOCK */}
      <div className="months-row">
        {yearData.months.map((month, index) => (
          <MonthBlock
            key={index}
            month={month}
            year={yearData.year}
            todayYear={todayYear}
            todayMonth={todayMonth}
            todayDate={todayDate}
            onMonthClick={onMonthClick}
            onDayClick={onDayClick} // <--- PASS IT DOWN HERE
            events={events}
            holidays={holidays}
          />
        ))}
      </div>
    </div>
  );
}