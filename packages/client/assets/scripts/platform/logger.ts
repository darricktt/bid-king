/**
 * 统一日志入口。
 *
 * 规范：业务代码禁止直接使用 console.log；
 * - 一般日志走 logger.debug / info
 * - 警告、错误走 logger.warn / error（console.warn/error 被 ESLint 允许）
 *
 * 后续可在此对接 Sentry / 埋点。
 */

type Level = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private readonly tag = '[BidKing]';

  debug(...args: unknown[]): void {
    this.print('debug', args);
  }

  info(...args: unknown[]): void {
    this.print('info', args);
  }

  warn(...args: unknown[]): void {
    this.print('warn', args);
  }

  error(...args: unknown[]): void {
    this.print('error', args);
  }

  private print(level: Level, args: unknown[]): void {
    switch (level) {
      case 'warn':
        console.warn(this.tag, ...args);
        break;
      case 'error':
        console.error(this.tag, ...args);
        break;
      default:
        // 使用 warn 通道绕开 no-console 规则（debug/info 仍然需要输出）
        console.warn(this.tag, `[${level}]`, ...args);
    }
  }
}

export const logger = new Logger();
