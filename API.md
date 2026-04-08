# Pet Reunite AI - API Documentation

## Base URL

```
https://yourdomain.com/api/v1
```

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Endpoints

### Authentication

#### Register

```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "full_name": "John Doe"
}

Response:
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe"
  },
  "token": "jwt_token"
}
```

#### Login

```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}

Response:
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe"
  },
  "token": "jwt_token"
}
```

#### Verify Token

```
POST /auth/verify
Authorization: Bearer TOKEN

Response:
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe"
  },
  "valid": true
}
```

### Reports

#### List Reports

```
GET /reports?type=lost&limit=20&offset=0
Authorization: Bearer TOKEN

Response:
{
  "reports": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "report_type": "lost",
      "pet_type": "dog",
      "pet_name": "Max",
      "breed": "Golden Retriever",
      "color": "Golden",
      "description": "Missing since April 5th",
      "location_lat": 40.6782,
      "location_lon": -73.9442,
      "photo_url": "https://...",
      "status": "active",
      "created_at": "2024-04-05T10:00:00Z"
    }
  ],
  "total": 100
}
```

#### Create Report

```
POST /reports
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "report_type": "lost",
  "pet_type": "dog",
  "pet_name": "Max",
  "breed": "Golden Retriever",
  "color": "Golden",
  "description": "Missing near Central Park",
  "location_lat": 40.7829,
  "location_lon": -73.9654,
  "photo_url": "https://..."
}

Response: [Report Object]
```

#### Get Report

```
GET /reports/:id
Authorization: Bearer TOKEN

Response: [Report Object]
```

#### Update Report

```
PUT /reports/:id
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "status": "resolved",
  "description": "Found the pet!"
}

Response: [Report Object]
```

#### Delete Report

```
DELETE /reports/:id
Authorization: Bearer TOKEN

Response:
{
  "message": "Report deleted"
}
```

### Matches

#### List Matches

```
GET /matches
Authorization: Bearer TOKEN

Response:
{
  "matches": [
    {
      "id": "uuid",
      "report1_id": "uuid",
      "report2_id": "uuid",
      "confidence_score": 92,
      "status": "active",
      "created_at": "2024-04-05T10:00:00Z",
      "report1_pet_name": "Max",
      "report2_pet_name": "Golden Retriever",
      ...
    }
  ]
}
```

#### Create Match

```
POST /matches
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "report1_id": "uuid",
  "report2_id": "uuid",
  "confidence_score": 92
}

Response: [Match Object]
```

### Users

#### Get Profile

```
GET /users/profile
Authorization: Bearer TOKEN

Response:
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "phone": "+1234567890",
    "address": "123 Main St",
    "city": "Brooklyn",
    "state": "NY",
    "country": "USA",
    "avatar_url": "https://...",
    "bio": "Pet lover",
    "created_at": "2024-03-01T10:00:00Z"
  }
}
```

#### Update Profile

```
PUT /users/profile
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "full_name": "John Doe",
  "phone": "+1234567890",
  "bio": "Pet lover and volunteer"
}

Response: [User Object]
```

### Messages

#### Get Messages

```
GET /messages?conversation_id=uuid
Authorization: Bearer TOKEN

Response:
{
  "messages": [
    {
      "id": "uuid",
      "conversation_id": "uuid",
      "sender_id": "uuid",
      "content": "Hello!",
      "created_at": "2024-04-05T10:00:00Z"
    }
  ]
}
```

#### Send Message

```
POST /messages
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "conversation_id": "uuid",
  "content": "Hello! Did you find my pet?"
}

Response: [Message Object]
```

### Notifications

#### Get Notifications

```
GET /notifications
Authorization: Bearer TOKEN

Response:
{
  "notifications": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "notification_type": "match_found",
      "title": "New Match Found",
      "message": "A potential match was found for Max",
      "related_item_id": "uuid",
      "is_read": false,
      "created_at": "2024-04-05T10:00:00Z"
    }
  ]
}
```

## Error Handling

All errors follow this format:

```json
{
  "error": "Error message",
  "details": "Additional error details"
}
```

### Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Server Error

## Rate Limiting

API requests are rate limited to:

- 100 requests per minute for authenticated users
- 10 requests per minute for unauthenticated users

## Pagination

List endpoints support pagination:

```
GET /reports?limit=20&offset=0
```

- `limit`: Number of results (default: 20, max: 100)
- `offset`: Number of results to skip (default: 0)
