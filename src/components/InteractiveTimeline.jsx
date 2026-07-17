import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import '../styles/InteractiveTimeline.css';

export function InteractiveTimeline({ events }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [direction, setDirection] = useState('next');
  const timelineRef = useRef(null);

  const currentEvent = events[activeIndex];

  const handleNext = () => {
    if (activeIndex < events.length - 1) {
      setDirection('next');
      setActiveIndex(activeIndex + 1);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      setDirection('prev');
      setActiveIndex(activeIndex - 1);
    }
  };

  const handleJump = (index) => {
    setDirection(index > activeIndex ? 'next' : 'prev');
    setActiveIndex(index);
  };

  useEffect(() => {
    if (timelineRef.current) {
      const activeButton = timelineRef.current.querySelector('[data-active="true"]');
      if (activeButton) {
        activeButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeIndex]);

  const progress = ((activeIndex + 1) / events.length) * 100;

  return (
    <div className="interactive-timeline-container">
      {/* Evento Principal Grande */}
      <div className={`event-display ${direction}`} key={`event-${activeIndex}`}>
        <div className="event-header-display">
          <div className="year-large" key={`year-${activeIndex}`}>
            {currentEvent.endYear
              ? `${currentEvent.year}-${currentEvent.endYear}`
              : currentEvent.year}
          </div>

          <div className="event-info" key={`info-${activeIndex}`}>
            <h2>{currentEvent.title}</h2>
            <p className="description">{currentEvent.description}</p>
            {currentEvent.details && (
              <p className="details">{currentEvent.details}</p>
            )}
          </div>

          {currentEvent.emphasis && (
            <div className="emphasis-badge">
              <Zap size={20} />
            </div>
          )}
        </div>

        <div
          className="event-marker-display"
          style={{ backgroundColor: currentEvent.color }}
        />
      </div>

      {/* Barra de progreso */}
      <div className="progress-bar-container">
        <div
          className="progress-bar"
          style={{
            width: `${progress}%`,
            backgroundColor: currentEvent.color,
          }}
        />
      </div>

      {/* Timeline de puntos interactivos */}
      <div className="timeline-dots-wrapper">
        <button
          className="nav-button prev"
          onClick={handlePrev}
          disabled={activeIndex === 0}
          title="Evento anterior"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="timeline-dots-container" ref={timelineRef}>
          {events.map((event, index) => (
            <button
              key={index}
              className={`timeline-dot ${index === activeIndex ? 'active' : ''} ${
                event.emphasis ? 'emphasis' : ''
              }`}
              onClick={() => handleJump(index)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              data-active={index === activeIndex}
              style={{ backgroundColor: event.color }}
              title={`${event.year}: ${event.title}`}
            >
              <span className="dot-inner" />

              {hoveredIndex === index && (
                <div className="dot-tooltip">
                  <div className="tooltip-year">
                    {event.endYear ? `${event.year}-${event.endYear}` : event.year}
                  </div>
                  <div className="tooltip-title">{event.title}</div>
                </div>
              )}
            </button>
          ))}
        </div>

        <button
          className="nav-button next"
          onClick={handleNext}
          disabled={activeIndex === events.length - 1}
          title="Siguiente evento"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Indicador de posición */}
      <div className="position-indicator">
        <span className="current-position">{activeIndex + 1}</span>
        <span className="separator">/</span>
        <span className="total-events">{events.length}</span>
      </div>
    </div>
  );
}
