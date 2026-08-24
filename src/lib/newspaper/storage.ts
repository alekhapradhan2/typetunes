// Local and Mock API Persistence Manager for Newspaper Studio

import {
  StudentProfile,
  NewspaperDocument,
  ArticleDraft,
  KanbanStoryCard,
  ClassroomAssignment,
  StudentSubmission,
  UserRole,
  JournalismRank,
} from './types';

const STORAGE_KEYS = {
  PROFILE: 'typetunes_newsroom_profile_v1',
  NEWSPAPERS: 'typetunes_newsroom_newspapers_v1',
  ARTICLES: 'typetunes_newsroom_articles_v1',
  KANBAN: 'typetunes_newsroom_kanban_v1',
  ASSIGNMENTS: 'typetunes_newsroom_assignments_v1',
  SUBMISSIONS: 'typetunes_newsroom_submissions_v1',
  GAME_SCORES: 'typetunes_newsroom_game_scores_v1',
  ACTIVE_ROLE: 'typetunes_newsroom_role_v1',
};

export const INITIAL_STUDENT_PROFILE: StudentProfile = {
  id: 'student_alex_01',
  name: 'Alex Rivera',
  avatar: '👩‍💻',
  school: 'River Valley High',
  grade: '10th Grade',
  location: 'Seattle, WA',
  bio: 'Investigative reporter and lead designer for the Valley Voice. Passionate about climate tech & school policy.',
  role: 'student',
  rank: 'Senior Reporter',
  xp: 1450,
  level: 5,
  streakDays: 4,
  badges: ['first_story', 'headline_master', 'fact_checker', 'interview_expert'],
  articlesWritten: 8,
  newspapersPublished: 3,
  challengesCompleted: 6,
  factsChecked: 18,
  interviewsCompleted: 9,
  portfolioVisibility: 'public',
};

export const INITIAL_NEWSPAPERS: NewspaperDocument[] = [
  {
    id: 'paper_flood_edition_01',
    title: 'THE VALLEY HERALD',
    tagline: 'The Independent Voice of River Valley Since 1994',
    mastheadStyle: 'classic_broadsheet',
    paperTexture: 'paper-newsprint',
    editionNumber: 'Vol. XXXII · No. 42',
    dateString: 'Monday, August 24, 2026',
    location: 'River Valley District',
    price: 'Free · Student Edition',
    volumeNumber: 'Issue 14',
    authorName: 'Alex Rivera',
    schoolName: 'River Valley High',
    pages: [
      {
        pageNumber: 1,
        pageTitle: 'Front Page',
        sections: [
          {
            id: 'sec_1',
            type: 'lead_article',
            title: 'Flash Flood Submerges Cafeteria; Remote Classes Activated',
            content:
              'Torrential morning rains overwhelmed River Valley High’s primary culvert at 7:15 AM today, sending three feet of standing water into the lower basement cafeteria. School district officials and local emergency responders promptly evacuated the building with zero reported injuries.\n\n"Our primary focus was securing electrical risers before water breached the switchboards," stated Incident Commander Chief Robert Davis. Students have transitioned to remote classrooms while vacuum pumps clear the facility.',
            author: 'Alex Rivera, Lead Reporter',
            imageUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&auto=format&fit=crop&q=80',
            imageFilter: 'filter-halftone',
            columnSpan: 3,
          },
          {
            id: 'sec_2',
            type: 'pull_quote',
            title: 'Quote of the Day',
            content: '"The building remains structurally sound; emergency pump crews are clearing the basement now." — Chief Davis',
            columnSpan: 1,
          },
          {
            id: 'sec_3',
            type: 'column',
            title: 'Campus Reopening Scheduled for Thursday',
            content: 'Principal Dr. Marcus Vance confirmed that in-person instruction will resume once electrical safety certification is finalized by district engineers.',
            columnSpan: 2,
          },
          {
            id: 'sec_4',
            type: 'weather_widget',
            title: 'Valley Weather & River Gauge',
            content: 'Current: 64°F · Rain Clearing · Willow Creek: 4.8 ft (Crest Passed) · Barometer: 29.92 inHg',
            columnSpan: 2,
          },
        ],
      },
    ],
    status: 'published',
    score: 96,
    teacherFeedback: {
      teacherName: 'Ms. Katherine Sullivan',
      score: 96,
      comments: 'Exceptional journalistic rigor, balanced sourcing from Chief Davis, and great use of halftone visual layout!',
      gradedAt: '2026-08-24T14:30:00Z',
    },
    createdAt: '2026-08-24T08:00:00Z',
    updatedAt: '2026-08-24T12:00:00Z',
  },
];

