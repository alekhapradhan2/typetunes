export type PaperTheme = 'aged' | 'newsprint' | 'sepia' | 'clean' | 'noir' | 'cyber';
export type PhotoFilter = 'none' | 'halftone' | 'bw' | 'sepia' | 'aged' | 'daguerreotype';
export type MastheadFont = 'gothic' | 'pirata' | 'broadsheet' | 'cinzel' | 'typewriter' | 'special-elite' | 'newsreader';

export interface NewspaperArticle {
  headline: string;
  subheadline: string;
  byline: string;
  dateline: string;
  leadParagraph: string;
  bodyParagraphs: string[];
  columns: number; // 1, 2, 3, 4
  showDropCap: boolean;
}

export interface NewspaperPhoto {
  url: string;
  caption: string;
  credit: string;
  filter: PhotoFilter;
  aspectRatio: '16/9' | '4/3' | '1/1' | '3/4' | '21/9';
  showBorder: boolean;
  borderStyle: 'classic' | 'vintage-mount' | 'double' | 'thin' | 'none';
}

export interface SecondaryStory {
  id: string;
  title: string;
  author?: string;
  snippet: string;
  category?: string;
}

export interface RetroAd {
  title: string;
  tagline: string;
  body: string;
  cta: string;
  iconType?: 'elixir' | 'typewriter' | 'clock' | 'hat' | 'detective' | 'star';
}

export interface NewspaperConfig {
  id: string;
  name: string;
  masthead: {
    title: string;
    submotto: string;
    latinMotto: string;
    font: MastheadFont;
    alignment: 'center' | 'left' | 'split';
    bannerBadge?: string;
  };
  meta: {
    city: string;
    date: string;
    volume: string;
    issue: string;
    edition: string;
    price: string;
    weather: {
      temp: string;
      condition: string;
      icon: string;
    };
  };
  breakingRibbon?: {
    enabled: boolean;
    text: string;
  };
  mainArticle: NewspaperArticle;
  heroPhoto: NewspaperPhoto;
  secondaryStories: SecondaryStory[];
  editorial: {
    title: string;
    editorName: string;
    text: string;
  };
  quoteOfTheDay: {
    quote: string;
    author: string;
  };
  ad: RetroAd;
  stamp?: {
    enabled: boolean;
    text: string;
    color: 'red' | 'navy' | 'black' | 'gold' | 'cyan';
    rotation: number; // in degrees, e.g. -12
  };
  paper: {
    theme: PaperTheme;
    showCreases: boolean;
    showCoffeeRing: boolean;
    showBarcode: boolean;
    ornamentStyle: 'victorian' | 'classic-double' | 'bold-rules' | 'minimal' | 'cyber';
  };
}

