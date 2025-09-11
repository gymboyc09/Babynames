import { CulturalInfo } from '@/types';

// Sample name database with cultural information
export const SAMPLE_NAMES: Array<{
  name: string;
  gender: 'male' | 'female' | 'unisex';
  cultural: CulturalInfo;
}> = [
  // Male names
  {
    name: 'Alexander',
    gender: 'male',
    cultural: {
      origin: 'Greek',
      meaning: 'Defender of men',
      popularity: 85,
      famousNamesakes: ['Alexander the Great', 'Alexander Graham Bell'],
      culturalSignificance: 'A name of great historical importance, associated with leadership and strength.',
      religiousSignificance: 'Common in Christian traditions'
    }
  },
  {
    name: 'Benjamin',
    gender: 'male',
    cultural: {
      origin: 'Hebrew',
      meaning: 'Son of the right hand',
      popularity: 78,
      famousNamesakes: ['Benjamin Franklin', 'Benjamin Netanyahu'],
      culturalSignificance: 'A biblical name with strong traditional roots.',
      religiousSignificance: 'Biblical origin, son of Jacob and Rachel'
    }
  },
  {
    name: 'Christopher',
    gender: 'male',
    cultural: {
      origin: 'Greek',
      meaning: 'Bearer of Christ',
      popularity: 72,
      famousNamesakes: ['Christopher Columbus', 'Christopher Reeve'],
      culturalSignificance: 'A name that has been popular for centuries across many cultures.',
      religiousSignificance: 'Christian name meaning "Christ-bearer"'
    }
  },
  {
    name: 'Daniel',
    gender: 'male',
    cultural: {
      origin: 'Hebrew',
      meaning: 'God is my judge',
      popularity: 80,
      famousNamesakes: ['Daniel Defoe', 'Daniel Craig'],
      culturalSignificance: 'A timeless name with biblical origins.',
      religiousSignificance: 'Biblical prophet, known for wisdom and faith'
    }
  },
  {
    name: 'Ethan',
    gender: 'male',
    cultural: {
      origin: 'Hebrew',
      meaning: 'Strong, firm',
      popularity: 75,
      famousNamesakes: ['Ethan Hawke', 'Ethan Allen'],
      culturalSignificance: 'A name that conveys strength and reliability.',
      religiousSignificance: 'Biblical name, one of the wise men'
    }
  },
  
  // Female names
  {
    name: 'Amelia',
    gender: 'female',
    cultural: {
      origin: 'Germanic',
      meaning: 'Work, industrious',
      popularity: 88,
      famousNamesakes: ['Amelia Earhart', 'Amelia Bedelia'],
      culturalSignificance: 'A name associated with adventure and determination.',
      religiousSignificance: 'Secular name with strong character associations'
    }
  },
  {
    name: 'Charlotte',
    gender: 'female',
    cultural: {
      origin: 'French',
      meaning: 'Free woman',
      popularity: 90,
      famousNamesakes: ['Charlotte Brontë', 'Charlotte of Mecklenburg-Strelitz'],
      culturalSignificance: 'A royal name with literary connections.',
      religiousSignificance: 'Secular name with noble associations'
    }
  },
  {
    name: 'Emma',
    gender: 'female',
    cultural: {
      origin: 'Germanic',
      meaning: 'Universal, whole',
      popularity: 95,
      famousNamesakes: ['Emma Watson', 'Emma Stone'],
      culturalSignificance: 'A classic name that has remained popular for centuries.',
      religiousSignificance: 'Secular name with universal appeal'
    }
  },
  {
    name: 'Isabella',
    gender: 'female',
    cultural: {
      origin: 'Hebrew',
      meaning: 'God is my oath',
      popularity: 85,
      famousNamesakes: ['Isabella of Castile', 'Isabella Rossellini'],
      culturalSignificance: 'A name with royal and literary connections.',
      religiousSignificance: 'Biblical variant of Elizabeth'
    }
  },
  {
    name: 'Olivia',
    gender: 'female',
    cultural: {
      origin: 'Latin',
      meaning: 'Olive tree',
      popularity: 92,
      famousNamesakes: ['Olivia Newton-John', 'Olivia Wilde'],
      culturalSignificance: 'A name associated with peace and wisdom.',
      religiousSignificance: 'Symbol of peace in Christian tradition'
    }
  },
  
  // Unisex names
  {
    name: 'Alex',
    gender: 'unisex',
    cultural: {
      origin: 'Greek',
      meaning: 'Defender, helper',
      popularity: 70,
      famousNamesakes: ['Alex Morgan', 'Alex Rodriguez'],
      culturalSignificance: 'A modern, versatile name suitable for any gender.',
      religiousSignificance: 'Secular name with strong character associations'
    }
  },
  {
    name: 'Jordan',
    gender: 'unisex',
    cultural: {
      origin: 'Hebrew',
      meaning: 'To flow down',
      popularity: 65,
      famousNamesakes: ['Jordan Peele', 'Jordan Spieth'],
      culturalSignificance: 'A name with biblical and geographical significance.',
      religiousSignificance: 'Biblical river, symbol of crossing into new life'
    }
  },
  {
    name: 'Taylor',
    gender: 'unisex',
    cultural: {
      origin: 'English',
      meaning: 'Tailor, cloth cutter',
      popularity: 60,
      famousNamesakes: ['Taylor Swift', 'Taylor Lautner'],
      culturalSignificance: 'An occupational name that has become popular as a first name.',
      religiousSignificance: 'Secular occupational name'
    }
  },
  {
    name: 'Casey',
    gender: 'unisex',
    cultural: {
      origin: 'Irish',
      meaning: 'Brave in battle',
      popularity: 55,
      famousNamesakes: ['Casey Affleck', 'Casey Stengel'],
      culturalSignificance: 'An Irish name that has gained international popularity.',
      religiousSignificance: 'Secular name with Celtic origins'
    }
  },
  {
    name: 'Riley',
    gender: 'unisex',
    cultural: {
      origin: 'Irish',
      meaning: 'Courageous, valiant',
      popularity: 68,
      famousNamesakes: ['Riley Keough', 'Riley Reid'],
      culturalSignificance: 'A name that conveys strength and courage.',
      religiousSignificance: 'Secular name with Celtic warrior associations'
    }
  }
];

// Cultural origins for filtering
export const CULTURAL_ORIGINS = [
  'African', 'Arabic', 'Celtic', 'Chinese', 'Dutch', 'English', 'French',
  'German', 'Greek', 'Hebrew', 'Hindi', 'Irish', 'Italian', 'Japanese',
  'Korean', 'Latin', 'Native American', 'Norse', 'Persian', 'Russian',
  'Scandinavian', 'Scottish', 'Spanish', 'Swedish', 'Welsh'
];

// Popular name themes
export const NAME_THEMES = [
  'Nature', 'Virtue', 'Royal', 'Biblical', 'Mythological', 'Literary',
  'Historical', 'Modern', 'Traditional', 'Unique', 'International'
];

// Name length categories
export const NAME_LENGTHS = {
  short: { min: 2, max: 4 },
  medium: { min: 5, max: 7 },
  long: { min: 8, max: 12 }
};

// Popularity levels
export const POPULARITY_LEVELS = {
  veryPopular: { min: 80, max: 100 },
  popular: { min: 60, max: 79 },
  moderate: { min: 40, max: 59 },
  uncommon: { min: 20, max: 39 },
  rare: { min: 0, max: 19 }
};
