import { Logger } from './logger.interface.js';
import { getErrorMessage } from '../../helpers/index.js';

export class ConsoleLogger implements Logger {
  public debug(message: string, ...args: unknown[]): void {
    console.debug(message, ...args);
  }

  public error(message: string, ...args: unknown[]): void {
    console.error(message, ...args);

    const error = args.find((arg): arg is Error => arg instanceof Error);
    if (error) {
      console.error(`Error message: ${getErrorMessage(error)}`);
    }
  }

  public info(message: string, ...args: unknown[]): void {
    console.info(message, ...args);
  }

  public warn(message: string, ...args: unknown[]): void {
    console.warn(message, ...args);
  }
}
