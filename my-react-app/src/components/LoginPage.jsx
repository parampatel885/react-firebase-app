import React, { useState } from 'react';
import './LoginPage.css';
import { auth, googleProvider, db } from '../config/firebase-config';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useLocation, useNavigate } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const saveUserToFirestore = async (user, displayName) => {
    if (!user) return;
    await setDoc(doc(db, 'users', user.uid), {
      displayName: displayName || user.displayName || '',
      email: user.email || ''
    }, { merge: true });
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let userCredential;
      if (isRegister) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Set displayName in Firebase Auth
        await updateProfile(userCredential.user, { displayName: name });
        await saveUserToFirestore(userCredential.user, name);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
        await saveUserToFirestore(userCredential.user, userCredential.user.displayName);
      }
      onLogin(userCredential.user);
      // Redirect to intended destination after login
      const redirectTo = location.state?.from || '/create';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await saveUserToFirestore(result.user, result.user.displayName);
      onLogin(result.user);
      // Redirect to intended destination after login
      const redirectTo = location.state?.from || '/create';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleAuth}>
        <h2>{isRegister ? 'Register' : 'Login'} to PlayPal</h2>
        {error && <div className="login-error">{error}</div>}
        {isRegister && (
          <>
            <label htmlFor="name">Name:</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              autoComplete="name"
              required
            />
          </>
        )}
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete={isRegister ? "new-password" : "current-password"}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? (isRegister ? 'Registering...' : 'Logging in...') : (isRegister ? 'Register' : 'Login')}
        </button>
        <button type="button" className="google-btn" onClick={handleGoogleSignIn} disabled={loading}>
          <FcGoogle />
          {loading ? 'Please wait...' : '  Sign in with Google'}
        </button>
        <div className="toggle-auth-mode">
          {isRegister ? (
            <>
              Already have an account?{' '}
              <span className="auth-link" onClick={() => setIsRegister(false)}>Login</span>
            </>
          ) : (
            <>
              Don&apos;t have an account?{' '}
              <span className="auth-link" onClick={() => setIsRegister(true)}>Register</span>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPage; 