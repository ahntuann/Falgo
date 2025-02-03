// import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// import './App.css';
// import routes from '~/routes/index.js';
// import useAuth from '~/hooks/useAuth.js';
// import NotFound from '~/components/shared/NotFound';
// import Login from '~/components/user/Login';

// function App() {
//     const { userRole } = useAuth();

//     return (
//         <Router>
//             <div className="App">
//                 <Routes>
//                     <Route path="/notfound" element={<NotFound />} />
//                     <Route path="/login" element={<Login />} />
//                     {routes.map((route) => {
//                         const Component = route.component;
//                         const Layout = route.layout;

//                         if (route.role.includes(userRole)) {
//                             return (
//                                 <Route
//                                     key={route.path}
//                                     path={route.path}
//                                     element={
//                                         <Layout>
//                                             <Component />
//                                         </Layout>
//                                     }
//                                 ></Route>
//                             );
//                         }

//                         if (userRole === 'guest' && route.role.includes('user')) {
//                             return (
//                                 <Route key={route.path} path={route.path} element={<Navigate to="/login" replace />} />
//                             );
//                         }

//                         if ((userRole === 'guest' || userRole === 'user') && route.role.includes('admin')) {
//                             return (
//                                 <Route
//                                     key={route.path}
//                                     path={route.path}
//                                     element={<Navigate to="/notfound" replace />}
//                                 />
//                             );
//                         }

//                         return null;
//                     })}
//                     <Route path="*" element={<Navigate to="/notfound" replace />} />;
//                 </Routes>
//             </div>
//         </Router>
//     );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/user/Login/Register';
import Login from './components//user/Login/Login';
import Home from './components//user/Login/Home';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/" element={<Login />} />
            </Routes>
        </Router>
    );
}

export default App;
