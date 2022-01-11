import axios from 'axios'


const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTlkYmExNWU1ODY4NTE0NjEwYzhlNzUiLCJfYWN0aXZlT3JnIjoiNjE5Y2U0YThlNTg2ODUxNDYxMGM4ZGE3IiwiaWF0IjoxNjQxODc0MDA5LCJleHAiOjE2NDE5MTcyMDl9.NKvMmOXm0MUfTNUS0pn5KjH4wzxXgCVx-9_Cw5apso0'

export const authAxios =  axios.create({
    baseURL : "http://admin.liveexamcenter.in/api",
    headers: {
        Authorization : `${accessToken}`
    }
});

