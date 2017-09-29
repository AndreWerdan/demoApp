import { create } from 'axios';

const instance = create({
  baseURL: '/api',
});

export default instance;
