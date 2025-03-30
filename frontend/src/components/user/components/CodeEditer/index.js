import classNames from 'classnames/bind';

import style from './CodeEditer.module.scss';
import React from 'react';
import CodeEditerAction from '~/components/user/components/CodeEditer/components/CodeEditerAction';
import ResizablePanels from '~/components/user/components/CodeEditer/components/ResizablePanels';
import { CodeEditingProvider } from '~/context/CodeEditingContext';

const cs = classNames.bind(style);

const MemoizedCodeEditerAction = React.memo(CodeEditerAction);

function CodeEditer({ briefInfoProblem, contestId, typeOfTxt }) {
    return (
        <CodeEditingProvider briefInfoProblem={briefInfoProblem} contestId={contestId}>
            <div className={cs('wrapper')}>
                <div className={cs('actions')}>
                    <MemoizedCodeEditerAction />
                </div>

                <ResizablePanels typeOfTxt={typeOfTxt} />
            </div>
        </CodeEditingProvider>
    );
}

export default CodeEditer;
