import type { Metadata } from 'next';
import ContactForm from './ContactForm';
import { Mail } from 'lucide-react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Contact Typetune — Support & Feedback',
  description:
    'Get in touch with the Typetune team. Send us feedback, bug reports, feature requests, or partnership inquiries with fast 24-hour turnaround.',
  alternates: { canonical: 'https://typetune.ollypedia.in/contact' },
  openGraph: {
    title: 'Contact Typetune — Support & Feedback',
    description:
      'Get in touch with the Typetune team. Send us feedback, bug reports, feature requests, or partnership inquiries with fast 24-hour turnaround.',
    url: 'https://typetune.ollypedia.in/contact',
    siteName: 'Typetune',
    type: 'website',
    images: [
      {
        url: 'https://typetune.ollypedia.in/og-default.png',
        width: 1200,
        height: 630,
        alt: 'Contact Typetune',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Typetune — Support & Feedback',
    description:
      'Get in touch with the Typetune team. Send us feedback, bug reports, feature requests, or partnership inquiries.',
    images: ['https://typetune.ollypedia.in/og-default.png'],
  },
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
                href="mailto:alekhpradhan33305@gmail.com"
                className="text-sm text-sage-600 hover:underline break-all"
              >
                alekhpradhan33305@gmail.com
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

