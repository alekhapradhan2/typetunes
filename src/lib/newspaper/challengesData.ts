import {
  Badge,
  NewsScenarioChallenge,
  CompetitionEvent,
  MiniGameMeta,
} from './types';

export const ALL_BADGES: Badge[] = [
  {
    id: 'first_story',
    name: 'First Scoop',
    description: 'Wrote and filed your very first newspaper article.',
    icon: '📝',
    category: 'reporting',
    xpReward: 100,
  },
  {
    id: 'headline_master',
    name: 'Headline Master',
    description: 'Crafted 5 high-impact, non-clickbait front page headlines.',
    icon: '⚡',
    category: 'editing',
    xpReward: 150,
  },
  {
    id: 'fact_checker',
    name: 'Truth Hound',
    description: 'Successfully verified 10 complex claims with 100% accuracy.',
    icon: '🔍',
    category: 'fact_checking',
    xpReward: 200,
  },
  {
    id: 'interview_expert',
    name: 'Master Inquirer',
    description: 'Conducted a full investigative interview unlocking key quotes.',
    icon: '🎙️',
    category: 'reporting',
    xpReward: 175,
  },
  {
    id: 'breaking_news_pro',
    name: 'Breaking News Anchor',
    description: 'Published a rapidly developing breaking news alert before deadline.',
    icon: '🚨',
    category: 'reporting',
    xpReward: 250,
  },
  {
    id: 'ethical_journalist',
    name: 'Guardian of Ethics',
    description: 'Resolved 3 complex ethical dilemmas upholding the SPJ Code of Ethics.',
    icon: '⚖️',
    category: 'ethics',
    xpReward: 220,
  },
  {
    id: 'design_master',
    name: 'Broadsheet Architect',
    description: 'Designed a complete 3-page layout with balanced visual hierarchy.',
    icon: '📰',
    category: 'design',
    xpReward: 300,
  },
  {
    id: 'investigative_mind',
    name: 'Watergate Prodigy',
    description: 'Connected 5 clues on the investigative evidence board to expose a story.',
    icon: '🕵️',
    category: 'reporting',
    xpReward: 350,
  },
  {
    id: '7_day_streak',
    name: 'Daily Press Cadence',
    description: 'Logged into the newsroom 7 days in a row.',
    icon: '🔥',
    category: 'streak',
    xpReward: 200,
  },
  {
    id: 'newspaper_publisher',
    name: 'Editor-in-Chief',
    description: 'Published a full school or community newspaper edition.',
    icon: '👑',
    category: 'editing',
    xpReward: 500,
  },
];

export const MINI_GAMES_CATALOG: MiniGameMeta[] = [
  {
    id: 'headline_rush',
    name: 'Headline Rush',
    icon: '⚡',
    description: 'Write punchy, accurate 6-10 word headlines under a 45-second timer.',
    skillFocus: 'Conciseness, Active Voice, News Value',
    durationSeconds: 45,
  },
  {
    id: 'spot_the_fake',
    name: 'Spot the Fake',
    icon: '🕵️',
    description: 'Identify manipulated photos, out-of-context quotes, and synthetic disinformation.',
    skillFocus: 'Source Verification & Digital Forensics',
    durationSeconds: 60,
  },
  {
    id: 'newsroom_rush',
    name: 'Newsroom Rush',
    icon: '⏰',
    description: 'Triage incoming police scanners, press leaks, and editor demands under pressure.',
    skillFocus: 'Editorial Triage & Time Management',
    durationSeconds: 60,
  },
  {
    id: 'fact_or_opinion',
    name: 'Fact or Opinion',
    icon: '⚖️',
    description: 'Classify fast-firing statements as verifiable facts, subjective opinions, or sponsored claims.',
    skillFocus: 'Objective Reporting & Critical Thinking',
    durationSeconds: 40,
  },
  {
    id: 'source_hunter',
    name: 'Source Hunter',
    icon: '🎯',
    description: 'Connect breaking event leads to the most credible primary sources on the scene.',
    skillFocus: 'Source Cultivation & Credibility Audit',
    durationSeconds: 50,
  },
  {
    id: 'layout_puzzle',
    name: 'Layout Puzzle',
    icon: '🧩',
    description: 'Arrange lead articles, pull quotes, halftone photos, and weather widgets into balanced grids.',
    skillFocus: 'Visual Hierarchy & Newspaper Composition',
    durationSeconds: 90,
  },
  {
    id: 'breaking_news_timer',
    name: 'Breaking News Timer',
    icon: '🚨',
    description: 'Update and rewrite lead paragraphs as conflicting eyewitness reports flood the wire.',
    skillFocus: 'Real-Time Fact Updating & News Flow',
    durationSeconds: 75,
  },
];

