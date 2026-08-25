import type { Metadata } from 'next';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service — Platform Usage Rules',
  description:
    'Read the Typetune Terms of Service. Understand our acceptable use policy, intellectual property rights, disclaimer of warranties, and service terms.',
  alternates: { canonical: 'https://typetune.ollypedia.in/terms' },
  openGraph: {
    title: 'Terms of Service — Platform Usage Rules',
    description:
      'Read the Typetune Terms of Service. Understand our acceptable use policy, intellectual property rights, disclaimer of warranties, and service terms.',
    url: 'https://typetune.ollypedia.in/terms',
    siteName: 'Typetune',
    type: 'website',
    images: [
      {
        url: 'https://typetune.ollypedia.in/og-default.png',
        width: 1200,
        height: 630,
        alt: 'Terms of Service – Typetune',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service — Platform Usage Rules',
    description:
      'Read the Typetune Terms of Service and acceptable use policy.',
    images: ['https://typetune.ollypedia.in/og-default.png'],
  },
};

export default function TermsPage() {
  return (
    <div className="bg-hero min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-8 lg:px-12 py-12">
        <Breadcrumbs items={[{ label: 'Terms of Service' }]} />
        <h1
          className="text-4xl font-bold text-slate-800 mb-2"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Terms of Service
        </h1>
        <p className="text-slate-400 text-sm mb-10">
          Last updated: {new Date().toLocaleDateString('en-US', { dateStyle: 'long' })}
        </p>

        <div className="space-y-10 text-slate-600 leading-relaxed text-sm sm:text-base">
          <section>
            <p>
              Welcome to <strong>Typetune</strong> (&ldquo;the Service&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;), accessible at{' '}
              <Link href="/" className="text-sage-600 hover:underline">
                https://typetune.ollypedia.in
              </Link>
              . By accessing or using Typetune, our typing speed tests, educational games, Newspaper Studio, and related features, you agree to be legally bound by these Terms of Service. If you do not agree with any part of these terms, please refrain from using the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              1. Description of Service & Eligibility
            </h2>
            <p>
              Typetune is a free web-based typing speed test, educational game platform, and interactive student newspaper maker. No account registration is required to access our features. You may use Typetune for personal development, classroom instruction, and educational practice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              2. Acceptable Use Policy
            </h2>
            <p>
              You agree to use Typetune solely for lawful purposes. You shall not:
            </p>
            <ul className="list-disc ml-6 mt-3 space-y-2 text-sm">
              <li>Deploy automated bots, scripts, scrapers, or macro tools designed to simulate fake keystrokes or manipulate leaderboard metrics.</li>
              <li>Attempt to overwhelm, disrupt, or attack our server infrastructure, APIs, or database systems (DDoS, rate-limit bypassing, or unauthorized vulnerability probing).</li>
              <li>Upload or distribute unlawful, defamatory, infringing, or malicious content through Newspaper Studio or custom typing modules.</li>
              <li>Attempt to reverse-engineer, decompile, or exploit our proprietary algorithms or server backend.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              3. Intellectual Property Rights
            </h2>
            <p>
              All original content, interactive code, user interface designs, logo artwork, custom word banks, and educational blog articles are the intellectual property of Typetune and its creator, Alekh Pradhan.
            </p>
            <ul className="list-disc ml-6 mt-3 space-y-2 text-sm">
              <li>
                <strong>Audio Samples:</strong> The acoustic piano sound samples utilized in our audio synthesizer are derived from the Salamander Grand Piano soundfont by Alexander Holm, licensed under Creative Commons Attribution 3.0 (CC BY 3.0).
              </li>
              <li>
                <strong>User Generated Newspapers & Results:</strong> You retain ownership of custom newspaper text and articles you compose in Newspaper Studio. You are granted permission to download, export, and distribute your generated PDFs and scorecard cards for personal or educational purposes.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              4. Third-Party Advertisements & Google AdSense
            </h2>
            <p>
              Typetune may display advertisements provided by Google AdSense (Publisher ID: <code>ca-pub-5823659147566885</code>) and authorized advertising networks. We do not endorse or assume liability for third-party products, services, or websites advertised through these units. Interactions with third-party advertisements are governed by the respective advertiser&apos;s privacy and terms policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              5. Educational & Classroom Use
            </h2>
            <p>
              Teachers, schools, and academic institutions are welcome to incorporate Typetune into typing curricula and computer literacy classes. Typetune does not require student registration or collect personally identifiable student data, providing a COPPA-compliant environment for classroom learning.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              6. Disclaimer of Warranties
            </h2>
            <p className="text-sm">
              Typetune is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without warranties of any kind, whether express or implied. While we strive for high precision and maximum server availability, we do not warrant that calculations of Words Per Minute (WPM) or latency metrics will be error-free, uninterrupted, or legally certified for formal examinations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              7. Limitation of Liability
            </h2>
            <p className="text-sm">
              To the maximum extent permitted by applicable law, Typetune, its founder Alekh Pradhan, and contributors shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your access to or inability to use the Service, loss of data, browser incompatibilities, or reliance on information presented in educational guides.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              8. Modifications to Terms
            </h2>
            <p className="text-sm">
              We reserve the right to revise or update these Terms of Service at any time. Any changes will become effective immediately upon posting to this page with an updated revision date. Your continued use of Typetune after changes signifies your agreement to the modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              9. Contact & Inquiries
            </h2>
            <p className="text-sm">
              If you have any questions or legal inquiries regarding these Terms of Service, please contact us at:
            </p>
            <div className="card p-5 mt-4 border border-slate-200/80 max-w-md">
              <p className="font-bold text-slate-800">Typetune Legal & Support</p>
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


