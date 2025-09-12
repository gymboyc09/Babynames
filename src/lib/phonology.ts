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
  };
  soundPatterns: {
    alliteration: string[];
    assonance: string[];
    rhythm: string;
    flow: string;
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

  return {
    name: name,
    syllables,
    vowelCount,
    consonantCount,
    phoneticAnalysis,
    pronunciation,
    culturalNotes,
    vibrations,
    soundPatterns
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
  
  return {
    energy: totalEnergy,
    frequency,
    resonance,
    harmony
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
