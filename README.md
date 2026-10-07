# The Torcia School

[![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/) [![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/) [![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas) [![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

> **Growing Future Leaders**

A premium, responsive school web portal for **The Torcia School, Nazimabad, Karachi**. The project combines a polished public-facing experience with a protected admin dashboard for managing admissions, inquiries, news, and media.

## ✨ Highlights

- Cinematic, responsive school website experience
- Admissions and contact inquiry forms
- MongoDB-backed content and inquiry management
- Protected admin dashboard with HTTP-only session cookies
- News and events management
- Cloudinary media upload integration
- Transactional email notifications with Nodemailer
- SEO-ready metadata, sitemap, and robots configuration
- PWA support
- Security-focused HTTP response headers and Content Security Policy
- Mobile-first layouts and accessible navigation

## 🧰 Tech Stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 14 (App Router) |
| Frontend | React 18 |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Icons | Lucide React |
| Database | MongoDB Atlas + Mongoose |
| Media | Cloudinary |
| Email | Nodemailer / SMTP |
| PWA | next-pwa |
| Authentication | HTTP-only cookies + Web Crypto SHA-256 |
| Deployment | Compatible with Vercel and other Node.js hosts |

## 📁 Project Structure

```text
app/
├── about/                 # School story, mission and vision
├── academics/             # Academic programs and grade information
├── admissions/            # Admission information and inquiry flow
├── contact/               # Contact information and contact form
├── news/                  # Public news and events
├── admin/                 # Protected administration dashboard
└── api/                   # Server-side API routes
    ├── admin/             # Admin authentication
    ├── admissions/        # Admission submissions
    ├── contact/           # Contact submissions
    ├── inquiries/         # Inquiry management
    ├── news/              # News management
    └── upload/            # Cloudinary uploads

components/                # Reusable UI components
lib/                       # Database, auth, mailer and Cloudinary helpers
models/                    # Mongoose schemas
public/                    # Static assets
middleware.js              # Admin route protection
next.config.js             # Next.js, PWA and security configuration
.env.local.example         # Safe environment-variable template
```

## 🚀 Getting Started

### Quality checks

Before pushing changes, run `npm run lint` and `npm run build`.

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example file:

```bash
cp .env.local.example .env.local
```

Then replace every placeholder with real credentials.

**Never commit `.env.local` or real credentials.** The repository's `.gitignore` already excludes local environment files.

### 3. Start development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Production build

```bash
npm run build
npm start
```

## 🔐 Security Notes

- Real MongoDB, Cloudinary, SMTP, and admin secrets belong only in environment variables.
- Admin authentication fails closed when `ADMIN_SECRET` is missing.
- Admin sessions use an HTTP-only cookie.
- The repository contains an environment template only; it must never contain production credentials.
- Keep deployment secrets configured in the hosting provider's environment settings.
- Do not commit `.env.local`, private keys, exported database files, or credential dumps.

## 🌐 Main Routes

- Public website: `/`
- About: `/about`
- Academics: `/academics`
- Admissions: `/admissions`
- News: `/news`
- Contact: `/contact`
- Admin: `/admin`
- Admin login: `/admin/login`

## 🏫 School Information

**The Torcia School**  
Nazimabad, Karachi, Pakistan  
**Tagline:** Growing Future Leaders  
**Classes:** Playgroup to Class V

## 🔒 Security

- Never commit `.env.local`, credentials, private keys, database dumps, or deployment secrets.
- Production secrets belong in the hosting provider's environment settings.
- Admin routes are protected by middleware and HTTP-only session cookies.
- See [SECURITY.md](SECURITY.md) for the reporting policy.

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development and pull-request guidelines.

## 📄 License

This project is released under the [MIT License](LICENSE).

## 👨‍💻 Project

Built and maintained by **Abdullah Azaam**.

This repository is a portfolio-quality full-stack web project demonstrating modern Next.js development, responsive UI implementation, server-side APIs, database integration, media management, authentication, email workflows, and production-oriented security practices.
