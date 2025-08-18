import React, { Component } from 'react';
import './User.css';
import Grid from '@mui/material/Grid';
import Logo1 from './Logo1.png';
import { FaUserCircle, FaPlus, FaAngleDown, FaCamera, FaStar, FaRegStar } from 'react-icons/fa';
import Presentation_1 from './Presentation_1.png';
import { MdOutlineDelete, MdOutlineDriveFileRenameOutline, MdOutlineDownload } from "react-icons/md";
import ProfilePictureModal from './ProfilePictureModal/ProfilePictureModal';
import Popover from './Popover/Popover';
import Popover2 from './Popover/Popover2';
import { IoMdNotificationsOutline, IoMdApps, IoIosTrendingUp } from "react-icons/io";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CustomTabPanel from './CustomTabPanel';

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
      ],
      notifications: [],
      notificationCount: 0
    };
  }

  // 🔧 FIXED: Single componentDidMount method with authentication check
  async componentDidMount() {
    // Check authentication first
    const isAuthenticated = await this.checkAuthentication();

    if (!isAuthenticated) {
      return; // Will redirect to login
    }

    // Get user data from localStorage (preferred) or sessionStorage (fallback)
    const userData = localStorage.getItem('userData');
    let userEmail, username, userPicture;

    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        userEmail = parsedData.email;
        username = parsedData.username;
        userPicture = parsedData.picture;
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Fallback to sessionStorage
        userEmail = sessionStorage.getItem('userEmail');
        username = sessionStorage.getItem('username');
        userPicture = sessionStorage.getItem('userPicture');
      }
    } else {
      // Fallback to sessionStorage
      userEmail = sessionStorage.getItem('userEmail');
      username = sessionStorage.getItem('username');
      userPicture = sessionStorage.getItem('userPicture');
    }

    this.setState({
      userEmail: userEmail || '',
      username: username || 'User',
      userProfilePicture: userPicture
    }, () => {
      // Fetch notifications after state is updated
      if (userEmail) {
        this.fetchNotifications();
        this.fetchNotificationCount();
      }
    });

    // If no profile picture exists, get a random one
    if (!userPicture && userEmail) {
      this.assignRandomProfilePicture();
    }
  }

  // 🔑 Simple authentication check
  checkAuthentication = async () => {
    const authData = localStorage.getItem('authData');

    if (!authData) {
      console.log('No auth data found, redirecting to login');
      window.location.href = '/login';
      return false;
    }

    try {
      const parsedAuthData = JSON.parse(authData);

      if (!parsedAuthData.isAuthenticated || !parsedAuthData.email || !parsedAuthData.password) {
        console.log('Invalid auth data, redirecting to login');
        this.clearAuthData();
        window.location.href = '/login';
        return false;
      }

      // Validate stored credentials with backend
      const response = await fetch('http://localhost:9090/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: parsedAuthData.email,
          password: parsedAuthData.password
        })
      });

      const result = await response.json();

      if (!result.success) {
        console.log('Stored credentials invalid, redirecting to login');
        this.clearAuthData();
        window.location.href = '/login';
        return false;
      }

      return true;
    } catch (error) {
      console.error('Auth validation error:', error);
      this.clearAuthData();
      window.location.href = '/login';
      return false;
    }
  }

  // 🔑 Clear authentication data
  clearAuthData = () => {
    localStorage.removeItem('authData');
    localStorage.removeItem('userData');
    sessionStorage.clear();
  }

  // 🔑 Logout method
  handleLogout = () => {
    this.clearAuthData();
    window.location.href = '/login';
  }

  storePresentation = async (presentationData) => {
    try {
      const response = await fetch('http://localhost:9090/storePresentation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: this.state.userEmail,
          presentation: presentationData
        })
      });

      const data = await response.json();
      if (data.success) {
        console.log('Presentation stored successfully:', data);
        // Optionally, update the state to reflect the new presentation
        this.setState(prevState => ({
          presentations: [...prevState.presentations, {
            id: data.id,
            title: presentationData.topic,
            image: presentationData.slides[0].elements[0].src
          }]
        }));
      } else {
        console.error('Failed to store presentation:', data.message);
      }
    } catch (error) {
      console.error('Error storing presentation:', error);
    }
  };

  toggleFavorite = (id) => {
    const { favorites } = this.state;
    if (favorites.includes(id)) {
      this.setState({ favorites: favorites.filter(favId => favId !== id) });
    } else {
      this.setState({ favorites: [...favorites, id] });
    }
  }

  assignRandomProfilePicture = async () => {
    try {
      const response = await fetch('http://localhost:9090/randomProfilePicture');
      const data = await response.json();

      if (data.success && data.data) {
        const pictureUrl = data.data.url;
        await this.updateProfilePicture(pictureUrl, null);
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

        // 🔧 UPDATE: Also update localStorage userData
        const userData = localStorage.getItem('userData');
        if (userData) {
          const parsedData = JSON.parse(userData);
          parsedData.picture = pictureUrl;
          localStorage.setItem('userData', JSON.stringify(parsedData));
        }
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
    // Reset notification count when user clicks the notification icon
    this.resetNotificationCount();
  };

  handleModalClose = () => {
    this.setState({ anchorE2: null });
  };

  handleTabChange = (event, newValue) => {
    this.setState({ tabValue: newValue });
  };

  fetchNotifications = async () => {
    try {
      const userEmail = this.state.userEmail;
      if (!userEmail) {
        console.log('No user email found');
        return;
      }

      console.log('Fetching notifications for:', userEmail);

      const response = await fetch(`http://localhost:9090/notifications/${encodeURIComponent(userEmail)}`);
      const data = await response.json();

      console.log('Notification response:', data);

      if (data.success) {
        this.setState({
          notifications: data.data.notifications || [],
          notificationCount: data.data.count || 0
        });

        console.log('Updated notifications:', data.data.notifications);
        console.log('Notification count:', data.data.count);
      } else {
        console.error('Failed to fetch notifications:', data.message);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  fetchNotificationCount = async () => {
    try {
      const userEmail = this.state.userEmail;
      if (!userEmail) {
        console.log('No user email found');
        return;
      }

      console.log('Fetching notification count for:', userEmail);

      const response = await fetch(`http://localhost:9090/notifications/count/${encodeURIComponent(userEmail)}`);
      const data = await response.json();

      console.log('Notification count response:', data);

      if (data.success) {
        this.setState({
          notificationCount: data.data.emailCount || 0
        });

        console.log('Email count:', data.data.emailCount);
      } else {
        console.error('Failed to fetch notification count:', data.message);
      }
    } catch (error) {
      console.error('Error fetching notification count:', error);
    }
  };

  resetNotificationCount = async () => {
    try {
      const userEmail = this.state.userEmail;
      const response = await fetch('http://localhost:9090/notifications/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: userEmail
        })
      });

      const data = await response.json();

      if (data.success) {
        this.setState({
          notificationCount: 0
        });
        console.log('Notification count reset successfully');
      }
    } catch (error) {
      console.error('Error resetting notification count:', error);
    }
  };

  // 🔧 UPDATED: Generate presentation with authentication data
  generateFinalPresentation = async () => {
    const topic = prompt("Enter the presentation topic:");
    if (!topic) return; // Exit if no topic is provided

    const subtopics = this.state.presentations.map(p => p.title);

    // 🔧 FIX: Get user email from authData instead of userToken
    const authData = localStorage.getItem('authData');
    let userEmail = '';

    if (authData) {
      try {
        const parsedAuthData = JSON.parse(authData);
        userEmail = parsedAuthData.email;
      } catch (error) {
        console.error('Error parsing auth data:', error);
        userEmail = this.state.userEmail; // Fallback
      }
    } else {
      userEmail = this.state.userEmail; // Fallback
    }

    // Construct the URL with user email instead of token
    const url = `http://127.0.0.1:5001/generate_final_presentation?userEmail=${encodeURIComponent(userEmail)}`;

    // Redirect the user to the Flask backend with the topic and subtopics
    window.location.href = url + `&topic=${encodeURIComponent(topic)}&subtopics=${encodeURIComponent(JSON.stringify(subtopics))}`;
  };

  markMessageAsRead = async (messageId) => {
    try {
      const userEmail = this.state.userEmail;
      const response = await fetch('http://localhost:9090/messages/markRead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: userEmail,
          messageId: messageId
        })
      });

      const data = await response.json();

      if (data.success) {
        // Remove the message from the state
        this.setState(prevState => ({
          notifications: prevState.notifications.filter(notif => notif.id !== messageId),
          notificationCount: prevState.notificationCount - 1
        }));
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  render() {
    const { userProfilePicture, showProfilePictureModal, username, notifications, notificationCount } = this.state;
    const { anchorEl, anchorE2, tabValue, presentations, favorites } = this.state;

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
                  {notificationCount > 0 && (
                    <span className='notification_badge'>{notificationCount}</span>
                  )}
                </button>
                <Popover2
                  anchorE2={anchorE2}
                  onClose={this.handleModalClose}
                  notifications={notifications}
                  onNotificationRead={this.markMessageAsRead}
                />
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
                {/* 🔧 UPDATED: Pass logout handler to Popover */}
                {/* 🔧 UPDATED: Pass username, profile picture, and logout handler to Popover */}
                <Popover
                  anchorEl={anchorEl}
                  onClose={this.handleClose}
                  onLogout={this.handleLogout}
                  username={username}
                  userProfilePicture={userProfilePicture}
                />

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
              <button onClick={this.generateFinalPresentation}>
                <FaPlus className='plusicon' /> Create New
              </button>
            </div>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                  value={tabValue}
                  onChange={this.handleTabChange}
                  aria-label="basic tabs example"
                >
                  <Tab icon={<IoMdApps className='tab_icon' />} iconPosition='start' label="All" {...a11yProps(0)} />
                  <Tab icon={<FaRegStar className='tab_icon' />} iconPosition='start' label="Favorites" {...a11yProps(1)} />
                  <Tab icon={<IoIosTrendingUp className='tab_icon' />} iconPosition='start' label="Trending" {...a11yProps(2)} />
                </Tabs>
              </Box>

              {/* Tab Panels */}
              <CustomTabPanel value={tabValue} index={0}>
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

              <CustomTabPanel value={tabValue} index={1}>
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

              <CustomTabPanel value={tabValue} index={2}>
                <h3>Trending (to implement next)</h3>
              </CustomTabPanel>
            </Box>
          </div>
        </div>
      </div>
    );
  }
}

export default User;
