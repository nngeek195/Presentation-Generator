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

export const isUserLoggedIn = () => {
    const userData = localStorage.getItem('userData');
    const sessionData = sessionStorage.getItem('isLoggedIn');
    return userData !== null || sessionData === 'true';
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
    if (sessionPicture) {
        return sessionPicture;
    }

    return 'https://picsum.photos/300/300?random=default';
};

export const updateUserData = (newData) => {
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

        return updatedUser;
    }
    return null;
};

export const logoutUser = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('rememberedEmail');
    sessionStorage.clear();

    window.location.href = '/login';
};

export const getUserDisplayName = () => {
    const user = getCurrentUser();
    return user ? (user.username || user.email) : 'User';
};
