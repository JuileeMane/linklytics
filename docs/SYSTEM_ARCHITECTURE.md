# LinkLytics System Architecture & Design

## 1. High-Level 3-Tier Architecture

LinkLytics employs a decoupled 3-tier enterprise software architecture:
- **Presentation Tier**: React 18 Single Page Application (SPA) powered by Vite, Material UI (MUI v5), and Recharts.
- **Application Logic Tier**: Java 17 Spring Boot 3.3.2 REST API with Spring Security 6, JJWT, and Spring Data JPA.
- **Data Persistence Tier**: PostgreSQL 16 relational database with HikariCP connection pooling and B-tree indexes.

```mermaid
graph TD
    Client["Visitor / User Browser"]
    
    subgraph Frontend["Presentation Tier (React + Vite)"]
        UI["Material UI Components & Pages"]
        Router["React Router DOM"]
        AxiosClient["Axios HTTP Client"]
        Charts["Recharts Visualizations"]
    end

    subgraph Backend["Application Logic Tier (Spring Boot 3.3.2)"]
        SecurityFilter["Spring Security / JWT Filter"]
        Controllers["REST Controllers (/api/*, /r/*)"]
        Services["Business Logic Services"]
        QR["ZXing Local QR Engine"]
        Repos["Spring Data JPA Repositories"]
    end

    subgraph Database["Persistence Tier (PostgreSQL 16)"]
        Tables["users, links, click_events, folders, tags, campaigns"]
        Indexes["B-Tree Indexes (shortCode, email, clickedAt)"]
    end

    Client -->|HTTP / HTTPS| UI
    UI --> Router
    Router --> AxiosClient
    AxiosClient -->|JSON REST Requests| SecurityFilter
    SecurityFilter --> Controllers
    Controllers --> Services
    Services --> QR
    Services --> Repos
    Repos -->|HikariCP / JDBC| Database
    Database --> Repos
    Controllers -->|JSON Responses / HTTP 302| Client
```

---

## 2. Short Link Redirection & Click Event Pipeline

When a visitor navigates to `https://linklytics.com/r/{shortCode}`:

```mermaid
sequenceDiagram
    autonumber
    actor Visitor
    participant Browser
    participant RedirectCtrl as RedirectController
    participant RedirectSvc as RedirectService
    participant LinkRepo as LinkRepository
    participant ClickRepo as ClickEventRepository
    participant DB as PostgreSQL Database
    actor Target as Destination Website

    Visitor->>Browser: Enters short URL (/r/demo)
    Browser->>RedirectCtrl: GET /r/demo
    RedirectCtrl->>RedirectSvc: resolveDestination("demo", req)
    RedirectSvc->>LinkRepo: findByShortCode("demo")
    LinkRepo->>DB: SELECT * FROM links WHERE short_code = 'demo'
    DB-->>LinkRepo: Link entity
    
    alt Link not found
        RedirectSvc-->>RedirectCtrl: ResourceNotFoundException (404)
        RedirectCtrl-->>Browser: 404 Destination Not Found
    else Link inactive or expired
        RedirectSvc-->>RedirectCtrl: BadRequestException (400)
        RedirectCtrl-->>Browser: Link is paused or expired
    else Password protected & no password
        RedirectSvc-->>RedirectCtrl: UnauthorizedException
        RedirectCtrl-->>Browser: Redirect to /p/demo (Password Unlock Screen)
    else Valid link
        RedirectSvc->>LinkRepo: Increment clickCount
        RedirectSvc->>ClickRepo: Save ClickEvent (Browser, OS, Device, Referrer, VisitorHash)
        ClickRepo->>DB: INSERT INTO click_events (...)
        RedirectSvc-->>RedirectCtrl: Returns original destination URL
        RedirectCtrl-->>Browser: HTTP 302 Found (Location: https://destination.com)
        Browser->>Target: GET https://destination.com
    end
```

---

## 3. Use Case Diagram

```mermaid
graph LR
    User["Registered User"]
    Admin["System Administrator"]
    Visitor["Public Link Visitor"]

    subgraph LinkLytics["LinkLytics Platform Capabilities"]
        UC1["Register & Authenticate (JWT)"]
        UC2["Shorten URL (Base62 / Vanity Alias)"]
        UC3["Set Password & Expiry Date"]
        UC4["View Real-time Analytics Dashboard"]
        UC5["Organize in Folders & Tags"]
        UC6["Create Marketing Campaigns"]
        UC7["Generate & Download QR Code"]
        UC8["Export Performance to CSV"]
        UC9["Access Short Link (/r/{code})"]
        UC10["Unlock Password Protected Link"]
        UC11["Monitor Suspicious Abusive Links"]
        UC12["Manage & Toggle User Status"]
    end

    User --> UC1
    User --> UC2
    User --> UC3
    User --> UC4
    User --> UC5
    User --> UC6
    User --> UC7
    User --> UC8

    Visitor --> UC9
    Visitor --> UC10

    Admin --> UC11
    Admin --> UC12
    Admin --> UC4
```

---

## 4. Data Flow Diagram (DFD Level 1)

```mermaid
flowchart TD
    U[User] -->|1. Long URL + Alias| P1[Process: URL Shortener]
    P1 -->|2. Generate Base62 Code| D1[(Links Table)]
    
    V[Visitor] -->|3. Access Short URL| P2[Process: Redirect Engine]
    D1 -->|4. Retrieve Target URL| P2
    P2 -->|5. HTTP 302 Redirection| V
    
    P2 -->|6. Log Click Event Data| D2[(Click Events Table)]
    
    U -->|7. View Analytics Request| P3[Process: Analytics Aggregator]
    D1 -->|8. Link Metrics| P3
    D2 -->|9. Raw Click Events| P3
    P3 -->|10. Trends, Charts, Breakdown JSON| U
```

---

## 5. Security & Authentication Architecture

1. **Stateless JWT Tokens**:
   - Authentication is issued via `POST /api/auth/login`.
   - The token contains: `subject` (email), `userId`, `role` (`ROLE_USER` or `ROLE_ADMIN`), and standard expiration claims signed with HMAC-SHA256.
   - The React frontend stores the token in `localStorage` and automatically attaches it to Axios headers via interceptors:
     ```
     Authorization: Bearer <jwt_token>
     ```
2. **Spring Security Filter Chain**:
   - `JwtAuthenticationFilter` intercepts each request, validates the signature and timestamp, and populates `SecurityContextHolder`.
   - Cross-Origin Resource Sharing (CORS) is configured to permit designated frontend origins with allowed HTTP methods (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS`).
3. **Password Security**:
   - Plaintext passwords are never stored or logged.
   - All passwords (user accounts and protected links) are hashed using `BCryptPasswordEncoder` with standard cost factor 10.
