import React, { useState, useEffect } from 'react';
import image1 from '../SlideShow/Images/image_1.png';
import image2 from '../SlideShow/Images/image_2.png';
import image3 from '../SlideShow/Images/image_3.jpg';
import image4 from '../SlideShow/Images/image_5.png';

// --- CSS Styles ---
// All styles are included here to keep the component self-contained.
const GlobalStyles = () => (
  <style>{`
    /* Import Fonts */
    @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@600;700;800&family=Inter:wght@400;600&display=swap');

    /* CSS Variables for consistent theming */
    :root {
      --primary-blue: #3b82f6;
      --primary-blue-light: #60a5fa;
      --text-dark: #0a1b48;
      --text-light: #4b5563;
      --background-start: #f0f9ff;
      --background-mid: #e0f2fe;
      --background-end: #bae6fd;
    }

    /* Base Body Styles */
    body {
      font-family: 'Inter', sans-serif;
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    /* --- Header Styles --- */
    .header {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        z-index: 20;
        padding: 1rem 2rem;
    }
    
    .header-container {
        max-width: 1400px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border-radius: 12px;
        padding: 0.75rem 1.5rem;
        border: 1px solid rgba(255, 255, 255, 0.3);
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    }
    
    .logo {
        font-family: 'Raleway', sans-serif;
        font-size: 1.75rem;
        font-weight: 700;
        color: var(--text-dark);
    }
    
    .logo span {
        color: var(--primary-blue);
    }
    
    .nav-links {
        display: flex;
        gap: 2rem;
        align-items: center;
    }

    .nav-links a {
        text-decoration: none;
        color: var(--text-dark);
        font-weight: 600;
        transition: color 0.3s ease;
    }
    
    .nav-links a:hover {
        color: var(--primary-blue);
    }

    .login-btn {
        background: transparent;
        border: 2px solid var(--primary-blue);
        color: var(--primary-blue);
        padding: 0.5rem 1.25rem;
        border-radius: 20px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
    }
    
    .login-btn:hover {
        background: var(--primary-blue);
        color: white;
    }
    
    .mobile-menu-btn {
        display: none; /* Hidden on desktop */
    }

    /* --- Main Page Styles --- */
    .intro_back {
        min-height: 100vh;
        background: linear-gradient(135deg, var(--background-start) 0%, var(--background-mid) 50%, var(--background-end) 100%);
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    #bg-wrap {
        position: absolute;
        top: -5%; left: -5%;
        width: 110%;
        height: 110%;
        pointer-events: none;
        opacity: 0.5;
        z-index: 1;
        transition: transform 0.2s ease-out;
    }
    
    .intro_content {
        position: relative;
        z-index: 2;
        padding: 2rem;
        width: 100%;
        max-width: 1400px;
        box-sizing: border-box;
    }
    
    .hero-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 4rem;
        align-items: center;
    }

    .left-section {
        display: flex;
        flex-direction: column;
        text-align: left;
        
    }

    .intro_heading {
        font-family: 'Raleway', sans-serif;
        font-size: clamp(2.5rem, 5vw, 4rem);
        font-weight: 800;
        color: var(--text-dark);
        line-height: 1.2;
        margin-bottom: 0;
    }

    .subsub_Heading {
        font-weight: 700;
        font-size: clamp(2.5rem, 5vw, 4rem);
        color: var(--primary-blue);
        line-height: 1.2;
        animation: soft-glow 2.5s ease-in-out infinite alternate;
        margin: 0;
    }

    @keyframes soft-glow {
        from { text-shadow: 0 0 5px rgba(59, 130, 246, 0.4); }
        to { text-shadow: 0 0 20px rgba(59, 130, 246, 0.8); }
    }
    
    .intro_subheading {
        font-size: clamp(1rem, 2vw, 1.25rem);
        color: var(--text-light);
        max-width: 500px;
        line-height: 1.6;
        font-weight: 400;
        margin: 1.5rem 0 2.5rem 0;
        min-height: 80px; /* prevents layout jump while typing */
    }
    
    .start_button button {
        background: linear-gradient(45deg, var(--primary-blue), var(--primary-blue-light));
        background-size: 200% 100%;
        color: white;
        border: none;
        padding: 1rem 2.5rem;
        border-radius: 30px;
        font-size: 1.1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease-in-out;
        box-shadow: 0 8px 15px rgba(59, 130, 246, 0.2);
    }

    .start_button button:hover {
        transform: translateY(-3px);
        box-shadow: 0 12px 25px rgba(59, 130, 246, 0.4);
        background-position: 100% 0;
    }

    .right-section {
        display: flex;
        justify-content: center;
        align-items: center;
        perspective: 1000px;
    }
    
    /* --- Slideshow Styles --- */
    .slideshow-container {
        position: relative;
        width: 100%;
        max-width: 500px;
        height: 400px;
        border-radius: 20px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        overflow: hidden;
        transform: rotateY(-10deg) rotateX(5deg);
        transition: transform 0.5s ease;
    }

    .slideshow-container:hover {
        transform: rotateY(0) rotateX(0) scale(1.05);
    }

    .slideshow-container img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: opacity 1s ease-in-out, transform 1s ease-in-out;
        opacity: 0;
    }
    
    .slideshow-container img.active {
        opacity: 1;
        transform: scale(1);
    }
    
    .slideshow-container img.inactive {
        transform: scale(1.1);
    }

    /* --- Responsive Design --- */
    @media (max-width: 992px) {
        .hero-container {
            grid-template-columns: 1fr;
            gap: 3rem;
            text-align: center;
        }

        .left-section, .intro_subheading, .start_button {
            align-items: center;
            justify-content: center;
            text-align: center;
        }

        .left-section {
            order: 2;
        }

        .right-section {
            order: 1;
        }
        
        .nav-links {
            display: none; /* Hide nav links on mobile */
        }
        
        .mobile-menu-btn {
            display: block; /* Show hamburger menu */
        }
    }
  `}</style>
);


