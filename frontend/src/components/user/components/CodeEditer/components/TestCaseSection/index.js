import classNames from 'classnames/bind';
import style from './TestCaseSection.module.scss';
import notifyTestcase from '~/ultils/notifyTestcase';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClockFour, faCircleCheck, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

const cs = classNames.bind(style);

const fakeTestcase = [
    {
        testCaseId: '1',
        problemId: '101',
        testCaseName: 'Test 1',
        input: '5 10',
        output: '2891738923812\\n123128371283\\n128937128938ưesdkjfhffffkaksdjaskdjasdjasdjasdaksdjaklsdjaksdjasdjaklsdjalkdjaskdjaksdjaksdjaksdjakdjakdjakdjlaksjdaksjdakjdakldjalkdjaklsjdlkasjdklasjdkldjaklsjdkalsjdaklsdjaksldjakljdaklsdjaklsdjaklsjdaksdjaksdjaklsdjaksdjaklsdjaklsdjaklsdjaklsdjaklsdjaskldjaskldjaskldjasljkdaklsdjaksjdklajdaklsdjaklsdjaklsdjaklsjdaklsdjaklsdjaklsdjksaaklsjdaklsdjabcdefghpqlmnefgh',
    },
    {
        testCaseId: '2',
        problemId: '101',
        testCaseName: 'Test 2',
        input: '8 2',
        output: '10',
    },
    {
        testCaseId: '3',
        problemId: '102',
        testCaseName: 'Test 3',
        input: '20 30',
        output: '50',
    },
    {
        testCaseId: '4',
        problemId: '102',
        testCaseName: 'Test 4',
        input: '3 7',
        output: '10',
    },
    {
        testCaseId: '5',
        problemId: '103',
        testCaseName: 'Test 5',
        input: '15 25',
        output: '40',
    },
    {
        testCaseId: '6',
        problemId: '103',
        testCaseName: 'Test 6',
        input: '100 200',
        output: '300',
    },
    {
        testCaseId: '7',
        problemId: '104',
        testCaseName: 'Test 7',
        input: '50 50',
        output: '100',
    },
    {
        testCaseId: '8',
        problemId: '104',
        testCaseName: 'Test 8',
        input: '12 18',
        output: '30',
    },
    {
        testCaseId: '9',
        problemId: '105',
        testCaseName: 'Test 9',
        input: '40 60',
        output: '100',
    },
    {
        testCaseId: '10',
        problemId: '105',
        testCaseName: 'Test 10',
        input: '90 10',
        output: '100',
    },
];

function TestCaseSection() {
    const [notifyContent, setNotifyContent] = useState(notifyTestcase['needToTest']);
    const [testcaseAndStatus, setTestcaseAndStatus] = useState(
        Array.from({ length: 10 }, (_, index) => ({
            name: `Kiểm thử ${index + 1}`,
            status: 'notYet',
        })),
    );
    const [testcaseFocus, setTestcaseFocus] = useState(0);
    const [testCase, setTestCase] = useState(fakeTestcase);

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

                <div className={cs('testcaseItemDetail')}>
                    <div className={cs('itemDetailItem')}>
                        Đầu vào:{' '}
                        <div className={cs('itemDetailItemValue')}>
                            {testCase.at(testcaseFocus).input}
                        </div>
                    </div>
                    <div className={cs('itemDetailItem')}>
                        Đầu ra mong đợi:
                        <div className={cs('itemDetailItemValue')}>
                            {testCase.at(testcaseFocus).output}
                        </div>
                    </div>
                    <div className={cs('itemDetailItem')}>Đầu ra thực tế:</div>
                    <div className={cs('itemDetailItem')}>Giới hạn thời gian:</div>
                    <div className={cs('itemDetailItem')}>Thời gian thực thi:</div>
                </div>
            </div>
        </div>
    );
}

export default TestCaseSection;
