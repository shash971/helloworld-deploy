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
import { insertMemoGiveSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

const formSchema = insertMemoGiveSchema.extend({
  date: z.string().min(1, "Date is required"),
  expectedReturnDate: z.string().optional(),
  customerName: z.string().min(1, "Customer name is required"),
  itemDetails: z.string().min(1, "Item details are required"),
});

// Sample data for demonstrations
const memoGiveData = [
  {
    id: 1,
    memoNumber: "MG-1001",
    date: new Date("2023-07-08"),
    customerName: "Priya Jewellers",
    itemType: "Jewellery",
    itemId: 3,
    itemDetails: "Diamond Tennis Bracelet, 24 diamonds, 3.2ct total",
    expectedReturnDate: new Date("2023-07-15"),
    status: "Pending",
    notes: "For wedding exhibition",
    createdBy: 1
  },
  {
    id: 2,
    memoNumber: "MG-1002",
    date: new Date("2023-07-05"),
    customerName: "Luxury Bijoux",
    itemType: "Certified",
    itemId: 2,
    itemDetails: "GIA Certified Diamond, Cushion 2.03ct, F VS2",
    expectedReturnDate: new Date("2023-07-12"),
    status: "Pending",
    notes: "Client considering for engagement ring",
    createdBy: 1
  },
  {
    id: 3,
    memoNumber: "MG-1003",
    date: new Date("2023-07-03"),
    customerName: "Royal Gems Ltd.",
    itemType: "Jewellery",
    itemId: 2,
    itemDetails: "Ruby and Diamond Necklace, 18K Gold",
    expectedReturnDate: new Date("2023-07-10"),
    status: "Returned",
    notes: "",
    createdBy: 1
  },
  {
    id: 4,
    memoNumber: "MG-1004",
    date: new Date("2023-06-30"),
    customerName: "Classic Jewellers",
    itemType: "Loose",
    itemId: 5,
    itemDetails: "Diamond, Cushion 1.15ct, E VVS2",
    expectedReturnDate: new Date("2023-07-07"),
    status: "Converted to Sale",
    notes: "Customer purchased the stone",
    createdBy: 1
  },
  {
    id: 5,
    memoNumber: "MG-1005",
    date: new Date("2023-06-28"),
    customerName: "Bridal Treasures",
    itemType: "Jewellery",
    itemId: 1,
    itemDetails: "Diamond Solitaire Ring, Platinum",
    expectedReturnDate: new Date("2023-07-05"),
    status: "Returned",
    notes: "Customer looking for different design",
    createdBy: 1
  }
];

export default function MemoGive() {
  const { toast } = useToast();
  const [openDialog, setOpenDialog] = useState(false);
  const [memoData, setMemoData] = useState(memoGiveData);
  
  // Columns for data table
  const columns = [
    {
      header: "Memo Number",
      accessor: (row: typeof memoData[0]) => (
        <span className="font-medium text-primary">{row.memoNumber}</span>
      ),
      sortable: true,
    },
    {
      header: "Date",
      accessor: (row: typeof memoData[0]) => formatDate(row.date),
      sortable: true,
    },
    {
      header: "Customer",
      accessor: "customerName",
      sortable: true,
    },
    {
      header: "Item Details",
      accessor: "itemDetails",
    },
    {
      header: "Return Date",
      accessor: (row: typeof memoData[0]) => row.expectedReturnDate ? formatDate(row.expectedReturnDate) : "-",
      sortable: true,
    },
    {
      header: "Status",
      accessor: (row: typeof memoData[0]) => (
        <StatusBadge type="status" value={row.status} />
      ),
    },
  ];
  
  // Filter by status
  const pendingItems = memoData.filter(item => item.status === "Pending");
  const totalPendingValue = 340000; // In a real app, this would be calculated from actual item values
  
  // Form setup
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      memoNumber: `MG-${1000 + memoData.length + 1}`,
      date: new Date().toISOString().split("T")[0],
      customerName: "",
      itemType: "",
      itemId: 0,
      itemDetails: "",
      expectedReturnDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 7 days from now
      status: "Pending",
      notes: "",
      createdBy: 1, // Assuming current user ID
    },
  });
  
  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real app, this would be an API call
    const newMemo = {
      id: memoData.length + 1,
      ...values,
      date: new Date(values.date),
      expectedReturnDate: values.expectedReturnDate ? new Date(values.expectedReturnDate) : undefined,
    };
    
    setMemoData([...memoData, newMemo]);
    setOpenDialog(false);
    
    toast({
      title: "Memo Created",
      description: `Memo ${values.memoNumber} has been created.`,
      variant: "default",
    });
  }
  
  // Update memo status
  const updateMemoStatus = (id: number, newStatus: string) => {
    // In a real app, this would be an API call
    setMemoData(memoData.map(memo => 
      memo.id === id ? { ...memo, status: newStatus } : memo
    ));
    
    toast({
      title: "Status Updated",
      description: `Memo status has been updated to ${newStatus}.`,
      variant: "default",
    });
  };
  
  return (
    <MainLayout title="Memo (Give)">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-800">Memo Management (Give)</h1>
          <p className="text-neutral-500">Track items given on memo to customers</p>
        </div>
        <Button onClick={() => setOpenDialog(true)}>
          <i className="fas fa-plus mr-2"></i> Create New Memo
        </Button>
      </div>
      
      {/* Memo Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-neutral-500">Total Outstanding Memos</p>
                <h3 className="text-2xl font-semibold mt-1">{pendingItems.length}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-info/10 flex items-center justify-center text-info">
                <i className="fas fa-paper-plane text-lg"></i>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-neutral-500">Value of Outstanding Items</p>
                <h3 className="text-2xl font-semibold mt-1">{formatCurrency(totalPendingValue)}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center text-warning">
                <i className="fas fa-coins text-lg"></i>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-neutral-500">Converted to Sales</p>
                <h3 className="text-2xl font-semibold mt-1">
                  {memoData.filter(memo => memo.status === "Converted to Sale").length}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center text-success">
                <i className="fas fa-check-circle text-lg"></i>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Memo Data Table */}
      <Card>
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={memoData}
            keyField="id"
            actionComponent={(row) => (
              <div className="flex space-x-2">
                {row.status === "Pending" && (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => updateMemoStatus(row.id, "Returned")}
                    >
                      <i className="fas fa-undo-alt mr-1"></i> Mark Returned
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => updateMemoStatus(row.id, "Converted to Sale")}
                    >
                      <i className="fas fa-shopping-cart mr-1"></i> Convert to Sale
                    </Button>
                  </>
                )}
                <Button variant="outline" size="sm">
                  <i className="fas fa-print mr-1"></i> Print
                </Button>
              </div>
            )}
          />
        </CardContent>
      </Card>
      
      {/* Create Memo Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Create New Memo</DialogTitle>
            <DialogDescription>
              Enter the details for the item being given on memo.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="memoNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Memo Number</FormLabel>
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
              
              <FormField
                control={form.control}
                name="itemType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select item type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Loose">Loose Stock</SelectItem>
                        <SelectItem value="Certified">Certified Stock</SelectItem>
                        <SelectItem value="Jewellery">Jewellery</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="itemDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Details</FormLabel>
                    <FormControl>
                      <Textarea rows={2} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="expectedReturnDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Return Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="submit">Create Memo</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
