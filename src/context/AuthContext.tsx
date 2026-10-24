import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut,
  signInAnonymously
} from 'firebase/auth';
import { auth, googleProvider, testConnection } from '../firebase/config';
import { 
  saveUserProfileToFirestore, 
  loadUserProfileFromFirestore, 
  loadProgressFromFirestore,
  saveProgressToFirestore,
  FirestoreUserProfile
} from '../firebase/firestoreService';
import { UserProgressData } from '../types/vlsi';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  authError: string | null;
  isFirestoreConnected: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  clearAuthError: () => void;
  // Demo isolation account mechanism
  demoAccount: 'real' | 'student_alpha' | 'student_beta';
  setDemoAccount: (account: 'real' | 'student_alpha' | 'student_beta') => void;
  effectiveUid: string;
  effectiveEmail: string;
  effectiveName: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isFirestoreConnected, setIsFirestoreConnected] = useState(true);
  const [demoAccount, setDemoAccount] = useState<'real' | 'student_alpha' | 'student_beta'>('real');

  useEffect(() => {
    // Test initial connection
    testConnection().then(connected => {
      setIsFirestoreConnected(connected);
    });

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        // Automatically save/sync user profile
        try {
          await saveUserProfileToFirestore({
            uid: currentUser.uid,
            email: currentUser.email || 'student@vlsilab.edu',
            displayName: currentUser.displayName || 'ECE Student',
            targetRole: 'ASIC / FPGA Design Engineer',
          });
        } catch (err) {
          console.warn('Profile sync notice:', err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('popup-closed-by-user')) {
        setAuthError('Sign-in cancelled: The login popup was closed before completing authentication.');
      } else if (msg.includes('network-request-failed')) {
        setAuthError('Network error: Unable to contact Google authentication service. Check connectivity.');
      } else {
        setAuthError(`Authentication error: ${msg}`);
      }
    }
  };

  const signOutUser = async () => {
    setAuthError(null);
    try {
      await signOut(auth);
      setDemoAccount('real');
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : String(err));
    }
  };

  const clearAuthError = () => setAuthError(null);

  // Compute effective user identity for isolation testing
  const effectiveUid = demoAccount === 'student_alpha'
    ? 'student_alpha_ece2026'
    : demoAccount === 'student_beta'
    ? 'student_beta_vlsi2026'
    : (user?.uid || 'guest_ece_student');

  const effectiveEmail = demoAccount === 'student_alpha'
    ? 'student.alpha@ece.university.edu'
    : demoAccount === 'student_beta'
    ? 'student.beta@vlsi.university.edu'
    : (user?.email || 'guest@vlsilab.edu');

  const effectiveName = demoAccount === 'student_alpha'
    ? 'Student Alpha (RTL Design Track)'
    : demoAccount === 'student_beta'
    ? 'Student Beta (Verification Track)'
    : (user?.displayName || 'ECE Student');

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authError,
        isFirestoreConnected,
        signInWithGoogle,
        signOutUser,
        clearAuthError,
        demoAccount,
        setDemoAccount,
        effectiveUid,
        effectiveEmail,
        effectiveName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
