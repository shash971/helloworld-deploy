import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
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
                <span className="text-sm font-medium hidden md:inline-block">Admin User</span>
                <i className={cn("fas fa-chevron-down text-xs ml-2", showUserMenu && "rotate-180 transition-transform")}></i>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>
                <i className="fas fa-user mr-2 text-neutral-500"></i> My Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <i className="fas fa-cog mr-2 text-neutral-500"></i> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-error">
                <i className="fas fa-sign-out-alt mr-2"></i> Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
