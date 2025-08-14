import React, { Component } from 'react'
import './SignUp.css'
import Grid from '@mui/material/Grid';
import signup_g from '../assests/signup_g.png'
import { Link } from 'react-router-dom'
import SlideShow from '../SlideShow/SlideShow';

class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            username: '',
            password: '',
            error: '',
            success: false,
            loading: false
        };
    }

    handleInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
            error: ''
        });
    }

    validateForm = () => {
        const { email, username, password } = this.state;

        if (!email || !username || !password) {
            this.setState({ error: 'All fields are required' });
            return false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.setState({ error: 'Please enter a valid email' });
            return false;
        }

        // Password validation (minimum 6 characters)
        if (password.length < 6) {
            this.setState({ error: 'Password must be at least 6 characters' });
            return false;
        }

        return true;
    }

    handleSubmit = async (e) => {
        e.preventDefault();

        if (!this.validateForm()) {
            return;
        }

        this.setState({ loading: true });

        const userData = {
            email: this.state.email,
            username: this.state.username,
            password: this.state.password
        };

        try {
            const response = await fetch('http://localhost:9090/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (response.ok) {
                this.setState({
                    success: true,
                    error: '',
                    loading: false
                });

                // Redirect to login after successful signup
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            } else {
                this.setState({
                    error: data.message || 'Signup failed',
                    loading: false
                });
            }
        } catch (error) {
            console.error('Error:', error);
            this.setState({
                error: 'Network error. Please try again.',
                loading: false
            });
        }
    }

    handleGoogleSignup = async () => {
        // Implement Google OAuth logic here
        console.log('Google signup clicked');
    }

    render() {
        const { email, username, password, error, success, loading } = this.state;

        return (
            <div className='signup_back'>
                <Grid container>
                    <Grid className='signup_first_grid' item xs={6}>
                        <div className='signup_container'>
                            <div className='signup_container_topic'>
                                <span>Sign Up</span>
                            </div>

                            {error && (
                                <div style={{
                                    color: 'red',
                                    textAlign: 'center',
                                    marginBottom: '10px',
                                    fontSize: '14px'
                                }}>
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div style={{
                                    color: 'green',
                                    textAlign: 'center',
                                    marginBottom: '10px',
                                    fontSize: '14px'
                                }}>
                                    Signup successful! Redirecting to login...
                                </div>
                            )}

                            <form onSubmit={this.handleSubmit}>
                                <div>
                                    <input
                                        className='signup_input'
                                        type='email'
                                        placeholder='Email'
                                        name='email'
                                        value={email}
                                        onChange={this.handleInputChange}
                                        required
                                    /><br />
                                    <input
                                        className='signup_input'
                                        type='text'
                                        placeholder='Username'
                                        name='username'
                                        value={username}
                                        onChange={this.handleInputChange}
                                        required
                                    /><br />
                                    <input
                                        className='signup_input'
                                        type='password'
                                        placeholder='Password'
                                        name='password'
                                        value={password}
                                        onChange={this.handleInputChange}
                                        required
                                    /><br />
                                </div>
                                <div className='signup'>
                                    <button
                                        type='submit'
                                        disabled={loading}
                                    >
                                        {loading ? 'SIGNING UP...' : 'SIGN UP'}
                                    </button>
                                </div>
                            </form>

                            <div className='signup_or'>
                                <hr className='hr1' />
                                <span>OR</span>
                                <hr className='hr2' />
                            </div >
                            <div className='signup_g'>
                                <button onClick={this.handleGoogleSignup}>
                                    <img src={signup_g} alt="Google Signup" />
                                </button>
                            </div>
                            <div className='havent_account'>
                                <span>Have an account? <Link to="/login">Log in</Link></span>
                            </div>
                        </div>
                    </Grid>
                    <Grid className='signup_second_grid' item xs={6}>
                        <div className='slideshow_container'>
                            <SlideShow />
                        </div>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default SignUp
