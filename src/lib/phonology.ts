import { PhonologyAnalysis } from '@/types';
import { isAvoidableNumber } from './numerology';

// Positive vibration letter combinations
const POSITIVE_VIBRATIONS = [
  'VS', 'VN', 'WN', 'VG', 'VB', 'VM', 'NV', 'MG', 'MK', 'MV', 'SA', 'KS', 'MY', 'PM', 'SV',
  'GA', 'AR', 'RA', 'RP', 'JN', 'AV', 'JA', 'PN', 'CO', 'CP', 'PC', 'MN', 'NM', 'AM', 'RS',
  'DA', 'AD', 'BA', 'GV', 'CV', 'LK', 'LV', 'AG', 'PM', 'PK', 'AP', 'AN', 'ARR', 'HA', 'MP',
  'VIN', 'VIND', 'ARARS', 'NJ', 'NS', 'UD', 'RUN', 'GAIN'
];

// Negative vibration letter combinations
const NEGATIVE_VIBRATIONS = [
  'VK', 'WAR', 'VH', 'VD', 'VO', 'NO', 'DI', 'DHI', 'AS', 'SH', 'ML', 'MAR', 'KL', 'SR', 'SS',
  'AH', 'AI', 'LO', 'RO', 'SC', 'SK', 'SU', 'END', 'VAR', 'NL', 'VL', 'BO', 'DU', 'MR', 'VR',
  'VC', 'DY', 'NA', 'NE', 'NI', 'MT', 'RJ', 'JR', 'OO', 'AK', 'IL', 'ER', 'KK', 'DM'
];

// Negative vibration words
const NEGATIVE_WORDS = [
  'SAD', 'LOSS', 'SAT', 'DOWN', 'LESS', 'ILL'
];

// Avoidable numerology numbers
const AVOIDABLE_NUMBERS = [4, 7, 8, 13, 16, 17, 18, 22, 25, 26, 28, 29, 31, 35, 38, 40, 43, 44, 47, 48, 52, 53, 56, 61, 62, 80];

/**
 * Analyze the phonology of a name
 */
export function analyzePhonology(name: string, chaldeanValue?: number, pythagoreanValue?: number): PhonologyAnalysis {
  const cleanName = name.toLowerCase().trim();
  
  // Basic syllable counting (simplified)
  const syllables = countSyllables(cleanName);
  
  // Pronunciation difficulty assessment
  const difficulty = assessDifficulty(cleanName);
  
  // Stress pattern (simplified)
  const stressPattern = getStressPattern(cleanName);
  
  // Phonetic transcription (simplified IPA)
  const phoneticTranscription = getPhoneticTranscription(cleanName);
  
  // Nickname potential
  const nicknamePotential = generateNicknames(cleanName);
  
  // Vibration analysis
  const vibration = analyzeVibration(name, chaldeanValue, pythagoreanValue);
  
  return {
    syllables,
    pronunciation: cleanName,
    difficulty,
    stressPattern,
    phoneticTranscription,
    nicknamePotential,
    vibration
  };
}

/**
 * Count syllables in a word (simplified algorithm)
 */
function countSyllables(word: string): number {
  // Remove silent 'e' at the end
  let cleanWord = word.replace(/e$/, '');
  
  // Count vowel groups
  const vowelGroups = cleanWord.match(/[aeiouy]+/g);
  const syllableCount = vowelGroups ? vowelGroups.length : 1;
  
  // Minimum 1 syllable
  return Math.max(1, syllableCount);
}

/**
 * Assess pronunciation difficulty
 */
function assessDifficulty(name: string): 'easy' | 'medium' | 'hard' {
  let difficultyScore = 0;
  
  // Check for difficult letter combinations
  const difficultCombinations = ['th', 'ch', 'sh', 'ph', 'gh', 'qu', 'x', 'z'];
  for (const combo of difficultCombinations) {
    if (name.includes(combo)) difficultyScore += 2;
  }
  
  // Check for silent letters
  const silentLetters = ['k', 'w', 'h'];
  for (const letter of silentLetters) {
    if (name.includes(letter)) difficultyScore += 1;
  }
  
  // Check length
  if (name.length > 8) difficultyScore += 2;
  if (name.length > 12) difficultyScore += 3;
  
  // Check for uncommon letters
  const uncommonLetters = ['q', 'x', 'z', 'j'];
  for (const letter of uncommonLetters) {
    if (name.includes(letter)) difficultyScore += 1;
  }
  
  if (difficultyScore <= 2) return 'easy';
  if (difficultyScore <= 5) return 'medium';
  return 'hard';
}

/**
 * Get stress pattern (simplified)
 */
function getStressPattern(name: string): string {
  const syllables = countSyllables(name);
  
  if (syllables === 1) return '1';
  if (syllables === 2) return '1-2'; // First syllable stressed
  if (syllables === 3) return '1-2-3'; // First syllable stressed
  if (syllables === 4) return '1-2-3-4'; // First syllable stressed
  
  return '1-2-3-4-5'; // Default pattern
}

/**
 * Generate phonetic transcription (simplified IPA)
 */
