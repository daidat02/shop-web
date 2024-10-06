import axios from "axios";
import queryString from "query-string";
import { CONST } from "../constants";

export const axiosConfig = axios.create({
  baseURL: CONST.API_URL,
  headers: {
    "Accept": "application/json, text/plain, */*",
    "Content-Type": "application/json"
  },
  paramsSerializer: {
    encode: (param) => { },
    serialize: (params) => queryString.stringify(params),
    indexes: false,
  },
});
axiosConfig.interceptors.request.use(async (config) => {
    const access_token = localStorage.getItem('access_token')
  config.headers.Authorization = `Bearer ${access_token}`
  return config;
});
axiosConfig.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    throw error;
  }
);