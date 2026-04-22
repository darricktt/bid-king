import pino from 'pino';

/**
 * 统一日志入口。开发环境使用 pino-pretty 彩色输出，生产环境输出 JSON。
 */
export const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  transport:
    process.env.NODE_ENV !== 'production'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:HH:MM:ss.l',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
});
