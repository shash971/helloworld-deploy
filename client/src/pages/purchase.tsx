import React, { useState } from "react";
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

const formSchema = insertPurchaseSchema.extend({
  date: z.string().min(1, "Date is required"),
  totalAmount: z.string().min(1, "Amount is required").refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    { message: "Amount must be a positive number" }
  ),
  vendorName: z.string().min(1, "Vendor name is required"),
});

export default function Purchase() {
  const [openDialog, setOpenDialog] = useState(false);
  
  // Sample data
  const purchasesData = [
    {
      id: 1,
      poNumber: "PO-3452",
      date: new Date("2023-07-11"),
      vendorName: "Global Gems Ltd.",
      totalAmount: 82500,
      paymentStatus: "Completed",
      items: "Diamond Loose Stones (10 pcs)",
    },
    {
      id: 2,
      poNumber: "PO-3451",
      date: new Date("2023-07-08"),
      vendorName: "Ruby Traders",
      totalAmount: 125000,
      paymentStatus: "Completed",
      items: "Ruby Gemstones (5 pcs)",
    },
    {
      id: 3,
      poNumber: "PO-3450",
      date: new Date("2023-07-05"),
      vendorName: "Gold Suppliers Inc.",
      totalAmount: 320000,
      paymentStatus: "Pending",
      items: "Gold Sheets (500g)",
    },
    {
      id: 4,
      poNumber: "PO-3449",
      date: new Date("2023-07-02"),
      vendorName: "Precious Metals Ltd.",
      totalAmount: 175000,
      paymentStatus: "Completed",
      items: "Platinum (200g), Silver (1kg)",
    },
    {
      id: 5,
      poNumber: "PO-3448",
      date: new Date("2023-06-30"),
      vendorName: "Emerald Exporters",
      totalAmount: 93500,
      paymentStatus: "Completed",
      items: "Emerald Stones (8 pcs)",
    },
  ];
  
  const columns = [
    {
      header: "PO Number",
      accessor: (row: typeof purchasesData[0]) => (
        <span className="font-medium text-primary">{row.poNumber}</span>
      ),
      sortable: true,
    },
    {
      header: "Date",
      accessor: (row: typeof purchasesData[0]) => formatDate(row.date),
      sortable: true,
    },
    {
      header: "Vendor",
      accessor: "vendorName",
      sortable: true,
    },
    {
      header: "Items",
      accessor: "items",
    },
    {
      header: "Amount",
      accessor: (row: typeof purchasesData[0]) => (
        <span className="font-medium">{formatCurrency(row.totalAmount)}</span>
      ),
      sortable: true,
    },
    {
      header: "Status",
      accessor: (row: typeof purchasesData[0]) => (
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
  
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    setOpenDialog(false);
    // Here you would typically call your API to create a new purchase
  }
  
  return (
    <MainLayout title="Purchase">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-800">Purchase Management</h1>
          <p className="text-neutral-500">Manage all purchase transactions</p>
        </div>
        <Button onClick={() => setOpenDialog(true)}>
          <i className="fas fa-plus mr-2"></i> New Purchase
        </Button>
      </div>
      
      {/* Purchase Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-neutral-500">Total Purchases (This Month)</p>
                <h3 className="text-2xl font-semibold mt-1">{formatCurrency(796000)}</h3>
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
                <h3 className="text-2xl font-semibold mt-1">{formatCurrency(320000)}</h3>
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
                <h3 className="text-2xl font-semibold mt-1">5</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center text-success">
                <i className="fas fa-file-invoice text-lg"></i>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Purchases Data Table */}
      <Card>
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={purchasesData}
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
                      <Textarea rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="submit">Save Purchase</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
