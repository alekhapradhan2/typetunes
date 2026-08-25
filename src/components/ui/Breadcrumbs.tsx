import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const baseUrl = 'https://typetune.ollypedia.in';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      ...items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: item.label,
        item: item.href
          ? `${baseUrl}${item.href}`
          : undefined,
      })),
    ],
  };


  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-slate-400 overflow-x-auto py-1">
        <Link
          href="/"
          className="flex items-center gap-1 hover:text-sage-700 transition-colors flex-shrink-0"
        >
          <Home size={13} className="text-slate-400" />
          <span>Home</span>
        </Link>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <div key={index} className="flex items-center gap-1.5 flex-shrink-0">
              <ChevronRight size={12} className="text-slate-300" />
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="hover:text-sage-700 transition-colors max-w-[180px] truncate"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={`max-w-[240px] truncate ${
                    isLast ? 'font-semibold text-slate-600' : 'text-slate-400'
                  }`}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
            </div>
          );
        })}
      </nav>
    </>
  );
}
