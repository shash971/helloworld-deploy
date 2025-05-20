import React from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { useToggle } from "@/hooks/use-toggle";
import { Toaster } from "@/components/ui/toaster";

interface MainLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function MainLayout({ children, title }: MainLayoutProps) {
  const [sidebarOpen, toggleSidebar, setSidebarOpen] = useToggle(true);
  
  // Adjust sidebar visibility on screen resize
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    // Set initial state based on screen size
    handleResize();
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setSidebarOpen]);
  
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 overflow-auto h-screen">
        <Header title={title} onOpenSidebar={() => setSidebarOpen(true)} />
        
        <main className="p-6">
          {children}
        </main>
      </div>
      
      <Toaster />
    </div>
  );
}
