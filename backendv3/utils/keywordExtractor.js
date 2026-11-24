/**
 * Keyword Extractor & SEO Algorithm for Fantasy Luxe
 * Analyzes product descriptions, names, categories, and attributes
 * to generate high-ranking e-commerce SEO keywords and meta tags.
 */

const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t',
  'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', 'can\'t', 'cannot', 'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing',
  'don\'t', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t',
  'have', 'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers',
  'herself', 'him', 'himself', 'his', 'how', 'how\'s', 'i', 'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if',
  'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself', 'let\'s', 'me', 'more', 'most',
  'mustn\'t', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other',
  'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'shan\'t', 'she', 'she\'d',
  'she\'ll', 'she\'s', 'should', 'shouldn\'t', 'so', 'some', 'such', 'than', 'that', 'that\'s', 'the',
  'their', 'theirs', 'them', 'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d',
  'they\'ll', 'they\'re', 'they\'ve', 'this', 'those', 'through', 'to', 'too', 'under', 'until',
  'up', 'very', 'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t',
  'what', 'what\'s', 'when', 'when\'s', 'where', 'where\'s', 'which', 'while', 'who', 'who\'s',
  'whom', 'why', 'why\'s', 'with', 'won\'t', 'would', 'wouldn\'t', 'you', 'you\'d', 'you\'ll',
  'you\'re', 'you\'ve', 'your', 'yours', 'yourself', 'yourselves',
  // Common filler words
  'also', 'just', 'get', 'like', 'item', 'items', 'product', 'products', 'one', 'two', 'three',
  'new', 'well', 'made', 'make', 'makes', 'come', 'comes', 'features', 'featured', 'great', 'best',
  'good', 'perfect', 'give', 'gives', 'using', 'used', 'way', 'ways', 'look', 'looks', 'looking'
]);

// High-value fashion, luxury, and e-commerce terms that receive priority boosting
const LUXURY_BOOST_TERMS = new Set([
  'luxury', 'designer', 'premium', 'handcrafted', 'leather', 'genuine', 'italian', 'gold',
  'silver', 'stainless', 'steel', 'waterproof', 'resistant', 'quartz', 'automatic', 'chronograph',
  'tote', 'handbag', 'crossbody', 'shoulder', 'clutch', 'bag', 'bags', 'backpack', 'wallet',
  'watch', 'watches', 'timepiece', 'strap', 'buckle', 'compartment', 'zipper', 'hardware',
  'chain', 'monogram', 'minimalist', 'vintage', 'classic', 'chic', 'statement', 'authentic',
  'necklace', 'pendant', 'earring', 'earrings', 'bracelet', 'ring', 'jewelry', 'accessories',
  'soft', 'silk', 'satin', 'velvet', 'cashmere', 'wool', 'linen', 'cotton', 'unisex', 'women',
  'men', 'formal', 'casual', 'lifestyle', 'exclusive', 'boutique', 'couture', 'aesthetic'
]);

/**
 * Clean and normalize text
 */
