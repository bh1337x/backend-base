import * as fs from 'fs';
import path from 'path';
import { program } from 'commander';
import { attach, logger } from '../core/cli';

async function main() {
  program.name('backend-cli').version('1.0.0');

  const commandsDir = path.join(__dirname, 'commands');
  const commandEntries = fs.readdirSync(commandsDir);
  for (const commandEntry of commandEntries) {
    const commandPath = path.join(commandsDir, commandEntry);
    const commandModule = await import(commandPath);
    await attach(program, commandModule.default, commandPath);
  }

  await program.parseAsync(process.argv);
}

if (require.main === module) {
  main().then(
    () => process.exit(0),
    (e) => logger.error(e)
  );
}
