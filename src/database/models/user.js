export const UserSchema = {
  telegramId: String,
  username: String,
  credits: {
    type: Number,
    default: 100 // Initial credits for new users
  },
  progress: {
    navigation: {
      type: Map,
      of: {
        score: Number,
        completedQuestions: Array,
        lastAccessed: Date
      }
    },
    safety: {
      type: Map,
      of: {
        score: Number,
        completedQuestions: Array,
        lastAccessed: Date
      }
    },
    legislation: {
      type: Map,
      of: {
        score: Number,
        completedQuestions: Array,
        lastAccessed: Date
      }
    }
  },
  settings: {
    language: {
      type: String,
      default: 'es'
    },
    notifications: {
      type: Boolean,
      default: true
    }
  },
  createdAt: Date,
  lastActive: Date
};