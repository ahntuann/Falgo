import { createContext, useEffect, useRef, useState } from 'react';
import { fetchAllProgrammingLanguageAPI, fetchAllTestCaseForAProblemAPI } from '~/apis';
import defaultCodes from '~/ultils/codeDefault';
import notifyTestcase from '~/ultils/notifyTestcase';

const CodeEditingContext = createContext(null);

export const CodeEditingProvider = ({ children, briefInfoProblem, contestId }) => {
    const savedDraft = JSON.parse(localStorage.getItem('Save Draft'));
    console.log('context');
    console.log(briefInfoProblem);

    const [languageId, setLanguageId] = useState(
        savedDraft !== null && briefInfoProblem.problemId === savedDraft.problemId
            ? savedDraft.programmingLanguage
            : 0,
    );
    const [isSubmitable, setIsSubmitable] = useState(false);
    const [codeText, setCodeText] = useState('');
    const [language, setLanguage] = useState(null);
    const [programmingLanguages, setProgrammingLanguages] = useState([]);
    const [testCase, setTestCase] = useState([]);
    const [testcaseAndStatus, setTestcaseAndStatus] = useState(
        Array.from({ length: 10 }, (_, index) => ({
            name: `Kiểm thử ${index + 1}`,
            status: index >= 3 ? 'lock' : '',
        })),
    );
    const [notifyContent, setNotifyContent] = useState(notifyTestcase['needToTest']);

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

        if (
            savedDraft !== null &&
            briefInfoProblem.problemId === savedDraft.problemId &&
            languageId === savedDraft.programmingLanguage
        )
            setCodeText(savedDraft.codeText);
        else setCodeText(defaultCodes[programmingLanguages.at(languageId).language]);
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
    }, [briefInfoProblem.problemId]);

    //
    const latestData = useRef({});

    useEffect(() => {
        latestData.current = {
            problemId: briefInfoProblem.problemId,
            codeText,
            programmingLanguage: languageId,
        };
    }, [briefInfoProblem, codeText, languageId]);

    useEffect(() => {
        const setSaveDraft = setInterval(() => {
            localStorage.setItem('Save Draft', JSON.stringify(latestData.current));
        }, 3000);

        return () => {
            clearInterval(setSaveDraft);
        };
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
                testcaseAndStatus,
                setTestcaseAndStatus,
                notifyContent,
                setNotifyContent,
                contestId,
            }}
        >
            {children}
        </CodeEditingContext.Provider>
    );
};

export default CodeEditingContext;
