import { config } from '../config/index.js';
import { connectDB } from '../database/connection.js';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: config.ANTHROPIC_API_KEY,
});

export async function generateQuestions(subject, unit, amount = 1) {
  const db = await connectDB();
  const questions = db.collection('questions');
  
  try {
    const prompt = `
Generate ${amount} multiple choice question(s) for the following sailing topic:
Subject: ${config.SUBJECTS[subject].name}
Unit: ${config.SUBJECTS[subject].units[unit]}

Requirements:
- Question should test understanding, not just memorization
- Provide 4 options (a, b, c, d)
- Include a brief explanation for the correct answer
- Difficulty level between 1-3
- Response in Spanish
- Format as JSON:
{
  "questions": [{
    "question": "string",
    "options": ["string", "string", "string", "string"],
    "correctAnswer": "a/b/c/d",
    "explanation": "string",
    "difficulty": number
  }]
}`;

    const message = await anthropic.messages.create({
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
      model: 'claude-3-opus-20240229',
    });

    const questionsData = JSON.parse(message.content[0].text);
    
    // Process and store questions
    const processedQuestions = questionsData.questions.map(q => ({
      ...q,
      subject,
      unit,
      type: 'multiple_choice',
      metadata: {
        generatedBy: 'claude',
        creditCost: config.CREDITS_PER_QUESTION[subject],
        tags: [subject, `unit-${unit}`, `difficulty-${q.difficulty}`]
      }
    }));

    await questions.insertMany(processedQuestions);
    return processedQuestions;
  } catch (error) {
    console.error('Error generating questions:', error);
    throw error;
  }
}

export async function getQuestionsBySubject(subject, unit, limit = 5) {
  const db = await connectDB();
  const questions = db.collection('questions');

  return questions.find({
    subject,
    unit,
  })
  .limit(limit)
  .toArray();
}

export async function validateAnswer(questionId, userAnswer) {
  const db = await connectDB();
  const questions = db.collection('questions');

  const question = await questions.findOne({ _id: questionId });
  if (!question) {
    throw new Error('Question not found');
  }

  const isCorrect = question.correctAnswer === userAnswer;
  return {
    isCorrect,
    explanation: question.explanation,
    correctAnswer: question.correctAnswer
  };
}

export async function generateImageQuestion(subject, unit) {
  // TODO: Implement image-based question generation
  // This could involve using Claude to generate a description of an image
  // and then using another service to create the image, or selecting from a predefined set
  throw new Error('Image questions not implemented yet');
}

export async function generateWrittenQuestion(subject, unit) {
  const db = await connectDB();
  const questions = db.collection('questions');
  
  try {
    const prompt = `
Generate a written question for the following sailing topic:
Subject: ${config.SUBJECTS[subject].name}
Unit: ${config.SUBJECTS[subject].units[unit]}

Requirements:
- Question should require a short written response
- Include keywords that should be present in the answer
- Include a model answer
- Difficulty level between 1-3
- Response in Spanish
- Format as JSON:
{
  "question": "string",
  "keywords": ["string"],
  "modelAnswer": "string",
  "difficulty": number
}`;

    const message = await anthropic.messages.create({
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
      model: 'claude-3-opus-20240229',
    });

    const questionData = JSON.parse(message.content[0].text);
    
    const processedQuestion = {
      ...questionData,
      subject,
      unit,
      type: 'written',
      metadata: {
        generatedBy: 'claude',
        creditCost: config.CREDITS_PER_QUESTION[subject] * 2,
        tags: [subject, `unit-${unit}`, `difficulty-${questionData.difficulty}`]
      }
    };

    await questions.insertOne(processedQuestion);
    return processedQuestion;
  } catch (error) {
    console.error('Error generating written question:', error);
    throw error;
  }
}