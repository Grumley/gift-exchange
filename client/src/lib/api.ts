const API_BASE = '/api';

// Debounce flag to prevent multiple session expiration events
let sessionExpiredDispatched = false;

class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  // Check for session expiration (401) but exclude initial auth checks
  // Debounce to prevent multiple events from parallel requests
  if (res.status === 401 && endpoint !== '/auth/login' && endpoint !== '/auth/me') {
    if (!sessionExpiredDispatched) {
      sessionExpiredDispatched = true;
      window.dispatchEvent(new CustomEvent('auth:session-expired'));
      // Reset after delay to allow for new sessions
      setTimeout(() => {
        sessionExpiredDispatched = false;
      }, 1000);
    }
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new ApiError(res.status, data.error || 'Request failed');
  }

  return res.json();
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint),
  post: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
};

export { ApiError };
