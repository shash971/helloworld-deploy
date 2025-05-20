import React from "react";
import { Badge } from "@/components/ui/badge";
import { getTransactionStatusColor, getTransactionTypeColor, getPriorityColor } from "@/lib/utils";

interface StatusBadgeProps {
  type: "status" | "transaction" | "priority";
  value: string;
  className?: string;
}

export function StatusBadge({ type, value, className }: StatusBadgeProps) {
  let badgeVariant: string;
  
  switch (type) {
    case "status":
      badgeVariant = getTransactionStatusColor(value);
      break;
    case "transaction":
      badgeVariant = getTransactionTypeColor(value);
      break;
    case "priority":
      badgeVariant = getPriorityColor(value);
      break;
    default:
      badgeVariant = "default";
  }
  
  return (
    <Badge variant={badgeVariant as any} className={className}>
      {value}
    </Badge>
  );
}

interface TransactionBadgeProps {
  type: string;
  className?: string;
}

export function TransactionBadge({ type, className }: TransactionBadgeProps) {
  return <StatusBadge type="transaction" value={type} className={className} />;
}

interface StatusBadgeWithIconProps {
  status: string;
  className?: string;
}

export function StatusBadgeWithIcon({ status, className }: StatusBadgeWithIconProps) {
  const variant = getTransactionStatusColor(status);
  
  return (
    <Badge variant={variant as any} className={className}>
      {status === "Completed" && (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )}
      {status === "Pending" && (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )}
      {status === "Cancelled" && (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
      {status}
    </Badge>
  );
}
