# Club Freedom Testimonial Platform

A modern testimonial collection platform built for Club Freedom, allowing users to gather text, audio, or video stories with AI-powered assistance.

## Tech Stack

- **Frontend Framework**: [React 19](https://react.dev/) with [Vite](https://vite.dev/)
- **Routing**: [TanStack Router](https://tanstack.com/router)
- **Backend**: [Convex](https://www.convex.dev/) for real-time data and backend logic
- **Storage**: [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/) for media assets
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) with [Tailwind CSS](https://tailwindcss.com/)
- **AI**: Google Gemini for summarization and Groq AI transcription
- **Deployment**: Cloudflare Workers and Convex Cloud

## Features

- 📝 Collect text testimonials
- 🎤 Record audio directly in the browser
- 🎥 Capture video on mobile and desktop
- 🔍 Full-text testimonial search
- 📱 Responsive, mobile-first design
- 🤖 AI-generated summaries with Google Gemini

## Documentation

- [Getting Started](docs/getting-started.md)
- [Configuration](docs/configuration.md)
- [Tooling and Workflows](docs/tooling.md)
- [Migration Instructions](docs/migration-instructions.md)

## Directory Layout

```
├── app/                      # TanStack Router application
│   ├── globals.css          # Global Tailwind styles
│   ├── functions/           # Server functions
│   ├── router.tsx           # Router configuration
│   ├── routeTree.gen.ts     # Generated route tree
│   └── routes/              # Route components
│       ├── __root.tsx       # Root layout and loaders
│       ├── index.tsx        # Home page (testimonial form)
│       ├── _auth/           # Auth flows (sign-in, reset)
│       ├── admin/           # Admin dashboard
│       └── testimonials/    # Testimonial detail pages and routes
├── components/               # Shared React components
│   ├── auth/                # Auth-specific forms and layouts
│   ├── emails/              # Resend email templates
│   ├── forms/               # Reusable form components
│   ├── layouts/             # Page layouts
│   ├── recorder/            # Audio and video recorder UI
│   └── ui/                  # shadcn/ui primitives
├── convex/                  # Convex backend and schemas
│   ├── betterAuth/          # Better Auth integration
│   ├── internal/            # Internal helper scripts
│   ├── schema.ts            # Database schema
│   └── testimonials.ts      # Testimonial queries/mutations
├── lib/                     # Client and server helpers
│   ├── ai/                  # Gemini summarization/transcription helpers
│   ├── auth/                # Auth utilities
│   └── utils.ts             # Shared utility helpers
├── utils/                   # Standalone utility modules
├── certificates/            # Local HTTPS certificates (mkcert)
├── hooks/                   # Custom React hooks
└── public/                  # Public assets served by Vite
```
