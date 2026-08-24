// Socratic AI Journalism Coach Engine

export interface CoachEvaluation {
  overallScore: number; // 0 - 100
  invertedPyramidScore: number;
  objectivityScore: number;
  headlineScore: number;
  leadFeedback: string;
  structuralStrengths: string[];
  growthOpportunities: string[];
  probingQuestions: string[];
  flaggedSubjectiveWords: string[];
}

export interface CoachHint {
  level: 1 | 2 | 3;
  levelName: 'Small Hint' | 'Strong Hint' | 'Show Example';
  text: string;
  xpPenalty: number;
}

const SUBJECTIVE_WORDS = [
  'obviously',
  'clearly',
  'terrible',
  'horrible',
  'incredible',
  'amazing',
  'shocking',
  'ridiculous',
  'everyone knows',
  'without a doubt',
  'unquestionably',
  'foolish',
  'genius',
  'best ever',
  'worst ever',
];

const CLICKBAIT_PATTERNS = [
  /you won'?t believe/i,
  /shocking truth/i,
  /this one trick/i,
  /what happened next/i,
  /blow your mind/i,
  /will make you cry/i,
  /doctors hate/i,
  /secret revealed/i,
];

export function analyzeArticleWithCoach(
  headline: string,
  leadParagraph: string,
  bodyParagraphs: string[],
  quotesCount: number
): CoachEvaluation {
  const fullText = `${headline} ${leadParagraph} ${bodyParagraphs.join(' ')}`.toLowerCase();

  // 1. Inverted Pyramid Analysis (5 Ws in lead)
  const hasWho = /\b(dr\.|chief|principal|student|students|team|board|mayor|police|officials|scientists)\b/i.test(leadParagraph);
  const hasWhat = /\b(flood|flooding|won|announced|launched|investigated|approved|closed|opened|discovered|canceled)\b/i.test(leadParagraph);
  const hasWhen = /\b(morning|today|yesterday|monday|tuesday|wednesday|thursday|friday|saturday|sunday|am|pm|at \d+)\b/i.test(leadParagraph);
  const hasWhere = /\b(at|in|near|river valley|school|campus|hallway|library|center|field|room)\b/i.test(leadParagraph);
  const hasWhyHow = /\b(because|after|following|due to|when|as a result|by)\b/i.test(leadParagraph);

  let fiveWsCount = 0;
  if (hasWho) fiveWsCount++;
  if (hasWhat) fiveWsCount++;
  if (hasWhen) fiveWsCount++;
  if (hasWhere) fiveWsCount++;
  if (hasWhyHow) fiveWsCount++;

  const invertedPyramidScore = Math.min(100, Math.round((fiveWsCount / 5) * 60 + (quotesCount >= 2 ? 25 : quotesCount * 12) + (bodyParagraphs.length >= 2 ? 15 : 5)));

  // 2. Fact vs Opinion & Objectivity
  const flaggedSubjectiveWords: string[] = [];
  SUBJECTIVE_WORDS.forEach((word) => {
    if (fullText.includes(word)) {
      flaggedSubjectiveWords.push(word);
    }
  });

  const objectivityScore = Math.max(30, 100 - flaggedSubjectiveWords.length * 15);

  // 3. Headline Evaluation
  const wordCount = headline.trim().split(/\s+/).filter(Boolean).length;
  let headlineScore = 80;

  if (wordCount < 4) headlineScore -= 25;
  if (wordCount > 14) headlineScore -= 15;
  if (/[!?]{2,}/.test(headline)) headlineScore -= 20; // exclamation marks
  if (headline === headline.toUpperCase() && headline.length > 10) headlineScore -= 15; // ALL CAPS

  // Clickbait detection
  CLICKBAIT_PATTERNS.forEach((pattern) => {
    if (pattern.test(headline)) {
      headlineScore -= 30;
    }
  });

  headlineScore = Math.max(10, Math.min(100, headlineScore));

  // Probing Socratic Questions & Feedback
  const probingQuestions: string[] = [];
  const structuralStrengths: string[] = [];
  const growthOpportunities: string[] = [];

  if (fiveWsCount >= 4) {
    structuralStrengths.push('Strong journalistic lead establishing Who, What, Where, and When upfront.');
  } else {
    growthOpportunities.push('Your lead paragraph needs clearer answers to Who was involved or Why it happened.');
    probingQuestions.push('If a busy reader only reads your first sentence, will they understand the core event?');
  }

  if (quotesCount >= 2) {
    structuralStrengths.push('Well-sourced article with balanced direct eyewitness and authority quotes.');
  } else if (quotesCount === 1) {
    growthOpportunities.push('Consider adding a second perspective (e.g. an eyewitness or expert) to balance your single quote.');
    probingQuestions.push('Who else was affected by this event whose voice could add emotional or technical weight?');
  } else {
    growthOpportunities.push('Missing quotes: Articles without sources read like personal essays rather than news reporting.');
    probingQuestions.push('What primary source or official can you interview to verify these key claims?');
  }

  if (flaggedSubjectiveWords.length > 0) {
    growthOpportunities.push(`Detected subjective wording: "${flaggedSubjectiveWords.slice(0, 3).join('", "')}". Replace with verified facts or attribute to a speaker.`);
    probingQuestions.push('Is that statement a verifiable fact, or your personal impression? How could you rephrase it neutrally?');
  } else {
    structuralStrengths.push('Maintains an objective, neutral journalistic tone without loaded language.');
  }

  if (probingQuestions.length === 0) {
    probingQuestions.push('What are the long-term implications of this story for your community next week?');
  }

  const overallScore = Math.round(invertedPyramidScore * 0.4 + objectivityScore * 0.3 + headlineScore * 0.3);

  let leadFeedback = 'Solid reporting draft. Ready for final copy-editing.';
  if (overallScore < 60) {
    leadFeedback = 'Needs work on core journalistic foundations (sourcing, lead sentence, and neutral phrasing).';
  } else if (overallScore < 85) {
    leadFeedback = 'Good reporting! Refine your headline and balance your sources to make it publication-ready.';
  } else {
    leadFeedback = 'Outstanding front-page material! Strong inverted pyramid structure and crisp attribution.';
  }

  return {
    overallScore,
    invertedPyramidScore,
    objectivityScore,
    headlineScore,
    leadFeedback,
    structuralStrengths,
    growthOpportunities,
    probingQuestions,
    flaggedSubjectiveWords,
  };
}

