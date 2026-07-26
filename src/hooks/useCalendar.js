// src/hooks/useCalendar.js
import { useState, useCallback, useRef, useEffect } from 'react';
import SmoothScroll from 'smooth-scroll';

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

function getDayClass(dayOfWeek, isOtherMonth) {
  if (isOtherMonth) return 'other-month';
  if (dayOfWeek === 5) return 'friday';    // Purple
  if (dayOfWeek === 6) return 'saturday';  // Blue
  if (dayOfWeek === 0) return 'sunday';    // Red
  return '';
}

const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 800,
  speedAsDuration: true,
  easing: 'easeInOutCubic',
});

export function useCalendar() {
  const today = new Date();
  const todayDate = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();

  const INITIAL_RADIUS = 8;
  const [startYear, setStartYear] = useState(todayYear - INITIAL_RADIUS);
  const [endYear, setEndYear] = useState(todayYear + INITIAL_RADIUS);
  
  const [viewType, setViewType] = useState('year'); 
  const [focusedDate, setFocusedDate] = useState(new Date()); 

  const [isZoomedToYear, setIsZoomedToYear] = useState(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [countryCode, setCountryCode] = useState('US');
  const [holidays, setHolidays] = useState({});
  const [events, setEvents] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const containerRef = useRef(null);

  const [showWaterDrop, setShowWaterDrop] = useState(false);
  const waterDropTimerRef = useRef(null);

  const goToPrevious = useCallback(() => {
    const newDate = new Date(focusedDate);
    if (viewType === 'year') newDate.setFullYear(focusedDate.getFullYear() - 1);
    else if (viewType === 'month') newDate.setMonth(focusedDate.getMonth() - 1);
    else if (viewType === 'today') newDate.setDate(focusedDate.getDate() - 7);
    setFocusedDate(newDate);
  }, [viewType, focusedDate]);

  const goToNext = useCallback(() => {
    const newDate = new Date(focusedDate);
    if (viewType === 'year') newDate.setFullYear(focusedDate.getFullYear() + 1);
    else if (viewType === 'month') newDate.setMonth(focusedDate.getMonth() + 1);
    else if (viewType === 'today') newDate.setDate(focusedDate.getDate() + 7);
    setFocusedDate(newDate);
  }, [viewType, focusedDate]);

  const scrollToYear = useCallback((year) => {
    if (!containerRef.current) return;
    const yearBlock = containerRef.current.querySelector(`[data-year="${year}"]`);
    if (yearBlock) {
      scroll.animateScroll(yearBlock, { speed: 800, easing: 'easeInOutCubic' });
    }
  }, []);

  const goToToday = useCallback(() => {
    const now = new Date();
    setFocusedDate(now);

    setShowWaterDrop(true);
    if (waterDropTimerRef.current) clearTimeout(waterDropTimerRef.current);
    waterDropTimerRef.current = setTimeout(() => {
      setShowWaterDrop(false);
      waterDropTimerRef.current = null;
    }, 800);

    if (viewType === 'year') {
      setIsZoomedToYear(null);
      const yearCount = endYear - startYear + 1;
      const half = Math.floor(yearCount / 2);
      setStartYear(todayYear - half);
      setEndYear(todayYear + (yearCount - half - 1));
      scrollToYear(todayYear);
    }
  }, [viewType, startYear, endYear, todayYear, scrollToYear]);

  // === LOCATION & HOLIDAYS ===
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
          fetchCountryFromCoords(position.coords.latitude, position.coords.longitude);
        },
        () => { fetchCountryFromIP(); }
      );
    } else {
      fetchCountryFromIP();
    }
  }, []);

  const fetchCountryFromCoords = async (lat, lng) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`);
      const data = await response.json();
      if (data.address && data.address.country_code) {
        setCountryCode(data.address.country_code.toUpperCase());
        fetchHolidays(data.address.country_code.toUpperCase());
      }
    } catch { fetchCountryFromIP(); }
  };

  const fetchCountryFromIP = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      if (data.country_code) {
        setCountryCode(data.country_code);
        fetchHolidays(data.country_code);
      }
    } catch {
      setCountryCode('US');
      fetchHolidays('US');
    }
  };

  const fetchHolidays = async (country) => {
    try {
      const year = new Date().getFullYear();
      const response = await fetch(`https://calendarific.com/api/v2/holidays?api_key=YOUR_API_KEY&country=${country}&year=${year}`);
      const data = await response.json();
      if (data.response && data.response.holidays) {
        const holidayMap = {};
        data.response.holidays.forEach(holiday => {
          const date = holiday.date.iso;
          if (!holidayMap[date]) holidayMap[date] = [];
          holidayMap[date].push({ name: holiday.name, description: holiday.description, type: holiday.type });
        });
        setHolidays(holidayMap);
      }
    } catch {
      setHolidays(getSampleHolidays(country));
    }
  };

  const getSampleHolidays = (country) => {
    const sample = {};
    const year = new Date().getFullYear();
    sample[`${year}-01-01`] = [{ name: 'New Year\'s Day', type: 'National holiday' }];
    sample[`${year}-12-25`] = [{ name: 'Christmas Day', type: 'National holiday' }];
    if (country === 'US') {
      sample[`${year}-07-04`] = [{ name: 'Independence Day', type: 'National holiday' }];
      sample[`${year}-11-28`] = [{ name: 'Thanksgiving', type: 'National holiday' }];
    }
    return sample;
  };

  const generateYearData = useCallback((year) => {
    const months = [];
    for (let m = 0; m < 12; m++) {
      const firstOfMonth = new Date(year, m, 1);
      const startDayOfWeek = firstOfMonth.getDay(); 
      const daysInMonth = new Date(year, m + 1, 0).getDate();

      const paddingDays = startDayOfWeek;
      const totalSlots = paddingDays + daysInMonth;
      const extra = (7 - (totalSlots % 7)) % 7;
      const finalTotalSlots = totalSlots + extra;

      const prevMonth = new Date(year, m, 0);
      const prevMonthDays = prevMonth.getDate();
      let prevMonthDayCounter = prevMonthDays - paddingDays + 1;

      const daysArray = [];
      for (let slot = 0; slot < finalTotalSlots; slot++) {
        let dayNumber, isOtherMonth = false, actualMonth = m, actualYear = year;

        if (slot < paddingDays) {
          dayNumber = prevMonthDayCounter++;
          isOtherMonth = true;
          actualMonth = m - 1;
          if (actualMonth < 0) { actualMonth = 11; actualYear = year - 1; }
        } else if (slot < paddingDays + daysInMonth) {
          dayNumber = slot - paddingDays + 1;
        } else {
          dayNumber = slot - (paddingDays + daysInMonth) + 1;
          isOtherMonth = true;
          actualMonth = m + 1;
          if (actualMonth > 11) { actualMonth = 0; actualYear = year + 1; }
        }

        const dayOfWeek = !isOtherMonth ? new Date(year, m, dayNumber).getDay() : -1;
        const dayClass = getDayClass(dayOfWeek, isOtherMonth);
        const isTodayFlag = (actualYear === todayYear && actualMonth === todayMonth && dayNumber === todayDate) && !isOtherMonth;
        const dateStr = `${year}-${String(m + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
        const dayHolidays = holidays[dateStr] || [];

        daysArray.push({
          dayNumber, isOtherMonth, dayClass, isToday: isTodayFlag, holidays: dayHolidays, date: dateStr, month: m, year: year
        });
      }
      months.push({ name: monthNames[m], days: daysArray });
    }
    return { year, months };
  }, [holidays, todayYear, todayMonth, todayDate]);

  const generateYearsData = useCallback(() => {
    const yearsData = [];
    for (let year = startYear; year <= endYear; year++) {
      yearsData.push(generateYearData(year));
    }
    return yearsData;
  }, [startYear, endYear, generateYearData]);

  // ===== ZOOM IN =====
  const zoomIntoYear = useCallback((year) => {
    setIsZoomedToYear(year);
    setTimeout(() => { scrollToYear(year); }, 100);
  }, [scrollToYear]);

  // ===== ZOOM OUT (NO SCROLL AT ALL - PURE CLOSE) =====
  const zoomOutFromYear = useCallback(() => {
    setIsZoomedToYear(null);
    // ==== NOTHING ELSE. NO SCROLL, NO JUMP, NO MOVE ====
  }, []);

  const shiftYears = useCallback((delta) => {
    if (isZoomedToYear !== null) return;
    const yearCount = endYear - startYear + 1;
    setStartYear(prev => prev + delta * yearCount);
    setEndYear(prev => prev + delta * yearCount);
  }, [startYear, endYear, isZoomedToYear]);

  const addEvent = useCallback((date, eventData) => {
    const dateStr = date;
    if (!events[dateStr]) events[dateStr] = [];
    events[dateStr].push(eventData);
    setEvents({ ...events });
  }, [events]);

  const removeEvent = useCallback((date, index) => {
    const dateStr = date;
    if (events[dateStr]) {
      events[dateStr].splice(index, 1);
      if (events[dateStr].length === 0) delete events[dateStr];
      setEvents({ ...events });
    }
  }, [events]);

  const loadMoreYears = useCallback((direction) => {
    if (isLoading) return;
    setIsLoading(true);
    if (direction === 'down') { setEndYear(prev => prev + 6); setStartYear(prev => prev - 6); }
    else if (direction === 'up') { setStartYear(prev => prev - 6); }
    setTimeout(() => { setIsLoading(false); }, 300);
  }, [isLoading]);

  return {
    startYear, endYear, isZoomedToYear, isLoading, todayYear, todayMonth, todayDate,
    containerRef, location, countryCode, holidays, events, selectedDate, showEventModal,
    generateYearsData, zoomIntoYear, zoomOutFromYear, shiftYears, goToToday,
    loadMoreYears, setIsLoading, scrollToYear, addEvent, removeEvent,
    setSelectedDate, setShowEventModal, setCountryCode,
    viewType, setViewType, focusedDate, setFocusedDate, goToPrevious, goToNext,
    showWaterDrop
  };
}