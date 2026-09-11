import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginRequest, RegisterRequest } from '@/types';
import { authService } from '@/services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (permissionCode: string) => boolean;
  hasRole: (roleCode: string) => boolean;
  updateUser: (updatedUser: User) => void;
  switchRole: (roleCode: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('georisk_user');
    return saved ? JSON.parse(saved) : {
      id: 'default-admin-id',
      email: 'admin@georisk.internal',
      username: 'admin',
      full_name: 'System Administrator',
      role: { id: 'r1', name: 'Super Admin', code: 'super_admin', is_system: true },
      permissions: ['dashboard:view', 'countries:view', 'reports:view', 'forecast:view', 'ai:query', 'admin:view', 'users:manage', 'weights:manage', 'etl:manage'],
      is_active: true,
      is_verified: true,
      created_at: new Date().toISOString()
    };
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('georisk_access_token');
      if (token) {
        try {
          const res = await authService.getProfile();
          if (res.data) {
            setUser(res.data);
            localStorage.setItem('georisk_user', JSON.stringify(res.data));
          }
        } catch {
          // Token expired or offline
        }
      }
    };
    initAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    try {
      const res = await authService.login(credentials);
      const { user: userData, tokens } = res.data;

      localStorage.setItem('georisk_access_token', tokens.access_token);
      localStorage.setItem('georisk_refresh_token', tokens.refresh_token);
      localStorage.setItem('georisk_user', JSON.stringify(userData));

      setUser(userData);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest) => {
    setIsLoading(true);
    try {
      await authService.register(userData);
      await login({ username_or_email: userData.email, password: userData.password });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } finally {
      localStorage.removeItem('georisk_access_token');
      localStorage.removeItem('georisk_refresh_token');
      localStorage.removeItem('georisk_user');
      setUser(null);
      setIsLoading(false);
    }
  };

  const hasPermission = (permissionCode: string): boolean => {
    if (!user) return false;
    if (user.role?.code === 'super_admin') return true;
    return user.permissions?.includes(permissionCode) || false;
  };

  const hasRole = (roleCode: string): boolean => {
    if (!user) return false;
    return user.role?.code === roleCode;
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('georisk_user', JSON.stringify(updatedUser));
  };

  const switchRole = (roleCode: string) => {
    if (!user) return;
    const isSuperAdmin = roleCode === 'super_admin';
    const roleName = isSuperAdmin ? 'Super Admin' : roleCode === 'admin' ? 'Admin' : 'Senior Analyst';
    const perms = isSuperAdmin
      ? ['dashboard:view', 'countries:view', 'reports:view', 'forecast:view', 'ai:query', 'admin:view', 'users:manage', 'weights:manage', 'etl:manage']
      : ['dashboard:view', 'countries:view', 'reports:view', 'forecast:view', 'ai:query'];

    const newObj: User = {
      ...user,
      role: { id: roleCode, name: roleName, code: roleCode, is_system: true },
      permissions: perms,
    };
    setUser(newObj);
    localStorage.setItem('georisk_user', JSON.stringify(newObj));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        hasPermission,
        hasRole,
        updateUser,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
