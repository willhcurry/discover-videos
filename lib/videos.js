import videoTestData from "../data/videos.json";
import { getMyListVideos, getWatchedVideos } from "./db/hasura";

const fetchVideos = async (url) => {
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  const BASE_URL = "youtube.googleapis.com/youtube/v3";

  console.log('Fetching videos...'); // Add this line to confirm function is called
  
  // Make sure maxResults isn't already in the URL
  const maxResults = url.includes('maxResults') ? '' : '&maxResults=25';
  
  try {
    const fullUrl = `https://${BASE_URL}/${url}${maxResults}&key=${YOUTUBE_API_KEY}`;
    const response = await fetch(fullUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(`API Response - Items: ${data.items?.length}, More pages: ${data.nextPageToken ? 'Yes' : 'No'}`);
    return data;
  } catch (error) {
    console.error("Error fetching videos:", error);
    return null;
  }
};

export const getCommonVideos = async (url) => {
  try {
    const isDev = process.env.DEVELOPMENT === 'true';
    console.log('Environment:', process.env.DEVELOPMENT); 

    const data = isDev ? videoTestData : await fetchVideos(url);
    if (!data?.items) return [];

    return data.items.map((item) => {
      const snippet = item.snippet;
      let id, imgUrl;

      if (typeof item.id === 'object') {
        if (item.id.kind === 'youtube#channel') {
          id = { kind: 'youtube#channel', channelId: item.id.channelId };
          imgUrl = snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url;
        } else if (item.id.kind === 'youtube#playlist') {
          id = { kind: 'youtube#playlist', playlistId: item.id.playlistId };
          imgUrl = snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url;
        } else {
          id = { kind: 'youtube#video', videoId: item.id.videoId };
          imgUrl = `https://img.youtube.com/vi/${item.id.videoId}/maxresdefault.jpg`;
        }
      } else {
        id = { kind: 'youtube#video', videoId: item.id };
        imgUrl = `https://img.youtube.com/vi/${item.id}/maxresdefault.jpg`;
      }

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
  const URL = `search?part=snippet&q=${searchQuery}&type=video&maxResults=25`;
  return getCommonVideos(URL);
};

export const getPopularVideos = () => {
  const URL = "videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=US&maxResults=25";
  return getCommonVideos(URL);
};

export const getYoutubeVideoById = (videoId) => {
  const URL = `videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}`;
  return getCommonVideos(URL);
};

export const getWatchItAgainVideos = async (userId, token) => {
  try {
    const videos = await getWatchedVideos(userId, token);

    return videos?.map((video) => {
      let kind = 'youtube#video';
      let imgUrl = `https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`;

      if (video.videoId.startsWith('PL')) {
        kind = 'youtube#playlist';
        imgUrl = 'https://i.ytimg.com/vi/4_aOIA-vyBo/hqdefault.jpg';
      } else if (video.videoId.startsWith('UC')) {
        kind = 'youtube#channel';
        imgUrl = 'https://yt3.ggpht.com/ytc/AIdro_llZywFuLruYcXUgaYGurJsuMkyauzPoyn7q99G8UdyKlw=s800-c-k-c0xffffffff-no-rj-mo';
      }

      return {
        id: kind === 'youtube#channel' 
          ? { kind, channelId: video.videoId }
          : kind === 'youtube#playlist'
          ? { kind, playlistId: video.videoId }
          : { kind, videoId: video.videoId },
        imgUrl,
        title: video.title || 'Title Not Available',
      };
    }) || [];
  } catch (error) {
    console.error('Error in getWatchItAgainVideos:', error);
    return [];
  }
};

export const getMyList = async (userId, token) => {
  try {
    const videos = await getMyListVideos(userId, token);

    return videos?.map((video) => {
      let kind = 'youtube#video';
      let href, imgUrl;

      // Check the ID format to determine the content type
      if (video.videoId.startsWith('PL')) {
        kind = 'youtube#playlist';
      } else if (video.videoId.startsWith('UC')) {
        kind = 'youtube#channel';
      }

      // Set the correct ID structure and URL based on content type
      if (kind === 'youtube#channel') {
        return {
          id: { kind, channelId: video.videoId },
          imgUrl: 'https://yt3.ggpht.com/ytc/AIdro_llZywFuLruYcXUgaYGurJsuMkyauzPoyn7q99G8UdyKlw=s800-c-k-c0xffffffff-no-rj-mo',
          title: 'Channel'
        };
      } else if (kind === 'youtube#playlist') {
        return {
          id: { kind, playlistId: video.videoId },
          imgUrl: 'https://i.ytimg.com/vi/4_aOIA-vyBo/hqdefault.jpg',
          title: 'Playlist'
        };
      } else {
        return {
          id: { kind, videoId: video.videoId },
          imgUrl: `https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`,
          title: 'Video'
        };
      }
    }).filter(Boolean);
  } catch (error) {
    console.error('Error in getMyList:', error);
    return [];
  }
};

export const getYoutubePlaylistById = async (playlistId) => {
  const URL = `playlists?part=snippet%2CcontentDetails&id=${playlistId}`;
  return getCommonVideos(URL);
};