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
import { insertExpenseSchema } from "@shared/schema";

const formSchema = insertExpenseSchema.extend({
  date: z.string().min(1, "Date is required"),
  amount: z.string().min(1, "Amount is required").refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    { message: "Amount must be a positive number" }
  ),
});

export default function Expenses() {
  const [openDialog, setOpenDialog] = useState(false);
  
  // Sample data
  const expensesData = [
    {
      id: 1,
      expenseId: "EX-0089",
      date: new Date("2023-07-10"),
      category: "Utility Bills",
      amount: 18450,
      description: "Electricity and water bills for the month of July",
      createdBy: "Admin User",
    },
    {
      id: 2,
      expenseId: "EX-0088",
      date: new Date("2023-07-08"),
      category: "Rent",
      amount: 85000,
      description: "Shop rent for July",
      createdBy: "Admin User",
    },
    {
      id: 3,
      expenseId: "EX-0087",
      date: new Date("2023-07-05"),
      category: "Salaries",
      amount: 120000,
      description: "Staff salaries for June",
      createdBy: "Admin User",
    },
    {
      id: 4,
      expenseId: "EX-0086",
      date: new Date("2023-07-03"),
      category: "Equipment",
      amount: 35000,
      description: "New display cases for store",
      createdBy: "Admin User",
    },
    {
      id: 5,
      expenseId: "EX-0085",
      date: new Date("2023-07-01"),
      category: "Marketing",
      amount: 25000,
      description: "Advertisement in local magazine",
      createdBy: "Admin User",
    },
  ];
  
  const columns = [
    {
      header: "Expense ID",
      accessor: (row: typeof expensesData[0]) => (
        <span className="font-medium text-primary">{row.expenseId}</span>
      ),
      sortable: true,
    },
    {
      header: "Date",
      accessor: (row: typeof expensesData[0]) => formatDate(row.date),
      sortable: true,
    },
    {
      header: "Category",
      accessor: "category",
      sortable: true,
    },
    {
      header: "Description",
      accessor: "description",
    },
    {
      header: "Amount",
      accessor: (row: typeof expensesData[0]) => (
        <span className="font-medium">{formatCurrency(row.amount)}</span>
      ),
      sortable: true,
    },
    {
      header: "Created By",
      accessor: "createdBy",
    },
  ];
  
  // Form setup
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      category: "",
      amount: "",
      description: "",
    },
  });
  
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    setOpenDialog(false);
    // Here you would typically call your API to create a new expense
  }
  
  // Expense categories
  const expenseCategories = [
    "Rent",
    "Salaries",
    "Utility Bills",
    "Equipment",
    "Marketing",
    "Travel",
    "Office Supplies",
    "Maintenance",
    "Insurance",
    "Professional Fees",
    "Other",
  ];
  
  // Calculate total expenses
  const totalExpenses = expensesData.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Get expense by category for chart
  const expensesByCategory = expensesData.reduce((acc: Record<string, number>, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});
  
  return (
    <MainLayout title="Expenses">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-800">Expense Management</h1>
          <p className="text-neutral-500">Track and manage all business expenses</p>
        </div>
        <Button onClick={() => setOpenDialog(true)}>
          <i className="fas fa-plus mr-2"></i> Add Expense
        </Button>
      </div>
      
      {/* Expense Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-neutral-500">Total Expenses (This Month)</p>
                <h3 className="text-2xl font-semibold mt-1">{formatCurrency(totalExpenses)}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center text-error">
                <i className="fas fa-file-invoice-dollar text-lg"></i>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-neutral-500">Highest Expense</p>
                <h3 className="text-2xl font-semibold mt-1">Salaries</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center text-warning">
                <i className="fas fa-chart-line text-lg"></i>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-neutral-500">Total Transactions</p>
                <h3 className="text-2xl font-semibold mt-1">{expensesData.length}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <i className="fas fa-receipt text-lg"></i>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Expenses Data Table */}
      <Card>
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={expensesData}
            keyField="id"
            actionComponent={(row) => (
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <i className="fas fa-eye mr-1"></i> View
                </Button>
                <Button variant="outline" size="sm" className="text-error">
                  <i className="fas fa-trash-alt mr-1"></i> Delete
                </Button>
              </div>
            )}
          />
        </CardContent>
      </Card>
      
      {/* New Expense Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
            <DialogDescription>
              Enter the expense details below to record a new expense.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {expenseCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount (₹)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="submit">Save Expense</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
