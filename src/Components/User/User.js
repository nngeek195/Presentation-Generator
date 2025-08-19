import React, { Component } from 'react';
import './User.css';
import Grid from '@mui/material/Grid';
import Logo1 from './Logo1.png';
import { FaUserCircle, FaPlus, FaAngleDown, FaCamera, FaStar, FaRegStar } from 'react-icons/fa';
import Presentation_1 from './Presentation_1.png';
import { MdOutlineDelete, MdOutlineEdit, MdOutlineRemoveRedEye } from "react-icons/md";
import ProfilePictureModal from './ProfilePictureModal/ProfilePictureModal';
import Popover from './Popover/Popover'
import Popover2 from './Popover/Popover2'
import { IoMdNotificationsOutline, IoMdApps, IoIosTrendingUp, IoMdMenu } from "react-icons/io";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CustomTabPanel from './CustomTabPanel';

// **ADDED: Styles for the new presentation card actions to match the dashboard look.**
const ActionButtonStyles = () => (
  <style>{`
    .presentation-actions {
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 8px 4px;
      background-color: #1e293b; /* slate-800 */
    }
    .action-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 8px 12px;
      border: none;
      border-radius: 6px;
      color: white;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s ease-in-out;
      text-decoration: none; /* For <a> tags styled as buttons */
    }
    .action-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
    .action-button.view {
      background-color: #2563eb; /* blue-600 */
    }
    .action-button.view:hover {
      background-color: #1d4ed8; /* blue-700 */
    }
    .action-button.edit {
      background-color: #7c3aed; /* purple-600 */
    }
    .action-button.edit:hover {
      background-color: #6d28d9; /* purple-700 */
    }
    .action-button.delete {
      background-color: #dc2626; /* red-600 */
    }
    .action-button.delete:hover {
      background-color: #b91c1c; /* red-700 */
    }
    
    /* 🔥 TRENDING STYLES */
    .trending-presentation {
      position: relative;
      border: 2px solid #f59e0b;
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(251, 191, 36, 0.05));
    }
    
    .trending-badge {
      position: absolute;
      top: 10px;
      left: 10px;
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: white;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 10px;
      font-weight: bold;
      z-index: 15;
      box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
    }
    
    .presentation_stats {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 16px;
      background-color: #0f172a;
      border-top: 1px solid #334155;
    }
    
    .stat-item {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: #94a3b8;
      font-weight: 500;
    }
    
    .trending-author {
      font-size: 11px;
      color: #64748b;
      margin-top: 2px;
    }
    
    .no-trending {
      text-align: center;
      padding: 60px 20px;
      color: #64748b;
    }
    
    .no-trending h3 {
      font-size: 24px;
      margin-bottom: 12px;
      color: #f59e0b;
    }
    
    .no-trending p {
      font-size: 16px;
      line-height: 1.5;
    }
    
    .trending-view-only {
      background-color: #059669 !important;
    }
    
    .trending-view-only:hover {
      background-color: #047857 !important;
    }
  `}</style>
);

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      menuAnchor: null,
      userProfilePicture: null,
      showProfilePictureModal: false,
      userEmail: '',
      username: '',
      anchorE2: null,
      tabValue: 0,
      favorites: [],
      presentations: [],
      trendingPresentations: [], // 🔥 ADD: Trending presentations state
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
        this.fetchUserPresentations();
        this.fetchTrendingPresentations(); // 🔥 ADD: Fetch trending presentations
      }
    });

    if (!userPicture && userEmail) {
      this.assignRandomProfilePicture();
    }
  }
  // Update the fetchTrendingPresentations method in User.js


  // 🔥 NEW: Method to render trending presentation card (view-only)
  renderTrendingPresentation = (p, showStats = true) => (
    <div className='presentation trending-presentation' key={p.id}>
      <div className='presentation_image'>
        <img src={p.image} alt={p.title} />
        <div className="trending-badge">🔥 Trending</div>
      </div>
      <div className='presentation_topic'>
        <span>{p.title}</span>
        <div className="trending-author">By {p.username} • {p.category}</div>
      </div>
      {showStats && (
        <div className='presentation_stats'>
          <span className="stat-item">👁️ {p.views}</span>
          <span className="stat-item">❤️ {p.likes}</span>
        </div>
      )}
      <div className='presentation-actions'>
        <button
          className="action-button view trending-view-only"
          onClick={() => this.viewTrendingPresentation(p.id)}
        >
          <MdOutlineRemoveRedEye /> View Presentation
        </button>
      </div>
    </div>
  );

  // 🔥 UPDATE: fetchTrendingPresentations method in User.js
  fetchTrendingPresentations = async () => {
    try {
      const response = await fetch('http://localhost:5001/trending');
      const data = await response.json();
      if (data.success) {
        const trendingPresentations = data.data.presentations.map(p => ({
          id: p._id,
          title: p.presentationName,
          image: p.previewImageUrl || Presentation_1, // 🔥 USE: previewImageUrl
          createdAt: p.createdAt,
          type: 'trending',
          code: p.code,
          views: p.views || 0,
          likes: p.likes || 0,
          category: p.category || 'General',
          username: p.username,
          email: p.email
        }));
        this.setState({ trendingPresentations });
      }
    } catch (error) {
      console.error('Error fetching trending presentations:', error);
    }
  };


  viewTrendingPresentation = (presentationId) => {
    // Use Python Flask endpoint
    const previewUrl = `http://localhost:5001/trending/view/${presentationId}`;
    window.open(previewUrl, '_blank');
  };

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
      const { email, username, profile } = result.data;
      const userData = { email, username, picture: profile.picture };
      localStorage.setItem('userData', JSON.stringify(userData));
      this.setState({ userEmail: email, username, userProfilePicture: profile.picture });

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
    const flaskUrl = `http://localhost:5001/?userEmail=${encodeURIComponent(userEmail)}`;
    window.open(flaskUrl, '_blank');
  };

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
          image: p.previewImageUrl || Presentation_1,
          createdAt: p.createdAt,
          type: 'python'
        }));
        this.setState({ presentations: formattedPresentations });
      } else {
        console.error("Failed to fetch presentations:", data.message);
        this.setState({ presentations: [] });
      }
    } catch (error) {
      console.error('Error fetching Flask presentations:', error);
    }
  };

  previewPresentation = (presentationId) => {
    const previewUrl = `http://localhost:5001/presentations/view/${presentationId}`;
    window.open(previewUrl, '_blank');
  };

  editPresentation = (presentationId) => {
    const editUrl = `http://localhost:5001/present/${presentationId}`;
    window.open(editUrl, '_blank');
  };

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
      alert('An error occurred while deleting the presentation.');
    }
  };

  toggleFavorite = (id) => {
    this.setState(prevState => ({
      favorites: prevState.favorites.includes(id)
        ? prevState.favorites.filter(favId => favId !== id)
        : [...prevState.favorites, id]
    }));
  }

  // **ADDED: Function to assign a random profile picture on first signup**
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

  // **ADDED: Function to call the Ballerina backend to update the picture**
  updateProfilePicture = async (pictureUrl, unsplashImageId) => {
    try {
      const response = await fetch('http://localhost:9090/updateProfilePicture', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: this.state.userEmail,
          pictureUrl: pictureUrl,
          unsplashImageId: unsplashImageId
        })
      });
      const data = await response.json();
      if (data.success) {
        console.log('Profile picture updated successfully');
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

  // **ADDED: Handler function to be passed as a prop to the modal**
  handleProfilePictureUpdate = (newPictureUrl, unsplashImageId) => {
    this.updateProfilePicture(newPictureUrl, unsplashImageId);
    this.setState({ userProfilePicture: newPictureUrl });
    sessionStorage.setItem('userPicture', newPictureUrl);
    this.handleProfilePictureModalClose();
  };

  handleOpen = (event) => this.setState({ anchorEl: event.currentTarget });
  handleClose = () => this.setState({ anchorEl: null });
  handleProfilePictureClick = () => this.setState({ showProfilePictureModal: true });
  handleProfilePictureModalClose = () => this.setState({ showProfilePictureModal: false });
  handleModalOpen = (event) => {
    this.setState({ anchorE2: event.currentTarget });
    this.resetNotificationCount();
  };
  handleModalClose = () => this.setState({ anchorE2: null });
  handleTabChange = (event, newValue) => this.setState({ tabValue: newValue });

  fetchNotifications = async () => {
    const { userEmail } = this.state;
    if (!userEmail) return;
    try {
      const response = await fetch(`http://localhost:9090/notifications/${encodeURIComponent(userEmail)}`);
      const data = await response.json();
      if (data.success && data.data) {
        this.setState({
          notifications: data.data.notifications || [],
          notificationCount: data.data.count || 0
        });
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  fetchNotificationCount = async () => {
    const { userEmail } = this.state;
    if (!userEmail) return;
    try {
      const response = await fetch(`http://localhost:9090/notifications/count/${encodeURIComponent(userEmail)}`);
      const data = await response.json();
      if (data.success && data.data) {
        this.setState({ notificationCount: data.data.emailCount || 0 });
      }
    } catch (error) {
      console.error('Error fetching notification count:', error);
    }
  };

  resetNotificationCount = async () => {
    try {
      const response = await fetch('http://localhost:9090/notifications/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail: this.state.userEmail })
      });
      const data = await response.json();
      if (data.success) {
        this.setState({ notificationCount: 0 });
      }
    } catch (error) {
      console.error('Error resetting notification count:', error);
    }
  };

  // 🔥 ADD: Missing markMessageAsRead method
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
    const {
      userProfilePicture,
      showProfilePictureModal,
      username,
      notifications,
      notificationCount,
      anchorEl,
      anchorE2,
      tabValue,
      presentations,
      favorites,
      trendingPresentations // 🔥 ADD: Include trending presentations in render
    } = this.state;

    function a11yProps(index) {
      return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
      };
    }

    return (
      <div className='user_back'>
        <ActionButtonStyles />
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
                  <span className='username_text'> {username}'s Workspace</span>
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

              <CustomTabPanel value={tabValue} index={0}>
                <div className="presentations-container">
                  {/* 🔥 NEW: User's Own Presentations Section */}
                  {presentations.length > 0 && (
                    <div className="presentations-section">
                      <h3 className="section-title my-presentations">
                        📁 My Presentations
                      </h3>
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
                            <div className='presentation-actions'>
                              <button className="action-button view" onClick={() => this.previewPresentation(p.id)}>
                                <MdOutlineRemoveRedEye /> View
                              </button>
                              <button className="action-button edit" onClick={() => this.editPresentation(p.id)}>
                                <MdOutlineEdit /> Edit
                              </button>
                              <button className="action-button delete" onClick={() => this.deletePresentation(p.id)}>
                                <MdOutlineDelete /> Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 🔥 NEW: Trending Presentations Section */}
                  <div className="presentations-section">
                    <h3 className="section-title trending-section">
                      🔥 Trending Presentations
                    </h3>
                    {trendingPresentations.length > 0 ? (
                      <div className="presentations-grid">
                        {trendingPresentations.map(p => this.renderTrendingPresentation(p))}
                      </div>
                    ) : (
                      <div className="empty-state">
                        <h4>No trending presentations yet</h4>
                        <p>Check back later for popular content from the community!</p>
                      </div>
                    )}
                  </div>
                </div>
              </CustomTabPanel>
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
                        <div className='presentation-actions'>
                          <button className="action-button view" onClick={() => this.previewPresentation(p.id)}>
                            <MdOutlineRemoveRedEye /> View
                          </button>
                          <button className="action-button edit" onClick={() => this.editPresentation(p.id)}>
                            <MdOutlineEdit /> Edit
                          </button>
                          <button className="action-button delete" onClick={() => this.deletePresentation(p.id)}>
                            <MdOutlineDelete /> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </CustomTabPanel>

              {/* 🔥 UPDATED: Trending Tab Implementation */}
              <CustomTabPanel value={tabValue} index={2}>
                <div className="presentations-grid">
                  {trendingPresentations.length > 0 ? (
                    trendingPresentations.map(p => (
                      <div className='presentation trending-presentation' key={p.id}>
                        <div className='presentation_image'>
                          <img src={p.image} alt={p.title} />
                          {/* 🔥 ADD: Trending badge */}
                          <div className="trending-badge">
                            🔥 Trending
                          </div>
                        </div>
                        <div className='presentation_topic'>
                          <span>{p.title}</span>
                          <div className="trending-author">
                            By {p.username} • {p.category}
                          </div>
                        </div>
                        {/* 🔥 ADD: Trending stats */}
                        <div className='presentation_stats'>
                          <span className="stat-item">
                            👁️ {p.views}
                          </span>
                          <span className="stat-item">
                            ❤️ {p.likes}
                          </span>
                        </div>
                        {/* 🔥 ADD: View-only action for trending */}
                        <div className='presentation-actions'>
                          <button
                            className="action-button view trending-view-only"
                            onClick={() => this.viewTrendingPresentation(p.id)}
                          >
                            <MdOutlineRemoveRedEye /> View Presentation
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-trending">
                      <h3>🔥 No Trending Presentations Yet</h3>
                      <p>Check back later for popular presentations from the community!</p>
                      <p>Be the first to create amazing content that trends!</p>
                    </div>
                  )}
                </div>
              </CustomTabPanel>
            </Box>
          </div>
        </div>
      </div>
    );
  }
}

export default User;
