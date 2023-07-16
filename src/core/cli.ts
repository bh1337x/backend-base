import type { Command } from 'commander';
import type {
  CommandDirectoryEntry,
  CommandDirectory,
  CommandFileEntry,
  CommandFile,
  CommandEntry,
  CommandOptions,
} from '../types/core';
import * as fs from 'fs';
import path from 'path';
import { createLogger } from '../lib';

export function commands(entry: CommandDirectory): CommandDirectoryEntry {
  return {
    isDirectory: true,
    meta: entry,
  };
}

export function command<T extends CommandOptions | undefined>(
  entry: CommandFile<T>
): CommandFileEntry<T> {
  return {
    isDirectory: false,
    meta: entry,
  };
}

export async function attach(program: Command, entry: CommandEntry, file: string) {
  const command = program.command(entry.meta.name);
  command.description(entry.meta.description);

  if (entry.isDirectory) {
    const subCommands = fs
      .readdirSync(file)
      .filter(
        (subCommand) =>
          subCommand !== 'index.js' && subCommand !== 'index.ts' && !subCommand.endsWith('.map')
      );
    for (const subCommand of subCommands) {
      const subCommandPath = path.join(file, subCommand);
      const subCommandModule = await import(subCommandPath);
      await attach(command, subCommandModule.default, subCommandPath);
    }
  } else {
    const handler = entry.meta.handler;

    if ('options' in handler) {
      const options = handler.options;

      for (const optionKey in options) {
        const option = options[optionKey];

        if (typeof option.defaultValue != 'undefined') {
          command.option(option.flags, option.description, option.defaultValue!);
        } else {
          command.requiredOption(option.flags, option.description);
        }
      }
    }

    command.action(handler.action);
  }
}

export const logger = createLogger('cli');
