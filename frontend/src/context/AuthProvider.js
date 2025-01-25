import React, { useState } from 'react';
import AuthContext from '~/context/AuthContext';

function AuthProvider({ children }) {
    const [userRole, setUserRole] = useState('guest');

    const logInAsUser = () => setUserRole('user');
    const logInAsAdmin = () => setUserRole('admin');
    const logout = () => setUserRole('guest');

    return (
        <AuthContext.Provider value={{ userRole, logInAsAdmin, logInAsUser, logout }}>{children}</AuthContext.Provider>
    );
}

export default AuthProvider;
