import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL, getAuthHeader } from "@/lib/auth";

// Form schema definition
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

type FormValues = z.infer<typeof formSchema>;

interface SalesFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function SalesForm({ onSuccess, onCancel }: SalesFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  // Form setup
  const form = useForm<FormValues>({
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
  
  async function onSubmit(values: FormValues) {
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
      
      onSuccess();
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
  
  return (
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
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Sale"}
          </Button>
        </div>
      </form>
    </Form>
  );
}