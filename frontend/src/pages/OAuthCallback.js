import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const user = searchParams.get('user');
    const error = searchParams.get('message');

    if (error) {
      toast.error(error);
      navigate('/login');
      return;
    }

    if (token && user) {
      try {
        const userData = JSON.parse(decodeURIComponent(user));
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        toast.success('Login successful!');
        
        // Redirect based on role
        if (userData.role === 'admin') {
          navigate('/dashboard');
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        toast.error('Login failed');
        navigate('/login');
      }
    } else {
      toast.error('Authentication failed');
      navigate('/login');
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-mvsr-600 to-mvsr-800 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
        <p className="mt-4 text-white">Completing authentication...</p>
      </div>
    </div>
  );
};

export default OAuthCallback;
