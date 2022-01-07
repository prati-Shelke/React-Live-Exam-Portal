import axios from 'axios'


const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTlkYmExNWU1ODY4NTE0NjEwYzhlNzUiLCJfYWN0aXZlT3JnIjoiNjE5Y2U0YThlNTg2ODUxNDYxMGM4ZGE3IiwiaWF0IjoxNjQxNTI5Nzg4LCJleHAiOjE2NDE1NzI5ODh9.-7ramq3t-ZoIHCVtR3tXwtMB_K0rBa3pthjv0dlPlnE'

export const authAxios =  axios.create({
    baseURL : "http://admin.liveexamcenter.in/api",
    headers: {
        Authorization : `${accessToken}`
    }
});

