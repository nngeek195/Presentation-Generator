import React, { Component } from 'react';
import './User.css';
import Grid from '@mui/material/Grid';
import Logo1 from './Logo1.png';
import { FaUserCircle, FaPlus, FaAngleDown, FaCamera, FaStar, FaRegStar } from 'react-icons/fa';
import { MdOutlineDelete, MdOutlineEdit, MdOutlineRemoveRedEye } from "react-icons/md";
import ProfilePictureModal from './ProfilePictureModal/ProfilePictureModal';
import Popover from './Popover/Popover'
import Popover2 from './Popover/Popover2'
import { IoMdNotificationsOutline, IoMdApps, IoIosTrendingUp, IoMdMenu } from "react-icons/io";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CustomTabPanel from './CustomTabPanel';

const ActionButtonStyles = () => (
  <style>{`
    :root {
      --primary-blue: #2563eb;
      --primary-blue-dark: #1d4ed8;
      --primary-purple: #7c3aed;
      --primary-purple-dark: #6d28d9;
      --primary-red: #dc2626;
      --primary-red-dark: #b91c1c;
      --primary-amber: #f59e0b;
      --primary-amber-dark: #d97706;
      --primary-green: #059669;
      --primary-green-dark: #047857;

      --bg-dark-start: #1e293b;
      --bg-dark-end: #334155;
      --bg-dark-accent: #475569;
      --bg-actions: rgba(15, 23, 42, 0.8);
      --text-light: #f1f5f9;
      --text-muted: #94a3b8;
      --text-dark-muted: #64748b;

      --border-light: rgba(255, 255, 255, 1);
      --shadow-color-light: rgba(255, 255, 255, 1);
      --shadow-color-heavy: rgba(255, 255, 255, 1);

      --card-radius: 16px;
      --button-radius: 8px;
    }

    @keyframes animateSvgBackground {
      0% {
        background-position: 0% 0%;
      }
      50% {
        background-position: 100% 100%;
      }
      100% {
        background-position: 0% 0%;
      }
    }
    .tabs-container {
      margin-bottom: 24px;
      border-bottom: 1px solid var(--border-light);
    }

    .tabs-list {
      display: flex;
      gap: 8px;
      list-style: none;
      padding: 0;
      margin: 0;
      overflow-x: auto;
      scrollbar-width: none; /* For Firefox */
    }

    .tabs-list::-webkit-scrollbar {
      display: none; /* For Chrome, Safari, Opera */
    }

    .tab-item {
      padding: 12px 20px;
      font-size: 16px;
      font-weight: 600;
      color: var(--text-muted);
      background: none;
      border: none;
      cursor: pointer;
      transition: color 0.3s ease, border-color 0.3s ease;
      border-bottom: 3px solid transparent;
      white-space: nowrap;
      position: relative;
      top: 1px;
    }

    .tab-item:hover {
      color: var(--text-light);
    }

    .tab-item.active {
      color: var(--primary-blue);
      border-bottom-color: var(--primary-blue);
    }

    .tab-item:focus-visible {
      outline: 2px solid var(--primary-blue);
      outline-offset: 2px;
      border-radius: 4px;
    }

    .presentations-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 24px;
      padding: 20px 0;
    }

    .presentation {
      background: linear-gradient(145deg, var(--bg-dark-start), var(--bg-dark-end));
      border-radius: var(--card-radius);
      overflow: hidden;
      box-shadow: 0 8px 32px var(--shadow-color-light);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid var(--border-light);
      position: relative;
      min-height: 320px;
      display: flex;
      flex-direction: column;
    }

    .presentation:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 20px 40px var(--shadow-color-heavy);
      border-color: rgba(59, 130, 246, 0.5);
    }

    .presentation_image {
      position: relative;
      height: 180px;
      overflow: hidden;
      background: linear-gradient(45deg, var(--bg-dark-start), var(--bg-dark-accent));
    }

    .presentation_image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .presentation:hover .presentation_image img {
      transform: scale(1.1);
    }

    .favorite_icon {
      position: absolute;
      top: 12px;
      right: 12px;
      font-size: 24px;
      color: var(--text-dark-muted);
      cursor: pointer;
      transition: all 0.2s ease;
      z-index: 10;
      background: rgba(0, 0, 0, 0.5);
      padding: 8px;
      border-radius: 50%;
      backdrop-filter: blur(4px);
    }

    .favorite_icon:hover {
      color: var(--primary-amber);
      transform: scale(1.2);
    }

    .favorite_icon.active {
      color: var(--primary-amber);
    }

    .presentation_topic {
      padding: 16px 20px;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .presentation_topic span {
      font-size: 18px;
      font-weight: 600;
      color: black;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: 8px;
    }

    .presentation-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background: var(--bg-actions);
      backdrop-filter: blur(8px);
      border-top: 1px solid var(--border-light);
      border-radius:2%;
      gap: 8px;
    }

.action-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 16px;
  border: none;
  border-radius: var(--button-radius);
  color: white;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  flex: 1;
  min-height: 40px;
  position: relative;
  overflow: hidden;
  pointer-events: auto;
  z-index: 10;
  background: none;
}

.presentation {
  background: linear-gradient(145deg, var(--bg-dark-start), var(--bg-dark-end));
  border-radius: var(--card-radius);
  overflow: visible; /* CHANGE FROM hidden TO visible */
  box-shadow: 0 8px 32px var(--shadow-color-light);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid var(--border-light);
  position: relative;
  min-height: 320px;
  display: flex;
  flex-direction: column;
}

.presentation-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: var(--bg-actions);
  backdrop-filter: blur(8px);
  border-top: 1px solid var(--border-light);
  gap: 8px;
  position: relative;
  z-index: 5;
  pointer-events: auto;
}

.button-text {
  display: inline;
  font-size: 13px;
  font-weight: 600;
}

.action-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
  pointer-events: none;
}


    .action-button::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.5s;
    }

    .action-button:hover::before {
      left: 100%;
    }

    .action-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px var(--shadow-color-light);
    }

    .action-button:active {
      transform: translateY(0);
    }

    .action-button.view {
      background: linear-gradient(135deg, var(--primary-blue), var(--primary-blue-dark));
      border: 1px solid rgba(37, 99, 235, 0.3);
    }
    .action-button.view:hover {
      background: linear-gradient(135deg, var(--primary-blue-dark), #1e40af);
      box-shadow: 0 8px 25px rgba(37, 99, 235, 0.4);
    }

    .action-button.edit {
      background: linear-gradient(135deg, var(--primary-purple), var(--primary-purple-dark));
      border: 1px solid rgba(124, 58, 237, 0.3);
    }
    .action-button.edit:hover {
      background: linear-gradient(135deg, var(--primary-purple-dark), #5b21b6);
      box-shadow: 0 8px 25px rgba(124, 58, 237, 0.4);
    }

    .action-button.delete {
      background: linear-gradient(135deg, var(--primary-red), var(--primary-red-dark));
      border: 1px solid rgba(220, 38, 38, 0.3);
    }
    .action-button.delete:hover {
      background: linear-gradient(135deg, var(--primary-red-dark), #991b1b);
      box-shadow: 0 8px 25px rgba(220, 38, 38, 0.4);
    }

    .trending-presentation {
      position: relative;
      border: 2px solid var(--primary-amber);
      background: linear-gradient(145deg, rgba(245, 158, 11, 0.1), rgba(251, 191, 36, 0.05));
      box-shadow: 0 8px 32px rgba(245, 158, 11, 0.2);
    }

    .trending-presentation:hover {
      box-shadow: 0 20px 40px rgba(245, 158, 11, 0.3);
      border-color: var(--primary-amber);
    }

    .trending-badge {
      position: absolute;
      top: 12px;
      left: 12px;
      background: linear-gradient(135deg, var(--primary-amber), var(--primary-amber-dark));
      color: white;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: bold;
      z-index: 15;
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
      backdrop-filter: blur(4px);
    }

    .presentation_stats {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 20px;
      background: rgba(15, 23, 42, 0.9);
      border-top: 1px solid rgba(245, 158, 11, 0.2);
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      color: #cbd5e1;
      font-weight: 500;
      padding: 4px 8px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 12px;
    }

    .trending-author {
      font-size: 12px;
      color: var(--text-muted);
      margin-top: 4px;
      font-style: italic;
    }

    .trending-view-only {
      background: linear-gradient(135deg, var(--primary-green), var(--primary-green-dark)) !important;
      border: 1px solid rgba(5, 150, 105, 0.3) !important;
    }

    .trending-view-only:hover {
      background: linear-gradient(135deg, var(--primary-green-dark), #065f46) !important;
      box-shadow: 0 8px 25px rgba(5, 150, 105, 0.4) !important;
    }

    .section-title {
      font-size: 24px;
      font-weight: 700;
      color: var(--text-light);
      margin-bottom: 20px;
      padding-bottom: 12px;
      border-bottom: 2px solid rgba(59, 130, 246, 0.3);
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .section-title.my-presentations {
      color: #60a5fa;
    }

    .section-title.trending-section {
      color: var(--primary-amber);
      border-bottom-color: rgba(245, 158, 11, 0.3);
    }

    .section-title.favorites-section {
      color: var(--primary-purple);
      border-bottom-color: rgba(124, 58, 237, 0.3);
    }

    .section-title.archived-section {
      color: var(--text-muted);
      border-bottom-color: rgba(148, 163, 184, 0.3);
    }

    .presentations-section {
      margin-bottom: 40px;
    }

    .presentations-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 20px;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: var(--text-muted); 
      background: rgba(28, 48, 81, 1); 
      border-radius: var(--card-radius);
      border: 1px dashed var(--border-light); 
    }

    .empty-state h4 {
      font-size: 20px;
      margin-bottom: 12px;
      color: var(--text-light); 
    }

    .no-trending {
      text-align: center;
      padding: 80px 20px;
      color: var(--text-dark-muted);
      background: linear-gradient(145deg, rgba(30, 41, 59, 0.5), rgba(51, 65, 85, 0.3));
      border-radius: 20px;
      border: 2px dashed rgba(245, 158, 11, 0.3);
    }

    .no-trending h3 {
      font-size: 28px;
      margin-bottom: 16px;
      color: var(--primary-amber);
      font-weight: 700;
    }

    @media (max-width: 768px) {
      .presentations-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 16px;
        padding: 16px 0;
      }
      .presentation-actions {
        flex-direction: column;
        gap: 8px;
        padding: 12px 16px;
      }
      .action-button {
        width: 100%;
        padding: 12px 16px;
        font-size: 14px;
        min-height: 44px;
      }
      .presentation_topic {
        padding: 12px 16px;
      }
      .presentation_topic span {
        font-size: 16px;
      }
      .presentations-container {
        padding: 0 16px;
      }
      .section-title {
        font-size: 20px;
        margin-bottom: 16px;
      }
      .presentations-section {
        margin-bottom: 32px;
      }
      .empty-state, .no-trending {
        padding: 40px 16px;
      }
      .no-trending h3 {
        font-size: 24px;
      }
      .empty-state h4 {
        font-size: 18px;
      }
      .tab-item {
        padding: 10px 16px;
        font-size: 15px;
      }
    }

    @media (max-width: 480px) {
      .presentations-grid {
        grid-template-columns: 1fr;
        gap: 16px;
        padding: 12px 0;
      }
      .action-button {
        padding: 14px 16px;
        font-size: 15px;
        min-height: 48px;
        gap: 8px;
      }
      .action-button svg {
        font-size: 16px;
      }
      .presentations-container {
        padding: 0 12px;
      }
      .section-title {
        font-size: 18px;
        flex-direction: column;
        text-align: center;
        gap: 8px;
      }
      .trending-badge {
        font-size: 10px;
        padding: 4px 8px;
      }
      .stat-item {
        font-size: 11px;
        padding: 3px 6px;
      }
      .presentation_stats {
        padding: 8px 16px;
      }
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
      trendingPresentations: [],
      notifications: [],
      notificationCount: 0,
      isLoading: true,
      authError: false
    };
  }

  async componentDidMount() {
    console.log('🔄 User component mounting...');

    // Use simple authentication check instead of server validation
    const isAuthenticated = this.checkAuthentication();
    if (!isAuthenticated) {
      return;
    }

    // Get user data from storage
    this.loadUserDataFromStorage();
  }

  // Simplified authentication check (no server call)
  checkAuthentication = () => {
    console.log('🛡️ Checking authentication...');

    const authData = localStorage.getItem('authData');
    const userData = localStorage.getItem('userData');

    console.log('Auth data exists:', !!authData);
    console.log('User data exists:', !!userData);

    if (!authData || !userData) {
      console.log('❌ No auth/user data found, redirecting to login');
      this.redirectToLogin();
      return false;
    }

    try {
      const parsedAuthData = JSON.parse(authData);
      const parsedUserData = JSON.parse(userData);

      console.log('Parsed auth data:', {
        isAuthenticated: parsedAuthData.isAuthenticated,
        hasEmail: !!parsedAuthData.email,
        loginTime: parsedAuthData.loginTime
      });

      // Check if authenticated and has required data
      if (!parsedAuthData.isAuthenticated || !parsedUserData.email) {
        console.log('❌ Invalid auth data, redirecting to login');
        this.clearAuthData();
        this.redirectToLogin();
        return false;
      }

      // Check if session is expired (24 hours)
      if (parsedAuthData.loginTime) {
        const loginTime = new Date(parsedAuthData.loginTime);
        const now = new Date();
        const hoursDiff = (now - loginTime) / (1000 * 60 * 60);

        console.log('Session age (hours):', hoursDiff.toFixed(2));

        if (hoursDiff > 24) {
          console.log('❌ Session expired, logging out');
          this.clearAuthData();
          this.redirectToLogin();
          return false;
        }
      }

      console.log('✅ Authentication check passed');
      return true;

    } catch (error) {
      console.error('❌ Error parsing auth data:', error);
      this.clearAuthData();
      this.redirectToLogin();
      return false;
    }
  }

  // Load user data from localStorage/sessionStorage
  loadUserDataFromStorage = () => {
    console.log('📂 Loading user data from storage...');

    const userData = localStorage.getItem('userData');
    let userEmail, username, userPicture;

    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        userEmail = parsedData.email;
        username = parsedData.username;
        userPicture = parsedData.picture;

        console.log('User data from localStorage:', {
          email: userEmail,
          username: username,
          hasPicture: !!userPicture
        });
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        // Fallback to sessionStorage
        userEmail = sessionStorage.getItem('userEmail');
        username = sessionStorage.getItem('username');
        userPicture = sessionStorage.getItem('userPicture');

        console.log('Fallback to sessionStorage:', {
          email: userEmail,
          username: username,
          hasPicture: !!userPicture
        });
      }
    } else {
      // Get from sessionStorage
      userEmail = sessionStorage.getItem('userEmail');
      username = sessionStorage.getItem('username');
      userPicture = sessionStorage.getItem('userPicture');

      console.log('Data from sessionStorage only:', {
        email: userEmail,
        username: username,
        hasPicture: !!userPicture
      });
    }

    // Update state with user data
    this.setState({
      userEmail: userEmail || '',
      username: username || 'User',
      userProfilePicture: userPicture,
      isLoading: false
    }, () => {
      console.log('✅ User data loaded into state');

      // Load additional data if we have user email
      if (userEmail) {
        this.fetchNotifications();
        this.fetchNotificationCount();
        this.fetchUserPresentations();
        this.fetchTrendingPresentations();
      }
    });

    // Assign random profile picture if none exists
    if (!userPicture && userEmail) {
      this.assignRandomProfilePicture();
    }
  }

  // Clear authentication data
  clearAuthData = () => {
    console.log('🧹 Clearing auth data...');
    localStorage.removeItem('authData');
    localStorage.removeItem('userData');
    localStorage.removeItem('authToken');
    localStorage.removeItem('rememberedEmail');
    sessionStorage.clear();
  }

  // Redirect to login
  redirectToLogin = () => {
    console.log('🔄 Redirecting to login...');
    window.location.href = '/login';
  }

  // Handle logout
  handleLogout = () => {
    console.log('🚪 Logging out...');
    this.clearAuthData();
    this.redirectToLogin();
  }

  // Optional: Server validation method (use sparingly)
  validateWithServer = async () => {
    const authData = localStorage.getItem('authData');
    if (!authData) return false;

    try {
      const parsedAuthData = JSON.parse(authData);

      // Fix: Use HTTP instead of HTTPS
      const response = await fetch('http://localhost:9090/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: parsedAuthData.email,
          password: parsedAuthData.password
        })
      });

      if (!response.ok) {
        return false;
      }

      const result = await response.json();
      return result.success;

    } catch (error) {
      console.error('Server validation error:', error);
      // Don't logout on network errors - might be temporary
      return true;
    }
  }

  generateNewPresentation = () => {
    const { userEmail } = this.state;
    if (!userEmail) {
      alert('Error: User email not found. Please login again.');
      return;
    }
    // Fix: Use HTTP instead of HTTPS
    const flaskUrl = `http://localhost:5001/?userEmail=${encodeURIComponent(userEmail)}`;
    window.open(flaskUrl, '_blank');
  };

  fetchUserPresentations = async () => {
    const { userEmail } = this.state;
    if (!userEmail) return;

    try {
      // Fix: Use HTTP instead of HTTPS
      const response = await fetch(`http://localhost:5001/presentations/${encodeURIComponent(userEmail)}`);
      const data = await response.json();

      if (data.success && Array.isArray(data.presentations)) {
        const formattedPresentations = data.presentations.map(p => ({
          id: p._id,
          title: p.presentationName,
          image: p.previewImageUrl,
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

  fetchTrendingPresentations = async () => {
    try {
      // Fix: Use HTTP instead of HTTPS
      const response = await fetch('http://localhost:5001/trending');
      const data = await response.json();
      if (data.success) {
        const trendingPresentations = data.data.presentations.map(p => ({
          id: p._id,
          title: p.presentationName,
          image: p.previewImageUrl,
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

  fetchNotifications = async () => {
    const { userEmail } = this.state;
    if (!userEmail) return;
    try {
      // Fix: Use HTTP instead of HTTPS
      const response = await fetch(`http://localhost:5001/notifications/${encodeURIComponent(userEmail)}`);
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
      // Fix: Use HTTP instead of HTTPS
      const response = await fetch(`http://localhost:5001/notifications/count/${encodeURIComponent(userEmail)}`);
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
      // Fix: Use HTTP instead of HTTPS
      const response = await fetch('http://localhost:5001/notifications/reset', {
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

  previewPresentation = (presentationId) => {
    console.log('Preview clicked for:', presentationId);
    // Fix: Use HTTP instead of HTTPS
    const previewUrl = `http://localhost:5001/presentations/view/${presentationId}`;
    window.open(previewUrl, '_blank');
  };

  editPresentation = (presentationId) => {
    console.log('Edit clicked for:', presentationId);
    // Fix: Use HTTP instead of HTTPS
    const editUrl = `http://localhost:5001/present/${presentationId}`;
    window.open(editUrl, '_blank');
  };

  deletePresentation = async (presentationId) => {
    console.log('Delete clicked for:', presentationId);
    if (!window.confirm('Are you sure you want to delete this presentation?')) {
      return;
    }
    try {
      // Fix: Use HTTP instead of HTTPS
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

  viewTrendingPresentation = (presentationId) => {
    // Fix: Use HTTP instead of HTTPS
    const previewUrl = `http://localhost:5001/trending/view/${presentationId}`;
    window.open(previewUrl, '_blank');
  };

  assignRandomProfilePicture = async () => {
    try {
      // Fix: Use HTTP instead of HTTPS
      const response = await fetch('http://localhost:5001/randomProfilePicture');
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
      // Fix: Use HTTP instead of HTTPS
      const response = await fetch('http://localhost:5001/updateProfilePicture', {
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
  markMessageAsRead = async (messageId) => {
    try {
      const userEmail = this.state.userEmail;
      // Fix: Use HTTP instead of HTTPS
      const response = await fetch('http://localhost:5001/messages/markRead', {
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
        this.setState(prevState => ({
          notifications: prevState.notifications.filter(notif => notif.id !== messageId),
          notificationCount: prevState.notificationCount - 1
        }));
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  // Toggle favorite presentation
  toggleFavorite = (id) => {
    this.setState(prevState => ({
      favorites: prevState.favorites.includes(id)
        ? prevState.favorites.filter(favId => favId !== id)
        : [...prevState.favorites, id]
    }));
  }

  // Profile picture modal handlers
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

  // Render trending presentation
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
      trendingPresentations,
      isLoading,
      authError
    } = this.state;

    // Show loading state
    if (isLoading) {
      return (
        <div className="loading-container" style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '18px',
          color: '#666'
        }}>
          🔄 Loading...
        </div>
      );
    }

    // Show auth error state
    if (authError) {
      return (
        <div className="auth-error-container" style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '18px',
          color: '#d32f2f'
        }}>
          <h2>❌ Authentication Error</h2>
          <p>Please log in again to continue.</p>
          <button
            onClick={() => window.location.href = '/login'}
            style={{
              padding: '10px 20px',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '20px'
            }}
          >
            Go to Login
          </button>
        </div>
      );
    }

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
                        <img src={userProfilePicture}
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
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  <Tab icon={<IoMdApps className='tab_icon' />} iconPosition='start' label="All" {...a11yProps(0)} />
                  <Tab icon={<FaRegStar className='tab_icon' />} iconPosition='start' label="Favorites" {...a11yProps(1)} />
                  <Tab icon={<IoIosTrendingUp className='tab_icon' />} iconPosition='start' label="Trending" {...a11yProps(2)} />
                </Tabs>
              </Box>

              <CustomTabPanel value={tabValue} index={0}>
                <div className="presentations-container">
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
                              <button
                                className="action-button view"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  this.previewPresentation(p.id);
                                }}
                                type="button"
                              >
                                <MdOutlineRemoveRedEye />
                                <span className="button-text">View</span>
                              </button>
                              <button
                                className="action-button edit"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  this.editPresentation(p.id);
                                }}
                                type="button"
                              >
                                <MdOutlineEdit />
                                <span className="button-text">Edit</span>
                              </button>
                              <button
                                className="action-button delete"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  this.deletePresentation(p.id);
                                }}
                                type="button"
                              >
                                <MdOutlineDelete />
                                <span className="button-text">Delete</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

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

                  {presentations.length === 0 && (
                    <div className="presentations-section">
                      <h3 className="section-title my-presentations">
                        📁 My Presentations
                      </h3>
                      <div className="empty-state">
                        <h4>No presentations yet</h4>
                        <p>Create your first presentation to get started!</p>
                        <p>Click the "Create New" button above to begin.</p>
                      </div>
                    </div>
                  )}
                </div>
              </CustomTabPanel>

              <CustomTabPanel value={tabValue} index={1}>
                <div className="presentations-container">
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
                              <MdOutlineRemoveRedEye />
                              <span className="button-text">View</span>
                            </button>
                            <button className="action-button edit" onClick={() => this.editPresentation(p.id)}>
                              <MdOutlineEdit />
                              <span className="button-text">Edit</span>
                            </button>
                            <button className="action-button delete" onClick={() => this.deletePresentation(p.id)}>
                              <MdOutlineDelete />
                              <span className="button-text">Delete</span>
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                  {presentations.filter(p => favorites.includes(p.id)).length === 0 && (
                    <div className="empty-state">
                      <h4>No favorite presentations</h4>
                      <p>Mark presentations as favorites by clicking the star icon!</p>
                    </div>
                  )}
                </div>
              </CustomTabPanel>

              <CustomTabPanel value={tabValue} index={2}>
                <div className="presentations-container">
                  <div className="presentations-grid">
                    {trendingPresentations.length > 0 ? (
                      trendingPresentations.map(p => (
                        <div className='presentation trending-presentation' key={p.id}>
                          <div className='presentation_image'>
                            <img src={p.image} alt={p.title} />
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
                          <div className='presentation-actions'>
                            <button
                              className="action-button view trending-view-only"
                              onClick={() => this.viewTrendingPresentation(p.id)}
                            >
                              <MdOutlineRemoveRedEye />
                              <span className="button-text">View Presentation</span>
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