// Helper Component: Header
const Header = () => (
  <header className="header">
    <div className="header-container">
      <div className="logo">
        <span>webify</span>.me
      </div>
      <button className="mobile-menu-btn">
         <svg xmlns="http://www.w.3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
      </button>
    </div>
  </header>
);

// Helper Component: Typewriter Effect
const TypewriterEffect = ({ lines, speed = 50 }) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handleTyping = () => {
      const fullText = lines[currentLineIndex];
      
      setDisplayedText(
        isDeleting
          ? fullText.substring(0, displayedText.length - 1)
          : fullText.substring(0, displayedText.length + 1)
      );

      if (!isDeleting && displayedText === fullText) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && displayedText === '') {
        setIsDeleting(false);
        setCurrentLineIndex((prev) => (prev + 1) % lines.length);
      }
    };

    const timer = setTimeout(handleTyping, isDeleting ? speed / 2 : speed);
    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, lines, speed, currentLineIndex]);
  
  return <span>{displayedText}</span>;
};


// Helper Component: Slideshow
const Slideshow = () => {
    const images = [
        image1,
        image2,
        image3,
        image4,
    ];
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000);

        return () => clearInterval(intervalId);
    }, [images.length]);

    return (
        <div className="slideshow-container">
            {images.map((src, index) => (
                <img
                    key={src}
                    src={src}
                    alt={`Slide ${index + 1}`}
                    className={index === currentIndex ? 'active' : 'inactive'}
                />
            ))}
        </div>
    );
};


