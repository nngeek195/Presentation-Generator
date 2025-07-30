import React, { Component } from 'react'
import './User.css'
import Grid from '@mui/material/Grid'
import Logo from './Logo.png'
import {FaUserCircle} from 'react-icons/fa'

class User extends Component {
  render() {
    return (
      <div>
        <div className='header'>
            <Grid container>
                <Grid item xs={6} className='header_one'>
                    <img src={Logo} className='logo' />
                </Grid>
                <Grid item xs={6} className='header_two'>
                    <button className='header_logout'>Log Out</button>
                    <FaUserCircle className='default_icon_1' />
                </Grid>
            </Grid>
            <hr />
        </div>
        <div>
          <Grid container>
              <Grid item xs={4} className='user_profile'>
                  <div className='user_profile_deatils'>
                    <FaUserCircle className='default_icon_2' /><br />
                    <input type='text' value='Email' readOnly className='user_email'/><br />
                    <input type='text' value='Username' readOnly className='user_username'/><br />
                    <button className='recover_pw'>Recover Password</button>
                  </div>
              </Grid>
              <Grid item xs={8}>
                  <div className='presentations'>

                  </div>
              </Grid>
          </Grid>
        </div>
      </div>
    )
  }
}

export default User