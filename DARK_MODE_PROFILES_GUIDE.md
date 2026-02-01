# Dark Mode & User Profiles - Visual Guide

## Dark Mode Toggle

```
┌─────────────────────────────────────────────────┐
│  Header (Light Mode)                            │
│  ┌──────┐                          ┌────┐      │
│  │ 🌟 AI│  Discover  My Chars  👤  │🌙  │      │
│  │ Chat │                          └────┘      │
│  └──────┘                      Theme Toggle     │
└─────────────────────────────────────────────────┘

                    ↓ Click Moon Icon

┌─────────────────────────────────────────────────┐
│  Header (Dark Mode)                             │
│  ┌──────┐                          ┌────┐      │
│  │ 🌟 AI│  Discover  My Chars  👤  │☀️  │      │
│  │ Chat │                          └────┘      │
│  └──────┘                      Theme Toggle     │
└─────────────────────────────────────────────────┘
```

## User Profile Page

```
┌───────────────────────────────────────────────────────┐
│  Profile Page: /profile/username                      │
│                                                        │
│  ┌─────────┐                                          │
│  │   👤    │  John Doe                                │
│  │  Avatar │  john@example.com                        │
│  └─────────┘  AI enthusiast and character creator     │
│                                                        │
│                3 public characters | Joined Jan 2026  │
│                                                        │
│                [ Edit Profile ]                       │
│                                                        │
│  ───────────────────────────────────────────────────  │
│                                                        │
│  Your Characters                                      │
│                                                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│  │    L     │  │    W     │  │    S     │           │
│  │  Luna    │  │  Wizard  │  │  Sage    │           │
│  │          │  │          │  │          │           │
│  │ A wise...│  │ Magic... │  │ Ancient..│           │
│  │ 💬 12    │  │ 💬 8     │  │ 💬 15    │           │
│  │ ❤️ 5     │  │ ❤️ 3     │  │ ❤️ 7     │           │
│  └──────────┘  └──────────┘  └──────────┘           │
└───────────────────────────────────────────────────────┘
```

## Edit Profile Page

```
┌───────────────────────────────────────────────────────┐
│  Edit Profile                                          │
│                                                        │
│  Username *                                           │
│  ┌────────────────────────────────────────┐          │
│  │ johndoe                                │          │
│  └────────────────────────────────────────┘          │
│                                                        │
│  Bio                                                  │
│  ┌────────────────────────────────────────┐          │
│  │ AI enthusiast and character creator    │          │
│  │                                        │          │
│  │                                        │          │
│  └────────────────────────────────────────┘          │
│  Share a bit about yourself with the community       │
│                                                        │
│  ┌─────────────┐  ┌─────────────┐                   │
│  │   Cancel    │  │ Save Profile│                   │
│  └─────────────┘  └─────────────┘                   │
└───────────────────────────────────────────────────────┘
```

## Character Card with Creator Info

```
┌─────────────────────────────────┐
│                                 │
│         ┌─────────┐             │
│         │    L    │             │
│         │  Luna   │             │
│         └─────────┘             │
│                                 │
│  Luna the Wise Owl              │
│  👤 by johndoe      ← Clickable │
│                                 │
│  A wise owl who provides sage   │
│  advice and philosophical...    │
│                                 │
│  ❤️ 5 favorites                 │
└─────────────────────────────────┘
```

## Theme Switching Examples

### Light Mode
```css
Background: from-blue-50 via-white to-purple-50
Cards: bg-white border-gray-200
Text: text-gray-900
Links: text-gray-600 hover:text-gray-900
```

### Dark Mode
```css
Background: from-gray-900 via-gray-800 to-gray-900
Cards: bg-gray-800 border-gray-700
Text: text-gray-100
Links: text-gray-300 hover:text-gray-100
```

## Component Structure

```
App Root
├── ThemeProvider (Context)
│   ├── Light/Dark state
│   ├── localStorage persistence
│   └── System preference detection
│
├── Header Component
│   ├── Logo & Navigation
│   ├── Profile Link (👤)
│   ├── ThemeToggle (🌙/☀️)
│   └── Create Button
│
└── Pages (All Dark Mode Enabled)
    ├── Home (/)
    ├── Characters (/characters)
    ├── My Characters (/my-characters)
    ├── Character Detail (/character/[id])
    ├── Create Character (/create-character)
    ├── Profile View (/profile/[username])
    └── Profile Edit (/profile/edit)
```

## API Endpoints

```
GET  /api/profile
  → Returns current user's profile data
  
PUT  /api/profile
  ← { username: "...", bio: "..." }
  → Updates profile, returns updated user
  → Validates username uniqueness
```

## Database Schema

```sql
User {
  id         String   (PK)
  clerkId    String   (Unique)
  email      String   (Unique)
  username   String?
  imageUrl   String?
  bio        String?  -- New field added
  createdAt  DateTime
  updatedAt  DateTime
}
```

## User Flow

### Viewing a Profile
```
1. Click creator name on character card
   ↓
2. Navigate to /profile/[username]
   ↓
3. See user's bio and public characters
   ↓
4. Click "Edit Profile" (if own profile)
   ↓
5. Update bio and username
   ↓
6. Save and return to profile
```

### Using Dark Mode
```
1. Page loads with saved/system theme
   ↓
2. Click Moon/Sun icon in header
   ↓
3. Theme switches instantly
   ↓
4. Preference saved to localStorage
   ↓
5. Theme persists across page navigation
```

## Implementation Notes

- **Theme Toggle**: Located in header, always accessible
- **Profile Pictures**: Managed by Clerk, displayed everywhere
- **Creator Links**: All character displays link to creator profiles
- **Dark Mode Classes**: Every component uses `dark:` prefix
- **Responsive**: All layouts work on mobile and desktop
- **Accessibility**: Proper contrast in both themes

## Key Features Summary

✅ Dark mode with localStorage persistence
✅ Theme toggle in header (Moon/Sun icon)
✅ User profiles with bio and character display
✅ Profile editing with username uniqueness check
✅ Creator attribution on all character cards
✅ Profile picture display from Clerk
✅ Consistent dark mode styling across all pages
✅ System preference detection on first visit
