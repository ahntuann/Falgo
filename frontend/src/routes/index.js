<<<<<<< HEAD
import { AdminLogin, Dashboard } from '~/components/admin/pages';
import { Home, ProblemList, Profile, Blog } from '~/components/user/pages';
import { DefaultLayout, AdminLayout, AdminLoginLayout } from '~/layouts';
=======
import { Home, ProblemList, Profile, Blog, DetailBlog } from '~/components/user/pages';
import { DefaultLayout } from '~/layouts';

>>>>>>> 39ac4d3 (Show Detail Blog)
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
<<<<<<< HEAD

    {
        component: AdminLogin,
        path: '/adminLogin',
        layout: AdminLoginLayout,
        role: ['admin', 'guest'],
=======
    {
        component: DetailBlog,
        path: '/DetailBlog',
        layout: DefaultLayout,
        role: ['user', 'guest'],
>>>>>>> 39ac4d3 (Show Detail Blog)
    },
];

export default routes;
