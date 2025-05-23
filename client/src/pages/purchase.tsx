import React, { useState, useEffect, useMemo } from "react";
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
import { insertPurchaseSchema } from "@shared/schema";
import { API_BASE_URL, getAuthHeader, isAuthenticated } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

const formSchema = insertPurchaseSchema.extend({
  date: z.string().min(1, "Date is required"),
  totalAmount: z.string().min(1, "Amount is required").refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    { message: "Amount must be a positive number" }
  ),
  vendorName: z.string().min(1, "Vendor name is required"),
});

// Define interface for a purchase item
interface PurchaseItem {
  id: number;
  poNumber: string;
  date: Date;
  vendorName: string;
  totalAmount: number;
  paymentStatus: string;
  items: string;
}

export default function Purchase() {
  const [openDialog, setOpenDialog] = useState(false);
  const [importDialog, setImportDialog] = useState(false);
  const [importData, setImportData] = useState<any[]>([]);
  const [importStatus, setImportStatus] = useState<'idle' | 'preview' | 'importing'>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [purchasesData, setPurchasesData] = useState<PurchaseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  
  // Filter purchases data based on search term
  const filteredPurchasesData = useMemo(() => {
    if (!searchTerm.trim()) return purchasesData;
    
    return purchasesData.filter(purchase => {
      const searchLower = searchTerm.toLowerCase();
      return (
        (purchase.poNumber?.toLowerCase().includes(searchLower)) ||
        (purchase.vendorName?.toLowerCase().includes(searchLower)) ||
        (purchase.items?.toLowerCase().includes(searchLower)) ||
        (purchase.paymentStatus?.toLowerCase().includes(searchLower))
      );
    });
  }, [purchasesData, searchTerm]);
  
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
          const purchaseData = {
            date: row.date ? new Date(row.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            vendor: row.vendor || row.vendorName || row.Vendor || "",
            iteam: row.item || row.Item || row.iteam || "Diamond Jewelry",
            shape: row.shape || row.Shape || "Round",
            size: row.size || row.Size || "Medium",
            col: row.color || row.Color || row.col || "D",
            clr: row.clarity || row.Clarity || row.clr || "VS1",
            pcs: parseInt(row.pcs || row.Pieces || row.pieces || "1", 10),
            lab_no: row.poNumber || row.po_number || row.PoNumber || `PO-${Math.floor(3000 + Math.random() * 1000)}`,
            rate: parseFloat(row.rate || row.Rate || row.amount || row.Amount || "0"),
            total: parseFloat(row.total || row.Total || row.amount || row.Amount || "0"),
            term: row.term || row.Term || "Net 30",
            currency: row.currency || row.Currency || "INR",
            pay_mode: row.status || row.Status || row.pay_mode || "Pending",
            purchase_executive: row.executive || row.Executive || row.purchase_executive || "Admin",
            remark: row.notes || row.Notes || row.remark || ""
          };
          
          // Send to backend API
          const response = await fetch(`${API_BASE_URL}/purchase/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...getAuthHeader()
            },
            body: JSON.stringify(purchaseData)
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
      
      // Refresh the purchases data
      await fetchPurchases();
      
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
  
  // Fetch purchases data from backend
  const fetchPurchases = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/purchase/`, {
        headers: {
          ...getAuthHeader()
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching purchases: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Received purchase data:", data);
      
      // Transform the backend data to our frontend format
      if (Array.isArray(data) && data.length > 0) {
        const transformedData = data.map((purchase: any, index: number) => ({
          id: purchase.id || index + 1,
          poNumber: `PO-${3000 + (purchase.id || index)}`,
          date: new Date(purchase.date),
          vendorName: purchase.vendor || 'Vendor',
          totalAmount: parseFloat(purchase.total?.toString() || '0'),
          paymentStatus: purchase.pay_mode || 'Pending',
          items: purchase.iteam || 'Jewelry Item',
        }));
        
        setPurchasesData(transformedData);
      } else {
        setPurchasesData([]);
      }
    } catch (err) {
      console.error("Error fetching purchases:", err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'Error fetching purchase data',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load purchases data when component mounts
  useEffect(() => {
    if (isAuthenticated()) {
      fetchPurchases();
    }
  }, []);
  
  const columns = [
    {
      header: "PO Number",
      accessor: (row: PurchaseItem) => (
        <span className="font-medium text-primary">{row.poNumber}</span>
      ),
      sortable: true,
    },
    {
      header: "Date",
      accessor: (row: PurchaseItem) => formatDate(row.date),
      sortable: true,
    },
    {
      header: "Vendor",
      accessor: (row: PurchaseItem) => row.vendorName,
      sortable: true,
    },
    {
      header: "Items",
      accessor: (row: PurchaseItem) => row.items,
    },
    {
      header: "Amount",
      accessor: (row: PurchaseItem) => (
        <span className="font-medium">{formatCurrency(row.totalAmount)}</span>
      ),
      sortable: true,
    },
    {
      header: "Status",
      accessor: (row: PurchaseItem) => (
        <StatusBadge type="status" value={row.paymentStatus} />
      ),
    },
  ];
  
  // Form setup
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      poNumber: `PO-${Math.floor(3000 + Math.random() * 1000)}`,
      date: new Date().toISOString().split("T")[0],
      vendorName: "",
      totalAmount: "",
      paymentStatus: "Pending",
      notes: "",
    },
  });
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    try {
      // Format the date string properly as YYYY-MM-DD
      const dateObj = new Date(values.date);
      const formattedDate = dateObj.toISOString().split('T')[0];
      
      // Create purchase data object exactly matching the backend structure
      const purchaseData = {
        date: formattedDate,
        vendor: values.vendorName,
        iteam: "Diamond Jewelry", // Default jewelry item
        shape: "Round",  // Default value
        size: "Medium",  // Default value
        col: "D",        // Diamond color
        clr: "VS1",      // Diamond clarity
        pcs: 1,          // Default pieces
        lab_no: values.poNumber.replace("PO-", ""),
        rate: parseFloat(values.totalAmount) || 0,
        total: parseFloat(values.totalAmount) || 0,
        term: "Net 30",  // Default value
        currency: "INR", // Default value
        pay_mode: values.paymentStatus,
        purchase_executive: "Admin", // Default value
        remark: values.notes || ""
      };
      
      console.log("Sending purchase data to backend:", purchaseData);
      
      const response = await fetch(`${API_BASE_URL}/purchase/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(purchaseData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create purchase: ${errorText}`);
      }
      
      const result = await response.json();
      console.log("Purchase created successfully:", result);
      
      toast({
        title: "Success",
        description: "Purchase created successfully",
        variant: "default",
      });
      
      // Reset the form
      form.reset({
        poNumber: `PO-${Math.floor(3000 + Math.random() * 1000)}`,
        date: new Date().toISOString().split("T")[0],
        vendorName: "",
        totalAmount: "",
        paymentStatus: "Pending",
        notes: "",
      });
      
      // Close the dialog
      setOpenDialog(false);
      
      // Refresh purchases data
      fetchPurchases();
      
    } catch (error) {
      console.error("Purchase creation error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create purchase",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  
  return (
    <MainLayout title="Purchase">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-800">Purchase Management</h1>
          <p className="text-neutral-500">Manage all purchase transactions</p>
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
            <i className="fas fa-plus mr-2"></i> New Purchase
          </Button>
        </div>
      </div>
      
      {/* Purchase Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-neutral-500">Total Purchases (This Month)</p>
                <h3 className="text-2xl font-semibold mt-1">
                  {formatCurrency(
                    purchasesData.reduce((total, purchase) => total + purchase.totalAmount, 0)
                  )}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-info/10 flex items-center justify-center text-info">
                <i className="fas fa-shopping-bag text-lg"></i>
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
                    purchasesData
                      .filter(purchase => purchase.paymentStatus === 'Pending')
                      .reduce((total, purchase) => total + purchase.totalAmount, 0)
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
                <p className="text-sm text-neutral-500">Total Orders</p>
                <h3 className="text-2xl font-semibold mt-1">{purchasesData.length}</h3>
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
            placeholder="Search by vendor, item, PO number..."
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
      
      {/* Purchases Data Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <p>Loading purchase data...</p>
            </div>
          ) : purchasesData.length === 0 ? (
            <div className="flex justify-center items-center h-32">
              <p>No purchase records found. Start by creating a new purchase.</p>
            </div>
          ) : filteredPurchasesData.length === 0 ? (
            <div className="flex justify-center items-center h-32">
              <p>No purchase records match your search. Try a different search term.</p>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={filteredPurchasesData}
              keyField="id"
              actionComponent={(row) => (
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const purchaseDetails = `
                        PO Number: ${row.poNumber}
                        Date: ${formatDate(row.date)}
                        Vendor: ${row.vendorName}
                        Item: ${row.items}
                        Amount: ${formatCurrency(row.totalAmount)}
                        Status: ${row.paymentStatus}
                      `;
                      alert(purchaseDetails);
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
                              <title>Print Purchase Order - ${row.poNumber}</title>
                              <style>
                                body { font-family: Arial, sans-serif; margin: 30px; }
                                h1 { font-size: 22px; margin-bottom: 20px; }
                                table { width: 100%; border-collapse: collapse; }
                                th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
                                th { background-color: #f2f2f2; }
                                .footer { margin-top: 50px; font-size: 12px; text-align: center; }
                              </style>
                            </head>
                            <body>
                              <h1>Purchase Order: ${row.poNumber}</h1>
                              <table>
                                <tr><th>Date</th><td>${formatDate(row.date)}</td></tr>
                                <tr><th>Vendor</th><td>${row.vendorName}</td></tr>
                                <tr><th>Item</th><td>${row.items}</td></tr>
                                <tr><th>Amount</th><td>${formatCurrency(row.totalAmount)}</td></tr>
                                <tr><th>Status</th><td>${row.paymentStatus}</td></tr>
                              </table>
                              <div class="footer">
                                <p>This is a computer-generated document. No signature required.</p>
                              </div>
                              <script>
                                window.onload = function() { window.print(); }
                              </script>
                            </body>
                          </html>
                        `);
                        printWindow.document.close();
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
      
      {/* New Purchase Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Create New Purchase</DialogTitle>
            <DialogDescription>
              Enter the purchase details below to create a new purchase order.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="poNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PO Number</FormLabel>
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
                name="vendorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vendor Name</FormLabel>
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
                      <Textarea rows={3} {...field as any} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Purchase'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Import Dialog */}
      <Dialog open={importDialog} onOpenChange={setImportDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Import Purchases</DialogTitle>
            <DialogDescription>
              {importStatus === 'preview' ? 
                'Review the data below before importing' : 
                'Importing purchase records...'}
            </DialogDescription>
          </DialogHeader>
          
          {importStatus === 'preview' && importData.length > 0 && (
            <>
              <div className="border rounded-md overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr className="border-b">
                      <th className="p-2 text-left font-medium">Vendor</th>
                      <th className="p-2 text-left font-medium">Item</th>
                      <th className="p-2 text-left font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {importData.slice(0, 5).map((row, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2">
                          {row.vendor || row.Vendor || row.vendorName || 'N/A'}
                        </td>
                        <td className="p-2">
                          {row.item || row.Item || row.iteam || 'Diamond Jewelry'}
                        </td>
                        <td className="p-2">
                          {formatCurrency(
                            parseFloat(row.amount || row.Amount || row.total || row.Total || '0')
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {importData.length > 5 && (
                <p className="text-sm text-muted-foreground mt-2">
                  Showing 5 of {importData.length} records
                </p>
              )}
              
              <Alert className="mt-4">
                <i className="fas fa-info-circle mr-2"></i>
                <AlertTitle>Import Details</AlertTitle>
                <AlertDescription>
                  This will import {importData.length} purchase records. The system will try to map 
                  columns automatically. Make sure your Excel file contains columns for vendor, 
                  amount, and payment status.
                </AlertDescription>
              </Alert>
              
              <DialogFooter className="gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setImportDialog(false);
                    setImportData([]);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={processImport}
                  disabled={importStatus === 'importing'}
                >
                  {importStatus === 'importing' ? 'Importing...' : 'Confirm Import'}
                </Button>
              </DialogFooter>
            </>
          )}
          
          {importStatus === 'importing' && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-10 h-10 border-2 border-t-primary border-r-transparent border-l-transparent border-b-transparent rounded-full animate-spin mb-4"></div>
              <p>Processing import, please wait...</p>
            </div>
          )}
          
          {importStatus === 'preview' && importData.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8">
              <i className="fas fa-file-excel text-4xl mb-4 text-neutral-400"></i>
              <p>No data found in the selected file.</p>
              <Button 
                className="mt-4"
                variant="outline"
                onClick={() => setImportDialog(false)}
              >
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
