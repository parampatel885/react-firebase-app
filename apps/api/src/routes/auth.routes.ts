import { Router, type Request, type Response } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { createUser, findOrCreateOAuthUser, validateCredentials } from '../services/user.service';
import { verifyFirebaseIdToken } from '../utils/firebase-token';
import { signToken } from '../utils/jwt';

const router = Router();

router.post('/register', async (req, res) => {
  const { email, password, displayName } = req.body as {
    email?: string;
    password?: string;
    displayName?: string;
  };

  if (!email || !password || !displayName?.trim()) {
    res.status(400).json({ message: 'Email, password, and display name are required' });
    return;
  }

  try {
    const user = await createUser(email, password, displayName);
    const token = signToken({ userId: user.id, email: user.email });

    res.status(201).json({ token, user });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Registration failed';
    res.status(400).json({ message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    res.status(400).json({ message: 'Email and password required' });
    return;
  }

  const user = await validateCredentials(email, password);

  if (!user) {
    res.status(401).json({ message: 'Invalid email or password' });
    return;
  }

  const token = signToken({ userId: user.id, email: user.email });
  res.json({ token, user });
});

async function handleFirebaseSignIn(req: Request, res: Response) {
  const { idToken } = req.body as { idToken?: string };

  if (!idToken) {
    res.status(400).json({ message: 'Firebase ID token is required' });
    return;
  }

  try {
    const identity = await verifyFirebaseIdToken(idToken);
    const user = findOrCreateOAuthUser(
      identity.email,
      identity.displayName,
      identity.firebaseUid
    );
    const token = signToken({ userId: user.id, email: user.email });
    res.json({ token, user });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Sign-in failed';
    res.status(401).json({ message });
  }
}

router.post('/firebase', handleFirebaseSignIn);
router.post('/google', handleFirebaseSignIn);

router.get('/me', authenticate, (req, res) => {
  res.json({ user: req.user });
});

export default router;
