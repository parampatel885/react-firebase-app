import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
}

interface StoredUser extends AuthUser {
  passwordHash?: string;
  firebaseUid?: string;
}

const users = new Map<string, StoredUser>();

export async function createUser(
  email: string,
  password: string,
  displayName: string
): Promise<AuthUser> {
  const normalizedEmail = email.trim().toLowerCase();

  if (findByEmail(normalizedEmail)) {
    throw new Error('Email already registered');
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user: StoredUser = {
    id: randomUUID(),
    email: normalizedEmail,
    displayName: displayName.trim(),
    passwordHash,
  };

  users.set(user.id, user);
  return toPublicUser(user);
}

export async function validateCredentials(
  email: string,
  password: string
): Promise<AuthUser | null> {
  const user = findByEmail(email.trim().toLowerCase());
  if (!user?.passwordHash) return null;

  const valid = await bcrypt.compare(password, user.passwordHash);
  return valid ? toPublicUser(user) : null;
}

export function findOrCreateOAuthUser(
  email: string,
  displayName: string,
  firebaseUid: string
): AuthUser {
  const normalizedEmail = email.trim().toLowerCase();
  const name = displayName.trim() || normalizedEmail.split('@')[0];

  const byUid = [...users.values()].find((user) => user.firebaseUid === firebaseUid);
  if (byUid) return toPublicUser(byUid);

  const byEmail = findByEmail(normalizedEmail);
  if (byEmail) {
    users.delete(byEmail.id);
    byEmail.id = firebaseUid;
    byEmail.firebaseUid = firebaseUid;
    if (name && !byEmail.displayName) {
      byEmail.displayName = name;
    }
    users.set(firebaseUid, byEmail);
    return toPublicUser(byEmail);
  }

  const user: StoredUser = {
    id: firebaseUid,
    email: normalizedEmail,
    displayName: name,
    firebaseUid,
  };

  users.set(user.id, user);
  return toPublicUser(user);
}

export function findUserById(id: string): AuthUser | null {
  const user = users.get(id);
  return user ? toPublicUser(user) : null;
}

function findByEmail(email: string): StoredUser | undefined {
  return [...users.values()].find((user) => user.email === email);
}

function toPublicUser(user: StoredUser): AuthUser {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
  };
}
