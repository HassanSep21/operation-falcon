import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export default api;

export async function getGraph() {
  const response = await api.get("/graph");
  return response.data;
}
