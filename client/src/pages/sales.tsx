import React, { useState, useEffect, useMemo } from "react";
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
import * as XLSX from 'xlsx';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
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
  const [importDialog, setImportDialog] = useState(false);
  const [importData, setImportData] = useState<any[]>([]);
  const [importStatus, setImportStatus] = useState<'idle' | 'preview' | 'importing'>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [salesData, setSalesData] = useState<SaleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Function to handle Excel/CSV file import
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setImportDialog(true);
    setImportStatus('preview');
    
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const binaryStr = evt.target?.result;
        const workbook = XLSX.read(binaryStr, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        console.log("Imported Excel data:", jsonData);
        setImportData(jsonData);
        
        toast({
          title: "Import Preview Ready",
          description: `Found ${jsonData.length} records in the file. Please confirm to import.`,
          variant: "default",
        });
      } catch (error) {
        toast({
          title: "Import Error",
          description: "Failed to parse the Excel file. Please check the format.",
          variant: "destructive",
        });
        console.error("Excel parsing error:", error);
      }
    };
    
    reader.onerror = () => {
      toast({
        title: "Import Error",
        description: "Failed to read the file. Please try again.",
        variant: "destructive",
      });
    };
    
    reader.readAsBinaryString(file);
    
    // Reset the input so the same file can be selected again
    e.target.value = '';
  };
  
  // Function to process the import data and save to backend
  const processImport = async () => {
    if (importData.length === 0) {
      toast({
        title: "Import Error",
        description: "No data to import",
        variant: "destructive",
      });
      return;
    }
    
    setImportStatus('importing');
    
    try {
      let successCount = 0;
      let errorCount = 0;
      
      // Process each row in the imported data
      for (const row of importData) {
        try {
          // Map Excel columns to our backend format
          // Here we're making assumptions about the Excel format
          // Adjust the field mappings to match your actual Excel structure
          const saleData = {
            date: row.date ? new Date(row.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            customer: row.customer || row.CustomerName || row.Customer || "",
            iteam: row.item || row.Item || row.iteam || "Diamond Jewelry",
            shape: row.shape || row.Shape || "Round",
            size: row.size || row.Size || "Medium",
            col: row.color || row.Color || row.col || "D",
            clr: row.clarity || row.Clarity || row.clr || "VS1",
            pcs: parseInt(row.pcs || row.Pieces || row.pieces || "1", 10),
            lab_no: row.invoice || row.Invoice || row.lab_no || `SL-${Math.floor(70000 + Math.random() * 9000)}`,
            rate: parseFloat(row.rate || row.Rate || row.amount || row.Amount || "0"),
            total: parseFloat(row.total || row.Total || row.amount || row.Amount || "0"),
            term: row.term || row.Term || "Net 30",
            currency: row.currency || row.Currency || "INR",
            pay_mode: row.status || row.Status || row.pay_mode || "Pending",
            sales_executive: row.executive || row.Executive || row.sales_executive || "Admin",
            remark: row.notes || row.Notes || row.remark || ""
          };
          
          // Send to backend API
          const response = await fetch(`${API_BASE_URL}/sales/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...getAuthHeader()
            },
            body: JSON.stringify(saleData)
          });
          
          if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
          }
          
          await response.json();
          successCount++;
        } catch (rowError) {
          console.error("Error importing row:", row, rowError);
          errorCount++;
        }
      }
      
      // Refresh the sales data
      await fetchSales();
      
      // Show result toast
      toast({
        title: "Import Complete",
        description: `Successfully imported ${successCount} records. ${errorCount > 0 ? `Failed to import ${errorCount} records.` : ''}`,
        variant: errorCount > 0 ? "default" : "default",
      });
      
      // Close the import dialog
      setImportDialog(false);
      setImportStatus('idle');
      setImportData([]);
      
    } catch (error) {
      console.error("Import process error:", error);
      toast({
        title: "Import Failed",
        description: "An error occurred during the import process.",
        variant: "destructive",
      });
      setImportStatus('preview');
    }
  };
  
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
        <div className="flex space-x-2">
          <label htmlFor="import-csv" className="cursor-pointer">
            <div className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
              <i className="fas fa-file-import mr-2"></i> Import
            </div>
            <input
              id="import-csv"
              type="file"
              accept=".csv,.xlsx,.xls"
              className="hidden"
              onChange={handleFileImport}
            />
          </label>
          <Button onClick={() => setOpenDialog(true)}>
            <i className="fas fa-plus mr-2"></i> New Sale
          </Button>
        </div>
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
      
      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search by customer, item, invoice..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
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
              data={filteredSalesData}
              keyField="id"
              actionComponent={(row) => (
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const salesDetails = `
                        Invoice: ${row.invoiceNumber}
                        Date: ${formatDate(row.date)}
                        Customer: ${row.customerName}
                        Item: ${row.items}
                        Amount: ${formatCurrency(row.totalAmount)}
                        Status: ${row.paymentStatus}
                      `;
                      alert(salesDetails);
                    }}
                  >
                    <i className="fas fa-eye mr-1"></i> View
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const printWindow = window.open('', '_blank');
                      if (printWindow) {
                        printWindow.document.write(`
                          <html>
                            <head>
                              <title>Print Sales Receipt - ${row.invoiceNumber}</title>
                              <style>
                                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
                                .header { text-align: center; margin-bottom: 20px; }
                                .invoice-info { display: flex; justify-content: space-between; }
                                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                                th { background-color: #f2f2f2; }
                                .footer { margin-top: 30px; text-align: center; }
                              </style>
                            </head>
                            <body>
                              <div class="header">
                                <h1>Sales Receipt</h1>
                              </div>
                              <div class="invoice-info">
                                <div>
                                  <p><strong>Invoice Number:</strong> ${row.invoiceNumber}</p>
                                  <p><strong>Date:</strong> ${formatDate(row.date)}</p>
                                </div>
                                <div>
                                  <p><strong>Customer:</strong> ${row.customerName}</p>
                                  <p><strong>Status:</strong> ${row.paymentStatus}</p>
                                </div>
                              </div>
                              <table>
                                <thead>
                                  <tr>
                                    <th>Item</th>
                                    <th>Description</th>
                                    <th>Amount</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>${row.items}</td>
                                    <td>Premium Jewelry Item</td>
                                    <td>${formatCurrency(row.totalAmount)}</td>
                                  </tr>
                                </tbody>
                                <tfoot>
                                  <tr>
                                    <td colspan="2" style="text-align: right;"><strong>Total:</strong></td>
                                    <td><strong>${formatCurrency(row.totalAmount)}</strong></td>
                                  </tr>
                                </tfoot>
                              </table>
                              <div class="footer">
                                <p>Thank you for your business!</p>
                              </div>
                            </body>
                          </html>
                        `);
                        printWindow.document.close();
                        printWindow.print();
                      }
                    }}
                  >
                    <i className="fas fa-print mr-1"></i> Print
                  </Button>
                </div>
              )}
            />
          )}
        </CardContent>
      </Card>
      
      {/* Import Dialog */}
      <Dialog open={importDialog} onOpenChange={setImportDialog}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Import Sales Data</DialogTitle>
            <DialogDescription>
              Review the data below before importing into the system.
            </DialogDescription>
          </DialogHeader>
          
          {importStatus === 'preview' && importData.length > 0 && (
            <div className="my-4">
              <Alert className="mb-4">
                <AlertTitle>Ready to Import {importData.length} Records</AlertTitle>
                <AlertDescription>
                  Please review the data below before confirming. The system will attempt to map columns automatically.
                </AlertDescription>
              </Alert>
              
              <div className="border rounded-md overflow-auto max-h-[300px] mb-4">
                <table className="w-full text-sm">
                  <thead className="bg-muted sticky top-0">
                    <tr>
                      {Object.keys(importData[0]).slice(0, 6).map(key => (
                        <th key={key} className="px-4 py-2 text-left font-medium">{key}</th>
                      ))}
                      {Object.keys(importData[0]).length > 6 && (
                        <th className="px-4 py-2 text-left font-medium">...</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {importData.slice(0, 5).map((row, index) => (
                      <tr key={index} className="border-t">
                        {Object.values(row).slice(0, 6).map((val, i) => (
                          <td key={i} className="px-4 py-2">{String(val)}</td>
                        ))}
                        {Object.values(row).length > 6 && (
                          <td className="px-4 py-2">...</td>
                        )}
                      </tr>
                    ))}
                    {importData.length > 5 && (
                      <tr className="border-t">
                        <td colSpan={7} className="px-4 py-2 text-center text-muted-foreground">
                          + {importData.length - 5} more records
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setImportDialog(false);
                  setImportData([]);
                  setImportStatus('idle');
                }}>
                  Cancel
                </Button>
                <Button onClick={processImport} disabled={importStatus === 'importing'}>
                  {importStatus === 'importing' ? 'Importing...' : 'Confirm Import'}
                </Button>
              </DialogFooter>
            </div>
          )}
          
          {importStatus === 'importing' && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-lg font-medium">Importing Sales Data...</p>
              <p className="text-sm text-muted-foreground">This may take a moment. Please don't close this window.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
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