import { Command } from './command.interface.js';
import chalk from 'chalk';

export class HelpCommand implements Command {
  public getName(): string {
    return '--help';
  }

  public async execute(..._parameters: string[]): Promise<void> {
    console.info(`
Доступные команды:
  ${chalk.yellow('--help     — выводит информацию о списке команд')}
  ${chalk.green('--version  — выводит версию приложения')}
  ${chalk.blue('--import <path> [-] [-] <host> <dbname> <salt> — импорт TSV в MongoDB (для локальной БД без auth: - -)')}
  ${chalk.cyan('--generate — генерирует произвольное количество тестовых данных')}
`);
  }
}
