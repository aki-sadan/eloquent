"""
ELOQUENT — Hybrid Bewertungs-Engine
Combines spaCy NLP (POS, Lemma, Dependencies) with sentence-transformers embeddings
for deep semantic analysis. Falls back gracefully when dependencies unavailable.
"""

import re
from dataclasses import dataclass, field

# Lazy imports for optional heavy dependencies
_spacy_model = None
_sentence_model = None


def _get_spacy():
    global _spacy_model
    if _spacy_model is None:
        try:
            import spacy
            _spacy_model = spacy.load("de_core_news_md")
        except (ImportError, OSError) as e:
            raise RuntimeError(f"spaCy nicht verfügbar: {e}")
    return _spacy_model


def _get_sentence_model():
    global _sentence_model
    if _sentence_model is None:
        try:
            from sentence_transformers import SentenceTransformer
            _sentence_model = SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2")
        except ImportError as e:
            raise RuntimeError(f"sentence-transformers nicht verfügbar: {e}")
    return _sentence_model


@dataclass
class HybridKategorie:
    punkte: float
    max_punkte: float
    feedback: str


@dataclass
class HybridErgebnis:
    gesamtpunkte: float
    note: str
    note_emoji: str
    kategorien: dict
    erkannte_rhetorische_mittel: list
    gehobene_woerter_verwendet: list
    verbesserungsvorschlaege: list
    wort_empfehlungen: list
    allgemeines_feedback: str
    anti_gaming_flag: bool
    methode: str = "hybrid"
    embedding_details: dict = field(default_factory=dict)


def cosine_similarity(a, b):
    """Cosine similarity between two vectors."""
    import numpy as np
    a, b = np.array(a), np.array(b)
    norm = np.linalg.norm(a) * np.linalg.norm(b)
    return float(np.dot(a, b) / norm) if norm > 0 else 0.0


