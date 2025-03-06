import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import GoogleCallback from '~/components/user/pages/Login/GoogleCallback';
import routes from '~/routes/index.js';
import useAuth from '~/hooks/useAuth.js';
import NotFound from '~/components/shared/NotFound';
import { Login } from '~/components/user/pages';
import { Register } from '~/components/user/pages';
import {
    Dashboard,
    ProblemsManagement,
    UserManagement,
    BlogManagement,
} from './components/admin/pages';
import GithubCallback from './components/user/pages/Login/GithubCallback';
import { ProblemForm } from 'components/admin/components';
function App() {
    const { userRole } = useAuth();

    return (
        <Router>
            <div className="App">
                <Routes key={userRole}>
                    <Route path="/notfound" element={<NotFound />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/google-callback" element={<GoogleCallback />} />
                    <Route path="/github-callback" element={<GithubCallback />} />
                    <Route path="/Dashboard" element={<Dashboard />} />
                    <Route path="/ProblemsManagement" element={<ProblemsManagement />} />
                    <Route path="/UserManagement" element={<UserManagement />} />
                    <Route path="/BlogManagement" element={<BlogManagement />} />
                    <Route path="/ProblemForm" element={<ProblemForm />} />
                    {routes.map((route) => {
                        const Component = route.component;
                        const Layout = route.layout;

                        if (route.role.includes(userRole)) {
                            return (
                                <Route
                                    key={route.path}
                                    path={route.path}
                                    element={
                                        <Layout>
                                            <Component />
                                        </Layout>
                                    }
                                ></Route>
                            );
                        }

                        if (userRole === 'guest' && route.role.includes('user')) {
                            return (
                                <Route
                                    key={route.path}
                                    path={route.path}
                                    element={<Navigate to="/login" replace />}
                                />
                            );
                        }

                        return null;
                    })}
                    <Route path="*" element={<Navigate to="/notfound" replace />} />;
                </Routes>
            </div>
        </Router>
    );
}

export default App;
