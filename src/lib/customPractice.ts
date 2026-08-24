// Custom practice utilities, code snippets, weak key drill generator, and arcade word generators

import type { CustomSnippetPreset } from './types';

// Curated code and prose presets
export const CUSTOM_PRESETS: CustomSnippetPreset[] = [
  {
    id: 'js-modern',
    title: 'JavaScript Async / Await & Fetch',
    category: 'code',
    language: 'javascript',
    description: 'Practice arrow functions, async/await, try/catch blocks, and destructuring.',
    content: `async function fetchUserData(userId) {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }
    const { id, name, email } = await response.json();
    return { id, name, email, status: 'active' };
  } catch (err) {
    console.error('Error fetching user:', err.message);
    return null;
  }
}`,
  },
  {
    id: 'ts-react',
    title: 'TypeScript React Component',
    category: 'code',
    language: 'typescript',
    description: 'Practice TypeScript generics, interfaces, hooks, and JSX element types.',
    content: `interface ButtonProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'outline';
  onClick: () => void;
  disabled?: boolean;
}

export function ActionButton({ label, variant = 'primary', onClick, disabled }: ButtonProps) {
  const baseStyles = 'px-4 py-2 font-medium rounded-lg transition-all duration-200';
  return (
    <button onClick={onClick} disabled={disabled} className={baseStyles}>
      {label}
    </button>
  );
}`,
  },
  {
    id: 'python-algo',
    title: 'Python Binary Search & List Comprehensions',
    category: 'code',
    language: 'python',
    description: 'Clean Python syntax with colons, indentation, brackets, and math operations.',
    content: `def binary_search(arr: list[int], target: int) -> int:
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`,
  },
  {
    id: 'sql-queries',
    title: 'SQL Join & Aggregations',
    category: 'code',
    language: 'sql',
    description: 'High-frequency uppercase keywords, table joins, group by, and filters.',
    content: `SELECT 
    users.id, 
    users.username, 
    COUNT(orders.id) AS total_orders, 
    AVG(orders.amount) AS avg_spend 
FROM users 
INNER JOIN orders ON users.id = orders.user_id 
WHERE orders.created_at >= '2026-01-01' 
GROUP BY users.id, users.username 
HAVING COUNT(orders.id) > 5 
ORDER BY total_orders DESC;`,
  },
  {
    id: 'html-tailwind',
    title: 'HTML & CSS Classes',
    category: 'code',
    language: 'html',
    description: 'HTML5 semantic tags, brackets, quotes, and CSS class names.',
    content: `<div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-6">
  <header className="max-w-xl text-center space-y-4">
    <h1 className="text-4xl font-bold tracking-tight text-emerald-400">Master Your Craft</h1>
    <p className="text-slate-300 text-lg">Build fast, accessible, and delightful web experiences.</p>
  </header>
</div>`,
  },
  {
    id: 'speed-burst',
    title: 'Speed Burst: Top 100 Common Words',
    category: 'speed',
    description: 'Pure high-velocity muscle memory with the most frequently typed words in English.',
    content: `the be to of and a in that have I it for not on with he as you do at this but his by from they we say her she or an will my one all would there their what so up out if about who get which go me when make can like time no just him know take people into year your good some could them see other than then now look only come its over think also back after use two how our work first well way even new want because any these give day most us`,
  },
  {
    id: 'prose-steve-jobs',
    title: 'Steve Jobs — Stay Hungry, Stay Foolish',
    category: 'prose',
    description: 'Stanford commencement speech on passion, resilience, and curiosity.',
    content: `Your time is limited, so don't waste it living someone else's life. Don't be trapped by dogma, which is living with the results of other people's thinking. Don't let the noise of others' opinions drown out your own inner voice. And most important, have the courage to follow your heart and intuition. They somehow already know what you truly want to become.`,
  },
  {
    id: 'fun-tongue-twisters',
    title: 'Dexterity Drill: Tongue Twisters',
    category: 'fun',
    description: 'Challenging phonemes and sudden finger gymnastics to boost precision.',
    content: `She sells seashells by the seashore, and the shells she sells are seashells, I'm sure. How much wood would a woodchuck chuck if a woodchuck could chuck wood? Peter Piper picked a peck of pickled peppers. A proper copper coffee pot makes crisp quick sips.`,
  },
];

