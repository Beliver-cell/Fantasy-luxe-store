export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

// Debug logging to help troubleshoot deployment issues
console.log("Current Backend URL:", BACKEND_URL || "(empty - relying on proxy or same-origin)");

if (import.meta.env.DEV) {
  console.log("Development mode: Using Vite proxy for API requests");
}