export const INITIAL_KANBAN_STORIES: KanbanStoryCard[] = [
  {
    id: 'k1',
    title: 'School Board Budget Vote on STEM Labs',
    category: 'Science & Tech',
    assignedReporter: 'Alex Rivera',
    assignedReporterAvatar: '👩‍💻',
    status: 'ideas',
    priority: 'high',
    notesCount: 4,
    dueDate: 'Aug 28',
  },
  {
    id: 'k2',
    title: 'Varsity Soccer Undefeated Streak at 12 Games',
    category: 'Sports',
    assignedReporter: 'Jordan Chen',
    assignedReporterAvatar: '⚽',
    status: 'writing',
    priority: 'medium',
    notesCount: 2,
    dueDate: 'Aug 27',
  },
  {
    id: 'k3',
    title: 'Robotics Fair Algorithm Attribution Investigation',
    category: 'Investigative',
    assignedReporter: 'Alex Rivera',
    assignedReporterAvatar: '👩‍💻',
    status: 'fact_checking',
    priority: 'breaking',
    notesCount: 7,
    dueDate: 'Aug 26',
  },
  {
    id: 'k4',
    title: 'Autumn Drama Club Production: The Crucible',
    category: 'Arts & Culture',
    assignedReporter: 'Maya Patel',
    assignedReporterAvatar: '🎭',
    status: 'editing',
    priority: 'low',
    notesCount: 3,
    dueDate: 'Aug 29',
  },
  {
    id: 'k5',
    title: 'Flash Flood Morning Coverage & Reopening Plan',
    category: 'Breaking News',
    assignedReporter: 'Alex Rivera',
    assignedReporterAvatar: '👩‍💻',
    status: 'ready_to_publish',
    priority: 'breaking',
    notesCount: 12,
    dueDate: 'Aug 24',
  },
];

export const INITIAL_ASSIGNMENTS: ClassroomAssignment[] = [
  {
    id: 'asg_01',
    classroomId: 'room_302_journalism',
    title: 'Breaking News Simulation: River Valley Flood',
    description: 'Interview emergency officials, fact-check social media claims, and write a 3-paragraph inverted pyramid story.',
    assignmentType: 'challenge',
    targetChallengeId: 'storm_flooding_2026',
    dueDate: 'Aug 28, 2026',
    submissionsCount: 24,
    maxScore: 100,
    rubricCriteria: [
      { criterion: 'Inverted Pyramid Lead (5 Ws)', weight: 30, description: 'Lead establishes essential facts in first sentence.' },
      { criterion: 'Source Attribution & Quotes', weight: 30, description: 'Includes 2+ verified quotes with correct titles.' },
      { criterion: 'Factual Accuracy & Objectivity', weight: 20, description: 'Debunks viral rumor and avoids subjective commentary.' },
      { criterion: 'Headline & Layout Design', weight: 20, description: 'Clear active headline and balanced front-page placement.' },
    ],
  },
];

export const INITIAL_SUBMISSIONS: StudentSubmission[] = [
  {
    id: 'sub_alex_01',
    assignmentId: 'asg_01',
    studentId: 'student_alex_01',
    studentName: 'Alex Rivera',
    newspaperTitle: 'The Valley Herald — Flood Special',
    submittedAt: '2026-08-24T11:45:00Z',
    status: 'graded',
    score: 96,
    feedbackNotes: 'Phenomenal interview integration and layout precision. Very proud of your editorial judgment.',
    annotations: [
      { paragraphIndex: 0, comment: 'Crisp, concise lead sentence. Perfect hook!', type: 'praise' },
      { paragraphIndex: 1, comment: 'Great job quoting Chief Davis directly.', type: 'praise' },
    ],
  },
  {
    id: 'sub_jordan_02',
    assignmentId: 'asg_01',
    studentId: 'student_jordan_02',
    studentName: 'Jordan Chen',
    newspaperTitle: 'The Daily Tiger',
    submittedAt: '2026-08-24T13:10:00Z',
    status: 'submitted',
    score: 88,
    feedbackNotes: 'Good facts, but remember to verify whether exams were canceled.',
    annotations: [
      { paragraphIndex: 2, comment: 'Need to clarify the difference between remote class and exam cancellation.', type: 'correction' },
    ],
  },
];

