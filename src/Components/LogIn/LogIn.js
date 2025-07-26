import React, { Component } from 'react'
import './LogIn.css'
import Grid from '@mui/material/Grid';
import signup_g from '../assests/signup_g.png'
import login_g from '../assests/login_g.png'

class LogIn extends Component {
  render() {
    return (
      <div className='login_back'>
        <Grid container>
            <Grid className='first_grid' item xs={6}>
                <div className='tagline'>
                    <span>Welcome <br /> simplify your workflow <br />with AI-driven slides.</span>
                </div>
            </Grid>
            <Grid className='second_grid' item xs={6}>
                <div className='login_container'>
                    <div className='login_container_topic'>
                        <span>Login</span>
                    </div>
                    <div>
                        <input className='input' type='text' placeholder='Username'/><br />
                        <input className='input' type='password' placeholder='Password' /><br /><br />
                    </div>
                    <div className='checkbox'>
                        <input type='checkbox' />Remember Me
                    </div>
                    <div className='login'>
                        <button type='submit'>LOGIN</button>
                    </div>
                    <div className='or'>
                        <span>OR</span>
                    </div >
                    <div className='login_g'>
                        <button><img src={login_g}/></button>
                    </div>
                    <div className='have_account'>
                        <span>Don't have an account? <a href=''>Sign Up</a></span>
                    </div>
                </div>
            </Grid>
        </Grid>
      </div>
    )
  }
}

export default LogIn