import React from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SidebarItemProps {
  title: string;
  icon: React.ReactNode;
  href: string;
  isActive: boolean;
}

function SidebarItem({ title, icon, href, isActive }: SidebarItemProps) {
  return (
    <li>
      <Link
        href={href}
        className={cn(
          "sidebar-item",
          isActive && "active"
        )}
      >
        <span className="w-5 text-center mr-3">{icon}</span>
        <span>{title}</span>
      </Link>
    </li>
  );
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [location] = useLocation();
  
  const sidebarItems = [
    {
      title: "Dashboard",
      icon: <i className="fas fa-tachometer-alt"></i>,
      href: "/dashboard",
    },
    {
      title: "Sales",
      icon: <i className="fas fa-shopping-cart"></i>,
      href: "/sales",
    },
    {
      title: "Purchase",
      icon: <i className="fas fa-shopping-bag"></i>,
      href: "/purchase",
    },
    {
      title: "Expenses",
      icon: <i className="fas fa-file-invoice-dollar"></i>,
      href: "/expenses",
    },
    {
      section: "Stock Management",
      items: [
        {
          title: "Loose Stock",
          icon: <i className="fas fa-box-open"></i>,
          href: "/loose-stock",
        },
        {
          title: "Certified Stock",
          icon: <i className="fas fa-certificate"></i>,
          href: "/certified-stock",
        },
        {
          title: "Jewellery Stock",
          icon: <i className="fas fa-ring"></i>,
          href: "/jewellery-stock",
        },
        {
          title: "Jewellery Management",
          icon: <i className="fas fa-gem"></i>,
          href: "/jewellery-management",
        },
        {
          title: "Inventory Management",
          icon: <i className="fas fa-warehouse"></i>,
          href: "/inventory-management",
        },
      ],
    },
    {
      section: "Certification",
      items: [
        {
          title: "IGI Issue",
          icon: <i className="fas fa-file-export"></i>,
          href: "/igi-issue",
        },
        {
          title: "IGI Receive",
          icon: <i className="fas fa-file-import"></i>,
          href: "/igi-receive",
        },
      ],
    },
    {
      section: "Memo",
      items: [
        {
          title: "Memo (Give)",
          icon: <i className="fas fa-paper-plane"></i>,
          href: "/memo-give",
        },
        {
          title: "Memo (Take)",
          icon: <i className="fas fa-hand-holding"></i>,
          href: "/memo-take",
        },
      ],
    },
    {
      section: "Reports",
      items: [
        {
          title: "Reports & Charts",
          icon: <i className="fas fa-chart-bar"></i>,
          href: "/reports",
        },
      ],
    },
    {
      section: "Administration",
      items: [
        {
          title: "Role-Based Login",
          icon: <i className="fas fa-user-shield"></i>,
          href: "/role-login",
        },
      ],
    },
  ];
  
  return (
    <>
      <aside
        className={cn(
          "bg-white shadow-lg w-64 fixed inset-y-0 left-0 z-50 transform transition duration-200 ease-in-out lg:translate-x-0 overflow-hidden",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:relative"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <div className="flex items-center space-x-2">
            <span className="text-secondary inline-block">
              <i className="fas fa-gem text-2xl"></i>
            </span>
            <h1 className="text-xl font-display font-semibold text-primary">Jewelr</h1>
          </div>
          <button
            className="lg:hidden text-neutral-500 hover:text-primary"
            onClick={onClose}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        {/* Navigation */}
        <ScrollArea className="h-[calc(100vh-64px)]">
          <nav className="py-4">
            <ul>
              {sidebarItems.map((item, idx) => {
                if ("section" in item) {
                  return (
                    <React.Fragment key={idx}>
                      <li className="px-4 pt-5 pb-2">
                        <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                          {item.section}
                        </span>
                      </li>
                      {item.items.map((subItem, subIdx) => (
                        <SidebarItem
                          key={`${idx}-${subIdx}`}
                          title={subItem.title}
                          icon={subItem.icon}
                          href={subItem.href}
                          isActive={location === subItem.href}
                        />
                      ))}
                    </React.Fragment>
                  );
                }
                
                return (
                  <SidebarItem
                    key={idx}
                    title={item.title}
                    icon={item.icon}
                    href={item.href}
                    isActive={location === item.href}
                  />
                );
              })}
            </ul>
          </nav>
        </ScrollArea>
      </aside>
      
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}
    </>
  );
}