// N-gram dictionaries and word bank for key drills
const VOCABULARY_BY_KEY: Record<string, string[]> = {
  q: ['quick', 'quite', 'quote', 'queen', 'equal', 'quiet', 'liquid', 'square', 'require', 'quality', 'query', 'unique'],
  z: ['zero', 'zone', 'zoom', 'size', 'frozen', 'crazy', 'prize', 'blaze', 'hazard', 'puzzle', 'breeze', 'horizon'],
  x: ['extra', 'next', 'exact', 'exist', 'index', 'relax', 'fox', 'pixel', 'expert', 'complex', 'maximum', 'prefix'],
  p: ['power', 'point', 'speed', 'paper', 'happy', 'place', 'plant', 'apple', 'shape', 'proper', 'people', 'tempo'],
  b: ['bring', 'build', 'table', 'habit', 'brave', 'boost', 'bloom', 'subtle', 'symbol', 'bubble', 'border', 'balance'],
  v: ['voice', 'value', 'every', 'vivid', 'curve', 'vowel', 'brave', 'travel', 'active', 'silver', 'vision', 'volume'],
  j: ['jump', 'join', 'judge', 'major', 'adjust', 'object', 'enjoy', 'project', 'jungle', 'journey', 'joyful', 'junior'],
  k: ['keep', 'kind', 'think', 'speak', 'track', 'break', 'knife', 'spark', 'strike', 'pocket', 'market', 'keyboard'],
  w: ['water', 'world', 'write', 'white', 'power', 'swift', 'flow', 'shadow', 'window', 'answer', 'wonder', 'warmth'],
  c: ['clear', 'circle', 'scale', 'click', 'music', 'focus', 'clean', 'chord', 'craft', 'screen', 'action', 'create'],
  y: ['rhythm', 'syntax', 'layer', 'style', 'enjoy', 'dynamo', 'player', 'oxygen', 'system', 'symbol', 'mystery', 'energy'],
  '{': ['{ name }', '{ id, key }', '{ ...props }', '{ open: true }', '{ count: 0 }', '{ data: [] }'],
  '[': ['[0, 1, 2]', '[item.id]', '[...arr]', '[key, val]', '[min, max]', '[first, last]'],
  '(': ['(a + b)', '(item) =>', '(true && false)', '(x, y, z)', '(Math.random())', '(callback())'],
  ';': ['const a = 1;', 'let b = 2;', 'return true;', 'break;', 'continue;', 'export default App;'],
  '#': ['#main-heading', '#00ffcc', '#tag_name', '#include <stdio.h>', '#define PI 3.14', '#channel'],
  '@': ['user@example.com', '@param {string}', '@keyframes spin', '@media (min-width: 768px)', '@import url()'],
  '1': ['100', '1984', '12.5', '1st', '1000', '1.0'],
  '2': ['2026', '250', '2.5', '2nd', '2048', '42'],
  '3': ['365', '3.14', '300', '3rd', '3000', '993'],
  '4': ['404', '4k', '400', '4th', '24/7', '840'],
  '5': ['500', '50%', '5.0', '5th', '555', '150'],
  '6': ['60s', '64-bit', '600', '6th', '1960', '360'],
  '7': ['777', '7.5', '700', '7th', '007', '247'],
  '8': ['8-bit', '800', '80s', '8th', '1080', '888'],
  '9': ['99.9%', '900', '9th', '1999', '911', '90s'],
  '0': ['100', '200', '300', '400', '500', '600', '700', '800', '900', '1000'],
};

const FILLER_WORDS = ['the', 'and', 'with', 'that', 'this', 'from', 'have', 'make', 'flow', 'tempo', 'tune', 'cadence', 'rhythm', 'smooth', 'focus', 'typing', 'keystroke'];

/**
 * Generates a targeted training drill focused heavily on user-selected weak keys.
 */
export function generateWeakKeyDrill(targetKeys: string[], wordCount: number = 40): string {
  if (!targetKeys || targetKeys.length === 0) {
    targetKeys = ['q', 'z', 'x', 'p'];
  }

  const selectedTargetWords: string[] = [];

  targetKeys.forEach((key) => {
    const lowerKey = key.toLowerCase();
    const specificList = VOCABULARY_BY_KEY[lowerKey];
    if (specificList) {
      selectedTargetWords.push(...specificList);
    } else {
      // Generate synthetic tri-grams for any arbitrary char
      selectedTargetWords.push(
        `${lowerKey}a${lowerKey}`,
        `in${lowerKey}`,
        `${lowerKey}el`,
        `re${lowerKey}`,
        `${lowerKey}or`,
        `un${lowerKey}`
      );
    }
  });

  const resultWords: string[] = [];

  for (let i = 0; i < wordCount; i++) {
    // 70% chance of a target word, 30% rhythm glue word
    if (Math.random() < 0.72 && selectedTargetWords.length > 0) {
      const w = selectedTargetWords[Math.floor(Math.random() * selectedTargetWords.length)];
      resultWords.push(w);
    } else {
      const filler = FILLER_WORDS[Math.floor(Math.random() * FILLER_WORDS.length)];
      resultWords.push(filler);
    }
  }

  return resultWords.join(' ');
}

