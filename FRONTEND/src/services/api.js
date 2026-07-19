/**
 * Helper wrapper for fetch that automatically injects the JWT token
 * and handles 401 Unauthorized responses.
 */
export const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  // Merge existing headers with Authorization
  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Token is invalid or expired
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // Redirect to login page
    window.location.href = "/login";
    return Promise.reject(new Error("Unauthorized"));
  }

  return response;
};
