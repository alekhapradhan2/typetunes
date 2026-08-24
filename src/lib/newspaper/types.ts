// Core TypeScript definitions for Newspaper Studio Educational Platform

export type UserRole = 'student' | 'teacher' | 'school_admin' | 'super_admin';

export type JournalismRank =
  | 'Rookie Reporter'
  | 'Junior Journalist'
  | 'Staff Reporter'
  | 'Senior Reporter'
  | 'Investigative Journalist'
  | 'News Editor'
  | 'Editor-in-Chief';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'reporting' | 'editing' | 'fact_checking' | 'design' | 'ethics' | 'streak';
  xpReward: number;
  unlockedAt?: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  avatar: string;
  school: string;
  grade: string;
  location: string;
  bio: string;
  role: UserRole;
  rank: JournalismRank;
  xp: number;
  level: number;
  streakDays: number;
  badges: string[]; // Badge IDs
  articlesWritten: number;
  newspapersPublished: number;
  challengesCompleted: number;
  factsChecked: number;
  interviewsCompleted: number;
  portfolioVisibility: 'public' | 'school' | 'private';
}

// ─── Article & Newspaper Models ──────────────────────────────────────────────

export type ArticleCategory =
  | 'Breaking News'
  | 'Feature'
  | 'Interview'
  | 'Opinion & Editorial'
  | 'Investigative'
  | 'Sports'
  | 'Science & Tech'
  | 'Arts & Culture'
  | 'Environment';

export interface ArticleDraft {
  id: string;
  title: string;
  subtitle?: string;
  author: string;
  category: ArticleCategory;
  dateline: string;
  leadParagraph: string;
  bodyParagraphs: string[];
  quotes: { speaker: string; title: string; quote: string }[];
  sources: string[];
  imageCaption?: string;
  imageUrl?: string;
  imageFilter?: 'none' | 'filter-halftone' | 'filter-sepia-vintage' | 'filter-bw-contrast';
  wordCount: number;
  status: 'draft' | 'in_review' | 'approved' | 'published';
  createdAt: string;
  updatedAt: string;
  aiFeedbackScore?: number;
  aiSuggestions?: string[];
}

export interface NewspaperPageSection {
  id: string;
  type: 'lead_article' | 'secondary_article' | 'column' | 'photo_feature' | 'pull_quote' | 'ad_box' | 'weather_widget' | 'crossword_box';
  title: string;
  content: string;
  author?: string;
  imageUrl?: string;
  imageFilter?: string;
  columnSpan: 1 | 2 | 3 | 4;
  rowSpan?: number;
}

export interface NewspaperDocument {
  id: string;
  title: string;
  tagline: string;
  mastheadStyle: 'classic_broadsheet' | 'gothic_vintage' | 'modern_bold' | 'tabloid_express' | 'cyber_herald';
  paperTexture: 'paper-newsprint' | 'paper-aged' | 'paper-sepia' | 'paper-clean' | 'paper-noir';
  editionNumber: string;
  dateString: string;
  location: string;
  price: string;
  volumeNumber: string;
  authorName: string;
  schoolName: string;
  pages: {
    pageNumber: number;
    pageTitle: string;
    sections: NewspaperPageSection[];
  }[];
  status: 'draft' | 'published';
  score?: number;
  teacherFeedback?: {
    teacherName: string;
    score: number;
    comments: string;
    gradedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

// ─── Interactive Newsroom Simulation & Challenges ────────────────────────────

export type ChallengeCategory =
  | 'breaking_news'
  | 'fake_news_detective'
  | 'headline_rush'
  | 'source_interview'
  | 'fact_check'
  | 'ethics_dilemma'
  | 'front_page_judgment'
  | 'investigative_board';

export type ChallengeDifficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface VirtualSource {
  id: string;
  name: string;
  role: string;
  avatar: string;
  credibilityScore: number; // 0-100
  bio: string;
  dialogueTree: {
    questionId: string;
    questionText: string;
    answerText: string;
    unlockedClue?: string;
    isKeyQuote?: boolean;
    attitude?: 'cooperative' | 'defensive' | 'neutral' | 'skeptical';
  }[];
}

export interface FactCheckClaim {
  id: string;
  statement: string;
  sourceOrigin: string;
  evidenceClues: string[];
  correctVerdict: 'true' | 'false' | 'misleading' | 'unverified';
  explanation: string;
}

export interface EthicsDilemmaScenario {
  id: string;
  title: string;
  situation: string;
  stakeholders: string[];
  options: {
    id: string;
    actionText: string;
    consequence: string;
    ethicalEvaluation: string;
    score: number;
  }[];
}

export interface NewsScenarioChallenge {
  id: string;
  title: string;
  category: ChallengeCategory;
  difficulty: ChallengeDifficulty;
  xpReward: number;
  coinsReward: number;
  estimatedMinutes: number;
  briefing: string;
  breakingNewsFeed?: { timestamp: string; updateText: string; isReliable: boolean }[];
  sources?: VirtualSource[];
  claimsToVerify?: FactCheckClaim[];
  ethicsDilemma?: EthicsDilemmaScenario;
  targetHeadlinePrompt?: string;
  recommendedArticleType: ArticleCategory;
}

// ─── Mini-Games ──────────────────────────────────────────────────────────────

export type MiniGameId =
  | 'headline_rush'
  | 'spot_the_fake'
  | 'newsroom_rush'
  | 'fact_or_opinion'
  | 'source_hunter'
  | 'layout_puzzle'
  | 'breaking_news_timer';

export interface MiniGameMeta {
  id: MiniGameId;
  name: string;
  icon: string;
  description: string;
  skillFocus: string;
  durationSeconds: number;
}

// ─── Collaborative Newsroom & Kanban ─────────────────────────────────────────

export type KanbanStatus =
  | 'ideas'
  | 'researching'
  | 'writing'
  | 'editing'
  | 'fact_checking'
  | 'layout_design'
  | 'ready_to_publish';

export interface KanbanStoryCard {
  id: string;
  title: string;
  category: ArticleCategory;
  assignedReporter: string;
  assignedReporterAvatar: string;
  status: KanbanStatus;
  priority: 'low' | 'medium' | 'high' | 'breaking';
  notesCount: number;
  dueDate: string;
}

// ─── Teacher & Classroom ─────────────────────────────────────────────────────

export interface ClassroomAssignment {
  id: string;
  classroomId: string;
  title: string;
  description: string;
  assignmentType: 'full_newspaper' | 'article_writing' | 'fact_check' | 'challenge';
  targetChallengeId?: string;
  dueDate: string;
  submissionsCount: number;
  maxScore: number;
  rubricCriteria: { criterion: string; weight: number; description: string }[];
}

export interface StudentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  newspaperTitle: string;
  submittedAt: string;
  status: 'submitted' | 'graded' | 'revision_requested';
  score?: number;
  annotations?: { paragraphIndex: number; comment: string; type: 'praise' | 'critique' | 'correction' }[];
  feedbackNotes?: string;
}

// ─── Competitions ────────────────────────────────────────────────────────────

export interface CompetitionEvent {
  id: string;
  title: string;
  scope: 'global' | 'school' | 'classroom';
  description: string;
  startDate: string;
  endDate: string;
  participantsCount: number;
  firstPlacePrize: string;
  scenarioTheme: string;
  leaderboard: { rank: number; name: string; school: string; score: number; avatar: string }[];
}
