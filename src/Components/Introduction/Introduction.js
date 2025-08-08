// import React, { Component } from 'react'
// import './Introduction.css'
// import { Link } from 'react-router-dom'
// import TypewriterEffect from './TypewriterEffect';

// class Introduction extends Component {
//   render() {
//     return (
//       <div className='intro_back'>
//         <div id="bg-wrap">
//           {/* SVG animation */}
//           <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
//             <defs>
//               <radialGradient id="Gradient1" cx="50%" cy="50%" fx="0.441602%" fy="50%" r=".5">
//                 <animate attributeName="fx" dur="34s" values="0%;3%;0%" repeatCount="indefinite"></animate>
//                 <stop offset="0%" stop-color="#cec1d5ff"></stop>
//                 <stop offset="100%" stop-color="rgba(179, 170, 221, 0)"></stop>
//               </radialGradient>
//               <radialGradient id="Gradient2" cx="50%" cy="50%" fx="2.68147%" fy="50%" r=".5">
//                 <animate attributeName="fx" dur="23.5s" values="0%;3%;0%" repeatCount="indefinite"></animate>
//                 <stop offset="0%" stop-color="#f1ecfaff"></stop>
//                 <stop offset="100%" stop-color="rgba(63, 142, 238, 0)"></stop>
//               </radialGradient>
//               <radialGradient id="Gradient3" cx="50%" cy="50%" fx="0.836536%" fy="50%" r=".5">
//                 <animate attributeName="fx" dur="21.5s" values="0%;3%;0%" repeatCount="indefinite"></animate>
//                 <stop offset="0%" stop-color="#cdcef4ff"></stop>
//                 <stop offset="100%" stop-color="rgba(125, 127, 226, 0)"></stop>
//               </radialGradient>
//               <radialGradient id="Gradient4" cx="50%" cy="50%" fx="4.56417%" fy="50%" r=".5">
//                 <animate attributeName="fx" dur="23s" values="0%;5%;0%" repeatCount="indefinite"></animate>
//                 <stop offset="0%" stop-color="#5390d9"></stop>
//                 <stop offset="100%" stop-color="rgba(118, 172, 238, 0)"></stop>
//               </radialGradient>
//               <radialGradient id="Gradient5" cx="50%" cy="50%" fx="2.65405%" fy="50%" r=".5">
//                 <animate attributeName="fx" dur="24.5s" values="0%;5%;0%" repeatCount="indefinite"></animate>
//                 <stop offset="0%" stop-color="#4ea8de"></stop>
//                 <stop offset="100%" stop-color="#4ea8de00"></stop>
//               </radialGradient>
//               <radialGradient id="Gradient6" cx="50%" cy="50%" fx="0.981338%" fy="50%" r=".5">
//                 <animate attributeName="fx" dur="25.5s" values="0%;5%;0%" repeatCount="indefinite"></animate>
//                 <stop offset="0%" stop-color="#48bfe3"></stop>
//                 <stop offset="100%" stop-color="#48bfe300"></stop>
//               </radialGradient>
              
//             </defs>
//             <rect x="13.744%" y="1.18473%" width="100%" height="100%" fill="url(#Gradient1)" transform="rotate(334.41 50 50)">
//               <animate attributeName="x" dur="20s" values="25%;0%;25%" repeatCount="indefinite"></animate>
//               <animate attributeName="y" dur="21s" values="0%;25%;0%" repeatCount="indefinite"></animate>
//               <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="7s" repeatCount="indefinite"></animateTransform>
//             </rect>
//             <rect x="-2.17916%" y="35.4267%" width="100%" height="100%" fill="url(#Gradient2)" transform="rotate(255.072 50 50)">
//               <animate attributeName="x" dur="23s" values="-25%;0%;-25%" repeatCount="indefinite"></animate>
//               <animate attributeName="y" dur="24s" values="0%;50%;0%" repeatCount="indefinite"></animate>
//               <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="12s" repeatCount="indefinite"></animateTransform>
//             </rect>
//             <rect x="9.00483%" y="14.5733%" width="100%" height="100%" fill="url(#Gradient3)" transform="rotate(139.903 50 50)">
//               <animate attributeName="x" dur="25s" values="0%;25%;0%" repeatCount="indefinite"></animate>
//               <animate attributeName="y" dur="12s" values="0%;25%;0%" repeatCount="indefinite"></animate>
//               <animateTransform attributeName="transform" type="rotate" from="360 50 50" to="0 50 50" dur="9s" repeatCount="indefinite"></animateTransform>
//             </rect>
          
//           </svg>
//         </div>
//         <div className="intro_content">
//           <div className='signup_and_login'>
//             <Link to="/signup"><button className='intro_sign'>Sign Up</button></Link>
//             <Link to="/login"><button className='intro_login'>Login</button></Link>
//           </div>
//           <div className="intro_heading ">
//             Turn Your Ideas Into Stunning Presentations<br/>
//             Instantly with AI <br/>
//           </div>
//           <div className='intro_subheading'>
//               <TypewriterEffect
//                 text={
//                     "Create professional, visually engaging presentations in just a few clicks. No design skills? No problem – let AI do the heavy lifting for you."
//                 }
//                 speed={40}
//               />
//           </div>
//           <br />
//           <div className='start_button'>
//               <Link to="/signup"><button>Start Now</button></Link>
//           </div>
//         </div>
//       </div>
//     )
//   }
// }

// export default Introduction