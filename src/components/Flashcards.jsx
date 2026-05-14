import React, { useState } from "react";
import { ALL_CARDS, CATEGORIES, CAT_NAMES } from "../data/flashcards";

function Flashcards({ visible }) {
  const [currentCat, setCurrentCat] = useState("All");
  const [filteredCards, setFilteredCards] = useState([...ALL_CARDS]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const selectCat = (cat) => {
    const cards =
      cat === "All" ? [...ALL_CARDS] : ALL_CARDS.filter((c) => c.cat === cat);
    setCurrentCat(cat);
    setFilteredCards(cards);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const flipCard = () => setIsFlipped((prev) => !prev);

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
    setIsFlipped(false);
  };

  const prevCard = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + filteredCards.length) % filteredCards.length
    );
    setIsFlipped(false);
  };

  const shuffleCards = () => {
    const shuffled = [...filteredCards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setFilteredCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const card = filteredCards[currentIndex];

  return (
    <div
      id="flashcards"
      style={{ display: visible ? "flex" : "none" }}
    >
      <div className="category-filter">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`cat-btn${cat === currentCat ? " active" : ""}`}
            onClick={() => selectCat(cat)}
          >
            {CAT_NAMES[cat]}
          </button>
        ))}
      </div>
      <div className="card-counter">
        Card {currentIndex + 1} of {filteredCards.length}
      </div>
      <div className="flashcard-wrap" onClick={flipCard}>
        <div className={`flashcard${isFlipped ? " flipped" : ""}`}>
          <div className="card-face card-front">
            <div className="card-cat-tag">{CAT_NAMES[card.cat]}</div>
            <div className="card-label">Term / Concept</div>
            <div className="card-text">{card.front}</div>
            <div className="card-hint">tap to reveal →</div>
          </div>
          <div className="card-face card-back">
            <div className="card-label">Definition / Answer</div>
            <div
              className="card-text"
              dangerouslySetInnerHTML={{ __html: card.back }}
            />
            <div className="card-hint">← tap to flip back</div>
          </div>
        </div>
      </div>
      <div className="card-nav">
        <button className="nav-btn" onClick={prevCard}>
          ← Prev
        </button>
        <button className="shuffle-btn" onClick={shuffleCards}>
          🔀 Shuffle
        </button>
        <button className="nav-btn" onClick={nextCard}>
          Next →
        </button>
      </div>
    </div>
  );
}

export default Flashcards;
