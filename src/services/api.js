import axios from 'axios';

const API_BASE_URL = "http://localhost:8080/api";

// ✅ Correct categories endpoint
export const fetchCategories = () => axios.get(`${API_BASE_URL}/categories`);

// Record endpoints
export const createRecord = (data) => axios.post(`${API_BASE_URL}/records`, data);
export const getRecords = () => axios.get(`${API_BASE_URL}/records`);
export const getRecordById = (id) => axios.get(`${API_BASE_URL}/records/${id}`);
export const updateRecord = (id, data) => axios.put(`${API_BASE_URL}/records/${id}`, data);
export const deleteRecord = (id) => axios.delete(`${API_BASE_URL}/records/${id}`);
export const bulkDeleteRecords = (ids) => axios.post(`${API_BASE_URL}/records/bulk-delete`, ids);
export const filterRecordsByActive = (active) => axios.get(`${API_BASE_URL}/records/filter?active=${active}`);
export const searchRecordsByName = (name) => axios.get(`${API_BASE_URL}/records/search?name=${name}`);

// Auth endpoints (if you use them)
export const registerUser = (data) => axios.post(`${API_BASE_URL}/auth/register`, data);
export const loginUser = (data) => axios.post(`${API_BASE_URL}/auth/login`, data);
