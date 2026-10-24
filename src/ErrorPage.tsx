import { useState } from 'react'
import './ErrorPage.css'

export interface ErrorPageProps {
  type: 'not-found' | 'unexpected'
  onRetry?: () => void
}

function ErrorPage({ type, onRetry }: ErrorPageProps) {
  const [minimized, setMinimized] = useState(false)
  const [closed, setClosed] = useState(false)
  const notFound = type === 'not-found'

  return (
    <main className="error-page">
      <a className="error-brand" href="/" aria-label="Órbita, ir al inicio">
        <span className="error-brand-mark" aria-hidden="true">O</span>
        <span>ÓRBITA<span>.</span></span>
      </a>

      <div className="error-stars" aria-hidden="true">
        <span>✦</span><span>·</span><span>✧</span><span>·</span><span>✦</span>
      </div>

      <section className="error-content" aria-labelledby="error-title">
        <span className="error-code">{notFound ? 'ERROR 404 · SEÑAL PERDIDA' : 'ERROR · CONTROL DE MISIÓN'}</span>
        <h1 id="error-title">{notFound ? 'Esta página se perdió en el espacio.' : 'Ups, parece que algo sucedió.'}</h1>
        <p>
          {notFound
            ? 'No encontramos estas coordenadas. Puedes volver al centro de control y retomar tu misión.'
            : 'La ventana de control encontró un problema. Tu misión guardada sigue a salvo en este navegador.'}
        </p>

        {closed ? (
          <button className="window-restore" type="button" onClick={() => setClosed(false)}>
            <span aria-hidden="true">▣</span> Restaurar ventana de diagnóstico
          </button>
        ) : (
          <div className={`error-window ${minimized ? 'is-minimized' : ''}`}>
            <div className="window-titlebar">
              <span className="window-indicator" aria-hidden="true" />
              <span>diagnostico_de_mision.exe</span>
              <div className="window-controls">
                <button type="button" aria-label={minimized ? 'Restaurar ventana' : 'Minimizar ventana'} onClick={() => setMinimized(!minimized)}>
                  {minimized ? '□' : '−'}
                </button>
                <button type="button" aria-label="Cerrar ventana" onClick={() => setClosed(true)}>×</button>
              </div>
            </div>
            {!minimized && (
              <div className="window-body">
                <div className="window-alert-icon" aria-hidden="true">{notFound ? '?' : '!'}</div>
                <div className="window-message">
                  <strong>{notFound ? 'Destino no localizado' : 'Interferencia inesperada'}</strong>
                  <span>{notFound ? 'La ruta solicitada no existe en el mapa.' : 'Intenta restablecer la conexión con el centro de control.'}</span>
                </div>
                <span className="window-status"><i /> SISTEMAS ESTABLES</span>
              </div>
            )}
          </div>
        )}

        <div className="error-actions">
          {notFound ? (
            <a className="error-primary-action" href="/">Volver al centro de control <span aria-hidden="true">↗</span></a>
          ) : (
            <button className="error-primary-action" type="button" onClick={onRetry}>Intentar de nuevo <span aria-hidden="true">↻</span></button>
          )}
          <a className="error-secondary-action" href="/">Ir al inicio</a>
        </div>
      </section>

      <footer className="error-footer"><span>ÓRBITA · CENTRO DE CONTROL</span><span>CONEXIÓN LOCAL · {notFound ? 'RUTA NO DISPONIBLE' : 'EN ESPERA'}</span></footer>
    </main>
  )
}

export default ErrorPage
