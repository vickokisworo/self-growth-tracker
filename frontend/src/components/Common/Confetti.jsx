// frontend/src/components/Common/Confetti.jsx
import React, { useEffect, useState } from "react";
import "./Confetti.css";

const Confetti = ({ trigger, duration = 3000 }) => {
  const [show, setShow] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState([]);

  useEffect(() => {
    if (trigger) {
      setShow(true);
      generateConfetti();

      const timer = setTimeout(() => {
        setShow(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [trigger, duration]);

  const generateConfetti = () => {
    const pieces = [];
    const colors = [
      "#ff6b6b",
      "#4ecdc4",
      "#45b7d1",
      "#feca57",
      "#ee5a6f",
      "#a55eea",
    ];

    for (let i = 0; i < 50; i++) {
      pieces.push({
        id: i,
        color: colors[Math.floor(Math.random() * colors.length)],
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 2,
        size: 8 + Math.random() * 8,
        rotation: Math.random() * 360,
      });
    }

    setConfettiPieces(pieces);
  };

  if (!show) return null;

  return (
    <div className="confetti-container">
      {confettiPieces.map((piece) => (
        <div
          key={piece.id}
          className="confetti-piece"
          style={{
            left: `${piece.left}%`,
            backgroundColor: piece.color,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            transform: `rotate(${piece.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
};

// Hook for easy confetti triggering
export const useConfetti = () => {
  const [trigger, setTrigger] = useState(false);

  const celebrate = () => {
    setTrigger(true);
    setTimeout(() => setTrigger(false), 100);
  };

  return { trigger, celebrate };
};

export default Confetti;
