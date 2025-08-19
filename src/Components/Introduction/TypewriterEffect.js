import React, { useState, useEffect } from "react";

const TypewriterEffect = ({ text, speed = 50, delayBetweenLines = 800 }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  // Normalize input: if it's a string, wrap it into an array
  const lines = Array.isArray(text) ? text : [text];

  useEffect(() => {
    if (lineIndex < lines.length) {
      if (charIndex < lines[lineIndex].length) {
        const timeout = setTimeout(() => {
          setDisplayedText(
            (prev) => prev + lines[lineIndex].charAt(charIndex)
          );
          setCharIndex((prev) => prev + 1);
        }, speed);
        return () => clearTimeout(timeout);
      } else {
        // After finishing a line, add a line break and move to next line
        const timeout = setTimeout(() => {
          setDisplayedText((prev) => prev + "\n");
          setLineIndex((prev) => prev + 1);
          setCharIndex(0);
        }, delayBetweenLines);
        return () => clearTimeout(timeout);
      }
    }
  }, [charIndex, lineIndex, lines, speed, delayBetweenLines]);

    return (
        <span className="typewriter-text">
            {displayedText}
            <span className="typewriter-cursor" />
        </span>
    );
};

export default TypewriterEffect;