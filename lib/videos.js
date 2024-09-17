import videoTestData from '../data/videos.json';
import { getWatchedVideos } from './db/hasura';

// Define a function to fetch videos from the YouTube API
const fetchVideos = async (url) => {
  // Set up API key and base URL
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  const BASE_URL = "youtube.googleapis.com/youtube/v3";

  // Fetch data from the YouTube API
  const response = await fetch(
    `https://${BASE_URL}/${url}&key=${YOUTUBE_API_KEY}`
  );

  // Return the response data as JSON
  return response.json();
};

// Define a function to get common videos (either from test data or API)
export const getCommonVideos = async (url) => {
  try {
    // Check if we're in development mode
    const isDev = process.env.DEVELOPMENT;

    // Use test data if in development, otherwise fetch from API
    const data = isDev ? videoTestData : await fetchVideos(url);

    // Check for API errors
    if (data?.error) {
      console.error('YouTube API error', data.error);
      return [];
    }

    // Map the API response to a standardized video object
    return data?.items.map((item) => {


      console.log('Item ID:', item.id);


      const id = item.id?.videoId 
  ? item.id.videoId 
  : item.id?.id 
    ? item.id.id 
    : item.id;



      console.log('Extracted ID:', id);


      const snippet = item.snippet;
      return {
        title: snippet?.title,
        imgUrl: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
        id,
        description: snippet.description,
        publishTime: snippet.publishedAt,
        channelTitle: snippet.channelTitle,
        statistics: item.statistics ? item.statistics : { viewCount: 0 },
      };
    });
  } catch (error) {
    // Catch any errors and log them
    console.log('Something went wrong with the video library', error);
    return [];
  }
};

// Define functions to get specific types of videos
export const getVideos = (searchQuery) => {
  const URL = `search?part=snippet&type=video&maxResults=25&q=${searchQuery}&type=video`;
  return getCommonVideos(URL);
};

export const getPopularVideos = () => {
  const URL = `videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=US`;
  return getCommonVideos(URL);
};

export const getYoutubeVideoById = (videoId) => {
  const URL = `videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}`;
  return getCommonVideos(URL);
};

export const getWatchItAgainVideos = async (userId, token) => {
  const videos = await getWatchedVideos(userId, token);
  return videos?.map((video) => {
    return {
      id: video.videoId,
      imgUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`
    }
  });
}