import { createUser } from '../../services/users.js';

export async function startCommand(bot, msg) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const username = msg.from.username;

  try {
    // Create or get user
    await createUser({
      telegramId: userId,
      username: username
    });

    const welcomeMessage = `
¡Bienvenido al Bot de Preparación para Timonel! 🚢

Este bot te ayudará a prepararte para el examen de Timonel de Yate en Argentina.

Tenemos tres áreas principales de estudio:
📍 Navegación
🛟 Seguridad
📜 Legislación y Reglamentación

Comandos disponibles:
/study - Comenzar a estudiar
/progress - Ver tu progreso
/credits - Ver tus créditos disponibles
/help - Ver ayuda y comandos

¡Tienes 100 créditos iniciales para comenzar! 
    `;

    const keyboard = {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Comenzar a Estudiar", callback_data: "start_study" }],
          [{ text: "Ver Tutorial", callback_data: "tutorial" }]
        ]
      }
    };

    await bot.sendMessage(chatId, welcomeMessage, keyboard);
  } catch (error) {
    console.error('Error in start command:', error);
    await bot.sendMessage(chatId, 'Lo siento, hubo un error al iniciar. Por favor, intenta nuevamente.');
  }
}