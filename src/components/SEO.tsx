import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  ogImage?: string;
  canonical?: string;
  type?: 'website' | 'article';
}

const DEFAULT_TITLE = 'Dalisara | The Slower Measure — San Vicente, Palawan';
const DEFAULT_DESCRIPTION = 'An upper-luxury coastal resort concept in San Vicente, Palawan. Space to settle into the coast. Fictional portfolio project.';
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=1600';
const SITE_URL = 'https://dalisara.ph';

export const SEO: React.FC<SEOProps> = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  ogImage = DEFAULT_IMAGE,
  canonical,
  type = 'website',
}) => {
  const fullTitle = title.includes('Dalisara') ? title : `${title} | Dalisara`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      {canonical && <meta property="og:url" content={`${SITE_URL}${canonical}`} />}
      <meta property="og:site_name" content="Dalisara Palawan (Fictional Concept)" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Fictional Portfolio Project Disclosure */}
      <meta name="disclaimer" content="Fictional portfolio concept demonstration. No commercial transactions or actual bookings." />

      {/* Canonical */}
      {canonical && <link rel="canonical" href={`${SITE_URL}${canonical}`} />}
    </Helmet>
  );
};
