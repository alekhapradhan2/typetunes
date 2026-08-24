// Predefined Template Presets for Newspaper Studio

import { NewspaperProject, TemplateId, CanvasElement } from './simpleTypes';

export interface TemplateMeta {
  id: TemplateId;
  name: string;
  badge: string;
  description: string;
  previewImage: string;
  paperTexture: 'paper-clean' | 'paper-newsprint' | 'paper-aged' | 'paper-sepia' | 'paper-noir';
}

export const TEMPLATE_METAS: TemplateMeta[] = [
  {
    id: 'blank',
    name: 'Blank Page',
    badge: 'Custom',
    description: 'Start completely from scratch with a fresh, clean canvas.',
    previewImage: '📄',
    paperTexture: 'paper-newsprint',
  },
  {
    id: 'classic',
    name: 'Classic Broadsheet',
    badge: 'Traditional',
    description: 'Traditional black-and-white editorial newspaper layout with vintage masthead.',
    previewImage: '🗞️',
    paperTexture: 'paper-newsprint',
  },
  {
    id: 'modern',
    name: 'Modern Editorial',
    badge: 'Clean',
    description: 'Crisp, contemporary journalism layout with bold serif headlines and balanced whitespace.',
    previewImage: '📰',
    paperTexture: 'paper-clean',
  },
  {
    id: 'school',
    name: 'School Times',
    badge: 'Student Choice',
    description: 'Energetic, student-friendly layout designed for campus news, clubs, and cafeteria spotlights.',
    previewImage: '🏫',
    paperTexture: 'paper-newsprint',
  },
  {
    id: 'sports',
    name: 'Sports Gazette',
    badge: 'Action',
    description: 'High-impact layout with large sports photography, bold headlines, and scoreboards.',
    previewImage: '🏆',
    paperTexture: 'paper-newsprint',
  },
  {
    id: 'magazine',
    name: 'Magazine Feature',
    badge: 'Creative',
    description: 'Visually striking multi-column feature format with pull quotes and artistic headers.',
    previewImage: '✨',
    paperTexture: 'paper-aged',
  },
];

