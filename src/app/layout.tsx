import "@styles/tailwind.scss";
import "@styles/main.scss";
import { BackToTop } from "@components/modules/BackToTop";
import Script from "next/script";
import { SkipToMain } from "@components/modules/SkipToMain";
import { Header } from "@components/global/Header";
import { Footer } from "@components/global/Footer";
import { Alert } from "@components/modules/Alert";
import { Public_Sans } from "next/font/google";
import { cookies } from "next/headers";
import {
  FOOTER_NAV_1_DATA as footerNav1,
  FOOTER_NAV_2_DATA as footerNav2,
} from "@data/global/navigation/footer";
import { MAIN_NAV_DATA as mainNav } from "@data/global/navigation/main";
import { GLOBAL_NAV_DATA as globalNav } from "@data/global/navigation/global";
import { SupportedLanguages } from "@utils/types/types";
import { Metadata } from "next";
import { LangSelector } from "@components/global/LangSelector";
import { seoConfig, generateStructuredData, performanceOptimizations } from "@utils/seo";

const publicSans = Public_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.REACT_APP_SITE_URL as string),
  title: {
    default: seoConfig.defaultTitle,
    template: '%s | My Career NJ'
  },
  description: seoConfig.defaultDescription,
  keywords: seoConfig.defaultKeywords,
  authors: [{ name: 'New Jersey Department of Labor' }],
  creator: 'New Jersey Department of Labor',
  publisher: 'New Jersey Department of Labor',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: seoConfig.siteUrl,
    siteName: seoConfig.siteName,
    title: seoConfig.defaultTitle,
    description: seoConfig.defaultDescription,
    images: [{
      url: `${seoConfig.siteUrl}/stateSeal.png`,
      width: 1200,
      height: 630,
      alt: 'My Career NJ - New Jersey Department of Labor'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: seoConfig.defaultTitle,
    description: seoConfig.defaultDescription,
    site: '@NewJerseyDOL',
    creator: '@NewJerseyDOL',
    images: [`${seoConfig.siteUrl}/stateSeal.png`]
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/stateSeal.png'
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: seoConfig.siteUrl,
    languages: {
      'en-US': seoConfig.siteUrl,
      'es-US': `${seoConfig.siteUrl}?lang=es`
    }
  },
  category: 'government',
  classification: 'Career Resources, Job Training, Government Services',
  other: {
    'google-site-verification': process.env.GOOGLE_SITE_VERIFICATION || '',
    'msvalidate.01': process.env.BING_SITE_VERIFICATION || '',
    'DC.Title': seoConfig.defaultTitle,
    'DC.Description': seoConfig.defaultDescription,
    'DC.Publisher': seoConfig.organizationName,
    'DC.Language': 'en',
    'geo.region': 'US-NJ',
    'geo.placename': 'New Jersey'
  }
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value as SupportedLanguages) || "en";

  return (
    <html lang={lang || "en"}>
      <head>
        {/* Performance Optimization Hints */}
        {performanceOptimizations.preconnect.map((url) => (
          <link key={url} rel="preconnect" href={url} crossOrigin="anonymous" />
        ))}
        {performanceOptimizations.dnsPrefetch.map((url) => (
          <link key={url} rel="dns-prefetch" href={url} />
        ))}
        {performanceOptimizations.preload.map((url) => (
          <link key={url} rel="preload" href={url} as="image" />
        ))}
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: generateStructuredData({
              type: 'WebSite',
              data: {}
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: generateStructuredData({
              type: 'GovernmentOrganization',
              data: {}
            })
          }}
        />
      </head>
      <body className={publicSans.className}>
        <Script src="https://newjersey.github.io/njwds/dist/js/uswds.min.js" />
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            window.allowedHosts = ['mycareer.nj.gov', 'test.mycareer.nj.gov', 'dev.mycareer.nj.gov'];
            window.hostname = document.location.hostname;

            if (window.allowedHosts.includes(window.hostname)) {
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-KBN58VK9');
            }
          `}
        </Script>
        <main>
          {process.env.REACT_APP_FEATURE_MAINTENANCE === "true" && (
            <Alert
              copy="We will perform routine maintenance Tuesday, March 12, 2024 from 12 am to 6 am EST. My Career NJ and its applications (Training Explorer and Career Navigator)
        will be temporarily inaccessible during this period. We apologize for any inconvenience."
              heading="Scheduled Maintenance"
              type="warning"
              alertId="maintenance"
              dismissible
            />
          )}
          {process.env.REACT_APP_FEATURE_BETA === "true" && (
            <Alert
              copy={process.env.REACT_APP_FEATURE_BETA_MESSAGE as string}
              type="info"
              className="beta-alert"
            />
          )}
          <SkipToMain />
          <Header globalNav={globalNav} mainNav={mainNav} lang={lang} />
          {process.env.REACT_APP_FEATURE_MULTILANG === "true" && (
            <LangSelector />
          )}
          <div id="main-content">{children}</div>
          <Footer
            lang={lang}
            items={{
              footerNav1,
              footerNav2,
            }}
          />
        </main>
        <BackToTop />
      </body>
    </html>
  );
}
