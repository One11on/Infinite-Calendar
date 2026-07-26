// src/components/YearCarouselView.jsx
import React, { useState, useCallback, useEffect } from 'react';
import { format } from 'date-fns'; 
import CompactMonthBlock from './CompactMonthBlock';
import ParticleBackground from './ParticleBackground';
import './YearCarouselView.css';

export default function YearCarouselView({ 
  yearData,
  allYearsData = [],
  todayYear, 
  todayMonth, 
  todayDate,
  onMonthClick,
  onDayClick,
  onClose,
  onCarouselChange,
  events,
  holidays,
  showWaterDrop,
  onViewChange, 
  goToToday     
}) {
  
  const [activeIndex, setActiveIndex] = useState(() => {
    return allYearsData.findIndex(y => y.year === yearData?.year);
  });
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const newIndex = allYearsData.findIndex(y => y.year === yearData?.year);
    if (newIndex !== -1 && newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  }, [yearData, allYearsData, activeIndex]);

  const getYearData = (index) => {
    if (index < 0 || index >= allYearsData.length) return null;
    return allYearsData[index];
  };

  const handleGoPrevious = useCallback(() => {
    const newIndex = activeIndex - 1;
    if (newIndex >= 0) {
      setActiveIndex(newIndex);
      if (onCarouselChange) onCarouselChange(allYearsData[newIndex].year);
    }
  }, [activeIndex, allYearsData, onCarouselChange]);

  const handleGoNext = useCallback(() => {
    const newIndex = activeIndex + 1;
    if (newIndex < allYearsData.length) {
      setActiveIndex(newIndex);
      if (onCarouselChange) onCarouselChange(allYearsData[newIndex].year);
    }
  }, [activeIndex, allYearsData, onCarouselChange]);

  const prevYearData = getYearData(activeIndex - 1);
  const currYearData = getYearData(activeIndex);
  const nextYearData = getYearData(activeIndex + 1);

  if (!currYearData) return null;

  const handleMonthClickWrapper = (year, month) => {
    onClose();
    onMonthClick(year, month);
  };

  const handleDayClickWrapper = (dateStr) => {
    onClose();
    onDayClick(dateStr);
  };

  return (
    <div className="carousel-overlay" onClick={onClose}>
      <ParticleBackground />

      <div className="carousel-container" onClick={(e) => e.stopPropagation()}>
        
        <button className="carousel-close-btn" onClick={onClose}>✕</button>

        {/* ===== DYNAMIC FLOATING MINI HEADER ===== */}
        <div className="carousel-header-center">
          <span className="carousel-date-title">{currYearData.year}</span>
          <div className="carousel-segmented">
            <button 
              className="carousel-btn active" 
              onClick={() => onViewChange && onViewChange('year')}
            >
              Year
            </button>
            <button 
              className="carousel-btn" 
              onClick={() => { onClose(); onViewChange && onViewChange('month'); }}
            >
              Month
            </button>
            <button 
              className="carousel-btn" 
              onClick={() => { 
                onClose(); 
                goToToday && goToToday(); 
                // ===== FIXED: MANUALLY SWITCH TO 'today' VIEW =====
                onViewChange && onViewChange('today'); 
              }}
            >
              Now
            </button>
          </div>
          <div className="carousel-time-capsule">
            <span className="carousel-hours-minutes">{format(currentTime, 'hh:mm')}</span>
            <span className="carousel-seconds">{format(currentTime, 'ss')}</span>
          </div>
        </div>

        <div className="carousel-stage">
          
          {/* Previous Year (Left) */}
          <div 
            className={`carousel-card side-card ${!prevYearData ? 'disabled-panel' : ''}`}
            onClick={prevYearData ? handleGoPrevious : undefined}
          >
            {prevYearData ? (
              <div className="card-content side-content">
                <div className="side-year-label">{prevYearData.year}</div>
                <div className="side-months-grid">
                  {prevYearData.months.map((month, mIndex) => (
                    <CompactMonthBlock
                      key={mIndex}
                      month={month}
                      year={prevYearData.year}
                      todayYear={todayYear}
                      todayMonth={todayMonth}
                      todayDate={todayDate}
                      events={events}
                      holidays={holidays}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="card-content side-content empty-panel">
                <div className="side-year-label">-</div>
              </div>
            )}
          </div>

          {/* Current Year (Center) */}
          <div className="carousel-card center-card">
            <div className="card-content center-content">
              
              <div className="center-year-header">
                <button className="nav-arrow side-arrow" onClick={handleGoPrevious} disabled={!prevYearData}>◀</button>
                <h2 className="center-year-label">{currYearData.year}</h2>
                <button className="nav-arrow side-arrow" onClick={handleGoNext} disabled={!nextYearData}>▶</button>
              </div>

              <div className="center-months-grid">
                {currYearData.months.map((month, mIndex) => (
                  <div key={mIndex}>
                    <CompactMonthBlock
                      month={month}
                      year={currYearData.year}
                      todayYear={todayYear}
                      todayMonth={todayMonth}
                      todayDate={todayDate}
                      events={events}
                      holidays={holidays}
                      onMonthClick={handleMonthClickWrapper}
                      onDayClick={handleDayClickWrapper}
                      showWaterDrop={showWaterDrop}
                    />
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* Next Year (Right) */}
          <div 
            className={`carousel-card side-card ${!nextYearData ? 'disabled-panel' : ''}`}
            onClick={nextYearData ? handleGoNext : undefined}
          >
            {nextYearData ? (
              <div className="card-content side-content">
                <div className="side-year-label">{nextYearData.year}</div>
                <div className="side-months-grid">
                  {nextYearData.months.map((month, mIndex) => (
                    <CompactMonthBlock
                      key={mIndex}
                      month={month}
                      year={nextYearData.year}
                      todayYear={todayYear}
                      todayMonth={todayMonth}
                      todayDate={todayDate}
                      events={events}
                      holidays={holidays}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="card-content side-content empty-panel">
                <div className="side-year-label">-</div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}