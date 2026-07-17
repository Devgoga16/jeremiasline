import { ModernTimeline } from './components/ModernTimeline';
import { timelineEvents } from './data/events';
import './App.css';

function App() {
  return (
    <div className="app">
      <ModernTimeline events={timelineEvents} />
    </div>
  );
}

export default App;
