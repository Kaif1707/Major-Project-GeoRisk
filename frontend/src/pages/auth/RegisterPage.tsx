import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, User, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [roleCode, setRoleCode] = useState('analyst');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register({
        full_name: fullName,
        email,
        username,
        password,
        role_code: roleCode,
      });
      navigate('/app/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
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
        <p className="mt-2 text-xs text-gray-400">Enterprise Access Registration</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-surface-elevated border border-surface-border py-8 px-6 shadow-xl rounded-2xl sm:px-10">
          <h3 className="text-lg font-bold text-gray-100 mb-6">Create Enterprise Profile</h3>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              label="Full Name"
              placeholder="Dr. Eleanor Vance"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              icon={<User className="w-4 h-4" />}
              required
            />

            <Input
              label="Work Email"
              placeholder="e.vance@fund.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Username"
              placeholder="evance"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              icon={<User className="w-4 h-4" />}
              required
            />

            <Input
              label="Password"
              placeholder="••••••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-4 h-4" />}
              required
            />

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Organization Role Tier</label>
              <select
                value={roleCode}
                onChange={(e) => setRoleCode(e.target.value)}
                className="w-full bg-surface-base border border-surface-border text-gray-100 text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-500"
              >
                <option value="analyst">Senior Investment Analyst</option>
                <option value="researcher">Geopolitical Researcher</option>
                <option value="investor">Institutional Investor</option>
                <option value="student">Educational Tier</option>
              </select>
            </div>

            <Button variant="primary" type="submit" className="w-full mt-2" disabled={loading}>
              {loading ? 'Creating Profile...' : 'Complete Registration'} <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-400">
            Already registered?{' '}
            <Link to="/login" className="font-semibold text-brand-400 hover:text-brand-300">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
