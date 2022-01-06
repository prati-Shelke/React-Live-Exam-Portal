import axios from "axios";
import {authAxios} from "./api"

const http = 
{
    get : async (query) =>
    {
        const response = await authAxios.get(`${query}`)
        return response.data.result; 
    },

    post : async (query,newQue) =>
    {
        
        const response = await authAxios.post(`${query}`,newQue)
        return response.data; 
    },

    delete : async (query) =>
    {
        const response = await authAxios.delete(`${query}`)
        return response.data.result
    },

    put : async (query , editQue) =>
    {
        const response = await authAxios.put(`${query}`, editQue)
        return response.data; 
    }
}

export default http;