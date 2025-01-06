import { Outlet, useLocation } from 'react-router-dom';
import Header from './components/Header';
import CustomHeader from './components/CustomHeader';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const location = useLocation();

  // Define custom header routes
  const customHeaderRoutes = [
    '/dashboard',
    '/coursemodules',
    '/coursesresult',
    '/modules',
    '/problems',
    '/profile',
    '/courses',
    '/questions',
  ];

  // Check if the current route matches any custom header route
  const isCustomHeader = customHeaderRoutes.some((route) =>
    location.pathname.startsWith(route.split(':')[0])
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Render Header or CustomHeader */}
      {isCustomHeader ? <CustomHeader /> : <Header />}

      {/* Main Content */}
      <main>
        <Outlet />
        <ToastContainer position="top-right" autoClose={3000} />
      </main>
    </div>
  );
};

export default App;
