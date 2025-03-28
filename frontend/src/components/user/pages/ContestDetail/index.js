import classNames from 'classnames/bind';
import style from './ContestDetail.module.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons';
import ProblemContestList from '~/components/user/components/ProblemContestList';
import { useContext, useEffect, useState } from 'react';
import { GetContestRegistionByUserIdAndContestIdAPI, fetchProblemHomePageAPI } from '~/apis';
import FixedCountDown from '~/components/user/components/FixedCountDown';
import AuthContext from '~/context/AuthContext';
import AutoPopup from '~/ultils/AutoPopup';

const cs = classNames.bind(style);

function ContestDetail() {
    const location = useLocation();
    const contest = location.state || {};
    const navigate = useNavigate();

    const { contestId, contestName, totalPoint, level, dueTime, contestStatus } = contest;

    const [problems, setProblems] = useState([]);
    const { appUser } = useContext(AuthContext);
    const [isStart, setIsStart] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [isEnd, setIsEnd] = useState(false);

    useEffect(() => {
        GetContestRegistionByUserIdAndContestIdAPI(appUser.id, contestId).then((regis) => {
            setIsStart(regis.isStart);
            setStartDate(regis.startAt);
        });
    }, [appUser, contestId, isStart]);

    useEffect(() => {
        fetchProblemHomePageAPI({ mostAttempted: true, done: false, notDone: false }).then(
            (problems) => setProblems(problems),
        );
    }, [contestId]);

    useEffect(() => {
        if (startDate == null) return;

        const parsedStartDate = new Date(startDate);

        const endTime = new Date(parsedStartDate.getTime() + dueTime * 60000);
        const now = new Date();

        if (now >= endTime) {
            alert('Hết giờ');
            setIsEnd(true);
        }
    }, [startDate, dueTime]);

    return (
        <div className={cs('wrapper')}>
            {contestStatus === 'over' && <AutoPopup />}

            <div className={cs('backToContest')} onClick={() => navigate(`/contest`)}>
                <FontAwesomeIcon icon={faCaretLeft} className={cs('backIcon')} />
                Trở lại danh sách kỳ thi
            </div>

            <div className={cs('info')}>
                <div className={cs('contestName')}>{contestName}</div>
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
            </div>

            <ProblemContestList
                contestId={contestId}
                problems={problems}
                isStart={isStart}
                isEnd={isEnd}
            />

            <FixedCountDown
                contest={contest}
                isStart={isStart}
                setIsStart={setIsStart}
                startDate={startDate}
                isEnd={isEnd}
            />
        </div>
    );
}

export default ContestDetail;
