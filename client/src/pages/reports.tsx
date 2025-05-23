import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";
import { StockImage } from "@/components/ui/stock-image";

// Sample data interfaces
interface SalesData {
  id: number;
  date: string;
  customer: string;
  iteam: string;
  shape: string;
  size: string;
  col: string;
  clr: string;
  pcs: number;
  lab_no: string;
  rate: number;
  total: number;
  term: string;
  currency: string;
  pay_mode: string;
  sales_executive: string;
  remark: string;
}

interface PurchaseData {
  id: number;
  date: string;
  vendor: string;
  iteam: string;
  shape: string;
  size: string;
  col: string;
  clr: string;
  pcs: number;
  lab_no: string;
  rate: number;
  total: number;
  term: string;
  currency: string;
  pay_mode: string;
  purchase_executive: string;
  remark: string;
}

interface ExpenseData {
  id: number;
  date: string;
  party: string;
  iteam: string;
  pcs: number;
  rate: number;
  total: number;
  term: string;
  currency: string;
  pay_mode: string;
  remark: string;
}

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B', '#6A7FDB'];

// Sample data - in a real app, this would be fetched from the API
const sampleSalesData: SalesData[] = [
  { id: 1, date: "2025-05-01T00:00:00Z", customer: "Maria Johnson", iteam: "Diamond Ring", shape: "Round", size: "1.5ct", col: "D", clr: "VS1", pcs: 1, lab_no: "GIA-12345", rate: 85000, total: 85000, term: "Net 30", currency: "INR", pay_mode: "Credit Card", sales_executive: "John Smith", remark: "Engagement ring" },
  { id: 2, date: "2025-05-02T00:00:00Z", customer: "Robert Chen", iteam: "Gold Chain", shape: "N/A", size: "24 inch", col: "Yellow", clr: "N/A", pcs: 1, lab_no: "N/A", rate: 45000, total: 45000, term: "Cash", currency: "INR", pay_mode: "Cash", sales_executive: "Emily Davis", remark: "" },
  { id: 3, date: "2025-05-05T00:00:00Z", customer: "Sarah Wilson", iteam: "Diamond Earrings", shape: "Princess", size: "0.5ct each", col: "F", clr: "VS2", pcs: 2, lab_no: "IGI-6789", rate: 35000, total: 70000, term: "Net 15", currency: "INR", pay_mode: "Bank Transfer", sales_executive: "John Smith", remark: "Anniversary gift" },
  { id: 4, date: "2025-05-07T00:00:00Z", customer: "David Lee", iteam: "Sapphire Pendant", shape: "Oval", size: "2ct", col: "Blue", clr: "N/A", pcs: 1, lab_no: "GIA-7890", rate: 55000, total: 55000, term: "Net 30", currency: "INR", pay_mode: "Credit Card", sales_executive: "Emily Davis", remark: "Birthday gift" },
  { id: 5, date: "2025-05-10T00:00:00Z", customer: "Lisa Brown", iteam: "Diamond Tennis Bracelet", shape: "Round", size: "0.1ct each", col: "G", clr: "SI1", pcs: 25, lab_no: "IGI-8901", rate: 8000, total: 200000, term: "Net 60", currency: "INR", pay_mode: "Financing", sales_executive: "Michael Wong", remark: "Wedding gift" },
  { id: 6, date: "2025-05-12T00:00:00Z", customer: "James Taylor", iteam: "Ruby Ring", shape: "Cushion", size: "1.2ct", col: "Red", clr: "N/A", pcs: 1, lab_no: "GIA-9012", rate: 65000, total: 65000, term: "Cash", currency: "INR", pay_mode: "Cash", sales_executive: "John Smith", remark: "" },
  { id: 7, date: "2025-05-15T00:00:00Z", customer: "Patricia Garcia", iteam: "Diamond Necklace", shape: "Round", size: "0.25ct each", col: "F", clr: "VVS2", pcs: 15, lab_no: "IGI-0123", rate: 12000, total: 180000, term: "Net 30", currency: "INR", pay_mode: "Credit Card", sales_executive: "Emily Davis", remark: "Anniversary gift" },
  { id: 8, date: "2025-05-18T00:00:00Z", customer: "Michael Clark", iteam: "Emerald Earrings", shape: "Pear", size: "1ct each", col: "Green", clr: "N/A", pcs: 2, lab_no: "GIA-1234", rate: 48000, total: 96000, term: "Net 15", currency: "INR", pay_mode: "Bank Transfer", sales_executive: "Michael Wong", remark: "" },
  { id: 9, date: "2025-05-20T00:00:00Z", customer: "Jennifer White", iteam: "Platinum Wedding Band", shape: "N/A", size: "Size 7", col: "White", clr: "N/A", pcs: 1, lab_no: "N/A", rate: 75000, total: 75000, term: "Net 30", currency: "INR", pay_mode: "Cash", sales_executive: "John Smith", remark: "Wedding" },
  { id: 10, date: "2025-05-23T00:00:00Z", customer: "Thomas Martinez", iteam: "Diamond Watch", shape: "Round", size: "0.05ct each", col: "G", clr: "VS1", pcs: 12, lab_no: "IGI-2345", rate: 5000, total: 60000, term: "Net 30", currency: "INR", pay_mode: "Credit Card", sales_executive: "Emily Davis", remark: "Graduation gift" },
];

