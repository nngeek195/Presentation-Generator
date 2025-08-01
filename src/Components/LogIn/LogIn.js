import React, { Component } from 'react'
import './LogIn.css'
import Grid from '@mui/material/Grid';
import login_g from '../assests/login_g.png'
import { Link } from 'react-router-dom'
import SlideShow_2 from '../SlideShow/SlideShow_2';


class LogIn extends Component {
  render() {
    return (
      <div className='login_back'>
        <Grid container>
            <Grid className='login_first_grid' item xs={6}>
                <div className='slideshow_2_container'>
                    <SlideShow_2 />
                </div>
            </Grid>
            <Grid className='login_second_grid' item xs={6}>
                <div className='login_container'>
                    <div className='login_container_topic'>
                        <span>Login</span>
                    </div>
                    <div>
                        <input className='login_input' type='email' placeholder='Email'/><br />
                        <input className='login_input' type='password' placeholder='Password' /><br /><br />
                    </div>
                    <div className='login_checkbox'>
                        <input type='checkbox' />Remember Me
                    </div>
                    <div className='login'>
                        <Link to="/user"><button type='submit'>LOGIN</button></Link>
                    </div>
                    <div className='login_or'>
                        <hr className='hr1_login'/>
                        <span>OR</span>
                        <hr className='hr2_login'/>
                    </div >
                    <div className='login_g'>
                        <button><img src={login_g}/></button>
                    </div>
                    <div className='have_account'>
                        <span>Don't have an account? <Link to="/signup">Sign Up</Link></span>
                    </div>
                </div>
            </Grid>
        </Grid>
      </div>
    )
  }
}

export default LogIn