import axios from 'axios';

export const http = axios.create({
  baseURL: 'https://ddragon.leagueoflegends.com',
  timeout: 10000,
});
