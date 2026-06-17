import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from '../services/firebase';
import { User } from '../types';

const ADMIN_EMAIL = 'nimrahshahid744@gmail.com';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isLoadingAuth: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getFirebaseErrorMessage = (error: FirebaseError): string => {
  switch (error.code) {
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in popup was closed before completing.';
    default:
      return 'Something went wrong. Please try again.';
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const mappedUser: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email ?? '',
          name: firebaseUser.displayName ?? firebaseUser.email?.split('@')[0] ?? 'User',
          role: firebaseUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'customer',
        };
        setUser(mappedUser);
      } else {
        setUser(null);
      }
      setIsLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  const isAdmin = user?.role === 'admin';

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const isAdminUser = email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();

      if (!isAdminUser && !credential.user.emailVerified) {
        await signOut(auth);
        return { success: false, message: 'Please verify your email before logging in. Check your inbox.' };
      }

      return { success: true, message: isAdminUser ? 'Welcome back, Admin.' : 'Welcome back!' };
    } catch (err) {
      return {
        success: false,
        message: err instanceof FirebaseError ? getFirebaseErrorMessage(err) : 'Login failed. Please try again.',
      };
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string }> => {
    if (email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      return { success: false, message: 'This email is not available for registration.' };
    }
    try {
      const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await updateProfile(credential.user, { displayName: name.trim() });
      await sendEmailVerification(credential.user);
      await signOut(auth);

      return {
        success: true,
        message: `Account created! A verification link has been sent to ${email.trim()}. Please check your inbox.`,
      };
    } catch (err) {
      return {
        success: false,
        message: err instanceof FirebaseError ? getFirebaseErrorMessage(err) : 'Sign up failed. Please try again.',
      };
    }
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; message: string }> => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const isAdminUser = result.user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
      return { success: true, message: isAdminUser ? 'Welcome back, Admin.' : 'Welcome back!' };
    } catch (err) {
      return {
        success: false,
        message: err instanceof FirebaseError ? getFirebaseErrorMessage(err) : 'Google sign-in failed.',
      };
    }
  };

  const logout = async (): Promise<void> => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, isLoadingAuth, login, signup, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};