// ─── Storage Operations ──────────────────────────────────────────────────────

export function getStoredProfile(): StudentProfile {
  if (typeof window === 'undefined') return INITIAL_STUDENT_PROFILE;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return raw ? JSON.parse(raw) : INITIAL_STUDENT_PROFILE;
  } catch {
    return INITIAL_STUDENT_PROFILE;
  }
}

export function saveStoredProfile(profile: StudentProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.warn('[NewspaperStudio] Failed to save profile:', e);
  }
}

export function awardXPAndBadge(xpAmount: number, badgeId?: string): { newXP: number; newLevel: number; newRank: JournalismRank; badgeUnlocked?: string } {
  const profile = getStoredProfile();
  const newXP = profile.xp + xpAmount;
  const newLevel = Math.floor(newXP / 300) + 1;

  let newRank: JournalismRank = 'Rookie Reporter';
  if (newLevel >= 8) newRank = 'Editor-in-Chief';
  else if (newLevel >= 6) newRank = 'News Editor';
  else if (newLevel >= 5) newRank = 'Investigative Journalist';
  else if (newLevel >= 4) newRank = 'Senior Reporter';
  else if (newLevel >= 3) newRank = 'Staff Reporter';
  else if (newLevel >= 2) newRank = 'Junior Journalist';

  const updatedBadges = [...profile.badges];
  let badgeUnlocked: string | undefined;

  if (badgeId && !updatedBadges.includes(badgeId)) {
    updatedBadges.push(badgeId);
    badgeUnlocked = badgeId;
  }

  const updatedProfile: StudentProfile = {
    ...profile,
    xp: newXP,
    level: newLevel,
    rank: newRank,
    badges: updatedBadges,
  };

  saveStoredProfile(updatedProfile);
  return { newXP, newLevel, newRank, badgeUnlocked };
}

export function getStoredNewspapers(): NewspaperDocument[] {
  if (typeof window === 'undefined') return INITIAL_NEWSPAPERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NEWSPAPERS);
    return raw ? JSON.parse(raw) : INITIAL_NEWSPAPERS;
  } catch {
    return INITIAL_NEWSPAPERS;
  }
}

export function saveStoredNewspaper(doc: NewspaperDocument): void {
  if (typeof window === 'undefined') return;
  try {
    const all = getStoredNewspapers();
    const existingIndex = all.findIndex((p) => p.id === doc.id);
    if (existingIndex >= 0) {
      all[existingIndex] = doc;
    } else {
      all.unshift(doc);
    }
    localStorage.setItem(STORAGE_KEYS.NEWSPAPERS, JSON.stringify(all));

    // Increment profile newspaper count if newly published
    if (doc.status === 'published') {
      const profile = getStoredProfile();
      saveStoredProfile({ ...profile, newspapersPublished: all.filter((p) => p.status === 'published').length });
    }
  } catch (e) {
    console.warn('[NewspaperStudio] Failed to save newspaper:', e);
  }
}

export function getStoredKanban(): KanbanStoryCard[] {
  if (typeof window === 'undefined') return INITIAL_KANBAN_STORIES;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.KANBAN);
    return raw ? JSON.parse(raw) : INITIAL_KANBAN_STORIES;
  } catch {
    return INITIAL_KANBAN_STORIES;
  }
}

export function saveStoredKanban(cards: KanbanStoryCard[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.KANBAN, JSON.stringify(cards));
  } catch (e) {
    console.warn('[NewspaperStudio] Failed to save kanban:', e);
  }
}

export function getStoredRole(): UserRole {
  if (typeof window === 'undefined') return 'student';
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_ROLE);
    return (raw as UserRole) || 'student';
  } catch {
    return 'student';
  }
}

export function setStoredRole(role: UserRole): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ROLE, role);
  } catch (e) {
    console.warn('[NewspaperStudio] Failed to set active role:', e);
  }
}
