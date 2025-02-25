import classNames from 'classnames/bind';

import style from './CodeEditer.module.scss';
import { useEffect, useState } from 'react';
import { fetchAllProgrammingLanguageAPI } from '~/apis';
import CodeEditerAction from '~/components/user/components/CodeEditer/components/CodeEditerAction';

const cs = classNames.bind(style);

function CodeEditer({ briefInfoProblem }) {
    const [programmingLanguages, setProgrammingLanguages] = useState([]);

    useEffect(() => {
        fetchAllProgrammingLanguageAPI().then((newProLanguages) => {
            setProgrammingLanguages(newProLanguages);
        });
    }, []);

    useEffect(() => {
        console.log(programmingLanguages);
    }, [programmingLanguages]);

    return (
        <div className={cs('wrapper')}>
            <div className={cs('actions')}>
                <CodeEditerAction programmingLanguages={programmingLanguages} />
            </div>
        </div>
    );
}

export default CodeEditer;
