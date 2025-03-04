import { Home, ProblemList, Profile, Blog, DetailBlog, BlogUpdate, UserBlog, CreateBlog, CodeEditing, ProblemDetail, ResetPassword} from '~/components/user/pages';
import { AdminLogin, Dashboard } from '~/components/admin/pages';
import { DefaultLayout, AdminLayout, AdminLoginLayout, CodeEditingLayout } from '~/layouts';


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
        component: ResetPassword,
        path: '/reset-password',
        layout: DefaultLayout,
        role: ['user', 'guest'],
    },
];

export default routes;
