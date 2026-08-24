// Clean, Student-Friendly Types for Newspaper Studio

export type PageSize = 'A4' | 'A3';
export type PageOrientation = 'portrait' | 'landscape';

export type ElementType =
  | 'masthead'
  | 'headline'
  | 'subheadline'
  | 'paragraph'
  | 'article_block'
  | 'main_story_block'
  | 'secondary_story_block'
  | 'sports_block'
  | 'opinion_block'
  | 'quote'
  | 'image'
  | 'divider'
  | 'weather_widget'
  | 'ad_box';

export type TemplateId =
  | 'blank'
  | 'classic'
  | 'modern'
  | 'school'
  | 'sports'
  | 'magazine';

export interface CanvasElement {
  id: string;
  type: ElementType;
  x: number; // percentage or px
  y: number; // percentage or px
  width: number; // in percentage of page width (e.g. 50% = 2 cols, 100% = full)
  height?: number; // optional min-height in px
  zIndex?: number;
  content: {
    title?: string;
    subtitle?: string;
    bodyText?: string;
    author?: string;
    category?: string;
    imageUrl?: string;
    imageCaption?: string;
    imageCredit?: string;
    imageHeight?: number;
    imageWidth?: number;
    imageFilter?: 'none' | 'filter-halftone' | 'filter-sepia-vintage' | 'filter-bw-contrast';
    quoteText?: string;
    quoteSpeaker?: string;
    adTitle?: string;
    adText?: string;
    weatherCity?: string;
    weatherTemp?: string;
    weatherForecast?: string;
    columnsCount?: 1 | 2 | 3;
    fontSize?: 'small' | 'medium' | 'large' | 'huge';
    fontFamily?: 'font-broadsheet' | 'font-newsreader' | 'font-typewriter' | 'font-cinzel' | 'font-sans';
    textAlign?: 'left' | 'center' | 'justify';
    isBold?: boolean;
    isItalic?: boolean;
    isUnderline?: boolean;
    textColor?: string;
    backgroundColor?: string;
    borderColor?: string;
  };
}

export interface NewspaperPageData {
  id: string;
  pageNumber: number;
  title: string; // e.g. "Front Page", "Sports", "Opinion"
  elements: CanvasElement[];
}

export interface NewspaperProject {
  id: string;
  title: string;
  tagline: string;
  editionDate: string;
  pageSize: PageSize;
  orientation: PageOrientation;
  paperTexture: 'paper-clean' | 'paper-newsprint' | 'paper-aged' | 'paper-sepia' | 'paper-noir';
  status: 'draft' | 'published';
  authorName: string;
  schoolName: string;
  templateId: TemplateId;
  pages: NewspaperPageData[];
  createdAt: string;
  updatedAt: string;
}
