export interface NumerologyResult {
  name: string;
  dateOfBirth?: string;       // Optional DOB for Life Path calculation
  pythagorean: {
    totalValue: number;
    reducedValue: number;
    meaning: string;
    characteristics: string[];
    compatibility: string[];
    warnings: string[];
    letterBreakdown: { letter: string; value: number }[];
  };
  chaldean: {
    totalValue: number;
    reducedValue: number;
    meaning: string;
    characteristics: string[];
    compatibility: string[];
    warnings: string[];
    letterBreakdown: { letter: string; value: number }[];
  };
  coreNumbers: {
    lifePath: number;         // Sum of birth date (DOB based)
    destiny: number;          // Sum of all letters (full name)
    soul: number;            // Sum of vowels only (Heart Desire)
    personality: number;     // Sum of consonants only
    radical: number;         // Sum of first name only
  };
}

export interface PhonologyResult {
  name: string;
  syllables: number;
  vowelCount: number;
  consonantCount: number;
  phoneticAnalysis: string;
  pronunciation: string;
  culturalNotes: string[];
}

// Numerology calculation functions
export function calculateNumerology(name: string, dateOfBirth?: string): NumerologyResult {
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, '');
  
  // Pythagorean letter values
  const pythagoreanValues: { [key: string]: number } = {
    'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 6, 'g': 7, 'h': 8, 'i': 9,
    'j': 1, 'k': 2, 'l': 3, 'm': 4, 'n': 5, 'o': 6, 'p': 7, 'q': 8, 'r': 9,
    's': 1, 't': 2, 'u': 3, 'v': 4, 'w': 5, 'x': 6, 'y': 7, 'z': 8
  };

  // Chaldean letter values
  const chaldeanValues: { [key: string]: number } = {
    'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 8, 'g': 3, 'h': 5, 'i': 1,
    'j': 1, 'k': 2, 'l': 3, 'm': 4, 'n': 5, 'o': 7, 'p': 8, 'q': 1, 'r': 2,
    's': 3, 't': 4, 'u': 6, 'v': 6, 'w': 6, 'x': 5, 'y': 1, 'z': 7
  };

  // Calculate Pythagorean values with letter breakdown
  let pythagoreanTotal = 0;
  const pythagoreanBreakdown: { letter: string; value: number }[] = [];
  for (const letter of cleanName) {
    const value = pythagoreanValues[letter] || 0;
    pythagoreanTotal += value;
    pythagoreanBreakdown.push({ letter: letter.toUpperCase(), value });
  }
  const pythagoreanReduced = reduceToSingleDigit(pythagoreanTotal);

  // Calculate Chaldean values with letter breakdown
  let chaldeanTotal = 0;
  const chaldeanBreakdown: { letter: string; value: number }[] = [];
  for (const letter of cleanName) {
    const value = chaldeanValues[letter] || 0;
    chaldeanTotal += value;
    chaldeanBreakdown.push({ letter: letter.toUpperCase(), value });
  }
  const chaldeanReduced = reduceToSingleDigit(chaldeanTotal);

  // Calculate core numbers
  const coreNumbers = calculateCoreNumbers(cleanName, dateOfBirth);

  return {
    name: name,
    dateOfBirth: dateOfBirth,
    pythagorean: {
      totalValue: pythagoreanTotal,
      reducedValue: pythagoreanReduced,
      meaning: getNumerologyMeaning(pythagoreanReduced),
      characteristics: getCharacteristics(pythagoreanReduced),
      compatibility: getCompatibility(pythagoreanReduced),
      warnings: getWarnings(pythagoreanReduced),
      letterBreakdown: pythagoreanBreakdown
    },
    chaldean: {
      totalValue: chaldeanTotal,
      reducedValue: chaldeanReduced,
      meaning: getNumerologyMeaning(chaldeanReduced),
      characteristics: getCharacteristics(chaldeanReduced),
      compatibility: getCompatibility(chaldeanReduced),
      warnings: getWarnings(chaldeanReduced),
      letterBreakdown: chaldeanBreakdown
    },
    coreNumbers
  };
}

function calculateCoreNumbers(name: string, dateOfBirth?: string) {
  const vowels = 'aeiou';
  const consonants = 'bcdfghjklmnpqrstvwxyz';
  
  // Split name into parts (first name, middle name, last name)
  const nameParts = name.toLowerCase().split(/\s+/).filter(part => part.length > 0);
  const firstName = nameParts[0] || '';
  const fullName = nameParts.join('');
  
  let vowelSum = 0;
  let consonantSum = 0;
  let firstNameSum = 0;
  
  // Calculate for full name using Chaldean values
  for (const letter of fullName) {
    const value = getChaldeanLetterValue(letter);
    if (vowels.includes(letter)) {
      vowelSum += value;
    } else if (consonants.includes(letter)) {
      consonantSum += value;
    }
  }
  
  // Calculate for first name only using Chaldean values
  for (const letter of firstName) {
    firstNameSum += getChaldeanLetterValue(letter);
  }
  
  // Calculate Life Path Number from birth date
  let lifePath = 0;
  if (dateOfBirth) {
    lifePath = calculateLifePathNumber(dateOfBirth);
  }
  
  return {
    lifePath: lifePath,                                        // Birth date based
    destiny: reduceToSingleDigit(vowelSum + consonantSum),    // All letters (full name) - Chaldean
    soul: reduceToSingleDigit(vowelSum),                      // Vowels only (Heart Desire) - Chaldean
    personality: reduceToSingleDigit(consonantSum),           // Consonants only - Chaldean
    radical: reduceToSingleDigit(firstNameSum)                // First name only - Chaldean
  };
}

