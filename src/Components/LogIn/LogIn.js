import React, { Component } from 'react'
import './LogIn.css'
import Grid from '@mui/material/Grid';
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
        this.checkExistingAuth();

        const savedEmail = localStorage.getItem('rememberedEmail');
        if (savedEmail) {
            this.setState({
                email: savedEmail,
                rememberMe: true
            });
        }

        this.testBackendConnection();
    }

    checkExistingAuth = async () => {
        const authData = localStorage.getItem('authData');

        if (authData) {
            try {
                const parsedAuthData = JSON.parse(authData);

                if (parsedAuthData.isAuthenticated && parsedAuthData.email && parsedAuthData.password) {
                    console.log('✅ User already authenticated, validating credentials...');

                    const response = await fetch('https://6faa62dbfa67e352ff5d3659f4f83df1.serveo.net/login', {
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

                    if (result.success) {
                        console.log('✅ Stored credentials valid, redirecting...');
                        this.setState({ loginSuccess: true });
                        return;
                    }
                }
            } catch (error) {
                console.log('Stored auth validation failed, user needs to login');
            }

            this.clearAuthData();
        }
    }

    clearAuthData = () => {
        localStorage.removeItem('authData');
        localStorage.removeItem('userData');
        localStorage.removeItem('authToken'); 
        sessionStorage.clear();
    }

    testBackendConnection = async () => {
        try {
            const response = await fetch('https://par-assist-as-amber.trycloudflare.com/test');
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
                error: '' 
            });
        }
    }

    validateForm = () => {
        const { email, password } = this.state;

        if (!email || !password) {
            this.setState({ error: 'Please enter both email and password' });
            return false;
        }

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
            const response = await fetch('https://par-assist-as-amber.trycloudflare.com/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData)
            });

            const data = await response.json();
            console.log('📥 Login response:', data);

            if (data.success) {
                const authData = {
                    email: this.state.email,
                    password: this.state.password, 
                    isAuthenticated: true,
                    loginTime: new Date().toISOString()
                };

                const userData = {
                    email: data.data.email,
                    username: data.data.username,
                    picture: data.data.profile?.picture || null,
                    bio: data.data.profile?.bio || null,
                    location: data.data.profile?.location || null,
                    phoneNumber: data.data.profile?.phoneNumber || null,
                    loginTime: data.data.loginTime || new Date().toISOString(),
                    authMethod: 'local'
                };

                localStorage.setItem('authData', JSON.stringify(authData));
                localStorage.setItem('userData', JSON.stringify(userData));

                if (this.state.rememberMe) {
                    localStorage.setItem('rememberedEmail', this.state.email);
                } else {
                    localStorage.removeItem('rememberedEmail');
                }

                sessionStorage.setItem('userEmail', data.data.email);
                sessionStorage.setItem('username', data.data.username);
                sessionStorage.setItem('userPicture', data.data.profile?.picture || '');
                sessionStorage.setItem('isLoggedIn', 'true');
                sessionStorage.setItem('loginTime', userData.loginTime);

                console.log('✅ User data and auth stored:', { userData, authData });

                this.setState({
                    loginSuccess: true,
                    loading: false,
                    error: ''
                });

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
        this.setState({ error: 'Google login coming soon!' });
    }

    static logout = () => {
        localStorage.removeItem('authData');
        localStorage.removeItem('userData');
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('authToken'); 
        sessionStorage.clear();

        window.location.href = '/login';
    }

    static isUserLoggedIn = () => {
        const authData = localStorage.getItem('authData');
        if (authData) {
            try {
                const parsedAuthData = JSON.parse(authData);
                return parsedAuthData.isAuthenticated === true;
            } catch (error) {
                return false;
            }
        }
        return false;
    }

    static getCurrentUser = () => {
        const userData = localStorage.getItem('userData');
        if (userData) {
            try {
                return JSON.parse(userData);
            } catch (error) {
                console.error('Error parsing user data:', error);
                return null;
            }
        }
        return null;
    }

    render() {
        const { email, password, rememberMe, error, loading, loginSuccess } = this.state;

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
                                    Login successful! Redirecting...
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
                            <div className='have_account'>
                                <span>Don't have an account? <Link to="/signup">Sign Up</Link></span>
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default LogIn
