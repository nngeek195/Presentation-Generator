import React, { Component } from 'react'
import './SignUp.css'
import Grid from '@mui/material/Grid';
import signup_g from '../assests/signup_g.png'
import { Link } from 'react-router-dom'
import SlideShow from '../SlideShow/SlideShow';

class SignUp extends Component {
  render() {
    return (
      <div className='signup_back'>
        <Grid container>
            <Grid className='signup_first_grid' item xs={6}>
                <div className='signup_container'>
                    <div className='signup_container_topic'>
                        <span>Sign Up</span>
                    </div>
                    <div>
                        <input className='signup_input' type='text' placeholder='Username'/><br />
                        <input className='signup_input' type='password' placeholder='Password' /><br />
                    </div>
                    <div className='signup'>
                        <Link to="/login"><button type='submit'>SIGN UP</button></Link>
                    </div>
                    <div className='signup_or'>
                        <span>OR</span>
                    </div >
                    <div className='signup_g'>
                        <button><img src={signup_g}/></button>
                    </div>
                    <div className='havent_account'>
                        <span>Have an account? <Link to="/login">Log in</Link></span>
                    </div>
                </div>
            </Grid>
            <Grid className='signup_second_grid' item xs={6}>
                <div className='signup_tagline'>
                    <span>Getting <br />Started with <br />AI-Powered Presentations.</span>
                </div>
                <div className='slideshow_container'>
                    <SlideShow />
                </div>
            </Grid>
        </Grid>
      </div>
    )
  }
}

export default SignUp