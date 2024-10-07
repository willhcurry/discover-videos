import { magicAdmin } from "../../lib/magic";
import jwt from "jsonwebtoken";
import { createNewUser, isNewUser } from "../../lib/db/hasura";
import { setTokenCookie } from "../../lib/cookies";

// Export the login function as the default export
export default async function login(req, res) {
  // Check if the request method is POST
  if (req.method === "POST") {
    try {
      // Extract the authorization header and DID token
      const auth = req.headers.authorization;
      const didToken = auth ? auth.substr(7) : "";

      // Get the user metadata from Magic
      const metadata = await magicAdmin.users.getMetadataByToken(didToken);

      // Create a JSON Web Token (JWT) with the user metadata and claims
      const token = jwt.sign(
        {
          ...metadata,
          // Set the issued at time
          iat: Math.floor(Date.now() / 1000),
          // Set the expiration time (7 days)
          exp: Math.floor(Date.now() / 1000 + 7 * 24 * 60 * 60),
          // Set the Hasura JWT claims
          "https://hasura.io/jwt/claims": {
            "x-hasura-allowed-roles": ["user", "admin"],
            "x-hasura-default-role": "user",
            "x-hasura-user-id": `${metadata.issuer}`,
          },
        },
        // Use the JWT secret from the environment variables
        process.env.JWT_SECRET
      );

      // Check if the user is new
      const isNewUserQuery = await isNewUser(token, metadata.issuer);

      // If the user is new, create a new user in the database
      if (isNewUserQuery) {
        await createNewUser(token, metadata);
      }

      // Set the token cookie
      setTokenCookie(token, res);

      // Send a success response
      res.send({ done: true });
    } catch (error) {
      // Log any errors and send a 500 error response
      console.error("Something went wrong logging in", error);
      res.status(500).send({ done: false });
    }
  } else {
    // Send a 405 error response for non-POST requests
    res.send({ done: false });
  }
}