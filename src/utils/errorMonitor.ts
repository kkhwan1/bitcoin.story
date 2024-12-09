type ErrorSeverity = 'low' | 'medium' | 'high';

interface ErrorLog {
  message: string;
  stack?: string;
  timestamp: number;
  severity: ErrorSeverity;
  context?: Record<string, unknown>;
}

class ErrorMonitor {
  private static instance: ErrorMonitor;
  private logs: ErrorLog[] = [];
  private readonly MAX_LOGS = 100;

  private constructor() {
    window.onerror = (message, source, lineno, colno, error) => {
      this.logError(error || new Error(message as string), 'high', { source, lineno, colno });
    };
  }

  static getInstance(): ErrorMonitor {
    if (!ErrorMonitor.instance) {
      ErrorMonitor.instance = new ErrorMonitor();
    }
    return ErrorMonitor.instance;
  }

  logError(error: Error, severity: ErrorSeverity = 'medium', context?: Record<string, unknown>) {
    const errorLog: ErrorLog = {
      message: error.message,
      stack: error.stack,
      timestamp: Date.now(),
      severity,
      context
    };

    this.logs.unshift(errorLog);
    if (this.logs.length > this.MAX_LOGS) {
      this.logs.pop();
    }

    // 개발 환경에서는 콘솔에 출력
    if (process.env.NODE_ENV === 'development') {
      console.error('Error logged:', errorLog);
    }

    // 실제 환경에서는 서버로 전송
    if (process.env.NODE_ENV === 'production') {
      this.sendToServer(errorLog);
    }
  }

  private async sendToServer(errorLog: ErrorLog) {
    try {
      // 실제 에러 로깅 서버 엔드포인트로 변경 필요
      await fetch('/api/error-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorLog),
      });
    } catch (error) {
      console.error('Failed to send error log:', error);
    }
  }

  getLogs(): ErrorLog[] {
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
  }
}

export const errorMonitor = ErrorMonitor.getInstance(); 