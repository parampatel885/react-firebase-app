import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  EmailAuthProvider,
  linkWithCredential,
  reauthenticateWithPopup,
  updatePassword,
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase-config';
import { useAuth } from '../context/AuthContext';
import { firebaseAuthMessage, hasPasswordProvider } from '../lib/firebaseAuthErrors';
import PasswordField from './PasswordField';
import './LoginPage.css';
import './AccountPage.css';

const AccountPage = () => {
  const { user, refreshProviders, markHasPassword, hasPassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const afterSaveTo = location.state?.from && location.state.from !== '/account'
    ? location.state.from
    : '/teams';

  const handleSetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    const firebaseUser = auth.currentUser;
    if (!firebaseUser?.email) {
      setError('You must be signed in to set a password.');
      return;
    }

    const settingForFirstTime = !hasPasswordProvider(firebaseUser) && !hasPassword;

    setLoading(true);
    try {
      if (!settingForFirstTime) {
        await updatePassword(firebaseUser, password);
      } else {
        const credential = EmailAuthProvider.credential(firebaseUser.email, password);
        try {
          await linkWithCredential(firebaseUser, credential);
        } catch (err) {
          if (err.code === 'auth/requires-recent-login') {
            await reauthenticateWithPopup(firebaseUser, googleProvider);
            await linkWithCredential(
              auth.currentUser,
              EmailAuthProvider.credential(firebaseUser.email, password)
            );
          } else {
            throw err;
          }
        }
      }

      refreshProviders();
      markHasPassword();
      setPassword('');
      setConfirm('');

      if (settingForFirstTime) {
        navigate(afterSaveTo, { replace: true });
        return;
      }

      setSuccess('Password updated.');
    } catch (err) {
      setError(firebaseAuthMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page page page--centered">
      <div className="login-card card">
        <div className="login-card__header">
          <h1>{hasPassword ? 'Change password' : 'Set a password'}</h1>
          <p>
            {hasPassword
              ? 'Update the password for email sign-in on this account.'
              : 'You have not set a password. Please set a password for your account.'}
          </p>
        </div>

        <p className="account-email">{user?.email}</p>

        {error && <div className="alert alert--error">{error}</div>}
        {success && <div className="alert alert--success">{success}</div>}

        <form className="login-form" onSubmit={handleSetPassword}>
          <PasswordField
            id="new-password"
            label={hasPassword ? 'New password' : 'Password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
          <PasswordField
            id="confirm-password"
            label="Confirm password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
            required
          />
          <button type="submit" className="btn btn--primary btn--block" disabled={loading}>
            {loading ? 'Saving…' : hasPassword ? 'Update password' : 'Save password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AccountPage;
