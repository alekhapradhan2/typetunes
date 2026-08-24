import type { Metadata } from 'next';
import { BLOG_POSTS } from '@/data/blog-posts';
import BlogList from './BlogList';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Typing Guides & Practice Blog — How to Type Faster',
  description:
    'Free, in-depth guides on improving typing speed, ergonomics, touch typing, WPM benchmarks, and the science of muscle memory with Read & Practice modes.',
  alternates: { canonical: 'https://typetunes.in/blog' },
};


export default function BlogPage() {
  return (
    <div className="bg-hero min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 py-12">
        <Breadcrumbs items={[{ label: 'Blog' }]} />

        <div className="mb-10">
          <span className="chip mb-3 inline-flex">{BLOG_POSTS.length} articles available</span>
          <h1
            className="text-4xl font-bold text-slate-800 mb-3"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Typing Guides & Practice Library
          </h1>
          <p className="text-slate-500 max-w-xl leading-relaxed text-sm sm:text-base">
            Practical, research-backed guides on typing speed, technique, ergonomics,
            and muscle memory. Read any article, then switch to Practice mode to type it
            with musical piano notes!
          </p>
        </div>

        <BlogList posts={BLOG_POSTS} />
      </div>
    </div>
  );
}
