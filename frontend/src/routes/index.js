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
} from '~/components/user/pages';
import { AdminLogin } from '~/components/admin/pages';
import { DefaultLayout, AdminLoginLayout, CodeEditingLayout } from '~/layouts';
import ContestDetail from '~/components/user/pages/ContestDetail';

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
        role: ['user', 'guest'],
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
        role: ['user', 'guest'],
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
        role: ['user'],
    },
    {
        component: CreateBlog,
        path: '/CreateBlog',
        layout: DefaultLayout,
        role: ['user'],
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
        component: ContestDetail,
        path: '/contest/:contestId',
        layout: DefaultLayout,
        role: ['user'],
    },
];

export default routes;
