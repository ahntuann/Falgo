import classNames from 'classnames/bind';

import style from './CodeEditerAction.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowsRotate,
    faCaretDown,
    faCirclePlay,
    faHandPointer,
} from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import defaultCodes from '~/ultils/codeDefault';

import useCodeEditing from '~/hooks/useCodeEditing';
import { submitSolutionForAProblemAPI } from '~/apis';
import useAuth from '~/hooks/useAuth';

const cs = classNames.bind(style);

function CodeEditerAction() {
    const {
        isSubmitable,
        setIsSubmitable,
        codeText,
        setCodeText,
        programmingLanguages,
        languageId,
        setLanguageId,
        briefInfoProblem,
        setTestCase,
        setTestcaseAndStatus,
        setNotifyContent,
    } = useCodeEditing();
    const { appUser } = useAuth();

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

    //
    const handleSubmitSolution = (isTestCode) => {
        setTestcaseAndStatus(
            (prev) =>
                prev.map((_, i) => {
                    return {
                        name: `Kiểm thử ${i + 1}`,
                        status: i >= 3 ? 'lock' : 'inExecution',
                    };
                }),
            [],
        );

        let numOfSuccess = 0;

        submitSolutionForAProblemAPI(
            briefInfoProblem.problemId,
            appUser.id,
            codeText,
            programmingLanguages.at(languageId).programmingLanguageId,
            isTestCode,
        ).then((newTestCase) => {
            if (newTestCase === undefined) {
                alert('Hệ thống hiện không hỗ trợ ngôn ngữ này.');
                return;
            }

            setTestCase(newTestCase);
            setTestcaseAndStatus(
                newTestCase.map((testCase, index) => {
                    if (testCase.result === 'Success') numOfSuccess++;

                    return {
                        name: `Kiểm thử ${index + 1}`,
                        status:
                            index >= 3
                                ? 'lock'
                                : `${testCase.result === 'Success' ? 'success' : 'fail'}`,
                    };
                }),
            );

            if (isTestCode)
                if (numOfSuccess === 3) {
                    setNotifyContent('3/3 kiểm thử mẫu đã thành công. \n Bạn đã có thể nộp code!');
                    setIsSubmitable(true);
                } else
                    setNotifyContent(
                        `${numOfSuccess}/3 kiểm thử mẫu thành công. \n Vui lòng kiểm tra lại!`,
                    );
            else if (numOfSuccess === 10)
                setNotifyContent('10/10 kiểm thử đã thành công. \n Chúc mừng bạn lthao <3');
            else
                setNotifyContent(
                    `${numOfSuccess}/10 kiểm thử thành công. \n Vui lòng kiểm tra lại!`,
                );
        });
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
                <div className={cs('runCodeBtn')} onClick={() => handleSubmitSolution(true)}>
                    <FontAwesomeIcon className={cs('moreActionIcon')} icon={faCirclePlay} />
                    Chạy thử
                </div>
                <div
                    className={cs('submitBtn', {
                        active: isSubmitable,
                    })}
                    onClick={() => {
                        if (isSubmitable) handleSubmitSolution(false);
                    }}
                >
                    <FontAwesomeIcon className={cs('moreActionIcon')} icon={faHandPointer} />
                    Nộp bài
                </div>
            </div>
        </div>
    );
}

export default CodeEditerAction;
