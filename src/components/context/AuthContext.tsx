import React, { createContext, useContext, useState, useEffect } from 'react';

// Helper function to safely get environment variables
function getEnvVar(key: string): string | undefined {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[key];
  }
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key];
  }
  if (typeof window !== 'undefined' && (window as any).env) {
    return (window as any).env[key];
  }
  return undefined;
}

const GOOGLE_CLIENT_ID = getEnvVar('REACT_APP_GOOGLE_CLIENT_ID') || 
                         getEnvVar('VITE_GOOGLE_CLIENT_ID') || '';

interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
  googleId: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => void;
  logout: () => void;
  isAuthenticated: boolean;
  googleInitialized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [googleInitialized, setGoogleInitialized] = useState(false);

  useEffect(() => {
    // Load Google Sign-In script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      initializeGoogleAuth();
    };

    // Check for existing session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initializeGoogleAuth = () => {
    if (!window.google || !GOOGLE_CLIENT_ID) {
      setGoogleInitialized(false);
      return;
    }

    try {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });
      setGoogleInitialized(true);
    } catch (error) {
      console.error('Error initializing Google Sign-In:', error);
      setGoogleInitialized(false);
    }
  };

  const handleCredentialResponse = (response: any) => {
    try {
      // Decode JWT token
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      
      const userData: User = {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        googleId: payload.sub,
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error parsing credential response:', error);
    }
  };

  const login = () => {
    if (!window.google) {
      console.error('Google Sign-In not loaded');
      return;
    }

    window.google.accounts.id.prompt();
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    if (window.google) {
      window.google.accounts.id.disableAutoSelect();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
        googleInitialized,
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

// Extend Window interface for Google Sign-In
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: () => void;
          renderButton: (element: HTMLElement, config: any) => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}
