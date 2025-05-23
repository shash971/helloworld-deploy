import { API_BASE_URL, getAuthHeader } from './auth';

// Register a user in the backend authentication system
export async function registerUserInBackend(
  username: string,
  password: string,
  role: string
): Promise<boolean> {
  try {
    // Create form data as expected by the backend
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('role', role);
    formData.append('is_active', 'true');  // Ensure user is active
    
    console.log(`Registering user: ${username} with role: ${role}`);
    
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...getAuthHeader(), // Include auth token for admin permission
      },
      body: formData.toString(),
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('User registration failed:', errorData);
      return false;
    }
    
    const data = await response.json();
    console.log('User registered successfully:', data);
    return true;
    
  } catch (error) {
    console.error('Error registering user:', error);
    return false;
  }
}

// Get all users from the backend (not implemented in current backend)
// This is a placeholder for future implementation
export async function getAllUsers() {
  try {
    // This would fetch users from backend if endpoint existed
    return null;
  } catch (error) {
    console.error('Error fetching users:', error);
    return null;
  }
}

// Update a user password in the backend
// This requires adding an endpoint to the backend
export async function changeUserPassword(
  username: string,
  newPassword: string
): Promise<boolean> {
  try {
    // This is a simplified implementation
    // We would need to add a dedicated endpoint to the backend
    // Since it doesn't exist yet, we'll use the registration endpoint as a workaround
    
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', newPassword);
    formData.append('role', 'update_password'); // Special flag to indicate password update
    
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...getAuthHeader(),
      },
      body: formData.toString(),
    });
    
    // This will likely fail with current backend
    // But we keep this as a placeholder for future implementation
    if (!response.ok) {
      return false;
    }
    
    return true;
    
  } catch (error) {
    console.error('Error changing password:', error);
    return false;
  }
}