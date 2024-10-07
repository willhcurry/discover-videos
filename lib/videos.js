import videoTestData from "../data/videos.json";
import { getMyListVideos, getWatchedVideos } from "./db/hasura";

const fetchVideos = async (url) => {
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  const BASE_URL = "youtube.googleapis.com/youtube/v3";

  const response = await fetch(
    `https://${BASE_URL}/${url}&maxResults=25&key=${YOUTUBE_API_KEY}`
  );

  return await response.json();
};

export const getCommonVideos = async (url) => {
  try {
    const isDev = process.env.DEVELOPMENT;
    console.log({ isDev });
    const data = isDev ? videoTestData : await fetchVideos(url);
    if (data?.error) {
      console.error("Youtube API error", data.error);
      return [];
    }

    return data?.items.map((item) => {
      console.log({ id: item.id });
      const snippet = item.snippet;
      let id, imgUrl;

      if (typeof item.id === 'object') {
        // Handle different types of content
        if (item.id.videoId) {
          id = { kind: 'youtube#video', videoId: item.id.videoId };
          imgUrl = `https://i.ytimg.com/vi/${item.id.videoId}/0.jpg`;
        } else if (item.id.channelId) {
          id = { kind: 'youtube#channel', channelId: item.id.channelId };
          imgUrl = snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url;
        } else if (item.id.playlistId) {
          id = { kind: 'youtube#playlist', playlistId: item.id.playlistId };
          imgUrl = snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url;
        }
      } else {
        // Handle case where id is already a string (likely a video id)
        id = { kind: 'youtube#video', videoId: item.id };
        imgUrl = `https://i.ytimg.com/vi/${item.id}/0.jpg`;
      }

      return {
        title: snippet?.title,
        imgUrl: imgUrl || '',
        id: id,
        description: snippet.description,
        publishTime: snippet.publishedAt,
        channelTitle: snippet.channelTitle,
        statistics: item.statistics ? item.statistics : { viewCount: 0 },
      };
    });
  } catch (error) {
    console.error("Something went wrong with video library", error);
    return [];
  }
};

export const getVideos = (searchQuery) => {
  const URL = `search?part=snippet&q=${searchQuery}&type=video`;
  return getCommonVideos(URL);
};

export const getPopularVideos = () => {
  const URL =
    "videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=US";

  //videos?part=snippet%2CcontentDetails%2Cstatistics&id=Ks-_Mh1QhMc
  return getCommonVideos(URL);
};

export const getYoutubeVideoById = (videoId) => {
  const URL = `videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}`;

  return getCommonVideos(URL);
};

export const getWatchItAgainVideos = async (userId, token) => {
  const videos = await getWatchedVideos(userId, token);
  return (
    videos?.map((video) => {
      return {
        id: video.videoId,
        imgUrl: `https://i.ytimg.com/vi/${video.videoId}/0.jpg`,
      };
    })
  );
};

export const getMyList = async (userId, token) => {
  const videos = await getMyListVideos(userId, token);
  console.log('Videos from getMyListVideos:', videos);
  return (
    videos?.map((video) => {
      return {
        id: video.videoId,
        imgUrl: `https://i.ytimg.com/vi/${video.videoId}/0.jpg`,
      };
    })
  ) || [];
};