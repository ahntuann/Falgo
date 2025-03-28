import classNames from 'classnames/bind';

import style from './CodeEditing.module.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import { CodeEditer } from '~/components/user/components';
import { fetchProblemSolvingByIdAPI } from '~/apis';
import { useEffect, useState } from 'react';
import Chatbot from '~/components/user/components/ChatBot';

const cs = classNames.bind(style);

function CodeEditing() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const briefInfoProblem = Object.fromEntries(searchParams.entries());

    console.log(briefInfoProblem);

    const navigate = useNavigate();

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
                        onClick={() => navigate(`/problems/${briefInfoProblem.id}`)}
                    />
                    {problem !== null && problem !== undefined && <div>{problem.title}</div>}
                    <FontAwesomeIcon className={cs('helpIcon')} icon={faCircleQuestion} />
                </div>
            </div>

            {problem !== null && problem !== undefined && (
                <CodeEditer contestId={briefInfoProblem?.contestId} briefInfoProblem={problem} />
            )}

            {briefInfoProblem.contestId === undefined && <Chatbot />}
        </div>
    );
}

export default CodeEditing;
