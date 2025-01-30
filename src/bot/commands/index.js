import { startCommand } from './start.js';
import { helpCommand } from './help.js';
import { studyCommand } from './study.js';
import { creditsCommand } from './credits.js';
import { progressCommand } from './progress.js';

const commands = [
  { command: 'start', description: 'Iniciar el bot' },
  { command: 'help', description: 'Ver comandos disponibles' },
  { command: 'study', description: 'Comenzar a estudiar' },
  { command: 'credits', description: 'Ver tus créditos' },
  { command: 'progress', description: 'Ver tu progreso' }
];

export function registerCommands(bot) {
  // Set bot commands
  bot.setMyCommands(commands);

  // Register command handlers
  bot.onText(/\/start/, (msg) => startCommand(bot, msg));
  bot.onText(/\/help/, (msg) => helpCommand(bot, msg));
  bot.onText(/\/study/, (msg) => studyCommand(bot, msg));
  bot.onText(/\/credits/, (msg) => creditsCommand(bot, msg));
  bot.onText(/\/progress/, (msg) => progressCommand(bot, msg));
}