import { enviroment } from "./enviroment";

export const createAppUrl = (path: string) => {
  return `${enviroment.APP_URL}${path}?ref=ext`;
};
