import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string | string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'event' | 'organization';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

const SEO: React.FC<SEOProps> = ({
  title = 'شبابنا العالمية - منصة شبابية عالمية للتنمية والتطوير',
  description = 'منظمة شبابنا العالمية - منصة شبابية عالمية للتنمية والتطوير. تمكين الشباب لبناء مستقبل أفضل من خلال برامج مبتكرة ومشاركة مجتمعية. انضم إلينا في خلق تغيير إيجابي.',
  keywords = [
    'منظمة شبابنا العالمية',
    'شبابنا العالمية',
    'منظمة شبابنا',
    'شبابنا',
    'تمكين الشباب',
    'التنمية المجتمعية',
    'الشباب العالمي',
    'تطوير القيادة',
    'التأثير الاجتماعي',
    'فرص التطوع',
    'برامج الشباب',
    'المجتمع الدولي',
    'تنمية',
    'تطوير',
    'شباب',
    'مجتمع',
    'منظمة غير ربحية',
    'منظمات شبابية',
    'منظمات المجتمع المدني',
  ],
  image = '/og-image.jpg',
  url = typeof window !== 'undefined' ? window.location.href : '',
  type = 'website',
  author = 'شبابنا العالمية',
  publishedTime,
  modifiedTime,
  section,
  tags = [],
  canonical,
  noindex = false,
  nofollow = false,
}) => {
  const siteName = 'شبابنا العالمية';
  const fullTitle = title === siteName ? title : `${title} | ${siteName}`;
  const fullUrl = canonical || url;

  // معالجة keywords - التأكد من أنه مصفوفة
  const processedKeywords = Array.isArray(keywords)
    ? keywords.join(', ')
    : typeof keywords === 'string'
    ? keywords
    : keywords?.join(', ') || '';

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={processedKeywords} />
      <meta name="author" content={author} />
      <meta
        name="robots"
        content={noindex ? 'noindex' : nofollow ? 'nofollow' : 'index, follow'}
      />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#27548A" />
      <meta name="msapplication-TileColor" content="#27548A" />

      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="ar_SA" />
      <meta property="og:locale:alternate" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@shababnaglobal" />
      <meta name="twitter:creator" content="@shababnaglobal" />

      {/* Additional Meta Tags */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={siteName} />

      {/* Article specific meta tags */}
      {type === 'article' && (
        <>
          {publishedTime && (
            <meta property="article:published_time" content={publishedTime} />
          )}
          {modifiedTime && (
            <meta property="article:modified_time" content={modifiedTime} />
          )}
          {section && <meta property="article:section" content={section} />}
          {tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Event specific meta tags */}
      {type === 'event' && (
        <>
          <meta property="event:start_time" content={publishedTime} />
          <meta property="event:end_time" content={modifiedTime} />
        </>
      )}

      {/* Organization specific meta tags */}
      {type === 'organization' && (
        <>
          <meta property="organization:name" content={siteName} />
          <meta
            property="organization:url"
            content="https://shababnaglobal.org"
          />
        </>
      )}

      {/* Favicon */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />

      {/* Manifest */}
      <link rel="manifest" href="/site.webmanifest" />

      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />

      {/* DNS Prefetch for performance */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />

      {/* Additional SEO Meta Tags */}
      <meta name="application-name" content={siteName} />
      <meta name="msapplication-TileColor" content="#27548A" />
      <meta name="msapplication-config" content="/browserconfig.xml" />

      {/* Language and Region */}
      <meta name="language" content="Arabic" />
      <meta name="geo.region" content="SA" />
      <meta name="geo.placename" content="Riyadh" />
      <meta name="geo.position" content="24.7136;46.6753" />
      <meta name="ICBM" content="24.7136, 46.6753" />

      {/* Social Media Verification */}
      <meta name="twitter:site" content="@shababnaglobal" />
      <meta name="twitter:creator" content="@shababnaglobal" />

      {/* Structured Data for Organization */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'NonProfit',
          name: 'منظمة شبابنا العالمية',
          alternateName: 'Shababna Global Organization',
          description:
            'منصة شبابية عالمية للتنمية والتطوير. تمكين الشباب لبناء مستقبل أفضل من خلال برامج مبتكرة ومشاركة مجتمعية.',
          url: 'https://shababnaglobal.org',
          logo: 'https://shababnaglobal.org/images/logo.jpg',
          image: 'https://shababnaglobal.org/images/hero-bg.jpg',
          foundingDate: '2020',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'الرياض',
            addressCountry: 'SA',
            addressRegion: 'الرياض',
          },
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+966501234567',
            email: 'info@shababnaglobal.org',
            contactType: 'customer service',
            availableLanguage: ['Arabic', 'English'],
          },
          sameAs: [
            'https://facebook.com/shababnaglobal',
            'https://twitter.com/shababnaglobal',
            'https://instagram.com/shababnaglobal',
            'https://linkedin.com/company/shababnaglobal',
          ],
          areaServed: {
            '@type': 'Country',
            name: 'Saudi Arabia',
          },
          serviceArea: {
            '@type': 'Country',
            name: 'Worldwide',
          },
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'برامج الشباب',
            itemListElement: [
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: 'برامج التطوير القيادي',
                  description: 'برامج لتنمية مهارات القيادة لدى الشباب',
                },
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: 'برامج التطوع',
                  description: 'فرص التطوع في المشاريع المجتمعية',
                },
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: 'برامج التنمية المجتمعية',
                  description: 'مشاريع لتنمية المجتمعات المحلية',
                },
              },
            ],
          },
          keywords:
            'منظمة شبابنا العالمية, شبابنا العالمية, تمكين الشباب, التنمية المجتمعية, الشباب العالمي, تطوير القيادة, التأثير الاجتماعي, فرص التطوع, برامج الشباب, المجتمع الدولي',
        })}
      </script>
    </Helmet>
  );
};

export default SEO;
