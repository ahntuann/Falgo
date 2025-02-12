import {AdminLogin,Dashboard} from '~/components/admin/pages';
import { Home, ProblemList, Profile,Blog } from '~/components/user/pages';
import { DefaultLayout,AdminLayout } from '~/layouts';
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
        layout: AdminLayout ,
        role: ['admin','guest'],
    },
    {
        component: Dashboard,
        path:'/dashboard',
        layout: AdminLayout,
        role: ['admin'],
    }
];

export default routes;
