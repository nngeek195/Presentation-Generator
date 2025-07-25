import React, { Component } from 'react'
import './Home.css'

class Home extends Component {
  render() {
    return (
      <div>
        <div className='home_mainTopic'>
            <h1>AI Presentation Generator</h1>
            <span>Transform your ideas into stunning presentations with the power of AI</span>
        </div>
        <div className='generate'>
            <button>Generate</button>
        </div>
      </div>
    )
  }
}

export default Home