function cleanText(text = '') {
  if (!text) return '';
  return text
    .replace(/<[^>]*>/g, ' ') // Strip HTML tags
    .replace(/[^\w\s-]/g, ' ') // Remove non-word characters except hyphens
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/**
 * Extract keywords and phrases from text
 */
export function extractKeywords({ name = '', description = '', category = '', subCategory = '', colors = [] }) {
  const keywordsSet = new Set();
  const cleanedDesc = cleanText(description);
  const cleanedName = cleanText(name);
  const cleanedCat = cleanText(category);
  const cleanedSubCat = cleanText(subCategory);

  // 1. Always prioritize exact product title and brand combinations
  if (name.trim()) {
    keywordsSet.add(name.trim());
    keywordsSet.add(`${name.trim()} Fantasy Luxe`);
  }

  // 2. Category combinations
  if (category && subCategory) {
    keywordsSet.add(`${category} ${subCategory}`);
    keywordsSet.add(`Luxury ${category} ${subCategory}`);
  } else if (category) {
    keywordsSet.add(`Luxury ${category}`);
  }

  // 3. Brand & Geo SEO phrases
  keywordsSet.add('Fantasy Luxe');
  keywordsSet.add('Fantasy Luxe Nigeria');
  if (category) {
    keywordsSet.add(`luxury ${category.toLowerCase()} nigeria`);
  }
  keywordsSet.add('luxury fashion nigeria');
  keywordsSet.add('designer fashion store');

  // 4. Extract words from description
  const words = cleanedDesc.split(/\s+/).filter(w => w.length >= 3 && !STOP_WORDS.has(w));
  
  // Word frequency map
  const wordFreq = new Map();
  for (const word of words) {
    wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
  }

  // Word scoring
  const scoredWords = [];
  for (const [word, count] of wordFreq.entries()) {
    let score = count;
    // Boost if in title
    if (cleanedName.includes(word)) score += 5;
    // Boost if in category/subcategory
    if (cleanedCat.includes(word) || cleanedSubCat.includes(word)) score += 4;
    // Boost if high-value luxury/fashion term
    if (LUXURY_BOOST_TERMS.has(word)) score += 3;

    scoredWords.push({ word, score });
  }

  // Sort by score descending
  scoredWords.sort((a, b) => b.score - a.score);

  // 5. Extract multi-word phrases (bigrams and trigrams) directly from description
  const rawWords = cleanedDesc.split(/\s+/);
  const phraseFreq = new Map();

  for (let i = 0; i < rawWords.length - 1; i++) {
    const w1 = rawWords[i];
    const w2 = rawWords[i + 1];

    if (w1.length >= 3 && w2.length >= 3 && !STOP_WORDS.has(w1) && !STOP_WORDS.has(w2)) {
      const bigram = `${w1} ${w2}`;
      let phraseScore = 2;

      // Boost phrases with luxury terms
      if (LUXURY_BOOST_TERMS.has(w1) || LUXURY_BOOST_TERMS.has(w2)) {
        phraseScore += 3;
      }
      // Boost phrases appearing in title
      if (cleanedName.includes(bigram)) {
        phraseScore += 5;
      }

      phraseFreq.set(bigram, (phraseFreq.get(bigram) || 0) + phraseScore);

      // Trigrams (3-word descriptive phrases)
      if (i < rawWords.length - 2) {
        const w3 = rawWords[i + 2];
        if (w3.length >= 3 && !STOP_WORDS.has(w3)) {
          const trigram = `${w1} ${w2} ${w3}`;
          let triScore = 3;
          if (LUXURY_BOOST_TERMS.has(w1) || LUXURY_BOOST_TERMS.has(w2) || LUXURY_BOOST_TERMS.has(w3)) {
            triScore += 3;
          }
          if (cleanedName.includes(trigram)) {
            triScore += 5;
          }
          phraseFreq.set(trigram, (phraseFreq.get(trigram) || 0) + triScore);
        }
      }
    }
  }

  const scoredPhrases = Array.from(phraseFreq.entries())
    .map(([phrase, score]) => ({ phrase, score }))
    .sort((a, b) => b.score - a.score);

  // 6. Append top descriptive phrases (up to 12)
  for (const item of scoredPhrases.slice(0, 12)) {
    keywordsSet.add(item.phrase);
  }

  // 7. Append top individual descriptive words (up to 15)
  for (const item of scoredWords.slice(0, 15)) {
    keywordsSet.add(item.word);
  }

  // 8. Add color tags if present
  if (Array.isArray(colors)) {
    for (const color of colors) {
      if (color && typeof color === 'string') {
        keywordsSet.add(`${color.trim().toLowerCase()} ${cleanedSubCat || cleanedCat || 'fashion'}`.trim());
      }
    }
  }

  // Convert set to array and format
  const result = Array.from(keywordsSet)
    .filter(kw => kw && kw.length >= 3)
    .map(kw => kw.trim());

  return result;
}

/**
 * Generate comprehensive SEO metadata for a product
 */
export function generateProductSEO({ name = '', description = '', category = '', subCategory = '', price = 0, colors = [] }) {
  const keywords = extractKeywords({ name, description, category, subCategory, colors });

  // Clean description for snippet
  const plainDesc = description.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const truncatedDesc = plainDesc.length > 155 ? `${plainDesc.slice(0, 152)}...` : plainDesc;

  const seoTitle = `${name} | Fantasy Luxe - Luxury ${category || 'Fashion'}`;
  const seoDescription = truncatedDesc || `Buy ${name} at Fantasy Luxe. Curated luxury fashion, bags, watches, and accessories with delivery in Nigeria.`;

  return {
    keywords,
    keywordsString: keywords.join(', '),
    seoTitle,
    seoDescription
  };
}
