import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: API,
  headers: { "Content-Type": "application/json" },
});

export const fetchTrainingLogs = async () => {
  const { data } = await api.get("/training-logs");
  return data;
};

export const createTrainingLog = async (payload, passcode) => {
  const { data } = await api.post("/training-logs", payload, {
    headers: { "X-Admin-Passcode": passcode },
  });
  return data;
};

export const deleteTrainingLog = async (id, passcode) => {
  const { data } = await api.delete(`/training-logs/${id}`, {
    headers: { "X-Admin-Passcode": passcode },
  });
  return data;
};

export const submitContact = async (payload) => {
  const { data } = await api.post("/contact", payload);
  return data;
};

export const verifyAdmin = async (passcode) => {
  const { data } = await api.post(
    "/admin/verify",
    {},
    { headers: { "X-Admin-Passcode": passcode } }
  );
  return data;
};

export const fetchContactMessages = async (passcode) => {
  const { data } = await api.get("/contact", {
    headers: { "X-Admin-Passcode": passcode },
  });
  return data;
};
