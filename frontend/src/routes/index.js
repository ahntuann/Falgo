import AdminLogin from '~/components/admin/pages/AdminLogin';
import { Home, ProblemList, Profile,Blog } from '~/components/user/pages';
import { DefaultLayout } from '~/layouts';

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
        component: Blog,
        path: '/Blog',
        layout: DefaultLayout,
        role: ['user', 'guest'],
    },

    {
        component: AdminLogin,
        path: '/adminLogin',
        layout: DefaultLayout,
        role: ['admin','guest'],
    }
];

export default routes;
