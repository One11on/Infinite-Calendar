// src/components/YearGrid.jsx
import React from 'react';
import YearBlock from './YearBlock';
import ParticleBackground from './ParticleBackground';
import './YearGrid.css';

export default function YearGrid({ 
  yearsData, 
  isZoomedToYear, 
  todayYear, 
  todayMonth, 
  todayDate,
  onYearClick,
  onMonthClick,
  onDayClick, // <--- RECEIVE THIS
  onCloseYear,
  onScroll,
  isLoading,
  containerRef,
  events,
  holidays
}) {
  const gridClassName = `years-grid ${isZoomedToYear !== null ? 'zoomed' : ''}`;

  return (
    <div 
      className={gridClassName}
      onScroll={onScroll}
      style={{ position: 'relative', zIndex: 1 }}
    >
      <ParticleBackground />
      {yearsData.map((yearData) => (
        <YearBlock
          key={yearData.year}
          yearData={yearData}
          todayYear={todayYear}
          todayMonth={todayMonth}
          todayDate={todayDate}
          isZoomed={isZoomedToYear !== null}
          isActive={yearData.year === isZoomedToYear}
          onClick={() => onYearClick(yearData.year)}
          onMonthClick={onMonthClick}
          onDayClick={onDayClick} // <--- PASS IT DOWN HERE
          onClose={onCloseYear}
          events={events}
          holidays={holidays}
        />
      ))}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
    </div>
  );
}