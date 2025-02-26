import classNames from 'classnames/bind';

import style from './CodeEditer.module.scss';
import React, { useEffect, useState } from 'react';
import { fetchAllProgrammingLanguageAPI } from '~/apis';
import CodeEditerAction from '~/components/user/components/CodeEditer/components/CodeEditerAction';
import ResizablePanels from '~/components/user/components/CodeEditer/components/ResizablePanels';
import defaultCodes from '~/ultils/codeDefault';

const cs = classNames.bind(style);

const MemoizedCodeEditerAction = React.memo(CodeEditerAction);

function CodeEditer({ briefInfoProblem }) {
    const [programmingLanguages, setProgrammingLanguages] = useState([]);
    const [isSubmitable, setIsSubmitable] = useState(false);
    const [languageId, setLanguageId] = useState(0);
    const [codeText, setCodeText] = useState('');

    useEffect(() => {
        setIsSubmitable(false);
    }, [briefInfoProblem.id]);

    useEffect(() => {
        fetchAllProgrammingLanguageAPI().then((newProLanguages) => {
            setProgrammingLanguages(newProLanguages);
        });
    }, []);

    useEffect(() => {
        if (programmingLanguages.length === 0) return;

        console.log(programmingLanguages);

        setCodeText(defaultCodes[programmingLanguages.at(languageId).language]);
    }, [programmingLanguages]);

    return (
        <div className={cs('wrapper')}>
            <div className={cs('actions')}>
                <MemoizedCodeEditerAction
                    programmingLanguages={programmingLanguages}
                    isSubmitable={isSubmitable}
                    codeText={codeText}
                    languageFocus={languageId}
                    setLanguageFocus={setLanguageId}
                    setCodeText={setCodeText}
                />
            </div>

            {programmingLanguages.length > 0 && (
                <ResizablePanels
                    codeText={codeText}
                    setCodeText={setCodeText}
                    language={programmingLanguages.at(languageId).language}
                />
            )}
        </div>
    );
}

export default CodeEditer;
