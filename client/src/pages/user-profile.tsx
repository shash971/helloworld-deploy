import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/alert";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { changeUserPassword } from "@/lib/userService";

export default function UserProfile() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  
  // Check for tab parameter in URL
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const tabParam = searchParams.get('tab');
    if (tabParam === 'security') {
      setActiveTab('security');
    }
  }, []);
  
  // State for user profile
  const [userProfile, setUserProfile] = useState({
    username: "",
    fullName: "",
    email: "",
    role: "",
    lastLogin: "",
  });
  
  // Password change form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  
  // Load user profile data
  useEffect(() => {
    // In a real application, we would fetch this from an API
    // For now, we'll use localStorage data
    setUserProfile({
      username: localStorage.getItem('userUsername') || "admin",
      fullName: localStorage.getItem('userFullName') || "Admin User",
      email: localStorage.getItem('userEmail') || "admin@jewelrymanagement.com",
      role: localStorage.getItem('userRole') || "admin",
      lastLogin: localStorage.getItem('userLastLogin') || new Date().toISOString(),
    });
  }, []);
  
  // Handle password form input change
  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle profile form submission (update user profile)
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, we would make an API call here
    // For now, we'll just update the localStorage
    localStorage.setItem('userFullName', userProfile.fullName);
    localStorage.setItem('userEmail', userProfile.email);
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
      variant: "default",
    });
  };
  
  // Handle password change form submission
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Validate password inputs
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      toast({
        title: "Password Error",
        description: "New passwords don't match.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      toast({
        title: "Password Error",
        description: "New password must be at least 6 characters long.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }
    
    try {
      // In a production app, call an API to change the password
      // For now, we'll use our helper function that connects to backend
      const success = await changeUserPassword(userProfile.username, passwordForm.newPassword);
      
      if (success) {
        toast({
          title: "Password Updated",
          description: "Your password has been changed successfully.",
          variant: "default",
        });
        
        // Reset form
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
      } else {
        toast({
          title: "Password Update Failed",
          description: "There was a problem updating your password. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Detect changes to profile form inputs
  const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <MainLayout title="User Profile">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">My Profile</h1>
          <p className="text-neutral-500">View and manage your account settings</p>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        {/* Profile Tab */}
        <TabsContent value="profile">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    View and update your profile details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          name="username"
                          value={userProfile.username}
                          disabled
                        />
                        <p className="text-xs text-neutral-500">Username cannot be changed</p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Input
                          id="role"
                          name="role"
                          value={userProfile.role === 'admin' ? 'Administrator' : 
                                 userProfile.role === 'manager' ? 'Store Manager' :
                                 userProfile.role === 'sales' ? 'Sales Associate' :
                                 userProfile.role === 'inventory' ? 'Inventory Manager' :
                                 userProfile.role === 'accountant' ? 'Accountant' : 
                                 userProfile.role}
                          disabled
                        />
                        <p className="text-xs text-neutral-500">Contact an administrator to change your role</p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          value={userProfile.fullName}
                          onChange={handleProfileInputChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={userProfile.email}
                          onChange={handleProfileInputChange}
                        />
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Button type="submit">Save Changes</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Account Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">Account Status</p>
                    <Badge className="mt-1 bg-green-100 text-green-800 hover:bg-green-100">
                      Active
                    </Badge>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">Last Login</p>
                    <p className="text-sm text-neutral-600 mt-1">
                      {format(new Date(userProfile.lastLogin), 'dd MMM yyyy, HH:mm')}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">User Permissions</p>
                    <p className="text-sm text-neutral-600 mt-1">
                      Based on your role: <span className="font-medium">{
                        userProfile.role === 'admin' ? 'Administrator' : 
                        userProfile.role === 'manager' ? 'Store Manager' :
                        userProfile.role === 'sales' ? 'Sales Associate' :
                        userProfile.role === 'inventory' ? 'Inventory Manager' :
                        userProfile.role === 'accountant' ? 'Accountant' : 
                        userProfile.role
                      }</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Security Tab */}
        <TabsContent value="security">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your password to maintain account security
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                      <Input
                        id="confirmNewPassword"
                        name="confirmNewPassword"
                        type="password"
                        value={passwordForm.confirmNewPassword}
                        onChange={handlePasswordInputChange}
                        required
                      />
                    </div>
                    
                    <div className="pt-4">
                      <Button type="submit" disabled={loading}>
                        {loading ? "Updating..." : "Change Password"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Security Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <AlertTitle>Strong Password Guidelines</AlertTitle>
                    <AlertDescription>
                      <ul className="list-disc list-inside text-xs space-y-1 mt-2">
                        <li>Use at least 8 characters</li>
                        <li>Include uppercase and lowercase letters</li>
                        <li>Add numbers and special characters</li>
                        <li>Avoid using the same password for multiple accounts</li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                  
                  <p className="text-sm text-neutral-600">
                    For security reasons, you'll be asked to login again after changing your password.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}