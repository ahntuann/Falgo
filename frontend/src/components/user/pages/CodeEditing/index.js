import classNames from 'classnames/bind';

import style from './CodeEditing.module.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faCircleQuestion, faCode } from '@fortawesome/free-solid-svg-icons';
import { CodeEditer } from '~/components/user/components';
import { fetchProblemSolvingByIdAPI } from '~/apis';
import { useEffect, useState } from 'react';
import Chatbot from '~/components/user/components/ChatBot';
import { faNoteSticky } from '@fortawesome/free-regular-svg-icons';

const cs = classNames.bind(style);

function CodeEditing() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const briefInfoProblem = Object.fromEntries(searchParams.entries());

    const [typeOfTxt, setTypeOfTxt] = useState('code');

    const navigate = useNavigate();

    const contest = location.state || {};

    const [problem, setProblem] = useState(null);

    useEffect(() => {
        fetchProblemSolvingByIdAPI(briefInfoProblem.id).then((problem) => {
            setProblem(problem);
        });
    }, [briefInfoProblem.id]);

    return (
        <div className={cs('wrapper')}>
            <div className={cs('info')}>
                <div className={cs('problemInfo')}>
                    <FontAwesomeIcon
                        className={cs('problemInfoIcon')}
                        icon={faAngleLeft}
                        onClick={() => {
                            if (briefInfoProblem.contestId)
                                navigate(
                                    `/problems/${briefInfoProblem.id}?contestId=${briefInfoProblem.contestId}`,
                                    { state: contest },
                                );
                            else navigate(`/problems/${briefInfoProblem.id}`);
                        }}
                    />
                    {problem !== null && problem !== undefined && <div>{problem.title}</div>}
                    <FontAwesomeIcon className={cs('helpIcon')} icon={faCircleQuestion} />
                </div>
                <div className={cs('typeOfTxt')}>
                    <div
                        className={cs('code', { active: typeOfTxt === 'code' })}
                        onClick={() => setTypeOfTxt('code')}
                    >
                        <FontAwesomeIcon className={cs('typeIcon')} icon={faCode} /> Code
                    </div>
                    <div
                        className={cs('note', { active: typeOfTxt === 'note' })}
                        onClick={() => setTypeOfTxt('note')}
                    >
                        <FontAwesomeIcon className={cs('typeIcon')} icon={faNoteSticky} />
                        Note
                    </div>
                </div>
            </div>

            {problem !== null && problem !== undefined && (
                <CodeEditer
                    contestId={briefInfoProblem?.contestId}
                    briefInfoProblem={problem}
                    typeOfTxt={typeOfTxt}
                />
            )}

            {briefInfoProblem.contestId === undefined && <Chatbot />}
        </div>
    );
}

export default CodeEditing;
