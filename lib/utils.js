
import jwt from 'jsonwebtoken';

export async function verifyToken(token) {
  if (!token) {
    throw new Error('No token provided');
  }

  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded.issuer);
      }
    });
  });
}