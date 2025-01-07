import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { Provider } from 'react-redux';
import { store } from './store/store.js';
import { RouterProvider } from 'react-router-dom';
import { createBrowserRouter } from 'react-router-dom';
import App from '../src/App';

import ProtectedRoute from './components/ProtectedRoute.jsx';


import Home from '../src/pages/Home';

import AboutUs from './pages/AboutUs.jsx';
import Resources from './pages/Resources.jsx';
import StudentLogin from './pages/StudentLogin.jsx';
import StudentDashboard from './pages/StudentDashboard.jsx';
import CourseModules from './pages/CourseModules.jsx';
import ModuleDetail from './pages/ModuleDetail.jsx';
import StudentQuestionsPage from './pages/StudentQuestionsPage.jsx';
import CourseSubmissions from './pages/CourseSubmissions.jsx';
import SingleQuestionDetail from './pages/SingleQuestionDetail.jsx';
import CourseModulesResults from './pages/CourseModulesResults.jsx';
import StudentProfilePage from './pages/StudentProfilePage.jsx';
import Register from './pages/Register.jsx';
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <Home />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'aboutus',
        element: <AboutUs />,
      },
      {
        path: 'resources',
        element: <Resources />,
      },
      {
        path: '/login',
        element: <StudentLogin />,
      },
      {
        path: '/profile',
        element: (
          <ProtectedRoute>
            <StudentProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <StudentDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'coursemodules/:courseId',
        element: (
          <ProtectedRoute>
            <CourseModules />
          </ProtectedRoute>
        ),
      },
      {
        path: '/coursesresult/:courseId/',
        element: (
          <ProtectedRoute>
            <CourseModulesResults />
          </ProtectedRoute>
        ),
      },
      {
        path: '/modules/:moduleId',
        element: (
          <ProtectedRoute>
            <ModuleDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: '/problems',
        element: (
          <ProtectedRoute>
            <StudentQuestionsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/courses/:courseId/module/:moduleId/submissions',
        element: (
          <ProtectedRoute>
            <CourseSubmissions />
          </ProtectedRoute>
        ),
      },
      {
        path: '/questions/:questionId',
        element: (
          <ProtectedRoute>
            <SingleQuestionDetail />
          </ProtectedRoute>
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