# AI Chat Website

A modern AI chat application similar to Character.AI, featuring community-made characters, text-based conversations, and audio call capabilities.

## Features

✨ **Character Creation & Discovery**
- Create custom AI characters with unique personalities
- Browse and discover community-created characters
- Public and private character sharing

💬 **Chat System**
- Real-time AI conversations powered by Stable Hoard
- Persistent chat history
- Beautiful, responsive chat interface

🎙️ **Audio Calls**
- Voice call feature with AI characters
- Text-to-speech for character voices
- Call transcript tracking

🔐 **Authentication**
- User authentication via Clerk
- Secure user sessions
- User profiles and personalization

🎨 **Modern UI/UX**
- Beautiful gradient designs
- Dark mode support
- Responsive mobile-first design
- Smooth animations and transitions

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Clerk
- **Database**: Prisma with SQLite (easily switchable to PostgreSQL)
- **AI**: Stable Hoard Text Generation API
- **UI Components**: Lucide React icons

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Clerk account for authentication
- (Optional) Stable Hoard API key for production AI responses

### Installation

1. Clone the repository:
```bash
git clone https://github.com/jesse-dot/supreme-adventure.git
cd supreme-adventure
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your credentials:
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Stable Hoard API (optional - will use simulated responses if not set)
STABLE_HOARD_API_KEY=your_stable_hoard_api_key

# Database
DATABASE_URL="file:./dev.db"
```

4. Set up the database:
```bash
npx prisma migrate dev
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Getting API Keys

### Clerk Setup

1. Go to [clerk.com](https://clerk.com) and create an account
2. Create a new application
3. Copy your publishable and secret keys to `.env`
4. Configure redirect URLs in Clerk dashboard:
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`
   - After sign-in: `/`
   - After sign-up: `/`

### Stable Hoard Setup

1. Visit [Stable Horde](https://stablehorde.net/)
2. Register for an API key
3. Add the key to your `.env` file

**Note**: If no Stable Hoard API key is provided, the app will use simulated AI responses for demonstration purposes.

## Project Structure

```
supreme-adventure/
├── app/
│   ├── api/           # API routes
│   ├── character/     # Character detail pages
│   ├── characters/    # Character discovery
│   ├── chat/          # Chat interface
│   ├── create-character/  # Character creation
│   ├── my-characters/ # User's characters
│   ├── sign-in/       # Authentication pages
│   ├── sign-up/
│   ├── voice-call/    # Audio call feature
│   ├── layout.tsx     # Root layout
│   └── page.tsx       # Home page
├── lib/
│   ├── db.ts          # Prisma client
│   └── utils.ts       # Utility functions
├── prisma/
│   └── schema.prisma  # Database schema
└── components/        # Reusable components
```

## Database Schema

The app uses the following main models:
- **User**: User accounts (synced with Clerk)
- **Character**: AI characters created by users
- **Conversation**: Chat conversations between users and characters
- **Message**: Individual messages in conversations
- **Favorite**: User's favorite characters

## Features in Detail

### Character Creation
Create AI characters with:
- Name and description
- Custom greeting message
- Personality traits
- Scenario/background
- Example conversations for better AI responses
- Public/private visibility settings

### Chat System
- Real-time messaging with AI characters
- Message history persistence
- Character-specific conversations
- Beautiful chat UI with avatars

### Voice Calls
- Browser-based text-to-speech
- Call duration tracking
- Live transcript
- Microphone and speaker controls
- (Production-ready for integration with advanced TTS APIs)

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Railway
- Render
- AWS Amplify
- etc.

**Important**: Update `DATABASE_URL` to use PostgreSQL for production:
```env
DATABASE_URL="postgresql://user:password@host:port/database"
```

Then update the Prisma schema provider:
```prisma
datasource db {
  provider = "postgresql"
}
```

## Development

### Build
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Database Commands
```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC

## Acknowledgments

- Inspired by Character.AI
- Powered by Stable Hoard
- Authentication by Clerk
- Built with Next.js and Tailwind CSS