// Main App Component
const App = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      const { clientX, clientY } = event;
      const x = (clientX / window.innerWidth) * 2 - 1;
      const y = (clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const parallaxStyle = {
    transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)`,
  };

  return (
    <>
      <GlobalStyles />
      <div className='intro_back'>
        <Header />

        <div id="bg-wrap" style={parallaxStyle}>
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 900' preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id='a' x1='0' x2='0' y1='1' y2='0'>
                <stop offset='0' stopColor='#6366f1' />
                <stop offset='1' stopColor='#8b5cf6' />
              </linearGradient>
              <linearGradient id='b' x1='0' x2='0' y1='0' y2='1'>
                <stop offset='0' stopColor='#ec4899' />
                <stop offset='1' stopColor='#f97316' />
              </linearGradient>
            </defs>
            <g fill='none' strokeMiterlimit='10'>
              <g stroke='url(#a)' strokeWidth='3'>
                <path transform='translate(-10.5 2.4) rotate(1.5 1409 581) scale(1.006)' d='M1409 581 1450.35 511 1490 581z'>
                  <animateTransform attributeName="transform" type="rotate" from="1.5 1409 581" to="361.5 1409 581" dur="10s" repeatCount="indefinite" />
                </path>
                <circle strokeWidth='1' transform='translate(-6 6) rotate(1.8 800 450) scale(1.003)' cx='500' cy='100' r='40'>
                  <animate attributeName="r" from="40" to="60" dur="2s" begin="0s" repeatCount="indefinite" values="40;60;40" />
                  <animateTransform attributeName="transform" type="translate" from="0 0" to="0 20" dur="2s" begin="0s" repeatCount="indefinite" values="0 0;0 20;0 0" />
                </circle>
                <path transform='translate(5.4 -18) rotate(18 401 736) scale(1.003)' d='M400.86 735.5h-83.73c0-23.12 18.74-41.87 41.87-41.87S400.86 712.38 400.86 735.5z'>
                  <animate attributeName="d" dur="3s" repeatCount="indefinite" values="M400.86 735.5h-83.73c0-23.12 18.74-41.87 41.87-41.87S400.86 712.38 400.86 735.5z;M400.86 735.5h-83.73c0-30 18.74-50 41.87-50S400.86 712.38 400.86 735.5z;M400.86 735.5h-83.73c0-23.12 18.74-41.87 41.87-41.87S400.86 712.38 400.86 735.5z" />
                </path>
              </g>
              <g stroke='url(#b)' strokeWidth='1'>
                <path transform='translate(36 -2.4) rotate(0.6 150 345) scale(0.994)' d='M149.8 345.2 118.4 389.8 149.8 434.4 181.2 389.8z'>
                  <animateTransform attributeName="transform" type="rotate" from="0.6 150 345" to="360.6 150 575" dur="8s" repeatCount="indefinite" />
                </path>
                <rect strokeWidth='2' transform='translate(-24 -15) rotate(21.6 1009 759)' x='1039' y='709' width='100' height='100'>
                  <animateTransform attributeName="transform" type="translate" from="0 0" to="0 -20" dur="2s" begin="0s" repeatCount="indefinite" values="0 0;0 -20;0 0" />
                </rect>
                <path transform='translate(-36 12) rotate(3.6 1400 132)' d='M1426.8 132.4 1405.7 168.8 1363.7 168.8 1342.7 132.4 1363.7 96 1405.7 96z'>
                  <animateTransform attributeName="transform" type="scale" from="1" to="1.2" dur="15s" begin="0s" repeatCount="indefinite" values="1;1.2;1" />
                </path>
              </g>
            </g>
          </svg>
        </div>

        <main className="intro_content">
          <div className="hero-container">
            <div className="left-section">
              <h1 className="intro_heading">
                Instantly Create Presentations
              </h1>
              <div className="subsub_Heading">with AI</div>
              
              <div className='intro_subheading'>
                <TypewriterEffect
                  lines={[
                    "webify.me makes presentation creation simple and fast.",
                    "Just share your ideas, and AI will design clean slides.",
                    "Get your stunning, ready-to-use presentation in seconds."
                  ]}
                  speed={50}
                />
              </div>

              <div className='start_button'>
                 <a href="./SignUp" style={{textDecoration: 'none'}}>
                   <button>Start Now</button>
                 </a>
              </div>
            </div>
            
            <div className="right-section">
              <Slideshow />
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default App;