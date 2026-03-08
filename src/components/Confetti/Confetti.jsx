import { useEffect, useRef } from "react";
import "./confetti.css";

function Confetti({ bookTitle }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const colors = ["#f59e0b", "#10b981", "#3b82f6", "#ec4899", "#8b5cf6", "#ef4444"];
    const pieces = 80;

    for (let i = 0; i < pieces; i++) {
      const el = document.createElement("div");
      el.className = "confetti-piece";
      el.style.left = `${Math.random() * 100}%`;
      el.style.background = colors[Math.floor(Math.random() * colors.length)];
      el.style.width = `${6 + Math.random() * 8}px`;
      el.style.height = `${6 + Math.random() * 8}px`;
      el.style.animationDelay = `${Math.random() * 1.2}s`;
      el.style.animationDuration = `${2 + Math.random() * 2}s`;
      el.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
      container.appendChild(el);
    }

    return () => {
      while (container.firstChild) container.removeChild(container.firstChild);
    };
  }, []);

  return (
    <div className="confetti-overlay">
      <div className="confetti-container" ref={containerRef} />
      <div className="confetti-message">
        <div className="confetti-emoji">🎉</div>
        <div className="confetti-text">
          <strong>Finished!</strong>
        </div>
        <div className="confetti-book-title">"{bookTitle}"</div>
        <div className="confetti-sub">Great job! Keep reading!</div>
      </div>
    </div>
  );
}

export default Confetti;
