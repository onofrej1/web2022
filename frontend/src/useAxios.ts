import { useState, useEffect } from 'react';
import axios from 'axios';

interface params {
    url: string,
    method: 'get' | 'post' | 'delete' | 'put' | 'patch',
    body?: any,
    headers?: any,
}

axios.defaults.baseURL = 'http://localhost:8000/api'; // 'https://jsonplaceholder.typicode.com';

interface useAxiosReturn {
    data: any,
    error: any,
    loading: boolean,
}

export const useAxios = (axiosParams: any): useAxiosReturn => {
    const [data, setData] = useState(undefined);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const axiosRequest = async (params: any) => {
      try {
       const result = await axios.request(params);
       setData(result.data);
       } catch(error) {
        if (axios.isAxiosError(error)) {
            setError(error.message);
        } else {
            throw error;
        }
       } finally {
         setLoading(false);
       }
    };
    const paramsStr = JSON.stringify(axiosParams);
    useEffect(() => {
        axiosRequest(axiosParams);
    }, [paramsStr]);

    return { data, error, loading };
};

export default useAxios;
