# Aayushi - Full-Stack AI Chat Application

A premium, professional AI assistant built with Next.js, Groq, Exa, and Firebase.

## Features

- **Grok-style UI**: Sleek dark mode, smooth animations (Framer Motion), and glassmorphism.
- **AI-Powered**: Integrated with Groq API using Llama 3.1 8B (OpenAI-compatible).
- **Web Search**: Integrated with Exa API for real-time web results.
- **Markdown & Code**: Full markdown rendering with Prism syntax highlighting.
- **Auth**: Firebase Authentication (Email/Password & Google Sign-in).
- **Persistence**: Chat history stored in LocalStorage.
- **Multi-Model**: Toggle between different Llama and Mixtral models.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend**: Next.js API Routes, Node.js.
- **AI/Search**: Groq SDK, Exa SDK.
- **Auth**: Firebase SDK.

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Create a `.env.local` file based on `.env.example`:
   ```bash
   GROQ_API_KEY=your_groq_api_key
   EXA_API_KEY=your_exa_api_key
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   
   # Firebase Config
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

4. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```

## API Endpoints

- `POST /api/chat`: Main chat endpoint.
- `POST /api/web`: Search endpoint (used internally by `/api/chat`).

## Design Aesthetics

The application uses a deep charcoal and slate palette (`#09090b`, `#18181b`) with a vibrant primary accent (`#4361ee`) to create a modern, high-end visual experience.
