import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = "₹"): string {
  return `${currency}${amount.toLocaleString('en-IN')}`;
}

export function formatDate(date: Date | string): string {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function getTransactionStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'success';
    case 'pending':
      return 'warning';
    case 'cancelled':
      return 'error';
    default:
      return 'info';
  }
}

export function getTransactionTypeColor(type: string): string {
  switch (type.toLowerCase()) {
    case 'sale':
      return 'success';
    case 'purchase':
      return 'info';
    case 'expense':
      return 'error';
    case 'memo give':
    case 'igi send':
      return 'info';
    case 'igi receive':
    case 'memo take':
      return 'warning';
    default:
      return 'primary';
  }
}

export function getPriorityColor(priority: string): string {
  switch (priority.toLowerCase()) {
    case 'high':
      return 'warning';
    case 'medium':
      return 'info';
    case 'low':
      return 'success';
    default:
      return 'primary';
  }
}

export function truncateText(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function generateRandomId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function getInitials(name: string): string {
  if (!name) return '';
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
}
