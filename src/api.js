import axios from 'axios'


const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTlkYmExNWU1ODY4NTE0NjEwYzhlNzUiLCJfYWN0aXZlT3JnIjoiNjE5Y2U0YThlNTg2ODUxNDYxMGM4ZGE3IiwiaWF0IjoxNjQxNDQxOTYxLCJleHAiOjE2NDE0ODUxNjF9.orFptzw4WX5GebSsuqAieVDQT7Zb6tgTAlJT6xf6bqw'

export const authAxios =  axios.create({
    baseURL : "http://admin.liveexamcenter.in/api",
    headers: {
        Authorization : `${accessToken}`
    }
});

