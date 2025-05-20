import React from "react";
import { cn, formatPercentage } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ChartCardProps {
  title: string;
  value: string;
  changePercentage: number;
  children: React.ReactNode;
  months?: string[];
  className?: string;
  gradientFrom?: string;
  gradientTo?: string;
}

export function ChartCard({
  title,
  value,
  changePercentage,
  children,
  months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  className,
  gradientFrom = "primary/5",
  gradientTo = "primary/20"
}: ChartCardProps) {
  const isPositiveChange = changePercentage >= 0;

  return (
    <Card className={cn("shadow-sm", className)}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-neutral-500 text-sm font-medium">{title}</h3>
            <p className="text-2xl font-semibold mt-1">{value}</p>
          </div>
          <Badge variant={isPositiveChange ? "success" : "error"} className="flex items-center">
            {isPositiveChange ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
            {formatPercentage(Math.abs(changePercentage))}
          </Badge>
        </div>
        
        <div className="h-[70px] overflow-hidden">
          {children}
        </div>
        
        <div className="flex justify-between items-center mt-4 text-xs text-neutral-500">
          {months.map((month, index) => (
            <span key={month} className={cn(index === months.length - 1 ? "font-medium text-primary" : "")}>
              {month}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function SimpleBarChart({ color = "primary" }: { color?: string }) {
  return (
    <div className={`h-full w-full bg-gradient-to-r from-${color}/5 to-${color}/20 rounded-md relative overflow-hidden`}>
      <div className={`absolute bottom-0 left-0 w-full h-[60%] bg-gradient-to-t from-${color}/0 to-${color}/10`}></div>
      <div className={`absolute bottom-0 left-0 w-full h-px bg-${color}/20`}></div>
      <div className="absolute bottom-0 left-0 right-0 h-[40px] flex items-end space-x-1 px-1">
        <div className={`w-1/12 bg-${color}/40 rounded-t h-[15px]`}></div>
        <div className={`w-1/12 bg-${color}/40 rounded-t h-[25px]`}></div>
        <div className={`w-1/12 bg-${color}/40 rounded-t h-[18px]`}></div>
        <div className={`w-1/12 bg-${color}/40 rounded-t h-[30px]`}></div>
        <div className={`w-1/12 bg-${color}/40 rounded-t h-[22px]`}></div>
        <div className={`w-1/12 bg-${color}/40 rounded-t h-[28px]`}></div>
        <div className={`w-1/12 bg-${color}/60 rounded-t h-[32px]`}></div>
        <div className={`w-1/12 bg-${color}/60 rounded-t h-[25px]`}></div>
        <div className={`w-1/12 bg-${color}/80 rounded-t h-[35px]`}></div>
        <div className={`w-1/12 bg-${color}/80 rounded-t h-[28px]`}></div>
        <div className={`w-1/12 bg-${color} rounded-t h-[38px]`}></div>
        <div className={`w-1/12 bg-${color} rounded-t h-[32px]`}></div>
      </div>
    </div>
  );
}
