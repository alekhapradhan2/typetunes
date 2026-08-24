import clientPromise from './mongodb';
import type { TestResult, HistoryEntry } from './types';
import { Db } from 'mongodb';

// In-memory fallback cache for high availability and offline/disconnected support
const memoryResults = new Map<string, TestResult>();

async function getDb(): Promise<Db | null> {
  if (!clientPromise) return null;
  try {
    const client = await clientPromise;
    return client.db(process.env.MONGODB_DB_NAME || 'typetune');
  } catch (err) {
    console.warn('[TypeTunes] MongoDB connection unavailable, using memory fallback:', err);
    return null;
  }
}

// ─── Results ────────────────────────────────────────────────────────────────

export async function saveResult(result: TestResult): Promise<void> {
  memoryResults.set(result.id, result);
  try {
    const db = await getDb();
    if (db) {
      await db.collection('results').insertOne({ ...result, _id: result.id as any });
    }
  } catch (err) {
    console.warn('[TypeTunes] Failed to persist to MongoDB (cached in memory):', err);
  }
}

export async function getResultById(id: string): Promise<TestResult | null> {
  if (memoryResults.has(id)) {
    return memoryResults.get(id)!;
  }
  try {
    const db = await getDb();
    if (!db) return null;
    const doc = await db.collection('results').findOne({ _id: id as any });
    if (!doc) return null;
    const { _id, ...rest } = doc as any;
    const res = rest as TestResult;
    memoryResults.set(id, res);
    return res;
  } catch (err) {
    console.warn('[TypeTunes] Failed to fetch from MongoDB:', err);
    return null;
  }
}

export async function getRecentResults(limit = 10): Promise<HistoryEntry[]> {
  try {
    const db = await getDb();
    if (db) {
      const docs = await db
        .collection('results')
        .find({})
        .sort({ createdAt: -1 })
        .limit(limit)
        .toArray();

      return docs.map((doc: any) => ({
        id: doc._id as string,
        createdAt: doc.createdAt,
        netWpm: doc.netWpm,
        accuracy: doc.accuracy,
        mode: doc.config?.mode,
        duration: doc.config?.timeDuration,
        wordCount: doc.config?.wordCount,
      }));
    }
  } catch (err) {
    console.warn('[TypeTunes] Failed to fetch recent results from MongoDB:', err);
  }

  // Fallback to memory results
  const list = Array.from(memoryResults.values())
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);

  return list.map((res) => ({
    id: res.id,
    createdAt: res.createdAt,
    netWpm: res.netWpm,
    accuracy: res.accuracy,
    mode: res.config?.mode,
    duration: res.config?.timeDuration,
    wordCount: res.config?.wordCount,
  }));
}

// ─── Blog ────────────────────────────────────────────────────────────────────

export async function getAllBlogSlugs(): Promise<string[]> {
  try {
    const db = await getDb();
    if (db) {
      const docs = await db
        .collection('blog_posts')
        .find({}, { projection: { slug: 1 } })
        .toArray();
      return docs.map((d: any) => d.slug);
    }
  } catch {
    // fallback
  }
  return [];
}