export const FAMOUS_NEWSPAPERS: { id: string; name: string; era: string; description: string; template: NewspaperConfig }[] = [
  {
    id: 'vintage-times',
    name: 'The Vintage Times',
    era: '1920s Broadsheet',
    description: 'Authentic 1920s broadsheet with ornate Gothic masthead, multi-column print, and sepia tone.',
    template: {
      id: 'vintage-times',
      name: 'The Vintage Times',
      masthead: {
        title: 'THE VINTAGE TIMES',
        submotto: '“The Foremost Chronicler of Truth, Progress & Human Endeavor”',
        latinMotto: 'VERITAS VOS LIBERABIT • ESTABLISHED 1892',
        font: 'gothic',
        alignment: 'center',
        bannerBadge: 'LATE CITY EDITION',
      },
      meta: {
        city: 'LONDON & NEW YORK',
        date: 'THURSDAY, OCTOBER 24, 1929',
        volume: 'VOL. LXXVIII',
        issue: 'NO. 26,419',
        edition: 'FIVE STAR FINAL',
        price: 'TWO CENTS',
        weather: {
          temp: '58°F / 14°C',
          condition: 'Brisk & Autumnal',
          icon: '🍂',
        },
      },
      breakingRibbon: {
        enabled: true,
        text: 'EXTRAORDINARY DISPATCH: HISTORIC ANNOUNCEMENT MADE BEFORE THOUSANDS ASSEMBLED IN THE SQUARE',
      },
      mainArticle: {
        headline: 'AUSTERE RECORD SHATTERED AS EXTRAORDINARY TRIUMPH CAPTIVATES WORLD',
        subheadline: 'Scores of Scholars and Citizens Marvel at Unprecedented Feat of Speed, Intellect, and Determination',
        byline: 'BY ARTHUR J. CRANSTON • Special Envoy to The Vintage Times',
        dateline: 'NEW YORK, Oct. 23',
        leadParagraph: 'Before a spellbound congregation of citizens, engineers, and observers from across the hemisphere, an astounding landmark was achieved today that promises to reshape our understanding of what human perseverance may accomplish.',
        bodyParagraphs: [
          'From the early hours of the morning, thousands gathered upon the steps of the grand pavilion. Teletype operators worked in relentless unison as telegraph lines carried rapid dispatches across oceans and continents without pause.',
          '“Never in our storied lifetime have we witnessed such absolute harmony of rhythm and unrelenting purpose,” proclaimed the Chief Commissioner to an applauding multitude. Eyewitnesses affirmed that even the most hardened sceptics stood in silent reverence as the final figure was recorded.',
          'Specialist committees were convened shortly before noon to verify the integrity of the apparatus. Their unanimous findings confirm beyond reasonable dispute that all prior boundaries have been formally surpassed.',
        ],
        columns: 3,
        showDropCap: true,
      },
      heroPhoto: {
        url: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=900&auto=format&fit=crop&q=80',
        caption: 'Fig. 1 — The breathless scene as witnesses gather around the mechanical console to verify the historic tally.',
        credit: 'Staff Photograph by E. C. Sterling • Silver Gelatin Print',
        filter: 'sepia',
        aspectRatio: '16/9',
        showBorder: true,
        borderStyle: 'classic',
      },
      secondaryStories: [
        {
          id: 'story-2',
          title: 'Steam Locomotive Speed Standard Exceeded in Highland Trial Run',
          author: 'By H. P. Abernathy',
          snippet: 'Engine No. 402 tore through the mist-shrouded northern pass at a relentless pace of 84 miles per hour, beating the previous record set during the Great Exposition of 1914.',
          category: 'TRANSPORT & INDUSTRY',
        },
        {
          id: 'story-3',
          title: 'Telegraph Cable Reaches Remote Polar Observatory',
          author: 'By Walter Finch',
          snippet: 'Communications have been established with the arctic meteorological station, allowing instantaneous weather warnings to maritime shipping fleets.',
          category: 'SCIENCE & DISCOVERY',
        },
      ],
      editorial: {
        title: 'The Unyielding March of the Human Hand',
        editorName: 'The Editorial Board',
        text: 'In an epoch characterized by mechanical wonders and restless ambition, let it not be forgotten that the most profound machinery remains the human mind guided by steady craft and untiring dedication.',
      },
      quoteOfTheDay: {
        quote: '“Genius is the capacity for exerting continuous effort without succumbing to weariness.”',
        author: 'Lord Harrington, 1898',
      },
      ad: {
        title: 'DR. SHELTON’S CELEBRATED COGNITIVE ELIXIR',
        tagline: 'Fortifies the Nervous System & Calms the Restless Mind!',
        body: 'Crafted from pure mountain botanicals and essential phosphorus. Approved by apothecaries across three empires for typists, clerks, and scholars.',
        cta: 'Available at all Reputable Chemists — 25 Cents per Vial',
        iconType: 'elixir',
      },
      stamp: {
        enabled: true,
        text: 'VERIFIED ARCHIVE',
        color: 'red',
        rotation: -14,
      },
      paper: {
        theme: 'aged',
        showCreases: true,
        showCoffeeRing: true,
        showBarcode: false,
        ornamentStyle: 'victorian',
      },
    },
  },
  {
    id: 'daily-bugle',
    name: 'The Daily Bugle / Front-Page Tabloid',
    era: '1960s Classic Tabloid',
    description: 'Screaming uppercase headlines, high-impact red masthead, and sensational front-page drama!',
    template: {
      id: 'daily-bugle',
      name: 'The Daily Bugle',
      masthead: {
        title: 'THE DAILY BUGLE',
        submotto: '“FIRST WITH THE NEWS THAT MATTERS MOST TO THE CITY”',
        latinMotto: 'THE CITIZEN’S VOICE • 24 HOURS A DAY',
        font: 'pirata',
        alignment: 'center',
        bannerBadge: 'EXTRA! EXTRA!',
      },
      meta: {
        city: 'NEW YORK CITY',
        date: 'MONDAY, JUNE 15, 1964',
        volume: 'VOL. 42',
        issue: 'NO. 104',
        edition: 'RED STREAK FINAL',
        price: '10¢',
        weather: {
          temp: '74°F / 23°C',
          condition: 'Thunderstorms Brewing',
          icon: '⚡',
        },
      },
      breakingRibbon: {
        enabled: true,
        text: 'BULLETIN: EYEWITNESSES FLOOD POLICE SWITCHBOARDS AS UNBELIEVABLE EVENT ROCKS DOWNTOWN MANHATTAN!',
      },
      mainArticle: {
        headline: 'UNSTOPPABLE! SENSATIONAL SPEED DEMON STUNS ENTIRE METROPOLIS!',
        subheadline: 'Mayor Demands Full Investigation As Keyboard Wonder Sets Impossible Standard in Broadway Showdown!',
        byline: 'BY PETER B. PARKER & J. JONAH REPORTING TEAM',
        dateline: 'MANHATTAN',
        leadParagraph: 'A heart-stopping scene unfolded in the heart of downtown yesterday when a quiet challenger shattered every existing benchmark before stunned onlookers and flashing camera bulbs.',
        bodyParagraphs: [
          '“I’ve covered this city for thirty-five years, and I’ve never seen fingers fly like lightning bolts!” barked an eyewitness clinging to the railing outside City Hall.',
          'Traffic came to a complete standstill on 5th Avenue as radio trucks broadcast the milestone live across all five boroughs. Police were called to manage the surging crowd of enthusiastic supporters chanting in the street.',
          'City officials announced an emergency tribute parade scheduled for noon tomorrow, promising brass bands, ticker-tape showers, and key-to-the-city honors.',
        ],
        columns: 2,
        showDropCap: true,
      },
      heroPhoto: {
        url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&auto=format&fit=crop&q=80',
        caption: 'EXCLUSIVE BUGLE PHOTO: Moments after the record fell, flashing bulbs capture the triumphant victor raising fists in victory!',
        credit: 'Bugle Exclusive Photo by Staff Cameraman',
        filter: 'bw',
        aspectRatio: '16/9',
        showBorder: true,
        borderStyle: 'double',
      },
      secondaryStories: [
        {
          id: 'story-bugle-1',
          title: 'Subway Line 4 Reopens Ahead of Schedule',
          author: 'By Dan Evans',
          snippet: 'Commuters cheered as transit crews finished repairs on the express track three full days before the deadline.',
          category: 'CITY DESK',
        },
        {
          id: 'story-bugle-2',
          title: 'World Championship Boxing Match Sold Out',
          author: 'By Sal Marconi',
          snippet: 'Madison Square Garden reports all 20,000 tickets snapped up in under fifteen minutes this morning.',
          category: 'SPORTS',
        },
      ],
      editorial: {
        title: 'Bugle Demands Answers!',
        editorName: 'The Publisher',
        text: 'When something this extraordinary happens on our city streets, the Bugle is right there on the front line bringing you the raw, unfiltered truth!',
      },
      quoteOfTheDay: {
        quote: '“Print the truth, make it loud, and let the chips fall where they may!”',
        author: 'Chief Editor',
      },
      ad: {
        title: 'ACME UNDERWOOD TYPEWRITER CO.',
        tagline: 'Built Like a Tank — Snappy Precision Keys!',
        body: 'The choice of investigative reporters and prize-winning novelists. Ribbon cartridge included. 10-day money-back guarantee!',
        cta: 'Call ORchard 4-5000 for Nearest Dealership',
        iconType: 'typewriter',
      },
      stamp: {
        enabled: true,
        text: 'BREAKING NEWS',
        color: 'red',
        rotation: -8,
      },
      paper: {
        theme: 'newsprint',
        showCreases: true,
        showCoffeeRing: false,
        showBarcode: true,
        ornamentStyle: 'bold-rules',
      },
    },
  },
  {
    id: 'wall-street-chronicle',
    name: 'The Financial Broadsheet & Wall Street Chronicle',
    era: '1950s Broadsheet',
    description: 'Refined serif typography, market ticker styling, economic precision, and prestige formatting.',
    template: {
      id: 'wall-street-chronicle',
      name: 'The Financial Chronicle',
      masthead: {
        title: 'THE FINANCIAL CHRONICLE',
        submotto: '“The Global Authority on Markets, Industry, Commerce, and Enterprise”',
        latinMotto: 'NUMISMA ET SCIENTIA • FOUNDED MDCCCLXXXIV',
        font: 'broadsheet',
        alignment: 'split',
        bannerBadge: 'MARKET CLOSING REPORT',
      },
      meta: {
        city: 'NEW YORK • LONDON • TOKYO',
        date: 'WEDNESDAY, AUGUST 12, 1953',
        volume: 'VOL. CXVI',
        issue: 'NO. 182',
        edition: 'INTERNATIONAL BROADCAST',
        price: 'FIFTY CENTS',
        weather: {
          temp: '72°F / 22°C',
          condition: 'Fair Skies, Rising Barometer',
          icon: '📈',
        },
      },
      breakingRibbon: {
        enabled: true,
        text: 'FINANCIAL WIRE: GLOBAL COMMERCE SURGES 14.8% AS NEW PRODUCTIVITY BENCHMARKS TAKE HOLD WORLDWIDE',
      },
      mainArticle: {
        headline: 'HISTORIC PRODUCTIVITY EXPANSION CATALYZES GLOBAL MARKETS',
        subheadline: 'Standard & Industrial Indices Reach New All-Time Peaks Following Breakthrough Technological Efficiencies',
        byline: 'BY WINTHROP STERLING • Chief Economic Editor',
        dateline: 'WALL STREET',
        leadParagraph: 'Equities rallied across all primary exchanges this afternoon as institutional desks digested unprecedented productivity figures originating from newly standardized workflow procedures.',
        bodyParagraphs: [
          'Trading volume surged past previous benchmarks within forty minutes of the morning opening bell. Industrial conglomerates and technology syndicates led the broad-based advance.',
          '“We are observing a permanent structural shift toward higher throughput and disciplined execution,” commented Senior Managing Director Eleanor Vance during an emergency briefing with institutional stakeholders.',
          'Treasury yields stabilized alongside robust international currency reserves, signaling sustained confidence across the North Atlantic and Pacific trading sectors.',
        ],
        columns: 3,
        showDropCap: true,
      },
      heroPhoto: {
        url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&auto=format&fit=crop&q=80',
        caption: 'Fig. 2 — The trading rotunda during peak volume hours as floor brokers execute record-breaking order flow.',
        credit: 'Chronicle Photographic Archive • Financial District Bureau',
        filter: 'halftone',
        aspectRatio: '16/9',
        showBorder: true,
        borderStyle: 'thin',
      },
      secondaryStories: [
        {
          id: 'fin-1',
          title: 'Merchant Shipping Fleet Expands by 42 Vessels',
          author: 'Maritime Bureau',
          snippet: 'Transoceanic shipping rates declined by four points as newly commissioned cargo carriers entered scheduled service routes.',
          category: 'LOGISTICS',
        },
        {
          id: 'fin-2',
          title: 'Sovereign Bond Auction Subscribed Three Times Over',
          author: 'Treasury Desk',
          snippet: 'Central banking liquidity metrics remain robust as long-term development obligations found overwhelming institutional interest.',
          category: 'CAPITAL MARKETS',
        },
      ],
      editorial: {
        title: 'Capital Formation and Methodical Labor',
        editorName: 'The Editorial Board',
        text: 'The foundations of sound commerce rest upon predictability, accurate measurement, and unwavering fidelity to contractual precision.',
      },
      quoteOfTheDay: {
        quote: '“Compound interest and relentless discipline are the two mighty levers of the modern world.”',
        author: 'Baron von Rothschild',
      },
      ad: {
        title: 'STERLING & SONS VAULT SECURITY',
        tagline: 'Time-Tested Custody for Bullion, Bearer Bonds & Documents',
        body: 'Reinforced manganese steel chambers protected by dual astronomical chronometer locks. Discretion guaranteed since 1888.',
        cta: 'Private Consultations at 40 Wall Street',
        iconType: 'clock',
      },
      stamp: {
        enabled: true,
        text: 'CERTIFIED COPY',
        color: 'navy',
        rotation: -6,
      },
      paper: {
        theme: 'clean',
        showCreases: false,
        showCoffeeRing: false,
        showBarcode: true,
        ornamentStyle: 'classic-double',
      },
    },
  },
  {
    id: 'noir-gazette',
    name: 'The Noir Gazette / 1940s Crime & Mystery',
    era: '1940s Film Noir',
    description: 'Moody sepia contrasts, fedora detective headlines, classified rubber stamps, and vintage typewriter body.',
    template: {
      id: 'noir-gazette',
      name: 'The Midnight Gazette',
      masthead: {
        title: 'THE MIDNIGHT GAZETTE',
        submotto: '“THE CITY NEVER SLEEPS — NEITHER DO WE”',
        latinMotto: 'NOX OMNIA REVELAT • CRIME & CITY DESK',
        font: 'special-elite',
        alignment: 'center',
        bannerBadge: 'SPECIAL MIDNIGHT ISSUE',
      },
      meta: {
        city: 'CHICAGO & SAN FRANCISCO',
        date: 'FRIDAY, NOVEMBER 13, 1942',
        volume: 'VOL. XIII',
        issue: 'NO. 77',
        edition: 'RED LIGHT DISTRICT RUN',
        price: '3 CENTS',
        weather: {
          temp: '44°F / 7°C',
          condition: 'Heavy Fog & Neon Rain',
          icon: '🌧️',
        },
      },
      breakingRibbon: {
        enabled: true,
        text: 'SPECIAL CRIME REPORT: MYSTERIOUS KEYBOARD ENIGMA SOLVED UNDER COVER OF RAIN-SLICKED DOWNTOWN SHADOWS',
      },
      mainArticle: {
        headline: 'CASE CLOSED! THE PHANTOM OF THE 88 KEYS CRACKS THE IMPOSSIBLE CYPHER',
        subheadline: 'Midnight Raid on Pier 14 Uncovers Secret Document Typed at Blistering Speed Ahead of Fed Deadline!',
        byline: 'BY SAM SPADE INVESTIGATIVE BUREAU',
        dateline: 'DOWNTOWN',
        leadParagraph: 'The rain was drumming on the windowpane like nervous fingers when the door kicked open and the mystery that baffled detectives for six long weeks was brought to a decisive halt.',
        bodyParagraphs: [
          'In a smoky backroom lit only by a swinging 40-watt bulb, the clues finally locked together. A worn ribbon, an oiled platen, and a stack of typed transcripts told the whole story.',
          '“The kid didn’t hesitate for a microsecond,” muttered Detective Sergeant Malone, lighting a cigarette in the doorway. “Every keystroke hit true, like a clock ticking down zero.”',
          'Before midnight struck, the entire syndicate had thrown in their cards, leaving behind only the rhythmic memory of perfection.',
        ],
        columns: 2,
        showDropCap: true,
      },
      heroPhoto: {
        url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=900&auto=format&fit=crop&q=80',
        caption: 'Fig. 3 — The rain-washed boulevard at 2:00 AM where the final dispatch was slipped into the drop box.',
        credit: 'Night Patrol Flashbulb Photo by ‘Flash’ Callahan',
        filter: 'daguerreotype',
        aspectRatio: '16/9',
        showBorder: true,
        borderStyle: 'vintage-mount',
      },
      secondaryStories: [
        {
          id: 'noir-1',
          title: 'Fog Blinds Harbor as Foghorn Blares Through Dawn',
          author: 'By Jack Riley',
          snippet: 'Tugboats guided three incoming steamers blindly into slipways as visibility dropped under fifty paces.',
          category: 'NIGHT BEAT',
        },
        {
          id: 'noir-2',
          title: 'Jazz Club on 52nd Welcomes Mystery Pianist',
          author: 'By Ruby Dale',
          snippet: 'Patrons packed the basement lounge until 4 AM listening to rapid-fire syncopation never heard before.',
          category: 'AFTER DARK',
        },
      ],
      editorial: {
        title: 'Shadows Cast Long Lines',
        editorName: 'The Chief',
        text: 'In this city, you either stay sharp or you get left behind in yesterday’s dust. Keep your eyes open and your keyboard loaded.',
      },
      quoteOfTheDay: {
        quote: '“In the dark all cats are grey, but a crisp typewriter never lies.”',
        author: 'Anonymous Sleuth',
      },
      ad: {
        title: 'DIAMOND DETECTIVE ACADEMY',
        tagline: 'Learn Fingerprinting, Shadowing & Cipher Breaking!',
        body: 'Complete postal course with real badge and decoder ring. Male and female applicants accepted. Start your private career today.',
        cta: 'Write Box 404, General Post Office',
        iconType: 'detective',
      },
      stamp: {
        enabled: true,
        text: 'CONFIDENTIAL',
        color: 'red',
        rotation: -12,
      },
      paper: {
        theme: 'sepia',
        showCreases: true,
        showCoffeeRing: true,
        showBarcode: false,
        ornamentStyle: 'victorian',
      },
    },
  },
  {
    id: 'victorian-post',
    name: 'The Royal Victorian Gazette (1888)',
    era: '1880s Victorian Broadsheet',
    description: 'Imperial crest, Latin motto, filigree borders, floral dividers, and stately Victorian journalism.',
    template: {
      id: 'victorian-post',
      name: 'The Royal Gazette',
      masthead: {
        title: 'THE ROYAL GAZETTE',
        submotto: '“DIEU ET MON DROIT • BY ROYAL APPOINTMENT TO HER MAJESTY”',
        latinMotto: 'HONI SOIT QUI MAL Y PENSE • ANNO DOMINI MDCCCLXXXVIII',
        font: 'cinzel',
        alignment: 'center',
        bannerBadge: 'ROYAL DISPATCH',
      },
      meta: {
        city: 'LONDON • EDINBURGH • DUBLIN',
        date: 'SATURDAY, JULY 7, 1888',
        volume: 'VOL. LXIV',
        issue: 'NO. 14,022',
        edition: 'EMPIRE GAZETTE',
        price: 'ONE PENNY',
        weather: {
          temp: '62°F / 17°C',
          condition: 'Gentle English Summer Drizzle',
          icon: '👑',
        },
      },
      breakingRibbon: {
        enabled: true,
        text: 'IMPERIAL GAZETTE: GRAND EXHIBITION OF MECHANICAL ARTS AT CRYSTAL PALACE DECLARED A MAGNIFICENT TRIUMPH',
      },
      mainArticle: {
        headline: 'HER MAJESTY’S GOVERNMENT LAUDS NEW MECHANICAL PRECISION BENCHMARK',
        subheadline: 'Royal Society Assembles in Full Regalia to Bestow Golden Medallion upon Master Craftsman',
        byline: 'BY SIR REGINALD THISTLETHWAITE, K.C.B.',
        dateline: 'WHITEHALL',
        leadParagraph: 'It is with the most elevated sentiments of national pride that We communicate to the subjects of the Crown the momentous proceedings which took place at the Royal Society yesterday afternoon.',
        bodyParagraphs: [
          'Under the gilded arches of the Great Hall, a demonstration of relentless mechanical transcription was performed before the Prime Minister, the Lords Spiritual and Temporal, and distinguished ambassadors.',
          'The instrument, manufactured of finest Sheffield steel and Jamaican mahogany, responded to the touch with such melodious agility that the entire assembly broke into spontaneous acclaim.',
          'His Grace the Duke of Devonshire remarked that the age of hesitation had reached its terminus, inaugurating an era of supreme efficiency throughout the dominions.',
        ],
        columns: 3,
        showDropCap: true,
      },
      heroPhoto: {
        url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=900&auto=format&fit=crop&q=80',
        caption: 'Plate IV — View of the Westminster Embankment where crowds gathered in celebration of the imperial proclamation.',
        credit: 'Engraved by Order of the Royal Commission',
        filter: 'aged',
        aspectRatio: '16/9',
        showBorder: true,
        borderStyle: 'classic',
      },
      secondaryStories: [
        {
          id: 'vic-1',
          title: 'Steam Packet Service to Calcutta Shortened by Four Days',
          author: 'Colonial Office',
          snippet: 'The newly inaugurated Suez route continues to deliver swift intelligence across the trade arteries of the Orient.',
          category: 'THE EMPIRE',
        },
        {
          id: 'vic-2',
          title: 'Restoration of Abbey Clocktower Completed',
          author: 'Works Dept.',
          snippet: 'The great chimes rang out across London at high noon today for the first time since the winter gale.',
          category: 'METROPOLIS',
        },
      ],
      editorial: {
        title: 'Duty, Craft, and the Commonwealth',
        editorName: 'The Chief Chronicler',
        text: 'Let each citizen remember that excellence in one’s daily calling constitutes the highest service to society and sovereign alike.',
      },
      quoteOfTheDay: {
        quote: '“Labor omnia vincit improbus — Relentless toil conquers all things.”',
        author: 'Virgil',
      },
      ad: {
        title: 'PENN & HEWLETT’S GENTLEMEN’S TOP HATS',
        tagline: 'Waterproofed Beaver Silk of Highest London Quality',
        body: 'Fitted by Royal Warrant to the House of Lords. Shipped securely in cedar trunks to all corners of the civilized globe.',
        cta: 'Showrooms at 14 Piccadilly, London',
        iconType: 'hat',
      },
      stamp: {
        enabled: true,
        text: 'ROYAL SEAL',
        color: 'gold',
        rotation: 0,
      },
      paper: {
        theme: 'aged',
        showCreases: true,
        showCoffeeRing: false,
        showBarcode: false,
        ornamentStyle: 'victorian',
      },
    },
  },
  {
    id: 'cyber-dispatch',
    name: 'The Cyberpunk Dispatch 2088',
    era: '2088 Neo-Tokyo Matrix',
    description: 'Dark mode neon broadsheet, glowing headlines, cybernetic dateline, holographic glitch aesthetics.',
    template: {
      id: 'cyber-dispatch',
      name: 'THE CYBER DISPATCH',
      masthead: {
        title: 'THE CYBER DISPATCH',
        submotto: '“DECENTRALIZED QUANTUM NEWS FEED • NODE // 8804-A”',
        latinMotto: 'DATA LIBERTAS EST • BROADCAST ACROSS ALL ORBITAL STATIONS',
        font: 'cinzel',
        alignment: 'center',
        bannerBadge: 'LIVE NEURAL LINK',
      },
      meta: {
        city: 'NEO-TOKYO • NIGHT CITY • ORBITAL RING 4',
        date: 'CYCLE 88.304 // TUESDAY, NOV 28, 2088',
        volume: 'BLOCK #9,481,209',
        issue: 'EPOCH 44',
        edition: 'GLOBAL CYBER STREAM',
        price: '0.004 ETH / FREE NODE',
        weather: {
          temp: '28°C / ACID RAIN',
          condition: 'Heavy Neon Smog 89% Humidity',
          icon: '⚡',
        },
      },
      breakingRibbon: {
        enabled: true,
        text: 'CRITICAL ALERT: NEURAL SPEED RECORD BROKEN AS OPERATOR SYNCS 300 WPM DIRECTLY TO THE MAINFRAME',
      },
      mainArticle: {
        headline: 'QUANTUM OVERCLOCK: NETRUNNER SHATTERS SYNAPSE SPEED MATRIX',
        subheadline: 'Megacorp AI Core Surpassed in Live Turing Duel Across Underground Fiber Network',
        byline: 'BY GHOST_IN_THE_NET // CYBER BEAT',
        dateline: 'SECTOR 07',
        leadParagraph: 'In an underground cyber-deck speakeasy thirty levels below the neon sprawl of Sector 7, the digital sound of impossible keystrokes echoed through liquid nitrogen cooling stacks.',
        bodyParagraphs: [
          'No implants were rejected as the human interface synced with the raw quantum stream. Spectators witnessed the buffer fill at an unprecedented 340 words per minute with 99.8% precision.',
          '“The neural feedback loop was singing,” reported the deck technician holding the voltage monitor. “Not a single lost packet across seventy gigabytes of encrypted memory.”',
          'The ruling council has officially recognized the operator into the Hall of Cyberspace Legends.',
        ],
        columns: 2,
        showDropCap: true,
      },
      heroPhoto: {
        url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=900&auto=format&fit=crop&q=80',
        caption: 'Holo-Feed 09: Glowing terminal monitors reflecting the neon skyline during peak data transmission.',
        credit: 'Satellite Uplink by Orbital Grid Cam 4',
        filter: 'none',
        aspectRatio: '16/9',
        showBorder: true,
        borderStyle: 'double',
      },
      secondaryStories: [
        {
          id: 'cyber-1',
          title: 'Orbital Elevator Car 12 Completes 10,000th Ascent',
          author: 'Station Wire',
          snippet: 'The carbon nanotube transit line delivered 400 metric tons of fresh hydroponic supplies to Lunar Base Alpha.',
          category: 'OFF-WORLD',
        },
        {
          id: 'cyber-2',
          title: 'Holographic Synthwave Festival Announced',
          author: 'Neon Pulse',
          snippet: 'Over 500,000 virtual avatars will connect simultaneously for a 72-hour zero-gravity electronic concert.',
          category: 'CULTURE',
        },
      ],
      editorial: {
        title: 'Silicon and Synapse',
        editorName: 'AI Core v4.2',
        text: 'The boundary between machine logic and human intuition is not a wall, but a bridge built one precise stroke at a time.',
      },
      quoteOfTheDay: {
        quote: '“The future is already here — it’s just not evenly distributed.”',
        author: 'William Gibson',
      },
      ad: {
        title: 'CYBER-DECK MK-IX MECHANICAL PLUG',
        tagline: 'Gold-Plated Mechanical Switches with Sub-Millisecond Ping!',
        body: 'Hardwired anti-EMP shielding. Includes optical laser feedback and customizable RGB reactive keycaps.',
        cta: 'Order via Neural Wallet @ Node 4409',
        iconType: 'star',
      },
      stamp: {
        enabled: true,
        text: 'VERIFIED ON-CHAIN',
        color: 'cyan',
        rotation: -10,
      },
      paper: {
        theme: 'noir',
        showCreases: false,
        showCoffeeRing: false,
        showBarcode: true,
        ornamentStyle: 'cyber',
      },
    },
  },
];

