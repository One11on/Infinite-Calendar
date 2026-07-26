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
      { rootMargin: "200px" }
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
        {/* Only render months if near screen, otherwise just an empty space */}
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