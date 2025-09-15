'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@apollo/client';
import { User, LogOut, Home } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { LOGOUT_MUTATION, ME_QUERY, type LogoutPayload, type User as UserType } from '@/lib/auth-graphql';

export default function DashboardPage() {
  const { logout, isAuthenticated, isLoading: authLoading, sessionToken } = useAuth();
  const router = useRouter();
  
  const { data: userData, loading: userLoading, error } = useQuery<{ me: UserType }>(ME_QUERY, {
    skip: !isAuthenticated || !sessionToken,
    errorPolicy: 'all'
  });
  
  const [logoutMutation] = useMutation<{ logout: LogoutPayload }>(LOGOUT_MUTATION);
  
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleLogout = async () => {
    try {
      await logoutMutation();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local session regardless of server response
      logout();
      router.push('/auth/login');
    }
  };

  if (authLoading || userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load user data</p>
          <button
            onClick={handleLogout}
            className="text-blue-600 hover:text-blue-800"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const user = userData?.me;
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Simdikta Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-700">
                <User className="h-5 w-5" />
                <span className="text-sm">{user?.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm">
          <nav className="mt-5 px-2">
            <ul className="space-y-1">
              <li>
                <a
                  href="#"
                  className="bg-blue-100 text-blue-700 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                >
                  <Home className="text-blue-500 mr-3 flex-shrink-0 h-5 w-5" />
                  Dashboard
                </a>
              </li>
            </ul>
          </nav>
        </div>

        {/* Main content */}
        <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Welcome to Simdikta!
                </h2>
                <p className="text-gray-600 mb-6">
                  Your account has been successfully verified and you are now logged in.
                </p>
                
                {user && (
                  <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Account Information
                    </h3>
                    <div className="space-y-3 text-left">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          User ID
                        </label>
                        <p className="text-sm text-gray-900">{user.id}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <p className="text-sm text-gray-900">{user.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Status
                        </label>
                        <p className="text-sm text-green-600">
                          ✓ {user.verified ? 'Verified' : 'Not Verified'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Member Since
                        </label>
                        <p className="text-sm text-gray-900">
                          {new Date(user.createdDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}