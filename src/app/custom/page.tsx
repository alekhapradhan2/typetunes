import type { Metadata } from 'next';
import CustomStudioClient from '@/components/custom/CustomStudioClient';

export const metadata: Metadata = {
  title: 'Custom Typing Practice – Code & Weak Keys',
  description:
    'Create personalized typing exercises and coding drills. Practice programming syntax, paste custom text, isolate weak finger keys, and train muscle memory.',
  keywords: [
    'create custom typing practice',
    'custom typing test',
    'personalized typing exercises',
    'programming typing test',
    'coding typing practice',
    'weak key practice',
    'touch typing drills',
    'Typetune custom typing',
  ],
  alternates: {
    canonical: 'https://typetune.ollypedia.in/custom',
  },
  openGraph: {
    title: 'Custom Typing Practice – Code & Weak Keys',
    description:
      'Create personalized typing exercises and custom typing drills. Practice coding syntax, paste custom text, isolate weak finger keys, and train muscle memory.',
    url: 'https://typetune.ollypedia.in/custom',
    siteName: 'Typetune',
    type: 'website',
    images: [
      {
        url: 'https://typetune.ollypedia.in/og-default.png',
        width: 1200,
        height: 630,
        alt: 'Create Custom Typing Practice – Typetune',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Custom Typing Practice – Code & Weak Keys',
    description:
      'Level up your developer typing speed. Practice real code, weak-finger drills, and custom text on Typetune.',
    images: ['https://typetune.ollypedia.in/og-default.png'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Typetune Custom Typing Studio',
  url: 'https://typetune.ollypedia.in/custom',
  description:
    'Create personalized typing exercises, practice coding syntax in JavaScript, Python, and SQL, and generate targeted weak-key drills.',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export default function CustomPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-hero pb-20 pt-8 px-4 sm:px-6">
        <CustomStudioClient />
      </main>
    </>
  );
}
