
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import { HomeIcon, UsersIcon, MessageIcon, AnnouncementIcon, ReportIcon, BillingIcon, ProfileIcon, LogoutIcon, SupportIcon, UserManagementIcon, ShieldCheckIcon } from './icons';

const Sidebar: React.FC<{ isOpen: boolean, setIsOpen: (isOpen: boolean) => void }> = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkClass = "flex items-center px-4 py-3 text-gray-100 hover:bg-primary-700 rounded-lg transition-colors duration-200";
  const activeLinkClass = "bg-primary-700 font-semibold";

  const teacherLinks = [
    { to: "/classes", icon: UsersIcon, text: "Lớp học" },
  ];

  const parentLinks = [
    { to: "/reports", icon: ReportIcon, text: "Học bạ" },
    { to: "/billing", icon: BillingIcon, text: "Học phí" },
  ];

  const adminLinks = [
    { to: "/admin/dashboard", icon: ShieldCheckIcon, text: "Tổng quan" },
    { to: "/admin/users", icon: UserManagementIcon, text: "Quản lý User" },
    { to: "/admin/support", icon: SupportIcon, text: "Quản lý Hỗ trợ" },
  ];

  const renderNavLinks = () => {
    if (user?.role === UserRole.ADMIN) {
      return adminLinks.map(link => (
        <NavLink key={link.to} to={link.to} className={({ isActive }) => `${navLinkClass} ${isActive ? activeLinkClass : ''}`}>
          <link.icon className="w-6 h-6 mr-3" /> {link.text}
        </NavLink>
      ));
    }

    return (
      <>
        <NavLink to="/" className={({ isActive }) => `${navLinkClass} ${isActive ? activeLinkClass : ''}`} end>
          <HomeIcon className="w-6 h-6 mr-3" /> Bảng điều khiển
        </NavLink>
        <NavLink to="/messages" className={({ isActive }) => `${navLinkClass} ${isActive ? activeLinkClass : ''}`}>
          <MessageIcon className="w-6 h-6 mr-3" /> Tin nhắn
        </NavLink>
        <NavLink to="/announcements" className={({ isActive }) => `${navLinkClass} ${isActive ? activeLinkClass : ''}`}>
          <AnnouncementIcon className="w-6 h-6 mr-3" /> Thông báo
        </NavLink>
        {user?.role === UserRole.TEACHER && teacherLinks.map(link => (
          <NavLink key={link.to} to={link.to} className={({ isActive }) => `${navLinkClass} ${isActive ? activeLinkClass : ''}`}>
            <link.icon className="w-6 h-6 mr-3" /> {link.text}
          </NavLink>
        ))}
        {user?.role === UserRole.PARENT && parentLinks.map(link => (
          <NavLink key={link.to} to={link.to} className={({ isActive }) => `${navLinkClass} ${isActive ? activeLinkClass : ''}`}>
            <link.icon className="w-6 h-6 mr-3" /> {link.text}
          </NavLink>
        ))}
      </>
    );
  };
  
  return (
    <>
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-primary-900 text-white transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}>
        <div className="flex items-center justify-center p-6 border-b border-primary-800">
          <h1 className="text-2xl font-bold">EdConnect</h1>
        </div>
        <nav className="p-4 space-y-2">
          {renderNavLinks()}
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t border-primary-800">
            { user?.role !== UserRole.ADMIN &&
              <NavLink to="/support" className={({ isActive }) => `${navLinkClass} ${isActive ? activeLinkClass : ''}`}>
                  <SupportIcon className="w-6 h-6 mr-3" /> Hỗ trợ
              </NavLink>
            }
            <NavLink to="/profile" className={({ isActive }) => `${navLinkClass} ${isActive ? activeLinkClass : ''}`}>
                <ProfileIcon className="w-6 h-6 mr-3" /> Hồ sơ
            </NavLink>
            <button onClick={handleLogout} className={`${navLinkClass} w-full text-left`}>
                <LogoutIcon className="w-6 h-6 mr-3" /> Đăng xuất
            </button>
        </div>
      </aside>
      {isOpen && <div className="fixed inset-0 z-20 bg-black opacity-50 md:hidden" onClick={() => setIsOpen(false)}></div>}
    </>
  );
};


const Header: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
    const { user } = useAuth();

    const getRoleInfo = (role?: UserRole) => {
        switch (role) {
            case UserRole.ADMIN:
                return { text: 'Quản trị viên', color: 'bg-purple-500 text-white' };
            case UserRole.TEACHER:
                return { text: 'Giáo viên', color: 'bg-green-500 text-white' };
            case UserRole.PARENT:
                return { text: 'Phụ huynh', color: 'bg-blue-500 text-white' };
            default:
                return { text: '', color: '' };
        }
    };

    const roleInfo = getRoleInfo(user?.role);

    return (
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <button onClick={onMenuClick} className="md:hidden text-gray-500 focus:outline-none">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                    </button>
                    <div className="flex items-center ml-auto">
                        <div className="text-right hidden sm:block">
                            <p className="text-gray-700 font-medium">Xin chào, {user?.name}</p>
                            {roleInfo.text && (
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${roleInfo.color}`}>
                                    {roleInfo.text}
                                </span>
                            )}
                        </div>
                        <img className="h-10 w-10 rounded-full ml-3" src={user?.avatarUrl} alt="User Avatar" />
                    </div>
                </div>
            </div>
        </header>
    );
};


export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};