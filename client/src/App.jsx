import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Pages/Navbar';
import Dashboard from './components/Pages/Dashboard';
import Home from './components/Pages/Home';
import { AssignmentHome } from './components/Pages/AssignmentHome';
import TeacherDashboard from './components/Pages/TeacherDashboard';
import CreateAssignment from './components/Pages/CreateAssignment';
import Login from './components/Pages/Login';
import AssignmentDetailPage from './components/Pages/Assignment';

export default function App() {
  const location = useLocation()
  const hideNavbarRoutes = ["/"]  
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname)

  return (
    <div>
      {shouldShowNavbar && <Navbar />}
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/dash" element={<TeacherDashboard />} />
        <Route path="/create" element={<CreateAssignment />} />
        <Route path="/assignment/:id" element={<AssignmentDetailPage />} />
        <Route path="/assignment" element={<AssignmentHome />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </div>
  );
}
