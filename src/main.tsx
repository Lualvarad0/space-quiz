import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppErrorBoundary from './AppErrorBoundary'
import ErrorPage from './ErrorPage'
import './index.css'
import App from './App.tsx'

const isHome = window.location.pathname === '/' || window.location.pathname === '/index.html'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isHome ? (
      <AppErrorBoundary>
        <App />
      </AppErrorBoundary>
    ) : (
      <ErrorPage type="not-found" />
    )}
  </StrictMode>,
)
