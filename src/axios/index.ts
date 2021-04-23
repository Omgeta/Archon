import axios from "axios";

export const redditAxios = axios.create({
    baseURL: "https://reddit.com",
    timeout: 2500
});