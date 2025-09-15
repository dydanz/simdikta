'use client';

import Link from 'next/link';
import { Mail } from 'lucide-react';

export default function CheckEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100">
            <Mail className="h-8 w-8 text-blue-600" />
          </div>
          
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Check your email
          </h2>
          
          <p className="mt-4 text-center text-sm text-gray-600">
            We&apos;ve sent a verification link to your email address. 
            Please check your inbox and click the link to verify your account.
          </p>
          
          <div className="mt-8 space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <p className="text-sm text-blue-700">
                <strong>What&apos;s next?</strong>
              </p>
              <ul className="mt-2 text-sm text-blue-600 space-y-1">
                <li>1. Check your email inbox</li>
                <li>2. Click the verification link</li>
                <li>3. You&apos;ll be redirected to login</li>
              </ul>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Didn&apos;t receive the email? Check your spam folder or{' '}
                <Link 
                  href="/register" 
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  try registering again
                </Link>
              </p>
            </div>
            
            <div className="text-center">
              <Link
                href="/login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}