import React, { useState } from 'react';
import AuthContext from '~/context/AuthContext';

function AuthProvider({ children }) {
    const userRoleNow = localStorage.getItem('user');

    const [userRole, setUserRole] = useState(userRoleNow !== null ? 'user' : 'guest');
    const [appUser, setAppUser] = useState(
        userRole !== null ? JSON.parse(localStorage.getItem('user')) : null,
    );

    const logInAsUser = () => {
        setAppUser(JSON.parse(localStorage.getItem('user')));
        setUserRole('user');
    };
    const logInAsAdmin = () => setUserRole('admin');
    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('admin');
        window.location.reload();
        setUserRole('guest');
    };

    return (
        <AuthContext.Provider value={{ userRole, appUser, logInAsAdmin, logInAsUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
