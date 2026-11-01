# LinkLytics REST API Specification

LinkLytics provides an OpenAPI 3.0-compliant RESTful interface. All API payloads use `application/json`. Short-link redirects issue HTTP 302/307 redirections.

---

## 1. Authentication Scheme

Protected endpoints require a standard HTTP `Authorization` header containing the issued JSON Web Token:
```http
Authorization: Bearer <jwt_token>
```

---

## 2. Authentication Endpoints

### 2.1 Register User
- **Method**: `POST`
- **Path**: `/api/auth/register`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "name": "Alex Developer",
    "email": "alex@example.com",
    "password": "Password123"
  }
  ```
- **Response** (`201 Created`):
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresInMs": 86400000,
    "user": {
      "id": 1,
      "name": "Alex Developer",
      "email": "alex@example.com",
      "role": "ROLE_USER",
      "active": true,
      "totalLinks": 0,
      "totalClicks": 0
    }
  }
  ```

### 2.2 Login User
- **Method**: `POST`
- **Path**: `/api/auth/login`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "email": "demo@linklytics.com",
    "password": "Demo@123"
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresInMs": 86400000,
    "user": {
      "id": 2,
      "name": "Alex Developer",
      "email": "demo@linklytics.com",
      "role": "ROLE_USER",
      "active": true,
      "totalLinks": 5,
      "totalClicks": 604
    }
  }
  ```

### 2.3 Current User Profile
- **Method**: `GET`
- **Path**: `/api/auth/me`
- **Access**: Authenticated

---

## 3. Link Management Endpoints

### 3.1 Create Short Link
- **Method**: `POST`
- **Path**: `/api/links`
- **Access**: Authenticated
- **Request Body**:
  ```json
  {
    "originalUrl": "https://react.dev/learn",
    "customAlias": "react-quickstart",
    "title": "React Documentation",
    "folderId": 1,
    "campaignId": 1,
    "tagNames": ["react", "frontend"],
    "password": "optionalPassword",
    "expirationDate": "2026-12-31T23:59:00"
  }
  ```
- **Response** (`201 Created`):
  ```json
  {
    "id": 12,
    "originalUrl": "https://react.dev/learn",
    "shortCode": "react-quickstart",
    "shortUrl": "http://localhost:8080/r/react-quickstart",
    "title": "React Documentation",
    "passwordProtected": true,
    "active": true,
    "archived": false,
    "favorite": false,
    "clickCount": 0,
    "createdAt": "2026-11-01T11:40:00"
  }
  ```

### 3.2 List User Links (Paginated & Filtered)
- **Method**: `GET`
- **Path**: `/api/links`
- **Access**: Authenticated
- **Query Parameters**:
  - `search` (string): Query filter across title, URL, and code.
  - `status` (string): `all`, `active`, `favorite`, `archived`, `expired`.
  - `folderId` (long): Filter by folder.
  - `campaignId` (long): Filter by campaign.
  - `page` (int, default: 0)
  - `size` (int, default: 10)
  - `sortBy` (string, default: `createdAt`)
  - `direction` (string, default: `desc`)

### 3.3 Link Operations
- `GET /api/links/{id}`: Retrieve link details.
- `PUT /api/links/{id}`: Update destination, title, folder, tags, password.
- `DELETE /api/links/{id}`: Permanently delete link.
- `PATCH /api/links/{id}/toggle-active`: Pause or activate link.
- `PATCH /api/links/{id}/archive`: Archive or restore link.
- `PATCH /api/links/{id}/favorite`: Star/unstar link.
- `GET /api/links/{id}/qr?size=300&format=base64`: Generate QR code.
- `GET /api/links/export/csv`: Stream CSV export file.

---

## 4. Redirect Engine

### 4.1 Execute Redirection
- **Method**: `GET`
- **Path**: `/r/{shortCode}`
- **Access**: Public
- **Behavior**:
  - Finds link in PostgreSQL.
  - Verifies `active == true` and `expirationDate > now()`.
  - Records visitor `ClickEvent`.
  - Increments `clickCount`.
  - Returns `HTTP 302 Found` redirecting to `Location: {originalUrl}`.
  - If password protected, redirects to frontend unlock screen `/p/{shortCode}`.

### 4.2 Verify Password for Protected Link
- **Method**: `POST`
- **Path**: `/r/{shortCode}/verify`
- **Access**: Public
- **Request Body**:
  ```json
  { "password": "userEnteredPassword" }
  ```
- **Response** (`200 OK`):
  ```json
  { "destinationUrl": "https://protected-website.com" }
  ```

---

## 5. Analytics Endpoints

### 5.1 Dashboard Overview
- **Method**: `GET`
- **Path**: `/api/analytics/overview`
- **Access**: Authenticated
- **Returns**: Total links, total clicks, estimated unique visitors, 30-day click trends array, device counts, browser counts, OS counts, referrer sources, and recent click logs.

### 5.2 Single Link Analytics
- **Method**: `GET`
- **Path**: `/api/analytics/link/{id}`
- **Access**: Authenticated
- **Returns**: Deep dive metrics, 30-day time points, breakdown charts, and detailed click event log for the specific link.

---

## 6. Admin Governance Endpoints

*(Requires `ROLE_ADMIN`)*
- `GET /api/admin/dashboard`: Global platform counters, active users, total clicks.
- `GET /api/admin/users`: List of all registered users with their link counts.
- `PATCH /api/admin/users/{id}/toggle-status`: Suspend or reinstate user accounts.
- `GET /api/admin/suspicious-links`: Automated detector for high-velocity links (>1000 clicks) or suspicious TLDs.
- `DELETE /api/admin/links/{id}`: Delete abusive link from the platform.

---

## 7. Health & Monitoring

- **Method**: `GET`
- **Path**: `/api/health`
- **Access**: Public
- **Response**:
  ```json
  {
    "status": "UP",
    "service": "LinkLytics Backend",
    "version": "1.0.0",
    "database": "CONNECTED",
    "timestamp": "2026-11-01T11:42:00"
  }
  ```
