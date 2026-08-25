#!/usr/bin/env node
import { CLIApplication } from './cli/index.js';
import { glob } from 'glob';
import { Command } from './cli/commands/command.interface.js';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

async function bootstrap() {
  const cliApplication = new CLIApplication();
  const currentDir = dirname(fileURLToPath(import.meta.url));

  const importedCommands: Command[] = [];
  const files = glob.sync('cli/commands/*.command.{js,ts}', { cwd: currentDir });

  for (const file of files) {
    const modulePath = pathToFileURL(resolve(currentDir, file)).href;
    const moduleExportItems = await import(modulePath);

    for (const exportKey of Object.keys(moduleExportItems)) {
      const exportItem = moduleExportItems[exportKey];

      if (exportItem.prototype && typeof exportItem.prototype.execute === 'function') {
        const commandInstance = new exportItem();
        importedCommands.push(commandInstance);
      }
    }

  }
  cliApplication.registerCommands(importedCommands);
  cliApplication.processCommand(process.argv);

}

bootstrap();

