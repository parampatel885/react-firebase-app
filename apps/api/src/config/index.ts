const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET environment variable is required in production');
}

export const config = {
  jwtSecret: jwtSecret || 'dev-jwt-secret-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '25m',
  port: Number(process.env.PORT) || 4000,
  firebaseProjectId: process.env.FIREBASE_PROJECT_ID || 'playpal-9b5e9',
  firebaseWebApiKey:
    process.env.FIREBASE_WEB_API_KEY || 'AIzaSyAkg7PqC_aZflY4HARUtyeYAdcF80i_Z1U',
};
