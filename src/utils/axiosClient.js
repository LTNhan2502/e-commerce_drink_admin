import axios from 'axios';

const axiosClient = axios.create({
   baseURL: 'https://order-drink.vercel.app',
   credentials: 'include',
   headers: {
      'Content-Type': 'application/json'
   },
});

export default axiosClient;
