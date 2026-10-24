import { useState } from 'react'
import {
  advanceDay,
  createMission,
  getEventChoiceImpact,
  getEventForDay,
  MISSION_DAYS,
  resolveEventChoice,
  type MissionState,
  type ResourceName,
} from './mission'
import './App.css'

const resourceDetails: {
  name: ResourceName
  label: string
  unit: string
  icon: string
}[] = [
  { name: 'combustible', label: 'Combustible', unit: '%', icon: '◉' },
  { name: 'energia', label: 'Energía', unit: '%', icon: 'ϟ' },
  { name: 'suministros', label: 'Suministros', unit: '%', icon: '⌁' },
  { name: 'casco', label: 'Integridad del casco', unit: '%', icon: '⬡' },
]

function App() {
  const [mission, setMission] = useState<MissionState>(createMission)
  const event = getEventForDay(mission.day)
  const eventResolved = event ? mission.resolvedEvents.includes(event.day) : false
  const active = mission.status === 'active'

  function chooseEvent(choiceId: string) {
    setMission((current) => resolveEventChoice(current, choiceId))
  }

  function continueMission() {
    setMission((current) => advanceDay(current))
  }

  const statusLabel = {
    active: 'En curso',
    success: 'Misión completada',
    failure: 'Misión finalizada',
  }[mission.status]

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#mission" aria-label="Órbita, inicio">
          <span className="brand-mark" aria-hidden="true">O</span>
          <span>ÓRBITA<span className="brand-period">.</span></span>
        </a>
        <div className="topbar-center">
          <span className="signal-dot" />
          CONTROL DE MISIÓN <span className="topbar-divider">/</span> CENTRO ESPACIAL
        </div>
        <div className="topbar-right">
          <span className="status-pill"><span className="status-dot" />{statusLabel}</span>
          <span className="avatar" aria-label="Tripulación">CM</span>
        </div>
      </header>

      <div className="page-content" id="mission">
        <div className="breadcrumbs"><span>MISIONES</span><span className="crumb-slash">/</span><strong>EXPEDICIÓN A EUROPA</strong></div>

        <section className="mission-heading">
          <div>
            <div className="eyebrow"><span className="eyebrow-line" /> {active ? 'MISIÓN EN CURSO · 2049' : mission.status === 'success' ? 'MISIÓN COMPLETADA · 2049' : 'MISIÓN INTERRUMPIDA · 2049'}</div>
            <h1>Expedición a <span>Europa</span></h1>
            <p className="mission-subtitle">Explora la luna oceánica. Lleva a la tripulación a casa.</p>
          </div>
          <div className="day-counter">
            <span className="day-counter-label">DÍA DE MISIÓN</span>
            <span className="day-counter-number">{String(mission.day).padStart(2, '0')}<small> / {MISSION_DAYS}</small></span>
          </div>
        </section>

        <section className="mission-progress" aria-label="Progreso de la misión">
          <div className="progress-topline">
            <span>TRAYECTORIA DE VUELO</span>
            <span>{mission.progress} DE 3 HITOS COMPLETADOS</span>
          </div>
          <div className="progress-track" role="progressbar" aria-valuenow={mission.progress} aria-valuemin={0} aria-valuemax={3} aria-label="Hitos de misión completados">
            <span style={{ width: `${Math.min(100, (mission.progress / 3) * 100)}%` }} />
          </div>
          <div className="flight-path">
            <span className="path-stop path-done"><span>01</span><i>Órbita terrestre</i></span>
            <span className={`path-stop ${mission.progress >= 1 ? 'path-done' : ''}`}><span>02</span><i>Tránsito profundo</i></span>
            <span className={`path-stop ${mission.progress >= 2 ? 'path-done' : ''}`}><span>03</span><i>Aproximación</i></span>
            <span className={`path-stop ${mission.progress >= 3 ? 'path-done' : ''}`}><span>04</span><i>Europa</i></span>
          </div>
        </section>

        <div className="dashboard-grid">
          <section className="panel resources-panel" aria-labelledby="resources-title">
            <div className="panel-heading">
              <div>
                <span className="section-index">01 / SISTEMAS</span>
                <h2 id="resources-title">Estado de la nave</h2>
              </div>
              <span className="panel-icon" aria-hidden="true">⌘</span>
            </div>
            <div className="resource-list">
              {resourceDetails.map((resource) => {
                const value = mission.resources[resource.name]
                const isLow = value <= 25
                return (
                  <div className="resource-item" key={resource.name}>
                    <div className="resource-row">
                      <span className={`resource-icon resource-${resource.name}`} aria-hidden="true">{resource.icon}</span>
                      <span className="resource-label">{resource.label}</span>
                      <span className={`resource-value ${isLow ? 'resource-low' : ''}`}>{value}<small> {resource.unit}</small></span>
                    </div>
                    <div className="resource-track" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label={`${resource.label}: ${value}%`}>
                      <span className={`${isLow ? 'bar-low' : ''}`} style={{ width: `${value}%` }} />
                    </div>
                    {isLow && <p className="resource-warning">Nivel bajo: revisa tus próximas decisiones.</p>}
                  </div>
                )
              })}
            </div>
            <div className="resource-footnote"><span className="info-mark">i</span> El consumo diario se aplica al avanzar la jornada.</div>
          </section>

          <section className="panel event-panel" aria-labelledby="event-title">
            <div className="panel-heading event-heading">
              <div>
                <span className="section-index">02 / REGISTRO DE VUELO</span>
                <h2 id="event-title">{event && !eventResolved ? 'Decisión requerida' : 'Bitácora de misión'}</h2>
              </div>
              <span className="day-tag">DÍA {String(mission.day).padStart(2, '0')}</span>
            </div>

            {active && event && !eventResolved ? (
              <div className="event-content">
                <div className="event-illustration" aria-hidden="true">
                  <div className="orbit orbit-one" /><div className="orbit orbit-two" />
                  <span className="planet planet-large" /><span className="planet planet-small" />
                  <span className="event-star star-one">✦</span><span className="event-star star-two">·</span>
                  <span className="event-illustration-label">SEÑAL DETECTADA · DÍA {event.day}</span>
                </div>
                <div className="event-copy">
                  <span className="event-type">EVENTO DE MISIÓN</span>
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                </div>
                <div className="choice-list">
                  {event.choices.map((choice, index) => {
                    const impact = getEventChoiceImpact(mission, choice)
                    const resourceImpacts = resourceDetails.flatMap((resource) => {
                      const change = impact.resources[resource.name]
                      if (change === undefined) return []
                      return [
                        change === 0
                          ? `${resource.label}: sin cambio`
                          : `${resource.label} ${change > 0 ? '+' : '−'}${Math.abs(change)}${resource.unit}`,
                      ]
                    })
                    const impactText = [
                      ...resourceImpacts,
                      `Progreso +${impact.progress} ${impact.progress === 1 ? 'hito' : 'hitos'}`,
                    ].join(' · ')
                    return (
                      <button className="choice-card" key={choice.id} type="button" onClick={() => chooseEvent(choice.id)}>
                        <span className="choice-number">0{index + 1}</span>
                        <span className="choice-copy">
                          <strong>{choice.title}</strong>
                          <small>{choice.description}</small>
                          <span className="choice-impact">{impactText}</span>
                        </span>
                        <span className="choice-arrow" aria-hidden="true">↗</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ) : active ? (
              <div className="log-content">
                <div className="log-status"><span className="log-check">✓</span><span>{eventResolved ? 'DECISIÓN REGISTRADA' : 'SISTEMAS NOMINALES'}</span></div>
                <p className="log-summary">{eventResolved ? 'La tripulación ha ejecutado el plan elegido. Revisa los niveles de la nave antes de continuar.' : 'Sin alertas nuevas. Los sistemas se mantienen dentro de los parámetros previstos.'}</p>
                <div className="recent-log">
                  <span className="recent-log-title">ÚLTIMAS ACTUALIZACIONES</span>
                  {mission.log.slice(0, 3).map((entry, index) => (
                    <p key={`${entry}-${index}`}><span className="log-bullet" />{entry}</p>
                  ))}
                </div>
              </div>
            ) : (
              <div className={`mission-result ${mission.status}`}>
                <span className="result-symbol">{mission.status === 'success' ? '✦' : '!'}</span>
                <span className="event-type">{mission.status === 'success' ? 'OBJETIVO ALCANZADO' : 'MISIÓN INTERRUMPIDA'}</span>
                <h3>{mission.status === 'success' ? 'Europa, a la vista.' : 'La misión ha terminado.'}</h3>
                <p>{mission.log[0]}</p>
                <button className="restart-button" type="button" onClick={() => setMission(createMission())}>Iniciar nueva misión <span aria-hidden="true">↗</span></button>
              </div>
            )}

            {active && (
              <div className="event-footer">
                <span><span className="footer-live-dot" /> COMUNICACIÓN ESTABLE</span>
                <span>TIEMPO TERRESTRE · 14:32 UTC</span>
              </div>
            )}
          </section>

          <aside className="panel timeline-panel" aria-labelledby="timeline-title">
            <div className="panel-heading">
              <div>
                <span className="section-index">03 / PLAN DE VUELO</span>
                <h2 id="timeline-title">Jornadas</h2>
              </div>
              <span className="timeline-count">0{MISSION_DAYS}</span>
            </div>
            <div className="timeline-list">
              {Array.from({ length: MISSION_DAYS }, (_, index) => {
                const day = index + 1
                const dayEvent = getEventForDay(day)
                const resolved = mission.resolvedEvents.includes(day)
                const current = active && mission.day === day
                const complete = mission.day > day || (mission.status === 'success' && mission.day === day)
                const failedHere = mission.status === 'failure' && mission.day === day
                return (
                  <div className={`timeline-item ${current ? 'timeline-current' : ''} ${complete ? 'timeline-complete' : ''} ${failedHere ? 'timeline-failed' : ''}`} key={day}>
                    <span className="timeline-marker">{complete ? '✓' : failedHere ? '!' : String(day).padStart(2, '0')}</span>
                    <div className="timeline-copy">
                      <strong>Día {String(day).padStart(2, '0')}</strong>
                      <span>{dayEvent ? dayEvent.title : day === 7 ? 'Llegada al objetivo' : 'Tránsito orbital'}</span>
                    </div>
                    {dayEvent && !resolved && complete && <span className="timeline-event-status">·</span>}
                    {current && <span className="timeline-now">AHORA</span>}
                  </div>
                )
              })}
            </div>
            <div className="timeline-note"><span className="timeline-note-icon">↗</span><span>La misión requiere <strong>3 hitos</strong> para confirmar el objetivo.</span></div>
          </aside>
        </div>

        <footer className="mission-controls">
          <div className="control-hint">
            <span className="hint-key">⌘</span>
            <span>{event && !eventResolved && active ? 'Elige una respuesta para continuar.' : 'Un día de misión consume recursos de la nave.'}</span>
          </div>
          {active && (
            <button
              className="advance-button"
              type="button"
              onClick={continueMission}
              disabled={Boolean(event && !eventResolved)}
            >
              {mission.day === MISSION_DAYS ? 'Finalizar misión' : 'Avanzar jornada'}
              <span className="button-arrow" aria-hidden="true">→</span>
            </button>
          )}
        </footer>
        <div className="page-signoff"><span>ÓRBITA · CENTRO DE CONTROL</span><span>EXPLORAR LO DESCONOCIDO, JUNTOS.</span></div>
      </div>
    </main>
  )
}

export default App
