import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [completed, setCompleted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCompleted(true);
  };

  return (
    <div className="min-h-screen bg-surface-base flex flex-col justify-center py-12 px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-surface-elevated border border-surface-border py-8 px-6 shadow-xl rounded-2xl sm:px-10 text-center">
          <h3 className="text-xl font-bold text-gray-100 mb-2">Set New Password</h3>
          <p className="text-xs text-gray-400 mb-6">Create a strong password for your GeoRisk Analytics account.</p>

          {completed ? (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium space-y-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <p>Your password has been updated successfully.</p>
              <Link to="/login">
                <Button variant="primary" size="sm" className="w-full mt-2">
                  Sign In with New Password
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="New Password"
                placeholder="••••••••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="w-4 h-4" />}
                required
              />

              <Input
                label="Confirm New Password"
                placeholder="••••••••••••"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                icon={<Lock className="w-4 h-4" />}
                required
              />

              <Button variant="primary" type="submit" className="w-full">
                Update Password
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
