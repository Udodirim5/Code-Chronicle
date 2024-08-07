import axios from 'axios';
import { showAlert } from "./alert";
import { getBaseUrl } from "./baseUrl";

export async function fetchTrafficData() {
  try {
    const url = `${getBaseUrl()}/api`;
    const [dailyResponse, monthlyResponse, allTimeResponse] = await Promise.all([
      axios.get(`${url}/traffic/daily`),
      axios.get(`${url}/traffic/monthly`),
      axios.get(`${url}/traffic/all-time`)
    ]);

    return {
      dailyCount: dailyResponse.data.dailyCount || 0,
      monthlyCount: monthlyResponse.data.allTimeCount || 0,
      allTimeCount: allTimeResponse.data.monthlyCount || 0 
    };
  } catch (error) {
    showAlert('error', 'Error fetching traffic data:', error);
    return {
      dailyCount: 0,
      monthlyCount: 0,
      allTimeCount: 0
    };
  }
}
