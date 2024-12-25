import { Outlet } from 'react-router-dom';

import Header from './components/Header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const App = () => {
  
  return (
    <div className="min-h-screen bg-gray-100">



      {/* Main Content */}
      <main className=" ">
        <Outlet />
        <ToastContainer position="top-right" autoClose={3000} />

      </main>
    </div>
  );
};

export default App;
