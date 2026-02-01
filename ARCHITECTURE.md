# AI Chat Website - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      User Interface                         │
│  (Next.js 14+ with App Router, React 19, Tailwind CSS)    │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Authentication Layer                        │
│              (Clerk - Middleware Protection)                │
└─────────────────────────────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
                ▼                       ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│     Server Components    │  │      API Routes          │
│  - Home Page             │  │  - /api/characters       │
│  - Character Pages       │  │  - /api/chat             │
│  - Discovery             │  │  - /api/conversations    │
└──────────────────────────┘  └──────────────────────────┘
                │                       │
                └───────────┬───────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Database Layer                             │
│              (Prisma v7 + LibSQL/SQLite)                    │
│                                                              │
│  Models:                                                     │
│  - User (synced with Clerk)                                 │
│  - Character (AI personalities)                             │
│  - Conversation (chat sessions)                             │
│  - Message (chat history)                                   │
│  - Favorite (user preferences)                              │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ API Calls
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                External Services                             │
│                                                              │
│  ┌──────────────────┐    ┌────────────────────────┐        │
│  │  Stable Hoard    │    │   Browser Web Speech   │        │
│  │  (AI Responses)  │    │   (Text-to-Speech)     │        │
│  └──────────────────┘    └────────────────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

## Page Structure

### Public Pages (Pre-Authentication)
- `/sign-in` - Clerk sign-in interface
- `/sign-up` - Clerk sign-up interface

### Protected Pages (Require Authentication)
- `/` - Home page with character discovery
- `/characters` - Public character gallery
- `/character/[id]` - Character profile and details
- `/chat/[id]` - Chat interface with AI character
- `/create-character` - Character creation form
- `/my-characters` - User's character management
- `/voice-call/[id]` - Audio call interface

## Data Flow

### Character Creation Flow
```
User → Create Character Form → POST /api/characters → 
Database Insert → Redirect to Character Page
```

### Chat Flow
```
User Types Message → POST /api/chat →
├─ Save User Message to DB
├─ Build AI Prompt with Character Context
├─ Call Stable Hoard API (or fallback simulation)
├─ Save AI Response to DB
└─ Return Response to User → Display in Chat
```

### Voice Call Flow
```
User Starts Call → Character Greeting →
Web Speech API (TTS) → User Speaks →
Simulated AI Response → TTS Playback →
Live Transcript Display
```

## Key Features Implemented

### 1. Character System
- **Creation**: Full-featured form with personality, scenario, examples
- **Storage**: Database persistence with Prisma
- **Discovery**: Public character gallery with search
- **Management**: User-specific character dashboard

### 2. Chat System  
- **Real-time**: Server-side rendering with fast responses
- **History**: Persistent message storage
- **Context**: Character personality integrated into prompts
- **UI**: Beautiful chat bubbles with avatars

### 3. Voice Calls
- **Interface**: Full call UI with controls
- **Audio**: Browser TTS for character voices
- **Transcript**: Live conversation logging
- **Controls**: Mute, speaker, duration tracking

### 4. Authentication
- **Provider**: Clerk authentication
- **Protection**: Middleware-based route protection
- **Sync**: Automatic user creation in database
- **Session**: Secure session management

### 5. Community Features
- **Public Sharing**: Characters can be public/private
- **Favorites**: Users can favorite characters
- **Statistics**: Track chats and favorites
- **Discovery**: Browse all public characters

## Technology Decisions

### Why Next.js 14+?
- App Router for modern routing
- Server Components for performance
- API Routes for backend logic
- Built-in optimization

### Why Clerk?
- Easy authentication setup
- Secure session management
- Beautiful UI components
- User management dashboard

### Why Prisma?
- Type-safe database queries
- Easy schema management
- Migration system
- Multi-database support

### Why SQLite (LibSQL)?
- Zero configuration
- Fast for development
- Easy to switch to PostgreSQL
- Portable database file

## Deployment Considerations

### Environment Variables Required
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
DATABASE_URL
STABLE_HOARD_API_KEY (optional)
```

### For Production
1. Use PostgreSQL instead of SQLite
2. Add real Stable Hoard API key
3. Enable error tracking (Sentry)
4. Add analytics (Posthog, GA)
5. Implement rate limiting
6. Add caching layer

## Performance Optimizations

- Server Components by default
- Dynamic imports for client components
- Image optimization with next/image
- Tailwind CSS purging
- Database query optimization with Prisma

## Security Features

- Clerk authentication middleware
- Protected API routes
- User-based data isolation
- SQL injection prevention (Prisma)
- XSS protection (React escaping)

## Future Enhancements

1. **Advanced AI Features**
   - Long-term memory for characters
   - Image generation for character avatars
   - Voice cloning for unique voices
   - Multi-turn conversation context

2. **Social Features**
   - User profiles
   - Character reviews and ratings
   - Comments on characters
   - Share conversations

3. **Enhanced Chat**
   - File uploads
   - Rich text formatting
   - Emoji reactions
   - Message editing/deletion

4. **Analytics**
   - Character popularity metrics
   - User engagement tracking
   - Conversation analytics
   - Usage statistics dashboard

5. **Monetization**
   - Premium characters
   - Advanced voice options
   - Priority AI processing
   - Ad-free experience
