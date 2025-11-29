// HTTP fetch helper
import axios from "axios";

export const fetchPage = async (url: string) => {
  try {
    const response = await axios.get(url, { timeout: 15000 });

    return {
      url,
      html: response.data as string,
    };
  } catch (error) {
    if (error instanceof axios.AxiosError) {
      throw new Error(`Error occured fetching page: ${error.message}`);
    }

    throw new Error(`Non-axios error while fetching page: ${error instanceof Error ? error.message : String(error)}`);
  }
};
