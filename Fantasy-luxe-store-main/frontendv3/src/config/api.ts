export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

if (import.meta.env.DEV) {
  console.log("Development mode: Using Vite proxy for API requests");
}
