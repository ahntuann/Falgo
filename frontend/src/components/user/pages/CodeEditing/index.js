import classNames from 'classnames/bind';

import style from './CodeEditing.module.scss';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import { CodeEditer } from '~/components/user/components';

const cs = classNames.bind(style);

function CodeEditing() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const briefInfoProblem = Object.fromEntries(searchParams.entries());

    return (
        <div className={cs('wrapper')}>
            <div className={cs('info')}>
                <div className={cs('problemInfo')}>
                    <FontAwesomeIcon className={cs('problemInfoIcon')} icon={faAngleLeft} />
                    <div>{briefInfoProblem.name}</div>
                    <FontAwesomeIcon className={cs('helpIcon')} icon={faCircleQuestion} />
                </div>
            </div>

            <CodeEditer briefInfoProblem={briefInfoProblem} />
        </div>
    );
}

export default CodeEditing;