export function createInitialProjectFromTemplate(
  title: string,
  tagline: string,
  templateId: TemplateId,
  editionDate: string = new Date().toLocaleDateString('en-US', { dateStyle: 'full' })
): NewspaperProject {
  const meta = TEMPLATE_METAS.find((t) => t.id === templateId) || TEMPLATE_METAS[1];

  let initialElements: CanvasElement[] = [];

  if (templateId === 'blank') {
    initialElements = [
      {
        id: 'el_masthead_1',
        type: 'masthead',
        x: 0,
        y: 0,
        width: 100,
        content: {
          title: title || 'THE STUDENT CHRONICLE',
          subtitle: tagline || 'Your Voice. Your Stories. Your Community.',
          fontFamily: 'font-broadsheet',
          textAlign: 'center',
        },
      },
    ];
  } else if (templateId === 'school') {
    initialElements = [
      {
        id: 'el_masthead_school',
        type: 'masthead',
        x: 0,
        y: 0,
        width: 100,
        content: {
          title: title || 'THE CAMPUS HERALD',
          subtitle: tagline || 'By Students, For Students · Volume 12, Issue 4',
          fontFamily: 'font-broadsheet',
          textAlign: 'center',
        },
      },
      {
        id: 'el_main_story_school',
        type: 'main_story_block',
        x: 0,
        y: 15,
        width: 65,
        content: {
          title: 'Campus Robotics Team Takes 1st Place at State Championship',
          author: 'Maya Lin, Senior Editor',
          bodyText:
            'Following six months of intensive coding and mechanical engineering, River Valley’s student robotics team secured first place yesterday at the annual State STEM Expo.\n\n"We rebuilt the autonomous navigation algorithm three times before finding the optimal gear ratio," said team lead Jordan Chen. The victory qualifies the school for the National Finals in Dallas this spring.',
          imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80',
          imageCaption: 'The winning robot navigates the autonomous obstacle course.',
          imageFilter: 'filter-halftone',
          columnsCount: 2,
        },
      },
      {
        id: 'el_quote_school',
        type: 'quote',
        x: 68,
        y: 15,
        width: 32,
        content: {
          quoteText: '"This victory represents hundreds of hours of student perseverance and teamwork."',
          quoteSpeaker: 'Coach Taylor, Robotics Sponsor',
        },
      },
      {
        id: 'el_weather_school',
        type: 'weather_widget',
        x: 68,
        y: 35,
        width: 32,
        content: {
          weatherCity: 'Campus Forecast',
          weatherTemp: '68°F · Sunny',
          weatherForecast: 'Autumn Festival Friday · Pep Rally 3 PM',
        },
      },
      {
        id: 'el_opinion_school',
        type: 'opinion_block',
        x: 0,
        y: 65,
        width: 50,
        content: {
          title: 'Editorial: Why We Need More Quiet Library Study Hours',
          author: 'Alex Rivera',
          bodyText:
            'With midterms approaching, library overcrowding has made focused group review challenging. Extending study hours until 6 PM would offer a dedicated sanctuary for all students.',
        },
      },
      {
        id: 'el_secondary_school',
        type: 'secondary_story_block',
        x: 52,
        y: 65,
        width: 48,
        content: {
          title: 'Drama Club Announces Fall Musical: Little Shop of Horrors',
          author: 'Sam Patel',
          bodyText:
            'Auditions open next Tuesday in the auditorium. Over 60 student actors and stage crew have already registered for callbacks.',
        },
      },
    ];
  } else if (templateId === 'sports') {
    initialElements = [
      {
        id: 'el_masthead_sports',
        type: 'masthead',
        x: 0,
        y: 0,
        width: 100,
        content: {
          title: title || 'THE DAILY SPORTS GAZETTE',
          subtitle: tagline || 'Championship Coverage & High School Athletics',
          fontFamily: 'font-broadsheet',
          textAlign: 'center',
        },
      },
      {
        id: 'el_sports_block_1',
        type: 'sports_block',
        x: 0,
        y: 15,
        width: 100,
        content: {
          title: 'LAST-SECOND OVERTIME GOAL SEALS DIVISION TITLE',
          author: 'Liam Vance, Sports Editor',
          bodyText:
            'In a heart-stopping division final against Northgate, varsity striker Marcus Cole netted a curving 25-yard free kick in the final 12 seconds of stoppage time to clinch a 3-2 victory before an ecstatic home crowd.\n\n"We practiced that set piece every morning before homeroom," Cole said after hoisting the trophy. "Everyone executed their role flawlessly."',
          imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80',
          imageCaption: 'The varsity team celebrates the winning goal at the final whistle.',
          imageFilter: 'none',
          columnsCount: 2,
        },
      },
    ];
  } else {
    // Classic / Modern Default
    initialElements = [
      {
        id: 'el_masthead_classic',
        type: 'masthead',
        x: 0,
        y: 0,
        width: 100,
        content: {
          title: title || 'THE CHRONICLE',
          subtitle: tagline || 'The Independent Voice of Truth and Student Journalism',
          fontFamily: 'font-broadsheet',
          textAlign: 'center',
        },
      },
      {
        id: 'el_main_story_classic',
        type: 'main_story_block',
        x: 0,
        y: 15,
        width: 68,
        content: {
          title: 'Community Rallies to Restore Historic Riverfront Park',
          author: 'Alex Rivera, Senior Reporter',
          bodyText:
            'Over 300 volunteers gathered Saturday morning for the annual Riverfront Restoration Day, planting over 400 native willow saplings and clearing two tons of debris from the public walking trail.\n\n"Seeing families and students collaborate for our natural habitat shows the strength of our community," noted organizer Elena Gomez. City Council announced matching grant funds for next month.',
          imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
          imageCaption: 'Volunteers plant native shrubs along the Willow Creek bank.',
          imageFilter: 'filter-halftone',
          columnsCount: 2,
        },
      },
      {
        id: 'el_quote_classic',
        type: 'quote',
        x: 70,
        y: 15,
        width: 30,
        content: {
          quoteText: '"Preserving our green spaces is an investment in our shared future."',
          quoteSpeaker: 'Mayor David Brooks',
        },
      },
      {
        id: 'el_secondary_classic',
        type: 'secondary_story_block',
        x: 70,
        y: 38,
        width: 30,
        content: {
          title: 'Science Fair Finalists Announced',
          author: 'Staff Report',
          bodyText: 'Twelve student projects advanced to regional judging this weekend at State University.',
        },
      },
    ];
  }

  return {
    id: `project_${Date.now()}`,
    title: title || 'The School Times',
    tagline: tagline || 'Your Voice. Your Stories.',
    editionDate,
    pageSize: 'A4',
    orientation: 'portrait',
    paperTexture: meta.paperTexture,
    status: 'draft',
    authorName: 'Student Journalist',
    schoolName: 'River Valley High',
    templateId,
    pages: [
      {
        id: `page_${Date.now()}_1`,
        pageNumber: 1,
        title: 'Front Page',
        elements: initialElements,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
