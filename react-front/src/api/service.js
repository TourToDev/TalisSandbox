import Axios from 'axios'

const service = Axios.create({
  // You can set global configuration options here, such as baseURL, headers, etc.
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer your_access_token'
  }
})

// Optional: Interceptors for request and response
service.interceptors.request.use(
  config => {
    // You can modify the request config here, such as adding headers
    // config.headers['X-Requested-With'] = 'XMLHttpRequest';
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    // You can modify the response here, such as handling global success cases
    console.log('get response')
    console.log(response)
    return response.data;
  },
  error => {
    // You can handle errors globally here
    return Promise.reject(error)
  }
)

export default service;