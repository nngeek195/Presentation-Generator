import React, { Component } from 'react'
import './SignUp.css'
import Grid from '@mui/material/Grid';
import signup_g from '../assests/signup_g.png'
import "@fontsource/poppins"; 

class SignUp extends Component {
  render() {
    return (
      <div>
        <Grid container>
            <Grid className='first_grid' item xs={6}>
                <div className='signup_container'>
                    <div className='signup_container_topic'>
                        <span>Sign Up</span>
                    </div>
                    <div>
                        <input className='input' type='text' placeholder='username'/><br />
                        <input className='input' type='password' placeholder='Password' /><br />
                    </div>
                    <div className='signup'>
                        <button type='submit'>SIGN UP</button>
                    </div>
                    <div className='or'>
                        <span>OR</span>
                    </div >
                    <div className='signup_g'>
                        <button><img src={signup_g}/></button>
                    </div>
                    <div className='have_account'>
                        <span>Have an account? <a href=''>Log In</a></span>
                    </div>
                </div>
            </Grid>
            <Grid className='second_grid' item xs={6}></Grid>
        </Grid>
      </div>
    )
  }
}

export default SignUp