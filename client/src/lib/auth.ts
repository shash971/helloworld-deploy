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
    console.log(`Attempting login with username: ${username}`);
    
    // Using the exact format from the FastAPI backend (auth_routes.py)
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        username,
        password,
      }),
    });

    if (!response.ok) {
      console.error("Login failed", response.status);
      const errorText = await response.text();
      throw new Error(`Login failed: ${errorText}`);
    }

    const data: AuthResponse = await response.json();
    console.log("Login successful, received token");
    
    // Store token in localStorage
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