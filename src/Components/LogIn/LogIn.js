import React, { Component } from 'react'
import './LogIn.css'
import Grid from '@mui/material/Grid';
import login_g from '../assests/login_g.png'
import { Link, Navigate } from 'react-router-dom'
import SlideShow_2 from '../SlideShow/SlideShow_2';

class LogIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            rememberMe: false,
            error: '',
            loading: false,
            loginSuccess: false,
            debugInfo: null
        };
    }

    componentDidMount() {
        // Check if user credentials are saved (Remember Me feature)
        const savedEmail = localStorage.getItem('rememberedEmail');
        if (savedEmail) {
            this.setState({
                email: savedEmail,
                rememberMe: true
            });
        }

        // Test backend connection
        this.testBackendConnection();
    }

    testBackendConnection = async () => {
        try {
            const response = await fetch('http://localhost:9090/test');
            const data = await response.json();
            console.log('✅ Backend connection test:', data);
        } catch (error) {
            console.error('❌ Backend connection failed:', error);
            this.setState({
                error: 'Cannot connect to backend. Please ensure Ballerina service is running.'
            });
        }
    }

    handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            this.setState({ [name]: checked });
        } else {
            this.setState({
                [name]: value,
                error: '' // Clear error when user types
            });
        }
    }

    validateForm = () => {
        const { email, password } = this.state;

        if (!email || !password) {
            this.setState({ error: 'Please enter both email and password' });
            return false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.setState({ error: 'Please enter a valid email address' });
            return false;
        }

        return true;
    }

    handleSubmit = async (e) => {
        e.preventDefault();

        if (!this.validateForm()) {
            return;
        }

        this.setState({ loading: true, error: '' });

        const loginData = {
            email: this.state.email,
            password: this.state.password
        };

        console.log('📤 Sending login request for:', loginData.email);

        try {
            const response = await fetch('http://localhost:9090/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData)
            });

            const data = await response.json();
            console.log('📥 Login response:', data);

            if (data.success) {
                // Handle Remember Me
                if (this.state.rememberMe) {
                    localStorage.setItem('rememberedEmail', this.state.email);
                } else {
                    localStorage.removeItem('rememberedEmail');
                }

                // Store user session
                sessionStorage.setItem('userEmail', this.state.email);
                sessionStorage.setItem('username', data.data?.username || this.state.email);
                sessionStorage.setItem('isLoggedIn', 'true');
                sessionStorage.setItem('loginTime', new Date().toISOString());

                this.setState({
                    loginSuccess: true,
                    loading: false,
                    error: ''
                });

                // Redirect to user dashboard
                setTimeout(() => {
                    window.location.href = '/user';
                }, 1000);

            } else {
                this.setState({
                    error: data.message || 'Invalid email or password',
                    loading: false
                });
            }
        } catch (error) {
            console.error('❌ Login error:', error);
            this.setState({
                error: 'Network error. Please check your connection and try again.',
                loading: false
            });
        }
    }

    handleGoogleLogin = async () => {
        console.log('Google login clicked');
        // Implement Google OAuth logic here
        this.setState({ error: 'Google login coming soon!' });
    }

    render() {
        const { email, password, rememberMe, error, loading, loginSuccess } = this.state;

        // Redirect if login successful
        if (loginSuccess) {
            return <Navigate to="/user" replace />;
        }

        return (
            <div className='login_back'>
                <Grid container>
                    <Grid className='login_first_grid' item xs={6}>
                        <div className='slideshow_2_container'>
                            <SlideShow_2 />
                        </div>
                    </Grid>
                    <Grid className='login_second_grid' item xs={6}>
                        <div className='login_container'>
                            <div className='login_container_topic'>
                                <span>Login</span>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div style={{
                                    color: '#d32f2f',
                                    textAlign: 'center',
                                    marginBottom: '15px',
                                    padding: '10px',
                                    backgroundColor: '#ffebee',
                                    borderRadius: '4px',
                                    fontSize: '14px'
                                }}>
                                    {error}
                                </div>
                            )}

                            {/* Success Message */}
                            {loginSuccess && (
                                <div style={{
                                    color: '#2e7d32',
                                    textAlign: 'center',
                                    marginBottom: '15px',
                                    padding: '10px',
                                    backgroundColor: '#e8f5e9',
                                    borderRadius: '4px',
                                    fontSize: '14px'
                                }}>
                                    ✅ Login successful! Redirecting...
                                </div>
                            )}

                            <form onSubmit={this.handleSubmit}>
                                <div>
                                    <input
                                        className='login_input'
                                        type='email'
                                        placeholder='Email'
                                        name='email'
                                        value={email}
                                        onChange={this.handleInputChange}
                                        required
                                        disabled={loading}
                                    /><br />
                                    <input
                                        className='login_input'
                                        type='password'
                                        placeholder='Password'
                                        name='password'
                                        value={password}
                                        onChange={this.handleInputChange}
                                        required
                                        disabled={loading}
                                    /><br /><br />
                                </div>
                                <div className='login_checkbox'>
                                    <input
                                        type='checkbox'
                                        name='rememberMe'
                                        checked={rememberMe}
                                        onChange={this.handleInputChange}
                                        disabled={loading}
                                    />
                                    Remember Me
                                </div>
                                <div className='login'>
                                    <button
                                        type='submit'
                                        disabled={loading}
                                    >
                                        {loading ? 'LOGGING IN...' : 'LOGIN'}
                                    </button>
                                </div>
                            </form>

                            <div className='login_or'>
                                <hr className='hr1_login' />
                                <span>OR</span>
                                <hr className='hr2_login' />
                            </div>
                            <div className='login_g'>
                                <button
                                    onClick={this.handleGoogleLogin}
                                    disabled={loading}
                                >
                                    <img src={login_g} alt="Google Login" />
                                </button>
                            </div>
                            <div className='have_account'>
                                <span>Don't have an account? <Link to="/signup">Sign Up</Link></span>
                            </div>

                            {/* Forgot Password Link */}
                            <div style={{ textAlign: 'center', marginTop: '10px' }}>
                                <Link to="/forgot-password" style={{
                                    color: '#666',
                                    fontSize: '14px',
                                    textDecoration: 'none'
                                }}>
                                    Forgot Password?
                                </Link>
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default LogIn
