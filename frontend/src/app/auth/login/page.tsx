'use client';

import { useState, useEffect, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@apollo/client';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { z } from 'zod';
import { LOGIN_MUTATION, type LoginInput, type LoginPayload } from '@/lib/auth-graphql';
import { useAuth } from '@/contexts/AuthContext';
import { PasswordInput } from '@/components/ui/password-input';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

function LoginContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated } = useAuth();
  
  const [loginMutation] = useMutation<{ login: LoginPayload }>(LOGIN_MUTATION);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });
  
  const password = watch('password');
  
  useEffect(() => {
    const verified = searchParams.get('verified');
    if (verified === 'true') {
      setSuccessMessage('Your account has been verified. Please log in.');
    }
  }, [searchParams]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);
  
  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setServerError(null);
    
    try {
      const result = await loginMutation({
        variables: {
          input: {
            email: data.email,
            password: data.password,
          },
        },
      });
      
      const response = result.data?.login;
      
      if (response?.success && response.sessionToken) {
        // Store token and redirect to dashboard
        login(response.sessionToken);
        router.push('/dashboard');
      } else {
        setServerError(response?.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setServerError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link 
              href="/register" 
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              create a new account
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              {successMessage}
            </div>
          )}
          
          {serverError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {serverError}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                {...register('email')}
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <PasswordInput
                id="password"
                name="password"
                placeholder="Enter your password"
                value={password || ''}
                onChange={(e) => setValue('password', e.target.value)}
                error={errors.password?.message}
                className="mt-1"
              />
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}