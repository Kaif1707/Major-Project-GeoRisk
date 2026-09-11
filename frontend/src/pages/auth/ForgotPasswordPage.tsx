import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-surface-base flex flex-col justify-center py-12 px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-surface-elevated border border-surface-border py-8 px-6 shadow-xl rounded-2xl sm:px-10 text-center">
          <h3 className="text-xl font-bold text-gray-100 mb-2">Reset Account Password</h3>
          <p className="text-xs text-gray-400 mb-6">
            Enter your registered email address to receive password recovery instructions.
          </p>

          {submitted ? (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium space-y-3">
              <p>If an account exists for {email}, a recovery link has been dispatched.</p>
              <Link to="/login">
                <Button variant="outline" size="sm" className="w-full mt-2">
                  Return to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Registered Email"
                placeholder="analyst@georisk.internal"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="w-4 h-4" />}
                required
              />

              <Button variant="primary" type="submit" className="w-full">
                Send Recovery Instructions <Send className="w-4 h-4 ml-2" />
              </Button>
            </form>
          )}

          <div className="mt-6">
            <Link to="/login" className="inline-flex items-center text-xs text-gray-400 hover:text-gray-200">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
