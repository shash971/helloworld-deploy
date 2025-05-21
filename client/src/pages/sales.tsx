import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { insertSaleSchema } from "@shared/schema";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { API_BASE_URL, getAuthHeader, isAuthenticated } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

const formSchema = insertSaleSchema.extend({
  date: z.string().min(1, "Date is required"),
  totalAmount: z.string().min(1, "Amount is required").refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    { message: "Amount must be a positive number" }
  ),
  customerName: z.string().min(1, "Customer name is required"),
});

export default function Sales() {
  const [openDialog, setOpenDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Define interface for API response
  interface SalesApiResponse {
    sales_data?: any[];
    total_sales?: number;
    pending_payments?: number;
    total_transactions?: number;
  }
  
  // Fetch sales data directly
  const { data: salesApiData, isLoading, error } = useQuery<any[]>({
    queryKey: ['/sales/'],
    enabled: isAuthenticated(),
    retry: 1,
  });
  
  // Use API data if available, otherwise use sample data
  const [salesData, setSalesData] = useState<any[]>([
    {
      id: 1,
      invoiceNumber: "SL-10249",
      date: new Date("2023-07-12"),
      customerName: "Rahul Mehta",
      totalAmount: 125000,
      paymentStatus: "Completed",
      items: "Diamond Ring (1.2ct), Gold Chain",
    },
    {
      id: 2,
      invoiceNumber: "SL-10248",
      date: new Date("2023-07-10"),
      customerName: "Anjali Shah",
      totalAmount: 87500,
      paymentStatus: "Completed",
      items: "Emerald Earrings, Silver Bracelet",
    },
    {
      id: 3,
      invoiceNumber: "SL-10247",
      date: new Date("2023-07-08"),
      customerName: "Mohan Patel",
      totalAmount: 156000,
      paymentStatus: "Completed",
      items: "Diamond Necklace (2.5ct)",
    },
    {
      id: 4,
      invoiceNumber: "SL-10246",
      date: new Date("2023-07-05"),
      customerName: "Ravi Kumar",
      totalAmount: 45000,
      paymentStatus: "Pending",
      items: "Gold Earrings, Silver Anklet",
    },
    {
      id: 5,
      invoiceNumber: "SL-10245",
      date: new Date("2023-07-03"),
      customerName: "Priya Desai",
      totalAmount: 210000,
      paymentStatus: "Completed",
      items: "Platinum Ring with Diamonds",
    },
    {
      id: 6,
      invoiceNumber: "SL-10244",
      date: new Date("2023-07-01"),
      customerName: "Suresh Jain",
      totalAmount: 95000,
      paymentStatus: "Completed",
      items: "Gold Bangle Set",
    },
  ]);
  
  // Process API data when it arrives
  useEffect(() => {
    console.log("Sales API data received:", salesApiData);
    if (salesApiData) {
      try {
        // Check if salesApiData is an array (GET /sales endpoint returns an array)
        const salesArray = Array.isArray(salesApiData) ? salesApiData : [];
        
        if (salesArray.length > 0) {
          // Transform API data to match our frontend structure
          const transformedData = salesArray.map((sale: any, index: number) => ({
            id: sale.id || index + 1,
            invoiceNumber: `SL-${70000 + sale.id}`,
            date: new Date(sale.date),
            customerName: sale.customer || 'Customer',
            totalAmount: parseFloat(sale.total?.toString() || '0'),
            paymentStatus: sale.pay_mode === 'Full Payment' ? 'Completed' : 'Pending',
            items: sale.iteam || 'Jewelry Item',
          }));
          
          console.log("Transformed sales data:", transformedData);
          setSalesData(transformedData);
        } else {
          console.log("No sales data found in API response, using sample data");
        }
      } catch (error) {
        console.error('Error processing sales data:', error);
      }
    }
  }, [salesApiData]);
  
  const columns = [
    {
      header: "Invoice Number",
      accessor: (row: typeof salesData[0]) => (
        <span className="font-medium text-primary">{row.invoiceNumber}</span>
      ),
      sortable: true,
    },
    {
      header: "Date",
      accessor: (row: typeof salesData[0]) => formatDate(row.date),
      sortable: true,
    },
    {
      header: "Customer",
      accessor: "customerName",
      sortable: true,
    },
    {
      header: "Items",
      accessor: "items",
    },
    {
      header: "Amount",
      accessor: (row: typeof salesData[0]) => (
        <span className="font-medium">{formatCurrency(row.totalAmount)}</span>
      ),
      sortable: true,
    },
    {
      header: "Status",
      accessor: (row: typeof salesData[0]) => (
        <StatusBadge type="status" value={row.paymentStatus} />
      ),
    },
  ];
  
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
  
  // Mutation for creating a new sale with direct form data approach
  const createSaleMutation = useMutation({
    mutationFn: async (data: any) => {
      // Log the exact data being sent to the backend
      console.log("Sending sale data to backend:", data);
      
      // Create a direct fetch to the backend without using the apiRequest helper
      const response = await fetch(`${API_BASE_URL}/sales/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(data)
      });
      
      // Check if the response is successful
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error creating sale:", errorText);
        throw new Error(`Failed to create sale: ${errorText}`);
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Invalidate the sales query to refetch the data
      queryClient.invalidateQueries({ queryKey: ['/sales'] });
      
      toast({
        title: "Success",
        description: "Sale created successfully",
        variant: "default",
      });
      
      // Add a visual feedback before closing
      setTimeout(() => {
        setOpenDialog(false);
      }, 500);
      
      // Add to local data temporarily for immediate feedback
      const newSale = {
        id: salesData.length + 1,
        invoiceNumber: form.getValues("invoiceNumber"),
        date: new Date(form.getValues("date")),
        customerName: form.getValues("customerName"),
        totalAmount: parseFloat(form.getValues("totalAmount") || "0"),
        paymentStatus: form.getValues("paymentStatus"),
        items: "Jewelry Item",
      };
      
      setSalesData([newSale, ...salesData]);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create sale",
        variant: "destructive",
      });
    }
  });
  
  // Submit form data
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    try {
      console.log("Form values submitted:", values);
      
      // Format the sale data exactly as the backend expects it
      // This matches the SalesBase model in your backend
      const todayDate = values.date || new Date().toISOString().split("T")[0];
      
      // Format the date string properly as YYYY-MM-DD
      const dateObj = new Date(todayDate);
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
      
      console.log("Formatted sale data for backend:", saleData);
      
      // Submit to backend API with direct fetch to ensure proper data format
      // Instead of using the mutation, let's make a direct fetch request
      console.log("About to send this data to the server:", JSON.stringify(saleData));
      
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
        console.error('Failed to save sale:', errorText);
        throw new Error(`Failed to save sale: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log("Sale successfully created:", result);
      
      // Show success message immediately for better user feedback
      toast({
        title: "Success",
        description: "Sale created successfully",
        variant: "default",
      });
      
      // Reset the form with new defaults
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
      
      // Add the new sale to the list immediately
      const newSale = {
        id: salesData.length + 1,
        invoiceNumber: values.invoiceNumber,
        date: new Date(todayDate),
        customerName: values.customerName,
        totalAmount: parseFloat(values.totalAmount) || 0,
        paymentStatus: values.paymentStatus,
        items: "Jewelry Item",
      };
      
      setSalesData([newSale, ...salesData]);
      
    } catch (error) {
      console.error("Failed to create sale:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create sale",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  
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
                <h3 className="text-2xl font-semibold mt-1">{formatCurrency(718500)}</h3>
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
                <h3 className="text-2xl font-semibold mt-1">{formatCurrency(45000)}</h3>
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
                <h3 className="text-2xl font-semibold mt-1">6</h3>
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
                      <Input {...field} />
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
                        <Input {...field} />
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
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="submit">Save Sale</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
