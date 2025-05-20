import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function RoleLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<string>("admin");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!username || !password) {
      toast({
        title: "Error",
        description: "Please enter both username and password",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would be an API call
    if (username === "admin" && password === "admin") {
      // Successful login
      localStorage.setItem("userRole", role);
      localStorage.setItem("userFullName", "Admin User");
      
      toast({
        title: "Welcome back",
        description: "You've successfully logged in",
      });
      
      setLocation("/");
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid username or password",
        variant: "destructive",
      });
    }
  };

  const roles = [
    { id: "admin", label: "Administrator", icon: "fas fa-user-shield" },
    { id: "manager", label: "Store Manager", icon: "fas fa-user-tie" },
    { id: "sales", label: "Sales Associate", icon: "fas fa-user-tag" },
    { id: "inventory", label: "Inventory Manager", icon: "fas fa-boxes" },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-50">
      <div className="w-full max-w-4xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col justify-center">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-neutral-800 mb-2">Jewelry Management System</h1>
              <p className="text-neutral-500">Please sign in to access your dashboard</p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input 
                      id="username" 
                      value={username} 
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full">
                    Sign In
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
          
          <div className="hidden md:flex flex-col justify-center">
            <h2 className="text-xl font-semibold text-neutral-800 mb-4">Select your role</h2>
            <div className="grid grid-cols-2 gap-4">
              {roles.map((r) => (
                <Card 
                  key={r.id}
                  className={`cursor-pointer transition-all ${role === r.id ? 'border-primary bg-primary/5' : 'border-neutral-200 hover:border-primary/50'}`}
                  onClick={() => setRole(r.id)}
                >
                  <CardContent className="p-4 flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${role === r.id ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-600'}`}>
                      <i className={r.icon}></i>
                    </div>
                    <div>
                      <p className="font-medium">{r.label}</p>
                      <p className="text-xs text-neutral-500">Access level: {r.id}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-8 bg-info/10 p-4 rounded-md">
              <div className="flex items-start">
                <div className="mr-3 text-info">
                  <i className="fas fa-info-circle text-lg"></i>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-800">Demo Credentials</h3>
                  <p className="text-sm text-neutral-600 mt-1">
                    Username: admin<br />
                    Password: admin
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}