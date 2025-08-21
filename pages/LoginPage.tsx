
import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('parent@example.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    const success = await login(email, password);
    if (success) {
      navigate('/');
    } else {
      setError('Email hoặc mật khẩu không đúng. Vui lòng thử lại.');
      setIsSubmitting(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  const handleQuickLogin = async (userEmail: string) => {
    setEmail(userEmail);
    setPassword('password'); // mock password
    setError('');
    setIsSubmitting(true);
    const success = await login(userEmail, 'password');
    if (success) {
      navigate('/');
    } else {
      setError('Đăng nhập nhanh thất bại.');
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg">
        <div>
          <h2 className="text-3xl font-extrabold text-center text-gray-900">
            Chào mừng đến với EdConnect
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Đăng nhập để kết nối
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Địa chỉ email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Mật khẩu
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                Quên mật khẩu?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-300"
            >
              {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </div>
        </form>
         <div className="mt-4 text-center text-sm text-gray-600">
          <p className="mb-2">Hoặc đăng nhập nhanh với tài khoản:</p>
          <div className="flex justify-center space-x-2">
            <button onClick={() => handleQuickLogin('parent@example.com')} className="px-4 py-2 text-xs font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600">Phụ Huynh</button>
            <button onClick={() => handleQuickLogin('teacher@example.com')} className="px-4 py-2 text-xs font-medium text-white bg-green-500 rounded-md hover:bg-green-600">Giáo Viên</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
