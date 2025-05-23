import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { API_BASE_URL, getAuthHeader, isAuthenticated } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

// Form schema for sales creation
const formSchema = z.object({
  invoiceNumber: z.string(),
  date: z.string().min(1, "Date is required"),
  customerName: z.string().min(1, "Customer name is required"),
  totalAmount: z.string().min(1, "Amount is required").refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    { message: "Amount must be a positive number" }
  ),
  paymentStatus: z.string(),
  notes: z.string().optional(),
});

// Define interface for a sale item
interface SaleItem {
  id: number;
  invoiceNumber: string;
  date: Date;
  customerName: string;
  totalAmount: number;
  paymentStatus: string;
  items: string;
}

export default function Sales() {
  const [openDialog, setOpenDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [salesData, setSalesData] = useState<SaleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Form setup
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      invoiceNumber: `SL-${Math.floor(70000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split("T")[0],
      customerName: "",
      totalAmount: "",
      paymentStatus: "Pending",
      notes: "",
    },
  });
  
  // Fetch sales data from backend
  const fetchSales = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/sales/`, {
        headers: {
          ...getAuthHeader()
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching sales: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Received sales data:", data);
      
      // Transform the backend data to our frontend format
      if (Array.isArray(data) && data.length > 0) {
        const transformedData = data.map((sale: any, index: number) => ({
          id: sale.id || index + 1,
          invoiceNumber: `SL-${70000 + (sale.id || index)}`,
          date: new Date(sale.date),
          customerName: sale.customer || 'Customer',
          totalAmount: parseFloat(sale.total?.toString() || '0'),
          paymentStatus: sale.pay_mode || 'Pending',
          items: sale.iteam || 'Jewelry Item',
        }));
        
        setSalesData(transformedData);
      }
    } catch (err) {
      console.error("Error fetching sales:", err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'Error fetching sales data',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load sales data when component mounts
  useEffect(() => {
    if (isAuthenticated()) {
      fetchSales();
    }
  }, []);
  
  // Submit form data
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    try {
      // Format the date string properly as YYYY-MM-DD
      const dateObj = new Date(values.date);
      const formattedDate = dateObj.toISOString().split('T')[0];
      
      // Create sale data object exactly matching the SQLite table structure
      const saleData = {
        date: formattedDate,
        customer: values.customerName,
        iteam: "Diamond Jewelry", // Default jewelry item
        shape: "Round",  // Default value
        size: "Medium",  // Default value
        col: "D",        // Diamond color
        clr: "VS1",      // Diamond clarity
        pcs: 1,          // Default pieces
        lab_no: values.invoiceNumber.replace("SL-", ""),
        rate: parseFloat(values.totalAmount) || 0,
        total: parseFloat(values.totalAmount) || 0,
        term: "Net 30",  // Default value
        currency: "INR", // Default value
        pay_mode: values.paymentStatus,
        sales_executive: "Admin", // Default value
        remark: values.notes || ""
      };
      
      console.log("Sending sale data to backend:", saleData);
      
      const response = await fetch(`${API_BASE_URL}/sales/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(saleData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create sale: ${errorText}`);
      }
      
      const result = await response.json();
      console.log("Sale created successfully:", result);
      
      toast({
        title: "Success",
        description: "Sale created successfully",
        variant: "default",
      });
      
      // Reset the form
      form.reset({
        invoiceNumber: `SL-${Math.floor(70000 + Math.random() * 9000)}`,
        date: new Date().toISOString().split("T")[0],
        customerName: "",
        totalAmount: "",
        paymentStatus: "Pending",
        notes: "",
      });
      
      // Close the dialog
      setOpenDialog(false);
      
      // Refresh sales data
      fetchSales();
      
    } catch (error) {
      console.error("Sale creation error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create sale",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  
  // Column definition for the data table
  const columns = [
    {
      header: "Invoice Number",
      accessor: (row: SaleItem) => (
        <span className="font-medium text-primary">{row.invoiceNumber}</span>
      ),
      sortable: true,
    },
    {
      header: "Date",
      accessor: (row: SaleItem) => formatDate(row.date),
      sortable: true,
    },
    {
      header: "Customer",
      accessor: (row: SaleItem) => row.customerName,
      sortable: true,
    },
    {
      header: "Items",
      accessor: (row: SaleItem) => row.items,
    },
    {
      header: "Amount",
      accessor: (row: SaleItem) => (
        <span className="font-medium">{formatCurrency(row.totalAmount)}</span>
      ),
      sortable: true,
    },
    {
      header: "Status",
      accessor: (row: SaleItem) => (
        <StatusBadge type="status" value={row.paymentStatus} />
      ),
    },
  ];
  
  return (
    <MainLayout title="Sales">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-800">Sales Management</h1>
          <p className="text-neutral-500">Manage all sales transactions</p>
        </div>
        <Button onClick={() => setOpenDialog(true)}>
          <i className="fas fa-plus mr-2"></i> New Sale
        </Button>
      </div>
      
      {/* Sales Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-neutral-500">Total Sales (This Month)</p>
                <h3 className="text-2xl font-semibold mt-1">
                  {formatCurrency(
                    salesData.reduce((total, sale) => total + sale.totalAmount, 0)
                  )}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <i className="fas fa-shopping-cart text-lg"></i>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-neutral-500">Pending Payments</p>
                <h3 className="text-2xl font-semibold mt-1">
                  {formatCurrency(
                    salesData
                      .filter(sale => sale.paymentStatus === 'Pending')
                      .reduce((total, sale) => total + sale.totalAmount, 0)
                  )}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center text-warning">
                <i className="fas fa-clock text-lg"></i>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-neutral-500">Total Transactions</p>
                <h3 className="text-2xl font-semibold mt-1">{salesData.length}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center text-success">
                <i className="fas fa-file-invoice text-lg"></i>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Sales Data Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <p>Loading sales data...</p>
            </div>
          ) : salesData.length === 0 ? (
            <div className="flex justify-center items-center h-32">
              <p>No sales records found. Start by creating a new sale.</p>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={salesData}
              keyField="id"
              actionComponent={(row) => (
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <i className="fas fa-eye mr-1"></i> View
                  </Button>
                  <Button variant="outline" size="sm">
                    <i className="fas fa-print mr-1"></i> Print
                  </Button>
                </div>
              )}
            />
          )}
        </CardContent>
      </Card>
      
      {/* New Sale Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Create New Sale</DialogTitle>
            <DialogDescription>
              Enter the sale details below to create a new sales record.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="invoiceNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invoice Number</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter customer name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="totalAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Amount (₹)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter amount" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="paymentStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Status</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        rows={3} 
                        {...field} 
                        value={field.value || ''} 
                        placeholder="Any additional notes" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpenDialog(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Sale"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}