// Arcade Falling Words Library
export const ARCADE_WORD_POOLS = {
  easy: [
    'cat', 'dog', 'sun', 'sky', 'run', 'joy', 'sea', 'art', 'cup', 'gem',
    'zen', 'tea', 'box', 'fly', 'hop', 'note', 'tune', 'song', 'keys', 'beat',
    'glow', 'flow', 'play', 'calm', 'vibe', 'pure', 'wave', 'warm', 'star', 'harp'
  ],
  medium: [
    'melody', 'rhythm', 'piano', 'chords', 'octave', 'tempo', 'scales', 'harmony',
    'bright', 'serene', 'velvet', 'crystal', 'breeze', 'galaxy', 'silent', 'portal',
    'keyboard', 'cadence', 'acoustic', 'dynamic', 'vibrant', 'balance', 'journey', 'matrix'
  ],
  hard: [
    'symphony', 'polyphony', 'arpeggio', 'crescendo', 'vibrations', 'resonance',
    'synthesizer', 'metronome', 'fingering', 'mechanical', 'trilliums', 'atmosphere',
    'frequency', 'harmonious', 'composition', 'dexterity', 'equilibrium', 'connoisseur'
  ],
};

// RPG Boss Battle Definitions
export interface BossDefinition {
  id: string;
  name: string;
  title: string;
  element: 'fire' | 'ice' | 'electric' | 'void';
  avatar: string;
  maxHp: number;
  attackIntervalSec: number;
  attackDmg: number;
  description: string;
  spells: string[];
}

export const RPG_BOSSES: BossDefinition[] = [
  {
    id: 'pyro-drake',
    name: 'Ignis the Flame Drake',
    title: 'Stage 1 — Dragon of Cinder',
    element: 'fire',
    avatar: '🐉',
    maxHp: 450,
    attackIntervalSec: 5.5,
    attackDmg: 18,
    description: 'Breathes scorching firestorms. Type quickly before his breath charge fills up!',
    spells: [
      'fireball', 'ignite', 'ember', 'volcano', 'blaze', 'inferno', 'scorcher',
      'magma', 'heatwave', 'pyroclasm', 'combustion', 'cinder', 'flamestrike',
      'sunburst', 'conflagration', 'wildfire'
    ],
  },
  {
    id: 'frost-golem',
    name: 'Frostbite Colossus',
    title: 'Stage 2 — Glacial Guardian',
    element: 'ice',
    avatar: '❄️',
    maxHp: 750,
    attackIntervalSec: 4.8,
    attackDmg: 24,
    description: 'Armored in crystalline permafrost. High precision required to shatter his ice shield!',
    spells: [
      'blizzard', 'shiver', 'permafrost', 'avalanche', 'glacial', 'subzero',
      'icicle', 'frostbite', 'crystallize', 'hailstorm', 'cryogenic', 'coldfront',
      'zeroKelvin', 'icebreaker', 'frozenHeart'
    ],
  },
  {
    id: 'cyber-wyrm',
    name: 'Nexus Overcharge Wyrm',
    title: 'Stage 3 — Electric Matrix Leviathan',
    element: 'electric',
    avatar: '⚡',
    maxHp: 1050,
    attackIntervalSec: 4.2,
    attackDmg: 30,
    description: 'Supercharged with pure gigawatts. Demands fast reflex combos and typing cadence.',
    spells: [
      'thunderbolt', 'overdrive', 'gigawatt', 'ionstorm', 'supercharge', 'highVoltage',
      'circuitBreaker', 'electrocute', 'quantumPulse', 'hyperdrive', 'plasmaBeam',
      'synapseSurge', 'nanowave', 'shockwave'
    ],
  },
  {
    id: 'syntax-overlord',
    name: 'The Void Syntax Overlord',
    title: 'Final Boss — Glitch of Eternity',
    element: 'void',
    avatar: '👑',
    maxHp: 1600,
    attackIntervalSec: 3.6,
    attackDmg: 38,
    description: 'Corrupts spacetime with syntax errors and memory leaks. The ultimate typing test!',
    spells: [
      'asyncAwait', 'segmentationFault', 'nullPointerException', 'memoryLeak', 'infiniteLoop',
      'stackOverflow', 'garbageCollector', 'deadlockResolver', 'quantumEncryption',
      'binaryDecompiler', 'kernelPanic', 'neuralSingularity', 'abstractSyntaxTree'
    ],
  },
];

