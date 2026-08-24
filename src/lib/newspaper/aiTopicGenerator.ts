// AI Newsroom Studio: Topic & Multi-Block Story Package Generator

import { ElementType } from './simpleTypes';

export interface StoryBlockItem {
  id: string;
  blockType: ElementType;
  stepName: string;
  stepDescription: string;
  headline?: string;
  subheadline?: string;
  author?: string;
  bodyText?: string;
  quoteText?: string;
  quoteSpeaker?: string;
  imageUrl?: string;
  imageCaption?: string;
  weatherCity?: string;
  weatherTemp?: string;
  weatherForecast?: string;
  adTitle?: string;
  adText?: string;
  suggestedWidth: number;
}

export interface GeneratedStoryPackage {
  topic: string;
  situation: string;
  category: 'School' | 'Sports' | 'Science & Tech' | 'Community' | 'Arts' | 'Breaking News';
  keyFacts: string[];
  blocks: StoryBlockItem[];
}

export const PRELOADED_STORY_PACKAGES: GeneratedStoryPackage[] = [
  {
    topic: 'Solar-Powered Classroom Robot Wins State Championship',
    situation:
      'Students in the River Valley robotics club engineered "Helios-1", an autonomous solar-powered recycling assistant, beating 34 high schools to take 1st place at the State STEM Expo.',
    category: 'Science & Tech',
    keyFacts: [
      'Built by 8 student engineers over 6 months',
      'Uses solar charging cells and autonomous computer vision',
      'Advanced to National Finals in Dallas this spring',
    ],
    blocks: [
      {
        id: 'block_1',
        blockType: 'main_story_block',
        stepName: 'Block 1: Lead Front-Page Story',
        stepDescription: 'Main investigative headline with featured photo and 2-column report.',
        headline: 'STUDENT-BUILT SOLAR ROBOT CLINCHES STATE STEM TITLE',
        subheadline: 'River Valley engineering team advances to national finals after flawless autonomous trial.',
        author: 'Maya Lin, Science Editor',
        bodyText:
          'Following six months of intensive coding and mechanical engineering, River Valley High’s robotics club secured first place yesterday at the annual State STEM Expo.\n\nThe robot, nicknamed "Helios-1", navigates campus hallways autonomously while collecting recyclable materials using computer vision.\n\n"We rebuilt the drive train three times to optimize solar efficiency," said team lead Jordan Chen. The victory qualifies the school for the National Finals in Dallas this spring.',
        imageUrl:
          'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80',
        imageCaption: 'Team lead Jordan Chen tests the optical sensor array in the engineering lab.',
        suggestedWidth: 100,
      },
      {
        id: 'block_2',
        blockType: 'quote',
        stepName: 'Block 2: Key Interview Quote',
        stepDescription: 'Standout pull quote from faculty advisor and principal.',
        quoteText:
          '"This victory represents hundreds of hours of student perseverance, late night coding, and collaborative problem solving."',
        quoteSpeaker: 'Dr. Marcus Vance, Principal & STEM Program Sponsor',
        suggestedWidth: 50,
      },
      {
        id: 'block_3',
        blockType: 'secondary_story_block',
        stepName: 'Block 3: Technical Breakdown & Dallas Trip',
        stepDescription: 'Secondary report covering fundraising and national tournament preparation.',
        headline: 'FUNDRAISING UNDERWAY FOR SPRING NATIONALS TRIP',
        bodyText:
          'With national qualifications confirmed, the STEM booster club launched a $6,000 travel fundraising campaign. Local engineering firms have already pledged matching grants for student flights and hotel accommodations.',
        suggestedWidth: 50,
      },
    ],
  },
  {
    topic: 'Varsity Soccer Miracle Stoppage-Time Free Kick Victory',
    situation:
      'Tied 2-2 in the district final with 12 seconds remaining, varsity striker Marcus Cole netted a 25-yard curling free kick into the top corner before an ecstatic home crowd of 1,200.',
    category: 'Sports',
    keyFacts: [
      'Final score: River Valley 3, Northgate 2',
      'Winning goal scored with 0:12 on the scoreboard clock',
      'Team extends unbeaten streak to 9 games',
    ],
    blocks: [
      {
        id: 'block_1',
        blockType: 'sports_block',
        stepName: 'Block 1: Varsity Game Recap',
        stepDescription: 'High-energy sports banner and full play-by-play breakdown.',
        headline: 'LAST-SECOND OVERTIME GOAL SEALS HISTORIC DISTRICT TITLE',
        bodyText:
          'In a heart-stopping division final against Northgate, varsity striker Marcus Cole netted a curving 25-yard free kick in the final 12 seconds of stoppage time to clinch a 3-2 victory.\n\nNorthgate had leveled the match in the 82nd minute before a foul outside the penalty box gave the home team one final opportunity.\n\n"We practiced that set piece every morning before homeroom," Cole said after hoisting the championship trophy. "Everyone executed their role flawlessly."',
        suggestedWidth: 100,
      },
      {
        id: 'block_2',
        blockType: 'image',
        stepName: 'Block 2: Action Photo & Celebration',
        stepDescription: 'High-resolution sideline photograph with photographer credit.',
        imageUrl:
          'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80',
        imageCaption: 'Varsity teammates celebrate Cole’s game-winner as the final whistle sounds.',
        suggestedWidth: 50,
      },
      {
        id: 'block_3',
        blockType: 'quote',
        stepName: 'Block 3: Coach Commentary',
        stepDescription: 'Post-game reaction quote from head coach.',
        quoteText:
          '"Our players never lost composure, even under intense tournament pressure in the closing seconds."',
        quoteSpeaker: 'Coach David Taylor, Varsity Head Coach',
        suggestedWidth: 50,
      },
    ],
  },
  {
    topic: '300 Students Restore Historic Riverfront Trail & Plant Trees',
    situation:
      'Over 300 students, parents, and teachers planted 400 native willow trees and cleared 2 tons of debris along the historic River Valley greenway.',
    category: 'Community',
    keyFacts: [
      '400 native trees planted in 4 hours',
      '2 tons of recyclables and trash removed from riverbank',
      'City Council approved $10,000 matching grant for greenway bridges',
    ],
    blocks: [
      {
        id: 'block_1',
        blockType: 'main_story_block',
        stepName: 'Block 1: Community Feature Story',
        stepDescription: 'In-depth community impact article with conservation photo.',
        headline: 'COMMUNITY VOLUNTEERS RESTORE HISTORIC RIVERFRONT PARK',
        subheadline: 'Over 300 student volunteers plant 400 native willow saplings in annual conservation drive.',
        author: 'Alex Rivera, Senior Reporter',
        bodyText:
          'Over 300 volunteers gathered Saturday morning for the annual Riverfront Restoration Day, planting over 400 native willow saplings and clearing two tons of debris from the public walking trail.\n\nThe project was organized collaboratively by the High School Environmental Club and the City Parks Department.\n\n"Seeing families and students collaborate for our natural habitat shows the strength of our community," noted student coordinator Elena Gomez.',
        imageUrl:
          'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
        imageCaption: 'Volunteers plant saplings along the north riverbank.',
        suggestedWidth: 100,
      },
      {
        id: 'block_2',
        blockType: 'opinion_block',
        stepName: 'Block 2: Student Editorial Column',
        stepDescription: 'Thoughtful opinion piece on local environmental stewardship.',
        headline: 'Editorial: Small Hands, Massive Ecological Change',
        author: 'Elena Gomez, Environmental Club President',
        bodyText:
          'When we invest four hours of our weekend in our local watershed, we are protecting clean drinking water and bird habitats for the next fifty years.',
        suggestedWidth: 50,
      },
      {
        id: 'block_3',
        blockType: 'weather_widget',
        stepName: 'Block 3: Weekend Trail Forecast',
        stepDescription: 'Weather ticker for upcoming volunteer days.',
        weatherCity: 'Riverfront Park',
        weatherTemp: '68°F · Mild & Sunny',
        weatherForecast: 'Ideal planting conditions through Sunday afternoon.',
        suggestedWidth: 50,
      },
    ],
  },
];

