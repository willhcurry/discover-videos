import jwt from 'jsonwebtoken';

export async function verifyToken(token) {
  if (token) {
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decodedToken?.issuer;
      return userId || null;
    } catch (error) {
      console.error('Error verifying token:', error);
      return null;
    }
  }
  return null;
}