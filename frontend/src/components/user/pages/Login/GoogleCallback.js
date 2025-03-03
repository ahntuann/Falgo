import { useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '~/context/AuthContext';

const GoogleCallback = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { logInAsUser } = useContext(AuthContext);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const userId = params.get('id');
        const userName = params.get('userName');
        const email = params.get('email');

        if (token) {
            const userData = { id: userId, userName, email, token };
            localStorage.setItem('user', JSON.stringify(userData));
            logInAsUser();
            console.log('User stored:', userData);

            navigate('/');
        } else {
            console.error('Google login failed: No token received');
            alert('Google login failed!');
            navigate('/login');
        }
    }, [location, navigate]);

    return <p>Logging in...</p>;
};

export default GoogleCallback;
