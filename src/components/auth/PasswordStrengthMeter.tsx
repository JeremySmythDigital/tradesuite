'use client';

import { useState, useEffect } from 'react';

interface PasswordStrengthMeterProps {
  password: string;
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const [strength, setStrength] = useState(0);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    let score = 0;
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };

    Object.values(checks).forEach((passed) => {
      if (passed) score += 20;
    });

    setStrength(score);

    if (password.length === 0) {
      setFeedback('');
    } else if (score < 40) {
      setFeedback('Weak - Add more characters and variety');
    } else if (score < 60) {
      setFeedback('Fair - Try adding symbols or numbers');
    } else if (score < 80) {
      setFeedback('Good - Almost there!');
    } else {
      setFeedback('Strong - Great password!');
    }
  }, [password]);

  if (password.length === 0) return null;

  return (
    <div className="mt-2">
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            strength < 40 ? 'bg-red-500' : strength < 60 ? 'bg-yellow-500' : strength < 80 ? 'bg-blue-500' : 'bg-green-500'
          }`}
          style={{ width: `${strength}%` }}
        />
      </div>
      <p className={`text-xs mt-1 ${
        strength < 40 ? 'text-red-500' : strength < 60 ? 'text-yellow-500' : strength < 80 ? 'text-blue-500' : 'text-green-500'
      }`}>
        {feedback}
      </p>
      <ul className="text-xs text-gray-500 mt-1 space-y-0.5">
        <li className={`${password.length >= 8 ? 'text-green-500' : ''}`}>
          {password.length >= 8 ? '✓' : '○'} At least 8 characters
        </li>
        <li className={`${/[A-Z]/.test(password) ? 'text-green-500' : ''}`}>
          {/[A-Z]/.test(password) ? '✓' : '○'} One uppercase letter
        </li>
        <li className={`${/[a-z]/.test(password) ? 'text-green-500' : ''}`}>
          {/[a-z]/.test(password) ? '✓' : '○'} One lowercase letter
        </li>
        <li className={`${/[0-9]/.test(password) ? 'text-green-500' : ''}`}>
          {/[0-9]/.test(password) ? '✓' : '○'} One number
        </li>
      </ul>
    </div>
  );
}