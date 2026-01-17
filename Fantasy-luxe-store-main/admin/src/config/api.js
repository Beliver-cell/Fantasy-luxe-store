export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";
export const backendUrl = BACKEND_URL;
export const currency = '$';

if (!BACKEND_URL) {
  console.error("VITE_BACKEND_URL is missing! Backend not configured.");
} else {
  console.log("Backend Configured:", BACKEND_URL);
}