function calculateLifePathNumber(dateOfBirth: string): number {
  // Parse date of birth (format: YYYY-MM-DD or DD/MM/YYYY or MM/DD/YYYY)
  let day: number, month: number, year: number;
  
  if (dateOfBirth.includes('/')) {
    // Handle DD/MM/YYYY or MM/DD/YYYY format
    const parts = dateOfBirth.split('/');
    if (parts[0].length === 4) {
      // YYYY/MM/DD format
      [year, month, day] = parts.map(Number);
    } else {
      // Assume DD/MM/YYYY format
      [day, month, year] = parts.map(Number);
    }
  } else if (dateOfBirth.includes('-')) {
    // Handle YYYY-MM-DD format
    const parts = dateOfBirth.split('-');
    [year, month, day] = parts.map(Number);
  } else {
    return 0; // Invalid format
  }
  
  // Calculate Life Path Number
  let lifePath = day + month + year;
  
  // Reduce to single digit (except master numbers)
  return reduceToSingleDigit(lifePath);
}

function getLetterValue(letter: string): number {
  const values: { [key: string]: number } = {
    'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 6, 'g': 7, 'h': 8, 'i': 9,
    'j': 1, 'k': 2, 'l': 3, 'm': 4, 'n': 5, 'o': 6, 'p': 7, 'q': 8, 'r': 9,
    's': 1, 't': 2, 'u': 3, 'v': 4, 'w': 5, 'x': 6, 'y': 7, 'z': 8
  };
  return values[letter] || 0;
}

function getChaldeanLetterValue(letter: string): number {
  const values: { [key: string]: number } = {
    'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 8, 'g': 3, 'h': 5, 'i': 1,
    'j': 1, 'k': 2, 'l': 3, 'm': 4, 'n': 5, 'o': 7, 'p': 8, 'q': 1, 'r': 2,
    's': 3, 't': 4, 'u': 6, 'v': 6, 'w': 6, 'x': 5, 'y': 1, 'z': 7
  };
  return values[letter] || 0;
}

function reduceToSingleDigit(num: number): number {
  // Master numbers (11, 22, 33, 44) should not be reduced
  const masterNumbers = [11, 22, 33, 44];
  if (masterNumbers.includes(num)) {
    return num;
  }
  
  while (num > 9) {
    num = num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
    // Check if the result is a master number
    if (masterNumbers.includes(num)) {
      return num;
    }
  }
  return num;
}

function getNumerologyMeaning(value: number): string {
  const meanings: { [key: number]: string } = {
    1: "Leadership, independence, and innovation",
    2: "Cooperation, diplomacy, and harmony",
    3: "Creativity, expression, and communication",
    4: "Stability, organization, and hard work",
    5: "Adventure, freedom, and versatility",
    6: "Responsibility, nurturing, and balance",
    7: "Spirituality, analysis, and wisdom",
    8: "Ambition, material success, and authority",
    9: "Humanitarianism, completion, and wisdom",
    11: "Intuitive, inspirational, and visionary (Master Number)",
    22: "Master builder, practical visionary (Master Number)",
    33: "Master teacher, compassionate healer (Master Number)",
    44: "Master healer, practical idealist (Master Number)"
  };
  return meanings[value] || "Unknown meaning";
}

function getCharacteristics(value: number): string[] {
  const characteristics: { [key: number]: string[] } = {
    1: ["Independent", "Pioneering", "Determined", "Self-reliant"],
    2: ["Cooperative", "Diplomatic", "Patient", "Supportive"],
    3: ["Creative", "Expressive", "Optimistic", "Social"],
    4: ["Practical", "Organized", "Reliable", "Hardworking"],
    5: ["Adventurous", "Versatile", "Curious", "Dynamic"],
    6: ["Responsible", "Nurturing", "Caring", "Balanced"],
    7: ["Analytical", "Spiritual", "Intuitive", "Thoughtful"],
    8: ["Ambitious", "Materialistic", "Authoritative", "Goal-oriented"],
    9: ["Humanitarian", "Compassionate", "Wise", "Generous"]
  };
  return characteristics[value] || [];
}

function getCompatibility(value: number): string[] {
  const compatibility: { [key: number]: string[] } = {
    1: ["1", "5", "7"],
    2: ["2", "4", "8"],
    3: ["3", "6", "9"],
    4: ["2", "4", "8"],
    5: ["1", "5", "7"],
    6: ["3", "6", "9"],
    7: ["1", "5", "7"],
    8: ["2", "4", "8"],
    9: ["3", "6", "9"]
  };
  return compatibility[value] || [];
}

function getWarnings(value: number): string[] {
  const warnings: { [key: number]: string[] } = {
    1: ["May be too independent", "Can be stubborn"],
    2: ["May be too dependent", "Can be indecisive"],
    3: ["May be scattered", "Can be superficial"],
    4: ["May be too rigid", "Can be inflexible"],
    5: ["May be restless", "Can be irresponsible"],
    6: ["May be overprotective", "Can be controlling"],
    7: ["May be too analytical", "Can be withdrawn"],
    8: ["May be too materialistic", "Can be ruthless"],
    9: ["May be too idealistic", "Can be impractical"]
  };
  return warnings[value] || [];
}
