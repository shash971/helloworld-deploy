import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  iconColor: string;
  className?: string;
}

export function StatsCard({ icon, title, value, iconColor, className }: StatsCardProps) {
  const getIconBgColor = () => {
    switch (iconColor) {
      case 'warning':
        return 'bg-warning/20 text-warning';
      case 'info':
        return 'bg-info/20 text-info';
      case 'error':
        return 'bg-error/20 text-error';
      case 'success':
        return 'bg-success/20 text-success';
      case 'primary':
        return 'bg-primary/20 text-primary';
      case 'secondary':
        return 'bg-secondary/20 text-secondary';
      default:
        return 'bg-primary/20 text-primary';
    }
  };

  return (
    <Card className={cn("shadow-sm", className)}>
      <CardContent className="p-4 flex items-center">
        <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mr-4", getIconBgColor())}>
          {icon}
        </div>
        <div>
          <h3 className="text-neutral-500 text-sm font-medium">{title}</h3>
          <p className="text-xl font-semibold mt-1">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
