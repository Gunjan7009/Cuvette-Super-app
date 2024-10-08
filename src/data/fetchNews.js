import axios from 'axios';
const BASE_URL = "https://newsapi.org/v2/top-headlines";
const API_KEY = import.meta.env.VITE_NEWS_API;
console.log('All env variables:', import.meta.env);
console.log('API Key:', API_KEY);
const fetchNews = async () => {
    try {
        if (!API_KEY) {
            throw new Error('API key is undefined. Check your environment variables.');
        }
        const { data } = await axios.get(BASE_URL, {
            params: {
                apiKey: API_KEY,
                sources: "abc-news"
            },
        });
        return data;
    } catch (error) {
        console.error('Error fetching news:', error.message);
        throw error;
    }
};

export default fetchNews;