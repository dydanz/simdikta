'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { registerSchema, type RegisterFormData } from '@/lib/validations';
import { CREATE_USER, type CreateUserPayload } from '@/lib/graphql';
import { PasswordInput } from '@/components/ui/password-input';

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();
  
  const [createUser] = useMutation<{ createUser: CreateUserPayload }>(CREATE_USER);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    trigger
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });
  
  const password = watch('password');
  const retypePassword = watch('retypePassword');
  
  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setServerError(null);
    
    try {
      const result = await createUser({
        variables: {
          input: {
            email: data.email,
            password: data.password,
            retypePassword: data.retypePassword,
          },
        },
      });
      
      const response = result.data?.createUser;
      
      if (response?.success) {
        router.push('/check-email');
      } else {
        setServerError(response?.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
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
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link 
              href="/login" 
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
                onChange={(e) => {
                  setValue('password', e.target.value);
                  trigger('password');
                }}
                error={errors.password?.message}
                showStrength={true}
                className="mt-1"
              />
            </div>
            
            <div>
              <label htmlFor="retypePassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <PasswordInput
                id="retypePassword"
                name="retypePassword"
                placeholder="Confirm your password"
                value={retypePassword || ''}
                onChange={(e) => {
                  setValue('retypePassword', e.target.value);
                  trigger('retypePassword');
                }}
                error={errors.retypePassword?.message}
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
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}