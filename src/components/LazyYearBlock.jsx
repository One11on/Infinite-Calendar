// src/components/LazyYearBlock.jsx
import React, { useRef, useEffect, useState } from 'react';
import MonthBlock from './MonthBlock';
import './YearBlock.css';

export default function LazyYearBlock({ 
  yearData, 
  todayYear, 
  todayMonth, 
  todayDate, 
  isZoomed, 
  isActive,
  onClick,
  onMonthClick,
  onDayClick,
  onClose,
  events,
  holidays,
  waterDropTrigger
}) {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isActive) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { 
        // FIX #3: Increased from 200px to 800px
        // Preloads months BEFORE user reaches them → no React re-render during scroll
        rootMargin: "800px" 
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [isActive]);

  const handleClick = () => {
    if (!isActive && onClick) {
      onClick();
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`year-block ${isActive ? 'active-year' : ''} ${yearData.year === todayYear ? 'today-year' : ''}`}
      data-year={yearData.year}
      onClick={handleClick}
      style={{ 
        // FIX #3: Isolate layout so this block's render doesn't affect the grid
        contain: 'layout style paint'
      }}
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
      <div className="year-label">{yearData.year}</div>
      <div className="months-row">
        {(isVisible || isActive) && (
          yearData.months.map((month, index) => (
            <MonthBlock
              key={index}
              month={month}
              year={yearData.year}
              todayYear={todayYear}
              todayMonth={todayMonth}
              todayDate={todayDate}
              onMonthClick={onMonthClick}
              onDayClick={onDayClick}
              events={events}
              holidays={holidays}
              waterDropTrigger={waterDropTrigger} 
            />
          ))
        )}
      </div>
    </div>
  );
}