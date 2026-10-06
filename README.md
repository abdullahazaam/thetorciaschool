# The Torcia School - Official Web Portal & Admin Dashboard

> **"Growing Future Leaders"**

The Torcia School is a values-driven educational institution offering comprehensive education from **Playgroup to Class V** in Nazimabad, Karachi.

---

## 🏛️ School Details
- **School Name**: The Torcia School
- **Tagline**: Growing Future Leaders
- **Classes**: Playgroup to Class V
- **Mission**: To provide quality education in a disciplined, values-based environment that nurtures knowledge, character, and social responsibilities.
- **Vision**: To build an educated and morally strong youth for the betterment of society and the revival of Islam.
- **Address**: Plot # 20/13 block 5C near Abbasi Shaheed Hospital, Nazimabad Karachi
- **Phone**: 0342-2049976
- **Email**: thetorciaschool@gmail.com
- **School Timings**:
  - Monday – Saturday: 7:45 am to 2:00 pm
  - Friday: 7:45 am to 1:00 pm

---

## 🔒 Security & Admin Authentication
- **Admin Login Route**: `/admin/login`
- **Protection**: Root Next.js [`middleware.js`](middleware.js) intercepts all `/admin/*` routes.
- **Session**: Managed via secure, HTTP-only `torcia_admin_session` cookie verified using Web Crypto SHA-256 tokens.
- **Secret Key**: `ADMIN_SECRET` in `.env.local`.

---

## 🛠️ Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Database**: MongoDB Atlas via Mongoose with cached connection handling
- **Media Storage**: Cloudinary SDK (Direct upload integration)
- **Security**: Next.js Edge Middleware with HTTP-only cookie sessions

---

## 📁 Project Structure
```text
the-torcia-school/
├── app/
│   ├── layout.js                 # Global Root Layout
│   ├── globals.css               # Tailwind directives & base styles
│   ├── page.js                   # Cinematic Home Page (Hero, 7 Values, Gallery)
│   ├── about/page.js             # Mission, Vision, Campus Building & Gallery
│   ├── academics/page.js         # Playgroup to Class V Grid & Faculty Standards
│   ├── admissions/page.js        # Admission Info & Interactive Inquiry Form
│   ├── contact/page.js           # Campus Details, Timings & Contact Form
│   ├── news/page.js              # Dynamic News & Events from MongoDB
│   ├── admin/
│   │   ├── layout.js             # Admin Layout
│   │   ├── AdminLayoutClient.js  # Dedicated dark dashboard layout with topbar & logout
│   │   ├── page.js               # Admin Metrics & Overview
│   │   ├── login/page.js         # Admin Authentication Portal (Protected by Suspense)
│   │   └── news/page.js          # News & Events CRUD with Cloudinary Uploads
│   └── api/
│       ├── admin/
│       │   ├── login/route.js    # Sets HTTP-only auth cookie with ADMIN_SECRET
│       │   └── logout/route.js   # Clears session cookie
│       ├── news/route.js         # MongoDB News & Events API
│       ├── upload/route.js       # Cloudinary Media Upload API
│       └── inquiries/route.js    # Admissions & Contact Inquiries API
├── components/
│   ├── AppLayoutWrapper.js       # Cleanly separates public site from admin dashboard
│   ├── Navbar.js                 # Responsive Top Bar & Navigation with school emblem
│   ├── Footer.js                 # School Footer with Hours, Vision & Contact
│   ├── AdminSidebar.js           # Admin Dashboard Navigation Sidebar
│   └── GalleryGrid.js            # Responsive Campus Photo Gallery
├── lib/
│   ├── auth.js                   # Web Crypto SHA-256 session token hashing & verification
│   ├── schoolImages.js           # Semantic image registry mapping public/images
│   ├── mongodb.js                # Cached Mongoose Connection for Serverless
│   └── cloudinary.js             # Cloudinary Media Configuration
├── models/
│   ├── News.js                   # Mongoose Schema for News/Events
│   └── Inquiry.js                # Mongoose Schema for Inquiries
├── middleware.js                 # Root Next.js Edge Middleware protecting /admin
├── .env.local                    # Local Environment Variables
├── .env.local.example            # Environment Variables Template
├── tailwind.config.js            # Tailored Torcia School Navy/Gold/Emerald theme
└── package.json
```

---

## 🚀 Running the App
```bash
npm run dev
```

- Public School Portal: [http://localhost:3000](http://localhost:3000)
- Protected Admin Portal: [http://localhost:3000/admin](http://localhost:3000/admin) *(Automatically redirects to `/admin/login` if unauthenticated)*
