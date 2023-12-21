import axios from "axios";

import { getCookie } from "@/hooks/useAuth";

import { enviroment } from "./enviroment";

export const api = axios.create({
  baseURL: enviroment.API_URL,
  timeout: 30_000,
});

api.interceptors.request.use((config) => {
  const token = getCookie("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
