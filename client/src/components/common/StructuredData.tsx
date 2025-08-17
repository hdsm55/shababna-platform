import React from 'react';

interface EventStructuredDataProps {
  event: {
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    location: string;
    organizer: string;
    image?: string;
    url: string;
  };
}

export const EventStructuredData: React.FC<EventStructuredDataProps> = ({
  event,
}) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate,
    location: {
      '@type': 'Place',
      name: event.location,
    },
    organizer: {
      '@type': 'Organization',
      name: event.organizer,
    },
    ...(event.image && { image: event.image }),
    url: event.url,
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      price: '0',
      priceCurrency: 'SAR',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};

interface ProgramStructuredDataProps {
  program: {
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    location: string;
    organizer: string;
    image?: string;
    url: string;
  };
}

export const ProgramStructuredData: React.FC<ProgramStructuredDataProps> = ({
  program,
}) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: program.title,
    description: program.description,
    provider: {
      '@type': 'Organization',
      name: program.organizer,
    },
    ...(program.image && { image: program.image }),
    url: program.url,
    courseMode: 'https://schema.org/OnSite',
    educationalLevel: 'Beginner',
    inLanguage: 'ar',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};

interface OrganizationStructuredDataProps {
  organization: {
    name: string;
    description: string;
    url: string;
    logo: string;
    address: string;
    phone: string;
    email: string;
  };
}

export const OrganizationStructuredData: React.FC<
  OrganizationStructuredDataProps
> = ({ organization }) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'NonProfit',
    name: organization.name,
    description: organization.description,
    url: organization.url,
    logo: organization.logo,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Riyadh',
      addressCountry: 'SA',
      addressRegion: 'Riyadh',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: organization.phone,
      email: organization.email,
      contactType: 'customer service',
    },
    sameAs: [
      'https://facebook.com/shababnaglobal',
      'https://twitter.com/shababnaglobal',
      'https://instagram.com/shababnaglobal',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};

interface BreadcrumbStructuredDataProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

export const BreadcrumbStructuredData: React.FC<
  BreadcrumbStructuredDataProps
> = ({ items }) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};

export default {
  EventStructuredData,
  ProgramStructuredData,
  OrganizationStructuredData,
  BreadcrumbStructuredData,
};
