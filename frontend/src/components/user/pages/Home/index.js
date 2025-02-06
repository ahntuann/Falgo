import classNames from 'classnames/bind';

import style from './Home.module.scss';
import slider1 from '~/assets/images/slider/slider1.jpg';
import slider2 from '~/assets/images/slider/slider2.png';
import slider3 from '~/assets/images/slider/slider3.png';
import banner1 from '~/assets/images/contest/contest1.jpg';
import banner2 from '~/assets/images/contest/contest2.png';
import { ContestBrief, ProblemItem, SliderBanner } from '~/components/user/components';
import { useContext, useState } from 'react';
import AuthContext from '~/context/AuthContext';

const cs = classNames.bind(style);

function Home() {
    const sliders = [slider1, slider2, slider3];
    const problemDailyNames = ['Bài tập nổi bật', 'Bạn đang làm dở', 'Đã hoàn thành'];
    const contests = [
        {
            banner: banner1,
            title: 'ĐƯỜNG ĐUA LẬP TRÌNH 2024',
            totalPoint: 400,
            level: 'hard',
            endDate: '2025-02-15 18:00:00',
            dueTime: 90,
            numberRegister: 122,
        },
        {
            banner: banner2,
            title: 'CODE_WAR MID SCHOOL',
            totalPoint: 200,
            level: 'medium',
            endDate: '2025-02-10 18:00:00',
            dueTime: 60,
            numberRegister: 1221,
        },
    ];

    const { userRole } = useContext(AuthContext);

    const [problemDailyFocus, setProblemDailyFocus] = useState(0);

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
                    <div className={cs('problemDailyItem')}>
                        <ProblemItem
                            name={'Fibonacci Sum Version 1'}
                            point={100}
                            author={'ahntuann'}
                            numberSubmission={1000}
                            numberPass={122}
                        />
                        <ProblemItem
                            name={'Fibonacci Sum Version 1'}
                            point={100}
                            author={'ahntuann'}
                            numberSubmission={1000}
                            numberPass={122}
                        />
                        <ProblemItem
                            name={'Fibonacci Sum Version 1'}
                            point={100}
                            author={'ahntuann'}
                            numberSubmission={1000}
                            numberPass={122}
                        />
                        <ProblemItem
                            name={'Fibonacci Sum Version 1'}
                            point={100}
                            author={'ahntuann'}
                            numberSubmission={1000}
                            numberPass={122}
                        />
                        <ProblemItem
                            name={'Fibonacci Sum Version 1sdfhjdsjfhdjskfhdjk'}
                            point={100}
                            author={'ahntuann'}
                            numberSubmission={1000}
                            numberPass={122}
                        />
                    </div>
                </div>
            ) : null}

            <div className={cs('contestBrief', 'homeComponents')}>
                <div className={cs('category', 'contestBriefCategory')}>Cuộc thi lập trình</div>
                <div className={cs('contests')}>
                    <ContestBrief contest={contests.at(0)} />
                    <ContestBrief contest={contests.at(1)} />
                </div>
            </div>

            <div className={cs('footer')}></div>
        </div>
    );
}

export default Home;
