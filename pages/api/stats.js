import { findVideoIdByUser, insertStats, updateStats } from "../../lib/db/hasura";
import { verifyToken } from "../../lib/utils";

/**
 * Handles stats API requests
 * 
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export default async function stats(req, res) {
	try {
		// Check if token exists in cookies
		const token = req.cookies.token;
		if (!token) {
			// Return 403 error if token is missing
			return res.status(403).json({ error: "Not authorized" });
		}

		// Verify token and get user ID
		const userId = await verifyToken(token);

		// Get video ID and favorited status from request body or query
		const { videoId, favorited } = req.method === "POST" ? req.body : req.query;

		// Check if video ID is present
		if (!videoId) {
			// Return 400 error if video ID is missing
			return res.status(400).json({ error: "videoId is required" });
		}

		// Handle POST requests
		if (req.method === "POST") {
			// Check if favorited status is present
			if (favorited === undefined) {
				// Return 400 error if favorited status is missing
				return res.status(400).json({ error: "favorited status is required" });
			}

			// Check if stats already exist for user and video
			const findVideo = await findVideoIdByUser(token, userId, videoId);
			const doesStatsExist = findVideo?.length > 0;

			if (doesStatsExist) {
				// Update existing stats
				const response = await updateStats(token, {
					userId,
					videoId,
					favorited,
				});
				return res.status(200).json({ msg: "Stats updated", response });
			} else {
				// Insert new stats
				const response = await insertStats(token, {
					userId,
					videoId,
					favorited,
				});
				return res.status(201).json({ msg: "Stats added", response });
			}
		}
		// Handle GET requests
		else if (req.method === "GET") {
			// Get stats for user and video
			const findVideo = await findVideoIdByUser(token, userId, videoId);
			if (findVideo?.length > 0) {
				return res.status(200).json(findVideo);
			}
			// Return 404 error if video not found
			return res.status(404).json({ user: null, msg: "Video not found" });
		}
		// Return 405 error for unsupported methods
		return res.status(405).json({ error: "Method not allowed" });
	}
	// Catch any errors that occur during execution
	catch (error) {
		// Log the error
		console.error("Error occurred /stats", error);
		// Return 500 error for internal server errors
		return res.status(500).json({ error: error.message });
	}
}