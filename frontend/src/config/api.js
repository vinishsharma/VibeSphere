import axios from "axios";

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim().replace(/\/$/, "");

// One shared Axios configuration keeps existing relative /api calls working in
// development and sends them to the deployed API when VITE_API_URL is set.
axios.defaults.baseURL = configuredApiUrl || "";
axios.defaults.withCredentials = true;
axios.defaults.headers.common.Accept = "application/json";

export const apiUrl = configuredApiUrl;

export default axios;
