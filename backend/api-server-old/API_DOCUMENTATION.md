# API Documentation

Complete API reference for the NestJS API Server.

## Base URL

```
Development: http://localhost:3001
Production: https://your-domain.com
```

## Authentication

Most endpoints require authentication using JWT Bearer tokens.

### Header Format

```
Authorization: Bearer <your_access_token>
```

### Token Expiry

- **Access Token**: 15 minutes
- **Refresh Token**: 7 days

---

## Authentication Endpoints

### Register User

Create a new user account.

**Endpoint:** `POST /api/auth/register`

**Auth Required:** No

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",          // Optional
  "lastName": "Doe"              // Optional
}
```

**Success Response (201):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid input data
- `409 Conflict` - User already exists

---

### Login

Authenticate a user and receive access tokens.

**Endpoint:** `POST /api/auth/login`

**Auth Required:** No

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Success Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid credentials

---

### Refresh Token

Get a new access token using a refresh token.

**Endpoint:** `POST /api/auth/refresh`

**Auth Required:** No

**Request Body:**
```json
{
  "refreshToken": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

**Success Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "new-refresh-token-uuid",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    ...
  }
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid or expired refresh token

---

### Logout

Invalidate the user's refresh token.

**Endpoint:** `POST /api/auth/logout`

**Auth Required:** Yes (Bearer token)

**Request Body:**
```json
{
  "refreshToken": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

**Success Response (204):**
```
No content
```

**Error Responses:**
- `401 Unauthorized` - Invalid or missing authentication token

---

### Get Current User

Get information about the currently authenticated user.

**Endpoint:** `POST /api/auth/me`

**Auth Required:** Yes (Bearer token)

**Success Response (200):**
```json
{
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "role": "USER"
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid or missing authentication token

---

## User Endpoints

### Create User

Create a new user (public endpoint for registration).

**Endpoint:** `POST /api/users`

**Auth Required:** No

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "SecurePassword123!",
  "firstName": "Jane",            // Optional
  "lastName": "Smith",            // Optional
  "role": "USER"                  // Optional, defaults to USER
}
```

**Success Response (201):**
```json
{
  "id": "456e7890-e12b-34d5-a678-901234567890",
  "email": "newuser@example.com",
  "firstName": "Jane",
  "lastName": "Smith",
  "role": "USER",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**
- `400 Bad Request` - Invalid input data
- `409 Conflict` - User already exists

---

### Get All Users

Retrieve a list of all users (Admin only).

**Endpoint:** `GET /api/users`

**Auth Required:** Yes (Bearer token)

**Required Role:** ADMIN

**Success Response (200):**
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user1@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": "456e7890-e12b-34d5-a678-901234567890",
    "email": "user2@example.com",
    ...
  }
]
```

**Error Responses:**
- `401 Unauthorized` - Invalid or missing authentication token
- `403 Forbidden` - User does not have ADMIN role

---

### Get User by ID

Retrieve a specific user by their ID.

**Endpoint:** `GET /api/users/:id`

**Auth Required:** Yes (Bearer token)

**URL Parameters:**
- `id` (string, required) - User UUID

**Success Response (200):**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "USER",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid or missing authentication token
- `404 Not Found` - User not found

---

### Update User

Update user information.

**Endpoint:** `PATCH /api/users/:id`

**Auth Required:** Yes (Bearer token)

**URL Parameters:**
- `id` (string, required) - User UUID

**Request Body (all fields optional):**
```json
{
  "email": "newemail@example.com",
  "password": "NewSecurePassword123!",
  "firstName": "Jane",
  "lastName": "Smith",
  "role": "MODERATOR",
  "isActive": false
}
```

**Success Response (200):**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "newemail@example.com",
  "firstName": "Jane",
  "lastName": "Smith",
  "role": "MODERATOR",
  "isActive": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-02T00:00:00.000Z"
}
```

**Error Responses:**
- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - Invalid or missing authentication token
- `404 Not Found` - User not found
- `409 Conflict` - Email already in use

---

### Delete User

Delete a user (Admin only).

**Endpoint:** `DELETE /api/users/:id`

**Auth Required:** Yes (Bearer token)

**Required Role:** ADMIN

**URL Parameters:**
- `id` (string, required) - User UUID

**Success Response (200):**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "deleted@example.com",
  ...
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid or missing authentication token
- `403 Forbidden` - User does not have ADMIN role
- `404 Not Found` - User not found

---

## Health Check

### Health Check

Verify API server is running.

**Endpoint:** `GET /api/health`

**Auth Required:** No

**Success Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

---

## Data Models

### User

```typescript
{
  id: string              // UUID
  email: string           // Unique email address
  firstName?: string      // Optional first name
  lastName?: string       // Optional last name
  role: Role              // USER | ADMIN | MODERATOR
  isActive: boolean       // Account status
  createdAt: Date         // Creation timestamp
  updatedAt: Date         // Last update timestamp
}
```

### Role Enum

```typescript
enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR'
}
```

---

## Error Response Format

All error responses follow this format:

```json
{
  "statusCode": 400,
  "message": "Error description",
  "error": "Bad Request",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "path": "/api/users"
}
```

### Common HTTP Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `204 No Content` - Request successful, no content to return
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required or failed
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource conflict (e.g., duplicate email)
- `500 Internal Server Error` - Server error

---

## Rate Limiting

Default rate limits:
- 100 requests per minute per IP address

Headers included in response:
- `X-RateLimit-Limit` - Maximum requests allowed
- `X-RateLimit-Remaining` - Remaining requests
- `X-RateLimit-Reset` - Time when limit resets

---

## Pagination

For endpoints that return lists (future implementation):

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)
- `sortBy` - Field to sort by
- `order` - Sort order (asc/desc)

---

## Swagger UI

Interactive API documentation available at:
```
http://localhost:3001/api/docs
```

Features:
- Try out endpoints directly
- View request/response schemas
- Download OpenAPI spec
- Authentication support

---

## Code Examples

### JavaScript (Fetch)

```javascript
// Register
const response = await fetch('http://localhost:3001/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'SecurePassword123!',
  }),
})
const data = await response.json()

// Authenticated request
const userResponse = await fetch('http://localhost:3001/api/users/123', {
  headers: {
    'Authorization': `Bearer ${data.accessToken}`,
  },
})
```

### JavaScript (Axios)

```javascript
import axios from 'axios'

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:3001/api',
})

// Register
const { data } = await api.post('/auth/register', {
  email: 'user@example.com',
  password: 'SecurePassword123!',
})

// Set token for future requests
api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`

// Authenticated request
const user = await api.get('/users/123')
```

### cURL

```bash
# Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"SecurePassword123!"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"SecurePassword123!"}'

# Authenticated request
curl -X GET http://localhost:3001/api/users/123 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Changelog

### Version 1.0.0 (2024-01-01)

- Initial release
- User authentication (register, login, logout)
- JWT token management
- User CRUD operations
- Role-based access control
- Swagger documentation
