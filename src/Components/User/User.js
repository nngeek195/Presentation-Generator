import React, { Component } from 'react'
import './User.css'
import Grid from '@mui/material/Grid'
import Logo from './Logo.png'
import {FaUserCircle, FaPlus} from 'react-icons/fa'
import Presentation_1 from './Presentation_1.png'
import { MdOutlineDelete, MdOutlineDriveFileRenameOutline, MdOutlineDownload } from "react-icons/md";
import { RiShareForwardLine } from "react-icons/ri";

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
              <Grid item xs={8} className='presentations'>
                  <div className='presentations_create'>
                    <button><FaPlus className='plusicon'/> Create New</button>
                  </div>
                  <div className='presentations_container_1'>
                  <div className='presentation_1'>
                    <div className='presentation_1_image'><img src={Presentation_1} /></div>
                    <div className='presentation_1_topic'><span>Presentation 01</span></div>
                    <div className='presentation_1_icons'><MdOutlineDelete title='Delete'/> <MdOutlineDownload title='Download'/> <MdOutlineDriveFileRenameOutline title='Rename'/></div>
                    <div className='presentation_1_view'><button>View</button></div>
                  </div>
                  <div className='presentation_2'>
                    <div className='presentation_2_image'><img src={Presentation_1} /></div>
                    <div className='presentation_2_topic'><span>Presentation 02</span></div>
                    <div className='presentation_2_icons'><MdOutlineDelete title='Delete'/> <MdOutlineDownload title='Download'/> <MdOutlineDriveFileRenameOutline title='Rename'/></div>
                    <div className='presentation_2_view'><button>View</button></div>
                  </div>
                  <div className='presentation_3'>
                    <div className='presentation_3_image'><img src={Presentation_1} /></div>
                    <div className='presentation_3_topic'><span>Presentation 03</span></div>
                    <div className='presentation_3_icons'><MdOutlineDelete title='Delete'/> <MdOutlineDownload title='Download'/> <MdOutlineDriveFileRenameOutline title='Rename'/></div>
                    <div className='presentation_3_view'><button>View</button></div>
                  </div>
                  <div className='presentation_4'>
                    <div className='presentation_4_image'><img src={Presentation_1} /></div>
                    <div className='presentation_4_topic'><span>Presentation 04</span></div>
                    <div className='presentation_4_icons'><MdOutlineDelete title='Delete'/> <MdOutlineDownload title='Download'/> <MdOutlineDriveFileRenameOutline title='Rename'/></div>
                    <div className='presentation_4_view'><button>View</button></div>
                  </div>
                  <div className='presentation_5'>
                    <div className='presentation_5_image'><img src={Presentation_1} /></div>
                    <div className='presentation_5_topic'><span>Presentation 05</span></div>
                    <div className='presentation_5_icons'><MdOutlineDelete title='Delete'/> <MdOutlineDownload title='Download'/> <MdOutlineDriveFileRenameOutline title='Rename'/></div>
                    <div className='presentation_5_view'><button>View</button></div>
                  </div>
                  </div>

                  <div className='presentations_container_2'>
                  <div className='presentation_6'>
                    <div className='presentation_6_image'><img src={Presentation_1} /></div>
                    <div className='presentation_6_topic'><span>Presentation 06</span></div>
                    <div className='presentation_6_icons'><MdOutlineDelete title='Delete'/> <MdOutlineDownload title='Download'/> <MdOutlineDriveFileRenameOutline title='Rename'/></div>
                    <div className='presentation_6_view'><button>View</button></div>
                  </div>
                  <div className='presentation_7'>
                    <div className='presentation_7_image'><img src={Presentation_1} /></div>
                    <div className='presentation_7_topic'><span>Presentation 07</span></div>
                    <div className='presentation_7_icons'><MdOutlineDelete title='Delete'/> <MdOutlineDownload title='Download'/> <MdOutlineDriveFileRenameOutline title='Rename'/></div>
                    <div className='presentation_7_view'><button>View</button></div>
                  </div>
                  <div className='presentation_8'>
                    <div className='presentation_8_image'><img src={Presentation_1} /></div>
                    <div className='presentation_8_topic'><span>Presentation 08</span></div>
                    <div className='presentation_8_icons'><MdOutlineDelete title='Delete'/> <MdOutlineDownload title='Download'/> <MdOutlineDriveFileRenameOutline title='Rename'/></div>
                    <div className='presentation_8_view'><button>View</button></div>
                  </div>
                  <div className='presentation_9'>
                    <div className='presentation_9_image'><img src={Presentation_1} /></div>
                    <div className='presentation_9_topic'><span>Presentation 09</span></div>
                    <div className='presentation_9_icons'><MdOutlineDelete title='Delete'/> <MdOutlineDownload title='Download'/> <MdOutlineDriveFileRenameOutline title='Rename'/></div>
                    <div className='presentation_9_view'><button>View</button></div>
                  </div>
                  <div className='presentation_10'>
                    <div className='presentation_10_image'><img src={Presentation_1} /></div>
                    <div className='presentation_10_topic'><span>Presentation 10</span></div>
                    <div className='presentation_10_icons'><MdOutlineDelete title='Delete'/> <MdOutlineDownload title='Download'/> <MdOutlineDriveFileRenameOutline title='Rename'/></div>
                    <div className='presentation_10_view'><button>View</button></div>
                  </div>
                  </div>
              </Grid>
          </Grid>
        </div>
      </div>
    )
  }
}

export default User