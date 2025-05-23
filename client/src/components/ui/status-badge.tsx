import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  type: 'status' | 'payment';
  value: string;
}

export function StatusBadge({ type, value }: StatusBadgeProps) {
  const getVariant = () => {
    if (type === 'status') {
      switch (value?.toLowerCase()) {
        case 'completed':
          return 'success';
        case 'pending':
          return 'warning';
        case 'cancelled':
          return 'error';
        default:
          return 'default';
      }
    } else if (type === 'payment') {
      switch (value?.toLowerCase()) {
        case 'cash':
        case 'paid':
          return 'success';
        case 'credit card':
        case 'bank transfer':
          return 'info';
        case 'check':
        case 'pending':
          return 'warning';
        default:
          return 'default';
      }
    }
    return 'default';
  };

  const getStyles = () => {
    const variant = getVariant();
    switch (variant) {
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'info':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  return (
    <Badge 
      className={cn(
        "font-normal",
        getStyles()
      )}
      variant="outline"
    >
      {value}
    </Badge>
  );
}