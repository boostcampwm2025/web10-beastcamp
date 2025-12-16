import axios, { type AxiosRequestConfig } from "axios";

const client = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

export const httpGet = async <T>(url: string, config?: AxiosRequestConfig) => {
  const res = await client.get<T>(url, config);
  return res.data;
};

export const httpPost = async <T, D>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
) => {
  const res = await client.post<T>(url, data, config);
  return res.data;
};

export const httpPut = async <T, D>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig<D>
) => {
  const res = await client.put<T>(url, data, config);
  return res.data;
};

export const httpDelete = async <T, D>(
  url: string,
  config?: AxiosRequestConfig<D>
) => {
  const res = await client.delete<T>(url, config);
  return res.data;
};
