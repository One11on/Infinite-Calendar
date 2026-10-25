// src/components/YearGrid.jsx
import React from 'react';
import LazyYearBlock from './LazyYearBlock';
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
  onDayClick,
  onCloseYear,
  onScroll,
  isLoading,
  containerRef,
  events,
  holidays,
  waterDropTrigger
}) {
  const gridClassName = `years-grid ${isZoomedToYear !== null ? 'zoomed' : ''}`;

  return (
    <div 
      className={gridClassName}
      onScroll={onScroll}
      style={{ 
        position: 'relative', 
        zIndex: 1,
        // FIX #3: Isolate layout calculations so scroll doesn't trigger full reflow
        contain: 'layout style'
      }}
    >
      <ParticleBackground />
      {yearsData.map((yearData) => (
        <LazyYearBlock
          key={yearData.year}
          yearData={yearData}
          todayYear={todayYear}
          todayMonth={todayMonth}
          todayDate={todayDate}
          isZoomed={isZoomedToYear !== null}
          isActive={yearData.year === isZoomedToYear}
          onClick={() => onYearClick(yearData.year)}
          onMonthClick={onMonthClick}
          onDayClick={onDayClick}
          onClose={onCloseYear}
          events={events}
          holidays={holidays}
          waterDropTrigger={waterDropTrigger}
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