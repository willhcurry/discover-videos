import videoTestData from "../data/videos.json";
import { getMyListVideos, getWatchedVideos } from "./db/hasura";

const fetchVideos = async (url) => {
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  const BASE_URL = "youtube.googleapis.com/youtube/v3";

  try {
    const response = await fetch(
      `https://${BASE_URL}/${url}&maxResults=25&key=${YOUTUBE_API_KEY}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching videos:", error);
    return null;
  }
};

export const getCommonVideos = async (url) => {
  try {
    const isDev = process.env.DEVELOPMENT === 'true';
    const data = isDev ? videoTestData : await fetchVideos(url);
    if (!data?.items) return [];

    console.log(`Received ${data.items.length} items from API`);

    return data.items.map((item) => {
      const snippet = item.snippet;
      let id, imgUrl;

      if (item.id.kind === 'youtube#channel') {
        id = { kind: 'youtube#channel', channelId: item.id.channelId };
        imgUrl = snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url;
      } else if (item.id.kind === 'youtube#playlist') {
        id = { kind: 'youtube#playlist', playlistId: item.id.playlistId };
        imgUrl = snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url;
      } else {
        const videoId = item.id.videoId || item.id;
        id = { kind: 'youtube#video', videoId };
        imgUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      }

      console.log(`Processed ${id.kind} with ID: ${JSON.stringify(id)}, Image URL: ${imgUrl}`);

      return {
        id,
        title: snippet?.title,
        imgUrl,
        description: snippet.description,
        publishTime: snippet.publishedAt,
        channelTitle: snippet.channelTitle,
        statistics: item.statistics ? item.statistics : { viewCount: 0 },
      };
    });
  } catch (error) {
    console.error("Error in getCommonVideos:", error);
    return [];
  }
};

export const getVideos = (searchQuery) => {
  const URL = `search?part=snippet&q=${searchQuery}&type=video`;
  return getCommonVideos(URL);
};

export const getPopularVideos = () => {
  const URL = "videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=US";
  return getCommonVideos(URL);
};

export const getYoutubeVideoById = (videoId) => {
  const URL = `videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}`;
  return getCommonVideos(URL);
};

export const getWatchItAgainVideos = async (userId, token) => {
  try {
    const videos = await getWatchedVideos(userId, token);
    console.log('Watched videos:', videos);
    return videos?.map((video) => {
      let kind = 'youtube#video';
      let imgUrl = `https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`;

      if (video.videoId.startsWith('PL')) {
        kind = 'youtube#playlist';
        imgUrl = 'https://i.ytimg.com/vi/4_aOIA-vyBo/hqdefault.jpg'; // Use a specific playlist thumbnail
      } else if (video.videoId.startsWith('UC')) {
        kind = 'youtube#channel';
        imgUrl = 'https://yt3.ggpht.com/ytc/AIdro_llZywFuLruYcXUgaYGurJsuMkyauzPoyn7q99G8UdyKlw=s800-c-k-c0xffffffff-no-rj-mo'; // Use a specific channel thumbnail
      }

      const mappedVideo = {
        id: { kind, videoId: video.videoId },
        imgUrl,
        title: video.title || 'Title Not Available',
      };
      console.log('Mapped watched video:', mappedVideo);
      return mappedVideo;
    }) || [];
  } catch (error) {
    console.error('Error in getWatchItAgainVideos:', error);
    return [];
  }
};

export const getMyList = async (userId, token) => {
  try {
    console.log('Getting my list for user:', userId);
    const videos = await getMyListVideos(userId, token);
    console.log('Raw My List videos:', videos);

    if (!videos || !Array.isArray(videos)) {
      console.error('Invalid videos data received:', videos);
      return [];
    }

    return videos.map((video) => {
      if (!video || !video.videoId) {
        console.error('Invalid video object:', video);
        return null;
      }

      let kind = 'youtube#video';
      let imgUrl = `https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`;

      // Check if it's a playlist or channel
      if (video.videoId.startsWith('PL')) {
        kind = 'youtube#playlist';
        imgUrl = 'https://i.ytimg.com/vi/4_aOIA-vyBo/hqdefault.jpg';
      } else if (video.videoId.startsWith('UC')) {
        kind = 'youtube#channel';
        imgUrl = 'https://yt3.ggpht.com/ytc/AIdro_llZywFuLruYcXUgaYGurJsuMkyauzPoyn7q99G8UdyKlw=s800-c-k-c0xffffffff-no-rj-mo';
      }

      const mappedVideo = {
        id: { kind, videoId: video.videoId },
        imgUrl,
        title: video.title || 'Title Not Available',
      };
      console.log('Mapped My List video:', mappedVideo);
      return mappedVideo;
    }).filter(Boolean); // Remove any null entries
  } catch (error) {
    console.error('Error in getMyList:', error);
    return [];
  }
};