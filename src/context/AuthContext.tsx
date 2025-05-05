import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  hashPassword,
  verifyPassword,
  generateToken,
  verifyToken,
  validatePasswordStrength,
  validateEmail,
  sanitizeInput
} from '@/utils/security';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  profilePicture?: string;
  role: 'user' | 'admin';
  permissions?: {
    manageProducts: boolean;
    manageOrders: boolean;
    manageUsers: boolean;
    manageFinancials: boolean;
    manageSettings: boolean;
  };
  createdAt: string;
  lastLogin?: string;
  twoFactorEnabled?: boolean;
}

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<User | null>;
  loginWithGoogle: () => Promise<User | null>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<User | null>;
  updateProfile: (userData: Partial<User>) => Promise<User | null>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  isAuthenticated: boolean;
  isAdmin: boolean;
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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check for existing user session on mount
  useEffect(() => {
    const checkUserSession = () => {
      try {
        // Clear localStorage to fix any existing issues
        localStorage.removeItem('currentUser');
        localStorage.removeItem('users');

        // Create default admin user
        const adminUser: User = {
          id: 'admin_1',
          name: 'Admin',
          email: 'admin@cakechemist.com',
          role: 'admin',
          permissions: {
            manageProducts: true,
            manageOrders: true,
            manageUsers: true,
            manageFinancials: true,
            manageSettings: true
          },
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          // @ts-ignore
          password: hashPassword('admin123')
        };

        // Store admin user in users list
        localStorage.setItem('users', JSON.stringify([adminUser]));

        // Check for existing user session
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          const userData = JSON.parse(storedUser) as User;
          setCurrentUser(userData);
          setIsAuthenticated(true);
          setIsAdmin(userData.role === 'admin');

          // Update last login time
          const updatedUser = {
            ...userData,
            lastLogin: new Date().toISOString()
          };
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
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
      // Validate inputs
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      if (!validateEmail(email)) {
        throw new Error('Please enter a valid email address');
      }

      // Sanitize inputs
      const sanitizedEmail = sanitizeInput(email);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if user exists in localStorage (simulating a database)
      const users = localStorage.getItem('users');
      let usersList: User[] = [];

      if (users) {
        usersList = JSON.parse(users);
      } else {
        // Initialize with default admin user if no users exist
        const adminUser: User = {
          id: 'admin_1',
          name: 'Admin',
          email: 'admin@cakechemist.com',
          role: 'admin',
          permissions: {
            manageProducts: true,
            manageOrders: true,
            manageUsers: true,
            manageFinancials: true,
            manageSettings: true
          },
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          // In a real app, this would be a hashed password
          // For demo purposes, we're storing it in plain text
          // @ts-ignore
          password: hashPassword('admin123')
        };

        usersList = [adminUser];
        localStorage.setItem('users', JSON.stringify(usersList));
      }

      // Find user by email
      const user = usersList.find(u => u.email === sanitizedEmail);

      if (!user) {
        throw new Error('User not found');
      }

      // In a real app, we would verify the password hash
      // For demo purposes, we're using a simple hash comparison
      // @ts-ignore
      const hashedInput = hashPassword(password);
      // @ts-ignore
      const storedHash = user.password;

      console.log('Input password:', password);
      console.log('Hashed input:', hashedInput);
      console.log('Stored hash:', storedHash);

      if (hashedInput !== storedHash) {
        throw new Error('Invalid password');
      }

      // Update last login time
      const updatedUser = {
        ...user,
        lastLogin: new Date().toISOString()
      };

      // Update user in localStorage
      const updatedUsers = usersList.map(u => u.id === user.id ? updatedUser : u);
      localStorage.setItem('users', JSON.stringify(updatedUsers));

      // Remove password before storing in currentUser
      // @ts-ignore
      const { password: _, ...userWithoutPassword } = updatedUser;

      // Set current user
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      setCurrentUser(userWithoutPassword);
      setIsAuthenticated(true);
      setIsAdmin(userWithoutPassword.role === 'admin');

      return userWithoutPassword;
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
      const googleUser: User = {
        id: `google_${Date.now()}`,
        name: 'Rahul Sharma',
        email: 'rahul.sharma@gmail.com',
        profilePicture: 'https://lh3.googleusercontent.com/a/default-user',
        role: 'user',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        phone: '+91 9876543210',
        address: '123 Main Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001'
      };

      // Check if user already exists
      const users = localStorage.getItem('users');
      let usersList: User[] = [];

      if (users) {
        usersList = JSON.parse(users);
        const existingUser = usersList.find(u => u.email === googleUser.email);

        if (existingUser) {
          // Update last login time
          const updatedUser = {
            ...existingUser,
            lastLogin: new Date().toISOString()
          };

          // Update user in localStorage
          const updatedUsers = usersList.map(u => u.id === existingUser.id ? updatedUser : u);
          localStorage.setItem('users', JSON.stringify(updatedUsers));

          // Set current user
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
          setCurrentUser(updatedUser);
          setIsAuthenticated(true);
          setIsAdmin(updatedUser.role === 'admin');

          return updatedUser;
        }
      } else {
        usersList = [];
      }

      // Add new user to users list
      usersList.push(googleUser);
      localStorage.setItem('users', JSON.stringify(usersList));

      // Set current user
      localStorage.setItem('currentUser', JSON.stringify(googleUser));
      setCurrentUser(googleUser);
      setIsAuthenticated(true);
      setIsAdmin(false);

      return googleUser;
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
      // Remove current user from localStorage
      localStorage.removeItem('currentUser');
      setCurrentUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
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
      // Validate inputs
      if (!name || !email || !password) {
        throw new Error('Name, email, and password are required');
      }

      if (!validateEmail(email)) {
        throw new Error('Please enter a valid email address');
      }

      const passwordValidation = validatePasswordStrength(password);
      if (!passwordValidation.valid) {
        throw new Error(passwordValidation.message);
      }

      // Sanitize inputs
      const sanitizedName = sanitizeInput(name);
      const sanitizedEmail = sanitizeInput(email);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if user already exists
      const users = localStorage.getItem('users');
      let usersList: User[] = [];

      if (users) {
        usersList = JSON.parse(users);
        const existingUser = usersList.find(u => u.email === sanitizedEmail);

        if (existingUser) {
          throw new Error('User with this email already exists');
        }
      } else {
        usersList = [];
      }

      // Create user object
      const newUser: User = {
        id: `user_${Date.now()}`,
        name: sanitizedName,
        email: sanitizedEmail,
        role: 'user',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        // In a real app, this would be a hashed password
        // @ts-ignore
        password: hashPassword(password)
      };

      // Add user to users list
      usersList.push(newUser);
      localStorage.setItem('users', JSON.stringify(usersList));

      // Remove password before storing in currentUser
      // @ts-ignore
      const { password: _, ...userWithoutPassword } = newUser;

      // Set current user
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      setCurrentUser(userWithoutPassword);
      setIsAuthenticated(true);
      setIsAdmin(false);

      return userWithoutPassword;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Registration failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Update profile function
  const updateProfile = async (userData: Partial<User>): Promise<User | null> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!currentUser) {
        throw new Error('No user is currently logged in');
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update user data
      const updatedUser = {
        ...currentUser,
        ...userData
      };

      // Update user in localStorage
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));

      // Update user in users list
      const users = localStorage.getItem('users');
      if (users) {
        const usersList = JSON.parse(users);
        const updatedUsers = usersList.map((u: User) =>
          u.id === currentUser.id ? { ...u, ...userData } : u
        );
        localStorage.setItem('users', JSON.stringify(updatedUsers));
      }

      setCurrentUser(updatedUser);
      return updatedUser;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update profile');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Change password function
  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!currentUser) {
        throw new Error('No user is currently logged in');
      }

      // Validate new password
      const passwordValidation = validatePasswordStrength(newPassword);
      if (!passwordValidation.valid) {
        throw new Error(passwordValidation.message);
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get user with password from users list
      const users = localStorage.getItem('users');
      if (!users) {
        throw new Error('User database not found');
      }

      const usersList = JSON.parse(users);
      const user = usersList.find((u: User) => u.id === currentUser.id);

      if (!user) {
        throw new Error('User not found in database');
      }

      // Verify current password
      // @ts-ignore
      if (user.password !== hashPassword(currentPassword)) {
        throw new Error('Current password is incorrect');
      }

      // Update password
      const updatedUser = {
        ...user,
        // @ts-ignore
        password: hashPassword(newPassword)
      };

      // Update user in users list
      const updatedUsers = usersList.map((u: User) =>
        u.id === currentUser.id ? updatedUser : u
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));

      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to change password');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    currentUser,
    isLoading,
    error,
    login,
    loginWithGoogle,
    logout,
    register,
    updateProfile,
    changePassword,
    isAuthenticated,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
