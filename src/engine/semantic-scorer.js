// ──────────────────────────────────────────────────────
// Semantic Scoring via Embeddings (Transformers.js)
// Falls back gracefully when model not available
// ──────────────────────────────────────────────────────

import { embedText, embedSentences, getModelStatus } from './model-loader.js';

export function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom > 0 ? dot / denom : 0;
}

// Situation relevance: 0-15 points
export async function semanticSituationScore(situationText, antwortText) {
  if (getModelStatus() !== "ready") return null;

  const [sitEmbed, antEmbed] = await Promise.all([
    embedText(situationText),
    embedText(antwortText),
  ]);

  if (!sitEmbed || !antEmbed) return null;

  const sim = cosineSimilarity(sitEmbed, antEmbed);
  // Scale: >= 0.55 = full 15, < 0.15 = 0
  if (sim >= 0.55) return 15;
  if (sim < 0.15) return 0;
  return Math.round((sim - 0.15) / (0.55 - 0.15) * 15 * 10) / 10;
}

// Coherence: 0-1 score
export async function semanticCoherence(saetze) {
  if (getModelStatus() !== "ready" || saetze.length < 2) return null;

  const embeddings = await embedSentences(saetze);
  if (!embeddings) return null;

  // Consecutive sentence similarity
  let consecutiveSum = 0;
  for (let i = 1; i < embeddings.length; i++) {
    consecutiveSum += cosineSimilarity(embeddings[i - 1], embeddings[i]);
  }
  const avgConsecutive = consecutiveSum / (embeddings.length - 1);

  // Each sentence vs full text (average of all embeddings)
  const avgEmbed = new Float32Array(embeddings[0].length);
  for (const emb of embeddings) {
    for (let i = 0; i < emb.length; i++) avgEmbed[i] += emb[i] / embeddings.length;
  }
  let fullTextSum = 0;
  for (const emb of embeddings) {
    fullTextSum += cosineSimilarity(emb, avgEmbed);
  }
  const avgFullText = fullTextSum / embeddings.length;

  return (avgConsecutive * 0.6 + avgFullText * 0.4);
}

// Anti-Gaming semantic checks
export async function semanticAntiGaming(situationText, saetze) {
  if (getModelStatus() !== "ready") return null;

  const embeddings = await embedSentences(saetze);
  const sitEmbed = await embedText(situationText);
  if (!embeddings || !sitEmbed) return null;

  const flags = [];
  let penalty = 0;

  // Check topic relevance
  let topicSum = 0;
  for (const emb of embeddings) {
    topicSum += cosineSimilarity(emb, sitEmbed);
  }
  const avgTopic = topicSum / embeddings.length;
  if (avgTopic < 0.1) { flags.push("semantic_off_topic"); penalty += 0.5; }

  // Check inter-sentence coherence
  if (embeddings.length >= 2) {
    let cohSum = 0;
    for (let i = 1; i < embeddings.length; i++) {
      cohSum += cosineSimilarity(embeddings[i - 1], embeddings[i]);
    }
    const avgCoh = cohSum / (embeddings.length - 1);
    if (avgCoh < 0.2) { flags.push("semantic_word_salad"); penalty += 0.4; }
  }

  // Outlier detection
  if (embeddings.length >= 3) {
    const avgEmbed = new Float32Array(embeddings[0].length);
    for (const emb of embeddings) {
      for (let i = 0; i < emb.length; i++) avgEmbed[i] += emb[i] / embeddings.length;
    }
    for (let i = 0; i < embeddings.length; i++) {
      const sim = cosineSimilarity(embeddings[i], avgEmbed);
      if (sim < 0.2) { flags.push("semantic_outlier_sentence"); penalty += 0.3; break; }
    }
  }

  return { flags, penalty: Math.min(penalty, 1) };
}
