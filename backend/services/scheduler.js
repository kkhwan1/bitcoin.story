import cron from 'node-cron';
import { createBackup, cleanupOldBackups } from './backup.js';
import { sendNotification, NotificationType } from './notification.js';
import logger from '../config/logger.js';

export const initializeScheduler = () => {
  // 매일 새벽 3시에 백업 실행
  cron.schedule('0 3 * * *', async () => {
    try {
      const backupPath = await createBackup();
      await sendNotification(
        `Database backup completed successfully: ${backupPath}`,
        NotificationType.INFO
      );
    } catch (error) {
      await sendNotification(
        `Database backup failed: ${error.message}`,
        NotificationType.ERROR
      );
    }
  });

  // 매주 일요일 새벽 4시에 오래된 백업 정리
  cron.schedule('0 4 * * 0', async () => {
    try {
      await cleanupOldBackups();
      await sendNotification(
        'Old backups cleaned up successfully',
        NotificationType.INFO
      );
    } catch (error) {
      await sendNotification(
        `Failed to clean up old backups: ${error.message}`,
        NotificationType.ERROR
      );
    }
  });

  logger.info('Scheduler initialized');
}; 