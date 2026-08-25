import React, { useState, useMemo } from 'react';
import type { BlogPost } from '@/lib/types';
import Link from 'next/link';
import { Clock, Search, Keyboard, BookOpen } from 'lucide-react';
import { InFeedAd } from '@/components/ads/InFeedAd';

interface BlogListProps {
  posts: BlogPost[];
}

const CATEGORY_COLORS: Record<string, string> = {
  Guides: '#6aa850',
  Basics: '#54b3d9',
  Science: '#b8a8c8',
  Programming: '#c8a878',
  Equipment: '#c8887a',
  Health: '#87ba72',
  Education: '#7fc6e3',
  Career: '#a090bc',
  'Deep Dives': '#548e3f',
  Motivation: '#2ea0d0',
  History: '#c8887a',
  Psychology: '#9d84b7',
};

export default function BlogList({ posts }: BlogListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(posts.map((p) => p.category)));
    return ['All', ...cats];
  }, [posts]);

  // Filtered posts
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory =
        selectedCategory === 'All' || post.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        post.title.toLowerCase().includes(query) ||
        post.description.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  return (
    <div>
      {/* Search & Category Filter Bar */}
      <div className="mb-8 space-y-4">
        {/* Search input */}
        <div className="relative max-w-md">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guides, ergonomics, touch typing, programming…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-dark bg-white/90 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-sage-400 transition-shadow placeholder:text-slate-400 shadow-2xs"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          {categories.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                type="button"
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={[
                  'px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer',
                  active
                    ? 'bg-sage-500 text-white shadow-sm scale-105'
                    : 'bg-white/80 text-slate-600 border border-cream-dark hover:border-sage-300 hover:text-sage-700',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {cat}
                {cat === 'All' && ` (${posts.length})`}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2-Column Responsive Card Grid matching Homepage design */}
      {filteredPosts.length === 0 ? (
        <div className="card p-12 text-center text-slate-500">
          <p className="font-semibold text-slate-700 mb-1">No articles found</p>
          <p className="text-sm">Try adjusting your search query or category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post, index) => {
            const catColor = CATEGORY_COLORS[post.category] ?? '#6aa850';
            return (
              <React.Fragment key={post.slug}>
                <div
                  className="card p-6 flex flex-col justify-between hover:shadow-xl transition-all duration-200 border border-slate-200/80 dark:border-slate-800 group bg-white dark:bg-slate-900/90"
                >
                  <div>
                    {/* Top Metadata Row */}
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                        style={{ background: catColor + '18', color: catColor }}
                      >
                        {post.category}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                        <Clock size={11} /> {post.readingTime} min
                      </span>
                    </div>

                    {/* Title */}
                    <Link href={`/blog/${post.slug}`} className="block">
                      <h2
                        className="text-lg font-bold text-slate-800 dark:text-white group-hover:text-sage-700 dark:group-hover:text-sage-300 transition-colors mb-2 leading-snug"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {post.title}
                      </h2>
                    </Link>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 mb-5">
                      {post.description}
                    </p>
                  </div>

                  {/* Bottom Action Bar with 2 options */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="btn-ghost text-xs py-2 px-3.5 flex items-center justify-center gap-1.5 flex-1 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-800"
                    >
                      <BookOpen size={14} />
                      Read Article
                    </Link>

                    <Link
                      href={`/blog/${post.slug}?tab=practice`}
                      className="btn-primary text-xs py-2 px-3.5 flex items-center justify-center gap-1.5 shadow-2xs flex-1 text-center"
                    >
                      <Keyboard size={14} />
                      Practice Typing
                    </Link>
                  </div>
                </div>

                {/* InFeed Ad every 6 posts */}
                {(index + 1) % 6 === 0 && index < filteredPosts.length - 1 && (
                  <div key={`ad-${index}`} className="sm:col-span-2 lg:col-span-3">
                    <InFeedAd className="my-2" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
}
