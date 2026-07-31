import { useState, useEffect, useRef } from 'react';
import { Home, ChevronLeft, ChevronRight } from 'lucide-react';
import '../styles/ModernTimeline.css';

const TABS = [
  { key: 'resumen', label: 'Resumen' },
  { key: 'biblico', label: 'Bíblico' },
  { key: 'fecha', label: 'Fecha' },
  { key: 'siguiente', label: 'Siguiente' },
];

export function ModernTimeline({ events }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showHome, setShowHome] = useState(true);
  const [pageFlip, setPageFlip] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('fs') || '3');
  const [showFsPanel, setShowFsPanel] = useState(false);
  const [imgCollapsed, setImgCollapsed] = useState(false);
  const tabContentRef = useRef(null);

  useEffect(() => {
    document.documentElement.dataset.fs = fontSize;
    localStorage.setItem('fs', fontSize);
  }, [fontSize]);

  const currentEvent = events[activeIndex];

  const navigate = (newIndex, direction) => {
    setPageFlip(direction);
    setTimeout(() => {
      setActiveIndex(newIndex);
      setActiveTab(0);
      setPageFlip(0);
      setImgCollapsed(false);
      if (tabContentRef.current) tabContentRef.current.scrollTop = 0;
    }, 300);
  };

  const handleNext = () => {
    if (activeIndex < events.length - 1) navigate(activeIndex + 1, 1);
  };

  const handlePrev = () => {
    if (activeIndex > 0) navigate(activeIndex - 1, -1);
  };

  const handleJump = (index) => {
    if (index !== activeIndex) navigate(index, index > activeIndex ? 1 : -1);
  };

  useEffect(() => {
    const el = tabContentRef.current;
    if (!el) return;
    const onScroll = () => setImgCollapsed(el.scrollTop > 40);
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [activeIndex, activeTab, showHome]);

  const yearLabel = currentEvent.endYear
    ? `${currentEvent.year}–${currentEvent.endYear} a.C.`
    : `${currentEvent.year} a.C.`;

  if (showHome) {
    return (
      <div className="home-screen">
        {/* Estrellas */}
        <div className="sky-stars" />

        {/* Resplandor del amanecer desde el horizonte */}
        <div className="sky-glow" />

        {/* Silueta de Jerusalén */}
        <div className="jerusalem-silhouette" />

        {/* Línea dorada del horizonte */}
        <div className="sky-horizon" />

        {/* Contenido flotando en el cielo */}
        <div className="sky-content">
          <div className="hebrew-title">סֵפֶר יִרְמְיָהוּ</div>

          <div className="sky-divider">
            <span className="sdiv-line" />
            <span className="sdiv-star">✦</span>
            <span className="sdiv-line" />
          </div>

          <h1 className="home-main-title">
            Línea de Tiempo<br />del Libro de Jeremías
          </h1>

          <p className="home-description">
            Desde el llamamiento de Josías hasta el exilio en Egipto
          </p>

          <div className="home-dates">
            <span className="home-date-label">640 a.C.</span>
            <div className="home-date-line" />
            <span className="home-date-label">586 a.C.</span>
          </div>

          <button className="start-button" onClick={() => setShowHome(false)}>
            ABRE EL LIBRO
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="modern-timeline">
      <header className="timeline-header">
        <button className="close-button" onClick={() => setShowHome(true)} title="Volver a la portada">
          <Home size={24} strokeWidth={2.5} />
        </button>
        <div className="book-title">
          <h2>El Libro de Jeremías</h2>
          <p>Evento {activeIndex + 1} de {events.length}</p>
        </div>
        <div className="hdr-right">
          <div className="page-counter">
            <span>{String(activeIndex + 1).padStart(2, '0')}</span>
          </div>
          <button
            className={`fs-btn ${showFsPanel || fontSize !== '3' ? 'active' : ''}`}
            onClick={() => setShowFsPanel(v => !v)}
            title="Tamaño del texto"
          >
            Aa
            {fontSize !== '3' && <span className="fs-pip" />}
          </button>
        </div>
      </header>

      {showFsPanel && (
        <div className="fs-overlay" onClick={() => setShowFsPanel(false)}>
          <div className="fs-panel" onClick={e => e.stopPropagation()}>
            <div className="fs-handle" />
            <div className="fs-panel-label">Tamaño del texto</div>
            <div className="fs-options">
              {[
                { level: '1', px: 9 },
                { level: '2', px: 13 },
                { level: '3', px: 17 },
                { level: '4', px: 22 },
                { level: '5', px: 28 },
              ].map(({ level, px }) => (
                <button
                  key={level}
                  className={`fs-option ${fontSize === level ? 'active' : ''}`}
                  onClick={() => setFontSize(level)}
                >
                  <span className="fs-option-a" style={{ fontSize: px }}>A</span>
                  <span className="fs-option-dot" />
                </button>
              ))}
            </div>
            <div className="fs-preview">
              "{currentEvent.keyText?.slice(0, 60)}…"
            </div>
          </div>
        </div>
      )}

      <div className={`book-page ${pageFlip === 1 ? 'flip-right' : ''} ${pageFlip === -1 ? 'flip-left' : ''}`}>
        <div className={`page-content ${imgCollapsed ? 'img-collapsed' : ''}`}>

          {/* Left: Image */}
          <div className="event-image-container">
            <img src={currentEvent.image} alt={currentEvent.title} className="event-image" />
            {currentEvent.emphasis && <div className="key-event-badge">Evento Clave</div>}
          </div>

          {/* Right: Tabbed content */}
          <div className="event-text-content">
            <div className="event-year">{yearLabel}</div>
            <h2 className="event-title">{currentEvent.title}</h2>

            <div className="tab-bar">
              {TABS.map((tab, i) => (
                <button
                  key={tab.key}
                  className={`tab-btn ${activeTab === i ? 'active' : ''}`}
                  onClick={() => setActiveTab(i)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="tab-content" ref={tabContentRef}>

              {activeTab === 0 && (
                <div className="tab-panel">
                  <p className="event-description">{currentEvent.description}</p>
                  <div className="section-block">
                    <h4 className="section-label">Importancia</h4>
                    <p>{currentEvent.importance}</p>
                  </div>
                </div>
              )}

              {activeTab === 1 && (
                <div className="tab-panel">
                  <div className="section-block">
                    <h4 className="section-label">Referencias bíblicas</h4>
                    <ul className="ref-list">
                      {currentEvent.references.map((ref, i) => (
                        <li key={i}>{ref}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="section-block key-text-block">
                    <blockquote className="key-text">
                      {currentEvent.keyText}
                    </blockquote>
                    <span className="key-text-ref">— {currentEvent.keyTextRef}</span>
                  </div>
                  <div className="section-block">
                    <h4 className="section-label">Explicación bíblica</h4>
                    <p>{currentEvent.biblicalExplanation}</p>
                  </div>
                </div>
              )}

              {activeTab === 2 && (
                <div className="tab-panel">
                  <div className="section-block">
                    <h4 className="section-label">Cómo se obtiene la fecha</h4>
                    <p className="date-calc">{currentEvent.dateCalculation}</p>
                  </div>
                  <div className="section-block">
                    <h4 className="section-label">Evidencia histórica</h4>
                    <p>{currentEvent.historicalEvidence}</p>
                  </div>
                </div>
              )}

              {activeTab === 3 && (
                <div className="tab-panel">
                  <div className="section-block">
                    <h4 className="section-label">Conexión con el siguiente evento</h4>
                    {currentEvent.connectionToNext
                      ? <p className="connection-text">{currentEvent.connectionToNext}</p>
                      : <p className="connection-text muted">Este es el último evento registrado del ministerio de Jeremías.</p>
                    }
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        <button className="page-button prev-page" onClick={handlePrev} disabled={activeIndex === 0}>
          <ChevronLeft size={22} strokeWidth={2.5} />
        </button>
        <button className="page-button next-page" onClick={handleNext} disabled={activeIndex === events.length - 1}>
          <ChevronRight size={22} strokeWidth={2.5} />
        </button>
      </div>

      <div className="timeline-section">
        <div className="timeline-header-row">
          <span className="timeline-title">Cronología</span>
          <span className="timeline-reminder">Año clave: <strong>587 a.C.</strong> — Caída de Jerusalén</span>
        </div>
        <div className="timeline-track">
          <div className="timeline-events-row">
            {events.map((event, index) => {
              const isActive = index === activeIndex;
              const display = event.endYear ? `${event.year}–${event.endYear}` : event.year;
              return (
                <div
                  key={index}
                  className={`timeline-item ${isActive ? 'active' : ''} ${event.emphasis ? 'emphasis' : ''}`}
                  onClick={() => handleJump(index)}
                >
                  <div className="timeline-dot" style={{ backgroundColor: event.color }} />
                  <div className="timeline-year">{display}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
