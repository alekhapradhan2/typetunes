import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBlogPostBySlug, getAllBlogSlugs, BLOG_POSTS } from '@/data/blog-posts';
import Link from 'next/link';
import { Clock, ArrowLeft, ArrowRight, BookOpen, Sparkles, Zap } from 'lucide-react';
import BlogArticleView from './BlogArticleView';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { InArticleAd } from '@/components/ads/InArticleAd';
import { Suspense } from 'react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

function formatSeoTitle(rawTitle: string): string {
  if (rawTitle.length <= 46) return rawTitle;
  if (rawTitle.includes(':')) {
    const mainPart = rawTitle.split(':')[0].trim();
    if (mainPart.length >= 15 && mainPart.length <= 46) return mainPart;
  }
  if (rawTitle.includes('—')) {
    const mainPart = rawTitle.split('—')[0].trim();
    if (mainPart.length >= 15 && mainPart.length <= 46) return mainPart;
  }
  return rawTitle.slice(0, 44).trim() + '...';
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return { title: 'Article Not Found' };

  const title = formatSeoTitle(post.title);
  const url = `https://typetune.ollypedia.in/blog/${slug}`;
  const imageUrl = 'https://typetune.ollypedia.in/og-default.png';

  return {
    title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: post.description,
      type: 'article',
      url,
      siteName: 'Typetune',
      publishedTime: post.publishedAt,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: post.description,
      images: [imageUrl],
    },
  };
}

