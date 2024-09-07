import { magicAdmin } from '../../lib/magic';
import jwt from 'jsonwebtoken';
import { isNewUser, createNewUser } from '../../lib/db/hasura';

export default async function login(req, res) {
    if(req.method === "POST") {
        try {
            const auth = req.headers.authorization;
            const didToken = auth ? auth.substr(7) : "";
            
            const metadata = await magicAdmin.users.getMetadataByToken(didToken);
            
            const token = jwt.sign({
                ...metadata,
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor(Date.now() / 1000 + 7 * 24 * 60 * 60),
                "https://hasura.io/jwt/claims": {
                    "x-hasura-allowed-roles": ["user", "admin"],
                    "x-hasura-default-role": "user",
                    "x-hasura-user-id": `${metadata.issuer}`,
                },
            },
            process.env.JWT_SECRET
        );
            
            try {
                const isNewUserQuery = await isNewUser(token, metadata);
                if (isNewUserQuery) {
                    try {
                        const newUser = await createNewUser(token, metadata);
                        res.status(201).json({ done: true, msg: "New user created", user: newUser });
                    } catch (error) {
                        if (error.message.includes("users_email_key")) {
                            res.status(409).json({ done: false, error: "Email already registered" });
                        } else {
                            throw error; // Re-throw if it's not a duplicate email error
                        }
                    }
                } else {
                    res.status(200).json({ done: true, msg: "User already exists" });
                }
            } catch (error) {
                console.error('Error in user check or creation:', error);
                res.status(500).json({ done: false, error: error.message });
            }
        } catch(error) {
            console.error('Something went wrong logging in', error);
            res.status(500).json({ done: false, error: error.message });
        }
    } else {
        res.status(405).json({ done: false, error: "Method not allowed" });
    }
}