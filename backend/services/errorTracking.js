import Sentry from '@sentry/node';
import { ProfilingIntegration } from '@sentry/profiling-node';
import logger from '../config/logger.js';

export const initializeErrorTracking = () => {
  if (process.env.NODE_ENV === 'production') {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      integrations: [
        new ProfilingIntegration(),
      ],
      tracesSampleRate: 1.0,
      profilesSampleRate: 1.0,
      environment: process.env.NODE_ENV
    });
  }
};

export const trackError = (error, context = {}) => {
  logger.error('Error occurred:', { error, context });
  
  if (process.env.NODE_ENV === 'production') {
    Sentry.withScope(scope => {
      scope.setExtras(context);
      Sentry.captureException(error);
    });
  }
};

export const trackPerformance = (name, duration, context = {}) => {
  logger.info('Performance metric:', { name, duration, ...context });
  
  if (process.env.NODE_ENV === 'production') {
    Sentry.addBreadcrumb({
      category: 'performance',
      message: `${name}: ${duration}ms`,
      data: context,
      level: 'info'
    });
  }
}; 