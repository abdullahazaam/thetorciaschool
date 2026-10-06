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
  applicationName: 'Torcia School',
  title: 'The Torcia School | Growing Future Leaders in Karachi',
  description: 'Admissions open from Playgroup to Class V. The Torcia School in Nazimabad offers quality education in a disciplined, values-based environment.',
  keywords: ['The Torcia School', 'Best school in Nazimabad', 'Primary school Karachi', 'Montessori admissions', 'Top school near Abbasi Shaheed Hospital'],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Torcia School',
  },
  openGraph: {
    title: 'The Torcia School | Admissions Open',
    description: 'Nurturing curiosity, strong moral values, and academic excellence. Book a campus tour today.',
    url: 'https://www.thetorciaschool.edu.pk',
    siteName: 'The Torcia School',
    locale: 'en_PK',
    type: 'website',
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
      <body
        className={`${inter.className} min-h-screen text-gray-900 bg-[linear-gradient(rgba(255,255,255,0.85),rgba(255,255,255,0.85)),url('/images/mbl-background.png')] bg-cover bg-fixed bg-center bg-no-repeat md:bg-none md:bg-white`}
      >
        {/* Local School JSON-LD Schema for Google Search & Knowledge Panel */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schoolJsonLd) }}
        />
        <div className="hidden md:block fixed inset-0 -z-20 bg-[url('/images/background.png')] bg-no-repeat bg-[length:100%_auto] bg-top md:bg-cover md:bg-center"></div>
        <div className="hidden md:block fixed inset-0 -z-15 bg-white/85"></div>
        <div className="relative z-10">
          <AppLayoutWrapper>{children}</AppLayoutWrapper>
          <InstallPWA />
          <AIChatWidget />
        </div>
      </body>
    </html>
  );
}
