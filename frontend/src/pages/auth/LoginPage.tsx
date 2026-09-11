import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, Lock, Mail, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login({
        username_or_email: usernameOrEmail,
        password,
        remember_me: rememberMe,
      });
      navigate('/app/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-base flex flex-col justify-center py-12 px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-12 h-12 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold mx-auto mb-4 shadow-lg shadow-brand-600/30">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">GeoRisk Analytics</h2>
        <p className="mt-2 text-xs text-gray-400">Enterprise Geopolitical Risk & Investment Terminal</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-surface-elevated border border-surface-border py-8 px-6 shadow-xl rounded-2xl sm:px-10">
          <h3 className="text-lg font-bold text-gray-100 mb-6">Account Sign In</h3>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <Input
                label="Username or Email"
                placeholder="analyst@georisk.internal"
                type="text"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                icon={<Mail className="w-4 h-4" />}
                required
              />
            </div>

            <div>
              <div className="relative">
                <Input
                  label="Password"
                  placeholder="••••••••••••"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<Lock className="w-4 h-4" />}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-7 text-gray-400 hover:text-gray-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 bg-surface-base border-surface-border rounded text-brand-600 focus:ring-brand-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-xs text-gray-400">
                  Remember session
                </label>
              </div>

              <div className="text-xs">
                <Link to="/forgot-password" className="font-medium text-brand-400 hover:text-brand-300">
                  Forgot password?
                </Link>
              </div>
            </div>

            <div>
              <Button variant="primary" type="submit" className="w-full" disabled={loading}>
                {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center text-xs text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-brand-400 hover:text-brand-300">
              Request access
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
