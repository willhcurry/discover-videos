import jwt from 'jsonwebtoken';
import { findVideoIdByUser, insertStats, updateStats } from '../../lib/db/hasura';

// Define the API handler for stats
export default async function stats(req, resp) {

    // Check if the request method is POST
    if (req.method === "POST") {
        
        // Log cookies for debugging purposes
        console.log({ cookies: req.cookies });

        try {
            // Extract the token from the cookies
            const token = req.cookies.token;

            // If no token is found, respond with a 403 Forbidden status
            if (!token) {
                return resp.status(403).send({});
            } else {
                // Extract video details from the request body
                const { videoId, favorited, watched = true } = req.body;

                // Proceed only if videoId is provided
                if (videoId) {

                    // Decode the JWT to retrieve user information
                    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
                    const userId = decodedToken.issuer; // The 'issuer' field usually contains the user ID

                    // Check if stats for the video already exist for the user
                    const doesStatsExist = await findVideoIdByUser(token, userId, videoId);

                    if (doesStatsExist) {
                        // If stats exist, update them
                        const response = await updateStats(token, {
                            watched,
                            userId,
                            videoId,
                            favorited
                        });
                        // Send the updated stats as the response
                        return resp.send({ data: response });
                    } else {
                        // If stats don't exist, insert new stats
                        const response = await insertStats(token, {
                            watched,
                            userId,
                            videoId,
                            favorited
                        });
                        // Send the newly inserted stats as the response
                        return resp.send({ data: response });
                    }
                }
            }

        } catch (error) {
            // Log any errors that occur during execution
            console.error('Error occurred /stats', error);

            // Respond with a 500 Internal Server Error status and include the error message
            return resp.status(500).send({ done: false, error: error?.message });
        }

    } else {
        // If the request method is not POST, respond with a 405 Method Not Allowed status
        return resp.status(405).send({ message: "Only POST requests are allowed" });
    }
}
