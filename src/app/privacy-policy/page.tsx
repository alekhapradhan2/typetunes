import type { Metadata } from 'next';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Privacy Policy — Data & Cookies Explained | TypeTunes',
  description:
    'Read the TypeTunes Privacy Policy. Learn what data we collect, how anonymous typing test results are handled, cookie usage, and your data rights.',
  alternates: { canonical: 'https://typetunes.in/privacy-policy' },
};


export default function PrivacyPolicyPage() {
  return (
    <div className="bg-hero min-h-screen">
      <div className="mx-auto max-w-3xl px-6 py-12">
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

        <div className="space-y-8 text-slate-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-slate-700 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              1. What we collect
            </h2>
            <p>
              TypeTunes collects only what is necessary to provide the service:
            </p>
            <ul className="list-disc ml-6 mt-3 space-y-2 text-sm">
              <li>
                <strong>Typing test results:</strong> When you complete a test, your result
                (WPM, accuracy, keystroke events, error map, config) is saved to our
                database with a random ID. No name or email is attached.
              </li>
              <li>
                <strong>LocalStorage:</strong> Your audio settings (volume, mute) and recent
                result IDs are stored in your browser's localStorage. This never leaves your device.
              </li>
              <li>
                <strong>No personal identification:</strong> We do not collect your name, email,
                IP address (beyond what standard cloud infrastructure logs automatically for security and discards),
                or any identifying information.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-700 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              2. Cookies
            </h2>
            <p className="text-sm">
              TypeTunes does not use tracking cookies or third-party advertising cookies. We prioritize an ad-free, clutter-free typing environment.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-700 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              3. Analytics
            </h2>
            <p className="text-sm">
              We may use privacy-first analytics to understand aggregate performance patterns (such as popular test modes). No cross-site profiling or individual user tracking occurs.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-700 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              4. Data retention
            </h2>
            <p className="text-sm">
              Test results stored in our database are retained to support shareable result links. Since results are not linked to any personal identity, they cannot be individually attributed. If you would like a result deleted, contact us with the result ID.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-700 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              5. Third-party infrastructure
            </h2>
            <ul className="list-disc ml-6 mt-2 space-y-2 text-sm">
              <li><strong>Hosting:</strong> High-reliability edge infrastructure.</li>
              <li><strong>Database:</strong> Encrypted cloud database storage.</li>
              <li><strong>Audio engine:</strong> Tone synthesis runs 100% locally in your browser — zero audio data is recorded or transmitted.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-700 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              6. Your rights
            </h2>
            <p className="text-sm">
              Under GDPR, CCPA, and global privacy regulations, you have the right to know what data is collected and to request deletion. Since TypeTunes collects no personally identifiable information, your privacy is protected by design. For inquiries, contact{' '}
              <a
                href="mailto:privacy@typetunes.in"
                className="text-sage-600 hover:underline"
              >
                privacy@typetunes.in
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-700 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              7. Changes to this policy
            </h2>
            <p className="text-sm">
              We may update this policy as the service evolves. The &ldquo;last updated&rdquo; date at the top of this page will reflect revisions. Continued use of TypeTunes constitutes acceptance of the revised policy.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

