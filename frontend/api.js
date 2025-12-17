import axios from "axios";

const API_BASE = "http://localhost:4000";

export const api = {
  getOffers: () => axios.get(`${API_BASE}/offers`),
  getRecommendations: (uid) =>
    axios.get(`${API_BASE}/offers/recommendations`, { params: { uid } }),
  addOffer: (data, token) =>
    axios.post(`${API_BASE}/offers`, data, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    }),
  getUserProfile: (uid) => axios.get(`${API_BASE}/users/${uid}`),
  saveUserProfile: (uid, data, token) =>
    axios.post(`${API_BASE}/users/${uid}`, data, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
};
