import classNames from 'classnames/bind';

import style from './Home.module.scss';
import slider1 from '~/assets/images/slider/slider1.jpg';
import slider2 from '~/assets/images/slider/slider2.png';
import slider3 from '~/assets/images/slider/slider3.png';
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
    const sliders = [slider1, slider2, slider3];
    const problemDailyNames = ['Bài tập nổi bật', 'Bạn đang làm dở', 'Đã hoàn thành'];
    const { appUser, userRole, logout } = useContext(AuthContext);

    const [problemDailyFocus, setProblemDailyFocus] = useState(0);
    const [problems, setProblems] = useState([]);
    const [contests, setContests] = useState([]);
    const [skills, setSkills] = useState([]);

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
        fetchContestBriefAPI({ isNewest: true, pageSize: 2 }).then((newContests) =>
            setContests(newContests),
        );
    }, []);

    // fetch all programming language
    useEffect(() => {
        fetchAllProgrammingLanguageAPI().then((x) => setSkills(x));
    }, []);

    return (
        <div className={cs('wrapper')}>
            <div className={cs('slider')}>
                <SliderBanner sliders={sliders} />
            </div>

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
            <div onClick={() => logout()}>logout</div>

            <div className={cs('contestBrief', 'homeComponents')}>
                <div className={cs('category', 'contestBriefCategory')}>Cuộc thi lập trình</div>
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
