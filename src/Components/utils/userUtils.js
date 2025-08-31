
export const isUserLoggedIn = () => {
    const authData = localStorage.getItem('authData');
    const userData = localStorage.getItem('userData');

    if (authData && userData) {
        try {
            const parsedAuthData = JSON.parse(authData);
            const parsedUserData = JSON.parse(userData);


            if (parsedAuthData.isAuthenticated && parsedUserData.email) {

                const loginTime = new Date(parsedAuthData.loginTime);
                const now = new Date();
                const hoursDiff = (now - loginTime) / (1000 * 60 * 60);

                const isValid = hoursDiff < 24;

                if (!isValid) {
                    console.log('❌ Session expired, clearing auth data');
                    clearAuthData();
                    return false;
                }

                return true;
            }
        } catch (error) {
            console.error('Error checking login status:', error);
            clearAuthData();
            return false;
        }
    }

    return false;
};


export const getCurrentUser = () => {

    if (!isUserLoggedIn()) {
        return null;
    }

    const userData = localStorage.getItem('userData');
    if (userData) {
        try {
            return JSON.parse(userData);
        } catch (error) {
            console.error('Error parsing user data:', error);
            clearAuthData();
            return null;
        }
    }
    return null;
};


export const getAuthData = () => {
    const authData = localStorage.getItem('authData');
    if (authData) {
        try {
            return JSON.parse(authData);
        } catch (error) {
            console.error('Error parsing auth data:', error);
            return null;
        }
    }
    return null;
};


export const clearAuthData = () => {
    localStorage.removeItem('authData');
    localStorage.removeItem('userData');
    localStorage.removeItem('authToken');
    localStorage.removeItem('rememberedEmail');
    sessionStorage.clear();
    console.log('🧹 All auth data cleared');
};

export const getUserProfilePicture = (user = null) => {
    if (user && user.picture) {
        return user.picture;
    }

    const storedUser = getCurrentUser();
    if (storedUser && storedUser.picture) {
        return storedUser.picture;
    }

    const sessionPicture = sessionStorage.getItem('userPicture');
    if (sessionPicture && sessionPicture !== 'null' && sessionPicture !== '') {
        return sessionPicture;
    }

    const authData = getAuthData();
    if (authData && authData.email) {
        const emailHash = btoa(authData.email).substring(0, 8);
        return `https://picsum.photos/300/300?random=${emailHash}`;
    }

    return 'https://picsum.photos/300/300?random=default';
};


export const updateUserData = (newData) => {
    if (!isUserLoggedIn()) {
        console.error('Cannot update user data: User not logged in');
        return null;
    }

    const currentUser = getCurrentUser();
    if (currentUser) {
        const updatedUser = { ...currentUser, ...newData };
        localStorage.setItem('userData', JSON.stringify(updatedUser));


        if (newData.picture) {
            sessionStorage.setItem('userPicture', newData.picture);
        }
        if (newData.username) {
            sessionStorage.setItem('username', newData.username);
        }
        if (newData.email) {
            sessionStorage.setItem('userEmail', newData.email);
        }

        console.log('✅ User data updated:', updatedUser);
        return updatedUser;
    }
    return null;
};


export const logoutUser = () => {
    console.log('🚪 Logging out user');
    clearAuthData();
    window.location.href = '/login';
};


export const getUserDisplayName = () => {
    const user = getCurrentUser();
    if (user) {
        return user.username || user.email || 'User';
    }
    return 'Guest';
};


export const getUserEmail = () => {
    const user = getCurrentUser();
    return user ? user.email : null;
};


export const isSessionExpired = () => {
    const authData = getAuthData();
    if (!authData || !authData.loginTime) {
        return true;
    }

    try {
        const loginTime = new Date(authData.loginTime);
        const now = new Date();
        const hoursDiff = (now - loginTime) / (1000 * 60 * 60);

        return hoursDiff >= 24;
    } catch (error) {
        console.error('Error checking session expiry:', error);
        return true;
    }
};


export const protectPage = () => {
    console.log('🛡️ Protecting page...');

    if (!isUserLoggedIn()) {
        console.log('❌ User not logged in, redirecting to login');
        window.location.href = '/login';
        return false;
    }

    if (isSessionExpired()) {
        console.log('❌ Session expired, logging out');
        logoutUser();
        return false;
    }

    console.log('✅ Page protection passed');
    return true;
};


export const debugAuth = () => {
    console.log('🔍 Auth Debug Info:');
    console.log('authData:', localStorage.getItem('authData'));
    console.log('userData:', localStorage.getItem('userData'));
    console.log('isLoggedIn:', isUserLoggedIn());
    console.log('isSessionExpired:', isSessionExpired());
    console.log('currentUser:', getCurrentUser());
    console.log('sessionStorage:', {
        isLoggedIn: sessionStorage.getItem('isLoggedIn'),
        userEmail: sessionStorage.getItem('userEmail'),
        username: sessionStorage.getItem('username')
    });
};


export const validateWithServer = async () => {
    const authData = getAuthData();

    if (!authData || !authData.email || !authData.password) {
        return false;
    }

    try {
        const response = await fetch('http://localhost:9090/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: authData.email,
                password: authData.password
            })
        });

        if (!response.ok) {
            return false;
        }

        const result = await response.json();
        return result.success;
    } catch (error) {
        console.error('Server validation error:', error);

        return true;
    }
};


export const updateLoginTime = () => {
    const authData = getAuthData();
    if (authData) {
        authData.loginTime = new Date().toISOString();
        localStorage.setItem('authData', JSON.stringify(authData));
        console.log('✅ Login time updated');
    }
};
