import type { Metadata } from 'next';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Terms of Service — Usage Guidelines & Rules | TypeTunes',
  description:
    'Read the TypeTunes Terms of Service. Understand our acceptable use policy, intellectual property rights, disclaimer of warranties, and service terms.',
  alternates: { canonical: 'https://typetunes.in/terms' },
};


export default function TermsPage() {
  const appUrl = 'https://typetunes.in';

  return (
    <div className="bg-hero min-h-screen">
      <div className="mx-auto max-w-3xl px-6 py-12">
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

        <div className="space-y-8 text-slate-600 leading-relaxed text-sm">
          <p>
            By using TypeTunes (&ldquo;the Service&rdquo;), you agree to these Terms of Service.
            If you do not agree, please do not use the Service.
          </p>

          {[
            {
              title: '1. Use of the Service',
              body: `TypeTunes is a free, web-based typing speed test and educational tool. You may use it for personal, educational, or professional self-improvement purposes. You may not use it to attempt to defraud, harm, or harass others, or to conduct automated testing (bots) that inflates results databases or degrades service performance for other users.`,
            },
            {
              title: '2. No Account Required',
              body: `No registration is required to use TypeTunes. Test results are stored anonymously by ID. You are responsible for keeping your result URLs private if you do not wish others to see your results.`,
            },
            {
              title: '3. Intellectual Property',
              body: `The TypeTunes software, design, and original blog content are © TypeTunes. The word banks and quote bank are original compositions. The Salamander Grand Piano audio samples are licensed CC BY 3.0 by Alexander Holm. You may share your test results with attribution to TypeTunes.`,
            },
            {
              title: '4. Disclaimer of Warranties',
              body: `TypeTunes is provided "as is" without warranty of any kind. We do not guarantee that the Service will be uninterrupted, error-free, or that results will be accurate to the millisecond. WPM measurements are indicative, not certified benchmarks.`,
            },
            {
              title: '5. Limitation of Liability',
              body: `To the maximum extent permitted by applicable law, TypeTunes and its creators are not liable for any indirect, incidental, or consequential damages arising from your use of the Service, including but not limited to: loss of data, inaccurate WPM results, or reliance on blog content for medical/professional decisions.`,
            },
            {
              title: '6. Third-Party Services',
              body: `TypeTunes uses Vercel for hosting, MongoDB Atlas for data storage, and may include privacy-compliant web analytics. Each of these services has its own terms and privacy policies, which also apply to your use.`,
            },
            {
              title: '7. Changes',
              body: `We may update these terms at any time. The "last updated" date above reflects the most recent revision. Continued use of TypeTunes after changes constitutes acceptance of the revised terms.`,
            },
            {
              title: '8. Contact',
              body: `For questions about these terms, contact legal@typetunes.in.`,
            },
          ].map((section) => (
            <section key={section.title}>
              <h2
                className="text-lg font-semibold text-slate-700 mb-2"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {section.title}
              </h2>
              <p>{section.body}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

