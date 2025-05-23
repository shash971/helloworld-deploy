import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { logout, getAuthHeader, API_BASE_URL } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  title: string;
  onOpenSidebar: () => void;
}

export function Header({ title, onOpenSidebar }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userFullName, setUserFullName] = useState<string>("User");
  const [userRole, setUserRole] = useState<string>("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Get user info from localStorage or fetch from API
  useEffect(() => {
    const storedFullName = localStorage.getItem("userFullName");
    const storedRole = localStorage.getItem("userRole");
    
    if (storedFullName) {
      setUserFullName(storedFullName);
    }
    
    if (storedRole) {
      setUserRole(storedRole);
    } else {
      // Fetch user info from API if not in localStorage
      fetchUserInfo();
    }
  }, []);
  
  // Fetch user info from backend
  const fetchUserInfo = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/`, {
        headers: getAuthHeader()
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.role) {
          setUserRole(data.role);
          localStorage.setItem("userRole", data.role);
        }
        
        if (data.message) {
          // Extract user name from welcome message if available
          const nameMatch = data.message.match(/Welcome, (.*?)!/);
          if (nameMatch && nameMatch[1]) {
            setUserFullName(nameMatch[1]);
            localStorage.setItem("userFullName", nameMatch[1]);
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch user info:", error);
    }
  };
  
  // Handle logout
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully"
    });
    setLocation('/role-login');
  };
  
  return (
    <header className="bg-white shadow-sm">
      <div className="flex justify-between items-center py-4 px-6">
        <div className="flex items-center">
          <button
            className="lg:hidden mr-2 text-neutral-500 hover:text-primary"
            onClick={onOpenSidebar}
          >
            <i className="fas fa-bars"></i>
          </button>
          <h2 className="text-lg font-semibold text-neutral-800">{title}</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search..."
              className="pl-8 pr-4 py-2 rounded-full text-sm w-40 lg:w-64"
            />
            <i className="fas fa-search absolute left-3 top-2.5 text-neutral-400"></i>
          </div>
          
          {/* Notifications */}
          <div className="relative">
            <button className="text-neutral-500 hover:text-primary p-1 relative">
              <i className="fas fa-bell"></i>
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-error"></span>
            </button>
          </div>
          
          {/* User Menu */}
          <DropdownMenu open={showUserMenu} onOpenChange={setShowUserMenu}>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center text-neutral-700 hover:text-primary">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-2">
                  <i className="fas fa-user-circle"></i>
                </div>
                <div className="hidden md:block text-left">
                  <span className="text-sm font-medium block">{userFullName}</span>
                  {userRole && (
                    <span className="text-xs text-neutral-500">{userRole}</span>
                  )}
                </div>
                <i className={cn("fas fa-chevron-down text-xs ml-2", showUserMenu && "rotate-180 transition-transform")}></i>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setLocation('/user-profile')}>
                <i className="fas fa-user mr-2 text-neutral-500"></i> My Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLocation('/user-profile?tab=security')}>
                <i className="fas fa-cog mr-2 text-neutral-500"></i> Security Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-error" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt mr-2"></i> Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
