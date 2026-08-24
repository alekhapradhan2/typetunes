import type { Metadata } from 'next';
import { getResultById } from '@/lib/db';
import ResultsScreen from './ResultsScreen';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const result = await getResultById(id).catch(() => null);
  if (!result) return { title: 'Result Not Found | TypeTunes' };

  const title = `${result.netWpm} WPM · ${result.accuracy}% acc — TypeTunes Result`;
  const description = `Scored ${result.netWpm} WPM with ${result.accuracy}% accuracy on TypeTunes. ${result.takeawayMessage}`;
  const url = `https://typetunes.in/results/${id}`;
  const imageUrl = `https://typetunes.in/results/${id}/opengraph-image`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      images: [imageUrl],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}


export default async function ResultPage({ params }: Props) {
  const { id } = await params;
  const result = await getResultById(id).catch(() => null);

  return <ResultsScreen id={id} initialResult={result} />;
}
