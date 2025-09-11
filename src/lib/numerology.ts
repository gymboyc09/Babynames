import { NumerologyResult, LetterValue } from '@/types';

// Chaldean Numerology mapping
const CHALDEAN_VALUES: Record<string, number> = {
  'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 8, 'G': 3, 'H': 5,
  'I': 1, 'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 7, 'P': 8,
  'Q': 1, 'R': 2, 'S': 3, 'T': 4, 'U': 6, 'V': 6, 'W': 6, 'X': 5,
  'Y': 1, 'Z': 7
};

// Pythagorean Numerology mapping
const PYTHAGOREAN_VALUES: Record<string, number> = {
  'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8,
  'I': 9, 'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 6, 'P': 7,
  'Q': 8, 'R': 9, 'S': 1, 'T': 2, 'U': 3, 'V': 4, 'W': 5, 'X': 6,
  'Y': 7, 'Z': 8
};

// Master numbers in numerology
const MASTER_NUMBERS = [11, 22, 33];

// Sacred number in Chaldean numerology
const SACRED_NUMBER = 9;

// Avoidable numerology numbers
const AVOIDABLE_NUMBERS = [4, 7, 8, 13, 16, 17, 18, 22, 25, 26, 28, 29, 31, 35, 38, 40, 43, 44, 47, 48, 52, 53, 56, 61, 62, 80];

/**
 * Calculate numerology for a given name
 */
export function calculateNumerology(name: string): NumerologyResult {
  const cleanName = name.toUpperCase().replace(/[^A-Z]/g, '');
  
  if (!cleanName) {
    return {
      chaldean: { value: 0, breakdown: [], isMasterNumber: false, isSacredNumber: false },
      pythagorean: { value: 0, breakdown: [], isMasterNumber: false }
    };
  }

  const breakdown: LetterValue[] = [];
  let chaldeanSum = 0;
  let pythagoreanSum = 0;

  // Calculate values for each letter
  for (const letter of cleanName) {
    const chaldeanValue = CHALDEAN_VALUES[letter] || 0;
    const pythagoreanValue = PYTHAGOREAN_VALUES[letter] || 0;
    
    breakdown.push({
      letter,
      chaldeanValue,
      pythagoreanValue
    });
    
    chaldeanSum += chaldeanValue;
    pythagoreanSum += pythagoreanValue;
  }

  // Calculate final values
  const chaldeanValue = reduceChaldeanToSingleDigit(chaldeanSum);
  const pythagoreanValue = reduceToSingleDigit(pythagoreanSum);

  return {
    chaldean: {
      value: chaldeanValue,
      breakdown,
      isMasterNumber: MASTER_NUMBERS.includes(chaldeanValue),
      isSacredNumber: chaldeanValue === SACRED_NUMBER
    },
    pythagorean: {
      value: pythagoreanValue,
      breakdown,
      isMasterNumber: MASTER_NUMBERS.includes(pythagoreanValue)
    }
  };
}

/**
 * Reduce a number to a single digit, preserving master numbers
 */
function reduceToSingleDigit(num: number): number {
  if (MASTER_NUMBERS.includes(num)) {
    return num;
  }
  
  while (num > 9) {
    num = num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
    if (MASTER_NUMBERS.includes(num)) {
      return num;
    }
  }
  
  return num;
}

/**
 * Reduce a number to a single digit for Chaldean numerology
 * 9 is sacred and should not be reduced, but other numbers should be reduced
 */
function reduceChaldeanToSingleDigit(num: number): number {
  // If the number is 9, it's sacred and should not be reduced
  if (num === SACRED_NUMBER) {
    return num;
  }
  
  // If it's a master number, preserve it
  if (MASTER_NUMBERS.includes(num)) {
    return num;
  }
  
  // Reduce to single digit, but if we get 9, keep it as 9
  while (num > 9) {
    num = num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
    if (num === SACRED_NUMBER) {
      return num;
    }
    if (MASTER_NUMBERS.includes(num)) {
      return num;
    }
  }
  
  return num;
}

/**
 * Get numerological meaning for a number
 */
export function getNumerologicalMeaning(number: number, system: 'chaldean' | 'pythagorean'): string {
  const meanings = {
    chaldean: {
      1: "Leadership, independence, originality. Strong will and determination.",
      2: "Cooperation, diplomacy, sensitivity. Natural peacemaker.",
      3: "Creativity, self-expression, optimism. Artistic and communicative.",
      4: "Stability, practicality, hard work. Methodical and reliable.",
      5: "Freedom, adventure, versatility. Dynamic and progressive.",
      6: "Responsibility, nurturing, harmony. Family-oriented and caring.",
      7: "Spirituality, analysis, wisdom. Introspective and philosophical.",
      8: "Material success, authority, ambition. Strong business sense.",
      9: "Humanitarianism, completion, wisdom. Universal love and service.",
      11: "Intuition, inspiration, enlightenment. Spiritual teacher.",
      22: "Master builder, practical idealism. Large-scale achievements.",
      33: "Master teacher, compassion, healing. Spiritual guidance."
    },
    pythagorean: {
      1: "Pioneer, leader, innovator. Strong individuality and determination.",
      2: "Cooperative, diplomatic, intuitive. Natural mediator.",
      3: "Creative, expressive, optimistic. Artistic and social.",
      4: "Practical, organized, reliable. Strong work ethic.",
      5: "Adventurous, freedom-loving, versatile. Dynamic and progressive.",
      6: "Nurturing, responsible, harmonious. Family and community focused.",
      7: "Analytical, spiritual, wise. Seeker of truth and knowledge.",
      8: "Ambitious, material success, authority. Strong leadership potential.",
      9: "Compassionate, humanitarian, wise. Universal understanding.",
      11: "Intuitive, inspirational, visionary. Spiritual enlightenment.",
      22: "Master builder, practical visionary. Large-scale impact.",
      33: "Master healer, compassionate teacher. Spiritual service."
    }
  };

  return meanings[system][number as keyof typeof meanings.chaldean] || "Unknown meaning.";
}

/**
 * Check if a number is compatible with another
 */
export function checkNumerologicalCompatibility(num1: number, num2: number): number {
  // Simple compatibility scoring (0-100)
  const diff = Math.abs(num1 - num2);
  
  if (diff === 0) return 100; // Perfect match
  if (diff === 1) return 80;  // Very compatible
  if (diff === 2) return 60;  // Compatible
  if (diff === 3) return 40;  // Somewhat compatible
  if (diff === 4) return 20;  // Less compatible
  return 10; // Low compatibility
}

/**
 * Generate lucky numbers based on numerology
 */
export function generateLuckyNumbers(mainNumber: number): number[] {
  const luckyNumbers = [mainNumber];
  
  // Add related numbers
  if (mainNumber > 9) {
    const reduced = reduceToSingleDigit(mainNumber);
    if (!luckyNumbers.includes(reduced)) {
      luckyNumbers.push(reduced);
    }
  }
  
  // Add complementary numbers
  const complementary = 10 - (mainNumber % 10);
  if (complementary !== mainNumber && complementary > 0) {
    luckyNumbers.push(complementary);
  }
  
  return luckyNumbers.slice(0, 5); // Return up to 5 lucky numbers
}

/**
 * Check if a numerology number is avoidable
 */
export function isAvoidableNumber(number: number): boolean {
  return AVOIDABLE_NUMBERS.includes(number);
}
