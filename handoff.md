# Project Handoff: Email.Pro

## 🚀 Project Overview
**Email.Pro** is a high-fidelity, code-first design environment for building React-powered email templates. It features real-time rendering, contact management, and campaign analytics integration.

## 🛠 Tech Stack
- **Frontend Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 4
- **Animations**: `motion/react`
- **Icons**: `lucide-react`
- **Email Engine**: `@react-email/components`, `@react-email/render`
- **Code Editor**: `@monaco-editor/react`
- **State Management/HTTP**: Axios for API interaction
- **Backend (External)**: Spring Boot (REST API)

## ✨ Key Features
- **Code-First Email Editor**: Write React code and see live previews of email templates.
- **Contact Management**:
  - Bulk upload and export (CSV).
  - Grouping and segmentation.
  - Multi-select selection logic.
- **Analytics Dashboard**: View stats like Open Rate, CTR, and delivery metrics.
- **Campaign Scheduling**: Send or schedule emails to selected contacts.
- **Template Library**: CRUD operations for saving and reusing email designs.

## 🔌 API Integration
The application interacts with a Spring Boot backend via `/api/v1` endpoints. 
Key controllers include:
- `UserController`: Auth and user profile.
- `ContactController`: CRUD, search, bulk selection, CSV upload/export.
- `EmailTemplateController`: Store and retrieve template code.
- `EmailController`: Send/Schedule broadcasting.
- `AnalyticsController`: Track events (open, click) and retrieve stats.

### Configuration
- Base URL is derived from environment or defaults to `http://localhost:5000` (as per OpenAPI spec).
- Axios is configured to handle authentication tokens (typically stored in `localStorage` or session).

## 📂 Project Structure
- `/app`: Main application routes (Dashboard, Editor, Contacts).
- `/components`: Reusable UI components (Shared layout, sidebar, data tables).
- `/hooks`: Custom React hooks for data fetching and state.
- `/lib`: Utility functions and Axios instance configuration.
- `/context`: React Context providers for Auth and App-wide state.

## 📝 Recent Improvements & Stability
- **Fixed ResizeObserver Loop**: Resolved the "ResizeObserver loop completed with undelivered notifications" error in the Monaco editor by wrapping layout calls in `requestAnimationFrame` and properly managing the observer lifecycle via `useRef` and `useEffect`.
- **UI Interaction Polish**: Refined the editor interface by removing redundant floating navigation elements in favor of the structured sidebar.
- **API Typed Integration**: Ensured all frontend services align with the provided Spring Boot OpenAPI specification.

## 📝 Next Steps / TODOs
- [ ] Implement robust error handling for API failures.
- [ ] Optimize the Monaco Editor's IntelliSense for `@react-email` components.
- [ ] Add unit/integration tests for critical user flows.
- [ ] Enhance accessibility for the template preview frame.
- [ ] Implement OAuth flows (Google, GitHub) as defined in the plan.

## 🏗 Setup & Deployment
1. **Local Dev**: `npm install` followed by `npm run dev`.
2. **Environment**: Ensure `.env` has `NEXT_PUBLIC_API_URL` pointing to the Spring Boot backend.
3. **Build**: `npm run build` for production-ready static assets.

---
*Created on 2026-05-15*
