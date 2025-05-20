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
  
  // Fetch dashboard data from backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_BASE_URL}/dashboard/`, {
          headers: getAuthHeader()
        });
        
        if (response.ok) {
          const data = await response.json();
          setDashboardData(data);
        } else {
          console.error('Failed to fetch dashboard data');
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isAuthenticated()) {
      fetchDashboardData();
    }
  }, []);
  
  // Sales summary query
  const { data: salesData } = useQuery({
    queryKey: ['/sales/summary'],
    enabled: isAuthenticated()
  });
  
  // Fetch additional data for other sections as needed
  const { data: inventoryData } = useQuery({
    queryKey: ['/inventory/'],
    enabled: isAuthenticated()
  });
  
  // Mock recent transactions until we have real API data
  const recentTransactions = [
    {
      id: 1,
      date: new Date('2023-07-12'),
      transactionId: 'SL-10249',
      type: 'Sale',
      customerVendor: 'Rahul Mehta',
      amount: 125000,
      status: 'Completed',
    },
    {
      id: 2,
      date: new Date('2023-07-11'),
      transactionId: 'PO-3452',
      type: 'Purchase',
      customerVendor: 'Global Gems Ltd.',
      amount: 82500,
      status: 'Completed',
    },
    {
      id: 3,
      date: new Date('2023-07-10'),
      transactionId: 'EX-0089',
      type: 'Expense',
      customerVendor: 'Utility Bills',
      amount: 18450,
      status: 'Completed',
    },
    {
      id: 4,
      date: new Date('2023-07-09'),
      transactionId: 'IGI-452',
      type: 'IGI Send',
      customerVendor: 'IGI Mumbai',
      amount: 12000,
      status: 'Pending',
    },
    {
      id: 5,
      date: new Date('2023-07-08'),
      transactionId: 'MG-234',
      type: 'Memo Give',
      customerVendor: 'Priya Jewellers',
      amount: 245000,
      status: 'Pending',
    },
  ];

  const columns = [
    {
      header: "Date",
      accessor: (row: typeof recentTransactions[0]) => formatDate(row.date),
      sortable: true,
    },
    {
      header: "Transaction ID",
      accessor: (row: typeof recentTransactions[0]) => (
        <span className="font-medium text-primary">{row.transactionId}</span>
      ),
      sortable: true,
    },
    {
      header: "Type",
      accessor: (row: typeof recentTransactions[0]) => (
        <TransactionBadge type={row.type} />
      ),
      sortable: true,
    },
    {
      header: "Customer/Vendor",
      accessor: "customerVendor",
      sortable: true,
    },
    {
      header: "Amount",
      accessor: (row: typeof recentTransactions[0]) => (
        <span className="font-medium">{formatCurrency(row.amount)}</span>
      ),
      sortable: true,
    },
    {
      header: "Status",
      accessor: (row: typeof recentTransactions[0]) => (
        <StatusBadge type="status" value={row.status} />
      ),
    },
  ];
  
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
  
  return (
    <MainLayout title="Dashboard">
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Sales Summary Card */}
        <ChartCard 
          title="Total Sales" 
          value={formatCurrency(2375492)}
          changePercentage={12.5}
        >
          <SimpleBarChart color="primary" />
        </ChartCard>
        
        {/* Purchases Summary Card */}
        <ChartCard 
          title="Total Purchases" 
          value={formatCurrency(1842100)}
          changePercentage={8.3}
        >
          <SimpleBarChart color="secondary" />
        </ChartCard>
        
        {/* Inventory Value Card */}
        <ProgressCard
          title="Inventory Value"
          value={formatCurrency(15268900)}
          items={[
            { label: "Jewellery", value: 0, percentage: 65, color: "primary" },
            { label: "Certified", value: 0, percentage: 23, color: "secondary" },
            { label: "Loose", value: 0, percentage: 12, color: "info" },
          ]}
          footnote={{ label: "Last update:", value: "Today, 15:30" }}
        />
      </div>
      
      {/* Secondary Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Pending IGI Certifications */}
        <StatsCard
          icon={<i className="fas fa-certificate text-lg"></i>}
          title="Pending IGI"
          value="12 items"
          iconColor="warning"
        />
        
        {/* Memo Items (Given) */}
        <StatsCard
          icon={<i className="fas fa-paper-plane text-lg"></i>}
          title="Memo (Given)"
          value="8 items"
          iconColor="info"
        />
        
        {/* Expenses This Month */}
        <StatsCard
          icon={<i className="fas fa-file-invoice-dollar text-lg"></i>}
          title="Month Expenses"
          value={formatCurrency(235600)}
          iconColor="error"
        />
        
        {/* Top Selling Category */}
        <StatsCard
          icon={<i className="fas fa-crown text-lg"></i>}
          title="Top Category"
          value="Diamond Rings"
          iconColor="success"
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
              <Button>View All</Button>
            </div>
          </div>
        </div>
        <DataTable
          columns={columns}
          data={recentTransactions}
          keyField="id"
          actionComponent={(row) => (
            <Button variant="link" className="text-primary hover:text-primary-dark">
              View
            </Button>
          )}
        />
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
              <Button variant="link" className="text-primary hover:text-primary-dark font-medium">
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
              <Button variant="link" className="text-primary hover:text-primary-dark font-medium">
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
