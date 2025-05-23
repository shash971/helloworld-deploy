import { toast } from "@/hooks/use-toast";

// API base URL
// Using the FastAPI backend from the provided zip folder
export const API_BASE_URL = "/api";

// Type for auth response
export interface AuthResponse {
  access_token: string;
  token_type: string;
}

// Type for user info
export interface UserInfo {
  message: string;
  role: string;
}

// Function to perform login and get token
export async function login(username: string, password: string): Promise<AuthResponse | null> {
  try {
    // Extract username from email if needed (backend expects simple username)
    const cleanUsername = username.includes('@') ? username.split('@')[0] : username;
    
    console.log(`Attempting login with username: ${cleanUsername}`);
    
    // Create form data exactly as FastAPI expects it
    const formData = new URLSearchParams();
    formData.append('username', cleanUsername);
    formData.append('password', password);
    
    // Make direct fetch request to avoid any middleware issues
    // This ensures we're using the exact format the FastAPI backend expects
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    };
    
    console.log("Sending auth request with options:", {
      url: `${API_BASE_URL}/auth/login`,
      method: requestOptions.method,
      headers: requestOptions.headers,
      bodyPreview: formData.toString(),
    });
    
    const response = await fetch(`${API_BASE_URL}/auth/login`, requestOptions);
    
    console.log("Auth response status:", response.status);
    
    // Handle non-OK responses
    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Login failed details:", {
        status: response.status,
        statusText: response.statusText,
        body: errorBody
      });
      throw new Error(`Login failed (${response.status}): ${errorBody}`);
    }

    // Parse the successful response
    const data: AuthResponse = await response.json();
    console.log("Login successful, received token data");
    
    // Store authentication data in localStorage
    localStorage.setItem('jwt_token', data.access_token);
    localStorage.setItem('token_type', data.token_type);
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    toast({
      title: "Login Failed",
      description: error instanceof Error ? error.message : "Unknown error occurred",
      variant: "destructive",
    });
    return null;
  }
}

// Function to get stored token
export function getAuthToken(): string | null {
  return localStorage.getItem('jwt_token');
}

// Function to get auth header
export function getAuthHeader(): Record<string, string> {
  const token = getAuthToken();
  if (!token) return {};
  
  return {
    'Authorization': `Bearer ${token}`
  };
}

// Function to check if user is authenticated
export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

// Function to check if user has specific role
export function hasRole(requiredRoles: string[]): boolean {
  const userRole = localStorage.getItem('userRole')?.toLowerCase();
  if (!userRole) return false;
  
  return requiredRoles.map(r => r.toLowerCase()).includes(userRole);
}

// Function to check if user is admin or manager
export function isAdminOrManager(): boolean {
  return hasRole(['admin', 'manager']);
}

// Function to logout
export function logout(): void {
  localStorage.removeItem('jwt_token');
  localStorage.removeItem('token_type');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userFullName');
  
  // Redirect to login page
  window.location.href = '/role-login';
}

// Function to get current user info
export async function getCurrentUser(): Promise<UserInfo | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/dashboard/`, {
      method: 'GET',
      headers: {
        ...getAuthHeader(),
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        logout();
        return null;
      }
      throw new Error('Failed to get user info');
    }

    const data: UserInfo = await response.json();
    return data;
  } catch (error) {
    console.error('Get user info error:', error);
    return null;
  }
}