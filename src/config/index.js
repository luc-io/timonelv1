import dotenv from 'dotenv';
dotenv.config();

export const config = {
  // Bot Configuration
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  
  // Database Configuration
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/timonelv1',
  
  // Claude Configuration
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  
  // Credit System Configuration
  INITIAL_CREDITS: 100,
  CREDITS_PER_QUESTION: {
    NAVIGATION: 5,
    SAFETY: 5,
    LEGISLATION: 5
  },
  
  // Question Configuration
  MAX_ATTEMPTS: 3,
  DIFFICULTY_LEVELS: {
    EASY: 1,
    MEDIUM: 2,
    HARD: 3
  },
  
  // Subjects and Units mapping
  SUBJECTS: {
    NAVIGATION: {
      name: 'Navegación',
      units: {
        1: 'Nociones sobre Cartas Náuticas y su Uso',
        2: 'Nociones sobre los Problemas Fundamentales de la Navegación',
        3: 'Navegación y Situación en Zonas Especiales'
      }
    },
    SAFETY: {
      name: 'Seguridad',
      units: {
        1: 'Nomenclatura y Tecnología Marinera',
        2: 'Control de Averías y Lucha Contra Incendios',
        3: 'Primeros Auxilios',
        4: 'Prevención de la Contaminación',
        5: 'Teoría de Maniobra con Embarcaciones',
        6: 'Navegación con Mal Tiempo'
      }
    },
    LEGISLATION: {
      name: 'Legislación y Reglamentación',
      units: {
        1: 'Reglamento Internacional para Prevenir los Abordajes',
        2: 'Ayudas a la Navegación',
        3: 'Régimen de las Actividades Náutico Deportivas',
        4: 'Jurisdicción Fluvio-Marítima',
        5: 'Normas de Cortesía'
      }
    }
  }
};