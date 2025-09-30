/**
 * SEO Utilities for My Career NJ
 * Provides comprehensive SEO helpers and structured data generation
 */

interface StructuredDataProps {
  type: 'WebSite' | 'Organization' | 'GovernmentOrganization' | 'Course' | 'JobPosting' | 'Occupation' | 'LocalBusiness' | 'BreadcrumbList';
  data: any;
}

interface SEOConfig {
  siteName: string;
  siteUrl: string;
  defaultTitle: string;
  defaultDescription: string;
  defaultKeywords: string[];
  twitterHandle?: string;
  facebookAppId?: string;
  organizationName: string;
  organizationLogo: string;
  contactEmail: string;
  phoneNumber?: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
}

export const seoConfig: SEOConfig = {
  siteName: process.env.REACT_APP_SITE_NAME || 'My Career NJ',
  siteUrl: process.env.REACT_APP_SITE_URL || 'https://mycareer.nj.gov',
  defaultTitle: 'My Career NJ - New Jersey Career Resources & Job Training',
  defaultDescription: 'Explore job training, career resources, and employment opportunities with the New Jersey Department of Labor. Find training programs, career pathways, and in-demand occupations.',
  defaultKeywords: [
    'New Jersey jobs',
    'NJ career training',
    'job training programs',
    'career resources',
    'New Jersey Department of Labor',
    'training explorer',
    'career navigator',
    'in-demand occupations',
    'professional development',
    'career pathways',
    'apprenticeship programs',
    'tuition assistance',
    'workforce development'
  ],
  twitterHandle: '@NewJerseyDOL',
  organizationName: 'New Jersey Department of Labor and Workforce Development',
  organizationLogo: `${process.env.REACT_APP_SITE_URL}/stateSeal.png`,
  contactEmail: 'mycareernj@dol.nj.gov',
  phoneNumber: undefined, // No phone number available
  address: {
    streetAddress: '1 John Fitch Plaza',
    addressLocality: 'Trenton',
    addressRegion: 'NJ',
    postalCode: '08625',
    addressCountry: 'US'
  }
};

/**
 * Generate structured data for better SEO
 */
