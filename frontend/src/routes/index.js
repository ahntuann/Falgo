import { AdminLogin, Dashboard } from '~/components/admin/pages';
import { DefaultLayout, AdminLayout, AdminLoginLayout, CodeEditingLayout } from '~/layouts';

import {
    Home,
    ProblemList,
    Profile,
    Blog,
    DetailBlog,
    BlogUpdate,
    CodeEditing,
    ProblemDetail,
    ResetPassword,
    UserBlog,
    SubmissionList,
} from '~/components/user/pages';

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
    // {
    //     component: CreateBlog,
    //     path: '/CreateBlog',
    //     layout: DefaultLayout,
    //     role: ['user'],
    // },
    // {
    //     component: BlogManagement,
    //     path: '/BlogManagement',
    //     layout: DefaultLayout,
    //     role: ['admin'],
    // },
    {
        component: CodeEditing,
        path: '/practice',
        layout: CodeEditingLayout,
        role: ['user'],
    },
    {
        component: ResetPassword,
        path: '/reset-password',
        layout: DefaultLayout,
        role: ['user', 'guest'],
    },
];

export default routes;
