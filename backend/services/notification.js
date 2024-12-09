import nodemailer from 'nodemailer';
import Slack from '@slack/webhook';
import logger from '../config/logger.js';

// 이메일 전송 설정
const emailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Slack 웹훅 설정
const slackWebhook = new Slack.IncomingWebhook(process.env.SLACK_WEBHOOK_URL);

export const NotificationType = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error'
};

export const NotificationChannel = {
  EMAIL: 'email',
  SLACK: 'slack',
  ALL: 'all'
};

export const sendNotification = async (message, type = NotificationType.INFO, channel = NotificationChannel.ALL) => {
  try {
    const promises = [];

    if (channel === NotificationChannel.EMAIL || channel === NotificationChannel.ALL) {
      promises.push(sendEmail(message, type));
    }

    if (channel === NotificationChannel.SLACK || channel === NotificationChannel.ALL) {
      promises.push(sendSlackMessage(message, type));
    }

    await Promise.all(promises);
    logger.info('Notification sent successfully', { message, type, channel });
  } catch (error) {
    logger.error('Failed to send notification', { error, message, type, channel });
  }
};

const sendEmail = async (message, type) => {
  const subject = `[${type.toUpperCase()}] System Notification`;
  
  await emailTransporter.sendMail({
    from: process.env.SMTP_FROM,
    to: process.env.ADMIN_EMAIL,
    subject,
    text: message,
    html: `<p style="color: ${getColorForType(type)}">${message}</p>`
  });
};

const sendSlackMessage = async (message, type) => {
  const emoji = getEmojiForType(type);
  
  await slackWebhook.send({
    text: `${emoji} *${type.toUpperCase()}*\n${message}`
  });
};

const getColorForType = (type) => {
  switch (type) {
    case NotificationType.ERROR:
      return '#ff0000';
    case NotificationType.WARNING:
      return '#ffa500';
    default:
      return '#000000';
  }
};

const getEmojiForType = (type) => {
  switch (type) {
    case NotificationType.ERROR:
      return '🚨';
    case NotificationType.WARNING:
      return '⚠️';
    default:
      return 'ℹ️';
  }
}; 