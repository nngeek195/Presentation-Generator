import React, { Component } from 'react';
import { FaTrash, FaEdit, FaEye, FaUsers, FaBell, FaChartBar, FaSearch, FaFilter } from 'react-icons/fa';
import { MdSend, MdNotifications, MdPeople, MdDashboard, MdEmail, MdWarning, MdInfo, MdCheckCircle } from 'react-icons/md';
import './AdminPanel.css';
import Logo2 from '../User/Logo1.png'

class AdminPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // Notification form state 
            title: '',
            message: '',
            type: 'info',
            priority: 2,
            adminEmail: 'admin@yourapp.com',
            loading: false,
            success: '',
            error: '',

            // Admin panel state
            activeTab: 'notifications',
            allNotifications: [],
            users: [],
            stats: {
                totalUsers: 0,
                totalNotifications: 0,
                unreadNotifications: 0,
                activeUsers: 0
            },
            searchTerm: '',
            filterType: 'all'
        };
    }

    componentDidMount() {
        this.fetchAllNotifications();
        this.fetchUsers();
        this.fetchStats();
    }

    fetchAllNotifications = async () => {
        try {
            const response = await fetch('https://sharp-hound-68.loca.lt/admin/notifications');
            const data = await response.json();

            if (data.success) {
                this.setState({
                    allNotifications: data.data || [],
                    stats: {
                        ...this.state.stats,
                        totalNotifications: (data.data || []).length
                    }
                });
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    fetchUsers = async () => {
        try {
            const response = await fetch('https://sharp-hound-68.loca.lt/users');
            const data = await response.json();

            console.log('Fetched users:', data); // Debugging log

            if (data.success) {
                this.setState({
                    users: data.data || [],
                    stats: {
                        ...this.state.stats,
                        totalUsers: data.data?.length || 0
                    }
                });
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    fetchStats = async () => {
        try {
            // You can implement a dedicated stats endpoint later
            this.setState({
                stats: {
                    ...this.state.stats,
                    totalNotifications: this.state.allNotifications.length
                }
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value, error: '', success: '' });
    };

    handleSubmit = async (e) => {
        e.preventDefault();

        if (!this.state.title || !this.state.message) {
            this.setState({ error: 'Title and message are required' });
            return;
        }

        this.setState({ loading: true, error: '', success: '' });

        try {
            const response = await fetch('https://sharp-hound-68.loca.lt/admin/sendEmailNotification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: this.state.title,
                    message: this.state.message,
                    messageType: this.state.type,
                    priority: parseInt(this.state.priority),
                    adminEmail: this.state.adminEmail
                })
            });

            const data = await response.json();

            if (data.success) {
                this.setState({
                    success: `Email notification sent successfully to ${data.data.successCount} users!`,
                    title: '',
                    message: '',
                    type: 'info',
                    priority: 2,
                    loading: false
                });
                // Refresh user count and notifications
                this.fetchAllNotifications();
                this.fetchUsers(); // Refresh user count 
            } else {
                this.setState({
                    error: data.message || 'Failed to send email notification',
                    loading: false
                });
            }
        } catch (error) {
            console.error('Error sending email notification:', error);
            this.setState({
                error: 'Network error. Please try again.',
                loading: false
            });
        }
    };


    handleTabChange = (tab) => {
        this.setState({ activeTab: tab });
    };

    handleSearch = (e) => {
        this.setState({ searchTerm: e.target.value });
    };

    handleFilter = (e) => {
        this.setState({ filterType: e.target.value });
    };

    getFilteredNotifications = () => {
        const { allNotifications, searchTerm, filterType } = this.state;

        return allNotifications
            .filter(notification =>
                notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                notification.message.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .filter(notification => {
                if (filterType === 'all') return true;
                return notification.type === filterType;
            });
    };

    getFilteredUsers = () => {
        const { users, searchTerm } = this.state;

        return users.filter(user =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    getNotificationTypeIcon = (type) => {
        switch (type) {
            case 'success': return <MdCheckCircle className="type-icon success" />;
            case 'warning': return <MdWarning className="type-icon warning" />;
            case 'error': return <MdWarning className="type-icon error" />;
            default: return <MdInfo className="type-icon info" />;
        }
    };

    getPriorityLabel = (priority) => {
        switch (priority) {
            case 3: return <span className="priority-badge high">High</span>;
            case 2: return <span className="priority-badge medium">Medium</span>;
            default: return <span className="priority-badge low">Low</span>;
        }
    };

    render() {
        const {
            title,
            message,
            type,
            priority,
            loading,
            success,
            error,
            activeTab,
            stats,
            searchTerm
        } = this.state;

        const filteredNotifications = this.getFilteredNotifications();
        const filteredUsers = this.getFilteredUsers();

        return (
            <div className="admin-panel">
                <div className="admin-sidebar">
                    <div className="admin-logo">
                        <img className='admin_logo_img' src={Logo2} />
                        <h1>Admin</h1>
                    </div>

                    <nav className="admin-nav">
                        <button
                            className={`nav-button ${activeTab === 'notifications' ? 'active' : ''}`}
                            onClick={() => this.handleTabChange('notifications')}
                        >
                            <MdEmail className="nav-icon" />
                            <span>Send Emails</span>
                        </button>
                        <button
                            className={`nav-button ${activeTab === 'history' ? 'active' : ''}`}
                            onClick={() => this.handleTabChange('history')}
                        >
                            <FaChartBar className="nav-icon" />
                            <span>Notification History</span>
                        </button>
                        <button
                            className={`nav-button ${activeTab === 'users' ? 'active' : ''}`}
                            onClick={() => this.handleTabChange('users')}
                        >
                            <FaUsers className="nav-icon" />
                            <span>User Management</span>
                        </button>
                    </nav>
                </div>

                <div className="admin-content">
                    <div className="admin-header">
                        <h1>{
                            activeTab === 'notifications' ? 'Send Notifications' :
                                activeTab === 'history' ? 'Notification History' :
                                    'User Management'
                        }</h1>

                        <div className="admin-stats">
                            <div className="stat-card">
                                <MdPeople className="stat-icon" />
                                <div>
                                    <span className="stat-number">{stats.totalUsers}</span>
                                    <span className="stat-label">Total Users</span>
                                </div>
                            </div>

                            <div className="stat-card">
                                <FaUsers className="stat-icon" />
                                <div>
                                    <span className="stat-number">{stats.activeUsers}</span>
                                    <span className="stat-label">Active Users</span>
                                </div>
                            </div>

                            <div className="stat-card">
                                <MdNotifications className="stat-icon" />
                                <div>
                                    <span className="stat-number">{stats.totalNotifications}</span>
                                    <span className="stat-label">Notifications</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="admin-main">
                        {/* Send Notifications Tab */}
                        {activeTab === 'notifications' && (
                            <div className="notification-form-container">
                                <div className="card">
                                    <div className="card-header">
                                        <MdEmail className="card-icon" />
                                        <h2>Send Email Notification to All Users</h2>
                                    </div>

                                    {error && (
                                        <div className="alert alert-error">
                                            <MdWarning className="alert-icon" />
                                            <span>{error}</span>
                                        </div>
                                    )}

                                    {success && (
                                        <div className="alert alert-success">
                                            <MdCheckCircle className="alert-icon" />
                                            <span>{success}</span>
                                        </div>
                                    )}

                                    <form onSubmit={this.handleSubmit} className="notification-form">
                                        <div className="form-group">
                                            <label htmlFor="title">Notification Title <span className="required">*</span></label>
                                            <input
                                                type="text"
                                                id="title"
                                                name="title"
                                                value={title}
                                                onChange={this.handleInputChange}
                                                placeholder="Enter notification title..."
                                                disabled={loading}
                                                maxLength={100}
                                                className="form-control"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="message">Message <span className="required">*</span></label>
                                            <textarea
                                                id="message"
                                                name="message"
                                                value={message}
                                                onChange={this.handleInputChange}
                                                placeholder="Enter your message here..."
                                                disabled={loading}
                                                rows={5}
                                                maxLength={500}
                                                className="form-control"
                                            />
                                            <small className="char-count">{message.length}/500 characters</small>
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label htmlFor="type">Notification Type</label>
                                                <div className="select-wrapper">
                                                    <select
                                                        id="type"
                                                        name="type"
                                                        value={type}
                                                        onChange={this.handleInputChange}
                                                        disabled={loading}
                                                        className="form-control"
                                                    >
                                                        <option value="info">ℹ️ Info</option>
                                                        <option value="success">✅ Success</option>
                                                        <option value="warning">⚠️ Warning</option>
                                                        <option value="error">❌ Error</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="priority">Priority Level</label>
                                                <div className="select-wrapper">
                                                    <select
                                                        id="priority"
                                                        name="priority"
                                                        value={priority}
                                                        onChange={this.handleInputChange}
                                                        disabled={loading}
                                                        className="form-control"
                                                    >
                                                        <option value={1}>🟢 Low Priority</option>
                                                        <option value={2}>🟡 Medium Priority</option>
                                                        <option value={3}>🔴 High Priority</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-actions">
                                            <button
                                                type="submit"
                                                disabled={loading || !title || !message}
                                                className={`btn-primary ${loading ? 'loading' : ''}`}
                                            >
                                                {loading ? (
                                                    <>
                                                        <span className="spinner"></span>
                                                        Sending...
                                                    </>
                                                ) : (
                                                    <>
                                                        <MdSend />
                                                        Send to All Users
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* Notification History Tab */}
                        {activeTab === 'history' && (
                            <div className="notification-history">
                                <div className="card">
                                    <div className="card-header">
                                        <FaChartBar className="card-icon" />
                                        <h2>Notification History</h2>
                                    </div>

                                    <div className="filters">
                                        <div className="search-box">
                                            <FaSearch className="search-icon" />
                                            <input
                                                type="text"
                                                placeholder="Search notifications..."
                                                value={searchTerm}
                                                onChange={this.handleSearch}
                                                className="search-input"
                                            />
                                        </div>

                                        <div className="filter-box">
                                            <FaFilter className="filter-icon" />
                                            <select
                                                onChange={this.handleFilter}
                                                className="filter-select"
                                            >
                                                <option value="all">All Types</option>
                                                <option value="info">Info</option>
                                                <option value="success">Success</option>
                                                <option value="warning">Warning</option>
                                                <option value="error">Error</option>
                                            </select>
                                        </div>
                                    </div>

                                    {filteredNotifications.length === 0 ? (
                                        <div className="empty-state">
                                            <FaBell className="empty-icon" />
                                            <h3>No notifications found</h3>
                                            <p>Try adjusting your search or send your first notification.</p>
                                        </div>
                                    ) : (
                                        <div className="notifications-table-container">
                                            <table className="data-table">
                                                <thead>
                                                    <tr>
                                                        <th>Title & Message</th>
                                                        <th>Type</th>
                                                        <th>Priority</th>
                                                        <th>Date Sent</th>
                                                        <th>Status</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredNotifications.map((notification, index) => (
                                                        <tr key={index}>
                                                            <td>
                                                                <div className="notification-title-cell">
                                                                    <strong>{notification.title}</strong>
                                                                    <small>{notification.message.length > 50
                                                                        ? `${notification.message.substring(0, 50)}...`
                                                                        : notification.message}
                                                                    </small>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <span className={`type-badge ${notification.type}`}>
                                                                    {this.getNotificationTypeIcon(notification.type)}
                                                                    {notification.type}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                {this.getPriorityLabel(notification.priority)}
                                                            </td>
                                                            <td className="date-cell">
                                                                {new Date(notification.createdAt).toLocaleDateString()}
                                                                <small>
                                                                    {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </small>
                                                            </td>
                                                            <td>
                                                                <span className={`status-badge ${notification.isActive ? 'active' : 'inactive'}`}>
                                                                    {notification.isActive ? 'Active' : 'Inactive'}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <div className="action-buttons">
                                                                    <button className="action-btn view" title="View Details">
                                                                        <FaEye />
                                                                    </button>
                                                                    <button className="action-btn edit" title="Edit">
                                                                        <FaEdit />
                                                                    </button>
                                                                    <button className="action-btn delete" title="Delete">
                                                                        <FaTrash />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Users Management Tab */}
                        {activeTab === 'users' && (
                            <div className="users-management">
                                <div className="card">
                                    <div className="card-header">
                                        <FaUsers className="card-icon" />
                                        <h2>User Management</h2>
                                    </div>

                                    <div className="filters">
                                        <div className="search-box">
                                            <FaSearch className="search-icon" />
                                            <input
                                                type="text"
                                                placeholder="Search users by name or email..."
                                                value={searchTerm}
                                                onChange={this.handleSearch}
                                                className="search-input"
                                            />
                                        </div>
                                    </div>

                                    {filteredUsers.length === 0 ? (
                                        <div className="empty-state">
                                            <FaUsers className="empty-icon" />
                                            <h3>No users found</h3>
                                            <p>There are no users matching your search criteria.</p>
                                        </div>
                                    ) : (
                                        <div className="users-table-container">
                                            <table className="data-table">
                                                <thead>
                                                    <tr>
                                                        <th>User</th>
                                                        <th>Email</th>
                                                        <th>Created At</th>
                                                        <th>Last Login</th>
                                                        <th>Status</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredUsers.map((user, index) => (
                                                        <tr key={index}>
                                                            <td>
                                                                <div className="user-cell">
                                                                    <div className="user-avatar">
                                                                        {user.username.charAt(0).toUpperCase()}
                                                                    </div>
                                                                    <span>{user.username}</span>
                                                                </div>
                                                            </td>
                                                            <td>{user.email}</td>
                                                            <td className="date-cell">
                                                                {user.createdAt
                                                                    ? new Date(user.createdAt).toLocaleDateString()
                                                                    : 'N/A'
                                                                }
                                                                {user.createdAt && (
                                                                    <small>
                                                                        {new Date(user.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                    </small>
                                                                )}
                                                            </td>
                                                            <td className="date-cell">
                                                                {user.lastLogin
                                                                    ? new Date(user.lastLogin).toLocaleDateString()
                                                                    : 'Never'
                                                                }
                                                                {user.lastLogin && (
                                                                    <small>
                                                                        {new Date(user.lastLogin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                    </small>
                                                                )}
                                                            </td>
                                                            <td>
                                                                <span className={`status-badge ${user.lastLogin ? 'active' : 'inactive'}`}>
                                                                    {user.lastLogin ? 'Active' : 'Inactive'}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <div className="action-buttons">
                                                                    <button className="action-btn view" title="View User">
                                                                        <FaEye />
                                                                    </button>
                                                                    <button className="action-btn edit" title="Edit User">
                                                                        <FaEdit />
                                                                    </button>
                                                                    <button className="action-btn delete" title="Delete User">
                                                                        <FaTrash />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export default AdminPanel;