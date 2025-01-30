import TelegramBot from 'node-telegram-bot-api';
import { config } from '../config/index.js';
import { registerCommands } from './commands/index.js';
import { handleCallback } from './handlers/callback.js';
import { handleMessage } from './handlers/message.js';

export class Bot {
  constructor() {
    this.bot = new TelegramBot(config.TELEGRAM_BOT_TOKEN, { polling: true });
    this.setupHandlers();
  }

  setupHandlers() {
    // Register bot commands
    registerCommands(this.bot);

    // Message handler
    this.bot.on('message', async (msg) => {
      try {
        await handleMessage(this.bot, msg);
      } catch (error) {
        console.error('Error handling message:', error);
        this.bot.sendMessage(msg.chat.id, 'Lo siento, hubo un error procesando tu mensaje.');
      }
    });

    // Callback query handler for inline keyboards
    this.bot.on('callback_query', async (callbackQuery) => {
      try {
        await handleCallback(this.bot, callbackQuery);
      } catch (error) {
        console.error('Error handling callback:', error);
        this.bot.answerCallbackQuery(callbackQuery.id, {
          text: 'Lo siento, hubo un error procesando tu selección.'
        });
      }
    });

    // Error handler
    this.bot.on('polling_error', (error) => {
      console.error('Polling error:', error);
    });
  }

  start() {
    console.log('Bot started successfully');
  }
}