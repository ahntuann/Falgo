import React, { useState } from 'react';
import AuthContext from '~/context/AuthContext';

function AuthProvider({ children }) {
    const userRoleNow = localStorage.getItem('user');

    const [userRole, setUserRole] = useState(userRoleNow !== null ? 'user' : 'guest');

    const logInAsUser = () => setUserRole('user');
    const logInAsAdmin = () => setUserRole('admin');
    const logout = () => {
        localStorage.removeItem('user');
        setUserRole('guest');
    };

    return (
        <AuthContext.Provider value={{ userRole, logInAsAdmin, logInAsUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
