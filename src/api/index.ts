import axios from 'axios';
import { API_KEY, API_URL } from '../constants/index';

export const getFlights = async (limit: number) => {
  try {
    const response = await axios.get(
      `${API_URL}/flights`,
      {
        params: {
          limit,
          access_key: API_KEY, 
          flight_status: 'scheduled',
        }
      }
    );
    const { data: { data } } = response;
    return data;
  } catch (error) {
    console.error(error);
  }
}
