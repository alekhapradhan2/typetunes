const fs = require('fs');
const path = require('path');

const files = [
  'src/data/blog-posts.ts',
  'src/data/blog-posts-extended.ts',
  'src/lib/types.ts',
  'src/lib/words.ts',
  'src/lib/topics.ts',
  'src/hooks/usePiano.ts',
  'src/components/results/WeakPointsAnalysis.tsx',
  'src/app/results/[id]/ResultsScreen.tsx'
];

for (const rel of files) {
  const filePath = path.join(__dirname, '..', rel);
  if (!fs.existsSync(filePath)) continue;
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/TypeTune(?![sS])/g, 'TypeTunes');
  content = content.replace(/TypeTuness/g, 'TypeTunes');
  content = content.replace(/TypeTunes's/g, "TypeTunes'");
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${rel}`);
}
