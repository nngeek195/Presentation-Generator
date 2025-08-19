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
import Popover from './Popover/Popover'
import Popover2 from './Popover/Popover2'
import { IoMdNotificationsOutline, IoMdApps, IoIosTrendingUp, IoMdMenu } from "react-icons/io";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CustomTabPanel from './CustomTabPanel'
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

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

  handleMenuOpen = (event) => {
    this.setState({ menuAnchor: event.currentTarget });
  };

  handleMenuClose = (tabIndex) => {
    if (typeof tabIndex === "number") {
      this.setState({ tabValue: tabIndex });
    }
    this.setState({ menuAnchor: null });
  };

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
    const { userProfilePicture, showProfilePictureModal, username } = this.state;
    const { anchorEl } = this.state;
    const { anchorE2 } = this.state;
    const { presentations, favorites, menuAnchor } = this.state;

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
          </div>
            <div className='presentations'>
              <div className='presentations_create'>
                <button><FaPlus className='plusicon' /> Create New</button>
              </div>

              <Box sx={{ width: '100%' }}>
                  <div className='tabs_container'>
                    <Box sx={{ borderColor: 'divider' }}>
                      <Tabs
                        value={this.state.tabValue}
                        onChange={this.handleTabChange}
                        aria-label="basic tabs example"
                      >
                        <Tab icon={<IoMdApps className='tab_icon' />} iconPosition='start' label="All" sx={{ fontWeight: 'bold' }}  {...a11yProps(0)} />
                        <Tab icon={<FaRegStar className='tab_icon' />} iconPosition='start' label="Favorites" sx={{ fontWeight: 'bold' }}  {...a11yProps(1)} />
                        <Tab icon={<IoIosTrendingUp className='tab_icon' />} iconPosition='start' label="Trending" sx={{ fontWeight: 'bold' }}  {...a11yProps(2)} />
                      </Tabs>
                    </Box>
                  </div>
                
                  <div className='menu_container'>
                    <Box sx={{ display: { xs: "block", sm: "none" }, textAlign: "right" }}>
                      <button onClick={this.handleMenuOpen}>
                        <IoMdMenu />
                      </button>
                      <Menu
                        anchorEl={menuAnchor}
                        open={Boolean(menuAnchor)}
                        onClose={() => this.handleMenuClose()}
                      >
                        <MenuItem onClick={() => this.handleMenuClose(0)}>All</MenuItem>
                        <MenuItem onClick={() => this.handleMenuClose(1)}>Favorites</MenuItem>
                        <MenuItem onClick={() => this.handleMenuClose(2)}>Trending</MenuItem>
                      </Menu>
                    </Box>
                  </div>

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
      </div>
                  </CustomTabPanel >

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
              </Box >


              </div >
        </div >
    );
  }
}

export default User;
