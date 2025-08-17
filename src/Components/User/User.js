import React, { Component } from 'react';
import './User.css';
import Grid from '@mui/material/Grid';
import Logo1 from './Logo1.png';
import { FaUserCircle, FaPlus, FaAngleDown, FaCamera, FaStar, FaRegStar } from 'react-icons/fa';
import Presentation_1 from './Presentation_1.png';
import { MdOutlineDelete, MdOutlineDriveFileRenameOutline, MdOutlineDownload } from "react-icons/md";
import ProfilePictureModal from './ProfilePictureModal/ProfilePictureModal';
import Popover from './Popover/Popover'
import Popover2 from './Popover/Popover2'
import { IoMdNotificationsOutline, IoMdApps, IoIosTrendingUp } from "react-icons/io";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CustomTabPanel from './CustomTabPanel'

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      userProfilePicture: null,
      showProfilePictureModal: false,
      userEmail: '',
      username: '',
      anchorE2: null,
      tabValue: 0,
      favorites: [], 
      presentations: [ 
        { id: 1, title: "Presentation 01", image: Presentation_1 },
        { id: 2, title: "Presentation 02", image: Presentation_1 },
        { id: 3, title: "Presentation 03", image: Presentation_1 },
        { id: 4, title: "Presentation 04", image: Presentation_1 },
        { id: 5, title: "Presentation 05", image: Presentation_1 },
        { id: 6, title: "Presentation 06", image: Presentation_1 },
        { id: 7, title: "Presentation 07", image: Presentation_1 },
        { id: 8, title: "Presentation 08", image: Presentation_1 },
        { id: 9, title: "Presentation 09", image: Presentation_1 },
        { id: 10, title: "Presentation 10", image: Presentation_1 },
        { id: 11, title: "Presentation 11", image: Presentation_1 },
        { id: 12, title: "Presentation 12", image: Presentation_1 },
      ]
    };
  }

  toggleFavorite = (id) => {
    const { favorites } = this.state;
    if (favorites.includes(id)) {
      // Remove from favorites
      this.setState({ favorites: favorites.filter(favId => favId !== id) });
    } else {
      // Add to favorites
      this.setState({ favorites: [...favorites, id] });
    }
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

  handleModalOpen = (event) => {
    this.setState({ anchorE2: event.currentTarget }); 
  };

  handleModalClose = () => {
    this.setState({ anchorE2: null });
  };

  handleTabChange = (event, newValue) => {
    this.setState({ tabValue: newValue });
  };

  render() {
    const { userProfilePicture, showProfilePictureModal, username } = this.state;
    const { anchorEl } = this.state;
    const { anchorE2 } = this.state;
    const { presentations, favorites } = this.state;

    function a11yProps(index) {
      return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
      };
    }


    return (
      <div className='user_back'>
        <div className='header'>
          <Grid container>
            <Grid item xs={6} className='header_one'>
              <img src={Logo1} className='logo1' alt='' />
            </Grid>
            <Grid item xs={6} className='header_two'>
              <div>
                <button className='notification_icon_button' onClick={this.handleModalOpen}>
                  <IoMdNotificationsOutline className='notification_icon' />
                </button>
                <Popover2 anchorE2={anchorE2} onClose={this.handleModalClose} />
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
          </div>
            <div className='presentations'>
              <div className='presentations_create'>
                <button><FaPlus className='plusicon' /> Create New</button>
              </div>
              <Box sx={{ width: '100%' }}>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                      value={this.state.tabValue}
                      onChange={this.handleTabChange}
                      aria-label="basic tabs example"
                    >
                      <Tab icon={<IoMdApps className='tab_icon' />} iconPosition='start' label="All" {...a11yProps(0)} />
                      <Tab icon={<FaRegStar className='tab_icon' />} iconPosition='start' label="Favorites" {...a11yProps(1)} />
                      <Tab icon={<IoIosTrendingUp className='tab_icon' />} iconPosition='start' label="Trending" {...a11yProps(2)} />
                    </Tabs>
                  </Box>

                  {/* Tab Panels */}
                  <CustomTabPanel value={this.state.tabValue} index={0}>
                    <div className="presentations-grid">
                      {presentations.map(p => (
                          <div className='presentation' key={p.id}>
                            <div className='presentation_image'>
                              <img src={p.image} alt='' />
                              <FaStar
                                title='Favorite'
                                className={`favorite_icon ${favorites.includes(p.id) ? 'active' : ''}`}
                                onClick={() => this.toggleFavorite(p.id)}
                              />
                            </div>
                            <div className='presentation_topic'><span>{p.title}</span></div>
                            <div className='presentation_icons'>
                              <MdOutlineDelete title='Delete' />
                              <MdOutlineDownload title='Download' />
                              <MdOutlineDriveFileRenameOutline title='Rename' />
                            </div>
                            <div className='presentation_view'><button>View</button></div>
                          </div>
                        ))}
                      </div>
                  </CustomTabPanel>

                  <CustomTabPanel value={this.state.tabValue} index={1}>
                    <div className='presentations_container'>
                      {presentations
                        .filter(p => favorites.includes(p.id))
                        .map(p => (
                          <div className='presentation' key={p.id}>
                            <div className='presentation_image'>
                              <img src={p.image} alt='' />
                              <FaStar
                                title='Favorite'
                                className='favorite_icon'
                                style={{ fill: '#ffd700', cursor: 'pointer' }}
                                onClick={() => this.toggleFavorite(p.id)}
                              />
                            </div>
                            <div className='presentation_topic'><span>{p.title}</span></div>
                            <div className='presentation_icons'>
                              <MdOutlineDelete title='Delete' />
                              <MdOutlineDownload title='Download' />
                              <MdOutlineDriveFileRenameOutline title='Rename' />
                            </div>
                            <div className='presentation_view'><button>View</button></div>
                          </div>
                      ))}
                    </div>
                  </CustomTabPanel>

                  <CustomTabPanel value={this.state.tabValue} index={2}>
                    <h3>Trending (to implement next)</h3>
                  </CustomTabPanel>
              </Box>


              </div>
        </div>
    );
  }
}

export default User;
