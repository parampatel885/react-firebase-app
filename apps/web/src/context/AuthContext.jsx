import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getMe, clearToken, setToken, getToken, loginWithFirebase } from '../lib/api';
import { collection, deleteDoc, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../config/firebase-config';
import { hasPasswordProvider } from '../lib/firebaseAuthErrors';

const AuthContext = createContext(null);
const TOKEN_REFRESH_MS = 20 * 60 * 1000;

function waitForFirebaseAuth() {
  return new Promise((resolve) => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      unsub();
      resolve(firebaseUser);
    });
  });
}

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

  const restoreSession = useCallback(async () => {
    const firebaseUser = await waitForFirebaseAuth();

    if (firebaseUser) {
      try {
        const idToken = await firebaseUser.getIdToken();
        const { token, user: profile } = await loginWithFirebase(idToken);
        setToken(token);
        setUser(profile);
        setHasPassword(hasPasswordProvider(firebaseUser));
        await syncUserToFirestore(profile);
        setLoading(false);
        return;
      } catch {
        /* fall back to stored JWT */
      }
    }

    if (!getToken()) {
      setLoading(false);
      return;
    }

    try {
      const { user: profile } = await getMe();
      setUser(profile);
      refreshProviders();
    } catch {
      clearToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  const refreshSession = useCallback(async () => {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) return;

    try {
      const idToken = await firebaseUser.getIdToken(true);
      const { token, user: profile } = await loginWithFirebase(idToken);
      setToken(token);
      setUser(profile);
    } catch (err) {
      console.warn('Could not refresh session:', err.message);
    }
  }, []);

  useEffect(() => {
    if (!user) return undefined;

    const timer = setInterval(() => {
      refreshSession();
    }, TOKEN_REFRESH_MS);

    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        refreshSession();
      }
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [user, refreshSession]);

  const loginWithToken = async (token, profile) => {
    setToken(token);
    setUser(profile);
    refreshProviders();
    await syncUserToFirestore(profile);
  };

  const logout = () => {
    clearToken();
    setUser(null);
    setHasPassword(false);
    signOut(auth).catch(() => {});
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, hasPassword, refreshProviders, markHasPassword, loginWithToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
