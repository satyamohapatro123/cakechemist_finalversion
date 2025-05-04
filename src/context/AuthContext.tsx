import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<User | null>;
  loginWithGoogle: () => Promise<User | null>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing user session on mount
  useEffect(() => {
    const checkUserSession = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to parse user from localStorage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserSession();
  }, []);

  // Mock login function (in a real app, this would call an API)
  const login = async (email: string, password: string): Promise<User | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // For demo purposes, accept any email/password with basic validation
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Single admin credential check
      const isAdmin = email === 'admin@cakechemist.com' && password === 'admin123';

      // For regular users, accept any credentials except the admin email with wrong password
      if (email === 'admin@cakechemist.com' && !isAdmin) {
        throw new Error('Invalid admin credentials');
      }

      // Create user object
      const newUser: User = {
        id: `user_${Date.now()}`,
        name: isAdmin ? 'Admin' : email.split('@')[0],
        email,
        isAdmin,
        photoURL: undefined
      };

      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);

      return newUser;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Mock Google login (in a real app, this would use Firebase or another auth provider)
  const loginWithGoogle = async (): Promise<User | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In a real app, this would open a Google auth popup
      // For demo, create a mock Google user
      const mockGoogleUser: User = {
        id: `google_${Date.now()}`,
        name: 'Google User',
        email: 'user@gmail.com',
        photoURL: 'https://lh3.googleusercontent.com/a/default-user',
        isAdmin: false
      };

      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(mockGoogleUser));
      setUser(mockGoogleUser);

      return mockGoogleUser;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to login with Google');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);

    try {
      // Remove user from localStorage
      localStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string): Promise<User | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Validate inputs
      if (!name || !email || !password) {
        throw new Error('Name, email, and password are required');
      }

      // Create user object
      const newUser: User = {
        id: `user_${Date.now()}`,
        name,
        email,
        isAdmin: false
      };

      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);

      return newUser;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Registration failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    error,
    login,
    loginWithGoogle,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
