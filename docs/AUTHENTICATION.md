# Authentication Documentation

## Overview

The Political Strategy Workbench uses JWT (JSON Web Token) based authentication with a simplified static user system for easy access while maintaining security infrastructure for future expansion.

## Authentication Flow

### 1. Login Process

```
User → Login Page → Backend API → JWT Token → Zustand Store → Protected Routes
```

1. User enters credentials on login page
2. Frontend sends credentials to `/api/auth/login`
3. Backend validates credentials against static user
4. Backend generates JWT access token and refresh token
5. Frontend stores tokens in Zustand (persisted in localStorage)
6. User can access protected routes

### 2. Request Authentication

All API requests include the JWT token in the Authorization header:

```
Authorization: Bearer <access_token>
```

This is handled automatically by the `apiClient` wrapper.

## Static User Credentials

**Default Credentials:**
- Username: `admin`
- Password: `password123`

**Configuration:**
Located in `backend/api-server/.env`:
```env
STATIC_USERNAME=admin
STATIC_PASSWORD=password123
```

## Frontend Implementation

### Files Created

1. **Auth Store** (`src/stores/authStore.ts`)
   - Zustand store for authentication state
   - Persisted in localStorage
   - Stores user object and JWT token

2. **API Client** (`src/lib/apiClient.ts`)
   - Axios instance with interceptors
   - Automatically adds Bearer token to requests
   - Handles 401 errors (auto-logout and redirect)

3. **Login Page** (`src/app/login/page.tsx`)
   - User login form
   - Validates credentials
   - Redirects to home on success

4. **Auth Provider** (`src/components/AuthProvider.tsx`)
   - Client-side authentication wrapper
   - Checks auth status on page load
   - Shows loading state during check
   - Redirects to login if not authenticated

5. **Middleware** (`middleware.ts`)
   - Server-side route protection
   - Checks for auth token in cookies
   - Redirects unauthenticated users to `/login`

6. **Navigation Updates** (`src/components/Navigation.tsx`)
   - Shows logged-in user email
   - Logout button
   - Only visible when authenticated

### Usage

**Making authenticated API requests:**

```typescript
import apiClient from '@/lib/apiClient'

// GET request
const response = await apiClient.get('/news-articles')

// POST request
const response = await apiClient.post('/news-aggregation/trigger-fetch')
```

**Accessing auth state:**

```typescript
import { useAuthStore } from '@/stores/authStore'

const { user, token, isAuthenticated, setAuth, clearAuth } = useAuthStore()
```

**Logout:**

```typescript
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'next/navigation'

const clearAuth = useAuthStore((state) => state.clearAuth)
const router = useRouter()

const handleLogout = () => {
  clearAuth()
  router.push('/login')
}
```

## Backend Implementation

### JWT Strategy

Location: `backend/api-server/src/modules/auth/strategies/jwt.strategy.ts`

**Key Features:**
- Validates JWT tokens
- Handles static user (ID: `static-user-001`)
- Falls back to database lookup for regular users
- Throws `UnauthorizedException` for invalid tokens

**Static User Handling:**
```typescript
if (payload.sub === 'static-user-001') {
  return {
    userId: payload.sub,
    email: payload.email,
    role: payload.role,
  }
}
```

### Auth Service

Location: `backend/api-server/src/modules/auth/auth.service.ts`

**Methods:**
- `validateUser(email, password)`: Validates static credentials
- `login(user)`: Generates JWT tokens
- `refreshToken(token)`: Refreshes access token
- `logout(token)`: Invalidates refresh token

**Token Generation:**
- Access Token: 15 minutes expiry
- Refresh Token: 7 days expiry
- Signed with `JWT_SECRET` from environment

### Login DTO

Location: `backend/api-server/src/modules/auth/dto/login.dto.ts`

**Modified for Static Auth:**
- Changed `@IsEmail()` to `@IsString()` validation
- Accepts plain username (not email format required)
- Field name: `email` (but accepts username)

### Environment Variables

Required in `backend/api-server/.env`:

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-please
JWT_EXPIRY=24h

# Static User Credentials
STATIC_USERNAME=admin
STATIC_PASSWORD=password123
```

## Protected Routes

### Frontend Routes (Middleware)

Protected by `middleware.ts`:
- `/` - Home page
- `/moat-finder` - Strategic Moat Finder
- `/disruption-radar` - Disruption Radar
- `/news` - News Intelligence

**Public Routes:**
- `/login` - Login page

### Backend Routes

Most endpoints require JWT authentication via `@UseGuards(JwtAuthGuard)`.

**Public endpoints:**
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/refresh`

**Protected endpoints:**
- `GET /news-articles`
- `POST /news-aggregation/trigger-fetch`
- `POST /api/auth/me`
- `POST /api/auth/logout`

## Security Considerations

### Current Implementation (Development)

1. **Static User**: Simple username/password for easy access
2. **No Database**: Static user doesn't exist in database
3. **Visible Credentials**: Stored in `.env` file
4. **Client-Side Storage**: Tokens in localStorage (Zustand persist)

### Production Recommendations

1. **Remove Static Auth**: Implement proper user registration/login
2. **Strong Passwords**: Enforce password complexity rules
3. **Secure Storage**: Use httpOnly cookies instead of localStorage
4. **HTTPS Only**: Enforce HTTPS in production
5. **Rate Limiting**: Add login rate limiting to prevent brute force
6. **Token Rotation**: Implement automatic token rotation
7. **Secret Management**: Use secure secret management (not `.env`)
8. **Session Timeout**: Implement automatic session timeout
9. **Two-Factor Auth**: Consider 2FA for sensitive operations
10. **Audit Logging**: Log all authentication events

## Testing Authentication

### Test Login

```bash
# Login request
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin","password":"password123"}'

# Response
{
  "accessToken": "eyJhbGci...",
  "refreshToken": "757513c9-...",
  "user": {
    "id": "static-user-001",
    "email": "admin",
    "firstName": "Admin",
    "lastName": "User",
    "role": "ADMIN",
    ...
  }
}
```

### Test Protected Endpoint

```bash
# Get news articles (requires auth)
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  http://localhost:3001/news-articles
```

## Troubleshooting

### Issue: "Unauthorized" error on login
**Cause**: Incorrect credentials
**Solution**: Verify username is `admin` and password is `password123`

### Issue: "User not found or inactive" on API calls
**Cause**: JWT strategy looking for user in database
**Solution**: Ensure JWT strategy handles static user (see `jwt.strategy.ts`)

### Issue: Redirected to login after refresh
**Cause**: Token not persisted or expired
**Solution**: Check Zustand persist configuration and token expiry

### Issue: CORS errors
**Cause**: Frontend and backend on different origins
**Solution**: Ensure `CORS_ORIGIN=http://localhost:3000` in backend `.env`

## Future Enhancements

1. **Database Users**: Add support for real user accounts
2. **Social Auth**: OAuth integration (Google, GitHub, etc.)
3. **Role-Based Access**: Implement granular permissions
4. **API Key Auth**: Alternative auth method for service-to-service
5. **Audit Trail**: Track all authentication events
6. **Password Reset**: Implement forgot password flow
7. **Email Verification**: Verify user emails on registration
8. **Multi-Tenancy**: Support for multiple organizations
