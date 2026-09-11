export type RiskCategory = 'Very Low' | 'Low' | 'Moderate' | 'Elevated' | 'High' | 'Extreme';

export interface CountrySummary {
  id: string;
  code: string;
  name: string;
  flag: string;
  region: string;
  geoRiskScore: number;
  riskCategory: RiskCategory;
  gdpGrowth: number;
  inflation: number;
  politicalStability: number;
  trend: 'up' | 'down' | 'stable';
}

export interface Permission {
  id: string;
  name: string;
  code: string;
  module: string;
  description?: string;
}

export interface Role {
  id: string;
  name: string;
  code: string;
  description?: string;
  is_system: boolean;
  permissions?: Permission[];
}

export interface User {
  id: string;
  email: string;
  username: string;
  full_name: string;
  is_active: boolean;
  is_verified: boolean;
  avatar_url?: string;
  theme_preference: string;
  language_preference: string;
  last_login_at?: string;
  created_at: string;
  role: Role;
  permissions: string[];
}

export interface LoginRequest {
  username_or_email: string;
  password: string;
  remember_me?: boolean;
}

export interface RegisterRequest {
  email: string;
  username: string;
  full_name: string;
  password: string;
  role_code?: string;
}
