import classNames from 'classnames/bind';

import style from './FixedCountDown.module.scss';
import { useCallback, useContext, useRef } from 'react';
import AuthContext from '~/context/AuthContext';
import useCountdown from '~/hooks/useCountDown';
import { StartContestForUserAPI } from '~/apis';

const cs = classNames.bind(style);

function FixedCountDown({ contest, isStart, setIsStart, startDate, isEnd }) {
    const { contestId, contestStatus, dueTime } = contest;
    const { appUser } = useContext(AuthContext);

    // const handleTimeUp = () => {
    //     alert('Hết thời gian làm bài!');
    // };

    const { minutes, seconds } = useCountdown(startDate, dueTime);

    const handleStartContest = useCallback(() => {
        StartContestForUserAPI(appUser.id, contestId).then(() => {
            setIsStart(true);
        });
    }, [appUser, contestId]);

    return (
        <div className={cs('wrapper')}>
            {isStart ? (
                isEnd ? (
                    <div className={cs('content')}>Đã kết thúc</div>
                ) : (
                    <div className={cs('content')}>
                        Còn lại {minutes} phút : {seconds} giây
                    </div>
                )
            ) : contestStatus === 'ongoing' ? (
                <div className={cs('content')} onClick={handleStartContest}>
                    Bắt đầu thi
                </div>
            ) : (
                <div className={cs('content')} onClick={handleStartContest}>
                    Bắt đầu giả lập thi
                </div>
            )}
        </div>
    );
}

export default FixedCountDown;
