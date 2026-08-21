import jwt from 'jsonwebtoken';
import { config } from '../config';

export interface FirebaseIdentity {
  email: string;
  displayName: string;
  firebaseUid: string;
}

const CERTS_URL =
  'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';

let certsCache: { certs: Record<string, string>; expiresAt: number } | null = null;

async function getSecureTokenCerts(): Promise<Record<string, string>> {
  if (certsCache && Date.now() < certsCache.expiresAt) {
    return certsCache.certs;
  }

  const res = await fetch(CERTS_URL);
  if (!res.ok) {
    throw new Error('Could not verify sign-in token');
  }

  const cacheControl = res.headers.get('cache-control') || '';
  const maxAge = Number(/max-age=(\d+)/.exec(cacheControl)?.[1] || 3600);
  const certs = (await res.json()) as Record<string, string>;
  certsCache = { certs, expiresAt: Date.now() + maxAge * 1000 };
  return certs;
}

interface LookupUser {
  localId?: string;
  email?: string;
  displayName?: string;
}

async function lookupFirebaseAccount(idToken: string): Promise<FirebaseIdentity> {
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${config.firebaseWebApiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    }
  );

  const data = (await res.json()) as { users?: LookupUser[]; error?: { message?: string } };
  const user = data.users?.[0];

  if (!res.ok || !user?.email || !user.localId) {
    throw new Error(data.error?.message || 'Could not verify sign-in token');
  }

  return {
    email: user.email,
    displayName: user.displayName || user.email.split('@')[0],
    firebaseUid: user.localId,
  };
}

export async function verifyFirebaseIdToken(idToken: string): Promise<FirebaseIdentity> {
  try {
    const decoded = jwt.decode(idToken, { complete: true });
    if (!decoded || typeof decoded === 'string' || !decoded.header.kid) {
      throw new Error('Invalid sign-in token');
    }

    const certs = await getSecureTokenCerts();
    const cert = certs[decoded.header.kid];
    if (!cert) {
      throw new Error('Invalid sign-in token');
    }

    const payload = jwt.verify(idToken, cert, {
      algorithms: ['RS256'],
      audience: config.firebaseProjectId,
      issuer: `https://securetoken.google.com/${config.firebaseProjectId}`,
    }) as jwt.JwtPayload;

    const email = typeof payload.email === 'string' ? payload.email : '';
    if (!email) {
      throw new Error('Account is missing an email');
    }

    return {
      email,
      displayName:
        (typeof payload.name === 'string' && payload.name) || email.split('@')[0],
      firebaseUid:
        (typeof payload.user_id === 'string' && payload.user_id) ||
        (typeof payload.sub === 'string' && payload.sub) ||
        '',
    };
  } catch {
    return lookupFirebaseAccount(idToken);
  }
}
