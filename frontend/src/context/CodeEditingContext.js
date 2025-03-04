import { createContext, useEffect, useState } from 'react';
import { fetchAllProgrammingLanguageAPI, fetchAllTestCaseForAProblemAPI } from '~/apis';
import defaultCodes from '~/ultils/codeDefault';

const CodeEditingContext = createContext(null);

export const CodeEditingProvider = ({ children, briefInfoProblem }) => {
    const [languageId, setLanguageId] = useState(0);
    const [isSubmitable, setIsSubmitable] = useState(false);
    const [codeText, setCodeText] = useState('');
    const [language, setLanguage] = useState(null);
    const [programmingLanguages, setProgrammingLanguages] = useState([]);
    const [testCase, setTestCase] = useState([]);

    // language
    useEffect(() => {
        if (programmingLanguages.length === 0) return;

        setLanguage(programmingLanguages.at(languageId).language);
    }, [programmingLanguages, languageId]);

    // programmingLanguages
    useEffect(() => {
        fetchAllProgrammingLanguageAPI().then((newProLanguages) => {
            setProgrammingLanguages(newProLanguages);
        });
    }, []);

    // codeText
    useEffect(() => {
        if (programmingLanguages.length === 0) return;

        setCodeText(defaultCodes[programmingLanguages.at(languageId).language]);
    }, [programmingLanguages, languageId]);

    // isSubmitable
    useEffect(() => {
        setIsSubmitable(false);
    }, [briefInfoProblem.problemId]);

    // testCase
    useEffect(() => {
        fetchAllTestCaseForAProblemAPI(briefInfoProblem.problemId).then((newTestCases) => {
            setTestCase(newTestCases);
        });
    }, []);

    return (
        <CodeEditingContext.Provider
            value={{
                isSubmitable,
                setIsSubmitable,
                codeText,
                setCodeText,
                programmingLanguages,
                languageId,
                setLanguageId,
                language,
                setLanguage,
                testCase,
                setTestCase,
                briefInfoProblem,
            }}
        >
            {children}
        </CodeEditingContext.Provider>
    );
};

export default CodeEditingContext;
