import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import logger from '../config/logger.js';

const BACKUP_DIR = path.join(process.cwd(), 'backups');

// 백업 디렉토리가 없으면 생성
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

export const createBackup = async () => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(BACKUP_DIR, `backup-${timestamp}`);
  
  const mongodump = spawn('mongodump', [
    `--uri=${process.env.MONGODB_URI}`,
    `--out=${backupPath}`,
    '--gzip'
  ]);

  mongodump.stdout.on('data', (data) => {
    logger.info(`Backup progress: ${data}`);
  });

  mongodump.stderr.on('data', (data) => {
    logger.error(`Backup error: ${data}`);
  });

  return new Promise((resolve, reject) => {
    mongodump.on('close', (code) => {
      if (code === 0) {
        logger.info(`Backup completed: ${backupPath}`);
        resolve(backupPath);
      } else {
        reject(new Error(`Backup failed with code ${code}`));
      }
    });
  });
};

// 오래된 백업 정리
export const cleanupOldBackups = async (maxAge = 7) => {
  const files = await fs.promises.readdir(BACKUP_DIR);
  const now = new Date();

  for (const file of files) {
    const filePath = path.join(BACKUP_DIR, file);
    const stats = await fs.promises.stat(filePath);
    const age = (now - stats.mtime) / (1000 * 60 * 60 * 24); // 일 단위

    if (age > maxAge) {
      await fs.promises.rm(filePath, { recursive: true });
      logger.info(`Removed old backup: ${filePath}`);
    }
  }
}; 