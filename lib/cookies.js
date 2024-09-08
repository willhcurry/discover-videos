import cookie from "cookie";

// Define the maximum age of the token cookie (7 days)
const MAX_AGE = 7 * 24 * 60 * 60;

// Export a function to set the token cookie
export const setTokenCookie = (token, res) => {
  // Serialize the token cookie with options
  const setCookie = cookie.serialize("token", token, {
    // Set the maximum age of the cookie
    maxAge: MAX_AGE,
    // Set the expiration date of the cookie
    expires: new Date(Date.now() + MAX_AGE * 1000),
    // Set the secure flag based on the environment
    secure: process.env.NODE_ENV === "production",
    // Set the path of the cookie
    path: "/",
  });

  // Set the Set-Cookie header in the response
  res.setHeader("Set-Cookie", setCookie);
};