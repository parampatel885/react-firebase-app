export function firebaseAuthMessage(err) {
  switch (err.code) {
    case 'auth/email-already-in-use':
      return 'Email already registered. Sign in instead.';
    case 'auth/account-exists-with-different-credential':
      return 'This email is already used with a different sign-in method. Use the original method (Google or email/password).';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Invalid email or password';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters';
    case 'auth/operation-not-allowed':
      return 'Email sign-in is not enabled. Enable Email/Password in Firebase Authentication.';
    case 'auth/requires-recent-login':
      return 'For security, sign in again and then set your password.';
    case 'auth/provider-already-linked':
      return 'A password is already set on this account.';
    default:
      return err.message || 'Something went wrong';
  }
}

export function hasPasswordProvider(firebaseUser) {
  return Boolean(firebaseUser?.providerData?.some((provider) => provider.providerId === 'password'));
}
