# Authentication System

This document describes the authentication and user management system added to FastPoll.

## Overview

FastPoll now includes a complete authentication system that allows users to:
- Register for an account
- Login to their account
- Logout
- View their profile information
- Associate polls with their user account

The authentication is **optional** - users can still create polls without logging in, maintaining the original "no sign-up required" experience.

## Features

### User Registration
- Users can register with email and password
- Optional name field
- Password must be at least 6 characters
- Email validation
- Secure password hashing with bcrypt

### User Login
- Email and password authentication
- JWT-based session management
- Secure HTTP-only cookies
- 7-day session duration

### User Interface
- Login and Register pages with beautiful UI matching the app design
- Navbar shows Login/Sign Up buttons for unauthenticated users
- User menu dropdown for authenticated users showing:
  - User's name and email
  - Logout button
- Click-outside-to-close functionality for user menu

### API Endpoints

#### POST `/api/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "Optional Name"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Optional Name"
  }
}
```

#### POST `/api/auth/login`
Login to an existing account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Optional Name"
  }
}
```

#### POST `/api/auth/logout`
Logout from the current session.

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

#### GET `/api/auth/me`
Get information about the currently authenticated user.

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Optional Name",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## Database Schema

### User Model
```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String   // Hashed with bcrypt
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  polls     Poll[]   // Relationship to polls created by this user
}
```

### Updated Poll Model
```prisma
model Poll {
  id        String   @id @default(uuid())
  question  String
  options   String[]
  createdAt DateTime @default(now())
  votes     Vote[]
  userId    String?  // Optional - polls can be created without authentication
  user      User?    @relation(fields: [userId], references: [id])
}
```

## Security Features

- **Password Hashing**: Passwords are hashed using bcrypt with 10 salt rounds
- **JWT Tokens**: Session management using JSON Web Tokens (JWT) with HS256 algorithm
- **HTTP-Only Cookies**: Auth tokens stored in secure, HTTP-only cookies
- **Input Validation**: Email format and password length validation
- **Secure in Production**: Cookies use the `secure` flag in production environment

## Environment Variables

Add the following to your `.env` file:

```bash
# Required for database
DATABASE_URL="postgresql://user:password@localhost:5432/fastpoll?schema=public"

# Optional - defaults to a development secret if not provided
JWT_SECRET="your-secret-key-change-this-in-production"
```

**Important**: Always change the JWT_SECRET to a strong, random value in production!

## Database Setup

After updating the Prisma schema, run:

```bash
npx prisma generate
npx prisma db push
```

Or for migrations:

```bash
npx prisma migrate dev --name add-user-authentication
```

## Usage in Components

### Using the Auth Context

The `AuthProvider` wraps the application and provides auth state and methods:

```tsx
import { useAuth } from '@/lib/auth-context';

function MyComponent() {
  const { user, loading, login, register, logout } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return <div>Welcome, {user.email}!</div>;
  }

  return <div>Please login</div>;
}
```

### Server-Side Authentication

Check authentication status in API routes:

```typescript
import { getCurrentUser } from '@/lib/auth-helpers';

export async function GET(request: NextRequest) {
  const authUser = await getCurrentUser(request);
  
  if (!authUser) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }
  
  // User is authenticated, authUser.userId and authUser.email are available
}
```

## Pages

- `/login` - Login page
- `/register` - Registration page
- All existing pages continue to work without authentication

## Backward Compatibility

The authentication system is fully backward compatible:
- Existing polls without a userId continue to work
- Users can still create polls without logging in
- All existing functionality is preserved
