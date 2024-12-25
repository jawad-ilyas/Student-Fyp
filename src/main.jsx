import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { Provider } from 'react-redux';
import { store } from './store/store.js';
import { RouterProvider } from 'react-router-dom';
import { createBrowserRouter } from 'react-router-dom';
import App from '../src/App';


import Home from '../src/pages/Home';

import AboutUs from './pages/AboutUs.jsx';
import Resources from './pages/Resources.jsx';
import StudentLogin from './pages/StudentLogin.jsx';
import StudentDashboard from './pages/StudentDashboard.jsx';
import CourseModules from './pages/CourseModules.jsx';
import ModuleDetail from './pages/ModuleDetail.jsx';


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      // {
      //   path: 'register',
      //   element: <Register />,
      // },

      {
        path: 'aboutus',
        element: <AboutUs />,
      },
      {
        path: 'resources',
        element: <Resources />,
      },
      {
        path: "/login", element: < StudentLogin />

      },
      {
        path: 'dashboard',
        element: (
          <>
            <StudentDashboard />
          </>
        ),
      },
      {
        path: 'coursemodules/:courseId',
        element: (
          <>
            <CourseModules />
          </>
        ),
      },
      {
        path: '/modules/:moduleId',
        element: (
          <>
            <ModuleDetail />
          </>
        ),
      },

    ],
  },
]);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)