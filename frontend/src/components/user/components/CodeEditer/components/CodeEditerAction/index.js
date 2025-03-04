import classNames from 'classnames/bind';

import style from './CodeEditerAction.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowsRotate,
    faCaretDown,
    faCirclePlay,
    faHandPointer,
} from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import defaultCodes from '~/ultils/codeDefault';

import useCodeEditing from '~/hooks/useCodeEditing';

const cs = classNames.bind(style);

function CodeEditerAction() {
    const { isSubmitable, codeText, setCodeText, programmingLanguages, languageId, setLanguageId } =
        useCodeEditing();

    const [isShowProLangList, setIsShowProLangList] = useState(false);

    const handleSetBack = () => {
        const userConfirmed = window.confirm('Bạn có chắc muốn reset code không?');

        if (!userConfirmed) return;

        setCodeText(defaultCodes[programmingLanguages.at(languageId).language]);
    };

    const toggleProLangList = () => {
        setIsShowProLangList((prev) => !prev);
    };

    const handleChangeLanguage = (language, i) => {
        setLanguageId(i);
        setCodeText(defaultCodes[language.language]);
    };

    return (
        <div className={cs('wrapper')}>
            <div className={cs('programmingLanguage')} onClick={toggleProLangList}>
                <div className={cs('programmingLanguageName')}>
                    {programmingLanguages.length > 0 &&
                        programmingLanguages.at(languageId).language}
                </div>

                <FontAwesomeIcon className={cs('languageMoreIcon')} icon={faCaretDown} />

                <div className={cs('programmingLanguageList', { active: isShowProLangList })}>
                    {programmingLanguages.map((language, i) => (
                        <div
                            key={i}
                            className={cs('programmingLanguageItem')}
                            onClick={() => handleChangeLanguage(language, i)}
                        >
                            {language.language}
                        </div>
                    ))}
                </div>
            </div>

            <div className={cs('moreAction')}>
                <div className={cs('setBackBtn')} onClick={handleSetBack}>
                    <FontAwesomeIcon className={cs('moreActionIcon')} icon={faArrowsRotate} />
                    Cài đặt lại
                </div>
                <div className={cs('runCodeBtn')}>
                    <FontAwesomeIcon className={cs('moreActionIcon')} icon={faCirclePlay} />
                    Chạy thử
                </div>
                <div
                    className={cs('submitBtn', {
                        active: isSubmitable,
                    })}
                >
                    <FontAwesomeIcon className={cs('moreActionIcon')} icon={faHandPointer} />
                    Nộp bài
                </div>
            </div>
        </div>
    );
}

export default CodeEditerAction;
