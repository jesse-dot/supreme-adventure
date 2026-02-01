# New Features: Dark Mode & User Profiles

## Overview
This update adds comprehensive dark mode support and user profile functionality to the AI Chat application.

## 🌓 Dark Mode

### Implementation Details
Dark mode has been implemented using Tailwind CSS's class-based dark mode strategy with a custom ThemeProvider.

#### Key Components

**ThemeProvider** (`components/ThemeProvider.tsx`)
- React Context-based theme management
- Persists theme preference to localStorage
- Detects system color scheme preference on first visit
- Provides `useTheme()` hook for accessing theme state

**ThemeToggle** (`components/ThemeToggle.tsx`)
- Toggle button with Sun/Moon icons
- Smooth transitions between themes
- Located in the main header

#### Supported Pages
All pages now support dark mode:
- ✅ Home page (`/`)
- ✅ Character detail (`/character/[id]`)
- ✅ Characters discovery (`/characters`)
- ✅ My Characters (`/my-characters`)
- ✅ Create Character (`/create-character`)
- ✅ User Profile (`/profile/[username]`)
- ✅ Edit Profile (`/profile/edit`)
- ✅ Chat pages
- ✅ Voice call pages

#### Dark Mode Classes
Every component uses Tailwind's `dark:` prefix for dark mode styles:

```tsx
// Example: Background gradients
className="bg-gradient-to-br from-blue-50 via-white to-purple-50 
           dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"

// Example: Text colors
className="text-gray-900 dark:text-gray-100"

// Example: Borders
className="border-gray-200 dark:border-gray-700"

// Example: Cards
className="bg-white dark:bg-gray-800"
```

### Theme Persistence
- Theme choice saved to `localStorage` as `"theme"`
- Automatically applied on page load
- Survives browser refresh
- Falls back to system preference if no saved theme

### Accessibility
- Proper contrast ratios maintained in both themes
- Focus states visible in both modes
- Text remains readable against all backgrounds

## 👤 User Profiles

### Database Schema
Added `bio` field to User model:

```prisma
model User {
  id        String   @id @default(cuid())
  clerkId   String   @unique
  email     String   @unique
  username  String?
  imageUrl  String?
  bio       String?  // New field
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  // ... relations
}
```

### Profile Pages

#### View Profile (`/profile/[username]`)
Displays user information and their public characters:
- Profile picture (from Clerk) or generated avatar
- Username and email
- Bio (if set)
- Character count and join date
- Grid of user's public characters
- "Edit Profile" button (only visible on own profile)

#### Edit Profile (`/profile/edit`)
Form for updating profile information:
- Username field (with uniqueness validation)
- Bio textarea
- Save/Cancel buttons
- Loading states during save

### API Endpoints

#### GET `/api/profile`
Returns current user's profile data:
```json
{
  "id": "...",
  "username": "user123",
  "email": "user@example.com",
  "bio": "AI enthusiast and character creator",
  "imageUrl": "https://...",
  "createdAt": "...",
  "updatedAt": "..."
}
```

#### PUT `/api/profile`
Updates current user's profile:
```json
{
  "username": "newusername",
  "bio": "Updated bio text"
}
```

Returns updated user object or error if username is taken.

### Creator Attribution

#### Character Cards
All character cards now show creator information:
- Profile picture (small avatar)
- Clickable username linking to profile
- Styled as: `by @username`

#### Character Detail Page
Character detail pages show:
- Creator profile picture
- Clickable creator name
- Links to `/profile/[username]`

#### Integration Points
Creator information appears on:
- Home page character cards
- Discovery page (`/characters`)
- Character detail page
- User profile character grids

### User Interface

#### Header Component
New unified header component (`components/Header.tsx`):
- Logo and app name
- Navigation links (Discover, My Characters)
- Profile icon link
- Theme toggle button
- Create Character button
- Clerk UserButton

Replaces individual headers across all pages for consistency.

## 🎨 Styling Approach

### Color Scheme

**Light Mode**:
- Background: Blue to purple gradients
- Cards: White with light borders
- Text: Dark gray on light backgrounds
- Accents: Blue and purple

**Dark Mode**:
- Background: Dark gray gradients
- Cards: Dark gray with darker borders
- Text: Light gray on dark backgrounds
- Accents: Lighter blue and purple for contrast

### Component Patterns

All interactive elements follow consistent dark mode patterns:

**Buttons**:
```tsx
className="bg-blue-600 dark:bg-blue-500 
           hover:bg-blue-700 dark:hover:bg-blue-600"
```

**Input Fields**:
```tsx
className="border-gray-300 dark:border-gray-600 
           bg-white dark:bg-gray-700 
           text-gray-900 dark:text-white"
```

**Links**:
```tsx
className="text-gray-600 dark:text-gray-300 
           hover:text-gray-900 dark:hover:text-gray-100"
```

## 🚀 Usage Examples

### Accessing Theme in Components
```tsx
import { useTheme } from "@/components/ThemeProvider";

function MyComponent() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div>
      Current theme: {theme}
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
}
```

### Viewing User Profiles
Navigate to `/profile/[username]` to view any user's profile and their characters.

### Editing Your Profile
1. Click the user icon in the header
2. Or navigate to `/profile/edit`
3. Update your username and/or bio
4. Click "Save Profile"

### Toggling Dark Mode
Click the Sun/Moon icon in the header to switch between light and dark modes.

## 📝 Notes

### Profile Pictures
Profile pictures are managed by Clerk authentication. Users can update their profile picture through Clerk's user button in the header.

### Username Requirements
- Must be unique across all users
- Required field (cannot be empty)
- Validation occurs server-side on save

### Theme Detection
On first visit, the app:
1. Checks localStorage for saved preference
2. If none, checks system color scheme preference
3. Applies detected theme
4. Saves choice to localStorage on first toggle

### Browser Compatibility
- Dark mode: All modern browsers
- LocalStorage: All modern browsers
- Theme transitions: CSS transitions supported
