import React, { useState } from "react";
import "./App.css";
import Flashcards from "./components/Flashcards";
import Quiz from "./components/Quiz";

function App() {
  const [activeTab, setActiveTab] = useState("flashcards");

  return (
    <div id="app">
      <header>
        <h1>⭐ FL 7th Grade Civics EOC ⭐</h1>
        <p>Real EOC-Style Questions · Florida CG Standards · Spring 2024+</p>
      </header>
      <div className="tabs">
        <button
          className={`tab-btn${activeTab === "flashcards" ? " active" : ""}`}
          onClick={() => setActiveTab("flashcards")}
        >
          📇 Cards
        </button>
        <button
          className={`tab-btn${activeTab === "quiz" ? " active" : ""}`}
          onClick={() => setActiveTab("quiz")}
        >
          📝 Quiz
        </button>
      </div>
      <div className="content-area">
        <Flashcards visible={activeTab === "flashcards"} />
        <Quiz visible={activeTab === "quiz"} />
      </div>
    </div>
  );
}

export default App;
