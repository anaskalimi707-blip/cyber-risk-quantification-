import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '../types';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization: string;
  avatarUrl?: string;
  title: string;
}

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLocked: boolean;
  login: (email: string, role?: UserRole) => void;
  logout: () => void;
  lockSession: () => void;
  unlockSession: (pinOrPassword?: string) => boolean;
  switchRole: (role: UserRole) => void;
}

const PRESET_USERS: Record<UserRole, UserProfile> = {
  CISO: {
    id: 'usr_ciso',
    name: 'Priyanka Sharma',
    email: 'priyanka.sharma@acme-financial.com',
    role: 'CISO',
    organization: 'Acme Financial Services',
    title: 'Chief Information Security Officer'
  },
  CFO: {
    id: 'usr_cfo',
    name: 'Ananya Fernandes',
    email: 'ananya.fernandes@acme-financial.com',
    role: 'CFO',
    organization: 'Acme Financial Services',
    title: 'Chief Financial Officer & CRO'
  },
  SecurityArchitect: {
    id: 'usr_arch',
    name: 'Vikram Mehta',
    email: 'vikram.mehta@acme-financial.com',
    role: 'SecurityArchitect',
    organization: 'Acme Financial Services',
    title: 'Principal Security Architect'
  },
  Auditor: {
    id: 'usr_audit',
    name: 'Rohit Iyer',
    email: 'rohit.iyer@acme-financial.com',
    role: 'Auditor',
    organization: 'Acme Financial Services',
    title: 'Lead GRC & Regulatory Auditor'
  },
  Executive: {
    id: 'usr_exec',
    name: 'Rajesh K. Singhania',
    email: 'rajesh.singhania@acme-financial.com',
    role: 'Executive',
    organization: 'Acme Financial Services',
    title: 'Board Audit Committee Member'
  },
  'SOC Analyst': {
    id: 'usr_soc',
    name: 'Aarav Patel',
    email: 'aarav.patel@acme-financial.com',
    role: 'SOC Analyst',
    organization: 'Acme Financial Services',
    title: 'Senior Incident Response Analyst'
  },
  'GRC Analyst': {
    id: 'usr_grc',
    name: 'Sneha Roy',
    email: 'sneha.roy@acme-financial.com',
    role: 'GRC Analyst',
    organization: 'Acme Financial Services',
    title: 'Compliance & Controls Analyst'
  },
  'IT Owner': {
    id: 'usr_it',
    name: 'Karan Malhotra',
    email: 'karan.malhotra@acme-financial.com',
    role: 'IT Owner',
    organization: 'Acme Financial Services',
    title: 'VP Infrastructure & Payments Engine'
  },
  'Org Admin': {
    id: 'usr_admin',
    name: 'System Administrator',
    email: 'admin@acme-financial.com',
    role: 'Org Admin',
    organization: 'Acme Financial Services',
    title: 'Enterprise Platform Administrator'
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('cyberoptix_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return PRESET_USERS.CISO; }
    }
    return PRESET_USERS.CISO;
  });

  const [isLocked, setIsLocked] = useState<boolean>(false);

  const role: UserRole = user?.role || 'CISO';
  const isAuthenticated = !!user;

  useEffect(() => {
    if (user) {
      localStorage.setItem('cyberoptix_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('cyberoptix_user');
    }
  }, [user]);

  const login = (email: string, selectedRole?: UserRole) => {
    const matchedRole = selectedRole || (Object.keys(PRESET_USERS) as UserRole[]).find(
      r => PRESET_USERS[r].email.toLowerCase() === email.toLowerCase()
    ) || 'CISO';

    const baseUser = PRESET_USERS[matchedRole];
    setUser({
      ...baseUser,
      email: email || baseUser.email
    });
    setIsLocked(false);
  };

  const logout = () => {
    setUser(null);
    setIsLocked(false);
    localStorage.removeItem('cyberoptix_user');
  };

  const lockSession = () => {
    setIsLocked(true);
  };

  const unlockSession = (pinOrPassword?: string) => {
    setIsLocked(false);
    return true;
  };

  const switchRole = (newRole: UserRole) => {
    if (PRESET_USERS[newRole]) {
      setUser(PRESET_USERS[newRole]);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        isLocked,
        login,
        logout,
        lockSession,
        unlockSession,
        switchRole
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
