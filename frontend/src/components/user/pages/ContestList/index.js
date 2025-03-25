import classNames from 'classnames/bind';

import style from './ContestList.module.scss';
import { useEffect, useState } from 'react';
import { ContestBrief } from '~/components/user/components';
import { fetchAllContest } from '~/apis';

const cs = classNames.bind(style);

const ITEMS_PER_PAGE = 2;
const MAX_PAGE_DISPLAY = 5;

function ContestList() {
    const [ongoingContests, setOngoingContests] = useState([]);
    const [overContest, setOverContest] = useState([]);

    useEffect(() => {
        fetchAllContest('upcomming').then((contest) => setOngoingContests(contest));
    }, []);

    useEffect(() => {
        fetchAllContest('over').then((contest) => setOverContest(contest));
    }, []);

    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(ongoingContests.length / ITEMS_PER_PAGE);
    const displayedContests = ongoingContests.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
    );

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const getPageNumbers = () => {
        if (totalPages <= MAX_PAGE_DISPLAY) {
            return [...Array(totalPages)].map((_, i) => i + 1);
        }

        const start = Math.max(1, currentPage - 2);
        const end = Math.min(totalPages, start + MAX_PAGE_DISPLAY - 1);
        const pages = [...Array(end - start + 1)].map((_, i) => start + i);

        if (start > 1) pages.unshift(1, '...');
        if (end < totalPages) pages.push('...', totalPages);

        return pages;
    };

    return (
        <div className={cs('wrapper')}>
            <div className={cs('ongoingContest', 'contests')}>
                <div className={cs('category')}>Các kỳ thi đang diễn ra</div>
                <div className={cs('contestList')}>
                    {displayedContests.length > 0 ? (
                        displayedContests.map((contest, i) => (
                            <ContestBrief key={i} contest={contest} />
                        ))
                    ) : (
                        <div className={cs('noContestNoti')}>
                            Hiện tại chưa có contest nào đang diễn ra
                        </div>
                    )}
                </div>
            </div>
            {totalPages > 1 && (
                <div className={cs('pagination')}>
                    <button
                        className={cs('pageButton')}
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                    >
                        «
                    </button>

                    {getPageNumbers().map((num, i) =>
                        num === '...' ? (
                            <span key={i} className="dots">
                                ...
                            </span>
                        ) : (
                            <button
                                key={i}
                                className={cs('pageButton', { active: currentPage === num })}
                                onClick={() => handlePageChange(num)}
                            >
                                {num}
                            </button>
                        ),
                    )}

                    <button
                        className={cs('pageButton')}
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                    >
                        »
                    </button>
                </div>
            )}

            <div className={cs('overContest', 'contests')}>
                <div className={cs('category')}>Các kỳ thi đã qua</div>
                <div className={cs('contestList')}>
                    {overContest.length > 0 ? (
                        overContest.map((contest, i) => <ContestBrief key={i} contest={contest} />)
                    ) : (
                        <div className={cs('noContestNoti')}>
                            Hiện tại chưa có contest nào đã qua
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ContestList;
