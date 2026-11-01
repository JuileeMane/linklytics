# Project Abstract: LinkLytics Platform

## 1. Project Title
**LinkLytics — Enterprise-Grade URL Shortening, Branded Management, and Click Analytics Engine**

---

## 2. Problem Statement
In today's digital landscape, modern marketing, digital communications, and distributed software engineering depend on sharing concise, readable web addresses. Long URLs with complex paths and query parameters are cumbersome, visually unappealing, difficult to convey across print media, and error-prone when shared.

Furthermore, traditional free shortening services suffer from significant drawbacks:
1. **Lack of In-Depth Real-Time Analytics**: Basic tools fail to provide transparent insights regarding visitor hardware, operating systems, referrers, and hourly traffic velocity.
2. **Privacy Concerns & Raw IP Tracking**: Many public tools harvest and monetize raw visitor IP addresses.
3. **Vendor Lock-in & Paid APIs**: Many applications rely heavily on paid external APIs (such as Google Maps, Bitly API, or commercial QR services), making self-hosting expensive and fragile.
4. **Lack of Governance & Organization**: Standard shorten tools offer simple flat lists without support for folder organization, marketing campaigns, or multi-tag taxonomies.

---

## 3. Project Objectives
The objective of this B.Tech full-stack computer science project is to design, implement, test, and prepare for live deployment a production-grade URL shortening and analytics platform with:
- **Base62 URL Shortening Algorithm**: High-throughput generation of collision-resistant 7-character alphanumeric codes with vanity alias support.
- **Real-Time Click Tracking Engine**: Every redirect through `/r/{shortCode}` parses User-Agent headers, cleans referral domains, and hashes visitor IPs with SHA-256 for privacy-preserving unique visitor estimation.
- **PostgreSQL Relational Persistence**: Complete relational schema supporting Users, Roles, Folders, Tags, Campaigns, Links, and ClickEvents with database-level indexes on high-frequency query columns.
- **Enterprise Security**: Spring Security 6 stateless architecture with JJWT (JSON Web Tokens), BCrypt password hashing, and user-isolated link ownership enforcement.
- **Native Local QR Code Studio**: QR code generation using the ZXing Java library without external paid APIs.
- **SaaS User Experience**: Responsive Material UI (MUI v5) interface with dark/light themes, Recharts data visualization, and instant feedback.

---

## 4. Existing System vs. Proposed System

| Parameter | Existing System (Legacy Shorteners) | Proposed System (LinkLytics) |
|---|---|---|
| **Architecture** | Monolithic server-side JSP/PHP or simple script | Decoupled 3-Tier: React SPA + Spring Boot REST API + PostgreSQL |
| **Shortening Strategy** | Sequential ID or slow hashing collisions | Base62 alphanumeric generation with database indexing |
| **Analytics Engine** | Pre-canned static summaries or external Google Analytics | Native PostgreSQL click event logging with Recharts visualizations |
| **Security** | Session-based cookies or plain-text keys | Stateless JWT authentication, BCrypt hashing, and role-based permissions |
| **QR Code Creation** | Paid third-party APIs or external image proxies | Native local ZXing generation (PNG stream & base64) |
| **Link Governance** | Flat unstructured link list | Color-coded Folders, Multi-Tag Taxonomy, and Marketing Campaign Manager |
| **Password Protection** | None or premium tier feature | Built-in BCrypt password verification with challenge redirect |
| **Privacy Compliance** | Stores unhashed raw IP addresses | SHA-256 salted visitor hashing without raw IP exposure |

---

## 5. Scope of the System
- **User Scope**:
  - Secure registration, login, and profile management.
  - Creation, customization, editing, archiving, and deletion of short links.
  - Organization through folders, tags, and campaigns.
  - Exporting personal link performance logs to CSV.
  - Generating and downloading QR codes.
- **Admin Scope**:
  - Platform-wide dashboard with global link, user, and click metrics.
  - User status governance (activating / suspending accounts).
  - Monitoring suspicious high-velocity or malicious links.
  - Administrative deletion of abusive URLs.

---

## 6. Academic Significance
This mini-project demonstrates the practical integration of core computer science principles:
- **Algorithms**: Base62 conversion, collision handling, and cryptographic hashing (SHA-256, BCrypt).
- **Database Management Systems**: Normalized relational tables, foreign key constraints, Many-to-Many join tables, and B-tree indexing on lookup columns (`shortCode`, `userId`, `clickedAt`).
- **Software Engineering**: Modular 3-tier architecture, DTO design pattern, centralized REST exception handling, and unit test suites with JUnit 5 and Mockito.
