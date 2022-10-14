import axios from "axios";

export const get = async (url: string) => {
  return await axios.get(url);
};
