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
      // **MODIFIED: Start with an empty array for presentations**
      presentations: [],
      notifications: [],
      notificationCount: 0
    };
  }

  async componentDidMount() {
    const isAuthenticated = await this.checkAuthentication();
    if (!isAuthenticated) {
      return;
    }

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
        userEmail = sessionStorage.getItem('userEmail');
        username = sessionStorage.getItem('username');
        userPicture = sessionStorage.getItem('userPicture');
      }
    } else {
      userEmail = sessionStorage.getItem('userEmail');
      username = sessionStorage.getItem('username');
      userPicture = sessionStorage.getItem('userPicture');
    }

    this.setState({
      userEmail: userEmail || '',
      username: username || 'User',
      userProfilePicture: userPicture
    }, () => {
      if (userEmail) {
        this.fetchNotifications();
        this.fetchNotificationCount();
        // **MODIFIED: This will now fetch and display your presentations**
        this.fetchUserPresentations();
      }
    });

    if (!userPicture && userEmail) {
      this.assignRandomProfilePicture();
    }
  }

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
        this.clearAuthData();
        window.location.href = '/login';
        return false;
      }
      const response = await fetch('http://localhost:9090/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: parsedAuthData.email, password: parsedAuthData.password })
      });
      const result = await response.json();
      if (!result.success) {
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

  clearAuthData = () => {
    localStorage.removeItem('authData');
    localStorage.removeItem('userData');
    sessionStorage.clear();
  }

  handleLogout = () => {
    this.clearAuthData();
    window.location.href = '/login';
  }

  generateNewPresentation = () => {
    const { userEmail } = this.state;
    if (!userEmail) {
      alert('Error: User email not found. Please login again.');
      return;
    }
    // **MODIFIED: This correctly opens the Flask app to create a new presentation**
    const flaskUrl = `http://localhost:5001/?userEmail=${encodeURIComponent(userEmail)}`;
    window.open(flaskUrl, '_blank');
  };

  // **MODIFIED: Fetches presentations from the correct Flask API endpoint**
  fetchUserPresentations = async () => {
    const { userEmail } = this.state;
    if (!userEmail) return;

    try {
      const response = await fetch(`http://localhost:5001/presentations/${encodeURIComponent(userEmail)}`);
      const data = await response.json();

      if (data.success && Array.isArray(data.presentations)) {
        const formattedPresentations = data.presentations.map(p => ({
          id: p._id,
          title: p.presentationName,
          image: Presentation_1, // Using a default placeholder image
          createdAt: p.createdAt,
          type: 'html', // Mark as a Flask-generated presentation
        }));
        this.setState({ presentations: formattedPresentations });
      } else {
        console.error("Failed to fetch presentations:", data.message);
        this.setState({ presentations: [] }); // Clear presentations on failure
      }
    } catch (error) {
      console.error('Error fetching Flask presentations:', error);
    }
  };

  // **MODIFIED: Opens the correct preview URL**
  previewPresentation = (presentationId) => {
    const previewUrl = `http://localhost:5001/presentations/view/${presentationId}`;
    window.open(previewUrl, '_blank');
  };

  // **MODIFIED: Calls the correct delete endpoint**
  deletePresentation = async (presentationId) => {
    if (!window.confirm('Are you sure you want to delete this presentation?')) {
      return;
    }
    try {
      const response = await fetch(`http://localhost:5001/presentations/delete/${presentationId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        this.setState(prevState => ({
          presentations: prevState.presentations.filter(p => p.id !== presentationId)
        }));
        alert('Presentation deleted successfully!');
      } else {
        alert('Error deleting presentation: ' + data.message);
      }
    } catch (error) {
      console.error('Error deleting presentation:', error);
      alert('Error deleting presentation');
    }
  };

  // This function can be removed if you are not storing presentations from React side
  storePresentation = async (presentationData) => {
    // ... existing code
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
    // ... existing code
  };

  updateProfilePicture = async (pictureUrl, unsplashImageId) => {
    // ... existing code
  };

  handleOpen = (event) => this.setState({ anchorEl: event.currentTarget });
  handleClose = () => this.setState({ anchorEl: null });
  handleProfilePictureClick = () => this.setState({ showProfilePictureModal: true });
  handleProfilePictureModalClose = () => this.setState({ showProfilePictureModal: false });
  handleProfilePictureUpdate = (newPictureUrl, unsplashImageId) => {
    // ... existing code
  };
  handleModalOpen = (event) => {
    this.setState({ anchorE2: event.currentTarget });
    this.resetNotificationCount();
  };
  handleModalClose = () => this.setState({ anchorE2: null });
  handleTabChange = (event, newValue) => this.setState({ tabValue: newValue });
  fetchNotifications = async () => {
    // ... existing code
  };
  fetchNotificationCount = async () => {
    // ... existing code
  };
  resetNotificationCount = async () => {
    // ... existing code
  };
  markMessageAsRead = async (messageId) => {
    // ... existing code
  };

  render() {
    const { userProfilePicture, showProfilePictureModal, username, notifications, notificationCount, anchorEl, anchorE2, tabValue, presentations, favorites } = this.state;

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
              {/* **MODIFIED: Calls the correct function to create a new presentation** */}
              <button onClick={this.generateNewPresentation}>
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

              {/* All Presentations Tab */}
              <CustomTabPanel value={tabValue} index={0}>
                <div className="presentations-grid">
                  {presentations.map(p => (
                    <div className='presentation' key={p.id}>
                      <div className='presentation_image'>
                        <img src={p.image} alt={p.title} />
                        <FaStar
                          title='Favorite'
                          className={`favorite_icon ${favorites.includes(p.id) ? 'active' : ''}`}
                          onClick={() => this.toggleFavorite(p.id)}
                        />
                      </div>
                      <div className='presentation_topic'>
                        <span>{p.title}</span>
                      </div>
                      <div className='presentation_icons'>
                        <MdOutlineDelete
                          title='Delete'
                          className="presentation-action-icon"
                          onClick={() => this.deletePresentation(p.id)}
                        />
                        <MdOutlineDownload title='Download' className="presentation-action-icon" />
                        <MdOutlineDriveFileRenameOutline title='Rename' className="presentation-action-icon" />
                      </div>
                      <div className='presentation_view'>
                        {/* **MODIFIED: Button now correctly opens the preview** */}
                        <button onClick={() => this.previewPresentation(p.id)}>
                          👁️ View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </CustomTabPanel>

              {/* Favorites Tab */}
              <CustomTabPanel value={tabValue} index={1}>
                <div className='presentations-grid'>
                  {presentations
                    .filter(p => favorites.includes(p.id))
                    .map(p => (
                      <div className='presentation' key={p.id}>
                        <div className='presentation_image'>
                          <img src={p.image} alt={p.title} />
                          <FaStar
                            title='Unfavorite'
                            className='favorite_icon active'
                            onClick={() => this.toggleFavorite(p.id)}
                          />
                        </div>
                        <div className='presentation_topic'>
                          <span>{p.title}</span>
                        </div>
                        <div className='presentation_icons'>
                          <MdOutlineDelete
                            title='Delete'
                            className="presentation-action-icon"
                            onClick={() => this.deletePresentation(p.id)}
                          />
                          <MdOutlineDownload title='Download' className="presentation-action-icon" />
                          <MdOutlineDriveFileRenameOutline title='Rename' className="presentation-action-icon" />
                        </div>
                        <div className='presentation_view'>
                          <button onClick={() => this.previewPresentation(p.id)}>
                            👁️ View
                          </button>
                        </div>
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
