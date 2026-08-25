import type { Metadata } from 'next';
import NewspaperStudio from '@/components/newspaper/NewspaperStudio';

export const metadata: Metadata = {
  title: 'Newspaper Studio – Student Newspaper Creator',
  description:
    'Design vintage newspapers with Newspaper Studio. Add headlines, write articles, format columns, apply halftone photo filters, and export PDF newspapers.',
  keywords: [
    'newspaper studio',
    'create newspaper online',
    'student newspaper maker',
    'school newspaper generator',
    'vintage newspaper maker',
    'classroom newspaper project',
    'newspaper template for students',
    'newspaper layout builder',
    'print newspaper pdf generator',
    'Typetune newspaper studio',
  ],
  alternates: {
    canonical: 'https://typetune.ollypedia.in/newspaper',
  },
  openGraph: {
    title: 'Newspaper Studio – Student Newspaper Creator',
    description:
      'Create authentic vintage broadsheets, school gazettes, and class newspapers with custom headlines, stories, halftone photo filters, and PDF export.',
    url: 'https://typetune.ollypedia.in/newspaper',
    siteName: 'Typetune',
    type: 'website',
    images: [
      {
        url: 'https://typetune.ollypedia.in/og-default.png',
        width: 1200,
        height: 630,
        alt: 'Newspaper Studio for Students – Typetune',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Newspaper Studio – Student Newspaper Creator',
    description:
      'Design authentic vintage broadsheets, school newspapers, and tabloids with drag-and-drop ease on Typetune.',
    images: ['https://typetune.ollypedia.in/og-default.png'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Typetune Newspaper Studio',
  url: 'https://typetune.ollypedia.in/newspaper',
  description:
    'Interactive online newspaper creator for students and educators. Build custom front pages, school gazettes, and vintage broadsheets with columns, headlines, images, and high-resolution PDF download.',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export default function NewspaperPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-[calc(100vh-3.5rem)] bg-hero py-1 sm:py-3">
        <NewspaperStudio />
      </main>
    </>
  );
}
