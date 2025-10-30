import axios from 'axios';

const BASE_URL = 'https://api.worldbank.org/v2';


export const fetchIndicators = (country = 'IN', indicator = 'SP.POP.TOTL', date = '2010:2020') =>
  axios.get(`${BASE_URL}/country/${country}/indicator/${indicator}`, {
    params: {
      date,
      format: 'json'
    }
  });
