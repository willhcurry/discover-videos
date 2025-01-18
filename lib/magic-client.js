import { Magic } from 'magic-sdk';

const createMagic = () => {
  // Add debug logging
  console.log('Magic Key:', process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_API_KEY);
  
  if (typeof window !== 'undefined') {
    const key = process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_API_KEY;
    if (!key) {
      console.error('Magic key is missing!');
      return null;
    }
    // Log the key being used
    console.log('Initializing Magic with key:', key);
    return new Magic(key);
  }
  return null;
};

export const magic = createMagic();