import axios from 'axios'


const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTlkYmExNWU1ODY4NTE0NjEwYzhlNzUiLCJfYWN0aXZlT3JnIjoiNjE5Y2U0YThlNTg2ODUxNDYxMGM4ZGE3IiwiaWF0IjoxNjQyMDQ3OTM3LCJleHAiOjE2NDIwOTExMzd9.oQgmpn3BmimWw-lk5TOvajI2Bky6vt7P2CHVa6i6pp0'

export const authAxios =  axios.create({
    baseURL : "http://admin.liveexamcenter.in/api",
    headers: {
        Authorization : `${accessToken}`
    }
});

