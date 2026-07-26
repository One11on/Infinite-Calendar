import React, { useState } from 'react';
import './EventModal.css';

export default function EventModal({ 
  isOpen, 
  onClose, 
  date, 
  events, 
  holidays, 
  notes = {},
  onAddEvent, 
  onRemoveEvent,
  onAddNote,
  onRemoveNote
}) {
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventColor, setEventColor] = useState('#8b8bff');
  const [noteText, setNoteText] = useState('');

  if (!isOpen) return null;

  const dateObj = new Date(date);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const dateEvents = events[date] || [];
  const dateHolidays = holidays[date] || [];
  const dateNotes = notes[date] || [];

  const handleAddEvent = () => {
    if (eventTitle.trim()) {
      onAddEvent(date, {
        title: eventTitle,
        description: eventDescription,
        color: eventColor,
        timestamp: new Date().toISOString()
      });
      setEventTitle('');
      setEventDescription('');
      setEventColor('#8b8bff');
    }
  };

  const handleRemoveEvent = (index) => {
    onRemoveEvent(date, index);
  };

  const handleAddNote = () => {
    if (noteText.trim() && onAddNote) {
      onAddNote(date, {
        text: noteText,
        timestamp: new Date().toISOString()
      });
      setNoteText('');
    }
  };

  const handleRemoveNote = (index) => {
    if (onRemoveNote) {
      onRemoveNote(date, index);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📅 {formattedDate}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {/* Holidays Section */}
          {dateHolidays.length > 0 && (
            <div className="holidays-section">
              <h3>🎉 Public Holidays</h3>
              {dateHolidays.map((holiday, index) => (
                <div key={index} className="holiday-item">
                  <span className="holiday-name">{holiday.name}</span>
                  <span className="holiday-type">{holiday.type}</span>
                </div>
              ))}
            </div>
          )}

          {/* Notes Section */}
          <div className="notes-section">
            <h3>📝 Notes</h3>
            <div className="add-note-form">
              <input
                type="text"
                placeholder="Add a note..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="note-input"
                onKeyPress={(e) => e.key === 'Enter' && handleAddNote()}
              />
              <button onClick={handleAddNote} className="note-add-btn">
                Add
              </button>
            </div>
            {dateNotes.length === 0 ? (
              <p className="no-notes">No notes for this day</p>
            ) : (
              dateNotes.map((note, index) => (
                <div key={index} className="note-item">
                  <span className="note-text">{note.text}</span>
                  <button 
                    className="note-delete" 
                    onClick={() => handleRemoveNote(index)}
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Events Section */}
          <div className="events-section">
            <h3>📝 Your Events</h3>
            {dateEvents.length === 0 ? (
              <p className="no-events">No events for this day</p>
            ) : (
              dateEvents.map((event, index) => (
                <div key={index} className="event-item" style={{ borderLeftColor: event.color || '#8b8bff' }}>
                  <div className="event-content">
                    <span className="event-title">{event.title}</span>
                    {event.description && (
                      <span className="event-description">{event.description}</span>
                    )}
                  </div>
                  <button 
                    className="event-delete" 
                    onClick={() => handleRemoveEvent(index)}
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Add Event Form */}
          <div className="add-event-section">
            <h3>➕ Add Event</h3>
            <div className="add-event-form">
              <input
                type="text"
                placeholder="Event title..."
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                className="event-input"
              />
              <input
                type="text"
                placeholder="Description (optional)"
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                className="event-input"
              />
              <div className="event-color-row">
                <label>Color:</label>
                <input
                  type="color"
                  value={eventColor}
                  onChange={(e) => setEventColor(e.target.value)}
                  className="event-color-picker"
                />
              </div>
              <button onClick={handleAddEvent} className="event-add-btn">
                Add Event
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}