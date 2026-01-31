# AI Chat Website

A modern AI chat application similar to Character.AI, featuring community-made characters, text-based conversations, and audio call capabilities.

## 🎯 Features Implemented

### ✨ Core Features
- **Character Creation & Management**
  - Create custom AI characters with unique personalities
  - Define character traits, greetings, scenarios, and example conversations
  - Public and private character sharing options
  - Character discovery and browsing

- **Chat System**
  - Real-time AI conversations powered by Stable Hoard API
  - Persistent chat history in database
  - Beautiful, responsive chat interface with avatars
  - Message streaming support
  - Conversation management

- **Voice Calls** 🎙️
  - Audio call interface with AI characters
  - Browser-based text-to-speech for character voices
  - Call controls (mute, speaker, end call)
  - Live conversation transcripts
  - Call duration tracking

- **User Authentication** 🔐
  - Secure authentication via Clerk
  - User profile management
  - Protected routes and API endpoints
  - Automatic user synchronization with database

- **Community Features** 👥
  - Public character gallery
  - Character favorites system
  - Character statistics (chat count, favorites)
  - User-created character collections

## 🛠️ Tech Stack

- **Frontend**: Next.js 14+ (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v3
- **Authentication**: Clerk
- **Database**: Prisma v7 with SQLite (LibSQL adapter)
- **AI**: Stable Hoard Text Generation API (with fallback simulation)
- **UI Components**: Lucide React icons
- **Real-time**: Server-side rendering with streaming

## 📁 Project Structure

```
supreme-adventure/
├── app/
│   ├── api/                      # API routes
│   │   ├── characters/           # Character CRUD endpoints
│   │   ├── chat/                 # AI chat endpoint
│   │   └── conversations/        # Conversation endpoints
│   ├── character/[id]/           # Character detail page
│   ├── characters/               # Public character gallery
│   ├── chat/[id]/                # Chat interface
│   ├── create-character/         # Character creation form
│   ├── my-characters/            # User's character management
│   ├── sign-in/                  # Authentication pages
│   ├── sign-up/
│   ├── voice-call/[id]/          # Voice call interface
│   ├── layout.tsx                # Root layout with Clerk
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
├── lib/
│   ├── db.ts                     # Prisma client with LibSQL
│   └── utils.ts                  # Utility functions
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── migrations/               # Database migrations
├── components/                    # Reusable components (future use)
├── middleware.ts                  # Clerk authentication middleware
├── next.config.js                 # Next.js configuration
├── tailwind.config.ts             # Tailwind configuration
└── package.json                   # Dependencies
```

## 🗄️ Database Schema

The application uses the following data models:

- **User**: User accounts (synced with Clerk)
- **Character**: AI characters with personality, greetings, scenarios
- **Conversation**: Chat sessions between users and characters
- **Message**: Individual messages with role (user/assistant)
- **Favorite**: User's favorite characters

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- A Clerk account for authentication ([clerk.com](https://clerk.com))
- (Optional) Stable Hoard API key for production AI ([stablehorde.net](https://stablehorde.net))

### Installation Steps

1. **Clone the repository**:
```bash
git clone https://github.com/jesse-dot/supreme-adventure.git
cd supreme-adventure
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up Clerk Authentication** (REQUIRED):

   a. Go to [clerk.com](https://clerk.com) and create a free account
   
   b. Create a new application in the Clerk Dashboard
   
   c. Copy your API keys from the Clerk dashboard
   
   d. In your Clerk dashboard, configure these URLs:
      - Sign-in URL: `/sign-in`
      - Sign-up URL: `/sign-up`
      - After sign-in URL: `/`
      - After sign-up URL: `/`

4. **Configure environment variables**:
```bash
cp .env.example .env
```

Then edit `.env` with your actual Clerk keys:
```env
# REQUIRED - Get these from https://dashboard.clerk.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key_here
CLERK_SECRET_KEY=sk_test_your_actual_secret_here

# Clerk URLs (keep these as-is)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Database (keep as-is for local development)
DATABASE_URL="file:./dev.db"

# OPTIONAL - Stable Hoard API for production AI
# Leave empty to use simulated responses
STABLE_HOARD_API_KEY=
```

5. **Set up the database**:
```bash
npx prisma generate
npx prisma migrate dev
```

6. **Run the development server**:
```bash
npm run dev
```

7. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎮 How to Use

1. **Sign Up/Sign In**: Create an account using the Clerk authentication
2. **Create a Character**: Click "Create Character" to design your first AI character
3. **Start Chatting**: Click on any character to view their profile and start a conversation
4. **Voice Calls**: Use the "Voice Call" button to have an audio conversation with a character
5. **Explore**: Browse public characters in the "Discover" section
6. **Manage**: View and edit your characters in "My Characters"

## 📸 Features Overview

### Home Page
- Hero section with gradient design
- Recent conversations display
- Public character discovery gallery
- Quick access navigation

### Character Creation
- Name, description, and greeting fields
- Personality traits customization
- Scenario/background setup
- Example conversation training
- Public/private visibility toggle

### Chat Interface
- Real-time messaging with AI
- Character avatars and user icons
- Conversation history
- Message input with send button
- Seamless conversation flow

### Voice Calls
- Visual call interface
- Call controls (mute, speaker, end)
- Live transcript display
- Call duration timer
- Character voice synthesis

## 🔧 Development

### Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm start         # Start production server
npm run lint      # Run linter
```

### Database Commands

```bash
npx prisma studio              # Open Prisma Studio (database GUI)
npx prisma migrate dev         # Create and apply migrations
npx prisma migrate reset       # Reset database
npx prisma generate            # Regenerate Prisma Client
```

## 🚢 Deployment

### Important Notes for Production:

1. **Clerk Setup**: Ensure you have production Clerk keys configured in your deployment platform

2. **Database**: For production, consider switching to PostgreSQL:
   ```env
   DATABASE_URL="postgresql://user:password@host:port/database"
   ```
   Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
   }
   ```

3. **Stable Hoard API**: Add your API key for production AI responses:
   ```env
   STABLE_HOARD_API_KEY=your_production_key
   ```

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add all environment variables from `.env`
4. Deploy!

### Other Platforms
- **Railway**: Supports PostgreSQL out of the box
- **Render**: Good for both app and database hosting  
- **AWS Amplify**: Enterprise-grade hosting
- **DigitalOcean App Platform**: Simple deployment

## 🐛 Troubleshooting

### "Publishable key not valid" Error
- Make sure you've copied the correct keys from your Clerk dashboard
- Ensure the keys are in the `.env` file, not `.env.example`
- Restart the development server after changing `.env`

### Database Connection Issues
- Run `npx prisma generate` to regenerate the Prisma client
- Check that `DATABASE_URL` is correctly set in `.env`
- For SQLite, ensure the file path is writable

### Build Errors
- The production build requires valid Clerk keys
- All pages use dynamic rendering for authentication
- Use `npm run dev` for local development

## 📝 API Endpoints

### Characters
- `POST /api/characters` - Create a new character
- `GET /api/characters` - List characters
- `GET /api/characters/[id]` - Get character details

### Chat
- `POST /api/chat` - Send a message and get AI response

### Conversations
- `GET /api/conversations/[id]` - Get conversation history

## 🎨 Customization

### Styling
- Edit `app/globals.css` for global styles
- Modify `tailwind.config.ts` for theme customization
- Update color gradients throughout the app

### AI Responses
- Modify system prompts in `app/api/chat/route.ts`
- Adjust AI parameters (temperature, max_length)
- Add custom response processing

### Character Fields
- Update `prisma/schema.prisma` to add fields
- Run `npx prisma migrate dev` to apply changes
- Update forms in `app/create-character/page.tsx`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

ISC

## 🙏 Acknowledgments

- Inspired by [Character.AI](https://character.ai)
- AI powered by [Stable Hoard](https://stablehorde.net)
- Authentication by [Clerk](https://clerk.com)
- Built with [Next.js](https://nextjs.org) and [Tailwind CSS](https://tailwindcss.com)
- Database with [Prisma](https://prisma.io)

## 📧 Support

For issues and questions:
- Create an issue on GitHub
- Check the troubleshooting section above
- Review Clerk and Stable Hoard documentation

---

**Note**: This is a demonstration project. The simulated AI responses are for testing purposes. For production use, obtain a Stable Hoard API key or integrate with another AI service like OpenAI, Anthropic, or Cohere.
