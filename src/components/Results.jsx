import React, { useState, useEffect } from "react";
import { CAT_NAMES } from "../data/flashcards";

const W3F_KEY = "9d968614-218d-4d49-9b87-e0405f0847e0";

function Results({ pct, score, total, catScores, onRestart }) {
  const [emailMsg, setEmailMsg] = useState("");

  let level, levelLabel, levelColor, levelDesc;
  if (pct >= 90) {
    level = 5; levelLabel = "Level 5"; levelColor = "#1a6b3a"; levelDesc = "Mastery — EOC Ready! 🏆";
  } else if (pct >= 80) {
    level = 4; levelLabel = "Level 4"; levelColor = "#27ae60"; levelDesc = "Above Satisfactory ⭐";
  } else if (pct >= 70) {
    level = 3; levelLabel = "Level 3"; levelColor = "#d4ac0d"; levelDesc = "Satisfactory 📚";
  } else if (pct >= 58) {
    level = 2; levelLabel = "Level 2"; levelColor = "#e67e22"; levelDesc = "Below Satisfactory ⚠️";
  } else {
    level = 1; levelLabel = "Level 1"; levelColor = "#c0392b"; levelDesc = "Inadequate — Keep Studying 💪";
  }

  useEffect(() => {
    const grade = pct >= 90 ? "A" : pct >= 80 ? "B" : pct >= 70 ? "C" : pct >= 60 ? "D" : "F";
    const dateStr = new Date().toLocaleDateString("en-US", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    });
    const timeStr = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit", minute: "2-digit",
    });

    const catLines = Object.entries(catScores)
      .map(([cat, s]) => {
        if (s.t === 0) return null;
        const p = Math.round((s.c / s.t) * 100);
        const icon = p >= 75 ? "✅" : p >= 50 ? "⚠️" : "❌";
        return `${icon} ${CAT_NAMES[cat]}: ${s.c}/${s.t} (${p}%)`;
      })
      .filter(Boolean)
      .join("\n");

    const message =
      `FL Civics EOC Quiz Results\nDate: ${dateStr} at ${timeStr}\n\n` +
      `OVERALL SCORE: ${pct}% — Grade ${grade} — EOC Level ${level}/5\n` +
      `${score} out of ${total} correct\n\n` +
      `FL EOC Scale: Level 1 (<58%) | Level 2 (58-69%) | Level 3 (70-79%) | Level 4 (80-89%) | Level 5 (90-100%)\n\n` +
      `CATEGORY BREAKDOWN:\n${catLines}\n\nSent automatically by FL Civics EOC Study App`;

    setEmailMsg("📧 Sending results to parent…");

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: W3F_KEY,
        subject: `📊 Civics EOC: ${pct}% (${grade}) — ${dateStr}`,
        from_name: "Civics EOC Study App",
        message,
        botcheck: "",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setEmailMsg("✅ Results sent to parent!");
        } else {
          throw new Error(data.message || "Failed");
        }
      })
      .catch((err) => {
        console.error("Email failed:", err);
        setEmailMsg("⚠️ Could not send email — check internet connection.");
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="results-card">
      <h2>Quiz Complete!</h2>
      <div className="big-score">{pct}%</div>
      <div
        style={{
          display: "inline-block",
          background: levelColor,
          color: "white",
          fontFamily: "'Playfair Display', serif",
          fontWeight: 700,
          fontSize: "1rem",
          padding: "5px 18px",
          borderRadius: "20px",
          marginBottom: "4px",
        }}
      >
        {levelLabel}
      </div>
      <div style={{ fontSize: "0.82rem", color: "#555", marginBottom: "4px" }}>
        {levelDesc}
      </div>
      <div className="score-sub">
        {score} out of {total} correct
      </div>
      <div
        style={{
          background: "#f0ece0",
          borderRadius: "10px",
          padding: "8px 12px",
          marginBottom: "10px",
          fontSize: "0.75rem",
          color: "#444",
          textAlign: "left",
          width: "100%",
        }}
      >
        <strong style={{ color: "#1a2744" }}>FL EOC Scale: </strong>
        <span style={{ color: "#c0392b" }}>1</span> (&lt;58%) ·{" "}
        <span style={{ color: "#e67e22" }}>2</span> (58–69%) ·{" "}
        <span style={{ color: "#d4ac0d" }}>3</span> (70–79%) ·{" "}
        <span style={{ color: "#27ae60" }}>4</span> (80–89%) ·{" "}
        <span style={{ color: "#1a6b3a" }}>5</span> (90–100%)
      </div>
      <div className="cat-breakdown">
        {Object.entries(catScores).map(([cat, s]) => {
          if (s.t === 0) return null;
          const p = Math.round((s.c / s.t) * 100);
          const cls = p >= 75 ? "good" : p >= 50 ? "ok" : "bad";
          return (
            <div key={cat} className={`cat-row ${cls}`}>
              <span>{CAT_NAMES[cat]}</span>
              <span>
                {s.c}/{s.t} ({p}%)
              </span>
            </div>
          );
        })}
      </div>
      <div
        style={{
          marginTop: "6px",
          fontSize: "0.75rem",
          fontWeight: 600,
          textAlign: "center",
          minHeight: "16px",
          color: emailMsg.startsWith("✅") ? "#27ae60" : emailMsg.startsWith("⚠️") ? "#c0392b" : "#888",
        }}
      >
        {emailMsg}
      </div>
      <div style={{ marginTop: "8px", width: "100%" }}>
        <button className="restart-btn" style={{ width: "100%" }} onClick={onRestart}>
          🔄 Try Again
        </button>
      </div>
    </div>
  );
}

export default Results;
