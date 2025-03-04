import classNames from 'classnames/bind';
import style from './TestCaseSection.module.scss';
import notifyTestcase from '~/ultils/notifyTestcase';
import { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClockFour, faCircleCheck, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import CodeEditingContext from '~/context/CodeEditingContext';

const cs = classNames.bind(style);

function TestCaseSection() {
    const { testCase } = useContext(CodeEditingContext);

    const [notifyContent, setNotifyContent] = useState(notifyTestcase['needToTest']);
    const [testcaseAndStatus, setTestcaseAndStatus] = useState(
        Array.from({ length: 10 }, (_, index) => ({
            name: `Kiểm thử ${index + 1}`,
            status: 'notYet',
        })),
    );
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
            case 'notYet':
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
                            className={cs('testcaseItem', { active: testcaseFocus === i })}
                            key={i}
                            onClick={() => setTestcaseFocus(i)}
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
                                {testCaseCur.at(testcaseFocus)?.executionTime} ms
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
