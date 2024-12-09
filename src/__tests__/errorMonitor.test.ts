import { errorMonitor } from '../utils/errorMonitor';

describe('ErrorMonitor', () => {
  beforeEach(() => {
    errorMonitor.clearLogs();
    global.fetch = jest.fn();
  });

  it('logs errors correctly', () => {
    const error = new Error('Test error');
    errorMonitor.logError(error, 'high', { test: true });
    const logs = errorMonitor.getLogs();
    
    expect(logs).toHaveLength(1);
    expect(logs[0]).toMatchObject({
      message: 'Test error',
      severity: 'high',
      context: { test: true }
    });
  });

  it('maintains max log limit', () => {
    for (let i = 0; i < 150; i++) {
      errorMonitor.logError(new Error(`Error ${i}`));
    }
    
    expect(errorMonitor.getLogs()).toHaveLength(100);
  });

  it('sends logs to server in production', async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    
    errorMonitor.logError(new Error('Test error'));
    
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/error-logs',
      expect.any(Object)
    );
    
    process.env.NODE_ENV = originalEnv;
  });
}); 