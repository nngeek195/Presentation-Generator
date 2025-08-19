// src/Components/SlideShow/Slideshow_3.js
import React, { useState, useEffect, useRef } from 'react';
import './Slideshow_3.css';

const Slideshow_3 = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const containerRef = useRef(null);

  // Slide Data
  const slides = [
    {
      title: "AI Presentation Magic",
      subtitle: "Turn your ideas into stunning slides instantly",
      icon: "✨",
      content: (
        <div className="magic-effect">
          <div className="spark">⚡</div>
          <div className="text-line">Text → AI → Design</div>
        </div>
      ),
      className: 'slide-magic',
      gradient: 'linear-gradient(135deg, #64f2ff 0%, #29b6f6 100%)'
    },
    {
      title: "Save Time, Work Smarter",
      subtitle: "Create presentations in seconds, not hours",
      icon: "⏱️",
      content: (
        <div className="clock-effect">
          <div className="hour-hand"></div>
          <div className="minute-hand"></div>
          <div className="floating-slides">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="slide-float"></div>
            ))}
          </div>
        </div>
      ),
      className: 'slide-time',
      gradient: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%)'
    },
    {
      title: "Your Ideas, Beautifully Designed",
      subtitle: "From rough notes to polished slides",
      icon: "📝",
      content: (
        <div className="notebook-effect">
          <div className="pages">
            <div className="page">Idea</div>
            <div className="page">→</div>
            <div className="page">Design</div>
          </div>
          <div className="transform-arrow">➡️</div>
          <div className="slides-output">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="output-slide"></div>
            ))}
          </div>
        </div>
      ),
      className: 'slide-design',
      gradient: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)'
    },
    {
      title: "Perfect for Everyone",
      subtitle: "Students, professionals, teachers — all can use it",
      icon: "👥",
      content: (
        <div className="users-effect">
          <div className="user-group">
            <div className="user">🎓</div>
            <div className="user">💼</div>
            <div className="user">🏫</div>
          </div>
          <div className="ai-box">AI</div>
          <div className="slides-out">📄</div>
        </div>
      ),
      className: 'slide-users',
      gradient: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)'
    },
    {
      title: "Future of Presentations",
      subtitle: "Where creativity meets intelligence",
      icon: "🏙️",
      content: (
        <div className="city-effect">
          <div className="skyscraper"></div>
          <div className="skyscraper"></div>
          <div className="skyscraper"></div>
          <div className="screen">📊</div>
          <div className="screen">📈</div>
          <div className="screen">🎯</div>
        </div>
      ),
      className: 'slide-future',
      gradient: 'linear-gradient(135deg, #9c27b0 0%, #673ab7 100%)'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const offset = currentSlide * 420;
    container.style.transform = `translateY(-${offset}px)`;
  }, [currentSlide]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="slideshow-container" ref={containerRef}>
      <div className="slide-track">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`slide-card ${slide.className}`}
            style={{
              transform: `translateY(${(index - currentSlide) * 420}px) rotateX(${
                (index - currentSlide) * -15
              }deg) scale(${1 - Math.abs(index - currentSlide) * 0.1})`,
              zIndex: 10 - Math.abs(index - currentSlide),
              opacity: Math.max(1 - Math.abs(index - currentSlide) * 0.2, 0.2),
              background: slide.gradient,
            }}
          >
            <div className="slide-content">
              <div className="slide-icon">{slide.icon}</div>
              <h3 className="slide-title">{slide.title}</h3>
              <p className="slide-subtitle">{slide.subtitle}</p>
              {slide.content}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="slide-nav">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`nav-dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Slideshow_3;