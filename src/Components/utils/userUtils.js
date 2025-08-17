// utils/userUtils.js

// Get current user data from localStorage
export const getCurrentUser = () => {
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
};

// Check if user is logged in
export const isUserLoggedIn = () => {
    const userData = localStorage.getItem('userData');
    const sessionData = sessionStorage.getItem('isLoggedIn');
    return userData !== null || sessionData === 'true';
};

// Get user profile picture with fallback
export const getUserProfilePicture = (user = null) => {
    // Try to get from passed user object
    if (user && user.picture) {
        return user.picture;
    }

    // Try to get from localStorage
    const storedUser = getCurrentUser();
    if (storedUser && storedUser.picture) {
        return storedUser.picture;
    }

    // Try to get from sessionStorage (fallback)
    const sessionPicture = sessionStorage.getItem('userPicture');
    if (sessionPicture) {
        return sessionPicture;
    }

    // Default fallback
    return 'https://picsum.photos/300/300?random=default';
};

// Update user data in localStorage
export const updateUserData = (newData) => {
    const currentUser = getCurrentUser();
    if (currentUser) {
        const updatedUser = { ...currentUser, ...newData };
        localStorage.setItem('userData', JSON.stringify(updatedUser));

        // Also update sessionStorage for backward compatibility
        if (newData.picture) {
            sessionStorage.setItem('userPicture', newData.picture);
        }
        if (newData.username) {
            sessionStorage.setItem('username', newData.username);
        }

        return updatedUser;
    }
    return null;
};

// Logout user
export const logoutUser = () => {
    // Clear all user data
    localStorage.removeItem('userData');
    localStorage.removeItem('rememberedEmail');
    sessionStorage.clear();

    // Redirect to login
    window.location.href = '/login';
};

// Get user's display name
export const getUserDisplayName = () => {
    const user = getCurrentUser();
    return user ? (user.username || user.email) : 'User';
};
