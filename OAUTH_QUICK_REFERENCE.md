# OAuth Quick Reference

## Environment Setup

```bash
# Add to .env file
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
APPLE_CLIENT_ID=com.yourcompany.yourapp
```

## API Endpoints

### Google Sign-In
```
POST /api/v1/auth/google-login
```
```json
{
  "idToken": "google_id_token_here",
  "batchId": "batch_mongodb_id"  // Required for new users only
}
```

### Apple Sign-In
```
POST /api/v1/auth/apple-login
```
```json
{
  "idToken": "apple_id_token_here",
  "batchId": "batch_mongodb_id",  // Required for new users only
  "user": {                        // Optional, only on first sign-in
    "name": {
      "firstName": "John",
      "lastName": "Doe"
    }
  }
}
```

## Response Format (Both Endpoints)

```json
{
  "success": true,
  "token": "jwt_token_here",
  "isNewUser": true,  // or false
  "data": {
    "_id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "user@email.com",
    "authProvider": "google",  // or "apple"
    "batch": "batch_id",
    "course": []
  }
}
```

## Client Integration Examples

### JavaScript (Web)

#### Google Sign-In
```javascript
// After Google Sign-In button clicked
async function handleGoogleSignIn(googleIdToken) {
  const response = await fetch('/api/v1/auth/google-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      idToken: googleIdToken,
      batchId: 'YOUR_BATCH_ID'  // Get from your app state
    })
  });

  const data = await response.json();
  if (data.success) {
    localStorage.setItem('token', data.token);
    // Redirect to dashboard
  }
}
```

#### Apple Sign-In
```javascript
// After Apple Sign-In
async function handleAppleSignIn(appleResponse) {
  const response = await fetch('/api/v1/auth/apple-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      idToken: appleResponse.authorization.id_token,
      batchId: 'YOUR_BATCH_ID',
      user: appleResponse.user  // Only present first time
    })
  });

  const data = await response.json();
  if (data.success) {
    localStorage.setItem('token', data.token);
    // Redirect to dashboard
  }
}
```

### React Example

```jsx
import { GoogleLogin } from '@react-oauth/google';

function LoginPage() {
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await fetch('/api/v1/auth/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idToken: credentialResponse.credential,
          batchId: localStorage.getItem('selectedBatchId')
        })
      });

      const data = await response.json();
      if (data.success) {
        localStorage.setItem('authToken', data.token);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleGoogleSuccess}
      onError={() => console.log('Login Failed')}
    />
  );
}
```

## Database Schema Changes

```javascript
// Student Model now includes:
{
  email: String,                    // NEW: User's email
  authProvider: String,             // NEW: 'local' | 'google' | 'apple'
  providerId: String,               // NEW: OAuth provider's user ID
  password: String,                 // Now optional for OAuth users
  // ... existing fields
}
```

## Error Handling

### Common Errors

```json
// Missing ID Token
{
  "success": false,
  "error": "Google ID token is required"
}

// Invalid Token
{
  "success": false,
  "error": "Failed to verify Google token: Invalid token"
}

// Missing Batch ID (for new users)
{
  "success": false,
  "error": "Batch ID is required for new user registration via Google Sign-In"
}

// Email Conflict
{
  "success": false,
  "error": "An account with email user@email.com already exists. Please use google sign-in or contact support."
}
```

## Testing

### Using cURL

```bash
# Test Google Sign-In
curl -X POST http://localhost:3000/api/v1/auth/google-login \
  -H "Content-Type: application/json" \
  -d '{"idToken":"YOUR_TOKEN","batchId":"YOUR_BATCH_ID"}'

# Test Apple Sign-In
curl -X POST http://localhost:3000/api/v1/auth/apple-login \
  -H "Content-Type: application/json" \
  -d '{"idToken":"YOUR_TOKEN","batchId":"YOUR_BATCH_ID"}'
```

### Using Postman

1. Set method to `POST`
2. URL: `http://localhost:3000/api/v1/auth/google-login`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "idToken": "paste_real_token_here",
  "batchId": "507f1f77bcf86cd799439011"
}
```

## Getting OAuth Credentials

### Google
1. Visit: https://console.cloud.google.com/
2. Create project → APIs & Services → Credentials
3. Create OAuth 2.0 Client ID
4. Copy Client ID

### Apple
1. Visit: https://developer.apple.com/account/
2. Certificates, Identifiers & Profiles → Identifiers
3. Register App ID
4. Enable "Sign In with Apple"
5. Use Bundle ID as `APPLE_CLIENT_ID`

## User Flows

### New User
1. User initiates OAuth sign-in
2. Frontend gets OAuth token
3. Frontend sends `idToken` + `batchId` to API
4. API creates user account
5. API returns JWT + user data (`isNewUser: true`)

### Existing User
1. User initiates OAuth sign-in
2. Frontend gets OAuth token
3. Frontend sends `idToken` to API (no batchId needed)
4. API finds existing user
5. API returns JWT + user data (`isNewUser: false`)

## Security Notes

- ✅ Tokens verified server-side with Google/Apple
- ✅ Password not required for OAuth users
- ✅ Email conflicts prevented
- ✅ HTTPS required in production
- ✅ HTTP-only secure cookies

## Migration Path

Existing users with email/password:
- Continue using local authentication
- OR create new OAuth account (with different email)
- Future: Implement account linking

## Files Modified

- ✅ StudentModel.js - Added OAuth fields
- ✅ StudentController.js - Added OAuth methods
- ✅ studentRoutes.js - Added OAuth routes
- ✅ container.js - Dependency injection
- ✅ .env.example - OAuth config

## Files Created

- ✅ IGoogleOAuthService.js - Interface
- ✅ IAppleOAuthService.js - Interface
- ✅ GoogleOAuthService.js - Implementation
- ✅ AppleOAuthService.js - Implementation
- ✅ GoogleOAuthLogin.js - Use case
- ✅ AppleOAuthLogin.js - Use case
- ✅ OAUTH_GUIDE.md - Full documentation

## Troubleshooting

**Token verification fails?**
- Check CLIENT_ID matches OAuth console
- Ensure token is fresh (not expired)
- Verify token is for correct client

**Batch ID error?**
- New users must provide valid batch ID
- Get batch ID from `/api/v1/batch/getAllBatches`

**Email already exists?**
- User signed up with different provider
- Direct user to original sign-in method

## Support

See `OAUTH_GUIDE.md` for detailed documentation.
