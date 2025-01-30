import { connectDB } from '../database/connection.js';

export async function createUser({ telegramId, username }) {
  const db = await connectDB();
  const users = db.collection('users');

  // Check if user exists
  const existingUser = await users.findOne({ telegramId });
  if (existingUser) {
    return existingUser;
  }

  // Create new user with initial data
  const newUser = {
    telegramId,
    username,
    credits: 100,
    progress: {
      navigation: new Map(),
      safety: new Map(),
      legislation: new Map()
    },
    settings: {
      language: 'es',
      notifications: true
    },
    createdAt: new Date(),
    lastActive: new Date()
  };

  await users.insertOne(newUser);
  return newUser;
}

export async function updateUserProgress({ telegramId, subject, unit, score, questionId }) {
  const db = await connectDB();
  const users = db.collection('users');

  const updatePath = `progress.${subject}.${unit}`;
  const update = {
    $set: {
      [`${updatePath}.score`]: score,
      lastActive: new Date()
    },
    $addToSet: {
      [`${updatePath}.completedQuestions`]: questionId
    }
  };

  return users.updateOne({ telegramId }, update);
}

export async function updateUserCredits({ telegramId, amount, type }) {
  const db = await connectDB();
  const users = db.collection('users');

  const update = {
    $inc: { credits: amount },
    $set: { lastActive: new Date() }
  };

  const result = await users.updateOne({ telegramId }, update);

  // Log transaction
  const transactions = db.collection('transactions');
  await transactions.insertOne({
    telegramId,
    amount,
    type,
    timestamp: new Date()
  });

  return result;
}

export async function getUserProgress(telegramId) {
  const db = await connectDB();
  const users = db.collection('users');

  const user = await users.findOne({ telegramId });
  if (!user) {
    throw new Error('User not found');
  }

  return user.progress;
}

export async function getUserCredits(telegramId) {
  const db = await connectDB();
  const users = db.collection('users');

  const user = await users.findOne({ telegramId });
  if (!user) {
    throw new Error('User not found');
  }

  return user.credits;
}