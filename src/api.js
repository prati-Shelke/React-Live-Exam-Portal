import axios from 'axios'


// const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWRmZWE2ZGU2ZDdkNzdjOGU1MDRkMzYiLCJfYWN0aXZlT3JnIjoiNjE5Y2U0YThlNTg2ODUxNDYxMGM4ZGE3IiwiaWF0IjoxNjQyMTQ2MzkyLCJleHAiOjE2NDIxODk1OTJ9.peiro3rIyAS6zPZt9O7gL5KDFdCq7ObzBmJB7rlhB1k'


// const accessToken = JSON.parse(localStorage.getItem('token'))
// const googleToken = JSON.parse(localStorage.getItem('googleToken'))
const authAxios =  axios.create({
    baseURL : "http://admin.liveexamcenter.in/api",
    // headers: {
    //     Authorization : accessToken ? `${accessToken}` : `${googleToken}`
    // }
});

authAxios.interceptors.request.use(function (config) {
    const accessToken = JSON.parse(localStorage.getItem('token'));
    const googleToken = JSON.parse(localStorage.getItem('googleToken'))
    
    // const accessToken1 = Storage.get('token1');
   
    config.headers.Authorization =  accessToken ? `${accessToken}` : `${googleToken}` 
    return config;
    });

export default authAxios


