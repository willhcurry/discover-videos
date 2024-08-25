import videoData from '../data/videos.json';



export const getCommonVideos = async (url) => {
    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
    const BASE_URL = "youtube.googleapis.com/youtube/v3";
    try{
    const response = await fetch(
        `https://${BASE_URL}/${url}&key=${YOUTUBE_API_KEY}`
);

    const data = await response.json();

    if (data?.error) {
        console.error('Youtube api error', data.error);
        return [];
    }
        
    return data?.items.map((item) => {
        console.log({id: item.id});
        const id = item.id?.video || item.id;
        
        return {
            title: item.snippet.title,
            imgUrl: item.snippet.thumbnails.high.url,
            id
        }
    
    });
    } catch(error) {
        console.log('Something went wrong with the video library', error);
        return [];
        
    }

    
}

export const getVideos = (searchQuery) =>  {
    const URL = `search?part=snippet&type=video&maxResults=25&q=${searchQuery}&type=video`;
    return getCommonVideos(URL);
}

export const getPopularVideos = () => {
    const URL = `videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=US`;
    return getCommonVideos(URL);
}