const samplePurchaseData: PurchaseData[] = [
  { id: 1, date: "2025-05-02T00:00:00Z", vendor: "Diamond Wholesalers Inc.", iteam: "Loose Diamonds", shape: "Round", size: "1ct", col: "F", clr: "VS1", pcs: 5, lab_no: "GIA-34567", rate: 60000, total: 300000, term: "Net 60", currency: "INR", pay_mode: "Bank Transfer", purchase_executive: "Rajesh Kumar", remark: "Monthly stock replenishment" },
  { id: 2, date: "2025-05-05T00:00:00Z", vendor: "Golden Suppliers Ltd.", iteam: "Gold Chains", shape: "N/A", size: "24 inch", col: "Yellow", clr: "N/A", pcs: 10, lab_no: "N/A", rate: 30000, total: 300000, term: "Net 30", currency: "INR", pay_mode: "Bank Transfer", purchase_executive: "Rajesh Kumar", remark: "" },
  { id: 3, date: "2025-05-08T00:00:00Z", vendor: "Gemstone Traders", iteam: "Sapphires", shape: "Oval", size: "2ct", col: "Blue", clr: "N/A", pcs: 3, lab_no: "GIA-45678", rate: 40000, total: 120000, term: "Net 30", currency: "INR", pay_mode: "Cash", purchase_executive: "Priya Sharma", remark: "Special order" },
  { id: 4, date: "2025-05-12T00:00:00Z", vendor: "Luxury Metals Co.", iteam: "Platinum Sheets", shape: "N/A", size: "10x10cm", col: "White", clr: "N/A", pcs: 5, lab_no: "N/A", rate: 45000, total: 225000, term: "Net 60", currency: "INR", pay_mode: "Bank Transfer", purchase_executive: "Rajesh Kumar", remark: "For custom designs" },
  { id: 5, date: "2025-05-16T00:00:00Z", vendor: "Premium Diamond Supply", iteam: "Diamond Melee", shape: "Round", size: "0.1ct", col: "G", clr: "VS2", pcs: 100, lab_no: "IGI-56789", rate: 5000, total: 500000, term: "Net 45", currency: "INR", pay_mode: "Bank Transfer", purchase_executive: "Priya Sharma", remark: "For tennis bracelet production" },
  { id: 6, date: "2025-05-20T00:00:00Z", vendor: "Gemex Corporation", iteam: "Emeralds", shape: "Pear", size: "1ct", col: "Green", clr: "N/A", pcs: 4, lab_no: "GIA-67890", rate: 35000, total: 140000, term: "Net 30", currency: "INR", pay_mode: "Cash", purchase_executive: "Rajesh Kumar", remark: "" },
];

const sampleExpenseData: ExpenseData[] = [
  { id: 1, date: "2025-05-01T00:00:00Z", party: "ABC Rent Ltd.", iteam: "Store Rent", pcs: 1, rate: 150000, total: 150000, term: "Monthly", currency: "INR", pay_mode: "Bank Transfer", remark: "Main store monthly rent" },
  { id: 2, date: "2025-05-02T00:00:00Z", party: "City Power Corp.", iteam: "Electricity", pcs: 1, rate: 35000, total: 35000, term: "Monthly", currency: "INR", pay_mode: "Bank Transfer", remark: "Store and workshop" },
  { id: 3, date: "2025-05-05T00:00:00Z", party: "Staff Salaries", iteam: "Salaries", pcs: 12, rate: 45000, total: 540000, term: "Monthly", currency: "INR", pay_mode: "Bank Transfer", remark: "All staff monthly salaries" },
  { id: 4, date: "2025-05-08T00:00:00Z", party: "Security Systems Inc.", iteam: "Security Services", pcs: 1, rate: 25000, total: 25000, term: "Monthly", currency: "INR", pay_mode: "Bank Transfer", remark: "Store security system maintenance" },
  { id: 5, date: "2025-05-10T00:00:00Z", party: "Digital Marketing Agency", iteam: "Marketing", pcs: 1, rate: 75000, total: 75000, term: "Monthly", currency: "INR", pay_mode: "Bank Transfer", remark: "Social media and digital ads" },
  { id: 6, date: "2025-05-15T00:00:00Z", party: "Jewelry Tools Supplier", iteam: "Tools", pcs: 1, rate: 45000, total: 45000, term: "One-time", currency: "INR", pay_mode: "Credit Card", remark: "New tools for workshop" },
  { id: 7, date: "2025-05-20T00:00:00Z", party: "Insurance Company", iteam: "Insurance Premium", pcs: 1, rate: 85000, total: 85000, term: "Annual", currency: "INR", pay_mode: "Bank Transfer", remark: "Annual inventory insurance" },
  { id: 8, date: "2025-05-22T00:00:00Z", party: "Tax Department", iteam: "Quarterly Taxes", pcs: 1, rate: 225000, total: 225000, term: "Quarterly", currency: "INR", pay_mode: "Bank Transfer", remark: "Q2 tax payment" },
];

