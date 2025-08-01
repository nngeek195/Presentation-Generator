import React, { useState, useEffect } from 'react';

const TypewriterEffect = ({ text, speed }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (index < text.length) {
            const timeout = setTimeout(() => {
                setDisplayedText((prev) => prev + text[index]);
                setIndex(index + 1);
            }, speed);
            return () => clearTimeout(timeout);
        }
    }, [index, text, speed]);

    return (
        <span className="typewriter-text">
            {displayedText}
            <span className="typewriter-cursor" />
        </span>
    );
};

export default TypewriterEffect;