import Home from '~/components/user/Home';
import Profile from '~/components/user/Profile';
import DefaultLayout from '~/layouts/DefaultLayout';

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
];

export default routes;
