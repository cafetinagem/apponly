
interface LogLevel {
  ERROR: 0;
  WARN: 1;
  INFO: 2;
  DEBUG: 3;
}

const LOG_LEVELS: LogLevel = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

class Logger {
  private static instance: Logger;
  private currentLevel: number;
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.currentLevel = this.isDevelopment ? LOG_LEVELS.DEBUG : LOG_LEVELS.ERROR;
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  setLevel(level: keyof LogLevel): void {
    this.currentLevel = LOG_LEVELS[level];
  }

  private shouldLog(level: number): boolean {
    return level <= this.currentLevel;
  }

  private formatMessage(level: string, component: string, message: string, ...args: any[]): void {
    if (!this.shouldLog(LOG_LEVELS[level as keyof LogLevel])) return;

    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] ${level} [${component}]`;
    
    if (this.isDevelopment) {
      // Full logging in development
      console.log(prefix, message, ...args);
    } else {
      // Minimal logging in production
      if (level === 'ERROR') {
        console.error(prefix, message);
      }
    }
  }

  error(component: string, message: string, ...args: any[]): void {
    this.formatMessage('ERROR', component, message, ...args);
  }

  warn(component: string, message: string, ...args: any[]): void {
    this.formatMessage('WARN', component, message, ...args);
  }

  info(component: string, message: string, ...args: any[]): void {
    this.formatMessage('INFO', component, message, ...args);
  }

  debug(component: string, message: string, ...args: any[]): void {
    this.formatMessage('DEBUG', component, message, ...args);
  }

  // Convenience methods with emojis for better readability
  success(component: string, message: string, ...args: any[]): void {
    this.info(component, `✅ ${message}`, ...args);
  }

  failure(component: string, message: string, ...args: any[]): void {
    this.error(component, `❌ ${message}`, ...args);
  }

  loading(component: string, message: string, ...args: any[]): void {
    this.info(component, `⏳ ${message}`, ...args);
  }

  admin(component: string, message: string, ...args: any[]): void {
    this.info(component, `👑 ${message}`, ...args);
  }

  realtime(component: string, message: string, ...args: any[]): void {
    this.debug(component, `📡 ${message}`, ...args);
  }
}

// Export singleton instance
export const logger = Logger.getInstance();

// Export convenience functions
export const logError = (component: string, message: string, ...args: any[]) => 
  logger.error(component, message, ...args);

export const logWarn = (component: string, message: string, ...args: any[]) => 
  logger.warn(component, message, ...args);

export const logInfo = (component: string, message: string, ...args: any[]) => 
  logger.info(component, message, ...args);

export const logDebug = (component: string, message: string, ...args: any[]) => 
  logger.debug(component, message, ...args);

export const logSuccess = (component: string, message: string, ...args: any[]) => 
  logger.success(component, message, ...args);

export const logFailure = (component: string, message: string, ...args: any[]) => 
  logger.failure(component, message, ...args);
