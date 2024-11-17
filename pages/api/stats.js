import {
  findVideoIdByUser,
  updateStats,
  insertStats,
} from "../../lib/db/hasura";
import { verifyToken } from '../../lib/utils';

export default async function stats(req, resp) {
  try {

    const token = req.cookies.token;
    if (!token) {
      console.log('No token found');
      return resp.status(403).send({ msg: "No token provided" });
    }

    const userId = await verifyToken(token);
    if (!userId) {
      console.log('Invalid token');
      return resp.status(403).send({ msg: "Invalid token" });
    }
    const inputParams = req.method === "POST" ? req.body : req.query;
    const { videoId } = inputParams;

    if (!videoId) {
      console.log('No videoId provided');
      return resp.status(400).send({ msg: "VideoId is required" });
    }

    const findVideo = await findVideoIdByUser(token, userId, videoId);

    const doesStatsExist = findVideo?.length > 0;

    if (req.method === "POST") {
      const { favorited, watched = true } = req.body;

      if (doesStatsExist) {
        const response = await updateStats(token, {
          watched,
          userId,
          videoId,
          favorited,
        });
        resp.send({ data: response });
      } else {
        const response = await insertStats(token, {
          watched,
          userId,
          videoId,
          favorited,
        });
        resp.send({ data: response });
      }
    } else {
      if (doesStatsExist) {
        resp.send(findVideo);
      } else {
        console.log('Video not found');
        resp.status(404).send({ user: null, msg: "Video not found" });
      }
    }
  } catch (error) {
    console.error("Error occurred /stats", error);
    resp.status(500).send({ done: false, error: error?.message });
  }
}