export const NEWS_CHALLENGES: NewsScenarioChallenge[] = [
  {
    id: 'storm_flooding_2026',
    title: 'Flash Flood Shuts Down River Valley High',
    category: 'breaking_news',
    difficulty: 'Beginner',
    xpReward: 150,
    coinsReward: 50,
    estimatedMinutes: 8,
    recommendedArticleType: 'Breaking News',
    briefing:
      'At 7:15 AM, heavy torrential rains overwhelmed the Willow Creek culvert, flooding the school parking lot and basement cafeteria. Over 1,200 students are redirected to remote assembly. You have 15 minutes to gather the facts, interview the Fire Chief and Principal, verify claims, and publish the lead morning bulletin.',
    breakingNewsFeed: [
      { timestamp: '07:15 AM', updateText: 'Police dispatch reports 3 feet of standing water on Valley Road.', isReliable: true },
      { timestamp: '07:22 AM', updateText: 'Social media rumor claims all school exams are canceled for the month.', isReliable: false },
      { timestamp: '07:35 AM', updateText: 'Fire Dept confirms zero injuries; auxiliary pumps deployed.', isReliable: true },
      { timestamp: '07:48 AM', updateText: 'School District announces synchronous remote classes begin at 9:30 AM.', isReliable: true },
    ],
    sources: [
      {
        id: 'fire_chief_davis',
        name: 'Chief Robert Davis',
        role: 'Valley Fire & Rescue Incident Commander',
        avatar: '🚒',
        credibilityScore: 98,
        bio: '24 years in emergency management. Coordinated the Willow Creek drainage response.',
        dialogueTree: [
          {
            questionId: 'q1',
            questionText: 'Chief Davis, was anyone injured during the basement flooding?',
            answerText:
              'No students or staff were injured. Custodial staff evacuated the basement cafeteria promptly before water breached the electrical substation.',
            isKeyQuote: true,
            attitude: 'cooperative',
          },
          {
            questionId: 'q2',
            questionText: 'What caused the culvert to overflow so rapidly?',
            answerText:
              'We recorded 3.4 inches of rainfall in under 90 minutes. Debris from upstream construction clogged the primary drainage grates.',
            unlockedClue: 'Construction debris upstream blocked drainage grate.',
            attitude: 'cooperative',
          },
          {
            questionId: 'q3',
            questionText: 'Are rumors of structural foundation collapse true?',
            answerText:
              'Categorically false. Our structural engineers inspected the pilings; the building is sound, only cosmetic drywall and carpet soaked.',
            attitude: 'neutral',
          },
        ],
      },
      {
        id: 'principal_vance',
        name: 'Dr. Marcus Vance',
        role: 'Principal, River Valley High',
        avatar: '👨‍🏫',
        credibilityScore: 95,
        bio: 'Principal of River Valley High for 8 years.',
        dialogueTree: [
          {
            questionId: 'q4',
            questionText: 'Dr. Vance, how will students continue their curriculum today?',
            answerText:
              'We have activated our emergency remote schedule starting at 9:30 AM. Attendance will be taken via Google Classroom portals.',
            isKeyQuote: true,
            attitude: 'cooperative',
          },
          {
            questionId: 'q5',
            questionText: 'When will the campus reopen for in-person classes?',
            answerText:
              'Crews are vacuuming water now. We anticipate full reopening by Thursday morning pending electrical safety sign-offs.',
            attitude: 'cooperative',
          },
        ],
      },
    ],
    claimsToVerify: [
      {
        id: 'c1',
        statement: 'The school basement collapsed and caused 4 student hospitalizations.',
        sourceOrigin: 'Anonymous TikTok Post with 14k views',
        evidenceClues: ['Chief Davis confirmed zero injuries', 'Hospital logs show zero flood-related admissions'],
        correctVerdict: 'false',
        explanation: 'Eyewitness emergency responders and hospital records confirm no injuries occurred.',
      },
      {
        id: 'c2',
        statement: '3.4 inches of rainfall fell in 90 minutes, overwhelming drainage.',
        sourceOrigin: 'National Weather Service Valley Station',
        evidenceClues: ['Official rain gauge log 3.42 in', 'Fire dispatch records'],
        correctVerdict: 'true',
        explanation: 'Meteorological records confirm unprecedented micro-burst precipitation.',
      },
      {
        id: 'c3',
        statement: 'School will be permanently closed for the entire academic semester.',
        sourceOrigin: 'Student Group Chat screenshot',
        evidenceClues: ['Principal Vance announcement for Thursday reopening', 'District email confirmation'],
        correctVerdict: 'false',
        explanation: 'District announced an anticipated reopening within 48 hours.',
      },
    ],
    ethicsDilemma: {
      id: 'ed1',
      title: 'Publishing Distressed Student Photos',
      situation:
        'A student photographer submitted a photo of an upset 9th grader crying beside her flooded locker in the basement hallway. It conveys intense emotion, but she was not asked for consent.',
      stakeholders: ['The distressed student', 'School readership', 'Student photographer', 'Editorial ethics board'],
      options: [
        {
          id: 'opt1',
          actionText: 'Publish the photo on the front page as the lead image because it captures raw emotion.',
          consequence: 'The student feels humiliated by school-wide virality, violating privacy principles.',
          ethicalEvaluation: 'Fails to minimize harm. Vulnerable minors deserve privacy during distressing events.',
          score: 30,
        },
        {
          id: 'opt2',
          actionText: 'Use a wide-angle photo of the flooded parking lot and emergency pump crews instead.',
          consequence: 'Accurately documents the disaster scope without sensationalizing personal distress.',
          ethicalEvaluation: 'Balances news value with empathy and harm minimization.',
          score: 100,
        },
        {
          id: 'opt3',
          actionText: 'Post the photo on social media with a humorous caption to drive engagement.',
          consequence: 'Severe backlash from teachers and parents for cyberbullying and callousness.',
          ethicalEvaluation: 'Gross violation of journalistic integrity.',
          score: 10,
        },
      ],
    },
    targetHeadlinePrompt: 'Write an active, informative 6-10 word headline capturing the flood and schedule shift.',
  },
  {
    id: 'ai_robotics_fair_scandal',
    title: 'The AI Science Fair Algorithm Controversy',
    category: 'investigative_board',
    difficulty: 'Intermediate',
    xpReward: 250,
    coinsReward: 90,
    estimatedMinutes: 12,
    recommendedArticleType: 'Investigative',
    briefing:
      'The Grand Prize in the State STEM Fair was awarded to an autonomous solar tracking algorithm. But whistleblower emails suggest the winner used commercial proprietary code from their parent’s tech company without attribution. Trace the code commits, interview the judges, and uncover the truth.',
    sources: [
      {
        id: 'dr_elena_vance',
        name: 'Dr. Elena Rostova',
        role: 'Chief Judge & MIT AI Researcher',
        avatar: '🔬',
        credibilityScore: 96,
        bio: 'Independent algorithmic auditor and university robotics professor.',
        dialogueTree: [
          {
            questionId: 'q6',
            questionText: 'Dr. Rostova, did the judging panel check the Git repository history?',
            answerText:
              'We initially reviewed the live hardware demonstration. Following your inquiry, we examined the repo and found 85% of the neural weights were trained on proprietary HeliOS architecture.',
            isKeyQuote: true,
            attitude: 'cooperative',
          },
          {
            questionId: 'q7',
            questionText: 'What are the rules regarding commercial code libraries?',
            answerText:
              'Rule 4.2 strictly mandates all competitive algorithmic logic must be student-authored. Pre-existing frameworks must be disclosed in the initial bibliography.',
            unlockedClue: 'Rule 4.2 requires explicit attribution of external frameworks.',
            attitude: 'neutral',
          },
        ],
      },
    ],
    claimsToVerify: [
      {
        id: 'c4',
        statement: 'The solar project author created all 12,000 lines of tensor math from scratch.',
        sourceOrigin: 'Project Summary Poster Board',
        evidenceClues: ['Git commit logs show commit from HeliOS Corp server', 'Dr. Rostova audit statement'],
        correctVerdict: 'false',
        explanation: 'Audits revealed commercial code was utilized without disclosure.',
      },
    ],
  },
  {
    id: 'school_lunch_nutrition_probe',
    title: 'Mystery Meat or Organic Treat? School Food Audit',
    category: 'fact_check',
    difficulty: 'Intermediate',
    xpReward: 200,
    coinsReward: 70,
    estimatedMinutes: 10,
    recommendedArticleType: 'Feature',
    briefing:
      'School district cafeteria menus promised 100% locally-sourced farm vegetables and fresh antibiotic-free proteins. Student reporters inspected delivery pallets and vendor invoices to discover the truth.',
  },
];

