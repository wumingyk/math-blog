/**
 * 日志工具函数
 */

const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

const SYMBOLS = {
  info: 'ℹ️',
  success: '✅',
  warning: '⚠️',
  error: '❌',
  debug: '🔍',
};

/**
 * 日志级别
 */
export const LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARNING: 2,
  ERROR: 3,
  SUCCESS: 4,
};

class Logger {
  constructor(minLevel = LogLevel.INFO) {
    this.minLevel = minLevel;
  }

  /**
   * 设置最小日志级别
   * @param {number} level - 日志级别
   */
  setLevel(level) {
    this.minLevel = level;
  }

  /**
   * 格式化日志消息
   * @param {string} level - 日志级别名称
   * @param {string} symbol - 符号
   * @param {string} color - 颜色代码
   * @param {string} message - 消息
   * @returns {string} 格式化后的消息
   */
  format(level, symbol, color, message) {
    const timestamp = new Date().toISOString();
    return `${color}[${timestamp}] ${symbol} ${message}${COLORS.reset}`;
  }

  /**
   * 输出调试日志
   * @param {string} message - 消息
   */
  debug(message) {
    if (this.minLevel <= LogLevel.DEBUG) {
      console.log(this.format('DEBUG', SYMBOLS.debug, COLORS.cyan, message));
    }
  }

  /**
   * 输出信息日志
   * @param {string} message - 消息
   */
  info(message) {
    if (this.minLevel <= LogLevel.INFO) {
      console.log(this.format('INFO', SYMBOLS.info, COLORS.blue, message));
    }
  }

  /**
   * 输出警告日志
   * @param {string} message - 消息
   */
  warning(message) {
    if (this.minLevel <= LogLevel.WARNING) {
      console.warn(this.format('WARNING', SYMBOLS.warning, COLORS.yellow, message));
    }
  }

  /**
   * 输出错误日志
   * @param {string} message - 消息
   * @param {Error} error - 错误对象（可选）
   */
  error(message, error) {
    if (this.minLevel <= LogLevel.ERROR) {
      console.error(this.format('ERROR', SYMBOLS.error, COLORS.red, message));
      if (error) {
        console.error(`${COLORS.red}${error.stack || error.message}${COLORS.reset}`);
      }
    }
  }

  /**
   * 输出成功日志
   * @param {string} message - 消息
   */
  success(message) {
    if (this.minLevel <= LogLevel.SUCCESS) {
      console.log(this.format('SUCCESS', SYMBOLS.success, COLORS.green, message));
    }
  }

  /**
   * 分隔线
   * @param {string} char - 分隔字符
   * @param {number} length - 长度
   */
  separator(char = '=', length = 50) {
    console.log(char.repeat(length));
  }
}

// 创建默认 logger 实例
export const logger = new Logger();

// 导出 Logger 类，允许创建自定义实例
export default Logger;
