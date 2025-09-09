import { TrainingResult } from "../training/TrainingResult";

// Cache tokenized results to avoid repeated tokenization
const tokenCache = new Map<string, Set<string>>();

const memoizedTokenize = (text: string): Set<string> => {
  if (tokenCache.has(text)) {
    return tokenCache.get(text)!;
  }
  
  const tokens = new Set(
    text
      .replace(/[^a-zA-Z0-9- ]/g, "")
      .split(/\s+/)
      .filter((word) => word.length > 1 && !STOP_WORDS.has(word.toLowerCase()))
  );
  
  tokenCache.set(text, tokens);
  return tokens;
};

// Pre-compile scoring weights for faster access
const SCORING_WEIGHTS = {
  EXACT_PROVIDER: 15000,
  EXACT_TRAINING_NAME: 2000,
  EXACT_PHRASE: 1000,
  CITY_MATCH: 1500,
  NAME_MATCH: 150,
  PROVIDER_MATCH: 100,
  DESCRIPTION_MATCH: 50,
  FUZZY_MATCH: 50,
} as const;

const STOP_WORDS = new Set(["of", "the", "and", "in", "for", "at", "on", "it", "institute"]);

const COMMON_WORDS = new Set([
  "systems", "technology", "training", "certificate", "certification",
  "degree", "education", "course", "program", "school", "college", "academy"
]);

/**
 * Optimized ranking function with reduced computational complexity
 */
export const optimizedRankResults = (
  query: string, 
  results: TrainingResult[], 
  minScore = 500
): TrainingResult[] => {
  if (!query || results.length === 0) return [];
  
  const queryLower = query.toLowerCase();
  const queryTokens = memoizedTokenize(queryLower);
  const queryPhrase = queryTokens.size > 1 ? [...queryTokens].join(" ") : null;
  
  // Pre-filter to avoid processing duplicates
  const uniqueResults = Array.from(
    new Map(results.map(item => [item.ctid, item])).values()
  );
  
  // Pre-compute query-specific data once
  const queryData = {
    tokens: queryTokens,
    phrase: queryPhrase,
    original: query,
    lower: queryLower,
  };
  
  const scoredResults = uniqueResults
    .map(training => scoreTraining(training, queryData, minScore))
    .filter(result => (result.rank || 0) > 0);
  
  return scoredResults.sort((a, b) => (b.rank || 0) - (a.rank || 0));
};

/**
 * Score individual training with optimized logic
 */
function scoreTraining(
  training: TrainingResult,
  queryData: { tokens: Set<string>; phrase: string | null; original: string; lower: string },
  minScore: number
): TrainingResult {
  if (!training.name) return { ...training, rank: 0 };
  
  let score = 0;
  let strongMatch = false;
  
  // Pre-compute and cache training text data
  const trainingData = getTrainingTextData(training);
  
  // Fast exact matches first (highest impact, lowest cost)
  if (queryData.original === trainingData.providerName || queryData.lower === trainingData.providerNameLower) {
    score += SCORING_WEIGHTS.EXACT_PROVIDER;
    strongMatch = true;
  }
  
  if (queryData.original === trainingData.name || queryData.lower === trainingData.nameLower ||
      queryData.original === trainingData.cipTitle || queryData.lower === trainingData.cipTitleLower) {
    score += SCORING_WEIGHTS.EXACT_TRAINING_NAME;
    strongMatch = true;
  }
  
  // Phrase matching with early termination
  if (queryData.phrase && trainingData.allText.includes(queryData.phrase)) {
    score += SCORING_WEIGHTS.EXACT_PHRASE;
    strongMatch = true;
  }
  
  // Token-based scoring with optimized loops
  for (const token of queryData.tokens) {
    if (COMMON_WORDS.has(token)) continue;
    
    const tokenScore = getTokenScore(token, trainingData);
    score += tokenScore.score;
    if (tokenScore.isStrong) strongMatch = true;
  }
  
  // Location matching
  const locationScore = getLocationScore(queryData.tokens, trainingData.locations);
  score += locationScore.score;
  if (locationScore.isStrong) strongMatch = true;
  
  // Early termination for low scores
  if (!strongMatch || score < minScore) {
    return { ...training, rank: 0 };
  }
  
  // Only do expensive fuzzy matching for promising candidates
  if (score > minScore * 0.8) {
    score += getFuzzyScore(queryData.tokens, trainingData);
  }
  
  return { ...training, rank: score };
}

/**
 * Cache training text data to avoid repeated processing
 */
const trainingDataCache = new Map<string, any>();