export function generateStructuredData({ type, data }: StructuredDataProps): string {
  const baseStructure = {
    '@context': 'https://schema.org',
    '@type': type,
  };

  let structuredData;

  switch (type) {
    case 'WebSite':
      structuredData = {
        ...baseStructure,
        name: seoConfig.siteName,
        description: seoConfig.defaultDescription,
        url: seoConfig.siteUrl,
        publisher: {
          '@type': 'GovernmentOrganization',
          name: seoConfig.organizationName,
          logo: {
            '@type': 'ImageObject',
            url: seoConfig.organizationLogo
          }
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${seoConfig.siteUrl}/training/search?q={search_term_string}`
          },
          'query-input': 'required name=search_term_string'
        },
        sameAs: [
          'https://www.nj.gov/labor/',
          'https://twitter.com/NewJerseyDOL',
          'https://www.facebook.com/NewJerseyDepartmentofLaborandWorkforceDevelopment'
        ]
      };
      break;

    case 'GovernmentOrganization':
      structuredData = {
        ...baseStructure,
        name: seoConfig.organizationName,
        description: 'The New Jersey Department of Labor provides career resources, job training, and employment services to residents of New Jersey.',
        url: seoConfig.siteUrl,
        logo: seoConfig.organizationLogo,
        email: seoConfig.contactEmail,
        ...(seoConfig.phoneNumber && { telephone: seoConfig.phoneNumber }),
        address: {
          '@type': 'PostalAddress',
          ...seoConfig.address
        },
        serviceArea: {
          '@type': 'State',
          name: 'New Jersey'
        },
        areaServed: {
          '@type': 'State',
          name: 'New Jersey'
        },
        knowsAbout: [
          'Career Training',
          'Job Search',
          'Workforce Development',
          'Professional Development',
          'Apprenticeships',
          'Career Counseling'
        ]
      };
      break;

    case 'Course':
      structuredData = {
        ...baseStructure,
        name: data.name,
        description: data.description,
        provider: {
          '@type': 'Organization',
          name: data.providerName,
          address: data.providerAddress
        },
        teaches: data.skills || [],
        courseCode: data.id,
        educationalCredentialAwarded: data.credential,
        timeRequired: data.duration,
        courseModeOfDelivery: data.deliveryMode,
        coursePrerequisites: data.prerequisites,
        financialAidEligible: data.financialAidEligible,
        occupationalCredentialAwarded: data.certification,
        audience: {
          '@type': 'EducationalAudience',
          audienceType: 'Adult learners seeking career advancement'
        }
      };
      break;

    case 'JobPosting':
      structuredData = {
        ...baseStructure,
        title: data.title,
        description: data.description,
        datePosted: data.datePosted,
        validThrough: data.validThrough,
        employmentType: data.employmentType,
        hiringOrganization: {
          '@type': 'Organization',
          name: data.employer,
          sameAs: data.employerWebsite
        },
        jobLocation: {
          '@type': 'Place',
          address: {
            '@type': 'PostalAddress',
            addressLocality: data.city,
            addressRegion: data.state,
            addressCountry: 'US'
          }
        },
        baseSalary: data.salary ? {
          '@type': 'MonetaryAmount',
          currency: 'USD',
          value: data.salary
        } : undefined,
        qualifications: data.qualifications,
        skills: data.skills,
        educationRequirements: data.education,
        experienceRequirements: data.experience
      };
      break;

    case 'Occupation':
      structuredData = {
        ...baseStructure,
        name: data.title,
        description: data.description,
        occupationLocation: [
          {
            '@type': 'State',
            name: 'New Jersey'
          }
        ],
        skills: data.skills || [],
        qualifications: data.qualifications || [],
        responsibilities: data.responsibilities || [],
        estimatedSalary: data.salary ? [
          {
            '@type': 'MonetaryAmountDistribution',
            currency: 'USD',
            duration: 'P1Y',
            median: data.salary.median,
            percentile10: data.salary.percentile10,
            percentile25: data.salary.percentile25,
            percentile75: data.salary.percentile75,
            percentile90: data.salary.percentile90
          }
        ] : undefined,
        occupationalCategory: data.category,
        mainEntityOfPage: `${seoConfig.siteUrl}/occupation/${data.code}`
      };
      break;

    case 'BreadcrumbList':
      structuredData = {
        ...baseStructure,
        itemListElement: data.items.map((item: any, index: number) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: `${seoConfig.siteUrl}${item.url}`
        }))
      };
      break;

    default:
      structuredData = { ...baseStructure, ...data };
  }

  return JSON.stringify(structuredData, null, 2);
}

/**
 * Generate comprehensive meta tags
 */
export interface MetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: string;
  canonicalUrl?: string;
  noindex?: boolean;
  structuredData?: StructuredDataProps[];
}

export function generateMetaTags({
  title,
  description,
  keywords,
  ogImage,
  ogType = 'website',
  canonicalUrl,
  noindex = false,
  structuredData = []
}: MetaTagsProps) {
  const fullTitle = title ? `${title} | ${seoConfig.siteName}` : seoConfig.defaultTitle;
  const metaDescription = description || seoConfig.defaultDescription;
  const metaKeywords = keywords ? [...keywords, ...seoConfig.defaultKeywords] : seoConfig.defaultKeywords;
  const image = ogImage || `${seoConfig.siteUrl}/stateSeal.png`;
  const canonical = canonicalUrl || seoConfig.siteUrl;

  return {
    title: fullTitle,
    description: metaDescription,
    keywords: metaKeywords.join(', '),
    robots: noindex ? 'noindex, nofollow' : 'index, follow',
    canonical: canonical,
    openGraph: {
      title: fullTitle,
      description: metaDescription,
      url: canonical,
      siteName: seoConfig.siteName,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: fullTitle
        }
      ],
      locale: 'en_US',
      type: ogType
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: metaDescription,
      images: [image],
      site: seoConfig.twitterHandle,
      creator: seoConfig.twitterHandle
    },
    alternates: {
      canonical: canonical,
      languages: {
        'en-US': canonical,
        'es-US': `${canonical}?lang=es`
      }
    },
    other: {
      'DC.Title': fullTitle,
      'DC.Description': metaDescription,
      'DC.Subject': metaKeywords.slice(0, 5).join(', '),
      'DC.Language': 'en',
      'DC.Format': 'text/html',
      'DC.Publisher': seoConfig.organizationName,
      'DC.Rights': 'Copyright New Jersey Department of Labor',
      'geo.region': 'US-NJ',
      'geo.placename': 'New Jersey',
      'ICBM': '40.2206, -74.7563' // New Jersey coordinates
    },
    structuredData: structuredData.map(sd => generateStructuredData(sd))
  };
}

/**
 * Enhanced metadata for specific page types
 */
export function generatePageMetadata(pageType: string, data: any) {
  switch (pageType) {
    case 'training':
      return generateMetaTags({
        title: `${data.name} - Training Program`,
        description: `${data.description} Learn more about this training program in ${data.city}, NJ.`,
        keywords: ['training program', 'professional development', 'certification', data.name, data.city],
        structuredData: [
          {
            type: 'Course',
            data: data
          }
        ]
      });

    case 'occupation':
      return generateMetaTags({
        title: `${data.title} - Career Information`,
        description: `Learn about ${data.title} careers in New Jersey. Salary information, job outlook, and training programs.`,
        keywords: ['career', 'occupation', 'salary', 'job outlook', data.title],
        structuredData: [
          {
            type: 'Occupation',
            data: data
          }
        ]
      });

    case 'search':
      return generateMetaTags({
        title: data.query ? `Training Search Results for "${data.query}"` : 'Training Program Search',
        description: data.query 
          ? `Find training programs for "${data.query}" in New Jersey. Browse certified programs and providers.`
          : 'Search training programs, certifications, and professional development opportunities in New Jersey.',
        keywords: ['training search', 'program finder', 'certification search', data.query].filter(Boolean)
      });

    default:
      return generateMetaTags({});
  }
}

/**
 * Performance and Core Web Vitals optimization hints
 */
export const performanceOptimizations = {
  // Critical resource hints
  preconnect: [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://images.ctfassets.net',
    'https://www.googletagmanager.com'
  ],
  
  // DNS prefetch for external domains
  dnsPrefetch: [
    'https://newjersey.github.io',
    'https://www.nj.gov'
  ],

  // Preload critical assets
  preload: [
    '/favicon.ico',
    '/stateSeal.png'
  ]
};