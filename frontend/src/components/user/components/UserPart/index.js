import classNames from 'classnames/bind';
import axios from 'axios';
import { useState, useEffect } from 'react';
import style from './UserPart.module.scss';
import { Link } from 'react-router-dom';

const cs = classNames.bind(style);

function UserPart({ avatar }) {
    const [userAvatar, setUserAvatar] = useState(
        'https://img.hoidap247.com/picture/question/20210904/large_1630765811060.jpg',
    );

    useEffect(() => {
        if (avatar) {
            setUserAvatar(avatar);
            return;
        }

        const fetchUserAvatar = async () => {
            try {
                const userString = localStorage.getItem('user');
                if (userString) {
                    const user = JSON.parse(userString);

                    if (user.avatar) {
                        const fullAvatarUrl = `http://localhost:5180${user.avatar}`;
                        setUserAvatar(fullAvatarUrl);
                        return;
                    }

                    const userId = user.id;
                    const response = await axios.get(
                        `http://localhost:5180/api/user/profile/${userId}`,
                    );

                    if (response.data.avatar) {
                        const fullAvatarUrl = `http://localhost:5180${response.data.avatar}`;
                        setUserAvatar(fullAvatarUrl);
                    }
                }
            } catch (error) {
                console.error('Error fetching avatar:', error);
            }
        };

        fetchUserAvatar();
    }, [avatar]);

    return (
        <div className={cs('wrapper')}>
            <Link className={cs('avt')} to={'/profile'}>
                <img
                    alt="User Avatar"
                    className={cs('avtImg')}
                    src={userAvatar}
                    onError={(e) => {
                        e.target.src =
                            'https://img.hoidap247.com/picture/question/20210904/large_1630765811060.jpg';
                    }}
                ></img>
            </Link>
        </div>
    );
}

export default UserPart;
