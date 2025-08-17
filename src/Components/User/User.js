import React, { Component } from 'react';
import './User.css';
import Grid from '@mui/material/Grid';
import Logo1 from './Logo1.png';
import { FaUserCircle, FaPlus, FaAngleDown, FaCamera } from 'react-icons/fa';
import Presentation_1 from './Presentation_1.png';
import { MdOutlineDelete, MdOutlineDriveFileRenameOutline, MdOutlineDownload } from "react-icons/md";
import { Link } from 'react-router-dom';
import Popover from './Popover/Popover';
import { IoMdNotificationsOutline } from "react-icons/io";
import ProfilePictureModal from './ProfilePictureModal/ProfilePictureModal';

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      userProfilePicture: null,
      showProfilePictureModal: false,
      userEmail: '',
      username: ''
    };
  }

  componentDidMount() {
    // Get user data from session storage
    const userEmail = sessionStorage.getItem('userEmail');
    const username = sessionStorage.getItem('username');
    const userPicture = sessionStorage.getItem('userPicture');

    this.setState({
      userEmail: userEmail || '',
      username: username || 'User',
      userProfilePicture: userPicture
    });

    // If no profile picture exists, get a random one
    if (!userPicture && userEmail) {
      this.assignRandomProfilePicture();
    }
  }

  assignRandomProfilePicture = async () => {
    try {
      const response = await fetch('http://localhost:9090/randomProfilePicture');
      const data = await response.json();

      if (data.success && data.data) {
        const pictureUrl = data.data.url;

        // Update user's profile picture in database
        await this.updateProfilePicture(pictureUrl, null); // No need for Unsplash ID

        // Update local state and session storage
        this.setState({ userProfilePicture: pictureUrl });
      }
    } catch (error) {
      console.error('Error fetching random profile picture:', error);
    }
  };


  updateProfilePicture = async (pictureUrl, unsplashImageId) => {
    try {
      const response = await fetch('http://localhost:9090/updateProfilePicture', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: this.state.userEmail,
          pictureUrl: pictureUrl,
          unsplashImageId: unsplashImageId
        })
      });

      const data = await response.json();

      if (data.success) {
        console.log('Profile picture updated successfully');
      } else {
        console.error('Failed to update profile picture:', data.message);
      }
    } catch (error) {
      console.error('Error updating profile picture:', error);
    }
  };

  handleOpen = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleProfilePictureClick = () => {
    this.setState({ showProfilePictureModal: true });
  };

  handleProfilePictureModalClose = () => {
    this.setState({ showProfilePictureModal: false });
  };

  handleProfilePictureUpdate = (newPictureUrl, unsplashImageId) => {
    this.updateProfilePicture(newPictureUrl, unsplashImageId);
    this.setState({ userProfilePicture: newPictureUrl });
    sessionStorage.setItem('userPicture', newPictureUrl);
    this.handleProfilePictureModalClose();
  };

  render() {
    const { anchorEl, userProfilePicture, showProfilePictureModal, username } = this.state;

    return (
      <div className='user_back'>
        <div className='header'>
          <Grid container>
            <Grid item xs={6} className='header_one'>
              <img src={Logo1} className='logo1' alt='' />
            </Grid>
            <Grid item xs={6} className='header_two'>
              <div>
                <button className='notification_icon_button'>
                  <IoMdNotificationsOutline className='notification_icon' />
                </button>
              </div>
              <div className='workspace'>
                <button onClick={this.handleOpen}>
                  <span className='profile-picture-container'>
                    {userProfilePicture ? (
                      <div className='profile-picture-wrapper'>
                        <img
                          src={userProfilePicture}
                          alt='Profile'
                          className='profile_picture'
                          onClick={this.handleProfilePictureClick}
                        />
                        <div className='profile-picture-overlay' onClick={this.handleProfilePictureClick}>
                          <FaCamera className='camera-icon' />
                        </div>
                      </div>
                    ) : (
                      <FaUserCircle
                        className='default_icon_1'
                        onClick={this.handleProfilePictureClick}
                      />
                    )}
                  </span>
                  <span> {username}'s Workspace</span>
                  <span><FaAngleDown /></span>
                </button>
                <Popover anchorEl={anchorEl} onClose={this.handleClose} />
              </div>
            </Grid>
          </Grid>
          <hr />
        </div>

        {/* Profile Picture Modal */}
        {showProfilePictureModal && (
          <ProfilePictureModal
            isOpen={showProfilePictureModal}
            onClose={this.handleProfilePictureModalClose}
            onUpdatePicture={this.handleProfilePictureUpdate}
            currentPicture={userProfilePicture}
          />
        )}

        <div>
          <div className='presentations'>
            <div className='presentations_create'>
              <button><FaPlus className='plusicon' /> Create New</button>
            </div>
            <div className='presentations_container'>
              {/* Your existing presentation components */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default User;
