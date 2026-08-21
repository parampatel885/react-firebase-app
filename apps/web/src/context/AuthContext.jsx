import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { collection, deleteDoc, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../config/firebase-config';
import { hasPasswordProvider } from '../lib/firebaseAuthErrors';

const AuthContext = createContext(null);

async function syncUserToFirestore(user) {
  if (!user?.id || !user.email) return;

  const email = user.email.trim().toLowerCase();

  try {
    await setDoc(doc(db, 'users', user.id), {
      displayName: user.displayName || '',
      email,
    }, { merge: true });

    const duplicates = await getDocs(query(collection(db, 'users'), where('email', '==', email)));
    await Promise.all(
      duplicates.docs
        .filter((snapshot) => snapshot.id !== user.id)
        .map((snapshot) => deleteDoc(snapshot.ref))
    );
  } catch (err) {
    console.warn('Could not sync user profile:', err.message);
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasPassword, setHasPassword] = useState(false);

  const refreshProviders = useCallback(() => {
    setHasPassword(hasPasswordProvider(auth.currentUser));
  }, []);

  const markHasPassword = useCallback(() => {
    setHasPassword(true);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const profile = {
          id: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
        };
        setUser(profile);
        setHasPassword(hasPasswordProvider(firebaseUser));
        await syncUserToFirestore(profile);
      } else {
        setUser(null);
        setHasPassword(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = () => {
    setUser(null);
    setHasPassword(false);
    signOut(auth).catch(() => {});
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, hasPassword, refreshProviders, markHasPassword, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
