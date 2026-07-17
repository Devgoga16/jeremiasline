import { useState } from 'react';
import '../styles/TimelineEvent.css';

export function TimelineEvent({ event, isAlternate }) {
  const [isOpen, setIsOpen] = useState(false);

  const yearDisplay = event.endYear
    ? `${event.year}-${event.endYear}`
    : `${event.year}`;

  return (
    <div className={`timeline-event ${isAlternate ? 'alternate' : ''} ${event.emphasis ? 'emphasis' : ''}`}>
      <div className="event-marker" style={{ backgroundColor: event.color }}>
        <span className="marker-inner"></span>
      </div>

      <div className="event-content">
        <button
          className="event-header"
          onClick={() => setIsOpen(!isOpen)}
          style={{ borderLeft: `4px solid ${event.color}` }}
        >
          <div className="year-badge" style={{ backgroundColor: event.color }}>
            {yearDisplay}
          </div>
          <div className="header-text">
            <h3>{event.title}</h3>
            <p className="description-preview">{event.description}</p>
          </div>
          <span className="expand-icon">{isOpen ? '▼' : '▶'}</span>
        </button>

        {isOpen && (
          <div className="event-details">
            <p className="full-description">{event.description}</p>
            {event.details && (
              <p className="additional-details">{event.details}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
