// Utility functions for JWT token handling

export const getClerkIdFromToken = (): number | null => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return null;
    }

    // Decode JWT token (base64)
    const base64Url = token.split('.')[1];
    if (!base64Url) {
      return null;
    }

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const decoded = JSON.parse(jsonPayload);
    const clerkId = decoded.ClerkId || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
    
    return clerkId ? parseInt(clerkId, 10) : null;
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
};

export const getUsernameFromToken = (): string | null => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return null;
    }

    const base64Url = token.split('.')[1];
    if (!base64Url) {
      return null;
    }

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const decoded = JSON.parse(jsonPayload);
    return decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || decoded.name || null;
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
};
