import type { Metadata } from 'next';
import ContactForm from './ContactForm';
import { Mail } from 'lucide-react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Contact TypeTunes — Support, Feedback & Inquiries',
  description:
    'Get in touch with the TypeTunes team. Send us feedback, bug reports, feature requests, or partnership inquiries with fast 24-hour turnaround.',
  alternates: { canonical: 'https://typetunes.in/contact' },
};

export default function ContactPage() {
  return (
    <div className="bg-hero min-h-screen">
      <div className="mx-auto max-w-5xl px-4 sm:px-8 lg:px-12 py-12">
        <Breadcrumbs items={[{ label: 'Contact Us' }]} />

        <h1
          className="text-4xl font-bold text-slate-800 mb-3"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Contact Us
        </h1>
        <p className="text-slate-500 mb-8 leading-relaxed">
          Found a bug? Have a feature idea? Want to say that our typing test helped you
          improve your typing flow? We read every message — usually within a day.
        </p>

        <div className="flex flex-col md:flex-row gap-10">
          <div className="flex-1">
            <ContactForm />
          </div>

          <div className="md:w-56 space-y-6">
            <div className="card p-5 border border-slate-200/80">
              <div className="flex items-center gap-2 mb-2">
                <Mail size={14} className="text-sage-500" />
                <span className="text-sm font-semibold text-slate-600">Email us directly</span>
              </div>
              <a
                href="mailto:hello@typetunes.in"
                className="text-sm text-sage-600 hover:underline break-all"
              >
                hello@typetunes.in
              </a>
            </div>

            <div className="card p-5 text-sm text-slate-500 leading-relaxed border border-slate-200/80">
              <p className="font-medium text-slate-600 mb-1">Response time</p>
              <p>We typically reply within 24–48 hours on weekdays.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