function getPhoneticTranscription(name: string): string {
  // Simplified phonetic mapping
  const phoneticMap: Record<string, string> = {
    'a': 'æ', 'e': 'ɛ', 'i': 'ɪ', 'o': 'ɔ', 'u': 'ʌ',
    'th': 'θ', 'ch': 'tʃ', 'sh': 'ʃ', 'ph': 'f',
    'qu': 'kw', 'x': 'ks', 'z': 'z'
  };
  
  let transcription = name;
  
  // Apply phonetic transformations
  for (const [letter, phonetic] of Object.entries(phoneticMap)) {
    transcription = transcription.replace(new RegExp(letter, 'g'), phonetic);
  }
  
  return `/${transcription}/`;
}

/**
 * Generate potential nicknames
 */
function generateNicknames(name: string): string[] {
  const nicknames: string[] = [];
  
  // First 2-3 letters
  if (name.length >= 3) {
    nicknames.push(name.substring(0, 2));
    nicknames.push(name.substring(0, 3));
  }
  
  // First syllable
  const firstSyllable = getFirstSyllable(name);
  if (firstSyllable && firstSyllable !== name) {
    nicknames.push(firstSyllable);
  }
  
  // Common nickname patterns
  if (name.endsWith('y') || name.endsWith('ie')) {
    nicknames.push(name.substring(0, name.length - 1) + 'y');
  }
  
  if (name.endsWith('er') || name.endsWith('ar')) {
    nicknames.push(name.substring(0, name.length - 2) + 'y');
  }
  
  // Remove duplicates and return unique nicknames
  return [...new Set(nicknames)].slice(0, 5);
}

/**
 * Get the first syllable of a word
 */
function getFirstSyllable(word: string): string {
  const vowels = 'aeiouy';
  let syllableEnd = 0;
  
  for (let i = 0; i < word.length; i++) {
    if (vowels.includes(word[i])) {
      syllableEnd = i + 1;
      break;
    }
  }
  
  return word.substring(0, syllableEnd);
}

/**
 * Check if two names rhyme
 */
export function checkRhyme(name1: string, name2: string): boolean {
  const ending1 = name1.toLowerCase().slice(-3);
  const ending2 = name2.toLowerCase().slice(-3);
  
  return ending1 === ending2;
}

/**
 * Check for alliteration
 */
export function checkAlliteration(name1: string, name2: string): boolean {
  const first1 = name1.toLowerCase().charAt(0);
  const first2 = name2.toLowerCase().charAt(0);
  
  return first1 === first2 && first1 !== '';
}

/**
 * Analyze sound symbolism
 */
export function analyzeSoundSymbolism(name: string): {
  vowelConsonantRatio: number;
  hardSounds: number;
  softSounds: number;
  overallTone: 'hard' | 'soft' | 'balanced';
} {
  const vowels = 'aeiouy';
  const hardConsonants = 'bcdgjkpqtxz';
  const softConsonants = 'flmnrsvw';
  
  let vowelCount = 0;
  let hardCount = 0;
  let softCount = 0;
  
  for (const char of name.toLowerCase()) {
    if (vowels.includes(char)) {
      vowelCount++;
    } else if (hardConsonants.includes(char)) {
      hardCount++;
    } else if (softConsonants.includes(char)) {
      softCount++;
    }
  }
  
  const totalConsonants = hardCount + softCount;
  const vowelConsonantRatio = totalConsonants > 0 ? vowelCount / totalConsonants : 1;
  
  let overallTone: 'hard' | 'soft' | 'balanced';
  if (hardCount > softCount * 1.5) {
    overallTone = 'hard';
  } else if (softCount > hardCount * 1.5) {
    overallTone = 'soft';
  } else {
    overallTone = 'balanced';
  }
  
  return {
    vowelConsonantRatio,
    hardSounds: hardCount,
    softSounds: softCount,
    overallTone
  };
}

/**
 * Analyze vibration patterns in a name
 */
function analyzeVibration(name: string, chaldeanValue?: number, pythagoreanValue?: number): {
  type: 'positive' | 'negative' | 'neutral';
  positiveCombinations: string[];
  negativeCombinations: string[];
  score: number;
  numerologyWarning: boolean;
} {
  const upperName = name.toUpperCase();
  const positiveCombinations: string[] = [];
  const negativeCombinations: string[] = [];
  
  // Check for positive vibration combinations
  for (const combination of POSITIVE_VIBRATIONS) {
    if (upperName.includes(combination)) {
      positiveCombinations.push(combination);
    }
  }
  
  // Check for negative vibration combinations
  for (const combination of NEGATIVE_VIBRATIONS) {
    if (upperName.includes(combination)) {
      negativeCombinations.push(combination);
    }
  }
  
  // Check for negative words
  for (const word of NEGATIVE_WORDS) {
    if (upperName.includes(word)) {
      negativeCombinations.push(word);
    }
  }
  
  // Calculate vibration score
  const positiveScore = positiveCombinations.length * 2; // Positive combinations get more weight
  const negativeScore = negativeCombinations.length;
  const totalScore = positiveScore - negativeScore;
  
  // Determine vibration type
  let type: 'positive' | 'negative' | 'neutral';
  if (totalScore > 0) {
    type = 'positive';
  } else if (totalScore < 0) {
    type = 'negative';
  } else {
    type = 'neutral';
  }
  
  // Check for avoidable numerology numbers
  const numerologyWarning = (chaldeanValue && isAvoidableNumber(chaldeanValue)) || 
                           (pythagoreanValue && isAvoidableNumber(pythagoreanValue));
  
  return {
    type,
    positiveCombinations,
    negativeCombinations,
    score: Math.max(-10, Math.min(10, totalScore)), // Clamp score between -10 and 10
    numerologyWarning
  };
}
