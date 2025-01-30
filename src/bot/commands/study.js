import { config } from '../../config/index.js';
import { getUserCredits, updateUserCredits } from '../../services/users.js';
import { getQuestionsBySubject, validateAnswer } from '../../services/questions.js';

export async function studyCommand(bot, msg) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  try {
    // Check user credits
    const credits = await getUserCredits(userId);
    if (credits <= 0) {
      return bot.sendMessage(
        chatId,
        '❌ No tienes créditos suficientes para estudiar. Usa /credits para ver opciones de obtener más créditos.'
      );
    }

    // Show subject selection keyboard
    const keyboard = {
      reply_markup: {
        inline_keyboard: [
          [{ text: '📍 Navegación', callback_data: 'study_NAVIGATION' }],
          [{ text: '🛟 Seguridad', callback_data: 'study_SAFETY' }],
          [{ text: '📜 Legislación', callback_data: 'study_LEGISLATION' }]
        ]
      }
    };

    await bot.sendMessage(
      chatId,
      '¿Qué tema te gustaría estudiar hoy?\n\nCada pregunta cuesta 5 créditos.',
      keyboard
    );

  } catch (error) {
    console.error('Error in study command:', error);
    await bot.sendMessage(
      chatId,
      'Lo siento, hubo un error al iniciar el estudio. Por favor, intenta nuevamente.'
    );
  }
}

export async function handleStudyCallback(bot, callbackQuery) {
  const chatId = callbackQuery.message.chat.id;
  const userId = callbackQuery.from.id;
  const [action, subject] = callbackQuery.data.split('_');

  try {
    if (action === 'study') {
      // Show units for selected subject
      const units = config.SUBJECTS[subject].units;
      const keyboard = {
        reply_markup: {
          inline_keyboard: Object.entries(units).map(([unitNum, unitName]) => [{
            text: `Unidad ${unitNum}: ${unitName.substring(0, 30)}...`,
            callback_data: `unit_${subject}_${unitNum}`
          }])
        }
      };

      await bot.editMessageText(
        `Has seleccionado: ${config.SUBJECTS[subject].name}\n\nSelecciona una unidad:`,
        {
          chat_id: chatId,
          message_id: callbackQuery.message.message_id,
          reply_markup: keyboard.reply_markup
        }
      );
    }
    
    else if (action === 'unit') {
      const [, subject, unit] = callbackQuery.data.split('_');
      
      // Get questions for the unit
      const questions = await getQuestionsBySubject(subject, parseInt(unit), 1);
      if (!questions.length) {
        return bot.sendMessage(
          chatId,
          'No hay preguntas disponibles para esta unidad en este momento.'
        );
      }

      const question = questions[0];
      const keyboard = {
        reply_markup: {
          inline_keyboard: question.options.map((option, index) => [{
            text: option,
            callback_data: `answer_${question._id}_${String.fromCharCode(97 + index)}`
          }])
        }
      };

      await bot.editMessageText(
        `${question.question}\n\nSelecciona la respuesta correcta:`,
        {
          chat_id: chatId,
          message_id: callbackQuery.message.message_id,
          reply_markup: keyboard.reply_markup
        }
      );

      // Deduct credits
      await updateUserCredits({
        telegramId: userId,
        amount: -config.CREDITS_PER_QUESTION[subject],
        type: 'question_attempt'
      });
    }
    
    else if (action === 'answer') {
      const [, questionId, answer] = callbackQuery.data.split('_');
      
      // Validate answer
      const result = await validateAnswer(questionId, answer);
      
      const responseMessage = result.isCorrect
        ? `✅ ¡Correcto!\n\n${result.explanation}`
        : `❌ Incorrecto.\n\nLa respuesta correcta era: ${result.correctAnswer}\n\n${result.explanation}`;

      // Show result and option to continue
      const keyboard = {
        reply_markup: {
          inline_keyboard: [[
            { text: 'Siguiente Pregunta', callback_data: 'continue_study' },
            { text: 'Terminar', callback_data: 'end_study' }
          ]]
        }
      };

      await bot.editMessageText(responseMessage, {
        chat_id: chatId,
        message_id: callbackQuery.message.message_id,
        reply_markup: keyboard.reply_markup
      });
    }

    await bot.answerCallbackQuery(callbackQuery.id);
  } catch (error) {
    console.error('Error handling study callback:', error);
    await bot.sendMessage(
      chatId,
      'Lo siento, hubo un error procesando tu selección. Por favor, intenta nuevamente.'
    );
  }
}