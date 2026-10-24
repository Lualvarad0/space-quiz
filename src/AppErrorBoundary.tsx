import { Component, type ErrorInfo, type ReactNode } from 'react'
import ErrorPage from './ErrorPage'

interface AppErrorBoundaryProps {
  children: ReactNode
}

interface AppErrorBoundaryState {
  error: Error | null
  retryKey: number
}

class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { error: null, retryKey: 0 }

  static getDerivedStateFromError(error: Error): Partial<AppErrorBoundaryState> {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Error inesperado al mostrar la aplicación.', error, info.componentStack)
  }

  retry = () => {
    this.setState((state) => ({ error: null, retryKey: state.retryKey + 1 }))
  }

  render() {
    if (this.state.error) {
      return <ErrorPage type="unexpected" onRetry={this.retry} />
    }

    return <div key={this.state.retryKey}>{this.props.children}</div>
  }
}

export default AppErrorBoundary
