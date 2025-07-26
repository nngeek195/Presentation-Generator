import React, { Component } from 'react'
import { FaEye, FaEyeSlash } from "react-icons/fa";
import './PasswordInput.css'

class PasswordInput extends Component {

    constructor(props) {
      super(props)
    
      this.state = {
         showPassword: false
      }
    }

    togglePassword = () => {
        this.setState((preState)=>({
            showPassword: !preState.showPassword
        }))
    }

  render() {
    return (
      <div className='inputPassword'>
        <input className='input' type={this.state.showPassword ? "text" : "password"} placeholder='Password'/>
        <span className='eyeicon' onClick={this.togglePassword}>{this.state.showPassword? <FaEyeSlash />: <FaEye />}</span>
      </div>
    )
  }
}

export default PasswordInput