export const COMPETITIONS_DATA: CompetitionEvent[] = [
  {
    id: 'global_press_cup_2026',
    title: '2026 Global Student Broadsheet Championship',
    scope: 'global',
    description:
      'Over 400 school newsrooms compete to produce a 4-page investigative newspaper covering Climate Tech, Ethics, and Youth Sports.',
    startDate: '2026-08-01',
    endDate: '2026-08-31',
    participantsCount: 428,
    firstPlacePrize: 'Gold Press Plaque & 1,500 XP',
    scenarioTheme: 'Green City Innovation & Urban Rewilding',
    leaderboard: [
      { rank: 1, name: 'Northgate High Chronicle', school: 'Northgate Secondary', score: 985, avatar: '🦅' },
      { rank: 2, name: 'The Bayview Herald', school: 'Bayview Collegiate', score: 960, avatar: '🌊' },
      { rank: 3, name: 'Metro Tech Gazette', school: 'Metro Academy', score: 945, avatar: '🚀' },
      { rank: 4, name: 'Horizon High Times', school: 'Horizon School', score: 920, avatar: '🌅' },
      { rank: 5, name: 'Valley Voice', school: 'River Valley High', score: 905, avatar: '🌲' },
    ],
  },
  {
    id: 'school_intramural_cup',
    title: 'Inter-House Front Page Sprint',
    scope: 'school',
    description: 'Classroom journalism houses compete to design the fastest, most accurate breaking news cover.',
    startDate: '2026-08-20',
    endDate: '2026-08-28',
    participantsCount: 64,
    firstPlacePrize: 'House Trophy & 500 XP',
    scenarioTheme: 'Campus Athletics & Science Fair',
    leaderboard: [
      { rank: 1, name: 'Team Pulitzer', school: 'Room 302', score: 490, avatar: '📰' },
      { rank: 2, name: 'The Gutenberg Guild', school: 'Room 304', score: 475, avatar: '🖨️' },
      { rank: 3, name: 'Fleet Street Club', school: 'Room 301', score: 440, avatar: '⚡' },
    ],
  },
];
