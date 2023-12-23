import axios from "axios";

import { getTokenCookie } from "@/core/popup/hooks/auth/useAuth";

import { enviroment } from "./enviroment";

export const api = axios.create({
  baseURL: enviroment.API_URL,
  timeout: 30_000,
});

api.interceptors.request.use(async (config) => {
  const token = await getTokenCookie();

  if (token) {
    config.headers.Authorization = `Bearer ${token.value}`;
  }

  return config;
});
