import React, { Component } from 'react'
import './User.css'
import Grid from '@mui/material/Grid'
import Logo1 from './Logo1.png'
import { FaUserCircle, FaPlus, FaAngleDown } from 'react-icons/fa'
import Presentation_1 from './Presentation_1.png'
import { MdOutlineDelete, MdOutlineDriveFileRenameOutline, MdOutlineDownload } from "react-icons/md";
import { Link } from 'react-router-dom'
import Popover from './Popover/Popover'

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
    };
  }

  handleOpen = (event) => {
    this.setState({ anchorEl: event.currentTarget }); 
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { anchorEl } = this.state;

    return (
      <div className='user_back'>
        <div className='header'>
          <Grid container>
            <Grid item xs={6} className='header_one'>
              <img src={Logo1} className='logo1' alt='' />
            </Grid>
            <Grid item xs={6} className='header_two'>
              <div className='workspace'>
                <button onClick={this.handleOpen}>
                  <span><FaUserCircle className='default_icon_1' /></span>
                  <span> User's Workspace</span>
                  <span><FaAngleDown /></span>
                </button>
                <Popover anchorEl={anchorEl} onClose={this.handleClose} />
              </div>
            </Grid>
          </Grid>
          <hr />
        </div>
        <div>
            <div className='presentations'>
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
              </div>
        </div>
      </div>  
    )
  }
}

export default User