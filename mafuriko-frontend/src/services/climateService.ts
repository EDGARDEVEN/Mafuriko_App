import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

export const climateService = {
  getForecast: async (lat: number, lon: number) => {
    const response = await axios.get(`${API_BASE}/weather`, {
      params: { lat, lon }
    });
    return response.data;
  }
};