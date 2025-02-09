import classNames from 'classnames/bind';

import style from './ContestBrief.module.scss';
import CountDown from '~/components/user/components/CountDown';
const cs = classNames.bind(style);

function ContestBrief({ contest }) {
    const { banner, title, totalPoint, level, endDate, dueTime, numRegis } = contest;

    return (
        <div className={cs('wrapper')}>
            <div className={cs('banner')}>
                <img className={cs('bannerImg')} alt="banner" src={banner} />
            </div>

            <div className={cs('info')}>
                <div className={cs('title')}>{title}</div>
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

            <div className={cs('register')}>Đăng ký ngay</div>
        </div>
    );
}

export default ContestBrief;
