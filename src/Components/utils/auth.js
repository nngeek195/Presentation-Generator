// auth.js - Simple authentication utility
class SimpleAuth {
    // Check if user is logged in
    static isLoggedIn() {
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

    // Get current user data
    static getCurrentUser() {
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

    // Get auth credentials
    static getAuthData() {
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
    }

    // Validate current session
    static async validateSession() {
        const authData = this.getAuthData();

        if (!authData || !authData.email || !authData.password) {
            return false;
        }

        try {
            const response = await fetch('https://6faa62dbfa67e352ff5d3659f4f83df1.serveo.net/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: authData.email,
                    password: authData.password
                })
            });

            const result = await response.json();
            return result.success;
        } catch (error) {
            console.error('Session validation error:', error);
            return false;
        }
    }

    // Logout user
    static logout() {
        localStorage.removeItem('authData');
        localStorage.removeItem('userData');
        localStorage.removeItem('rememberedEmail');
        sessionStorage.clear();
        window.location.href = '/login';
    }

    // Protect page (use in componentDidMount)
    static async protectPage() {
        if (!this.isLoggedIn()) {
            window.location.href = '/login';
            return false;
        }

        const isValid = await this.validateSession();
        if (!isValid) {
            this.logout();
            return false;
        }

        return true;
    }
}

// Export for use in other components
export default SimpleAuth;
