import jwt from 'jsonwebtoken';
import { findVideoIdByUser, insertStats, updateStats } from '../../lib/db/hasura';

export default async function stats(req, resp) {
    if (req.method === "POST") {
        console.log({ cookies: req.cookies});
        try {
            const token = req.cookies.token;
            if (!token) {
            resp.status(403).send({});
        } else {
            const videoId = req.query.videoId;
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

            const userId = decodedToken.issuer;
            // const videoId = decodedToken.videoId;

            const doesStatsExist = await findVideoIdByUser(token, userId, videoId);
            
            if(doesStatsExist) {
                const response = await updateStats(token, {
                    watched: false,
                    userId,
                    videoId: "dBxxi5XAm3U",
                    favorited: 0
                });
                resp.send({ msg: "it works", response });
            } else {
                resp.send({ msg: "it works", decodedToken, doesStatsExist });
            }

            
        }
        } catch(error) {
            
            console.error('Error occured /stats', error);
            
            resp.status(500).send({ done:false, error: error?.message })
        }
        
        
    }
}