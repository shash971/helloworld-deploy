import React, { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { formatDate } from "@/lib/utils";
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
import { insertIgiReceiveSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

const formSchema = insertIgiReceiveSchema.extend({
  date: z.string().min(1, "Date is required"),
  certificateNumber: z.string().min(1, "Certificate number is required"),
});

// Sample data from IGI Issue
const igiIssueData = [
  {
    id: 1,
    issueNumber: "IGI-452",
    date: new Date("2023-07-09"),
    itemType: "Loose",
    itemId: 5,
    itemDescription: "Diamond, Cushion 1.15ct, E VVS2",
    expectedCompletionDate: new Date("2023-07-16"),
    status: "Pending",
    notes: "Need rush certification",
    createdBy: 1,
  },
  {
    id: 2,
    issueNumber: "IGI-451",
    date: new Date("2023-07-06"),
    itemType: "Loose",
    itemId: 1,
    itemDescription: "Diamond, Round 1.02ct, F VS1",
    expectedCompletionDate: new Date("2023-07-13"),
    status: "Pending",
    notes: "",
    createdBy: 1,
  },
];

// Sample data for IGI Receive
const igiReceiveData = [
  {
    id: 1,
    receiveNumber: "IGIR-101",
    issueId: 3,
    issueNumber: "IGI-450",
    date: new Date("2023-07-11"),
    itemDescription: "Diamond Solitaire Ring, Platinum",
    certificateNumber: "IGI 123456789",
    status: "Received",
    notes: "Certificate stored in safe",
    updatedBy: 1,
  },
  {
    id: 2,
    receiveNumber: "IGIR-102",
    issueId: 4,
    issueNumber: "IGI-449",
    date: new Date("2023-07-08"),
    itemDescription: "Diamond, Princess 0.85ct, G SI1",
    certificateNumber: "IGI 987654321",
    status: "Received",
    notes: "",
    updatedBy: 1,
  },
];

export default function IgiReceive() {
  const { toast } = useToast();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<any>(null);
  const [receiveData, setReceiveData] = useState(igiReceiveData);
  
  // Columns for data table
  const columns = [
    {
      header: "Receive Number",
      accessor: (row: typeof receiveData[0]) => (
        <span className="font-medium text-primary">{row.receiveNumber}</span>
      ),
      sortable: true,
    },
    {
      header: "Issue Number",
      accessor: "issueNumber",
      sortable: true,
    },
    {
      header: "Date",
      accessor: (row: typeof receiveData[0]) => formatDate(row.date),
      sortable: true,
    },
    {
      header: "Item Description",
      accessor: "itemDescription",
    },
    {
      header: "Certificate Number",
      accessor: "certificateNumber",
      sortable: true,
    },
    {
      header: "Status",
      accessor: (row: typeof receiveData[0]) => (
        <StatusBadge type="status" value={row.status} />
      ),
    },
  ];
  
  // Form setup
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      receiveNumber: `IGIR-${100 + receiveData.length + 1}`,
      issueId: 0,
      date: new Date().toISOString().split("T")[0],
      certificateNumber: "",
      status: "Received",
      notes: "",
      updatedBy: 1, // Assuming current user ID
    },
  });
  
  // Open dialog with issue selection
  const handleOpenDialog = (issue: any) => {
    setSelectedIssue(issue);
    form.setValue("issueId", issue.id);
    setOpenDialog(true);
  };
  
  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!selectedIssue) return;
    
    // In a real app, this would be an API call
    const newReceive = {
      id: receiveData.length + 1,
      ...values,
      issueNumber: selectedIssue.issueNumber,
      itemDescription: selectedIssue.itemDescription,
      date: new Date(values.date),
    };
    
    setReceiveData([...receiveData, newReceive]);
    setOpenDialog(false);
    setSelectedIssue(null);
    
    toast({
      title: "IGI Certificate Received",
      description: `Certificate ${values.certificateNumber} has been recorded.`,
      variant: "default",
    });
  }
  
  return (
    <MainLayout title="IGI Receive">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-800">IGI Certification Receipt</h1>
          <p className="text-neutral-500">Manage received IGI certificates</p>
        </div>
      </div>
      
      {/* Pending Issues Card */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <h2 className="text-lg font-semibold mb-4">Pending Certifications</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Issue Number</th>
                  <th className="text-left py-3 px-4">Date Issued</th>
                  <th className="text-left py-3 px-4">Item Description</th>
                  <th className="text-left py-3 px-4">Expected Completion</th>
                  <th className="text-right py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {igiIssueData.length > 0 ? (
                  igiIssueData.map((issue) => (
                    <tr key={issue.id} className="border-b hover:bg-neutral-50">
                      <td className="py-3 px-4 font-medium text-primary">{issue.issueNumber}</td>
                      <td className="py-3 px-4">{formatDate(issue.date)}</td>
                      <td className="py-3 px-4">{issue.itemDescription}</td>
                      <td className="py-3 px-4">{formatDate(issue.expectedCompletionDate)}</td>
                      <td className="py-3 px-4 text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleOpenDialog(issue)}
                        >
                          <i className="fas fa-file-import mr-1"></i> Record Receipt
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-neutral-500">
                      No pending certifications found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* Receipt Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-neutral-500">Total Certificates Received</p>
                <h3 className="text-2xl font-semibold mt-1">{receiveData.length}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-info/10 flex items-center justify-center text-info">
                <i className="fas fa-file-import text-lg"></i>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-neutral-500">Certificates Received (This Month)</p>
                <h3 className="text-2xl font-semibold mt-1">
                  {receiveData.filter(item => 
                    item.date.getMonth() === new Date().getMonth() && 
                    item.date.getFullYear() === new Date().getFullYear()
                  ).length}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center text-success">
                <i className="fas fa-calendar-check text-lg"></i>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-neutral-500">Pending Certifications</p>
                <h3 className="text-2xl font-semibold mt-1">{igiIssueData.length}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center text-warning">
                <i className="fas fa-hourglass-half text-lg"></i>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Received Certificates Table */}
      <Card>
        <CardContent className="p-0">
          <div className="p-6 border-b border-neutral-200">
            <h2 className="font-semibold text-neutral-800">Received Certificates</h2>
          </div>
          <DataTable
            columns={columns}
            data={receiveData}
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
      
      {/* Record Receipt Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Record IGI Certificate Receipt</DialogTitle>
            <DialogDescription>
              Enter the details for the received IGI certificate.
            </DialogDescription>
          </DialogHeader>
          
          {selectedIssue && (
            <div className="bg-neutral-50 p-4 rounded-md mb-4">
              <h3 className="text-sm font-medium mb-2">Issue Details</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-neutral-500">Issue Number:</span> 
                  <span className="ml-1 font-medium">{selectedIssue.issueNumber}</span>
                </div>
                <div>
                  <span className="text-neutral-500">Date Issued:</span> 
                  <span className="ml-1">{formatDate(selectedIssue.date)}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-neutral-500">Item:</span> 
                  <span className="ml-1">{selectedIssue.itemDescription}</span>
                </div>
              </div>
            </div>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="receiveNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Receive Number</FormLabel>
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
                      <FormLabel>Date Received</FormLabel>
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
                name="certificateNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Certificate Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. IGI 123456789" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
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
                        <SelectItem value="Received">Received</SelectItem>
                        <SelectItem value="Processing">Processing</SelectItem>
                      </SelectContent>
                    </Select>
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
                <Button type="submit">Record Receipt</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
