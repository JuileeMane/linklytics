# LinkLytics — 30 High-Probability Viva Questions & Clear Answers

This guide is designed to prepare you for technical defense, project demonstrations, and viva voce examinations before faculty evaluators.

---

### Q1: What is the core problem LinkLytics solves?
**Answer**: Long URLs with dynamic parameters are difficult to share, unreadable in print, and lack tracking capabilities. LinkLytics converts long URLs into short 7-character Base62 links while tracking visitor interactions (device type, operating system, browser, referrer, and timestamps) in real-time.

---

### Q2: What is the architecture of LinkLytics?
**Answer**: It follows a decoupled 3-tier client-server architecture:
1. **Frontend**: React Single Page Application (Vite, Material UI, Recharts).
2. **Backend**: Java 17 Spring Boot REST API with Spring Security and Spring Data JPA.
3. **Database**: PostgreSQL relational database with B-tree indexes for fast lookups.

---

### Q3: Why did you choose Base62 encoding for short codes?
**Answer**: Base62 uses characters `[0-9a-zA-Z]`. Unlike Base64, it avoids special characters like `+`, `/`, and `=` which require URL encoding or create ambiguities in web addresses. A 7-character Base62 string provides $62^7 \approx 3.52 \text{ trillion}$ unique combinations.

---

### Q4: How does the application handle short code collisions?
**Answer**: When a random 7-character code is generated, the backend queries `linkRepository.existsByShortCode(code)`. If a collision occurs (which has an astronomical low probability), the code re-generates in a loop up to 10 times, with a fallback to timestamp encoding. In addition, `short_code` has a `UNIQUE` constraint at the PostgreSQL database level.

---

### Q5: How does HTTP redirection work in Spring Boot?
**Answer**: When a visitor accesses `/r/{shortCode}`, the `RedirectController` resolves the destination URL through `RedirectService`. If valid, it records the click event and returns an HTTP 302 Found response with the `Location: {destinationUrl}` header, causing the visitor's browser to immediately navigate to the target site.

---

### Q6: What is the difference between an HTTP 301 and HTTP 302 redirect? Why use 302?
**Answer**: 
- **HTTP 301** is a "Permanent Redirect", which browsers cache locally. Subsequent clicks would bypass our backend, preventing accurate analytics tracking.
- **HTTP 302 / 307** is a "Temporary Redirect". The browser does not cache the destination permanently, forcing every visitor click to pass through our backend so every click is counted.

---

### Q7: How does authentication work in LinkLytics?
**Answer**: Authentication is stateless using JSON Web Tokens (JWT). When a user logs in with valid credentials, the server generates a cryptographically signed JWT containing their user ID, email, and role. The client includes this token in the `Authorization: Bearer <token>` header for subsequent requests.

---

### Q8: Where is the JWT secret kept, and how is the token verified?
**Answer**: The secret is loaded from the `JWT_SECRET` environment variable and never committed to source code. For every incoming request, `JwtAuthenticationFilter` intercepts the header, validates the signature using HMAC-SHA256, checks expiration, and sets the `SecurityContext`.

---

### Q9: Why use BCrypt for passwords instead of MD5 or SHA-256?
**Answer**: MD5 and SHA-256 are fast general hashing algorithms vulnerable to rainbow table attacks and brute force. BCrypt is an adaptive key-derivation function that incorporates an automatic salt and a configurable work/cost factor, making brute-force attacks computationally infeasible.

---

### Q10: How do you prevent one user from accessing or modifying another user's links?
**Answer**: Link ownership is enforced at the JPA service layer. Every query uses `findByIdAndUser(id, authenticatedUser)`. Even if an attacker guesses another user's link ID, the database query returns empty, triggering a `404 Not Found` or `403 Forbidden`.

---

### Q11: How do you calculate analytics without storing raw visitor IP addresses?
**Answer**: To protect visitor privacy, LinkLytics hashes the visitor's IP address combined with their User-Agent using SHA-256 (`SHA-256(ip + userAgent)`). This produces an anonymous `visitor_hash`. Unique visitors are calculated using `COUNT(DISTINCT visitor_hash)` without ever retaining raw IP data.

---

### Q12: How are device types, operating systems, and browsers detected?
**Answer**: The backend parses the standard HTTP `User-Agent` header using `UserAgentParser`. It analyzes substring signatures to classify hardware (`Mobile`, `Tablet`, `Desktop`), OS (`Windows`, `macOS`, `Linux`, `iOS`, `Android`), and browser (`Chrome`, `Firefox`, `Safari`, `Edge`).

---

### Q13: How does the application generate QR codes without paying for an external API?
**Answer**: It uses the local Google ZXing (`com.google.zxing`) open-source Java library. ZXing encodes the short URL into a BitMatrix and writes PNG bytes or Base64 data directly from the backend server with 0 network latency and 0 external API costs.

---

### Q14: How does LinkLytics handle password-protected links?
**Answer**: If a link has `passwordProtected = true`, the link's password is saved as a BCrypt hash. When a visitor requests `/r/{shortCode}`, the server redirects them to `/p/{shortCode}` (the password unlock page). The visitor submits the password to `POST /r/{shortCode}/verify`, which checks it with `passwordEncoder.matches()` before allowing redirection.

---

