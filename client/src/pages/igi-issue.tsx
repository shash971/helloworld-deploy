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
import { insertIgiIssueSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

const formSchema = insertIgiIssueSchema.extend({
  date: z.string().min(1, "Date is required"),
  expectedCompletionDate: z.string().optional(),
  itemDescription: z.string().min(1, "Item description is required"),
});

// Sample data for demonstration
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
  {
    id: 3,
    issueNumber: "IGI-450",
    date: new Date("2023-07-04"),
    itemType: "Jewellery",
    itemId: 1,
    itemDescription: "Diamond Solitaire Ring, Platinum",
    expectedCompletionDate: new Date("2023-07-11"),
    status: "Completed",
    notes: "Certificate received on July 11",
    createdBy: 1,
  },
  {
    id: 4,
    issueNumber: "IGI-449",
    date: new Date("2023-07-01"),
    itemType: "Loose",
    itemId: 2,
    itemDescription: "Diamond, Princess 0.85ct, G SI1",
    expectedCompletionDate: new Date("2023-07-08"),
    status: "Completed",
    notes: "",
    createdBy: 1,
  },
  {
    id: 5,
    issueNumber: "IGI-448",
    date: new Date("2023-06-28"),
    itemType: "Loose",
    itemId: 3,
    itemDescription: "Ruby, Oval 1.75ct",
    expectedCompletionDate: new Date("2023-07-05"),
    status: "Cancelled",
    notes: "Client decided not to certify",
    createdBy: 1,
  },
];

export default function IgiIssue() {
  const { toast } = useToast();
  const [openDialog, setOpenDialog] = useState(false);
  const [issueData, setIssueData] = useState(igiIssueData);
  
  // Columns for data table
  const columns = [
    {
      header: "Issue Number",
      accessor: (row: typeof issueData[0]) => (
        <span className="font-medium text-primary">{row.issueNumber}</span>
      ),
      sortable: true,
    },
    {
      header: "Date",
      accessor: (row: typeof issueData[0]) => formatDate(row.date),
      sortable: true,
    },
    {
      header: "Item Description",
      accessor: "itemDescription",
    },
    {
      header: "Expected Completion",
      accessor: (row: typeof issueData[0]) => row.expectedCompletionDate ? formatDate(row.expectedCompletionDate) : "-",
      sortable: true,
    },
    {
      header: "Status",
      accessor: (row: typeof issueData[0]) => (
        <StatusBadge type="status" value={row.status} />
      ),
    },
  ];
  
  // Filter by status
  const pendingItems = issueData.filter(item => item.status === "Pending");
  
  // Form setup
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      issueNumber: `IGI-${452 + issueData.length - 4}`,
      date: new Date().toISOString().split("T")[0],
      itemType: "",
      itemId: 0,
      itemDescription: "",
      expectedCompletionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 7 days from now
      status: "Pending",
      notes: "",
      createdBy: 1, // Assuming current user ID
    },
  });
  
  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real app, this would be an API call
    const newIssue = {
      id: issueData.length + 1,
      ...values,
      date: new Date(values.date),
      expectedCompletionDate: values.expectedCompletionDate ? new Date(values.expectedCompletionDate) : undefined,
    };
    
    setIssueData([...issueData, newIssue]);
    setOpenDialog(false);
    
    toast({
      title: "IGI Issue Created",
      description: `Issue ${values.issueNumber} has been created.`,
      variant: "default",
    });
  }
  
  // Update issue status
  const updateIssueStatus = (id: number, newStatus: string) => {
    // In a real app, this would be an API call
    setIssueData(issueData.map(issue => 
      issue.id === id ? { ...issue, status: newStatus } : issue
    ));
    
    toast({
      title: "Status Updated",
      description: `Issue status has been updated to ${newStatus}.`,
      variant: "default",
    });
  };
  
  return (
    <MainLayout title="IGI Issue">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-800">IGI Certification Issue</h1>
          <p className="text-neutral-500">Manage items sent for IGI certification</p>
        </div>
        <Button onClick={() => setOpenDialog(true)}>
          <i className="fas fa-plus mr-2"></i> Create New Issue
        </Button>
      </div>
      
      {/* Issue Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-neutral-500">Pending Certifications</p>
                <h3 className="text-2xl font-semibold mt-1">{pendingItems.length}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center text-warning">
                <i className="fas fa-file-export text-lg"></i>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-neutral-500">Completed Certifications</p>
                <h3 className="text-2xl font-semibold mt-1">
                  {issueData.filter(item => item.status === "Completed").length}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center text-success">
                <i className="fas fa-check-circle text-lg"></i>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-neutral-500">Next Expected Completion</p>
                <h3 className="text-2xl font-semibold mt-1">
                  {pendingItems.length > 0 ? formatDate(pendingItems.sort((a, b) => 
                    a.expectedCompletionDate.getTime() - b.expectedCompletionDate.getTime()
                  )[0].expectedCompletionDate) : "-"}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-info/10 flex items-center justify-center text-info">
                <i className="fas fa-calendar-day text-lg"></i>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Issue Data Table */}
      <Card>
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={issueData}
            keyField="id"
            actionComponent={(row) => (
              <div className="flex space-x-2">
                {row.status === "Pending" && (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => updateIssueStatus(row.id, "Completed")}
                    >
                      <i className="fas fa-check mr-1"></i> Mark Completed
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => updateIssueStatus(row.id, "Cancelled")}
                    >
                      <i className="fas fa-times mr-1"></i> Cancel
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
      
      {/* Create Issue Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Create New IGI Issue</DialogTitle>
            <DialogDescription>
              Enter the details for the item being sent for IGI certification.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="issueNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issue Number</FormLabel>
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
                        <SelectItem value="Jewellery">Jewellery</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="itemDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Description</FormLabel>
                    <FormControl>
                      <Textarea rows={2} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="expectedCompletionDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Completion Date</FormLabel>
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
                <Button type="submit">Create Issue</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
