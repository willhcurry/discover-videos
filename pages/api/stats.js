import {
  findVideoIdByUser,
  updateStats,
  insertStats,
} from "../../lib/db/hasura";
import { verifyToken } from '../../lib/utils';

export default async function stats(req, resp) {
  try {
    console.log('Received request:', req.method, req.url);
    console.log('Request body:', req.body);
    console.log('Request query:', req.query);

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

    console.log('UserId:', userId);

    const inputParams = req.method === "POST" ? req.body : req.query;
    const { videoId } = inputParams;
    console.log('VideoId:', videoId);

    if (!videoId) {
      console.log('No videoId provided');
      return resp.status(400).send({ msg: "VideoId is required" });
    }

    const findVideo = await findVideoIdByUser(token, userId, videoId);
    console.log('findVideo result:', findVideo);

    const doesStatsExist = findVideo?.length > 0;
    console.log('doesStatsExist:', doesStatsExist);

    if (req.method === "POST") {
      const { favorited, watched = true } = req.body;
      console.log('POST request data:', { favorited, watched });

      if (doesStatsExist) {
        console.log('Updating existing stats');
        const response = await updateStats(token, {
          watched,
          userId,
          videoId,
          favorited,
        });
        console.log('Update response:', response);
        resp.send({ data: response });
      } else {
        console.log('Inserting new stats');
        const response = await insertStats(token, {
          watched,
          userId,
          videoId,
          favorited,
        });
        console.log('Insert response:', response);
        resp.send({ data: response });
      }
    } else {
      if (doesStatsExist) {
        console.log('Returning existing stats');
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