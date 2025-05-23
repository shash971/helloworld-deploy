import React, { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { SimpleBarChart, ChartCard } from "@/components/dashboard/chart-card";
import { ProgressCard, ProgressBar } from "@/components/dashboard/progress-card";
import { StatsCard } from "@/components/dashboard/stats-card";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge, TransactionBadge } from "@/components/dashboard/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL, getAuthHeader, isAuthenticated } from "@/lib/auth";
import { useLocation } from "wouter";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check authentication and redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      setLocation('/role-login');
    }
  }, [setLocation]);
  
  // Fetch sales data from backend instead of using dashboard endpoint that doesn't exist
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch sales data
        const salesResponse = await fetch(`${API_BASE_URL}/sales/`, {
          headers: getAuthHeader()
        });
        
        let salesData = [];
        if (salesResponse.ok) {
          salesData = await salesResponse.json();
          console.log("Sales data fetched:", salesData);
        } else {
          console.error('Failed to fetch sales data');
        }
        
        // Calculate dashboard metrics from sales data
        const now = new Date();
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();
        
        // Filter sales for current month
        const thisMonthSales = salesData.filter((sale: any) => {
          const saleDate = new Date(sale.date);
          return saleDate.getMonth() === thisMonth && saleDate.getFullYear() === thisYear;
        });
        
        // Calculate total sales amount
        const totalSalesAmount = salesData.reduce((total: number, sale: any) => {
          return total + (Number(sale.total) || 0);
        }, 0);
        
        // Calculate this month's sales
        const thisMonthSalesAmount = thisMonthSales.reduce((total: number, sale: any) => {
          return total + (Number(sale.total) || 0);
        }, 0);
        
        // Get pending payments (sales with status "Pending")
        const pendingPayments = salesData.filter((sale: any) => 
          sale.pay_mode === "Pending"
        ).reduce((total: number, sale: any) => {
          return total + (Number(sale.total) || 0);
        }, 0);
        
        // Get recent transactions (sales converted to transaction format)
        const recentSalesTransactions = salesData.slice(0, 5).map((sale: any) => ({
          id: sale.id,
          date: new Date(sale.date),
          transactionId: `SL-${70000 + sale.id}`,
          type: 'Sale',
          customerVendor: sale.customer || 'Customer',
          amount: Number(sale.total) || 0,
          status: sale.pay_mode || 'Pending',
        }));
        
        // Generate dummy growth percentage based on data
        const randomGrowth = (Math.random() * 20) - 5; // Between -5% and 15%
        
        // Create dashboard data object
        const dashboardDataObj = {
          total_sales: totalSalesAmount,
          monthly_sales: thisMonthSalesAmount,
          sales_growth: randomGrowth.toFixed(1),
          pending_payments: pendingPayments,
          recent_transactions: recentSalesTransactions,
          total_transactions: salesData.length,
          // Mock other metrics since we don't have that data yet
          total_purchases: Math.round(totalSalesAmount * 0.7),
          purchases_growth: (randomGrowth / 2).toFixed(1),
          inventory_value: Math.round(totalSalesAmount * 1.5),
          inventory_breakdown: {
            jewellery: 65,
            certified: 23,
            loose: 12
          }
        };
        
        setDashboardData(dashboardDataObj);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isAuthenticated()) {
      fetchAllData();
    }
  }, []);
  
  // Use state instead of queries since the endpoints don't exist yet
  const [salesData, setSalesData] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);
  
  // Use real transactions from dashboard data, or fallback to empty array
  const recentTransactions = dashboardData?.recent_transactions || [];

  // Define column type to fix type errors
  type Transaction = typeof recentTransactions[0];
  
  // Define column configs for transactions table
  const getColumns = () => [
    {
      header: "Date",
      accessor: (row: Transaction) => formatDate(row.date),
      sortable: true,
    },
    {
      header: "Transaction ID",
      accessor: (row: Transaction) => (
        <span className="font-medium text-primary">{row.transactionId}</span>
      ),
      sortable: true,
    },
    {
      header: "Type",
      accessor: (row: Transaction) => (
        <TransactionBadge type={row.type} />
      ),
      sortable: true,
    },
    {
      header: "Customer/Vendor",
      accessor: (row: Transaction) => row.customerVendor,
      sortable: true,
    },
    {
      header: "Amount",
      accessor: (row: Transaction) => (
        <span className="font-medium">{formatCurrency(row.amount)}</span>
      ),
      sortable: true,
    },
    {
      header: "Status",
      accessor: (row: Transaction) => (
        <StatusBadge type="status" value={row.status} />
      ),
    },
  ];
  
  const columns = getColumns();
  
  // Stock overview data
  const stockItems = [
    { 
      label: "Jewellery Stock", 
      value: "352 items", 
      percentage: 75, 
      color: "primary" 
    },
    { 
      label: "Certified Stock", 
      value: "128 items", 
      percentage: 45, 
      color: "secondary" 
    },
    { 
      label: "Loose Stock", 
      value: "96 items", 
      percentage: 30, 
      color: "info" 
    },
    { 
      label: "Memo Given", 
      value: "8 items", 
      percentage: 15, 
      color: "warning" 
    },
    { 
      label: "Memo Taken", 
      value: "5 items", 
      percentage: 10, 
      color: "success" 
    },
  ];
  
  // Upcoming tasks
  const upcomingTasks = [
    {
      id: 1,
      title: "IGI Certificate Pickup",
      description: "Pickup 5 certified diamonds from IGI Mumbai office",
      dueDate: "Tomorrow",
      priority: "High",
      icon: <i className="fas fa-certificate"></i>,
      iconColor: "warning",
    },
    {
      id: 2,
      title: "Inventory Count",
      description: "Complete quarterly physical inventory count for all stock",
      dueDate: "Jul 15, 2023",
      priority: "Medium",
      icon: <i className="fas fa-gem"></i>,
      iconColor: "info",
    },
    {
      id: 3,
      title: "Supplier Payment",
      description: "Process payment to Global Gems Ltd. for last month's purchase",
      dueDate: "Jul 18, 2023",
      priority: "Low",
      icon: <i className="fas fa-coins"></i>,
      iconColor: "success",
    },
  ];
  
  // Extract dashboard summary data from our calculated values
  const totalSales = dashboardData?.total_sales || 0;
  const totalPurchases = dashboardData?.total_purchases || 0;
  const inventoryValue = dashboardData?.inventory_value || 0;
  const pendingPayments = dashboardData?.pending_payments || 0;
  const totalTransactions = dashboardData?.total_transactions || 0;
  
  return (
    <MainLayout title="Dashboard">
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Sales Summary Card */}
        <ChartCard 
          title="Total Sales" 
          value={formatCurrency(totalSales)}
          changePercentage={dashboardData?.sales_growth || 12.5}
        >
          <SimpleBarChart color="primary" />
        </ChartCard>
        
        {/* Purchases Summary Card */}
        <ChartCard 
          title="Total Purchases" 
          value={formatCurrency(totalPurchases)}
          changePercentage={dashboardData?.purchases_growth || 8.3}
        >
          <SimpleBarChart color="secondary" />
        </ChartCard>
        
        {/* Inventory Value Card */}
        <ProgressCard
          title="Inventory Value"
          value={formatCurrency(inventoryValue)}
          items={[
            { 
              label: "Jewellery", 
              value: 0, 
              percentage: dashboardData?.inventory_breakdown?.jewellery || 65, 
              color: "primary" 
            },
            { 
              label: "Certified", 
              value: 0, 
              percentage: dashboardData?.inventory_breakdown?.certified || 23, 
              color: "secondary" 
            },
            { 
              label: "Loose", 
              value: 0, 
              percentage: dashboardData?.inventory_breakdown?.loose || 12, 
              color: "info" 
            },
          ]}
          footnote={{ label: "Last update:", value: "Today, 15:30" }}
        />
      </div>
      
      {/* Secondary Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Pending Payments */}
        <StatsCard
          icon={<i className="fas fa-hourglass-half text-lg"></i>}
          title="Pending Payments"
          value={formatCurrency(pendingPayments)}
          iconColor="warning"
        />
        
        {/* Total Transactions */}
        <StatsCard
          icon={<i className="fas fa-exchange-alt text-lg"></i>}
          title="Total Transactions"
          value={`${totalTransactions} items`}
          iconColor="info"
        />
        
        {/* Monthly Sales */}
        <StatsCard
          icon={<i className="fas fa-chart-line text-lg"></i>}
          title="This Month Sales"
          value={formatCurrency(dashboardData?.monthly_sales || 0)}
          iconColor="success"
        />
        
        {/* Top Selling Category */}
        <StatsCard
          icon={<i className="fas fa-crown text-lg"></i>}
          title="Top Category"
          value="Diamond Jewelry"
          iconColor="primary"
        />
      </div>
      
      {/* Recent Transactions Table */}
      <Card className="shadow-sm mb-6">
        <div className="p-6 border-b border-neutral-200">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-neutral-800">Recent Transactions</h3>
            <div className="flex space-x-2">
              <Select>
                <SelectTrigger className="text-sm w-[150px] pl-8 relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400">
                    <i className="fas fa-filter"></i>
                  </span>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="purchases">Purchases</SelectItem>
                  <SelectItem value="expenses">Expenses</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => {
                // Navigate to sales page for now since we don't have a dedicated transactions page
                window.location.href = "/sales";
              }}>View All</Button>
            </div>
          </div>
        </div>
        <DataTable
          columns={columns.map(col => ({ ...col }))}
          data={recentTransactions}
          keyField="id"
          isLoading={isLoading}
          actionComponent={(row) => (
            <Button 
              variant="link" 
              className="text-primary hover:text-primary-dark"
              onClick={() => {
                // Show transaction details when View is clicked
                const transactionDetails = `
                  Transaction ID: ${row.transactionId}
                  Date: ${formatDate(row.date)}
                  Type: ${row.type}
                  Customer/Vendor: ${row.customerVendor}
                  Amount: ${formatCurrency(row.amount)}
                  Status: ${row.status}
                `;
                alert(transactionDetails);
              }}
            >
              View
            </Button>
          )}
        />
        
        {/* Add View All Button at the bottom */}
        <div className="p-4 flex justify-end border-t border-neutral-200">
          <Button 
            variant="default" 
            className="bg-primary hover:bg-primary-dark text-white"
            onClick={() => window.location.href = "/sales"}
          >
            View All
          </Button>
        </div>
      </Card>
      
      {/* Bottom Row Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock Overview */}
        <Card className="shadow-sm">
          <div className="p-6 border-b border-neutral-200">
            <h3 className="font-semibold text-neutral-800">Stock Overview</h3>
          </div>
          <CardContent className="p-6">
            <div className="mt-4 space-y-6">
              {stockItems.map((item, index) => (
                <ProgressBar
                  key={index}
                  title={item.label}
                  value={item.value}
                  percentage={item.percentage}
                  color={item.color}
                />
              ))}
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button 
                variant="link" 
                className="text-primary hover:text-primary-dark font-medium"
                onClick={() => {
                  window.location.href = "/jewellery-stock";
                }}
              >
                View Detailed Report <i className="fas fa-arrow-right ml-2"></i>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Upcoming Tasks */}
        <Card className="shadow-sm">
          <div className="p-6 border-b border-neutral-200">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-neutral-800">Upcoming Tasks</h3>
              <Button 
                variant="link" 
                className="text-primary hover:text-primary-dark font-medium"
                onClick={() => window.location.href = "/tasks"}
              >
                View All
              </Button>
            </div>
          </div>
          <div className="divide-y divide-neutral-200">
            {upcomingTasks.map((task) => (
              <div key={task.id} className="p-6 hover:bg-neutral-50">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <span className={`inline-flex h-10 w-10 items-center justify-center rounded-full bg-${task.iconColor}/10 text-${task.iconColor}`}>
                      {task.icon}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between">
                      <h4 className="text-sm font-medium text-neutral-900">{task.title}</h4>
                      <span className="text-xs text-neutral-500">{task.dueDate}</span>
                    </div>
                    <p className="mt-1 text-sm text-neutral-600">{task.description}</p>
                    <div className="mt-2">
                      <StatusBadge type="priority" value={task.priority} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
