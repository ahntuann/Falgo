import classNames from 'classnames/bind';

import style from './Home.module.scss';
import { ContestBrief, ProblemItem, SliderBanner } from '~/components/user/components';
import { useContext, useEffect, useState } from 'react';
import AuthContext from '~/context/AuthContext';
import {
    fetchAllProgrammingLanguageAPI,
    fetchContestBriefAPI,
    fetchProblemHomePageAPI,
} from '~/apis';
import SkillItem from '~/components/user/components/SkillItem';

const cs = classNames.bind(style);

function Home() {
    const problemDailyNames = ['Bài tập nổi bật', 'Bạn đang làm dở', 'Đã hoàn thành'];
    const { appUser, userRole } = useContext(AuthContext);

    const [problemDailyFocus, setProblemDailyFocus] = useState(0);
    const [problems, setProblems] = useState([]);
    const [contests, setContests] = useState([]);
    const [skills, setSkills] = useState([]);
    const [slider, setSlider] = useState([]);

    // fetch Problem HomePage daily
    useEffect(() => {
        if (userRole === 'guest') return;

        const kindOfProblem = {
            mostAttempted: problemDailyFocus === 0,
            notDone: problemDailyFocus === 1,
            done: problemDailyFocus === 2,
            userId: appUser.id,
        };

        fetchProblemHomePageAPI(kindOfProblem).then((newProblems) => setProblems(newProblems));
    }, [userRole, problemDailyFocus]);

    // fetch Contest Brief
    useEffect(() => {
        fetchContestBriefAPI({ isNewest: true, pageSize: 2 }).then((newContests) => {
            setContests(newContests);

            setSlider(newContests);
        });
    }, []);

    // fetch all programming language
    useEffect(() => {
        fetchAllProgrammingLanguageAPI().then((x) => setSkills(x));
    }, []);

    return (
        <div className={cs('wrapper')}>
            {slider.length > 0 && (
                <div className={cs('slider')}>
                    <SliderBanner sliders={slider} />
                </div>
            )}

            {userRole === 'user' ? (
                <div className={cs('problemDaily', 'homeComponents')}>
                    <div className={cs('problemDailyNames')}>
                        {problemDailyNames.map((problem, i) => (
                            <button
                                key={i}
                                className={cs('problemDailyName', 'category', {
                                    active: i === problemDailyFocus,
                                })}
                                onClick={() => setProblemDailyFocus(i)}
                            >
                                {problem}
                            </button>
                        ))}
                    </div>

                    {problems !== undefined && problems !== null ? (
                        <div className={cs('problemDailyItem')}>
                            {problems.map((problem, i) => (
                                <ProblemItem
                                    key={i}
                                    detail={problem.detail}
                                    itemNumber={i}
                                    isMostAttempted={problemDailyFocus === 0}
                                    isDoned={problemDailyFocus === 2}
                                    classNames={i !== 0 && cs('notFirst')}
                                    name={problem.title}
                                    point={problem.totalPoint}
                                    pointAchive={problem.point}
                                    status={problem.status}
                                    author={problem.author}
                                    numberSubmission={problem.timeAttempted}
                                    numberPass={problem.numSucces}
                                />
                            ))}
                        </div>
                    ) : (
                        <div>Chưa có bài tập nào</div>
                    )}
                </div>
            ) : null}

            <div className={cs('contestBrief', 'homeComponents')}>
                <div className={cs('category', 'contestBriefCategory')}>
                    <div className={cs('contestBriefCategoryName')}>Cuộc thi lập trình</div>
                    {/* <div className={cs('contestBriefCategoryMore')}>Xem thêm</div> */}
                </div>
                <div className={cs('contests')}>
                    {contests !== undefined &&
                        contests.map((contest, i) => <ContestBrief key={i} contest={contest} />)}
                </div>
            </div>

            {userRole === 'user' && (
                <div className={cs('yourSkill', 'homeComponents')}>
                    <div className={cs('category', 'yourSkillCategory')}>Kỹ năng của bạn</div>

                    <div className={cs('skillWrapper')}>
                        {skills !== undefined &&
                            skills.map((skill, i) => (
                                <SkillItem key={i} skill={skill} userId={appUser.id} />
                            ))}
                    </div>
                </div>
            )}

            <div className={cs('footer')}></div>
        </div>
    );
}

export default Home;
