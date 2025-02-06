import classNames from 'classnames/bind';

import style from './ProblemItem.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle } from '@fortawesome/free-solid-svg-icons';

const cs = classNames.bind(style);

function ProblemItem({ name, point, author, numberSubmission, numberPass }) {
    return (
        <div className={cs('wrapper')}>
            <div className={cs('name')}>{name}</div>
            <div className={cs('point')}>{point}</div>
            <div className={cs('getInProblem')}>
                <FontAwesomeIcon icon={faPlayCircle} />
            </div>
            <div className={cs('author')}>{author}</div>

            <div className={cs('footer')}>
                <div className={cs('numberSubmission')}>
                    <span className={cs('numberSubmissionSpan')}>{numberSubmission}</span> lượt nộp
                    bài.
                </div>
                <div className={cs('numberPass')}>
                    <span className={cs('numberSubmissionSpan')}>
                        {(numberPass / numberSubmission) * 100}
                    </span>
                    %
                </div>
            </div>
        </div>
    );
}

export default ProblemItem;