### Q15: How does link expiration work?
**Answer**: Links have an optional `expiration_date` timestamp. During redirect resolution, the backend checks `link.isExpired()`. If the current time is after `expirationDate`, the request is rejected with a descriptive message indicating the link has expired.

---

### Q16: What is the purpose of Spring Data JPA and Hibernate?
**Answer**: Spring Data JPA is an abstraction layer on top of JPA (Jakarta Persistence API) that reduces boilerplate DAO code by generating SQL queries from repository method names (e.g. `findByShortCode`). Hibernate is the underlying Object-Relational Mapping (ORM) engine that translates Java entity objects into PostgreSQL database rows.

---

### Q17: What database indexes did you create and why?
**Answer**:
1. `idx_links_short_code`: Unique index on `shortCode` to make redirects $O(1)$ fast.
2. `idx_users_email`: Unique index on `email` for instant user authentication.
3. `idx_click_events_link_id` & `idx_click_events_clicked_at`: Speeds up analytics aggregation over 30-day time windows.

---

### Q18: What is CORS and how did you configure it?
**Answer**: Cross-Origin Resource Sharing (CORS) is a browser security mechanism that blocks web pages from making requests to a different domain. We configured a `CorsConfigurationSource` bean in Spring Security permitting requests from `http://localhost:5173` (local Vite) and the deployed production frontend domain with headers like `Authorization` and `Content-Type`.

---

### Q19: What is the role of DTOs (Data Transfer Objects)?
**Answer**: DTOs decouple the internal database entity models from external client contracts. They prevent over-posting vulnerabilities, hide internal entity columns (like `passwordHash`), and allow validation annotations (`@NotBlank`, `@Email`, `@Size`) on incoming requests.

---

### Q20: How does centralized exception handling work in Spring Boot?
**Answer**: LinkLytics uses `@RestControllerAdvice` in `GlobalExceptionHandler`. It intercepts exceptions (`ResourceNotFoundException`, `BadRequestException`, `MethodArgumentNotValidException`) and returns standardized JSON `ErrorResponse` objects with appropriate HTTP status codes (400, 401, 403, 404, 500).

---

### Q21: How are React and Material UI utilized in the frontend?
**Answer**: The frontend uses functional components and hooks (`useState`, `useEffect`, `useContext`, `useCallback`). Material UI provides the design system (Cards, Modals, Forms, Chips, Theme palette). A custom `ThemeContext` toggles between light and dark modes with persistent `localStorage` state.

---

### Q22: Why use Recharts for analytics?
**Answer**: Recharts is a declarative charting library built natively on React components and SVG. It provides responsive containers, smooth animations, interactive tooltips, and gradient area fills without heavy dependencies.

---

### Q23: What is the UTM Builder and why is it useful?
**Answer**: UTM (Urchin Tracking Module) parameters are query string tags (`utm_source`, `utm_medium`, `utm_campaign`) appended to URLs to track the effectiveness of marketing campaigns in Google Analytics. Our UTM builder provides channel presets and concatenates them with 1-click short link generation.

---

### Q24: How does the CSV export feature work?
**Answer**: The user triggers `GET /api/links/export/csv`. The backend uses `org.apache.commons:commons-csv` to stream link metadata and click totals directly to the HTTP response with `Content-Type: text/csv` and `Content-Disposition: attachment; filename="linklytics-links.csv"`.

---

### Q25: What is the difference between USER and ADMIN roles?
**Answer**:
- `ROLE_USER`: Can create, manage, organize, and view analytics only for links they own.
- `ROLE_ADMIN`: Can access the Admin Console (`/api/admin/*`), view platform-wide totals, suspend/activate user accounts, inspect suspicious high-volume links, and delete abusive links.

---

### Q26: What are suspicious links in your system?
**Answer**: The Admin module filters links that exhibit abnormal traffic velocity (e.g. $> 1000$ clicks in short durations) or point to suspicious top-level domains. Administrators can review these links and delete them if they represent spam or abuse.

---

### Q27: How does LinkLytics support cloud deployment?
**Answer**: The application is designed to be cloud-native:
- Server port dynamically uses `${PORT:8080}`.
- Database connection reads `${SPRING_DATASOURCE_URL}` supporting cloud providers like Neon PostgreSQL with SSL (`sslmode=require`).
- CORS origin reads `${CORS_ALLOWED_ORIGINS}`.
- Prepared for Render (backend) and Vercel (frontend).

---

### Q28: How does the application automatically seed test data?
**Answer**: Through `DataInitializer`, which implements `CommandLineRunner`. On application boot, if the database is empty, it automatically hashes passwords and seeds an admin user, a demo user, 3 folders, 4 tags, 1 campaign, 5 links, and 604 realistic historical click events across devices and browsers.

---

### Q29: What automated testing did you perform?
**Answer**: We wrote and executed 15 unit and integration tests using JUnit 5 and Mockito:
- Algorithm tests for Base62 encoding and alias validation.
- Regular expression parsing tests for User-Agent signatures.
- Service tests for registration duplicate rejection and credential validation.
- Spring Boot context boot test with an in-memory database profile.
- Production frontend build test using Vite.

---

### Q30: What are potential future enhancements for LinkLytics?
**Answer**:
1. Integration with a MaxMind GeoIP database for city-level map visualizations.
2. Custom vanity domain routing (e.g. `brand.co/link`).
3. Webhook notifications when a link reaches a click milestone.
4. Rate limiting per IP using Redis and token bucket algorithms.
