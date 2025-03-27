import classNames from 'classnames/bind';
import style from './ContestDetail.module.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons';
import CountDown from '~/components/user/components/CountDown';
import ProblemContestList from '~/components/user/components/ProblemContestList';
import { useEffect, useState } from 'react';
import { fetchProblemHomePageAPI } from '~/apis';

const cs = classNames.bind(style);

function ContestDetail() {
    const location = useLocation();
    const contest = location.state || {};
    const navigate = useNavigate();

    const { contestId, banner, contestName, totalPoint, level, endDate, dueTime, numRegis } =
        contest;

    const [problems, setProblems] = useState([]);

    useEffect(() => {
        fetchProblemHomePageAPI({ mostAttempted: true, done: false, notDone: false }).then(
            (problems) => setProblems(problems),
        );
    }, [contestId]);

    return (
        <div className={cs('wrapper')}>
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

                <div className={cs('registerEndDate')}>
                    <CountDown classNames={cs('endDate')} endDate={endDate} />
                </div>
            </div>

            <ProblemContestList contestId={contestId} problems={problems} />
        </div>
    );
}

export default ContestDetail;
