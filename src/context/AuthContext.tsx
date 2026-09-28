import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../lib/firebase';
import {
  signInWithEmail,
  signUpWithEmail,
  signOutUser,
  resetPassword as authResetPassword,
  updateUserDisplayName
} from '../lib/auth';
import {
  autoSyncUserData,
  syncUserData,
  flushPendingSyncs
} from '../lib/firestore';
import { localStore } from '../storage/localStore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isConfigured: boolean;
  authModalOpen: boolean;
  authModalTab: 'signin' | 'signup';
  openAuthModal: (tab?: 'signin' | 'signup') => void;
  closeAuthModal: () => void;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string, name?: string, leaderboardOptIn?: boolean) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateDisplayName: (name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'signin' | 'signup'>('signin');

  useEffect(() => {
    if (!auth || !isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      localStore.setUser(currentUser ? currentUser.uid : null);
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        // Automatically and silently sync user's cloud records to their scoped local namespace
        syncUserData(currentUser.uid).catch((err) => {
          console.warn('Background initial cloud sync deferred:', err);
        });
      }
    });

    // Automatic reconnect listener to flush pending offline queue
    const handleOnline = () => {
      if (auth && auth.currentUser) {
        flushPendingSyncs(auth.currentUser.uid).catch((err) => {
          console.warn('Background online flush deferred:', err);
        });
      }
    };

    window.addEventListener('online', handleOnline);

    return () => {
      unsubscribe();
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  const openAuthModal = (tab: 'signin' | 'signup' = 'signin') => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const signIn = async (email: string, pass: string) => {
    const signedInUser = await signInWithEmail(email, pass);
    closeAuthModal();
    if (signedInUser) {
      localStore.setUser(signedInUser.uid);
      syncUserData(signedInUser.uid).catch(() => {});
    }
  };

  const signUp = async (email: string, pass: string, name?: string, leaderboardOptIn: boolean = false) => {
    const signedUpUser = await signUpWithEmail(email, pass, name, leaderboardOptIn);
    closeAuthModal();
    if (signedUpUser) {
      localStore.setUser(signedUpUser.uid);
      syncUserData(signedUpUser.uid).catch(() => {});
    }
  };

  const signOut = async () => {
    localStore.clearActiveSession();
    await signOutUser();
    localStore.setUser(null);
  };

  const resetPassword = async (email: string) => {
    await authResetPassword(email);
  };

  const updateDisplayName = async (name: string) => {
    if (!user) return;
    await updateUserDisplayName(user, name);
    // Force a fresh user object in state so components re-render immediately
    if (auth?.currentUser) {
      setUser({ ...auth.currentUser } as User);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isConfigured: isFirebaseConfigured,
        authModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updateDisplayName
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