export function getTieredHints(challengeType: string): CoachHint[] {
  switch (challengeType) {
    case 'breaking_news':
      return [
        {
          level: 1,
          levelName: 'Small Hint',
          text: 'Focus on the "Who" and "What" first. Tell the reader what happened in the very first 15 words.',
          xpPenalty: 5,
        },
        {
          level: 2,
          levelName: 'Strong Hint',
          text: 'Include the Fire Chief’s quote confirming zero injuries immediately after the lead to debunk viral panic rumors.',
          xpPenalty: 15,
        },
        {
          level: 3,
          levelName: 'Show Example',
          text: 'Example Lead: "River Valley High transitioned 1,200 students to remote instruction early Monday after torrential flash floods submerged the cafeteria basement."',
          xpPenalty: 30,
        },
      ];
    case 'investigative_board':
      return [
        {
          level: 1,
          levelName: 'Small Hint',
          text: 'Check Rule 4.2 in the fair guidelines and compare the timestamp of the commit logs.',
          xpPenalty: 5,
        },
        {
          level: 2,
          levelName: 'Strong Hint',
          text: 'The Git repository reveals neural network weights downloaded from HeliOS Corp server before the contest began.',
          xpPenalty: 15,
        },
        {
          level: 3,
          levelName: 'Show Example',
          text: 'Example Attribution: "An audit conducted by Chief Judge Dr. Elena Rostova confirmed that 85% of the codebase was derived from proprietary commercial architecture."',
          xpPenalty: 30,
        },
      ];
    default:
      return [
        {
          level: 1,
          levelName: 'Small Hint',
          text: 'Ensure your lead paragraph follows the Inverted Pyramid: most important facts first.',
          xpPenalty: 5,
        },
        {
          level: 2,
          levelName: 'Strong Hint',
          text: 'Attribute every major factual claim to a verified source or official report.',
          xpPenalty: 15,
        },
        {
          level: 3,
          levelName: 'Show Example',
          text: 'Example Format: [Headline: Action Verb] -> [Lead: 5 Ws] -> [Authority Quote] -> [Context & Next Steps].',
          xpPenalty: 30,
        },
      ];
  }
}
