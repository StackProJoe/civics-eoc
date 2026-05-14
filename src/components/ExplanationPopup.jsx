import React from "react";

function ExplanationPopup({ show, body, onClose }) {
  return (
    <div id="explanationPopup" className={show ? "show" : ""}>
      <div className="popup-inner">
        <div className="popup-header">
          <span className="popup-title">Why you got it wrong</span>
          <button className="popup-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="popup-body">{body}</div>
      </div>
    </div>
  );
}

export default ExplanationPopup;
