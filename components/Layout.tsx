import React from 'react';
import { User } from '../types';
import { useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
  user: User;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ user, children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path));

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-fintech-dark text-white flex flex-col shadow-xl z-20">
        <div className="p-6 border-b border-blue-900 flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 bg-fintech-accent rounded-md flex items-center justify-center">
            <i className="fas fa-graduation-cap text-white"></i>
          </div>
          <span className="text-xl font-bold tracking-tight">FintechEdu</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavItem 
            icon="fa-chart-pie" 
            label="Dashboard" 
            active={isActive('/')} 
            onClick={() => navigate('/')} 
          />
          <NavItem 
            icon="fa-book-open" 
            label="My Courses" 
            active={isActive('/courses')} 
            onClick={() => navigate('/')} 
          />
          {user.role === 'INSTRUCTOR' && (
             <NavItem 
             icon="fa-check-circle" 
             label="Grading" 
             active={location.pathname.includes('grade')} 
             onClick={() => navigate('/')} 
           />
          )}
          <NavItem 
            icon="fa-calendar" 
            label="Calendar" 
            active={false} 
            onClick={() => {}} 
          />
          <NavItem 
            icon="fa-users" 
            label="Students" 
            active={false} 
            onClick={() => {}} 
          />
        </nav>

        <div className="p-4 border-t border-blue-900">
          <div className="flex items-center gap-3">
            <img src={user.avatar} alt="User" className="w-10 h-10 rounded-full border-2 border-fintech-secondary" />
            <div>
              <p className="text-sm font-semibold">{user.name}</p>
              <p className="text-xs text-gray-400 capitalize">{user.role.toLowerCase()}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-xl font-semibold text-gray-700">
            {location.pathname === '/' ? 'Dashboard' : 'Course Management'}
          </h2>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-fintech-primary transition">
              <i className="fas fa-bell"></i>
            </button>
            <button className="p-2 text-gray-400 hover:text-fintech-primary transition">
              <i className="fas fa-cog"></i>
            </button>
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }: { icon: string, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      active 
        ? 'bg-fintech-primary text-white shadow-md transform translate-x-1' 
        : 'text-gray-300 hover:bg-white/10 hover:text-white'
    }`}
  >
    <i className={`fas ${icon} w-5 text-center`}></i>
    <span className="font-medium">{label}</span>
  </button>
);

export default Layout;