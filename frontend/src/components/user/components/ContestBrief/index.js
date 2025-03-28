import classNames from 'classnames/bind';
import 'react-quill/dist/quill.snow.css';
import style from './ContestBrief.module.scss';
import CountDown from '~/components/user/components/CountDown';
import { useContext, useEffect, useState } from 'react';
import { fetchCheckIfUserRegisContestAPI, registerUserForContest } from '~/apis';
import AuthContext from '~/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';

const cs = classNames.bind(style);

function ContestBrief({ contest, contestStatus }) {
    const { contestId, banner, contestName, totalPoint, level, endDate, dueTime, numRegis } =
        contest;
    const { appUser } = useContext(AuthContext);

    const [isRegis, setIsRegis] = useState(false);

    const navigate = useNavigate();

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
            navigate('/login');
            return;
        }

        registerUserForContest(appUser.id, contestId).then(() => {
            alert('Bạn đã đăng ký thành công!');
            setIsRegis(true);
        });
    };

    return (
        <div className={cs('wrapper', classNames || '')}>
            <div
                className={cs('banner')}
                onClick={() => {
                    if (isRegis)
                        navigate(`/contest/${contestId}`, {
                            state: { ...contest, contestStatus, isRegis },
                        });
                    else {
                        alert('Bạn cần đăng ký mới có thể xem chi tiết cuộc thi');
                    }
                }}
            >
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
                contestStatus === 'over' ? (
                    <div
                        className={cs('register')}
                        onClick={() =>
                            navigate(`/contest/${contestId}`, {
                                state: { ...contest, contestStatus, isRegis },
                            })
                        }
                    >
                        Bắt đầu thi giả lập
                    </div>
                ) : (
                    <div
                        className={cs('register')}
                        onClick={() =>
                            navigate(`/contest/${contestId}`, {
                                state: { ...contest, contestStatus, isRegis },
                            })
                        }
                    >
                        Bắt đầu ngay
                    </div>
                )
            ) : (
                <div onClick={() => registerUser()} className={cs('register')}>
                    Đăng ký ngay
                </div>
            )}
        </div>
    );
}

export default ContestBrief;
