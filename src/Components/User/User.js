import React, { Component } from 'react'
import './User.css'
import Grid from '@mui/material/Grid'
import Logo from './Logo1.png'
import { FaUserCircle, FaPlus } from 'react-icons/fa'
import Presentation_1 from './Presentation_1.png'
import { MdOutlineDelete, MdOutlineDriveFileRenameOutline, MdOutlineDownload } from "react-icons/md";
import { Link } from 'react-router-dom'

class User extends Component {
  render() {
    return (
      <div className='user_back'>
        <div className='header'>
          <Grid container>
            <Grid item xs={6} className='header_one'>
              <img src={Logo} className='logo' alt='' />
            </Grid>
            <Grid item xs={6} className='header_two'>
              <Link to="/login"><button className='header_logout'>Log Out</button></Link>
              <FaUserCircle className='default_icon_1' />
            </Grid>
          </Grid>
          <hr />
            <Grid container>
                <Grid item xs={6} className='header_one'>
                    <img src={Logo} className='logo' alt='' />
                </Grid>
                <Grid item xs={6} className='header_two'>
                  <button className='workspace_button'>User's Workspace</button>
                  {/* Logout button */}
                    {/* <Link to="/login"><button className='header_logout'>Log Out</button></Link> */}
                    {/* profile icon */}
                    {/* <FaUserCircle className='default_icon_1' /> */}
                </Grid>
            </Grid>
            <hr />
        </div>
        <div>
          <Grid container>
            <Grid item xs={4} className='user_profile'>
              <div className='user_profile_deatils'>
                <FaUserCircle className='default_icon_2' /><br />
                <input type='text' value='Email' readOnly className='user_email' /><br />
                <input type='text' value='Username' readOnly className='user_username' /><br />
                <button className='recover_pw'>Recover Password</button>
              </div>
            </Grid>
            <Grid item xs={8} className='presentations'>
              <div className='presentations_create'>
                <button><FaPlus className='plusicon' /> Create New</button>
              </div>
              <div className='presentations_container'>
                <div className='presentation'>
                  <div className='presentation_image'><img src={Presentation_1} alt='' /></div>
                  <div className='presentation_topic'><span>Presentation 01</span></div>
                  <div className='presentation_icons'><MdOutlineDelete title='Delete' /> <MdOutlineDownload title='Download' /> <MdOutlineDriveFileRenameOutline title='Rename' /></div>
                  <div className='presentation_view'><button>View</button></div>
                </div>
                <div className='presentation'>
                  <div className='presentation_image'><img src={Presentation_1} alt='' /></div>
                  <div className='presentation_topic'><span>Presentation 02</span></div>
                  <div className='presentation_icons'><MdOutlineDelete title='Delete' /> <MdOutlineDownload title='Download' /> <MdOutlineDriveFileRenameOutline title='Rename' /></div>
                  <div className='presentation_view'><button>View</button></div>
                </div>
                <div className='presentation'>
                  <div className='presentation_image'><img src={Presentation_1} alt='' /></div>
                  <div className='presentation_topic'><span>Presentation 03</span></div>
                  <div className='presentation_icons'><MdOutlineDelete title='Delete' /> <MdOutlineDownload title='Download' /> <MdOutlineDriveFileRenameOutline title='Rename' /></div>
                  <div className='presentation_view'><button>View</button></div>
                </div>
                <div className='presentation'>
                  <div className='presentation_image'><img src={Presentation_1} alt='' /></div>
                  <div className='presentation_topic'><span>Presentation 04</span></div>
                  <div className='presentation_icons'><MdOutlineDelete title='Delete' /> <MdOutlineDownload title='Download' /> <MdOutlineDriveFileRenameOutline title='Rename' /></div>
                  <div className='presentation_view'><button>View</button></div>
                </div>
                <div className='presentation'>
                  <div className='presentation_image'><img src={Presentation_1} alt='' /></div>
                  <div className='presentation_topic'><span>Presentation 05</span></div>
                  <div className='presentation_icons'><MdOutlineDelete title='Delete' /> <MdOutlineDownload title='Download' /> <MdOutlineDriveFileRenameOutline title='Rename' /></div>
                  <div className='presentation_view'><button>View</button></div>
                </div>
              </div>
              <div className='presentations'>
                  <div className='presentations_create'>
                    <button><FaPlus className='plusicon'/> Create New</button>
                  </div>
                  <div className='presentations_container'>
                  <div className='presentation'>
                    <div className='presentation_image'><img src={Presentation_1} alt=''/></div>
                    <div className='presentation_topic'><span>Presentation 01</span></div>
                    <div className='presentation_icons'><MdOutlineDelete title='Delete'/> <MdOutlineDownload title='Download'/> <MdOutlineDriveFileRenameOutline title='Rename'/></div>
                    <div className='presentation_view'><button>View</button></div>
                  </div>
                  <div className='presentation'>
                    <div className='presentation_image'><img src={Presentation_1} alt='' /></div>
                    <div className='presentation_topic'><span>Presentation 02</span></div>
                    <div className='presentation_icons'><MdOutlineDelete title='Delete'/> <MdOutlineDownload title='Download'/> <MdOutlineDriveFileRenameOutline title='Rename'/></div>
                    <div className='presentation_view'><button>View</button></div>
                  </div>
                  <div className='presentation'>
                    <div className='presentation_image'><img src={Presentation_1} alt='' /></div>
                    <div className='presentation_topic'><span>Presentation 03</span></div>
                    <div className='presentation_icons'><MdOutlineDelete title='Delete'/> <MdOutlineDownload title='Download'/> <MdOutlineDriveFileRenameOutline title='Rename'/></div>
                    <div className='presentation_view'><button>View</button></div>
                  </div>
                  <div className='presentation'>
                    <div className='presentation_image'><img src={Presentation_1} alt='' /></div>
                    <div className='presentation_topic'><span>Presentation 04</span></div>
                    <div className='presentation_icons'><MdOutlineDelete title='Delete'/> <MdOutlineDownload title='Download'/> <MdOutlineDriveFileRenameOutline title='Rename'/></div>
                    <div className='presentation_view'><button>View</button></div>
                  </div>
                  <div className='presentation'>
                    <div className='presentation_image'><img src={Presentation_1} alt='' /></div>
                    <div className='presentation_topic'><span>Presentation 05</span></div>
                    <div className='presentation_icons'><MdOutlineDelete title='Delete'/> <MdOutlineDownload title='Download'/> <MdOutlineDriveFileRenameOutline title='Rename'/></div>
                    <div className='presentation_view'><button>View</button></div>
                  </div>
                  </div>

              <div className='presentations_container'>
                <div className='presentation'>
                  <div className='presentation_image'><img src={Presentation_1} alt='' /></div>
                  <div className='presentation_topic'><span>Presentation 06</span></div>
                  <div className='presentation_icons'><MdOutlineDelete title='Delete' /> <MdOutlineDownload title='Download' /> <MdOutlineDriveFileRenameOutline title='Rename' /></div>
                  <div className='presentation_view'><button>View</button></div>
                </div>
                <div className='presentation'>
                  <div className='presentation_image'><img src={Presentation_1} alt='' /></div>
                  <div className='presentation_topic'><span>Presentation 07</span></div>
                  <div className='presentation_icons'><MdOutlineDelete title='Delete' /> <MdOutlineDownload title='Download' /> <MdOutlineDriveFileRenameOutline title='Rename' /></div>
                  <div className='presentation_view'><button>View</button></div>
                </div>
                <div className='presentation'>
                  <div className='presentation_image'><img src={Presentation_1} alt='' /></div>
                  <div className='presentation_topic'><span>Presentation 08</span></div>
                  <div className='presentation_icons'><MdOutlineDelete title='Delete' /> <MdOutlineDownload title='Download' /> <MdOutlineDriveFileRenameOutline title='Rename' /></div>
                  <div className='presentation_view'><button>View</button></div>
                </div>
                <div className='presentation'>
                  <div className='presentation_image'><img src={Presentation_1} alt='' /></div>
                  <div className='presentation_topic'><span>Presentation 09</span></div>
                  <div className='presentation_icons'><MdOutlineDelete title='Delete' /> <MdOutlineDownload title='Download' /> <MdOutlineDriveFileRenameOutline title='Rename' /></div>
                  <div className='presentation_view'><button>View</button></div>
                </div>
                <div className='presentation'>
                  <div className='presentation_image'><img src={Presentation_1} alt='' /></div>
                  <div className='presentation_topic'><span>Presentation 10</span></div>
                  <div className='presentation_icons'><MdOutlineDelete title='Delete' /> <MdOutlineDownload title='Download' /> <MdOutlineDriveFileRenameOutline title='Rename' /></div>
                  <div className='presentation_view'><button>View</button></div>
                </div>
              </div>
            </Grid>
          </Grid>
                  <div className='presentations_container'>
                  <div className='presentation'>
                    <div className='presentation_image'><img src={Presentation_1} alt='' /></div>
                    <div className='presentation_topic'><span>Presentation 06</span></div>
                    <div className='presentation_icons'><MdOutlineDelete title='Delete'/> <MdOutlineDownload title='Download'/> <MdOutlineDriveFileRenameOutline title='Rename'/></div>
                    <div className='presentation_view'><button>View</button></div>
                  </div>
                  <div className='presentation'>
                    <div className='presentation_image'><img src={Presentation_1} alt='' /></div>
                    <div className='presentation_topic'><span>Presentation 07</span></div>
                    <div className='presentation_icons'><MdOutlineDelete title='Delete'/> <MdOutlineDownload title='Download'/> <MdOutlineDriveFileRenameOutline title='Rename'/></div>
                    <div className='presentation_view'><button>View</button></div>
                  </div>
                  <div className='presentation'>
                    <div className='presentation_image'><img src={Presentation_1} alt='' /></div>
                    <div className='presentation_topic'><span>Presentation 08</span></div>
                    <div className='presentation_icons'><MdOutlineDelete title='Delete'/> <MdOutlineDownload title='Download'/> <MdOutlineDriveFileRenameOutline title='Rename'/></div>
                    <div className='presentation_view'><button>View</button></div>
                  </div>
                  <div className='presentation'>
                    <div className='presentation_image'><img src={Presentation_1} alt='' /></div>
                    <div className='presentation_topic'><span>Presentation 09</span></div>
                    <div className='presentation_icons'><MdOutlineDelete title='Delete'/> <MdOutlineDownload title='Download'/> <MdOutlineDriveFileRenameOutline title='Rename'/></div>
                    <div className='presentation_view'><button>View</button></div>
                  </div>
                  <div className='presentation'>
                    <div className='presentation_image'><img src={Presentation_1} alt='' /></div>
                    <div className='presentation_topic'><span>Presentation 10</span></div>
                    <div className='presentation_icons'><MdOutlineDelete title='Delete'/> <MdOutlineDownload title='Download'/> <MdOutlineDriveFileRenameOutline title='Rename'/></div>
                    <div className='presentation_view'><button>View</button></div>
                  </div>
                  </div>
              </div>
        </div>
      </div>
    )
  }
}

export default User