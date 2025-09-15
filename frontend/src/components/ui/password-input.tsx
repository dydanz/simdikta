'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps {
  id: string;
  name: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  showStrength?: boolean;
  className?: string;
}

export function PasswordInput({ 
  id, 
  name, 
  placeholder, 
  value, 
  onChange, 
  onBlur, 
  error, 
  showStrength = false,
  className = ""
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  
  const getPasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (score <= 2) return { strength: 'weak', color: 'bg-red-500' };
    if (score <= 4) return { strength: 'medium', color: 'bg-yellow-500' };
    return { strength: 'strong', color: 'bg-green-500' };
  };
  
  const passwordStrength = getPasswordStrength(value);
  
  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          id={id}
          name={name}
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${error ? 'border-red-500' : ''} ${className}`}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          ) : (
            <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          )}
        </button>
      </div>
      
      {showStrength && value && (
        <div className="space-y-1">
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5, 6].map((level) => {
              const strength = getPasswordStrength(value);
              const maxLevel = strength.strength === 'weak' ? 2 : 
                             strength.strength === 'medium' ? 4 : 6;
              return (
                <div
                  key={level}
                  className={`h-1 flex-1 rounded ${
                    level <= maxLevel ? strength.color : 'bg-gray-200'
                  }`}
                />
              );
            })}
          </div>
          <p className="text-xs text-gray-600">
            Password strength: <span className="capitalize">{passwordStrength.strength}</span>
          </p>
        </div>
      )}
      
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}