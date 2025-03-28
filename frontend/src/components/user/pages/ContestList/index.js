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

    const [currentPageOngoing, setCurrentPageOngoing] = useState(1);
    const [currentPageOver, setCurrentPageOver] = useState(1);

    // Ongoing contest pagination
    const totalPagesOngoing = Math.ceil(ongoingContests?.length / ITEMS_PER_PAGE);
    const displayedOngoingContests = ongoingContests?.slice(
        (currentPageOngoing - 1) * ITEMS_PER_PAGE,
        currentPageOngoing * ITEMS_PER_PAGE,
    );

    // Over contest pagination
    const totalPagesOver = Math.ceil(overContest?.length / ITEMS_PER_PAGE);
    const displayedOverContests = overContest?.slice(
        (currentPageOver - 1) * ITEMS_PER_PAGE,
        currentPageOver * ITEMS_PER_PAGE,
    );

    const handlePageChangeOngoing = (newPage) => {
        if (newPage >= 1 && newPage <= totalPagesOngoing) {
            setCurrentPageOngoing(newPage);
        }
    };

    const handlePageChangeOver = (newPage) => {
        if (newPage >= 1 && newPage <= totalPagesOver) {
            setCurrentPageOver(newPage);
        }
    };

    const getPageNumbers = (totalPages, currentPage) => {
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
            {/* Ongoing Contest */}
            <div className={cs('ongoingContest', 'contests')}>
                <div className={cs('category')}>Các kỳ thi đang diễn ra</div>
                <div className={cs('contestList')}>
                    {displayedOngoingContests?.length > 0 ? (
                        displayedOngoingContests.map((contest, i) => (
                            <ContestBrief key={i} contest={contest} contestStatus={'ongoing'} />
                        ))
                    ) : (
                        <div className={cs('noContestNoti')}>
                            Hiện tại chưa có contest nào đang diễn ra
                        </div>
                    )}
                </div>
            </div>

            {totalPagesOngoing > 1 && (
                <div className={cs('pagination')}>
                    <button
                        className={cs('pageButton')}
                        disabled={currentPageOngoing === 1}
                        onClick={() => handlePageChangeOngoing(currentPageOngoing - 1)}
                    >
                        «
                    </button>

                    {getPageNumbers(totalPagesOngoing, currentPageOngoing).map((num, i) =>
                        num === '...' ? (
                            <span key={i} className="dots">
                                ...
                            </span>
                        ) : (
                            <button
                                key={i}
                                className={cs('pageButton', { active: currentPageOngoing === num })}
                                onClick={() => handlePageChangeOngoing(num)}
                            >
                                {num}
                            </button>
                        ),
                    )}

                    <button
                        className={cs('pageButton')}
                        disabled={currentPageOngoing === totalPagesOngoing}
                        onClick={() => handlePageChangeOngoing(currentPageOngoing + 1)}
                    >
                        »
                    </button>
                </div>
            )}

            {/* Over Contest */}
            <div className={cs('overContest', 'contests')}>
                <div className={cs('category')}>Các kỳ thi đã qua</div>
                <div className={cs('contestList')}>
                    {displayedOverContests?.length > 0 ? (
                        displayedOverContests.map((contest, i) => (
                            <ContestBrief key={i} contest={contest} contestStatus={'over'} />
                        ))
                    ) : (
                        <div className={cs('noContestNoti')}>
                            Hiện tại chưa có contest nào đã qua
                        </div>
                    )}
                </div>
            </div>

            {totalPagesOver > 1 && (
                <div className={cs('pagination')}>
                    <button
                        className={cs('pageButton')}
                        disabled={currentPageOver === 1}
                        onClick={() => handlePageChangeOver(currentPageOver - 1)}
                    >
                        «
                    </button>

                    {getPageNumbers(totalPagesOver, currentPageOver).map((num, i) =>
                        num === '...' ? (
                            <span key={i} className="dots">
                                ...
                            </span>
                        ) : (
                            <button
                                key={i}
                                className={cs('pageButton', { active: currentPageOver === num })}
                                onClick={() => handlePageChangeOver(num)}
                            >
                                {num}
                            </button>
                        ),
                    )}

                    <button
                        className={cs('pageButton')}
                        disabled={currentPageOver === totalPagesOver}
                        onClick={() => handlePageChangeOver(currentPageOver + 1)}
                    >
                        »
                    </button>
                </div>
            )}
        </div>
    );
}

export default ContestList;
