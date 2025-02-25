import classNames from 'classnames/bind';

import style from './CodeEditerAction.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowsRotate,
    faCaretDown,
    faCirclePlay,
    faHandPointer,
} from '@fortawesome/free-solid-svg-icons';

const cs = classNames.bind(style);

function CodeEditerAction({ programmingLanguages }) {
    return (
        <div className={cs('wrapper')}>
            <div className={cs('programmingLanguage')}>
                <div className={cs('programmingLanguageName')}>
                    {programmingLanguages.length > 0 && programmingLanguages.at(4).language}
                </div>

                <FontAwesomeIcon className={cs('languageMoreIcon')} icon={faCaretDown} />
            </div>

            <div className={cs('moreAction')}>
                <div className={cs('setBackBtn')}>
                    <FontAwesomeIcon className={cs('moreActionIcon')} icon={faArrowsRotate} />
                    Cài đặt lại
                </div>
                <div className={cs('runCodeBtn')}>
                    <FontAwesomeIcon className={cs('moreActionIcon')} icon={faCirclePlay} />
                    Chạy thử
                </div>
                <div className={cs('submitBtn')}>
                    <FontAwesomeIcon className={cs('moreActionIcon')} icon={faHandPointer} />
                    Nộp bài
                </div>
            </div>
        </div>
    );
}

export default CodeEditerAction;