class HybridBewerter:
    """
    Hybrid scoring engine using spaCy + sentence-transformers.
    Provides POS-based scoring, lemma-TTR, dependency parsing,
    and embedding-based semantic analysis.
    """

    def __init__(self):
        self.nlp = None
        self.embedder = None
        self._init_models()

    def _init_models(self):
        try:
            self.nlp = _get_spacy()
        except RuntimeError:
            self.nlp = None

        try:
            self.embedder = _get_sentence_model()
        except RuntimeError:
            self.embedder = None

    @property
    def available(self):
        return self.nlp is not None or self.embedder is not None

    def _pos_analyse(self, doc):
        """POS-based analysis: real verb/noun/adj detection."""
        pos_counts = {}
        for token in doc:
            pos_counts[token.pos_] = pos_counts.get(token.pos_, 0) + 1

        total = len(doc)
        if total == 0:
            return {"hat_verb": False, "pos_vielfalt": 0, "verb_ratio": 0}

        verben = pos_counts.get("VERB", 0) + pos_counts.get("AUX", 0)
        nomen = pos_counts.get("NOUN", 0) + pos_counts.get("PROPN", 0)
        adjektive = pos_counts.get("ADJ", 0)

        return {
            "hat_verb": verben > 0,
            "verb_ratio": verben / total,
            "nomen_ratio": nomen / total,
            "adj_ratio": adjektive / total,
            "pos_vielfalt": len(pos_counts),
            "pos_counts": pos_counts,
        }

    def _lemma_ttr(self, doc):
        """Type-Token-Ratio on lemma basis (more accurate than surface)."""
        lemmas = [t.lemma_.lower() for t in doc if not t.is_punct and not t.is_space]
        if not lemmas:
            return 0.0
        return len(set(lemmas)) / len(lemmas)

    def _dependency_analyse(self, doc):
        """Analyze dependency structures for argument quality."""
        hauptsaetze = 0
        nebensaetze = 0
        relative_clauses = 0

        for sent in doc.sents:
            root = [t for t in sent if t.dep_ == "ROOT"]
            if root:
                hauptsaetze += 1
            for token in sent:
                if token.dep_ in ("rc", "relcl"):
                    relative_clauses += 1
                if token.dep_ in ("advcl", "ccomp", "xcomp", "acl"):
                    nebensaetze += 1

        return {
            "hauptsaetze": hauptsaetze,
            "nebensaetze": nebensaetze,
            "relative_clauses": relative_clauses,
            "komplexitaet": nebensaetze + relative_clauses,
        }

    def _oov_check(self, doc):
        """Check for out-of-vocabulary words (gibberish detection)."""
        oov_count = 0
        total = 0
        for token in doc:
            if token.is_alpha and not token.is_stop and len(token.text) > 3:
                total += 1
                if not token.has_vector:
                    oov_count += 1
        return oov_count / max(total, 1)

    def _embed_similarity(self, text_a, text_b):
        """Compute embedding similarity between two texts."""
        if not self.embedder:
            return None
        embeddings = self.embedder.encode([text_a, text_b])
        return cosine_similarity(embeddings[0], embeddings[1])

    def _embed_sentences(self, sentences):
        """Embed multiple sentences and compute coherence metrics."""
        if not self.embedder or len(sentences) < 2:
            return None

        embeddings = self.embedder.encode(sentences)

        # Consecutive similarity
        consecutive = []
        for i in range(1, len(embeddings)):
            consecutive.append(cosine_similarity(embeddings[i-1], embeddings[i]))

        avg_consecutive = sum(consecutive) / len(consecutive) if consecutive else 0

        # Average vs full text
        import numpy as np
        avg_embed = np.mean(embeddings, axis=0)
        full_text_sims = [cosine_similarity(e, avg_embed) for e in embeddings]
        avg_full_text = sum(full_text_sims) / len(full_text_sims)

        # Outlier detection
        outliers = [i for i, s in enumerate(full_text_sims) if s < 0.2]

        return {
            "avg_consecutive": avg_consecutive,
            "avg_full_text": avg_full_text,
            "outliers": outliers,
            "min_sim": min(full_text_sims) if full_text_sims else 0,
        }

    def _get_note(self, punkte):
        if punkte >= 95: return "Meisterhaft", "⚡"
        if punkte >= 85: return "Herausragend", "🌟"
        if punkte >= 75: return "Ausgezeichnet", "🏅"
        if punkte >= 65: return "Sehr gut", "✨"
        if punkte >= 55: return "Gut", "👍"
        if punkte >= 45: return "Ordentlich", "📝"
        if punkte >= 35: return "Ausbaufähig", "🔧"
        return "Schwach", "📉"

    def bewerten(self, situation: dict, antwort: str) -> HybridErgebnis:
        """
        Main scoring function. Uses spaCy + embeddings for deep analysis.
        """
        text = antwort.strip()
        saetze_raw = re.split(r'[.!?]+', text)
        saetze = [s.strip() for s in saetze_raw if len(s.strip()) > 3]

        situation_text = f"{situation.get('titel', '')} {situation.get('beschreibung', '')}"

        # spaCy analysis
        doc = self.nlp(text) if self.nlp else None
        pos_info = self._pos_analyse(doc) if doc else None
        lemma_ttr = self._lemma_ttr(doc) if doc else None
        dep_info = self._dependency_analyse(doc) if doc else None
        oov_ratio = self._oov_check(doc) if doc else None

        # Embedding analysis
        sit_similarity = self._embed_similarity(situation_text, text)
        coherence = self._embed_sentences(saetze) if len(saetze) >= 2 else None

        # Anti-Gaming
        anti_gaming = False
        gaming_flags = []
        woerter = text.split()
        n = len(woerter)

        if n < 8:
            anti_gaming = True
            gaming_flags.append("text_zu_kurz")

        if pos_info and not pos_info["hat_verb"] and n > 5:
            gaming_flags.append("kein_verb")

        if n > 0 and len(set(w.lower() for w in woerter)) / n < 0.3:
            anti_gaming = True
            gaming_flags.append("wort_spam")

        if oov_ratio and oov_ratio > 0.5:
            gaming_flags.append("gibberish")

        if sit_similarity is not None and sit_similarity < 0.1:
            gaming_flags.append("semantic_off_topic")

        if coherence and coherence["avg_consecutive"] < 0.2:
            gaming_flags.append("semantic_word_salad")

        if len(gaming_flags) >= 2:
            anti_gaming = True

        # ── Category Scoring ──
        kategorien = {}

        # 1. Situationsbezug (15)
        if sit_similarity is not None:
            sit_score = max(0, min((sit_similarity - 0.15) / (0.55 - 0.15) * 15, 15))
        else:
            sit_score = 7.5  # neutral fallback
        kategorien["situationsbezug"] = HybridKategorie(
            round(sit_score, 1), 15,
            "Starker inhaltlicher Bezug." if sit_score >= 12
            else "Erkennbarer Bezug." if sit_score >= 6
            else "Mehr Bezug zur Situation nötig."
        )

        # 2. Wortvielfalt (15)
        ttr = lemma_ttr if lemma_ttr is not None else (len(set(w.lower() for w in woerter)) / max(n, 1))
        vielfalt_score = min(ttr * 15, 12)
        kategorien["wortvielfalt"] = HybridKategorie(
            round(vielfalt_score, 1), 15,
            "Vielfältige Wortwahl." if vielfalt_score >= 10
            else "Gute Vielfalt." if vielfalt_score >= 5
            else "Mehr Synonyme verwenden."
        )

        # 3. Rhetorik (25) — basic detection
        rhetorische_mittel = []
        lower = text.lower()
        if re.search(r'wie\s+(ein|eine|der|die|das)', lower):
            rhetorische_mittel.append({"name": "Vergleich", "beispiel": "Vergleich erkannt", "erklaerung": "Bildhafte Sprache"})
        if "?" in text:
            rhetorische_mittel.append({"name": "Rhetorische Frage", "beispiel": "Frage erkannt", "erklaerung": "Regt zum Nachdenken an"})
        if re.search(r'nicht\s+nur.*sondern', lower):
            rhetorische_mittel.append({"name": "Antithese", "beispiel": "Gegensatz erkannt", "erklaerung": "Kontrastierung"})

        rhetorik_score = min(len(rhetorische_mittel) * 5 + (3 if len(rhetorische_mittel) >= 3 else 0), 25)
        kategorien["rhetorik"] = HybridKategorie(
            round(rhetorik_score, 1), 25,
            f"{len(rhetorische_mittel)} Mittel erkannt." if rhetorische_mittel
            else "Keine rhetorischen Mittel erkannt."
        )

        # 4. Wortschatz (15)
        wortschatz_score = 7.5  # basic
        if pos_info:
            adj_bonus = min(pos_info["adj_ratio"] * 20, 5)
            wortschatz_score = min(adj_bonus + (5 if lemma_ttr and lemma_ttr > 0.7 else 2), 15)
        kategorien["wortschatz"] = HybridKategorie(
            round(wortschatz_score, 1), 15,
            "Guter Wortschatz." if wortschatz_score >= 10 else "Wortschatz ausbaufähig."
        )

        # 5. Argumentation (15)
        arg_score = 5.0
        if dep_info:
            arg_score = min(dep_info["hauptsaetze"] * 2 + dep_info["nebensaetze"] * 1.5 + dep_info["relative_clauses"], 15)
        kategorien["argumentation"] = HybridKategorie(
            round(arg_score, 1), 15,
            "Klare Argumentation." if arg_score >= 10 else "Mehr Struktur nötig."
        )

        # 6. Kreativität (10)
        kreativ_score = 3.0
        if len(saetze) >= 2:
            laengen = [len(s.split()) for s in saetze]
            avg = sum(laengen) / len(laengen)
            varianz = sum(abs(l - avg) for l in laengen) / len(laengen)
            kreativ_score = min(varianz / 2 + len(rhetorische_mittel), 10)
        kategorien["kreativitaet"] = HybridKategorie(
            round(kreativ_score, 1), 10,
            "Kreative Gestaltung." if kreativ_score >= 7 else "Mehr Variation möglich."
        )

        # 7. Textstruktur (5)
        struktur_score = 2.0
        if coherence:
            struktur_score = min(coherence["avg_consecutive"] * 5 + (1 if len(saetze) >= 3 else 0), 5)
        elif len(saetze) >= 3:
            struktur_score = 3.0
        kategorien["textstruktur"] = HybridKategorie(
            round(struktur_score, 1), 5,
            "Kohärente Struktur." if struktur_score >= 4 else "Struktur verbessern."
        )

        # Total
        gesamt = sum(k.punkte for k in kategorien.values())

        # Gaming penalty
        if anti_gaming:
            gesamt = 0
            for k in kategorien:
                kategorien[k] = HybridKategorie(0, kategorien[k].max_punkte, f"Gaming: {', '.join(gaming_flags)}")

        note, emoji = self._get_note(gesamt)

        return HybridErgebnis(
            gesamtpunkte=round(gesamt, 1),
            note=note,
            note_emoji=emoji,
            kategorien={name: {"punkte": k.punkte, "max_punkte": k.max_punkte, "feedback": k.feedback} for name, k in kategorien.items()},
            erkannte_rhetorische_mittel=rhetorische_mittel,
            gehobene_woerter_verwendet=[],
            verbesserungsvorschlaege=[],
            wort_empfehlungen=[],
            allgemeines_feedback=f"Hybrid-Bewertung: {note} ({gesamt}/100)",
            anti_gaming_flag=anti_gaming,
            methode="hybrid",
            embedding_details={
                "situation_similarity": round(sit_similarity, 3) if sit_similarity else None,
                "coherence": {k: round(v, 3) if isinstance(v, float) else v for k, v in (coherence or {}).items()},
                "oov_ratio": round(oov_ratio, 3) if oov_ratio else None,
                "lemma_ttr": round(lemma_ttr, 3) if lemma_ttr else None,
            },
        )
