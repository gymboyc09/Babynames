export interface PhonologyResult {
  name: string;
  syllables: number;
  vowelCount: number;
  consonantCount: number;
  phoneticAnalysis: string;
  pronunciation: string;
  culturalNotes: string[];
  vibrations: {
    energy: number;
    frequency: string;
    resonance: string;
    harmony: string;
    score: number;
    rating: string;
  };
  soundPatterns: {
    alliteration: string[];
    assonance: string[];
    rhythm: string;
    flow: string;
  };
  vibratoryScience: {
    positiveCombinations: string[];
    negativeCombinations: string[];
    overallVibration: 'Positive' | 'Negative' | 'Neutral';
    avoidableNumbers: number[];
  };
}

export function analyzePhonology(name: string): PhonologyResult {
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, '');
  
  const vowels = 'aeiou';
  const vowelCount = cleanName.split('').filter(char => vowels.includes(char)).length;
  const consonantCount = cleanName.length - vowelCount;
  
  const syllables = countSyllables(cleanName);
  const phoneticAnalysis = getPhoneticAnalysis(cleanName);
  const pronunciation = getPronunciation(cleanName);
  const culturalNotes = getCulturalNotes(cleanName);
  const vibrations = calculateVibrations(cleanName);
  const soundPatterns = analyzeSoundPatterns(cleanName);
  const vibratoryScience = analyzeVibratoryScience(cleanName);

  return {
    name: name,
    syllables,
    vowelCount,
    consonantCount,
    phoneticAnalysis,
    pronunciation,
    culturalNotes,
    vibrations,
    soundPatterns,
    vibratoryScience
  };
}

function calculateVibrations(name: string) {
  const vowelEnergy = name.split('').filter(char => 'aeiou'.includes(char)).length * 2;
  const consonantEnergy = name.split('').filter(char => 'bcdfghjklmnpqrstvwxyz'.includes(char)).length;
  const totalEnergy = vowelEnergy + consonantEnergy;
  
  let frequency = 'Low';
  if (totalEnergy > 15) frequency = 'High';
  else if (totalEnergy > 10) frequency = 'Medium';
  
  let resonance = 'Gentle';
  if (name.includes('r') || name.includes('l')) resonance = 'Strong';
  if (name.includes('m') || name.includes('n')) resonance = 'Soft';
  
  let harmony = 'Balanced';
  const vowelRatio = name.split('').filter(char => 'aeiou'.includes(char)).length / name.length;
  if (vowelRatio > 0.5) harmony = 'Melodic';
  else if (vowelRatio < 0.3) harmony = 'Rhythmic';
  
  // Calculate vibration score (0-100)
  let score = 50; // Base score
  
  // Energy scoring
  if (totalEnergy >= 10 && totalEnergy <= 20) score += 20;
  else if (totalEnergy > 20) score += 10;
  else score -= 10;
  
  // Frequency scoring
  if (frequency === 'High') score += 15;
  else if (frequency === 'Medium') score += 10;
  else score += 5;
  
  // Resonance scoring
  if (resonance === 'Strong') score += 15;
  else if (resonance === 'Soft') score += 10;
  else score += 5;
  
  // Harmony scoring
  if (harmony === 'Melodic') score += 15;
  else if (harmony === 'Balanced') score += 10;
  else score += 5;
  
  // Ensure score is between 0-100
  score = Math.max(0, Math.min(100, score));
  
  let rating = 'Poor';
  if (score >= 80) rating = 'Excellent';
  else if (score >= 70) rating = 'Good';
  else if (score >= 60) rating = 'Fair';
  else if (score >= 50) rating = 'Average';
  
  return {
    energy: totalEnergy,
    frequency,
    resonance,
    harmony,
    score,
    rating
  };
}

function analyzeSoundPatterns(name: string) {
  const alliteration: string[] = [];
  const assonance: string[] = [];
  
  // Check for alliteration (consecutive same consonants)
  for (let i = 0; i < name.length - 1; i++) {
    if (name[i] === name[i + 1] && 'bcdfghjklmnpqrstvwxyz'.includes(name[i])) {
      alliteration.push(`${name[i]}${name[i + 1]}`);
    }
  }
  
  // Check for assonance (consecutive same vowels)
  for (let i = 0; i < name.length - 1; i++) {
    if (name[i] === name[i + 1] && 'aeiou'.includes(name[i])) {
      assonance.push(`${name[i]}${name[i + 1]}`);
    }
  }
  
  // Determine rhythm
  let rhythm = 'Steady';
  const syllableCount = countSyllables(name);
  if (syllableCount > 3) rhythm = 'Complex';
  else if (syllableCount === 1) rhythm = 'Simple';
  
  // Determine flow
  let flow = 'Smooth';
  if (name.includes('x') || name.includes('z')) flow = 'Sharp';
  if (name.includes('l') || name.includes('m')) flow = 'Flowing';
  
  return {
    alliteration,
    assonance,
    rhythm,
    flow
  };
}

