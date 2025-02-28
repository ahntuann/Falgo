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
        component: BlogUpdate,
        path: '/BlogUpdate',
        layout: DefaultLayout,
        role: ['user'],
    },
    {
        component: CodeEditing,
        path: '/practice',
        layout: CodeEditingLayout,
        role: ['user'],
    },
];

export default routes;
