import type { Metadata } from 'next';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy — Data & Cookie Details',
  description:
    'Read the Typetune Privacy Policy. Learn how data and typing test results are handled, Google AdSense and cookie disclosures, and your privacy rights.',
  alternates: { canonical: 'https://typetune.ollypedia.in/privacy-policy' },
  openGraph: {
    title: 'Privacy Policy — Data & Cookie Details',
    description:
      'Read the Typetune Privacy Policy. Learn how data and typing test results are handled, Google AdSense and cookie disclosures, and your privacy rights.',
    url: 'https://typetune.ollypedia.in/privacy-policy',
    siteName: 'Typetune',
    type: 'website',
    images: [
      {
        url: 'https://typetune.ollypedia.in/og-default.png',
        width: 1200,
        height: 630,
        alt: 'Privacy Policy – Typetune',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy — Data & Cookie Details',
    description:
      'Read the Typetune Privacy Policy. Learn how data and typing test results are handled, and your privacy rights.',
    images: ['https://typetune.ollypedia.in/og-default.png'],
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-hero min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-8 lg:px-12 py-12">
        <Breadcrumbs items={[{ label: 'Privacy Policy' }]} />
        <h1
          className="text-4xl font-bold text-slate-800 mb-2"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Privacy Policy
        </h1>
        <p className="text-slate-400 text-sm mb-10">
          Last updated: {new Date().toLocaleDateString('en-US', { dateStyle: 'long' })}
        </p>

        <div className="space-y-10 text-slate-600 leading-relaxed text-sm sm:text-base">
          <section>
            <p>
              Welcome to <strong>Typetune</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;), accessible at{' '}
              <Link href="/" className="text-sage-600 hover:underline">
                https://typetune.ollypedia.in
              </Link>
              . We are deeply committed to protecting your personal privacy, maintaining transparency, and ensuring strict compliance with global privacy regulations, including the General Data Protection Regulation (GDPR), the California Consumer Privacy Act (CCPA/CPRA), the Children&apos;s Online Privacy Protection Act (COPPA), and Google Publisher / AdSense Policies.
            </p>
            <p className="mt-3">
              This Privacy Policy explains how information is collected, used, and safeguarded when you visit our website, take typing speed tests, play educational arcade games, or use our student Newspaper Studio.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              1. Information We Collect
            </h2>
            <p>
              Typetune is engineered to be a privacy-first educational tool. You can practice typing, play games, and create newspapers without ever creating an account or providing your name:
            </p>
            <ul className="list-disc ml-6 mt-3 space-y-2 text-sm">
              <li>
                <strong>Anonymous Typing Test Metrics:</strong> When you complete a test, performance metrics (such as net WPM, raw WPM, accuracy percentage, consistency score, and keystroke timing) are stored in our database with a randomly generated unique identifier. No name, email, or personal identity is linked to these results.
              </li>
              <li>
                <strong>Local Browser Storage (LocalStorage):</strong> Preferences such as sound volume, audio mute state, customized themes, and your recent test history IDs are saved locally in your browser. This data never leaves your device.
              </li>
              <li>
                <strong>Audio Synthesis:</strong> All piano sound generation and acoustic feedback runs 100% locally in your browser using the Web Audio API. Zero audio data is recorded or transmitted.
              </li>
              <li>
                <strong>Direct Communications:</strong> If you contact us via email at{' '}
                <a href="mailto:alekhpradhan33305@gmail.com" className="text-sage-600 hover:underline">
                  alekhpradhan33305@gmail.com
                </a>{' '}
                or through our contact form, we collect your name, email address, and message content solely to respond to your inquiry.
              </li>
              <li>
                <strong>Log Files & Technical Data:</strong> Like standard web servers, our hosting provider automatically logs standard technical requests (including browser type, operating system, referring URL, and timestamp) for cybersecurity, DDoS mitigation, and server performance monitoring.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              2. Google AdSense & Third-Party Advertising Disclosures
            </h2>
            <p>
              Typetune utilizes <strong>Google AdSense</strong> (Publisher ID: <code>ca-pub-5823659147566885</code>) and third-party advertising partners to serve advertisements when you visit our website. These disclosures are provided in compliance with Google Publisher Policies:
            </p>
            <ul className="list-disc ml-6 mt-3 space-y-2 text-sm">
              <li>
                <strong>Third-Party Vendor Cookies:</strong> Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to Typetune or other websites across the internet.
              </li>
              <li>
                <strong>Advertising Cookies (DART Cookie):</strong> Google&apos;s use of advertising cookies enables it and its partners to serve personalized and contextual ads to users based on their visits to our website and/or other sites on the Internet.
              </li>
              <li>
                <strong>Opting Out of Personalized Advertising:</strong> Users may opt out of personalized advertising by visiting{' '}
                <a
                  href="https://www.google.com/settings/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sage-600 hover:underline font-medium"
                >
                  Google Ads Settings
                </a>
                . Alternatively, you can opt out of third-party vendor cookies for personalized advertising by visiting{' '}
                <a
                  href="https://www.aboutads.info/choices/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sage-600 hover:underline font-medium"
                >
                  www.aboutads.info/choices
                </a>
                .
              </li>
              <li>
                <strong>European Economic Area (EEA) & UK Users:</strong> In accordance with Google&apos;s EU User Consent Policy, users in the EEA and UK are provided with consent management controls regarding cookies and personalized versus non-personalized advertisements.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              3. Cookies and Web Beacons
            </h2>
            <p>
              A cookie is a small text file placed on your device to help websites deliver a better user experience:
            </p>
            <ul className="list-disc ml-6 mt-3 space-y-2 text-sm">
              <li>
                <strong>Essential / Functional Cookies:</strong> Used to maintain core site functionality and security.
              </li>
              <li>
                <strong>Advertising & Analytics Cookies:</strong> Placed by Google AdSense and analytics partners to measure ad performance, prevent fraud, and serve relevant promotions.
              </li>
              <li>
                <strong>How to Control Cookies:</strong> You can choose to disable or selectively turn off cookies in your browser settings. However, doing so may affect how you are able to interact with this and other websites.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              4. California Privacy Rights (CCPA / CPRA)
            </h2>
            <p>
              Under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA), California residents have specific rights regarding their personal information:
            </p>
            <ul className="list-disc ml-6 mt-3 space-y-2 text-sm">
              <li><strong>Right to Know:</strong> You have the right to request details about the categories and specific pieces of personal information collected.</li>
              <li><strong>Right to Delete:</strong> You have the right to request the deletion of any personal data collected.</li>
              <li><strong>Right to Opt-Out:</strong> We do not sell personal data for monetary consideration. For third-party cookie-based sharing under ad networks, you may exercise your opt-out rights via Google Ads Settings.</li>
              <li><strong>Non-Discrimination:</strong> We will never discriminate against you for exercising any of your privacy rights.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              5. European Privacy Rights (GDPR / UK GDPR)
            </h2>
            <p>
              For users residing in the European Economic Area (EEA) and the United Kingdom, our processing of your information adheres to the GDPR:
            </p>
            <ul className="list-disc ml-6 mt-3 space-y-2 text-sm">
              <li><strong>Legal Basis:</strong> Legitimate interest (for site security and essential operation) and Consent (for advertising cookies).</li>
              <li><strong>Your Rights:</strong> You have the right to access, rectify, restrict, port, or erase any personal information we hold, as well as withdraw consent at any time.</li>
              <li><strong>Data Controller:</strong> Typetune is operated by Alekh Pradhan. Inquiries can be submitted directly to{' '}
                <a href="mailto:alekhpradhan33305@gmail.com" className="text-sage-600 hover:underline">
                  alekhpradhan33305@gmail.com
                </a>.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              6. Children&apos;s Online Privacy Protection Act (COPPA)
            </h2>
            <p>
              Typetune is designed to provide safe, educational typing games and creative newspaper tools for students of all ages. We strictly adhere to COPPA:
            </p>
            <p className="mt-2 text-sm">
              We do not knowingly collect, request, or store personally identifiable information from children under the age of 13. All typing exercises, arcade games, and newspaper layouts operate without account registration. If a parent or guardian discovers that their child has sent us personal information without consent, please contact us at{' '}
              <a href="mailto:alekhpradhan33305@gmail.com" className="text-sage-600 hover:underline">
                alekhpradhan33305@gmail.com
              </a>{' '}
              and we will promptly delete it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              7. Data Security & Storage
            </h2>
            <p className="text-sm">
              We implement industry-standard encryption, HTTPS TLS transport security, and database access controls to safeguard data integrity. Although no online platform can guarantee absolute security, we adhere to strict best practices to minimize risks.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              8. Contact Us
            </h2>
            <p className="text-sm">
              If you have any questions, suggestions, or concerns regarding this Privacy Policy, cookie practices, or data protection, please contact:
            </p>
            <div className="card p-5 mt-4 border border-slate-200/80 max-w-md">
              <p className="font-bold text-slate-800">Typetune Support & Privacy Office</p>
              <p className="text-sm text-slate-600 mt-1">Lead Developer & Operator: Alekh Pradhan</p>
              <p className="text-sm text-slate-600">
                Official Email:{' '}
                <a href="mailto:alekhpradhan33305@gmail.com" className="text-sage-600 hover:underline font-medium">
                  alekhpradhan33305@gmail.com
                </a>
              </p>
              <p className="text-sm text-slate-600">Website: https://typetune.ollypedia.in</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}


