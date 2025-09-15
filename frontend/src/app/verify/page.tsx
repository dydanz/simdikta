'use client';

import { useEffect, useState, Suspense } from 'react';

// Disable static generation for this page
export const dynamic = 'force-dynamic';
import { useMutation } from '@apollo/client';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { VERIFY_USER, type VerifyUserPayload } from '@/lib/graphql';

function VerifyContent() {
  const [verificationState, setVerificationState] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('');
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [verifyUser] = useMutation<{ verifyUser: VerifyUserPayload }>(VERIFY_USER);
  
  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setVerificationState('error');
      setMessage('No verification token provided.');
      return;
    }
    
    const performVerification = async () => {
      try {
        const result = await verifyUser({
          variables: { token },
        });
        
        const response = result.data?.verifyUser;
        
        if (response?.success) {
          setVerificationState('success');
          setMessage(response.message);
          
          // Redirect to login after 3 seconds
          setTimeout(() => {
            router.push('/login?verified=true');
          }, 3000);
        } else {
          setVerificationState('error');
          setMessage(response?.message || 'Verification failed.');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setVerificationState('error');
        setMessage('Network error. Please try again.');
      }
    };
    
    performVerification();
  }, [searchParams, verifyUser, router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {verificationState === 'loading' && (
            <>
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              </div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Verifying your account
              </h2>
              <p className="mt-4 text-center text-sm text-gray-600">
                Please wait while we verify your email address...
              </p>
            </>
          )}
          
          {verificationState === 'success' && (
            <>
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Account verified!
              </h2>
              <p className="mt-4 text-center text-sm text-gray-600">
                {message}
              </p>
              <div className="mt-6 bg-green-50 border border-green-200 rounded-md p-4">
                <p className="text-sm text-green-700">
                  You will be redirected to the login page in a few seconds...
                </p>
              </div>
            </>
          )}
          
          {verificationState === 'error' && (
            <>
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Verification failed
              </h2>
              <p className="mt-4 text-center text-sm text-gray-600">
                {message}
              </p>
              <div className="mt-6 bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-sm text-red-700">
                  <strong>Common issues:</strong>
                </p>
                <ul className="mt-2 text-sm text-red-600 space-y-1">
                  <li>• The verification link has expired</li>
                  <li>• The link has already been used</li>
                  <li>• The link is invalid or corrupted</li>
                </ul>
              </div>
            </>
          )}
          
          <div className="mt-8 flex flex-col space-y-3">
            <Link
              href="/login"
              className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Go to Login
            </Link>
            
            {verificationState === 'error' && (
              <Link
                href="/register"
                className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Register Again
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}