import axios from "axios";

// Request url
const newsApi = process.env.REACT_APP_API_URL_NEWS;
const podcastApi = process.env.REACT_APP_API_URL_PODCAST;
const costApi = process.env.REACT_APP_API_URL_COST;

// Default timeout 3 seconds
const timeout = 30000;

const newsRequest = axios.create({
  timeout: timeout,
  baseURL: newsApi,
});

const podcastRequest = axios.create({
  timeout: timeout,
  baseURL: podcastApi,
});

const costRequest = axios.create({
  timeout: timeout,
  baseURL: costApi,
});

newsRequest.interceptors.request.use(
  (config) => {
    return config;
  },
  (err) => {
    console.log(err);
  }
);

newsRequest.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    console.log(err);
  }
);

podcastRequest.interceptors.request.use(
  (config) => {
    return config;
  },
  (err) => {
    console.log(err);
  }
);

podcastRequest.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    console.log(err);
  }
);

costRequest.interceptors.request.use(
  (config) => {
    return config;
  },
  (err) => {
    console.log(err);
  }
);

costRequest.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    console.log(err);
  }
);

export { newsRequest, podcastRequest, costRequest };