function getTrainingTextData(training: TrainingResult) {
  const cacheKey = training.ctid || `training-${Date.now()}`;
  
  if (trainingDataCache.has(cacheKey)) {
    return trainingDataCache.get(cacheKey);
  }
  
  const name = training.name?.trim() || "";
  const nameLower = name.toLowerCase();
  const description = (training.description || "").trim();
  const descriptionLower = description.toLowerCase();
  const providerName = (training.providerName || "").trim();
  const providerNameLower = providerName.toLowerCase();
  const cipTitle = (training.cipDefinition?.ciptitle || "").trim();
  const cipTitleLower = cipTitle.toLowerCase();
  const locations = training.availableAt?.map(a => a.city?.trim()?.toLowerCase() || "").filter(Boolean) || [];
  
  const nameTokens = memoizedTokenize(nameLower);
  const descTokens = memoizedTokenize(descriptionLower);
  const providerTokens = memoizedTokenize(providerNameLower);
  const cipTokens = memoizedTokenize(cipTitleLower);
  
  const allTokens = new Set([...nameTokens, ...descTokens, ...providerTokens, ...cipTokens]);
  const allText = [nameLower, descriptionLower, providerNameLower, cipTitleLower].join(" ");
  
  const data = {
    name,
    nameLower,
    description,
    descriptionLower,
    providerName,
    providerNameLower,
    cipTitle,
    cipTitleLower,
    locations,
    nameTokens,
    descTokens,
    providerTokens,
    cipTokens,
    allTokens,
    allText,
  };
  
  trainingDataCache.set(cacheKey, data);
  return data;
}

/**
 * Optimized token scoring
 */
function getTokenScore(token: string, trainingData: any): { score: number; isStrong: boolean } {
  if (trainingData.nameTokens.has(token)) {
    return { score: SCORING_WEIGHTS.NAME_MATCH, isStrong: true };
  }
  if (trainingData.providerTokens.has(token)) {
    return { score: SCORING_WEIGHTS.PROVIDER_MATCH, isStrong: true };
  }
  if (trainingData.descTokens.has(token)) {
    return { score: SCORING_WEIGHTS.DESCRIPTION_MATCH, isStrong: false };
  }
  return { score: 0, isStrong: false };
}

/**
 * Optimized location scoring
 */
function getLocationScore(queryTokens: Set<string>, locations: string[]): { score: number; isStrong: boolean } {
  for (const location of locations) {
    if (queryTokens.has(location)) {
      return { score: SCORING_WEIGHTS.CITY_MATCH, isStrong: true };
    }
  }
  return { score: 0, isStrong: false };
}

/**
 * Optimized fuzzy matching with early termination
 */
function getFuzzyScore(queryTokens: Set<string>, trainingData: any): number {
  let fuzzyScore = 0;
  const maxFuzzyMatches = 3; // Limit expensive operations
  let fuzzyMatchCount = 0;
  
  for (const queryToken of queryTokens) {
    if (fuzzyMatchCount >= maxFuzzyMatches) break;
    
    for (const textToken of trainingData.allTokens) {
      if (fuzzyMatchCount >= maxFuzzyMatches) break;
      
      if (!textToken.includes(queryToken) && fuzzyMatch(queryToken, textToken)) {
        fuzzyScore += SCORING_WEIGHTS.FUZZY_MATCH;
        fuzzyMatchCount++;
      }
    }
  }
  
  return fuzzyScore;
}

// Optimized Levenshtein with early termination
function fuzzyMatch(word1: string, word2: string): boolean {
  if (word1.length <= 4 || word2.length <= 4) return false;
  if (Math.abs(word1.length - word2.length) > 1) return false; // Early exit
  
  return levenshteinDistance(word1, word2) <= 1;
}

function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  
  // Use single array for space optimization
  let previousRow = Array.from({ length: b.length + 1 }, (_, i) => i);
  
  for (let i = 1; i <= a.length; i++) {
    const currentRow = [i];
    
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      currentRow[j] = Math.min(
        previousRow[j] + 1,     // deletion
        currentRow[j - 1] + 1,  // insertion
        previousRow[j - 1] + cost // substitution
      );
      
      // Early termination if we exceed threshold
      if (currentRow[j] > 1 && j === b.length) {
        return currentRow[j];
      }
    }
    
    previousRow = currentRow;
  }
  
  return previousRow[b.length];
}

/**
 * Clear caches when memory usage gets high
 */
export function clearRankingCaches(): void {
  tokenCache.clear();
  trainingDataCache.clear();
}