/** Converts plain-text markdown (including tables, lists, headers) into semantic JSX with responsive in-article ads */
function renderContent(text: string) {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;
  let h2Count = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('## ')) {
      h2Count++;
      // Inject an in-article native fluid ad after the 2nd major section for readers
      if (h2Count === 2) {
        elements.push(
          <div key={`in-article-ad-${i}`} className="my-6">
            <InArticleAd />
          </div>
        );
      }

      elements.push(
        <h2
          key={i}
          className="text-xl font-bold text-slate-800 mt-8 mb-3"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {line.slice(3)}
        </h2>
      );
      i++;
    } else if (line.startsWith('### ')) {
      elements.push(
        <h3
          key={i}
          className="text-base font-semibold text-slate-700 mt-5 mb-2"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {line.slice(4)}
        </h3>
      );
      i++;
    } else if (line.startsWith('- ')) {
      const listItems: string[] = [];
      while (i < lines.length && lines[i].startsWith('- ')) {
        listItems.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="space-y-1.5 my-4 ml-6 list-disc text-slate-600">
          {listItems.map((item, liIdx) => (
            <li key={liIdx}>{item}</li>
          ))}
        </ul>
      );
    } else if (line.startsWith('| ')) {
      // Gather consecutive table lines
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].startsWith('|')) {
        tableLines.push(lines[i]);
        i++;
      }

      if (tableLines.length >= 2) {
        const headerCells = tableLines[0]
          .split('|')
          .filter((c) => c.trim().length > 0)
          .map((c) => c.trim());

        // Line 1 is usually the separator |---|---|
        const bodyLines = tableLines.slice(2);

        elements.push(
          <div key={`table-${i}`} className="overflow-x-auto my-6">
            <table className="w-full text-left border-collapse border border-slate-200 text-sm rounded-xl overflow-hidden shadow-2xs">
              <thead className="bg-slate-100/90 text-slate-800 font-semibold border-b border-slate-200">
                <tr>
                  {headerCells.map((h, hi) => (
                    <th key={hi} className="p-3 border-r border-slate-200 last:border-r-0">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {bodyLines.map((rowLine, ri) => {
                  const cells = rowLine
                    .split('|')
                    .filter((c) => c.trim().length > 0)
                    .map((c) => c.trim());
                  return (
                    <tr key={ri} className="hover:bg-slate-50/70 transition-colors">
                      {cells.map((cell, ci) => (
                        <td key={ci} className="p-3 border-r border-slate-200 last:border-r-0 text-slate-600">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      }
    } else if (line.startsWith('**') && line.endsWith('**')) {
      elements.push(
        <p key={i} className="font-semibold text-slate-800 mt-4 mb-2">
          {line.slice(2, -2)}
        </p>
      );
      i++;
    } else if (line.trim() === '' || line.trim() === '---') {
      i++;
    } else {
      elements.push(
        <p key={i} className="text-slate-600 leading-relaxed mb-4">
          {line}
        </p>
      );
      i++;
    }
  }

  return elements;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const idx = BLOG_POSTS.findIndex((p) => p.slug === slug);
  const prev = BLOG_POSTS[idx - 1];
  const next = BLOG_POSTS[idx + 1];

  // Related articles in the same category (or other popular posts)
  const relatedPosts = BLOG_POSTS.filter(
    (p) => p.slug !== slug && p.category === post.category
  ).slice(0, 3);

  const fallbackRelated =
    relatedPosts.length < 3
      ? [
          ...relatedPosts,
          ...BLOG_POSTS.filter(
            (p) => p.slug !== slug && !relatedPosts.some((r) => r.slug === p.slug)
          ).slice(0, 3 - relatedPosts.length),
        ]
      : relatedPosts;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: [
      {
        '@type': 'Person',
        name: 'TypeTunes Editorial Team',
      },
    ],
    publisher: {
      '@type': 'Organization',
      name: 'Typetune',
      url: 'https://typetune.ollypedia.in',
      logo: {
        '@type': 'ImageObject',
        url: 'https://typetune.ollypedia.in/og-default.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://typetune.ollypedia.in/blog/${post.slug}`,
    },
    image: 'https://typetune.ollypedia.in/og-default.png',
  };


  const articleHtml = (
    <>
      <div className="prose-like">{renderContent(post.content)}</div>

      {/* Bottom of Article Native Ad */}
      <InArticleAd className="my-6" />

      {/* CTA Box with direct links to practice & test modes */}
      <div className="card p-6 mt-8 text-center bg-gradient-to-r from-cream-light/80 to-white dark:from-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-800">
        <h3
          className="text-lg font-bold text-slate-800 mb-2"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Ready to put these concepts into practice?
        </h3>
        <p className="text-slate-600 mb-5 text-sm max-w-md mx-auto">
          Test your typing velocity with soothing piano feedback or drill timed challenge modes.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-primary">
            Take 60-Second Test →
          </Link>
          <Link href="/test/zen" className="btn-ghost">
            Try Zen Mode 🌿
          </Link>
          <Link href="/test/quotes" className="btn-ghost">
            Practice Quotes 📜
          </Link>
        </div>
      </div>
    </>
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="bg-hero min-h-screen">
        <article className="mx-auto max-w-5xl px-4 sm:px-8 lg:px-12 py-12">
          {/* Breadcrumb Navigation */}
          <Breadcrumbs
            items={[
              { label: 'Blog', href: '/blog' },
              { label: post.category, href: `/blog?category=${encodeURIComponent(post.category)}` },
              { label: post.title },
            ]}
          />

          {/* Header */}
          <header className="mb-8">
            <span className="chip mb-4 inline-flex">{post.category}</span>
            <h1
              className="text-3xl md:text-4xl font-bold text-slate-800 mb-4 leading-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {post.title}
            </h1>
            <p className="text-slate-500 text-base leading-relaxed mb-5">
              {post.description}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span className="font-medium text-slate-600">
                By TypeTunes Editorial Team
              </span>
              <span>•</span>
              <span>
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  dateStyle: 'long',
                })}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock size={11} /> {post.readingTime} min read
              </span>
              <span>•</span>
              <span className="text-sage-700 bg-sage-50 px-2 py-0.5 rounded-md font-medium">
                Reviewed for Accuracy
              </span>
            </div>
          </header>

          {/* Read + Practice Switcher & Body */}
          <Suspense fallback={<div className="py-8 text-center text-slate-400">Loading practice engine…</div>}>
            <BlogArticleView post={post} renderedHtml={articleHtml} />
          </Suspense>

          {/* Prev / Next Article Nav */}
          <nav
            className="mt-12 flex flex-col md:flex-row gap-4 justify-between"
            aria-label="Article navigation"
          >
            {prev ? (
              <Link
                href={`/blog/${prev.slug}`}
                className="card p-4 flex items-center gap-3 flex-1 hover:shadow-md transition-shadow group"
              >
                <ArrowLeft
                  size={16}
                  className="text-slate-400 group-hover:text-sage-500 flex-shrink-0"
                />
                <div>
                  <div className="text-xs text-slate-400 mb-0.5">Previous Guide</div>
                  <div className="text-sm font-medium text-slate-700 group-hover:text-sage-600 transition-colors line-clamp-1">
                    {prev.title}
                  </div>
                </div>
              </Link>
            ) : (
              <div className="flex-1" />
            )}

            {next && (
              <Link
                href={`/blog/${next.slug}`}
                className="card p-4 flex items-center justify-end gap-3 flex-1 hover:shadow-md transition-shadow group text-right"
              >
                <div>
                  <div className="text-xs text-slate-400 mb-0.5">Next Guide</div>
                  <div className="text-sm font-medium text-slate-700 group-hover:text-sage-600 transition-colors line-clamp-1">
                    {next.title}
                  </div>
                </div>
                <ArrowRight
                  size={16}
                  className="text-slate-400 group-hover:text-sage-500 flex-shrink-0"
                />
              </Link>
            )}
          </nav>

          {/* Related Articles Interlinked Section */}
          <div className="mt-14 pt-8 border-t border-slate-200/80">
            <h3
              className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              <BookOpen size={18} className="text-sage-600" />
              Related Articles & Practice Guides
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {fallbackRelated.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/blog/${rel.slug}`}
                  className="card p-4 flex flex-col justify-between hover:shadow-md hover:border-sage-300 transition-all group"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sage-700 bg-sage-50 px-2 py-0.5 rounded-full mb-2 inline-block">
                      {rel.category}
                    </span>
                    <h4 className="text-xs font-semibold text-slate-700 group-hover:text-sage-700 transition-colors line-clamp-2 leading-snug">
                      {rel.title}
                    </h4>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                    <span>{rel.readingTime} min read</span>
                    <span className="text-sage-600 font-medium group-hover:underline">
                      Read & Type →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </article>
      </div>
    </>
  );
}
