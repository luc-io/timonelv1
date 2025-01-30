# Timonel v1

Telegram bot for sailing education in Argentina. Prepares students for Timonel certification through interactive learning.

## Features

- Multiple choice and written questions
- Image-based questions
- Progress tracking
- Credit system
- Three main subjects:
  - Navigation
  - Safety
  - Legislation and Regulations

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Configure environment variables in `.env`
4. Start MongoDB
5. Run the bot: `npm start`

## Environment Variables

```
TELEGRAM_BOT_TOKEN=your_token
MONGODB_URI=mongodb://localhost:27017/timonelv1
ANTHROPIC_API_KEY=your_key
```