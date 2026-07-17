import { TimelineEvent } from './TimelineEvent';
import '../styles/Timeline.css';

export function Timeline({ events }) {
  return (
    <div className="timeline-container">
      <div className="timeline-line"></div>
      <div className="timeline-events">
        {events.map((event, index) => (
          <TimelineEvent
            key={event.id}
            event={event}
            isAlternate={index % 2 === 1}
          />
        ))}
      </div>
    </div>
  );
}
