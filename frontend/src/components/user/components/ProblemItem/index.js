import classNames from 'classnames/bind';

import style from './ProblemItem.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle } from '@fortawesome/free-solid-svg-icons';
import TippyHeadless from '~/components/user/components/TippyHeadless';
import { Link } from 'react-router-dom';

const cs = classNames.bind(style);

function ProblemItem({
    detail,
    problemId,
    name,
    point,
    pointAchive,
    status,
    author,
    numberSubmission,
    numberPass,
    isMostAttempted,
    isDoned,
    classNames,
    itemNumber,
}) {
    const errorLog = ['Runtime Error', 'Wrong Answer', 'Compilation Error'];
    const warningLog = ['Time Limit Exceeded', 'Partial Correct'];
    const successLog = ['Accepted'];

    return (
        <TippyHeadless
            customClass={cs('tippy')}
            content={detail}
            placement={itemNumber !== 0 ? 'left' : 'right'}
        >
            <div className={cs('wrapper', classNames)}>
                <div className={cs('name')}>{name}</div>
                <div className={cs('point')}>
                    {!isMostAttempted && !isDoned && (
                        <span className={cs('pointAchive')}>{pointAchive} / </span>
                    )}
                    {isDoned && <span className={cs('pointAchive')}>{point} / </span>}
                    {point}
                </div>
                <div className={cs('getInProblem')}>
                    <Link to={`/problems/${problemId}`}>
                        <FontAwesomeIcon icon={faPlayCircle} />
                    </Link>
                </div>
                <div className={cs('author')}>{author}</div>

                {isMostAttempted ? (
                    <div className={cs('footer')}>
                        <div className={cs('numberSubmission')}>
                            <span className={cs('numberSubmissionSpan')}>{numberSubmission}</span>{' '}
                            lượt nộp bài.
                        </div>
                        <div className={cs('numberPass')}>
                            <span className={cs('numberSubmissionSpan')}>
                                {((numberPass / numberSubmission) * 100).toFixed(2)}
                            </span>
                            %
                        </div>
                    </div>
                ) : (
                    <div className={cs('footer')}>
                        <div
                            className={cs('status', {
                                error: errorLog.includes(status),
                                warning: warningLog.includes(status),
                                success: successLog.includes(status),
                            })}
                        >
                            {status}
                        </div>
                    </div>
                )}
            </div>
        </TippyHeadless>
    );
}

export default ProblemItem;
