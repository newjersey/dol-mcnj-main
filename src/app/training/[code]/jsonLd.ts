import { TrainingProps } from "@utils/types";

export const generateJsonLd = (training: TrainingProps) => {
  const audience = [
    {
      "@type": "Audience",
      audienceType: "Students",
      geographicArea: {
        "@type": "Place",
        name: "New Jersey",
        geo: {
          "@type": "GeoCoordinates",
          latitude: 40.0583, // New Jersey's approximate latitude
          longitude: -74.4057, // New Jersey's approximate longitude
        },
      },
    },
    {
      "@type": "Audience",
      audienceType: "Workers",
      geographicArea: {
        "@type": "Place",
        name: "New Jersey",
        geo: {
          "@type": "GeoCoordinates",
          latitude: 40.0583, // New Jersey's approximate latitude
          longitude: -74.4057, // New Jersey's approximate longitude
        },
      },
    },
  ];

  const courseInstance = {
    "@type": "CourseInstance",
    courseMode: training.online ? "online" : "onsite",
    instructor: {
      "@type": "Person",
      name: training.provider.contactName,
      jobTitle: training.provider.contactTitle,
      telephone: training.provider.phoneNumber,
    },
    courseWorkload: training.totalClockHours
      ? `PT${training.totalClockHours}H`
      : "PT0H",
  };

  const offer = {
    "@type": "Offer",
    url: training.provider.url,
    priceCurrency: "USD",
    price: training.totalCost,
    eligibleRegion: {
      "@type": "Place",
      name: "New Jersey",
    },
    category: "Tuition",
  };

  return {
    "@context": "http://schema.org",
    "@type": "Course",
    name: training.name,
    description: training.description,
    provider: {
      "@type": "Organization",
      name: training.provider.name,
      sameAs: training.provider.url,
    },
    audience: audience,
    identifier: {
      "@type": "PropertyValue",
      name: "Program ID",
      value: training.id,
    },
    hasCourseInstance: courseInstance,
    offers: offer,
  };
};
