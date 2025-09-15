import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Simdikta
          </h1>
          <p className="text-gray-600 mb-8">
            Sistem Akademi Pendidikan Terintegrasi untuk Negeri
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/register"
            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create Account
          </Link>
          
          <Link
            href="/login"
            className="w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
