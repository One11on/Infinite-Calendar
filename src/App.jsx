// src/App.jsx
import React, { useEffect, useCallback, useRef } from 'react';
import ParticleBackground from './components/ParticleBackground';
import MonthCarouselView from './components/MonthCarouselView';
import { format } from 'date-fns'; 
import Header from './components/Header';
import YearGrid from './components/YearGrid';
import YearCarouselView from './components/YearCarouselView';
import LoadingIndicator from './components/LoadingIndicator';
import EventModal from './components/EventModal';
import AgendaView from './components/AgendaView';

import { useCalendar } from './hooks/useCalendar';
import './styles/App.css';

function App() {
  const {
    startYear,
    endYear,
    isZoomedToYear,
    isLoading,
    todayYear,
    todayMonth,
    todayDate,
    containerRef,
    events,
    holidays,
    selectedDate,
    showEventModal,
    generateYearsData,
    zoomIntoYear,
    zoomOutFromYear,
    shiftYears,
    goToToday,
    loadMoreYears,
    scrollToYear,
    addEvent,
    removeEvent,
    setSelectedDate,
    setShowEventModal,
    viewType,
    setViewType,
    focusedDate,
    setFocusedDate,
    goToPrevious,
    goToNext,
    showWaterDrop
  } = useCalendar();

  const hasScrolledToToday = useRef(false);
  const yearsData = generateYearsData();

  const zoomedYearData = isZoomedToYear !== null 
    ? yearsData.find(y => y.year === isZoomedToYear) 
    : null;

  useEffect(() => {
    if (!hasScrolledToToday.current) {
      setTimeout(() => {
        scrollToYear(todayYear);
        hasScrolledToToday.current = true;
      }, 300);
    }
  }, [todayYear, scrollToYear]);

  const handleScroll = useCallback((e) => {
    if (viewType !== 'year' || isZoomedToYear !== null) return;

    const container = e.currentTarget;
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight * 0.8 && !isLoading) {
      loadMoreYears('down');
    }

    if (scrollTop < 200 && !isLoading && startYear > 1900) {
      loadMoreYears('up');
    }
  }, [isLoading, isZoomedToYear, startYear, loadMoreYears, viewType]);

  // =========================================================
  // THE 3 CLICK TARGETS
  // =========================================================

  // TARGET 1: Click a Year Label -> Opens the Year Carousel
  const handleYearClick = useCallback((year) => {
    zoomIntoYear(year);
  }, [zoomIntoYear]);

  // ===== FIXED: HANDLES BOTH STRING AND NUMBERS =====
  // TARGET 2: Click a Month -> Redirect to Month View
  const handleMonthClick = useCallback((yearOrString, monthIndex) => {
    let newDate;
    
    // If monthIndex is undefined, yearOrString is a string like "2024-02-01" (Home Grid)
    if (monthIndex === undefined) {
      newDate = new Date(yearOrString);
    } else {
      // Otherwise it's (year, monthIndex) (Year Carousel)
      newDate = new Date(yearOrString, monthIndex, 1);
    }

    setFocusedDate(newDate);
    setViewType('month');
  }, [setFocusedDate, setViewType]);

  // TARGET 3: Click a Date -> Switch to Now View + Open Note
  const handleDayClick = useCallback((dateStr) => {
    const dateObj = new Date(dateStr);
    setSelectedDate(dateStr);
    setFocusedDate(dateObj);
    setViewType('today');
    setShowEventModal(true);
  }, [setSelectedDate, setShowEventModal, setFocusedDate, setViewType]);

  // =========================================================

  const handleCloseYear = useCallback(() => {
    if (isZoomedToYear !== null) {
      zoomOutFromYear();
    }
  }, [isZoomedToYear, zoomOutFromYear]);

  const renderView = () => {
    switch(viewType) {
      case 'year':
        return (
          <YearGrid
            yearsData={yearsData}
            isZoomedToYear={isZoomedToYear}
            todayYear={todayYear}
            todayMonth={todayMonth}
            todayDate={todayDate}
            onYearClick={handleYearClick}
            onMonthClick={handleMonthClick}
            onDayClick={handleDayClick}
            onCloseYear={handleCloseYear}
            onScroll={handleScroll}
            isLoading={isLoading}
            containerRef={containerRef}
            events={events}
            holidays={holidays}
          />
        );
      
      case 'month':
        return (
          <MonthCarouselView 
            selectedDate={focusedDate}
            events={events}
            holidays={holidays}
            onDayClick={handleDayClick}
            showWaterDrop={showWaterDrop}
            todayYear={todayYear}
            todayMonth={todayMonth}
            todayDate={todayDate}
          />
        );

      case 'today':
        return (
          <AgendaView 
            selectedDate={focusedDate}
            events={events}
            holidays={holidays}
            onDayClick={handleDayClick}
          />
        );
        
      default:
        return <div>Loading...</div>;
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        if (viewType === 'year') shiftYears(-1);
        else goToPrevious();
        e.preventDefault();
      }
      if (e.key === 'ArrowRight') {
        if (viewType === 'year') shiftYears(1);
        else goToNext();
        e.preventDefault();
      }

      if (e.key === 't' || e.key === 'T') {
        goToToday();
        e.preventDefault();
      }
      if (e.key === 'Escape') {
        if (isZoomedToYear !== null) {
          zoomOutFromYear();
          e.preventDefault();
        } else if (viewType !== 'year') {
          setViewType('year');
          e.preventDefault();
        }
        if (showEventModal) {
          setShowEventModal(false);
          e.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [viewType, shiftYears, goToPrevious, goToNext, goToToday, isZoomedToYear, zoomOutFromYear, showEventModal, setShowEventModal, setViewType]);

  return (
    <div className="app">
      <Header
        viewType={viewType}
        setViewType={setViewType}
        focusedDate={focusedDate}
        goToToday={goToToday}
        onAddEvent={() => {
          setSelectedDate(format(new Date(), 'yyyy-MM-dd'));
          setShowEventModal(true);
        }}
        onHomeClick={() => {
          zoomOutFromYear();
          setViewType('year');
        }}
      />
      <div 
        className="main-content" 
        ref={containerRef}
        onScroll={handleScroll}
      >
        <ParticleBackground />
        {renderView()}
        {viewType === 'year' && isZoomedToYear === null && <LoadingIndicator isLoading={isLoading} />}
      </div>

      {/* Floating Popup ONLY RENDERS IF THE USER CLICKED A YEAR LABEL */}
      {isZoomedToYear !== null && zoomedYearData && (
        <YearCarouselView 
          yearData={zoomedYearData}
          allYearsData={yearsData}
          todayYear={todayYear}
          todayMonth={todayMonth}
          todayDate={todayDate}
          onMonthClick={handleMonthClick}
          onDayClick={handleDayClick}
          onClose={handleCloseYear}
          onCarouselChange={zoomIntoYear}
          events={events}
          holidays={holidays}
          showWaterDrop={showWaterDrop}
          // ===== ADDED THESE TWO LINES =====
          onViewChange={setViewType}
          goToToday={goToToday}
          // =================================
        />
      )}

      <EventModal
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
        date={selectedDate}
        events={events}
        holidays={holidays}
        onAddEvent={addEvent}
        onRemoveEvent={removeEvent}
      />
    </div>
  );
}

export default App;