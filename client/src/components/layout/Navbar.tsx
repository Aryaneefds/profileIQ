import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-zinc-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-zinc-900 tracking-tight font-display">ProfileIQ</span>
            </Link>
            {!user && (
              <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
                <Link to="/methodology" className="text-zinc-500 hover:text-zinc-900 px-3 py-2 text-sm font-medium transition-colors">
                  Methodology
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to={user.role === 'counselor' ? '/counselor' : '/student'}
                  className="text-zinc-600 hover:text-zinc-900 text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <span className="text-sm text-zinc-400">
                  {user.email}
                </span>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
