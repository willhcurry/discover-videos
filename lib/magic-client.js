import { Magic } from 'magic-sdk';

// Define a function to create a Magic instance
const createMagic = () => {
  // Check if the window object is defined (i.e., we're in a browser environment)
  if (typeof window !== 'undefined') {
    // Return a new Magic instance with the publishable API key from environment variables
    return new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_API_KEY);
  } else {
    // If we're in a server-side environment, return null
    return null;
  }
};

// Export the Magic instance as a constant
export const magic = createMagic();

// Log a message to confirm Magic setup
console.log('magic setup', magic);