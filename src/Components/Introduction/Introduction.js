// src/Components/Introduction/Introduction.js
import React, { Component } from 'react';
import './Introduction.css';
import { Link } from 'react-router-dom';
import TypewriterEffect from './TypewriterEffect';
import Header from './Header';
import Slideshow_3 from '../SlideShow/Slideshow_3';

class Introduction extends Component {
  render() {
    return (
      <div className='intro_back'>
        <Header />
        <div id="bg-wrap">
          {/* SVG animation */}

        {/* SVG Background */}
        <div id="bg-wrap">
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 900'>
            {/* Your SVG animation code here */}
            <rect fill='#ffffff' width='1600' height='900' />
            <defs>
              <linearGradient id='a' x1='0' x2='0' y1='1' y2='0' gradientTransform='rotate(0,0.5,0.5)'>
                <stop offset='0' stop-color='rgba(0, 255, 255, 1)' />
                <stop offset='1' stop-color='rgba(204, 255, 102, 1)' />
              </linearGradient>
              <linearGradient id='b' x1='0' x2='0' y1='0' y2='1' gradientTransform='rotate(0,0.5,0.5)'>
                <stop offset='0' stop-color='rgba(255, 0, 0, 1)' />
                <stop offset='1' stop-color='rgba(255, 204, 0, 1)' />
              </linearGradient>
            </defs>
            <g fill='#FFF' fill-opacity='0' stroke-miterlimit='10'>
              <g stroke='url(#a)' stroke-width='4.62'>
                <path transform='translate(-10.5 2.4) rotate(1.5 1409 581) scale(1.006)' d='M1409 581 1450.35 511 1490 581z'>
                  <animateTransform attributeName="transform" type="rotate" from="1.5 1409 581" to="360 1409 581" dur="10s" repeatCount="indefinite" />
                </path>
                <circle stroke-width='1.54' transform='translate(-6 6) rotate(1.8 800 450) scale(1.003)' cx='500' cy='100' r='40'>
                  <animate attributeName="r" from="40" to="60" dur="2s" begin="0s" repeatCount="indefinite" values="40;60;40" />
                  <animateTransform attributeName="transform" type="translate" from="0 0" to="0 20" dur="2s" begin="0s" repeatCount="indefinite" values="0 0;0 20;0 0" />
                </circle>
                <path transform='translate(5.4 -18) rotate(18 401 736) scale(1.003)' d='M400.86 735.5h-83.73c0-23.12 18.74-41.87 41.87-41.87S400.86 712.38 400.86 735.5z'>
                  <animate attributeName="d" dur="3s" repeatCount="indefinite" values="M400.86 735.5h-83.73c0-23.12 18.74-41.87 41.87-41.87S400.86 712.38 400.86 735.5z;M400.86 735.5h-83.73c0-30 18.74-50 41.87-50S400.86 712.38 400.86 735.5z;M400.86 735.5h-83.73c0-23.12 18.74-41.87 41.87-41.87S400.86 712.38 400.86 735.5z" />
                </path>
              </g>
              <g stroke='url(#b)' stroke-width='1.4'>
                <path transform='translate(36 -2.4) rotate(0.6 150 345) scale(0.994)' d='M149.8 345.2 118.4 389.8 149.8 434.4 181.2 389.8z'>
                  <animateTransform attributeName="transform" type="rotate" from="0.6 150 345" to="360 150 345" dur="8s" repeatCount="indefinite" />
                </path>
                <rect stroke-width='3.08' transform='translate(-24 -15) rotate(21.6 1089 759)' x='1039' y='709' width='100' height='100'>
                  <animateTransform attributeName="transform" type="translate" from="0 0" to="0 -20" dur="2s" begin="0s" repeatCount="indefinite" values="0 0;0 -20;0 0" />
                </rect>
                <path transform='translate(-36 12) rotate(3.6 1400 132)' d='M1426.8 132.4 1405.7 168.8 1363.7 168.8 1342.7 132.4 1363.7 96 1405.7 96z'>
                  <animateTransform attributeName="transform" type="scale" from="1" to="1.2" dur="1.5s" begin="0s" repeatCount="indefinite" values="1;1.2;1" />
                </path>
              </g>
            </g>
          
          </svg>
        </div>

        {/* Main Content - Grid Layout */}
        <div className="intro_content">
          <div className='signup_and_login'>
            {/* Sign up / Login buttons */}
          </div>

          <div className="hero-container">
            {/* Left Section - Text & Buttons */}
            <div className="left-section">
              <div className="intro_heading">
                Instantly Create Presentations <br />
                <div className="subsub_Heading">with AI<br /></div>
              </div>

              <div className='intro_subheading'>
                <TypewriterEffect
                  text={[
                    "webify.me makes presentation creation simple and fast.",
                    "Just share your ideas, and AI will design clean,",
                    "ready-to-use slides for you."
                  ]}
                  speed={50}
                />
              </div>

              <div className='start_button'>
                <Link to="/signup">
                  <button>Start Now</button>
                </Link>
              </div>
            </div>

            {/* Right Section - Slideshow */}
            <div className="right-section">
              <Slideshow_3 />
            </div>
          </div>
          <div className='intro_subheading'>
            <TypewriterEffect
              text={
                "Create professional, visually stunning presentations effortlessly with AI. No design skills needed."
              }
              speed={50}
            />
          </div>
          <br />
          </div>
        </div>
      </div>
    );
  }
}

export default Introduction;
