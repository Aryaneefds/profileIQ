import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { DashboardLayout } from './components/layout';

// Public pages
import Landing from './pages/public/Landing';
import Methodology from './pages/public/Methodology';

// Auth pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';

// Student pages
import StudentDashboard from './pages/student/Dashboard';
import StudentActivities from './pages/student/Activities';
import StudentEvaluation from './pages/student/Evaluation';
import StudentGrowth from './pages/student/Growth';
import StudentProfile from './pages/student/Profile';

// Counselor pages
import CounselorDashboard from './pages/counselor/Dashboard';
import CounselorStudents from './pages/counselor/Students';
import CounselorStudentDetail from './pages/counselor/StudentDetail';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/methodology" element={<Methodology />} />

      {/* Auth routes */}
      <Route path="/login" element={user ? <Navigate to={user.role === 'counselor' ? '/counselor' : '/student'} /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to={user.role === 'counselor' ? '/counselor' : '/student'} /> : <Signup />} />

      {/* Student routes */}
      <Route path="/student" element={<DashboardLayout />}>
        <Route index element={<StudentDashboard />} />
        <Route path="activities" element={<StudentActivities />} />
        <Route path="evaluation" element={<StudentEvaluation />} />
        <Route path="growth" element={<StudentGrowth />} />
        <Route path="profile" element={<StudentProfile />} />
      </Route>

      {/* Counselor routes */}
      <Route path="/counselor" element={<DashboardLayout />}>
        <Route index element={<CounselorDashboard />} />
        <Route path="students" element={<CounselorStudents />} />
        <Route path="students/:id" element={<CounselorStudentDetail />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
