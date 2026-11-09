import './globals.css';
import { Inter, Playfair_Display } from 'next/font/google';
import dynamic from 'next/dynamic';
import AppLayoutWrapper from '@/components/AppLayoutWrapper';

const InstallPWA = dynamic(() => import('@/components/InstallPWA'), { ssr: false });
const AIChatWidget = dynamic(() => import('@/components/AIChatWidget'), { ssr: false });

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
});

export const viewport = {
  themeColor: '#991b1b',
  width: 'device-width',
  initialScale: 1,
};

export const metadata = {
  metadataBase: new URL('https://thetorciaschool.edu.pk'),
  applicationName: 'The Torcia School',
  title: {
    default: 'The Torcia School | Nazimabad Karachi - Admissions Open 2026–2027',
    template: '%s | The Torcia School Nazimabad',
  },
  description: 'The Torcia School in Nazimabad, Karachi provides values-based education, sensory Montessori early years development, primary learning (Playgroup to Class V), and a modern STEM & Robotics curriculum.',
  keywords: [
    'The Torcia School',
    'The Torcia School Nazimabad Karachi',
    'Top primary school in Nazimabad',
    'Best Montessori in Karachi',
    'School admissions open 2026 Karachi',
    'STEM and Robotics school Karachi',
    'School near Abbasi Shaheed Hospital Nazimabad',
    'Quality education Karachi',
  ],
  manifest: '/manifest.json',
  alternates: {
    canonical: '/',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'The Torcia School',
  },
  openGraph: {
    title: 'The Torcia School | Nazimabad Karachi - Admissions Open 2026–2027',
    description: 'Empowering Young Minds for a Brighter Tomorrow. Values-based education, sensory Montessori discovery, and a flagship STEM curriculum in Nazimabad, Karachi.',
    url: 'https://thetorciaschool.edu.pk',
    siteName: 'The Torcia School',
    locale: 'en_PK',
    type: 'website',
    images: [
      {
        url: '/images/about/admissions-promo-16x9.jpg',
        width: 1200,
        height: 630,
        alt: 'The Torcia School Campus in Nazimabad Karachi',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Torcia School | Nazimabad Karachi - Admissions Open',
    description: 'Nurturing curiosity, strong moral values, and academic excellence. Admissions open for Playgroup through Class V in Nazimabad, Karachi.',
    images: ['/images/about/admissions-promo-16x9.jpg'],
  },
};

const schoolJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['EducationalOrganization', 'School', 'LocalBusiness'],
      '@id': 'https://thetorciaschool.edu.pk/#organization',
      name: 'The Torcia School',
      alternateName: 'Torcia School Karachi',
      url: 'https://thetorciaschool.edu.pk',
      logo: 'https://thetorciaschool.edu.pk/images/logo.png',
      image: 'https://thetorciaschool.edu.pk/images/about/admissions-promo-16x9.jpg',
      description:
        'The Torcia School offers world-class values-based education, Montessori early development, and primary learning from Playgroup to Class V in Nazimabad, Karachi.',
      telephone: '0342-2049976',
      email: 'thetorciaschool@gmail.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Plot # 20/13 Block 5C, near Abbasi Shaheed Hospital',
        addressLocality: 'Nazimabad',
        addressRegion: 'Sindh',
        postalCode: '74600',
        addressCountry: 'PK',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: '24.9180',
        longitude: '67.0330',
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Saturday'],
          opens: '07:45',
          closes: '14:00',
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: 'Friday',
          opens: '07:45',
          closes: '13:00',
        },
      ],
      priceRange: '$$',
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <meta name="application-name" content="Torcia School" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Torcia School" />
        <meta name="theme-color" content="#991b1b" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.className} min-h-screen text-gray-900 bg-slate-50 antialiased`}>
        {/* Local School JSON-LD Schema for Google Search & Knowledge Panel */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schoolJsonLd) }}
        />
        <div className="relative z-10">
          <AppLayoutWrapper>{children}</AppLayoutWrapper>
          <InstallPWA />
          <AIChatWidget />
        </div>
      </body>
    </html>
  );
}