export const HISTORICAL_STORY_PACKS = [
  {
    id: 'moon-landing',
    name: '🌕 Man Walks On The Moon (1969)',
    headline: 'MEN WALK ON MOON! ASTRONAUTS LAND ON PLAIN; COLLECT ROCKS, PLANT FLAG',
    subhead: 'A Powdery Surface Is Explored As Apollo 11 Crew Fulfills Mankind’s Longest Dream',
    date: 'MONDAY, JULY 21, 1969',
    city: 'HOUSTON & CAPE KENNEDY',
    photoUrl: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=900&auto=format&fit=crop&q=80',
    photoCaption: 'Fig. 1 — Man takes his first historic steps upon the lunar surface beneath a pitch-black cosmos.',
    lead: 'Two American astronauts landed on the moon yesterday, stepped onto its powdery surface, and opened an extraordinary new chapter in human history.',
    body: [
      '“That’s one small step for man, one giant leap for mankind,” radioed Commander Neil A. Armstrong as his left boot touched the lunar crust at 10:56 P.M. Eastern Daylight Time.',
      'A worldwide television audience estimated in the hundreds of millions watched the live black-and-white broadcast as the explorers unpacked scientific instruments and raised the Stars and Stripes.',
      'The lunar module Eagle touched down in the Sea of Tranquility four miles from its target site following a hair-raising manual descent over boulder-strewn craters.',
    ],
  },
  {
    id: 'titanic',
    name: '🚢 Titanic Disaster (1912)',
    headline: 'TITANIC SINKS FOUR HOURS AFTER HITTING ICEBERG; RESCUE SHIPS SPEED TO SCENE',
    subhead: 'Greatest Ocean Liner of the Age Plunges into Icy Atlantic Deep with 2,200 Souls Aboard',
    date: 'TUESDAY, APRIL 16, 1912',
    city: 'NEW YORK & SOUTHAMPTON',
    photoUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=900&auto=format&fit=crop&q=80',
    photoCaption: 'Fig. 1 — The White Star liner Titanic photographed as she departed Southampton harbor on her maiden voyage.',
    lead: 'The largest and most luxurious steamship ever constructed plunged to the bottom of the Atlantic Ocean early Monday morning four hours after striking a towering iceberg in dense fog.',
    body: [
      'Wireless distress signals tapped frantically through the freezing night air brought the Cunard liner Carpathia racing sixty miles through ice floes to rescue survivors in lifeboats.',
      'Crowds gathered in stunned silence outside steamship offices in London, New York, and Paris as names of the saved were posted by trembling teletype clerks.',
      'Naval authorities worldwide have pledged an immediate transformation of maritime safety laws to guarantee lifeboats for every passenger.',
    ],
  },
  {
    id: 'alien-sighting',
    name: '🛸 Extraterrestrial Sighting (Sensational)',
    headline: 'STRANGE CRAFT HOVERS OVER METROPOLIS! SCIENTISTS BAFFLED BY LUMINOUS PHENOMENON',
    subhead: 'Thousands Watch in Wonder as Mysterious Disc Emits Harmless Harmonic Tones Before Vanishing into Stratosphere',
    date: 'SATURDAY, OCTOBER 31, 1953',
    city: 'CHICAGO & ROSWELL',
    photoUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=900&auto=format&fit=crop&q=80',
    photoCaption: 'Fig. 1 — Extraordinary flash photograph capturing the silver craft hovering above the city hall dome.',
    lead: 'An unexplained aerial craft radiating gentle cerulean luminescence hovered stationary above the central plaza for seventeen minutes yesterday evening.',
    body: [
      'Astronomers from the municipal observatory rushed to calibrate their optical telescopes as the object pulsed in perfect tempo with ambient radio waves.',
      'No sound of engines or propellers could be detected; witnesses described a melodious humming that calmed street crowds and caused church bells to resonate lightly in their towers.',
      'Military jets dispatched to investigate reported that the vessel accelerated at ten times the speed of sound toward the upper ionosphere without creating a sonic boom.',
    ],
  },
  {
    id: 'coffee-miracle',
    name: '☕ Coffee Declared Supreme Fuel (Humorous)',
    headline: 'SCIENTISTS CONFIRM: COFFEE IS INDEED THE DIVINE NECTAR OF HUMAN INGENUITY',
    subhead: 'Global Productivity Quadruples as Morning Brew Is Declared Essential Cultural Treasure by Universal Acclaim',
    date: 'WEDNESDAY, SEPTEMBER 15, 1948',
    city: 'VIENNA & SEATTLE',
    photoUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=900&auto=format&fit=crop&q=80',
    photoCaption: 'Fig. 1 — A steaming porcelain cup of dark roast, officially recognized as the cornerstone of literary and scientific triumphs.',
    lead: 'An international congress of neurologists, typists, and philosophers announced today their unanimous verdict: the roasted coffee bean is directly responsible for all modern literature and invention.',
    body: [
      '“Without that glorious dark cup in the morning,” remarked the Dean of Academic Research, “our most profound equations would remain untyped and our greatest novels unwritten.”',
      'Cafes and roast houses across the continents reported lines stretching around city blocks as patrons raised steaming mugs in celebration of the proclamation.',
      'Employers were officially advised to install emergency espresso dispensaries within twenty paces of every typewriter desk.',
    ],
  },
];