function analyzeVibratoryScience(name: string) {
  const positiveCombinations = [
    'VS', 'VN', 'WN', 'VG', 'VB', 'VM', 'NV', 'MG', 'MK', 'MV', 'SA', 'KS', 'MY', 'PM', 'SV', 'GA', 'AR', 'RA', 'RP', 'JN', 'AV', 'JA', 'PN', 'CO', 'CP', 'PC', 'MN', 'NM', 'AM', 'RS', 'DA', 'AD', 'BA', 'GV', 'CV', 'LK', 'LV', 'AG', 'PK', 'AP', 'AN', 'ARR', 'HA', 'MP', 'VIN', 'VIND', 'ARARS', 'NJ', 'NS', 'UD', 'RUN', 'GAIN'
  ];
  
  const negativeCombinations = [
    'VK', 'WAR', 'VH', 'VD', 'VO', 'NO', 'DI', 'DHI', 'AS', 'SH', 'ML', 'MAR', 'KL', 'SR', 'SS', 'AH', 'AI', 'LO', 'RO', 'SC', 'SK', 'SU', 'END', 'VAR', 'NL', 'VL', 'BO', 'DU', 'MR', 'VR', 'VC', 'DY', 'NA', 'NE', 'NI', 'MT', 'RJ', 'JR', 'OO', 'AK', 'IL', 'ER', 'KK', 'DM', 'SAD', 'LOSS', 'SAT', 'DOWN', 'LESS', 'ILL'
  ];
  
  const avoidableNumbers = [4, 7, 8, 13, 16, 17, 18, 22, 25, 26, 28, 29, 31, 35, 38, 40, 43, 44, 47, 48, 52, 53, 56, 61, 62, 80];
  
  const foundPositive: string[] = [];
  const foundNegative: string[] = [];
  
  // Check for positive combinations
  for (const combo of positiveCombinations) {
    if (name.toUpperCase().includes(combo)) {
      foundPositive.push(combo);
    }
  }
  
  // Check for negative combinations
  for (const combo of negativeCombinations) {
    if (name.toUpperCase().includes(combo)) {
      foundNegative.push(combo);
    }
  }
  
  // Determine overall vibration
  let overallVibration: 'Positive' | 'Negative' | 'Neutral' = 'Neutral';
  if (foundPositive.length > foundNegative.length) {
    overallVibration = 'Positive';
  } else if (foundNegative.length > foundPositive.length) {
    overallVibration = 'Negative';
  }
  
  return {
    positiveCombinations: foundPositive,
    negativeCombinations: foundNegative,
    overallVibration,
    avoidableNumbers
  };
}

function countSyllables(word: string): number {
  const vowels = 'aeiou';
  let count = 0;
  let previousWasVowel = false;
  
  for (const char of word) {
    const isVowel = vowels.includes(char);
    if (isVowel && !previousWasVowel) {
      count++;
    }
    previousWasVowel = isVowel;
  }
  
  // Handle silent 'e' at the end
  if (word.endsWith('e') && word.length > 1) {
    count--;
  }
  
  return Math.max(1, count);
}

function getPhoneticAnalysis(name: string): string {
  const analysis: string[] = [];
  
  // Check for common patterns
  if (name.startsWith('a') || name.startsWith('e') || name.startsWith('i') || 
      name.startsWith('o') || name.startsWith('u')) {
    analysis.push("Starts with a vowel sound");
  }
  
  if (name.endsWith('a') || name.endsWith('e') || name.endsWith('i') || 
      name.endsWith('o') || name.endsWith('u')) {
    analysis.push("Ends with a vowel sound");
  }
  
  // Check for consonant clusters
  const consonantClusters = name.match(/[bcdfghjklmnpqrstvwxyz]{2,}/g);
  if (consonantClusters) {
    analysis.push("Contains consonant clusters");
  }
  
  // Check for double letters
  const doubleLetters = name.match(/(.)\1/g);
  if (doubleLetters) {
    analysis.push("Contains double letters");
  }
  
  return analysis.join(", ") || "Standard phonetic structure";
}

function getPronunciation(name: string): string {
  // Simple pronunciation guide
  const pronunciation: { [key: string]: string } = {
    'a': 'ah', 'e': 'eh', 'i': 'ee', 'o': 'oh', 'u': 'oo',
    'c': 'k', 'g': 'g', 'h': 'h', 'j': 'j', 'k': 'k',
    'l': 'l', 'm': 'm', 'n': 'n', 'p': 'p', 'q': 'kw',
    'r': 'r', 's': 's', 't': 't', 'v': 'v', 'w': 'w',
    'x': 'ks', 'y': 'y', 'z': 'z'
  };
  
  return name.split('').map(char => pronunciation[char] || char).join('');
}

function getCulturalNotes(name: string): string[] {
  const notes: string[] = [];
  
  // Check for common cultural origins
  if (name.endsWith('a') || name.endsWith('ia') || name.endsWith('ina')) {
    notes.push("Common in Latin/Romance languages");
  }
  
  if (name.endsWith('son') || name.endsWith('sen')) {
    notes.push("Scandinavian origin");
  }
  
  if (name.endsWith('ski') || name.endsWith('sky')) {
    notes.push("Slavic origin");
  }
  
  if (name.endsWith('ez') || name.endsWith('es')) {
    notes.push("Spanish origin");
  }
  
  if (name.endsWith('ova') || name.endsWith('eva')) {
    notes.push("Eastern European origin");
  }
  
  return notes;
}
