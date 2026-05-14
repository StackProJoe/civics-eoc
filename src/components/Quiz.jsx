import React, { useState } from "react";
import { QUIZ_BANK } from "../data/quiz";
import { CAT_NAMES } from "../data/flashcards";
import ExplanationPopup from "./ExplanationPopup";
import Results from "./Results";

function initCatScores() {
  return {
    "Cat 1": { c: 0, t: 0 },
    "Cat 2": { c: 0, t: 0 },
    "Cat 3": { c: 0, t: 0 },
    "Cat 4": { c: 0, t: 0 },
  };
}

function buildShuffledQuiz() {
  return [...QUIZ_BANK]
    .sort(() => Math.random() - 0.5)
    .map((q) => ({
      ...q,
      options: [q.a, ...q.w].sort(() => Math.random() - 0.5),
    }));
}

function Quiz({ visible }) {
  const [quizCards, setQuizCards] = useState(() => buildShuffledQuiz());
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [catScores, setCatScores] = useState(initCatScores());
  const [answered, setAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const startQuiz = () => {
    setQuizCards(buildShuffledQuiz());
    setQuizIndex(0);
    setQuizScore(0);
    setCatScores(initCatScores());
    setAnswered(false);
    setSelectedOption(null);
    setShowPopup(false);
    setShowResults(false);
  };

  const answerQ = (chosen) => {
    if (answered) return;
    setAnswered(true);
    setSelectedOption(chosen);

    const q = quizCards[quizIndex];
    const isCorrect = q.options[chosen] === q.a;

    if (isCorrect) setQuizScore((prev) => prev + 1);

    setCatScores((prev) => ({
      ...prev,
      [q.cat]: {
        c: prev[q.cat].c + (isCorrect ? 1 : 0),
        t: prev[q.cat].t + 1,
      },
    }));

    if (!isCorrect && q.e) {
      setShowPopup(true);
    }
  };

  const nextQuestion = () => {
    setShowPopup(false);
    if (quizIndex + 1 >= quizCards.length) {
      setShowResults(true);
    } else {
      setQuizIndex((prev) => prev + 1);
      setAnswered(false);
      setSelectedOption(null);
    }
  };

  if (showResults) {
    const pct = Math.round((quizScore / quizCards.length) * 100);
    return (
      <div id="quiz" style={{ display: visible ? "flex" : "none" }}>
        <div
          id="quizContent"
          style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}
        >
          <Results
            pct={pct}
            score={quizScore}
            total={quizCards.length}
            catScores={catScores}
            onRestart={startQuiz}
          />
        </div>
      </div>
    );
  }

  const q = quizCards[quizIndex];
  const progressPct = (quizIndex / quizCards.length) * 100;
  const isCorrectSelected =
    answered && selectedOption !== null && q.options[selectedOption] === q.a;

  return (
    <div id="quiz" style={{ display: visible ? "flex" : "none" }}>
      <div
        id="quizContent"
        style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}
      >
        <div className="quiz-top">
          <div className="quiz-progress">
            Question {quizIndex + 1} of {quizCards.length}
          </div>
          <div className="score-badge">
            {quizScore}/{quizIndex}
          </div>
        </div>
        <div className="progress-bar-wrap">
          <div
            className="progress-bar"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="quiz-card">
          <div className="quiz-q-num">
            {CAT_NAMES[q.cat]}
            {q.eoc && <span className="eoc-badge">★ REAL EOC</span>}
            <br />
            <span
              style={{ fontSize: "0.58rem", opacity: 0.6, letterSpacing: "1px" }}
            >
              {q.benchmark || ""}
            </span>
          </div>
          <div className="quiz-question">{q.q}</div>
          <div className="quiz-options">
            {q.options.map((opt, i) => {
              let cls = "opt-btn";
              if (answered) {
                if (opt === q.a) cls += " correct";
                else if (i === selectedOption) cls += " wrong";
              }
              return (
                <button
                  key={i}
                  className={cls}
                  onClick={() => answerQ(i)}
                  disabled={answered}
                >
                  {String.fromCharCode(65 + i)}. {opt}
                </button>
              );
            })}
          </div>
          {answered && (
            <div
              className={`feedback-box show ${isCorrectSelected ? "correct" : "wrong"}`}
            >
              {isCorrectSelected ? "✅ Correct!" : `❌ Correct answer: ${q.a}`}
            </div>
          )}
          {answered && (
            <button className="next-q-btn show" onClick={nextQuestion}>
              {quizIndex + 1 < quizCards.length
                ? "Next Question →"
                : "See Results 🎉"}
            </button>
          )}
        </div>
      </div>
      <ExplanationPopup
        show={showPopup}
        body={q.e || ""}
        onClose={() => setShowPopup(false)}
      />
    </div>
  );
}

export default Quiz;