export default function Reports() {
  // State for data
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [purchaseData, setPurchaseData] = useState<PurchaseData[]>([]);
  const [expenseData, setExpenseData] = useState<ExpenseData[]>([]);
  const [activeTab, setActiveTab] = useState("sales");
  const [dateRange, setDateRange] = useState<{
    startDate: string;
    endDate: string;
  }>({
    startDate: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    endDate: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
  });
  const [isLocalStorageLoaded, setIsLocalStorageLoaded] = useState(false);
  
  // Load data from localStorage (if available) or use sample data
  useEffect(() => {
    const loadedSalesData = localStorage.getItem('salesData');
    const loadedPurchaseData = localStorage.getItem('purchaseData');
    const loadedExpenseData = localStorage.getItem('expenseData');
    
    setSalesData(loadedSalesData ? JSON.parse(loadedSalesData) : sampleSalesData);
    setPurchaseData(loadedPurchaseData ? JSON.parse(loadedPurchaseData) : samplePurchaseData);
    setExpenseData(loadedExpenseData ? JSON.parse(loadedExpenseData) : sampleExpenseData);
    
    setIsLocalStorageLoaded(true);
  }, []);
  
  // Filter data based on date range
  const filteredSalesData = salesData.filter(item => {
    const itemDate = new Date(item.date);
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);
    endDate.setHours(23, 59, 59); // Include the end date
    
    return itemDate >= startDate && itemDate <= endDate;
  });
  
  const filteredPurchaseData = purchaseData.filter(item => {
    const itemDate = new Date(item.date);
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);
    endDate.setHours(23, 59, 59); // Include the end date
    
    return itemDate >= startDate && itemDate <= endDate;
  });
  
  const filteredExpenseData = expenseData.filter(item => {
    const itemDate = new Date(item.date);
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);
    endDate.setHours(23, 59, 59); // Include the end date
    
    return itemDate >= startDate && itemDate <= endDate;
  });
  
  // Calculate summary statistics
  const totalSales = filteredSalesData.reduce((sum, item) => sum + item.total, 0);
  const totalPurchases = filteredPurchaseData.reduce((sum, item) => sum + item.total, 0);
  const totalExpenses = filteredExpenseData.reduce((sum, item) => sum + item.total, 0);
  const grossProfit = totalSales - totalPurchases;
  const netProfit = grossProfit - totalExpenses;
  const profitMargin = totalSales > 0 ? (netProfit / totalSales) * 100 : 0;
  
  // Generate daily aggregated data for charts
  const getDailySalesData = () => {
    const dailyData: Record<string, number> = {};
    
    filteredSalesData.forEach(item => {
      const date = format(new Date(item.date), 'dd/MM/yyyy');
      if (!dailyData[date]) {
        dailyData[date] = 0;
      }
      dailyData[date] += item.total;
    });
    
    return Object.keys(dailyData).map(date => ({
      date,
      sales: dailyData[date],
    })).sort((a, b) => {
      const dateA = new Date(a.date.split('/').reverse().join('-'));
      const dateB = new Date(b.date.split('/').reverse().join('-'));
      return dateA.getTime() - dateB.getTime();
    });
  };
  
  const getSalesByCategory = () => {
    const categoryData: Record<string, number> = {};
    
    filteredSalesData.forEach(item => {
      const category = item.iteam;
      if (!categoryData[category]) {
        categoryData[category] = 0;
      }
      categoryData[category] += item.total;
    });
    
    return Object.keys(categoryData).map(category => ({
      name: category,
      value: categoryData[category],
    }));
  };
  
  const getExpensesByCategory = () => {
    const categoryData: Record<string, number> = {};
    
    filteredExpenseData.forEach(item => {
      const category = item.iteam;
      if (!categoryData[category]) {
        categoryData[category] = 0;
      }
      categoryData[category] += item.total;
    });
    
    return Object.keys(categoryData).map(category => ({
      name: category,
      value: categoryData[category],
    }));
  };
  
  const getSalesByExecutive = () => {
    const executiveData: Record<string, number> = {};
    
    filteredSalesData.forEach(item => {
      const executive = item.sales_executive;
      if (!executiveData[executive]) {
        executiveData[executive] = 0;
      }
      executiveData[executive] += item.total;
    });
    
    return Object.keys(executiveData).map(executive => ({
      name: executive,
      value: executiveData[executive],
    }));
  };
  
  const getPaymentModeDistribution = () => {
    const modeData: Record<string, number> = {};
    
    filteredSalesData.forEach(item => {
      const mode = item.pay_mode;
      if (!modeData[mode]) {
        modeData[mode] = 0;
      }
      modeData[mode] += item.total;
    });
    
    return Object.keys(modeData).map(mode => ({
      name: mode,
      value: modeData[mode],
    }));
  };
  
  const getFinancialSummaryData = () => {
    return [
      { name: 'Sales', value: totalSales },
      { name: 'Purchases', value: totalPurchases },
      { name: 'Expenses', value: totalExpenses },
      { name: 'Gross Profit', value: grossProfit },
      { name: 'Net Profit', value: netProfit },
    ];
  };
  
  // Prepare data for charts
  const dailySalesData = getDailySalesData();
  const salesByCategory = getSalesByCategory();
  const expensesByCategory = getExpensesByCategory();
  const salesByExecutive = getSalesByExecutive();
  const paymentModeDistribution = getPaymentModeDistribution();
  const financialSummaryData = getFinancialSummaryData();
  
  // Date range handlers
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // Preset date ranges
  const setPresetRange = (days: number) => {
    const endDate = new Date();
    const startDate = subDays(endDate, days);
    
    setDateRange({
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
    });
  };
  
  // Set month-to-date
  const setMonthToDate = () => {
    const now = new Date();
    const startOfMonthDate = startOfMonth(now);
    
    setDateRange({
      startDate: format(startOfMonthDate, 'yyyy-MM-dd'),
      endDate: format(now, 'yyyy-MM-dd'),
    });
  };
  
  // Export report as CSV
  const exportCSV = () => {
    let data: string[][];
    let filename: string;
    
    switch (activeTab) {
      case "sales":
        data = [
          ["ID", "Date", "Customer", "Item", "Shape", "Size", "Color", "Clarity", "Pieces", "Lab No", "Rate", "Total", "Term", "Currency", "Payment Mode", "Sales Executive", "Remark"],
          ...filteredSalesData.map(item => [
            item.id.toString(),
            format(new Date(item.date), 'dd/MM/yyyy'),
            item.customer,
            item.iteam,
            item.shape,
            item.size,
            item.col,
            item.clr,
            item.pcs.toString(),
            item.lab_no,
            item.rate.toString(),
            item.total.toString(),
            item.term,
            item.currency,
            item.pay_mode,
            item.sales_executive,
            item.remark
          ])
        ];
        filename = "sales_report.csv";
        break;
      case "purchases":
        data = [
          ["ID", "Date", "Vendor", "Item", "Shape", "Size", "Color", "Clarity", "Pieces", "Lab No", "Rate", "Total", "Term", "Currency", "Payment Mode", "Purchase Executive", "Remark"],
          ...filteredPurchaseData.map(item => [
            item.id.toString(),
            format(new Date(item.date), 'dd/MM/yyyy'),
            item.vendor,
            item.iteam,
            item.shape,
            item.size,
            item.col,
            item.clr,
            item.pcs.toString(),
            item.lab_no,
            item.rate.toString(),
            item.total.toString(),
            item.term,
            item.currency,
            item.pay_mode,
            item.purchase_executive,
            item.remark
          ])
        ];
        filename = "purchase_report.csv";
        break;
      case "expenses":
        data = [
          ["ID", "Date", "Party", "Item", "Pieces", "Rate", "Total", "Term", "Currency", "Payment Mode", "Remark"],
          ...filteredExpenseData.map(item => [
            item.id.toString(),
            format(new Date(item.date), 'dd/MM/yyyy'),
            item.party,
            item.iteam,
            item.pcs.toString(),
            item.rate.toString(),
            item.total.toString(),
            item.term,
            item.currency,
            item.pay_mode,
            item.remark
          ])
        ];
        filename = "expense_report.csv";
        break;
      case "profitability":
        data = [
          ["Metric", "Amount", "Additional"],
          ["Total Sales", totalSales.toString(), ""],
          ["Total Purchases", totalPurchases.toString(), ""],
          ["Gross Profit", grossProfit.toString(), ""],
          ["Total Expenses", totalExpenses.toString(), ""],
          ["Net Profit", netProfit.toString(), ""],
          ["Profit Margin", profitMargin.toFixed(2) + "%", ""],
        ];
        filename = "profitability_report.csv";
        break;
      default:
        data = [["No data available"]];
        filename = "report.csv";
    }
    
    const csvContent = data.map(row => row.map(cell => 
      typeof cell === 'string' && cell.includes(',') 
        ? `"${cell.replace(/"/g, '""')}"` 
        : cell
    ).join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Print report
  const printReport = () => {
    let content = "";
    let title = "";
    
    switch (activeTab) {
      case "sales":
        title = "Sales Report";
        content = `
          <h2>${title}</h2>
          <p><strong>Period:</strong> ${format(new Date(dateRange.startDate), 'dd/MM/yyyy')} to ${format(new Date(dateRange.endDate), 'dd/MM/yyyy')}</p>
          <p><strong>Total Sales:</strong> ₹${totalSales.toLocaleString()}</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <thead>
              <tr style="background-color: #f2f2f2;">
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Date</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Customer</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Item</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Pieces</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Total</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Payment Mode</th>
              </tr>
            </thead>
            <tbody>
              ${filteredSalesData.map(item => `
                <tr>
                  <td style="border: 1px solid #ddd; padding: 8px;">${format(new Date(item.date), 'dd/MM/yyyy')}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${item.customer}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${item.iteam}</td>
                  <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${item.pcs}</td>
                  <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">₹${item.total.toLocaleString()}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${item.pay_mode}</td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr style="background-color: #f2f2f2; font-weight: bold;">
                <td style="border: 1px solid #ddd; padding: 8px;" colspan="3">Total</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${filteredSalesData.reduce((sum, item) => sum + item.pcs, 0)}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">₹${totalSales.toLocaleString()}</td>
                <td style="border: 1px solid #ddd; padding: 8px;"></td>
              </tr>
            </tfoot>
          </table>
        `;
        break;
      case "purchases":
        title = "Purchase Report";
        content = `
          <h2>${title}</h2>
          <p><strong>Period:</strong> ${format(new Date(dateRange.startDate), 'dd/MM/yyyy')} to ${format(new Date(dateRange.endDate), 'dd/MM/yyyy')}</p>
          <p><strong>Total Purchases:</strong> ₹${totalPurchases.toLocaleString()}</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <thead>
              <tr style="background-color: #f2f2f2;">
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Date</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Vendor</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Item</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Pieces</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Total</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Payment Mode</th>
              </tr>
            </thead>
            <tbody>
              ${filteredPurchaseData.map(item => `
                <tr>
                  <td style="border: 1px solid #ddd; padding: 8px;">${format(new Date(item.date), 'dd/MM/yyyy')}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${item.vendor}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${item.iteam}</td>
                  <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${item.pcs}</td>
                  <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">₹${item.total.toLocaleString()}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${item.pay_mode}</td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr style="background-color: #f2f2f2; font-weight: bold;">
                <td style="border: 1px solid #ddd; padding: 8px;" colspan="3">Total</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${filteredPurchaseData.reduce((sum, item) => sum + item.pcs, 0)}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">₹${totalPurchases.toLocaleString()}</td>
                <td style="border: 1px solid #ddd; padding: 8px;"></td>
              </tr>
            </tfoot>
          </table>
        `;
        break;
      case "expenses":
        title = "Expense Report";
        content = `
          <h2>${title}</h2>
          <p><strong>Period:</strong> ${format(new Date(dateRange.startDate), 'dd/MM/yyyy')} to ${format(new Date(dateRange.endDate), 'dd/MM/yyyy')}</p>
          <p><strong>Total Expenses:</strong> ₹${totalExpenses.toLocaleString()}</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <thead>
              <tr style="background-color: #f2f2f2;">
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Date</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Party</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Item</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Total</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Payment Mode</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Remark</th>
              </tr>
            </thead>
            <tbody>
              ${filteredExpenseData.map(item => `
                <tr>
                  <td style="border: 1px solid #ddd; padding: 8px;">${format(new Date(item.date), 'dd/MM/yyyy')}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${item.party}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${item.iteam}</td>
                  <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">₹${item.total.toLocaleString()}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${item.pay_mode}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${item.remark}</td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr style="background-color: #f2f2f2; font-weight: bold;">
                <td style="border: 1px solid #ddd; padding: 8px;" colspan="3">Total</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">₹${totalExpenses.toLocaleString()}</td>
                <td style="border: 1px solid #ddd; padding: 8px;" colspan="2"></td>
              </tr>
            </tfoot>
          </table>
        `;
        break;
      case "profitability":
        title = "Profitability Report";
        content = `
          <h2>${title}</h2>
          <p><strong>Period:</strong> ${format(new Date(dateRange.startDate), 'dd/MM/yyyy')} to ${format(new Date(dateRange.endDate), 'dd/MM/yyyy')}</p>
          <table style="width: 60%; border-collapse: collapse; margin-top: 20px;">
            <thead>
              <tr style="background-color: #f2f2f2;">
                <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Metric</th>
                <th style="border: 1px solid #ddd; padding: 12px; text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="border: 1px solid #ddd; padding: 12px; font-weight: bold;">Total Sales</td>
                <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">₹${totalSales.toLocaleString()}</td>
              </tr>
              <tr>
                <td style="border: 1px solid #ddd; padding: 12px;">Total Purchases</td>
                <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">₹${totalPurchases.toLocaleString()}</td>
              </tr>
              <tr>
                <td style="border: 1px solid #ddd; padding: 12px; font-weight: bold;">Gross Profit</td>
                <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">₹${grossProfit.toLocaleString()}</td>
              </tr>
              <tr>
                <td style="border: 1px solid #ddd; padding: 12px;">Total Expenses</td>
                <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">₹${totalExpenses.toLocaleString()}</td>
              </tr>
              <tr>
                <td style="border: 1px solid #ddd; padding: 12px; font-weight: bold;">Net Profit</td>
                <td style="border: 1px solid #ddd; padding: 12px; text-align: right; ${netProfit < 0 ? 'color: red;' : ''}">₹${netProfit.toLocaleString()}</td>
              </tr>
              <tr>
                <td style="border: 1px solid #ddd; padding: 12px; font-weight: bold;">Profit Margin</td>
                <td style="border: 1px solid #ddd; padding: 12px; text-align: right; ${profitMargin < 0 ? 'color: red;' : ''}">${profitMargin.toFixed(2)}%</td>
              </tr>
            </tbody>
          </table>
          
          <div style="margin-top: 40px;">
            <h3>Summary</h3>
            <p>This report covers the financial performance for the period from ${format(new Date(dateRange.startDate), 'dd MMMM yyyy')} to ${format(new Date(dateRange.endDate), 'dd MMMM yyyy')}.</p>
            <p>The business generated total sales of ₹${totalSales.toLocaleString()} with purchases of ₹${totalPurchases.toLocaleString()}, resulting in a gross profit of ₹${grossProfit.toLocaleString()}.</p>
            <p>After accounting for expenses of ₹${totalExpenses.toLocaleString()}, the net profit for this period was ₹${netProfit.toLocaleString()}, representing a profit margin of ${profitMargin.toFixed(2)}%.</p>
          </div>
        `;
        break;
      default:
        title = "Report";
        content = "<h2>No data available</h2>";
    }
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Please allow pop-ups to print the report.");
      return;
    }
    
    printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            h2 { color: #333; margin-bottom: 20px; }
            h3 { color: #555; margin-top: 30px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { padding: 8px; text-align: left; border: 1px solid #ddd; }
            th { background-color: #f2f2f2; }
            .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #777; }
            @media print {
              body { margin: 20px; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div style="text-align: center; margin-bottom: 30px;">
            <h1>Jewelry Management System</h1>
            <p>${format(new Date(), 'dd MMMM yyyy, HH:mm')}</p>
          </div>
          
          ${content}
          
          <div class="footer">
            <p>Generated from Jewelry Management System on ${format(new Date(), 'dd MMMM yyyy, HH:mm')}</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <button onclick="window.print();" style="padding: 10px 20px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">Print Report</button>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
  };

  return (
    <MainLayout title="Reports & Charts">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Reports & Charts</h1>
          <p className="text-neutral-500">Comprehensive business analytics and financial reporting</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={exportCSV}>
            Export CSV
          </Button>
          <Button variant="outline" onClick={printReport}>
            Print Report
          </Button>
        </div>
      </div>
      
      {/* Date Range Selector */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div className="space-y-2 md:col-span-2">
              <div className="flex gap-4">
                <div className="space-y-2 flex-1">
                  <Label htmlFor="startDate">From</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={dateRange.startDate}
                    onChange={handleDateChange}
                  />
                </div>
                <div className="space-y-2 flex-1">
                  <Label htmlFor="endDate">To</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={dateRange.endDate}
                    onChange={handleDateChange}
                  />
                </div>
              </div>
            </div>
            <div className="md:col-span-3">
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => setPresetRange(7)}>
                  Last 7 days
                </Button>
                <Button variant="outline" size="sm" onClick={() => setPresetRange(30)}>
                  Last 30 days
                </Button>
                <Button variant="outline" size="sm" onClick={() => setPresetRange(90)}>
                  Last 90 days
                </Button>
                <Button variant="outline" size="sm" onClick={setMonthToDate}>
                  This Month
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{formatCurrency(totalSales)}</div>
            <p className="text-xs text-neutral-500 mt-1">
              {filteredSalesData.length} transactions
            </p>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Total Purchases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{formatCurrency(totalPurchases)}</div>
            <p className="text-xs text-neutral-500 mt-1">
              {filteredPurchaseData.length} transactions
            </p>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{formatCurrency(totalExpenses)}</div>
            <p className="text-xs text-neutral-500 mt-1">
              {filteredExpenseData.length} transactions
            </p>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Gross Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${grossProfit < 0 ? 'text-red-500' : ''}`}>
              ₹{formatCurrency(grossProfit)}
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              (Sales - Purchases)
            </p>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netProfit < 0 ? 'text-red-500' : ''}`}>
              ₹{formatCurrency(netProfit)}
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              {profitMargin.toFixed(2)}% margin
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Report Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full mb-6">
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="purchases">Purchases</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="profitability">Profitability</TabsTrigger>
        </TabsList>
        
        {/* Sales Tab */}
        <TabsContent value="sales">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales Over Time</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailySalesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Sales']} />
                    <Legend />
                    <Line type="monotone" dataKey="sales" name="Sales" stroke="#0088FE" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={salesByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {salesByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales by Executive</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesByExecutive}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Sales']} />
                    <Legend />
                    <Bar dataKey="value" name="Sales Amount" fill="#0088FE" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Payment Mode Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentModeDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {paymentModeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Sales Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Pieces</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Executive</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSalesData.length > 0 ? (
                      filteredSalesData.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{format(new Date(item.date), 'dd/MM/yyyy')}</TableCell>
                          <TableCell>{item.customer}</TableCell>
                          <TableCell>{item.iteam}</TableCell>
                          <TableCell>
                            <span className="text-xs">
                              {item.shape} {item.size} {item.col}-{item.clr}
                            </span>
                          </TableCell>
                          <TableCell>{item.pcs}</TableCell>
                          <TableCell className="text-right">₹{item.total.toLocaleString()}</TableCell>
                          <TableCell>{item.pay_mode}</TableCell>
                          <TableCell>{item.sales_executive}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-6 text-neutral-500">
                          No sales data found for the selected date range.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Purchases Tab */}
        <TabsContent value="purchases">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Purchase History</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredPurchaseData.map(item => ({
                    date: format(new Date(item.date), 'dd/MM/yyyy'),
                    amount: item.total
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Amount']} />
                    <Legend />
                    <Bar dataKey="amount" name="Purchase Amount" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Purchase by Category</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={filteredPurchaseData.reduce((acc, curr) => {
                        const existingCategory = acc.find(item => item.name === curr.iteam);
                        if (existingCategory) {
                          existingCategory.value += curr.total;
                        } else {
                          acc.push({ name: curr.iteam, value: curr.total });
                        }
                        return acc;
                      }, [] as { name: string; value: number }[])}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {filteredPurchaseData.reduce((acc, curr) => {
                        const existingCategory = acc.find(item => item.name === curr.iteam);
                        if (existingCategory) {
                          existingCategory.value += curr.total;
                        } else {
                          acc.push({ name: curr.iteam, value: curr.total });
                        }
                        return acc;
                      }, [] as { name: string; value: number }[]).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Purchase Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Pieces</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Executive</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPurchaseData.length > 0 ? (
                      filteredPurchaseData.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{format(new Date(item.date), 'dd/MM/yyyy')}</TableCell>
                          <TableCell>{item.vendor}</TableCell>
                          <TableCell>{item.iteam}</TableCell>
                          <TableCell>
                            <span className="text-xs">
                              {item.shape} {item.size} {item.col}-{item.clr}
                            </span>
                          </TableCell>
                          <TableCell>{item.pcs}</TableCell>
                          <TableCell className="text-right">₹{item.total.toLocaleString()}</TableCell>
                          <TableCell>{item.pay_mode}</TableCell>
                          <TableCell>{item.purchase_executive}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-6 text-neutral-500">
                          No purchase data found for the selected date range.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Expenses Tab */}
        <TabsContent value="expenses">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Expense Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expensesByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {expensesByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Monthly Expenses</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredExpenseData.map(item => ({
                    date: format(new Date(item.date), 'dd/MM/yyyy'),
                    amount: item.total,
                    category: item.iteam
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Amount']} />
                    <Legend />
                    <Bar dataKey="amount" name="Expense Amount" fill="#FF8042" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Expense Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Party</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead>Pieces</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Term</TableHead>
                      <TableHead>Remark</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExpenseData.length > 0 ? (
                      filteredExpenseData.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{format(new Date(item.date), 'dd/MM/yyyy')}</TableCell>
                          <TableCell>{item.party}</TableCell>
                          <TableCell>{item.iteam}</TableCell>
                          <TableCell>{item.pcs}</TableCell>
                          <TableCell className="text-right">₹{item.total.toLocaleString()}</TableCell>
                          <TableCell>{item.pay_mode}</TableCell>
                          <TableCell>{item.term}</TableCell>
                          <TableCell>{item.remark}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-6 text-neutral-500">
                          No expense data found for the selected date range.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Profitability Tab */}
        <TabsContent value="profitability">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Financial Overview</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'Sales', value: totalSales },
                    { name: 'Purchases', value: totalPurchases },
                    { name: 'Expenses', value: totalExpenses },
                    { name: 'Gross Profit', value: grossProfit },
                    { name: 'Net Profit', value: netProfit }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, '']} />
                    <Legend />
                    <Bar dataKey="value" name="Amount" fill={(entry) => 
                      entry.name === 'Sales' ? '#0088FE' :
                      entry.name === 'Purchases' ? '#00C49F' :
                      entry.name === 'Expenses' ? '#FF8042' :
                      entry.name === 'Gross Profit' ? '#8884D8' :
                      '#FF6B6B'
                    } />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profit Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <table className="w-full">
                    <tbody>
                      <tr className="border-b">
                        <td className="py-3 font-medium">Total Sales</td>
                        <td className="py-3 text-right">₹{totalSales.toLocaleString()}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3">Total Purchases</td>
                        <td className="py-3 text-right">₹{totalPurchases.toLocaleString()}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 font-medium">Gross Profit</td>
                        <td className={`py-3 text-right ${grossProfit < 0 ? 'text-red-500' : ''}`}>₹{grossProfit.toLocaleString()}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3">Total Expenses</td>
                        <td className="py-3 text-right">₹{totalExpenses.toLocaleString()}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 font-medium">Net Profit</td>
                        <td className={`py-3 text-right ${netProfit < 0 ? 'text-red-500' : ''}`}>₹{netProfit.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="py-3 font-medium">Profit Margin</td>
                        <td className={`py-3 text-right ${profitMargin < 0 ? 'text-red-500' : ''}`}>{profitMargin.toFixed(2)}%</td>
                      </tr>
                    </tbody>
                  </table>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold mb-1">{profitMargin.toFixed(1)}%</div>
                  <p className="text-sm text-neutral-500">Profit Margin</p>
                  <div className="w-full bg-neutral-100 rounded-full h-2.5 mt-2">
                    <div 
                      className={`h-2.5 rounded-full ${profitMargin < 0 ? 'bg-red-500' : 'bg-primary'}`} 
                      style={{ width: `${Math.max(0, Math.min(profitMargin, 100))}%` }}
                    ></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales vs. Expenses</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={
                    Array.from(new Set([
                      ...filteredSalesData.map(item => format(new Date(item.date), 'dd/MM/yyyy')),
                      ...filteredExpenseData.map(item => format(new Date(item.date), 'dd/MM/yyyy'))
                    ])).sort((a, b) => {
                      const dateA = new Date(a.split('/').reverse().join('-'));
                      const dateB = new Date(b.split('/').reverse().join('-'));
                      return dateA.getTime() - dateB.getTime();
                    }).map(date => {
                      const salesForDate = filteredSalesData
                        .filter(item => format(new Date(item.date), 'dd/MM/yyyy') === date)
                        .reduce((sum, item) => sum + item.total, 0);
                      
                      const expensesForDate = filteredExpenseData
                        .filter(item => format(new Date(item.date), 'dd/MM/yyyy') === date)
                        .reduce((sum, item) => sum + item.total, 0);
                        
                      return {
                        date,
                        sales: salesForDate,
                        expenses: expensesForDate
                      };
                    })
                  }>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, '']} />
                    <Legend />
                    <Line type="monotone" dataKey="sales" name="Sales" stroke="#0088FE" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#FF8042" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Executive Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Executive</TableHead>
                        <TableHead>Sales Amount</TableHead>
                        <TableHead>Transactions</TableHead>
                        <TableHead>Avg. Sale Value</TableHead>
                        <TableHead className="text-right">Contribution</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {salesByExecutive.length > 0 ? (
                        salesByExecutive.map((exec) => {
                          const transactions = filteredSalesData.filter(item => item.sales_executive === exec.name).length;
                          const avgSale = transactions > 0 ? exec.value / transactions : 0;
                          const contribution = totalSales > 0 ? (exec.value / totalSales) * 100 : 0;
                          
                          return (
                            <TableRow key={exec.name}>
                              <TableCell className="font-medium">{exec.name}</TableCell>
                              <TableCell>₹{exec.value.toLocaleString()}</TableCell>
                              <TableCell>{transactions}</TableCell>
                              <TableCell>₹{avgSale.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</TableCell>
                              <TableCell className="text-right">{contribution.toFixed(1)}%</TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-6 text-neutral-500">
                            No sales data found for the selected date range.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}