import classNames from 'classnames/bind';

import style from './RankingContestLayout.module.scss';

const cs = classNames.bind(style);

function RankingContestLayout({ children }) {
    return <div className={cs('wrapper')}>{children}</div>;
}

export default RankingContestLayout;
