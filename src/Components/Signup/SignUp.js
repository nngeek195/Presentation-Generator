import React, { Component } from 'react'
import './SignUp.css'
import Grid from '@mui/material/Grid';
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
            emailError: '',
            usernameError: '',
            success: false,
            loading: false,
            checkingEmail: false,
            checkingUsername: false
        };

        this.emailCheckTimer = null;
        this.usernameCheckTimer = null;
    }

    checkEmailExists = async (email) => {
        if (!email || !email.includes('@')) return;

        this.setState({ checkingEmail: true, emailError: '' });

        try {
            const response = await fetch(`https://localhost:9090/checkEmail/${encodeURIComponent(email)}`);
            const data = await response.json();

            if (data.success && data.data?.exists) {
                this.setState({
                    emailError: 'This email is already registered',
                    checkingEmail: false
                });
                return true;
            } else {
                this.setState({
                    emailError: '',
                    checkingEmail: false
                });
                return false;
            }
        } catch (error) {
            console.error('Error checking email:', error);
            this.setState({ checkingEmail: false });
            return false;
        }
    }

    checkUsernameExists = async (username) => {
        if (!username || username.length < 3) return;

        this.setState({ checkingUsername: true, usernameError: '' });

        try {
            const response = await fetch(`https://localhost:9090/checkUsername/${encodeURIComponent(username)}`);
            const data = await response.json();

            if (data.success && data.data?.exists) {
                this.setState({
                    usernameError: 'This username is already taken',
                    checkingUsername: false
                });
                return true;
            } else {
                this.setState({
                    usernameError: '',
                    checkingUsername: false
                });
                return false;
            }
        } catch (error) {
            console.error('Error checking username:', error);
            this.setState({ checkingUsername: false });
            return false;
        }
    }

    handleInputChange = (e) => {
        const { name, value } = e.target;

        this.setState({
            [name]: value,
            error: ''
        });

        if (name === 'email') {
            this.setState({ emailError: '' });

            if (this.emailCheckTimer) {
                clearTimeout(this.emailCheckTimer);
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value && !emailRegex.test(value)) {
                this.setState({ emailError: 'Please enter a valid email address' });
                return;
            }

            this.emailCheckTimer = setTimeout(() => {
                if (value && emailRegex.test(value)) {
                    this.checkEmailExists(value);
                }
            }, 500); 
        }

        if (name === 'username') {
            this.setState({ usernameError: '' });

            if (this.usernameCheckTimer) {
                clearTimeout(this.usernameCheckTimer);
            }

            if (value && value.length < 3) {
                this.setState({ usernameError: 'Username must be at least 3 characters' });
                return;
            }

            this.usernameCheckTimer = setTimeout(() => {
                if (value && value.length >= 3) {
                    this.checkUsernameExists(value);
                }
            }, 500); 
        }
    }

    validateForm = async () => {
        const { email, username, password, emailError, usernameError } = this.state;

        if (emailError || usernameError) {
            this.setState({ error: 'Please fix the errors before submitting' });
            return false;
        }

        if (!email || !username || !password) {
            this.setState({ error: 'All fields are required' });
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.setState({ error: 'Please enter a valid email address' });
            return false;
        }

        if (username.length < 3) {
            this.setState({ error: 'Username must be at least 3 characters' });
            return false;
        }

        if (password.length < 6) {
            this.setState({ error: 'Password must be at least 6 characters' });
            return false;
        }

        const emailExists = await this.checkEmailExists(email);
        const usernameExists = await this.checkUsernameExists(username);

        if (emailExists || usernameExists) {
            this.setState({ error: 'Please choose a different email or username' });
            return false;
        }

        return true;
    }

    handleSubmit = async (e) => {
        e.preventDefault();

        const isValid = await this.validateForm();
        if (!isValid) {
            return;
        }

        this.setState({ loading: true });

        const userData = {
            email: this.state.email,
            username: this.state.username,
            password: this.state.password
        };

        try {
            const response = await fetch('https://localhost:9090/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (data.success) {
                this.setState({
                    success: true,
                    error: '',
                    loading: false
                });

                if (data.data) {
                    localStorage.setItem('userData', JSON.stringify({
                        email: data.data.email,
                        username: data.data.username,
                        picture: data.data.picture,
                        pictureId: data.data.pictureId,
                        authMethod: data.data.authMethod
                    }));
                }

                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            } else {
                this.setState({
                    error: data.message || 'Signup failed',
                    loading: false
                });

                if (data.message?.toLowerCase().includes('email')) {
                    this.setState({ emailError: data.message });
                }

                if (data.message?.toLowerCase().includes('username')) {
                    this.setState({ usernameError: data.message });
                }
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
        console.log('Google signup clicked');
    }

    componentWillUnmount() {
        if (this.emailCheckTimer) {
            clearTimeout(this.emailCheckTimer);
        }
        if (this.usernameCheckTimer) {
            clearTimeout(this.usernameCheckTimer);
        }
    }

    render() {
        const {
            email,
            username,
            password,
            error,
            emailError,
            usernameError,
            success,
            loading,
            checkingEmail,
            checkingUsername
        } = this.state;

        return (

            <div className='signup_back'>
                <Grid container className='grid_container'>
                    <Grid className='signup_first_grid' item xs={6}>
                        <div className='signup_container'>
                            <div className='signup_container_topic'>
                                <span>Sign Up</span>
                            </div>

                            {error && (
                                <div className='signup_error'>
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className='signup_success'>
                                    Signup successful! Redirecting to login...
                                </div>
                            )}

                            <form onSubmit={this.handleSubmit}>
                                <div>
                                    <div className='signup_input_email'>
                                        <input
                                            className={`signup_input ${emailError ? 'error' : ''}`}
                                            type='email'
                                            placeholder='Email'
                                            name='email'
                                            value={email}
                                            onChange={this.handleInputChange}
                                            required
                                            style={{
                                                borderColor: emailError ? '#d32f2f' : '',
                                                paddingRight: checkingEmail ? '35px' : ''
                                            }}
                                        />
                                        {checkingEmail && (
                                            <span className='signup_emailchecking'>
                                                Checking...
                                            </span>
                                        )}
                                        {emailError && (
                                            <div className='signup_emailerror'>
                                                {emailError}
                                            </div>
                                        )}
                                    </div>

                                    <div className='signup_input_username'>
                                        <input
                                            className={`signup_input ${usernameError ? 'error' : ''}`}
                                            type='text'
                                            placeholder='Username'
                                            name='username'
                                            value={username}
                                            onChange={this.handleInputChange}
                                            required
                                            style={{
                                                borderColor: usernameError ? '#d32f2f' : '',
                                                paddingRight: checkingUsername ? '35px' : ''
                                            }}
                                        />
                                        {checkingUsername && (
                                            <span className='signup_usernamechecking'>
                                                Checking...
                                            </span>
                                        )}
                                        {usernameError && (
                                            <div className='signup_usernameerror'>
                                                {usernameError}
                                            </div>
                                        )}
                                    </div>

                                    <input
                                        className='signup_input'
                                        type='password'
                                        placeholder='Password (min. 6 characters)'
                                        name='password'
                                        value={password}
                                        onChange={this.handleInputChange}
                                        required
                                    /><br />
                                </div>
                                <div className='signup'>
                                    <button
                                        type='submit'
                                        disabled={loading || emailError || usernameError || checkingEmail || checkingUsername}
                                    >
                                        {loading ? 'SIGNING UP...' : 'SIGN UP'}
                                    </button>
                                </div>
                            </form>

                            <div className='signup_or'>
                                <hr className='hr1' />
                                <span>OR</span>
                                <hr className='hr2' />
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
