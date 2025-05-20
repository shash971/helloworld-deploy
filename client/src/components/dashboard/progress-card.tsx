import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface ProgressItem {
  label: string;
  value: number;
  percentage: number;
  color: string;
}

interface ProgressCardProps {
  title: string;
  value: string;
  items: ProgressItem[];
  className?: string;
  footnote?: { label: string; value: string };
}

export function ProgressCard({ title, value, items, className, footnote }: ProgressCardProps) {
  const getProgressColor = (color: string) => {
    switch (color) {
      case 'primary':
        return 'bg-primary';
      case 'secondary':
        return 'bg-secondary';
      case 'info':
        return 'bg-info';
      case 'warning':
        return 'bg-warning';
      case 'success':
        return 'bg-success';
      case 'error':
        return 'bg-error';
      default:
        return 'bg-primary';
    }
  };

  return (
    <Card className={cn("shadow-sm", className)}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-neutral-500 text-sm font-medium">{title}</h3>
            <p className="text-2xl font-semibold mt-1">{value}</p>
          </div>
        </div>
        
        <div className="flex mt-4 space-x-1">
          {items.map((item, index) => (
            <div key={index} className="flex-1">
              <div className="h-3 bg-neutral-200 rounded-full overflow-hidden">
                <div className={cn("h-full rounded-full", getProgressColor(item.color))} style={{ width: `${item.percentage}%` }}></div>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-xs text-neutral-600">{item.label}</span>
                <span className="text-xs font-medium">{item.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
        
        {footnote && (
          <div className="mt-4 pt-4 border-t border-neutral-200">
            <div className="flex justify-between items-center">
              <span className="text-xs text-neutral-500">{footnote.label}</span>
              <span className="text-xs text-neutral-700">{footnote.value}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface ProgressBarProps {
  title: string;
  value: string;
  percentage: number;
  color?: string;
}

export function ProgressBar({ title, value, percentage, color = "primary" }: ProgressBarProps) {
  return (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        <span className="text-sm text-neutral-600">{title}</span>
        <span className="text-sm font-medium">{value}</span>
      </div>
      <div className="h-2.5 bg-neutral-200 rounded-full overflow-hidden">
        <div className={`h-full bg-${color}`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
}
