import React, { Component } from 'react'
import './Introduction.css'
import { Link } from 'react-router-dom'

class Introduction extends Component {
  render() {
    return (
      <div className='intro_back'>
        <div className='signup_and_login'>
            <Link to="/signup"><button className='intro_sign'>Sign Up</button></Link>
            <Link to="/login"><button className='intro_login'>Login</button></Link>
        </div>
        <div className='intro_heading'>
            <span>Turn Your Ideas Into Stunning Presentations <br /> Instantly with AI</span>
        </div>
        <div className='intro_subheading'>
            <p>
            Create professional, visually engaging presentations in just a few clicks.<br />
            No design skills? No problem <br />let AI do the heavy lifting for you.
            </p>
        </div>
        <br />
        <div className='start_button'>
            <Link to="/signup"><button>Start Now</button></Link>
        </div>
      </div>
    )
  }
}

export default Introduction