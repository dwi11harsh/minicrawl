// HTTP fetch helper
import axios from "axios";

export const fetchPage = async (
  url: string,
  options?: { headers?: Record<string, string>; timeout?: number }
) => {
  try {
    const response = await axios.get(url, {
      timeout: options?.timeout ?? 15000,
      headers: options?.headers,
    });

    return {
      url,
      html: response.data as string,
    };
  } catch (error) {
    if (error instanceof axios.AxiosError) {
      throw new Error(`Error occured fetching page: ${error.message}`);
    }

    throw new Error(
      `Non-axios error while fetching page: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};