export function generateStoryPackage(customPrompt: string): GeneratedStoryPackage {
  const promptLower = customPrompt.toLowerCase();

  if (
    promptLower.includes('sport') ||
    promptLower.includes('game') ||
    promptLower.includes('soccer') ||
    promptLower.includes('football') ||
    promptLower.includes('basketball') ||
    promptLower.includes('track')
  ) {
    return {
      ...PRELOADED_STORY_PACKAGES[1],
      topic: customPrompt,
      blocks: PRELOADED_STORY_PACKAGES[1].blocks.map((b) =>
        b.blockType === 'sports_block'
          ? { ...b, headline: `GAME RECAP: ${customPrompt.toUpperCase().slice(0, 50)}` }
          : b
      ),
    };
  }

  if (
    promptLower.includes('robot') ||
    promptLower.includes('tech') ||
    promptLower.includes('science') ||
    promptLower.includes('ai') ||
    promptLower.includes('solar') ||
    promptLower.includes('code')
  ) {
    return {
      ...PRELOADED_STORY_PACKAGES[0],
      topic: customPrompt,
      blocks: PRELOADED_STORY_PACKAGES[0].blocks.map((b) =>
        b.blockType === 'main_story_block'
          ? { ...b, headline: `INNOVATION: ${customPrompt.toUpperCase().slice(0, 50)}` }
          : b
      ),
    };
  }

  // Dynamic Multi-Block Story Package
  const cleanTitle = customPrompt.trim().replace(/^["']|["']$/g, '') || 'Campus Community Breakthrough';
  const uppercaseHeadline = cleanTitle.toUpperCase();

  return {
    topic: cleanTitle,
    situation: `Special investigative report exploring ${cleanTitle} at River Valley High and surrounding community with student and faculty sources.`,
    category: 'School',
    keyFacts: [
      `Major campus milestone involving ${cleanTitle}`,
      'Wide participation across student clubs and faculty coordinators',
      'City and school district partners planning follow-up initiatives',
    ],
    blocks: [
      {
        id: 'block_1',
        blockType: 'main_story_block',
        stepName: 'Block 1: Lead Front-Page Story',
        stepDescription: 'Main investigative headline with featured photo and 2-column report.',
        headline: uppercaseHeadline.length > 10 ? uppercaseHeadline : `${uppercaseHeadline}: SPECIAL CAMPUS REPORT`,
        subheadline: `Students and faculty collaborate to explore key developments in ${cleanTitle}.`,
        author: 'Student Investigative Reporter',
        bodyText: `In an impactful development this week, River Valley High community members gathered to examine key outcomes regarding ${cleanTitle}.\n\nInitial interviews with student organizers and faculty coordinators highlighted strong participation across all grade levels.\n\n"This initiative reflects the dedication and creativity of our entire student body," stated project coordinators. Follow-up meetings are scheduled for next month.`,
        imageUrl:
          'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
        imageCaption: `Student representatives collaborate on ${cleanTitle}.`,
        suggestedWidth: 100,
      },
      {
        id: 'block_2',
        blockType: 'quote',
        stepName: 'Block 2: Source Interview Quote',
        stepDescription: 'Standout pull quote from a key participant.',
        quoteText: `"When our school community comes together around ${cleanTitle}, the positive impact is immediate."`,
        quoteSpeaker: 'Alex Rivera, Senior Class Representative',
        suggestedWidth: 50,
      },
      {
        id: 'block_3',
        blockType: 'secondary_story_block',
        stepName: 'Block 3: Community Reaction Column',
        stepDescription: 'Supporting report covering feedback and next steps.',
        headline: `NEXT STEPS FOR ${uppercaseHeadline.slice(0, 35)}`,
        bodyText: `Following the initial release, department heads announced a community open-house next Tuesday to gather parent and student feedback.`,
        suggestedWidth: 50,
      },
    ],
  };
}
