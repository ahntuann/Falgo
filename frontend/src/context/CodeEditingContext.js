import { createContext, useEffect, useState } from 'react';
import { fetchAllProgrammingLanguageAPI } from '~/apis';
import defaultCodes from '~/ultils/codeDefault';

const CodeEditingContext = createContext(null);

export const CodeEditingProvider = ({ children, briefInfoProblem }) => {
    const [languageId, setLanguageId] = useState(0);
    const [programmingLanguages, setProgrammingLanguages] = useState([]);
    const [isSubmitable, setIsSubmitable] = useState(false);
    const [codeText, setCodeText] = useState('');
    const [language, setLanguage] = useState(null);

    useEffect(() => {
        if (programmingLanguages.length === 0) return;

        setLanguage(programmingLanguages.at(languageId).language);
    }, [programmingLanguages, languageId]);

    useEffect(() => {
        fetchAllProgrammingLanguageAPI().then((newProLanguages) => {
            setProgrammingLanguages(newProLanguages);
        });
    }, []);

    useEffect(() => {
        if (programmingLanguages.length === 0) return;

        setCodeText(defaultCodes[programmingLanguages.at(languageId).language]);
    }, [programmingLanguages, languageId]);

    useEffect(() => {
        setIsSubmitable(false);
    }, [briefInfoProblem.problemId]);

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
            }}
        >
            {children}
        </CodeEditingContext.Provider>
    );
};

export default CodeEditingContext;
