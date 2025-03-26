import classNames from 'classnames/bind';

import style from './ContestBrief.module.scss';
import CountDown from '~/components/user/components/CountDown';
import { useContext, useEffect, useState } from 'react';
import { fetchCheckIfUserRegisContestAPI, registerUserForContest } from '~/apis';
import AuthContext from '~/context/AuthContext';
import { useNavigate } from 'react-router-dom';
const cs = classNames.bind(style);

function ContestBrief({ contest, contestStatus }) {
    const { contestId, banner, contestName, totalPoint, level, endDate, dueTime, numRegis } =
        contest;
    const { appUser } = useContext(AuthContext);

    const [isRegis, setIsRegis] = useState(false);

    const navagate = useNavigate();

    // Check if user register contest
    useEffect(() => {
        if (appUser === null) {
            return;
        }

        fetchCheckIfUserRegisContestAPI(appUser.id, contestId).then((x) => setIsRegis(x.isRegis));
    }, [appUser, contestId]);

    // Register User for contest
    const registerUser = () => {
        if (appUser === null) {
            navagate('/login');
            return;
        }

        registerUserForContest(appUser.id, contestId).then(() => {
            alert('Bạn đã đăng ký thành công!');
            setIsRegis(true);
        });
    };

    return (
        <div className={cs('wrapper', classNames || '')}>
            <div className={cs('banner')}>
                <img className={cs('bannerImg')} alt="banner" src={banner} />
            </div>

            <div className={cs('info')}>
                <div className={cs('title')}>{contestName}</div>
                <div
                    className={cs('level', {
                        hard: level === 'hard',
                        medium: level === 'medium',
                        easy: level === 'easy',
                    })}
                >
                    {level}
                </div>
                <div className={cs('totalPoint')}>
                    Tổng điểm:
                    <span className={cs('totalPointNum')}>{totalPoint}</span>
                </div>
                <div className={cs('dueTime')}>
                    Thời gian làm bài:
                    <span className={cs('dueTimeNum')}>{dueTime}'</span>
                </div>

                <div className={cs('registerEndDate')}>
                    <div className={cs('numberRegister')}>
                        Đã có
                        <span className={cs('numberRegisterNumber')}>{numRegis}</span>
                        người đăng ký
                    </div>

                    <CountDown classNames={cs('endDate')} endDate={endDate} />
                </div>
            </div>

            {isRegis ? (
                <div className={cs('register')}>Bạn đã đăng ký</div>
            ) : (
                <div onClick={() => registerUser()} className={cs('register')}>
                    Đăng ký ngay
                </div>
            )}
        </div>
    );
}

export default ContestBrief;
