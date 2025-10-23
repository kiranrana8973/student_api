# OAuth Integration Guide

This guide covers the implementation of Google and Apple Sign-In for the Student API.

## Table of Contents
1. [Overview](#overview)
2. [Setup Instructions](#setup-instructions)
3. [API Endpoints](#api-endpoints)
4. [Client Integration](#client-integration)
5. [Testing](#testing)
6. [Security Considerations](#security-considerations)

## Overview

The Student API now supports three authentication methods:
- **Local Authentication**: Traditional email/password
- **Google Sign-In**: OAuth 2.0 authentication via Google
- **Apple Sign-In**: OAuth authentication via Apple

### Features
- Automatic user creation on first OAuth login
- Email conflict detection across different auth providers
- Email-based user identification
- Batch assignment for new users
- Profile data import from OAuth providers

## Setup Instructions

### 1. Google OAuth Setup

#### a. Create Google OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Configure the OAuth consent screen if you haven't already
6. Select **Application type**:
   - **Web application** (for web apps)
   - **iOS** (for iOS apps)
   - **Android** (for Android apps)
7. Add authorized redirect URIs (for web) or configure bundle ID (for mobile)
8. Copy the **Client ID**

#### b. Configure Environment Variables
Add to your `.env` file:
```bash
GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
```

### 2. Apple Sign-In Setup

#### a. Create Apple Sign-In Service
1. Go to [Apple Developer Portal](https://developer.apple.com/account/)
2. Navigate to **Certificates, Identifiers & Profiles**
3. Select **Identifiers** from the sidebar
4. Register a new **App ID** or use existing one
5. Enable **Sign In with Apple** capability
6. Note your **Bundle ID** (e.g., `com.yourcompany.yourapp`)

#### b. Configure Environment Variables
Add to your `.env` file:
```bash
APPLE_CLIENT_ID=com.yourcompany.yourapp
```

### 3. Install Dependencies

The required packages are already installed:
- `google-auth-library` - For Google OAuth verification
- `apple-signin-auth` - For Apple Sign-In verification

## API Endpoints

### Google Sign-In

**Endpoint:** `POST /api/v1/auth/google-login`

**Request Body:**
```json
{
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6...",
  "batchId": "507f1f77bcf86cd799439011"
}
```

**Parameters:**
- `idToken` (required): Google ID token obtained from client-side Google Sign-In
- `batchId` (optional): Required only for new users. MongoDB ObjectId of the batch to assign

**Response (Existing User - 200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "isNewUser": false,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@gmail.com",
    "authProvider": "google",
    "batch": "507f1f77bcf86cd799439012",
    "course": []
  }
}
```

**Response (New User - 201):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "isNewUser": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@gmail.com",
    "authProvider": "google",
    "image": "https://lh3.googleusercontent.com/a/...",
    "batch": "507f1f77bcf86cd799439012",
    "course": []
  }
}
```

### Apple Sign-In

**Endpoint:** `POST /api/v1/auth/apple-login`

**Request Body:**
```json
{
  "idToken": "eyJraWQiOiJlWGF1bm1MIiwiYWxnIjoiUlMyNTYifQ...",
  "batchId": "507f1f77bcf86cd799439011",
  "user": {
    "name": {
      "firstName": "John",
      "lastName": "Doe"
    }
  }
}
```

**Parameters:**
- `idToken` (required): Apple ID token from client-side Apple Sign-In
- `batchId` (optional): Required only for new users
- `user` (optional): User data - **ONLY provided by Apple on first sign-in**. Contains name information.

**Response:** Same format as Google Sign-In

**Important Notes:**
- Apple only provides user name on the **first sign-in**
- Email may be hidden if user chooses "Hide My Email"
- Always cache user data on first sign-in from client side

## Client Integration

### Web Application (React/Vue/Angular)

#### Google Sign-In

```javascript
// 1. Load Google Sign-In library
<script src="https://accounts.google.com/gsi/client" async defer></script>

// 2. Initialize Google Sign-In
google.accounts.id.initialize({
  client_id: 'YOUR_GOOGLE_CLIENT_ID',
  callback: handleGoogleResponse
});

// 3. Handle the response
async function handleGoogleResponse(response) {
  const idToken = response.credential;

  // Make API request
  const result = await fetch('http://localhost:3000/api/v1/auth/google-login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      idToken: idToken,
      batchId: 'YOUR_BATCH_ID' // Include for new users
    })
  });

  const data = await result.json();

  if (data.success) {
    // Store token
    localStorage.setItem('token', data.token);

    // Check if new user
    if (data.isNewUser) {
      console.log('Welcome! Your account has been created.');
    }

    // Redirect to dashboard
    window.location.href = '/dashboard';
  }
}

// 4. Render the button
google.accounts.id.renderButton(
  document.getElementById('googleSignInButton'),
  { theme: 'outline', size: 'large' }
);
```

#### Apple Sign-In

```javascript
// 1. Load Apple Sign-In library
<script src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js"></script>

// 2. Initialize Apple Sign-In
AppleID.auth.init({
  clientId: 'YOUR_APPLE_CLIENT_ID',
  scope: 'name email',
  redirectURI: 'https://your-domain.com/auth/apple/callback',
  usePopup: true
});

// 3. Handle sign-in
document.getElementById('appleSignInButton').addEventListener('click', async () => {
  try {
    const data = await AppleID.auth.signIn();

    // Make API request
    const result = await fetch('http://localhost:3000/api/v1/auth/apple-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idToken: data.authorization.id_token,
        batchId: 'YOUR_BATCH_ID',
        user: data.user // Only present on first sign-in
      })
    });

    const responseData = await result.json();

    if (responseData.success) {
      localStorage.setItem('token', responseData.token);
      window.location.href = '/dashboard';
    }
  } catch (error) {
    console.error('Apple Sign-In failed:', error);
  }
});
```

### iOS Application (Swift)

#### Google Sign-In

```swift
import GoogleSignIn

// Configure Google Sign-In
GIDSignIn.sharedInstance.signIn(
    withPresenting: self
) { signInResult, error in
    guard let result = signInResult else {
        print("Error: \(error?.localizedDescription ?? "Unknown error")")
        return
    }

    guard let idToken = result.user.idToken?.tokenString else {
        print("Failed to get ID token")
        return
    }

    // Send to your API
    self.authenticateWithBackend(idToken: idToken, provider: "google")
}

func authenticateWithBackend(idToken: String, provider: String) {
    let url = URL(string: "http://localhost:3000/api/v1/auth/\(provider)-login")!
    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")

    let body: [String: Any] = [
        "idToken": idToken,
        "batchId": "YOUR_BATCH_ID"
    ]

    request.httpBody = try? JSONSerialization.data(withJSONObject: body)

    URLSession.shared.dataTask(with: request) { data, response, error in
        // Handle response
    }.resume()
}
```

#### Apple Sign-In

```swift
import AuthenticationServices

class ViewController: UIViewController, ASAuthorizationControllerDelegate {

    func handleAppleSignIn() {
        let request = ASAuthorizationAppleIDProvider().createRequest()
        request.requestedScopes = [.fullName, .email]

        let controller = ASAuthorizationController(authorizationRequests: [request])
        controller.delegate = self
        controller.performRequests()
    }

    func authorizationController(
        controller: ASAuthorizationController,
        didCompleteWithAuthorization authorization: ASAuthorization
    ) {
        guard let credential = authorization.credential as? ASAuthorizationAppleIDCredential,
              let idTokenData = credential.identityToken,
              let idToken = String(data: idTokenData, encoding: .utf8) else {
            return
        }

        var userData: [String: Any]?
        if let fullName = credential.fullName {
            userData = [
                "name": [
                    "firstName": fullName.givenName ?? "",
                    "lastName": fullName.familyName ?? ""
                ]
            ]
        }

        // Send to backend
        let body: [String: Any] = [
            "idToken": idToken,
            "batchId": "YOUR_BATCH_ID",
            "user": userData as Any
        ]

        // Make API call...
    }
}
```

### Android Application (Kotlin)

#### Google Sign-In

```kotlin
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInOptions

// Configure Google Sign-In
val gso = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
    .requestIdToken("YOUR_GOOGLE_CLIENT_ID")
    .requestEmail()
    .build()

val googleSignInClient = GoogleSignIn.getClient(this, gso)

// Launch sign-in
val signInIntent = googleSignInClient.signInIntent
startActivityForResult(signInIntent, RC_SIGN_IN)

// Handle result
override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
    super.onActivityResult(requestCode, resultCode, data)

    if (requestCode == RC_SIGN_IN) {
        val task = GoogleSignIn.getSignedInAccountFromIntent(data)
        try {
            val account = task.getResult(ApiException::class.java)
            val idToken = account?.idToken

            // Send to backend
            authenticateWithBackend(idToken)
        } catch (e: ApiException) {
            Log.e(TAG, "Google sign-in failed", e)
        }
    }
}
```

## Testing

### Manual Testing with cURL

#### Test Google Sign-In
```bash
curl -X POST http://localhost:3000/api/v1/auth/google-login \
  -H "Content-Type: application/json" \
  -d '{
    "idToken": "YOUR_GOOGLE_ID_TOKEN",
    "batchId": "507f1f77bcf86cd799439011"
  }'
```

#### Test Apple Sign-In
```bash
curl -X POST http://localhost:3000/api/v1/auth/apple-login \
  -H "Content-Type: application/json" \
  -d '{
    "idToken": "YOUR_APPLE_ID_TOKEN",
    "batchId": "507f1f77bcf86cd799439011",
    "user": {
      "name": {
        "firstName": "John",
        "lastName": "Doe"
      }
    }
  }'
```

### Test Cases to Verify

1. **New User Registration**
   - ✓ User created successfully with OAuth provider
   - ✓ Batch assignment works
   - ✓ Email-based user identification
   - ✓ JWT token returned
   - ✓ Profile data imported from provider

2. **Existing User Login**
   - ✓ User authenticated successfully
   - ✓ Correct JWT token returned
   - ✓ isNewUser flag is false

3. **Error Scenarios**
   - ✓ Invalid token returns error
   - ✓ Missing batch ID for new user returns error
   - ✓ Email conflict with different provider returns error
   - ✓ Invalid batch ID returns error

## Security Considerations

### 1. Token Verification
- All OAuth tokens are verified with the respective provider (Google/Apple)
- Never trust client-provided user data without token verification

### 2. Email Conflicts
- System prevents users from signing up with the same email using different providers
- Users are informed which provider they originally used

### 3. HTTPS Required
- **Always use HTTPS in production** for OAuth flows
- Set `secure: true` in cookie options for production

### 4. Environment Variables
- Keep OAuth credentials in environment variables
- Never commit credentials to version control
- Use different credentials for development/staging/production

### 5. CORS Configuration
- Configure CORS properly to only allow trusted domains
- Update `CORS_ORIGIN` in `.env` for production

### 6. Rate Limiting
- Consider implementing rate limiting for OAuth endpoints
- Prevent brute force attacks on authentication

### 7. Token Expiration
- JWT tokens have expiration (default 30 days)
- Implement refresh token mechanism for better security

## Troubleshooting

### Common Issues

#### "Failed to verify Google token"
- Check that `GOOGLE_CLIENT_ID` matches the client ID from Google Console
- Ensure the token is fresh (not expired)
- Verify the token was generated for the correct client ID

#### "Failed to verify Apple token"
- Check that `APPLE_CLIENT_ID` matches your app's bundle ID
- Ensure Apple Sign-In is enabled in your Apple Developer account

#### "Batch ID is required for new user registration"
- Include `batchId` in request body when user signs in for first time
- Get batch ID from `/api/v1/batch/getAllBatches` endpoint

#### "An account with email already exists"
- User previously signed up with different provider
- Direct user to use original sign-in method
- Consider implementing account linking feature

## Architecture Overview

The OAuth implementation follows Clean Architecture principles:

```
Domain Layer (Business Logic)
├── services/
│   ├── IGoogleOAuthService.js    # Google OAuth interface
│   └── IAppleOAuthService.js     # Apple OAuth interface

Application Layer (Use Cases)
├── use-cases/student/
│   ├── GoogleOAuthLogin.js       # Google login business logic
│   └── AppleOAuthLogin.js        # Apple login business logic

Infrastructure Layer (Implementation)
├── services/
│   ├── GoogleOAuthService.js     # Google OAuth implementation
│   └── AppleOAuthService.js      # Apple OAuth implementation

Presentation Layer (HTTP)
├── controllers/
│   └── StudentController.js      # OAuth endpoints
└── routes/
    └── studentRoutes.js          # Route definitions
```

## Future Enhancements

Consider implementing:
1. **Account Linking**: Allow users to link multiple OAuth providers
2. **Refresh Tokens**: Implement refresh token mechanism
3. **OAuth Scope Management**: Request additional user permissions
4. **Profile Sync**: Sync profile updates from OAuth providers
5. **Social Login Analytics**: Track which providers users prefer
6. **Multi-factor Authentication**: Add extra security layer

## Support

For issues or questions:
- Check the [API Documentation](./API_ROUTES.md)
- Review [Testing Guide](./TESTING_GUIDE.md)
- Contact: Kiran Rana (kiran@example.com)
