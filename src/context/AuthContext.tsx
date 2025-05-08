
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  username: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  const login = async (username: string, password: string): Promise<boolean> => {
    // In a real app, this would be an API call
    // For demo purposes, accept any non-empty username/password
    if (username && password) {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUser({
        id: '1',
        username: username,
        role: username.toLowerCase().includes('admin') ? 'admin' : 'user',
      });
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${username}!`,
      });
      
      return true;
    }
    
    toast({
      title: "Login Failed",
      description: "Invalid username or password.",
      variant: "destructive",
    });
    
    return false;
  };

  const logout = () => {
    setUser(null);
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
