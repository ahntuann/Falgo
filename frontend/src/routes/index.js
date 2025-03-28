import {
    Home,
    ProblemList,
    Profile,
    Blog,
    DetailBlog,
    BlogUpdate,
    UserBlog,
    CreateBlog,
    CodeEditing,
    ProblemDetail,
    ForgotPassword,
    SubmissionList,
    UpdateProfile,
    UserProfileBlog,
    UserSubmissions,
    UserContest,
    ContestList,
    SubmissionHistory,
    Ranking,
    PublicProfile,
    BlogBookMark,
    ContestRanking,
} from '~/components/user/pages';
import { AdminLogin } from '~/components/admin/pages';
import {
    DefaultLayout,
    AdminLoginLayout,
    CodeEditingLayout,
    RankingContestLayout,
} from '~/layouts';
import ContestDetail from '~/components/user/pages/ContestDetail';
import QA from '~/components/user/pages/Q&A';

const routes = [
    {
        component: Home,
        path: '/',
        layout: DefaultLayout,
        role: ['user', 'guest'],
    },
    {
        component: Profile,
        path: '/profile',
        layout: DefaultLayout,
        role: ['user'],
    },
    {
        component: ProblemList,
        path: '/problems',
        layout: DefaultLayout,
        role: ['user', 'guest'],
    },
    {
        component: ProblemDetail,
        path: '/problems/:problemId',
        layout: DefaultLayout,
        role: ['user', 'guest'],
    },
    {
        component: SubmissionList,
        path: '/submissions/:problemId',
        layout: DefaultLayout,
        role: ['user', 'guest'],
    },
    {
        component: Blog,
        path: '/Blog',
        layout: DefaultLayout,
        role: ['user', 'guest', 'admin'],
    },

    {
        component: AdminLogin,
        path: '/adminLogin',
        layout: AdminLoginLayout,
        role: ['admin', 'guest'],
    },
    {
        component: DetailBlog,
        path: '/DetailBlog',
        layout: DefaultLayout,
        role: ['user', 'guest', 'admin'],
    },
    {
        component: UserBlog,
        path: '/UserBlog',
        layout: DefaultLayout,
        role: ['user'],
    },
    {
        component: BlogUpdate,
        path: '/BlogUpdate',
        layout: DefaultLayout,
        role: ['user', 'admin'],
    },
    {
        component: CreateBlog,
        path: '/CreateBlog',
        layout: DefaultLayout,
        role: ['user', 'admin'],
    },
    {
        component: CodeEditing,
        path: '/practice',
        layout: CodeEditingLayout,
        role: ['user'],
    },
    {
        component: ForgotPassword,
        path: '/forgot-password',
        layout: DefaultLayout,
        role: ['user', 'guest'],
    },
    {
        component: UpdateProfile,
        path: '/UpdateProfile',
        layout: DefaultLayout,
        role: ['user'],
    },
    {
        component: UserProfileBlog,
        path: '/UserProfileBlog',
        layout: DefaultLayout,
        role: ['user'],
    },
    {
        component: UserSubmissions,
        path: '/UserSubmissions',
        layout: DefaultLayout,
        role: ['user'],
    },
    {
        component: UserContest,
        path: '/UserContest',
        layout: DefaultLayout,
        role: ['user'],
    },
    {
        component: ContestList,
        path: 'contest',
        layout: DefaultLayout,
        role: ['guest', 'user'],
    },
    {
        component: SubmissionHistory,
        path: '/submissions/history/:problemId',
        layout: DefaultLayout,
        role: ['user'],
    },
    {
        component: Ranking,
        path: '/ranking',
        layout: DefaultLayout,
        role: ['guest', 'user'],
    },
    {
        component: PublicProfile,
        path: '/profile/public/:userId',
        layout: DefaultLayout,
        role: ['guest', 'user'],
    },
    {
        component: ContestDetail,
        path: '/contest/:contestId',
        layout: DefaultLayout,
        role: ['user'],
    },
    {
        component: BlogBookMark,
        path: '/BlogBookMark',
        layout: DefaultLayout,
        role: ['user'],
    },
    {
        component: QA,
        path: '/Q&A',
        layout: DefaultLayout,
        role: ['user', 'guest'],
    },
    {
        component: ContestRanking,
        path: '/contest/ranking/:contestId',
        layout: RankingContestLayout,
        role: ['user'],
    },
];

export default routes;
