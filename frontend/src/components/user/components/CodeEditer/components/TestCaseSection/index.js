import classNames from 'classnames/bind';
import style from './TestCaseSection.module.scss';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faClockFour,
    faCircleCheck,
    faCircleExclamation,
    faLock,
} from '@fortawesome/free-solid-svg-icons';
import useCodeEditing from '~/hooks/useCodeEditing';

const cs = classNames.bind(style);

function TestCaseSection() {
    const { testCase, testcaseAndStatus, notifyContent } = useCodeEditing();

    const [testcaseFocus, setTestcaseFocus] = useState(0);
    const [testCaseCur, setTestCaseCur] = useState([]);

    useEffect(() => {
        if (testCase.length > 0)
            setTestCaseCur(
                testCase.map((x) => {
                    return {
                        testCaseName: x.testCaseName,
                        input: x.input,
                        output: x.output,
                        timeLimit: x.problem !== undefined ? x.problem.timeLimit : x.timeLimit,
                        actualOuput: x?.actualOuput,
                        executionTime: x?.executionTime,
                        log: x?.log,
                        result: x?.result,
                    };
                }, []),
            );

        console.log(testCase);
    }, [testCase]);

    const getTestcaseIcon = (status) => {
        switch (status) {
            case 'lock':
                return <FontAwesomeIcon icon={faLock} />;
            case 'inExecution':
                return <FontAwesomeIcon icon={faClockFour} />;
            case 'fail':
                return <FontAwesomeIcon icon={faCircleExclamation} style={{ color: 'red' }} />;
            case 'success':
                return <FontAwesomeIcon icon={faCircleCheck} style={{ color: 'green' }} />;
            default:
                return null;
        }
    };

    return (
        <div className={cs('wrapper')}>
            <div className={cs('notify')}>{notifyContent}</div>

            <div className={cs('testcaseDetail')}>
                <div className={cs('testcaseList')}>
                    {testcaseAndStatus.map((testcase, i) => (
                        <div
                            className={cs('testcaseItem', {
                                active: testcaseFocus === i,
                                deactive: testcase.status === 'lock',
                            })}
                            key={i}
                            onClick={() => {
                                if (i < 3) setTestcaseFocus(i);
                            }}
                        >
                            <div className={cs('testcaseIcon')}>
                                {getTestcaseIcon(testcase.status)}
                            </div>
                            <div className={cs('testcaseName')}>{testcase.name}</div>
                        </div>
                    ))}
                </div>

                {testCaseCur.length > 0 && (
                    <div className={cs('testcaseItemDetail')}>
                        <div className={cs('itemDetailItem')}>
                            Đầu vào:{' '}
                            <div className={cs('itemDetailItemValue')}>
                                {testCaseCur.at(testcaseFocus).input}
                            </div>
                        </div>
                        <div className={cs('itemDetailItem')}>
                            Đầu ra mong đợi:
                            <div className={cs('itemDetailItemValue')}>
                                {testCaseCur.at(testcaseFocus).output}
                            </div>
                        </div>
                        <div className={cs('itemDetailItem')}>
                            Đầu ra thực tế:
                            <div className={cs('itemDetailItemValue')}>
                                {testCaseCur.at(testcaseFocus)?.actualOuput}
                            </div>
                        </div>
                        <div className={cs('itemDetailItem')}>
                            Giới hạn thời gian:
                            <div className={cs('itemDetailItemValue')}>
                                {testCaseCur.at(testcaseFocus).timeLimit}
                            </div>
                        </div>
                        <div className={cs('itemDetailItem')}>
                            Thời gian thực thi:
                            <div className={cs('itemDetailItemValue')}>
                                {testCaseCur.at(testcaseFocus)?.executionTime}
                            </div>
                        </div>
                        <div className={cs('itemDetailItem')}>
                            Kết quả:
                            <div className={cs('itemDetailItemValue')}>
                                {testCaseCur.at(testcaseFocus)?.result}
                            </div>
                        </div>
                        <div className={cs('itemDetailItem')}>
                            Chi tiết:
                            <div className={cs('itemDetailItemValue')}>
                                {testCaseCur.at(testcaseFocus)?.log}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TestCaseSection;