export const VINTAGE_PHOTO_GALLERY = [
  {
    name: 'Vintage Typewriter Desk',
    url: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=900&auto=format&fit=crop&q=80',
    credit: 'Classic Typewriter Studio',
  },
  {
    name: 'Crowd & Historic Triumph',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&auto=format&fit=crop&q=80',
    credit: 'Press Photo Archive',
  },
  {
    name: 'Historic City Architecture',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&auto=format&fit=crop&q=80',
    credit: 'Urban Archive Bureau',
  },
  {
    name: 'Noir Rainy Night',
    url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=900&auto=format&fit=crop&q=80',
    credit: 'Night Beat Photography',
  },
  {
    name: 'Vintage London Landmark',
    url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=900&auto=format&fit=crop&q=80',
    credit: 'Victorian Photographic Society',
  },
  {
    name: 'Moon & Cosmic Expedition',
    url: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=900&auto=format&fit=crop&q=80',
    credit: 'NASA Archive / Public Domain',
  },
  {
    name: 'Vintage Ocean Liner',
    url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=900&auto=format&fit=crop&q=80',
    credit: 'Maritime Heritage Press',
  },
  {
    name: 'Cyberpunk Neon Metropolis',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=900&auto=format&fit=crop&q=80',
    credit: 'Cyber Matrix Visuals',
  },
];
