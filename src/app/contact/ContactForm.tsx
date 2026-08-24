'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';

// Note: metadata must be exported from a server component.
// This file is a client component, so metadata is defined in a separate layout or via head tags.
// For a quick solution, the parent page.tsx exports metadata and renders this as a child.

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    // In production: replace with a real form backend (Formspree, Resend, etc.)
    // For now, construct a mailto: link as a fallback
    const subject = encodeURIComponent(`[TypeTunes Feedback] ${form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`
    );
    window.location.href = `mailto:hello@typetunes.in?subject=${subject}&body=${body}`;

    setTimeout(() => setStatus('sent'), 800);
  };

  return (
    <form onSubmit={handleSubmit} className="card p-8 space-y-5 max-w-lg">
      <div>
        <label htmlFor="contact-name" className="block text-sm font-medium text-slate-600 mb-1.5">
          Name
        </label>
        <input
          id="contact-name"
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className="w-full px-4 py-2.5 rounded-lg border border-cream-dark bg-white/60 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-sage-300 transition-shadow"
          placeholder="Your name"
        />
      </div>

      <div>
        <label htmlFor="contact-email" className="block text-sm font-medium text-slate-600 mb-1.5">
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          className="w-full px-4 py-2.5 rounded-lg border border-cream-dark bg-white/60 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-sage-300 transition-shadow"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium text-slate-600 mb-1.5">
          Message
        </label>
        <textarea
          id="contact-message"
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          className="w-full px-4 py-2.5 rounded-lg border border-cream-dark bg-white/60 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-sage-300 transition-shadow resize-none"
          placeholder="Tell us what's on your mind…"
        />
      </div>

      <button
        id="contact-submit-btn"
        type="submit"
        disabled={status === 'sending' || status === 'sent'}
        className="btn-primary w-full justify-center"
      >
        {status === 'idle'    && <><Send size={14} /> Send Message</>}
        {status === 'sending' && 'Sending…'}
        {status === 'sent'    && '✓ Message sent!'}
        {status === 'error'   && 'Error — try again'}
      </button>
    </form>
  );
}
