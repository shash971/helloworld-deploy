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
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  insertLooseStockSchema, 
  insertCertifiedStockSchema, 
  insertJewelleryStockSchema 
} from "@shared/schema";

type StockFormProps = {
  type: "loose" | "certified" | "jewellery";
  defaultValues?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
};

// Custom schema extensions
// More flexible schema that accepts both string and number inputs
const looseStockFormSchema = insertLooseStockSchema.extend({
  // For carat weight: accept string or number and validate
  carat: z.preprocess(
    (val) => (typeof val === 'string' && val !== '') ? parseFloat(val) : val,
    z.number().positive("Carat must be a positive number").or(z.string().min(1, "Carat weight is required"))
  ),
  
  // For quantity: accept string or number and validate
  quantity: z.preprocess(
    (val) => (typeof val === 'string' && val !== '') ? parseInt(val, 10) : val,
    z.number().int().positive("Quantity must be a positive integer").or(z.string().min(1, "Quantity is required"))
  ),
  
  // For cost price: accept string or number and validate
  costPrice: z.preprocess(
    (val) => (typeof val === 'string' && val !== '') ? parseFloat(val) : val,
    z.number().positive("Cost price must be a positive number").or(z.string().min(1, "Cost price is required"))
  ),
  
  // For selling price: accept string or number and validate
  sellingPrice: z.preprocess(
    (val) => (typeof val === 'string' && val !== '') ? parseFloat(val) : val,
    z.number().positive("Selling price must be a positive number").or(z.string().min(1, "Selling price is required"))
  ),
});

// More flexible schema for certified stock that accepts both string and number inputs
const certifiedStockFormSchema = insertCertifiedStockSchema.extend({
  // For carat weight: accept string or number and validate
  carat: z.preprocess(
    (val) => (typeof val === 'string' && val !== '') ? parseFloat(val) : val,
    z.number().positive("Carat must be a positive number").or(z.string().min(1, "Carat weight is required"))
  ),
  
  // For cost price: accept string or number and validate
  costPrice: z.preprocess(
    (val) => (typeof val === 'string' && val !== '') ? parseFloat(val) : val,
    z.number().positive("Cost price must be a positive number").or(z.string().min(1, "Cost price is required"))
  ),
  
  // For selling price: accept string or number and validate
  sellingPrice: z.preprocess(
    (val) => (typeof val === 'string' && val !== '') ? parseFloat(val) : val,
    z.number().positive("Selling price must be a positive number").or(z.string().min(1, "Selling price is required"))
  ),
});

// More flexible schema for jewellery stock that handles both string and number inputs
const jewelleryStockFormSchema = insertJewelleryStockSchema.extend({
  // For metal weight: accept string or number and validate
  metalWeight: z.preprocess(
    (val) => (typeof val === 'string' && val !== '') ? parseFloat(val) : val,
    z.number().positive("Metal weight must be a positive number").or(z.string().min(1, "Metal weight is required"))
  ),
  
  // For gross weight: accept string or number and validate
  grossWeight: z.preprocess(
    (val) => (typeof val === 'string' && val !== '') ? parseFloat(val) : val,
    z.number().positive("Gross weight must be a positive number").or(z.string().min(1, "Gross weight is required"))
  ),
  
  // For cost price: accept string or number and validate
  costPrice: z.preprocess(
    (val) => (typeof val === 'string' && val !== '') ? parseFloat(val) : val,
    z.number().positive("Cost price must be a positive number").or(z.string().min(1, "Cost price is required"))
  ),
  
  // For selling price: accept string or number and validate
  sellingPrice: z.preprocess(
    (val) => (typeof val === 'string' && val !== '') ? parseFloat(val) : val,
    z.number().positive("Selling price must be a positive number").or(z.string().min(1, "Selling price is required"))
  ),
  
  stoneDetails: z.string().optional(),
});

export function StockForm({ type, defaultValues, onSubmit, onCancel }: StockFormProps) {
  // Get the appropriate schema based on the stock type
  const getSchema = () => {
    switch (type) {
      case "loose":
        return looseStockFormSchema;
      case "certified":
        return certifiedStockFormSchema;
      case "jewellery":
        return jewelleryStockFormSchema;
      default:
        return looseStockFormSchema;
    }
  };

  // Setup form with appropriate schema
  const form = useForm({
    resolver: zodResolver(getSchema()),
    defaultValues: defaultValues || getDefaultValues(),
  });

  // Get default values based on stock type
  function getDefaultValues() {
    const baseDefaults = {
      itemCode: generateItemCode(),
      location: "Main Store",
      updatedBy: 1, // Assuming the current user ID
      lastUpdated: new Date().toISOString(),
    };

    switch (type) {
      case "loose":
        return {
          ...baseDefaults,
          stoneType: "",
          shape: "",
          carat: "",
          color: "",
          clarity: "",
          cut: "",
          quantity: "1",
          costPrice: "",
          sellingPrice: "",
          notes: "",
        };
      case "certified":
        return {
          ...baseDefaults,
          stoneType: "",
          certificateNumber: "",
          laboratory: "",
          shape: "",
          carat: "",
          color: "",
          clarity: "",
          cut: "",
          costPrice: "",
          sellingPrice: "",
          notes: "",
        };
      case "jewellery":
        return {
          ...baseDefaults,
          name: "",
          category: "",
          metalType: "",
          metalWeight: "",
          stoneDetails: "",
          grossWeight: "",
          costPrice: "",
          sellingPrice: "",
          notes: "",
        };
      default:
        return baseDefaults;
    }
  }

  // Generate a random item code
  function generateItemCode() {
    const prefix = type === "loose" ? "LS-" : type === "certified" ? "CS-" : "JS-";
    return `${prefix}${Math.floor(10000 + Math.random() * 90000)}`;
  }

  // Process the form data before submitting
  const processFormValues = (values: any) => {
    // Process form values
    const processedValues = { ...values };
    
    // Convert string numeric values to numbers for loose stock
    if (type === "loose" || type === "certified") {
      processedValues.carat = typeof values.carat === 'string' ? parseFloat(values.carat) : values.carat;
      processedValues.costPrice = typeof values.costPrice === 'string' ? parseFloat(values.costPrice) : values.costPrice;
      processedValues.sellingPrice = typeof values.sellingPrice === 'string' ? parseFloat(values.sellingPrice) : values.sellingPrice;
    }
    
    if (type === "loose") {
      processedValues.quantity = typeof values.quantity === 'string' ? parseInt(values.quantity, 10) : values.quantity;
    }
    
    if (type === "jewellery") {
      processedValues.metalWeight = Number(values.metalWeight);
      processedValues.grossWeight = Number(values.grossWeight);
      processedValues.costPrice = Number(values.costPrice);
      processedValues.sellingPrice = Number(values.sellingPrice);
      
      // Parse stoneDetails string to JSON if needed
      if (values.stoneDetails && typeof values.stoneDetails === 'string') {
        try {
          processedValues.stoneDetails = JSON.parse(values.stoneDetails);
        } catch (e) {
          // Leave as string if not valid JSON
        }
      }
    }
    
    return processedValues;
  };

  // Render the appropriate form fields based on stock type
  // Function to handle form submission
  const handleFormSubmission = (data: any) => {
    // Process the data 
    const processedData = processFormValues(data);
    // Send to parent component
    onSubmit(processedData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmission)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="itemCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Item Code</FormLabel>
                <FormControl>
                  <Input {...field} readOnly />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Loose Stock Fields */}
          {type === "loose" && (
            <>
              <FormField
                control={form.control}
                name="stoneType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stone Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select stone type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Diamond">Diamond</SelectItem>
                        <SelectItem value="Ruby">Ruby</SelectItem>
                        <SelectItem value="Emerald">Emerald</SelectItem>
                        <SelectItem value="Sapphire">Sapphire</SelectItem>
                        <SelectItem value="Pearl">Pearl</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shape"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shape</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select shape" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Round">Round</SelectItem>
                        <SelectItem value="Princess">Princess</SelectItem>
                        <SelectItem value="Cushion">Cushion</SelectItem>
                        <SelectItem value="Emerald">Emerald</SelectItem>
                        <SelectItem value="Oval">Oval</SelectItem>
                        <SelectItem value="Marquise">Marquise</SelectItem>
                        <SelectItem value="Pear">Pear</SelectItem>
                        <SelectItem value="Radiant">Radiant</SelectItem>
                        <SelectItem value="Asscher">Asscher</SelectItem>
                        <SelectItem value="Heart">Heart</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="carat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Carat Weight</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clarity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Clarity (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cut"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cut (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {/* Certified Stock Fields */}
          {type === "certified" && (
            <>
              <FormField
                control={form.control}
                name="stoneType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stone Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select stone type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Diamond">Diamond</SelectItem>
                        <SelectItem value="Ruby">Ruby</SelectItem>
                        <SelectItem value="Emerald">Emerald</SelectItem>
                        <SelectItem value="Sapphire">Sapphire</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="certificateNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Certificate Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="laboratory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Laboratory</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select laboratory" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="IGI">IGI</SelectItem>
                        <SelectItem value="GIA">GIA</SelectItem>
                        <SelectItem value="HRD">HRD</SelectItem>
                        <SelectItem value="AGS">AGS</SelectItem>
                        <SelectItem value="EGL">EGL</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shape"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shape</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select shape" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Round">Round</SelectItem>
                        <SelectItem value="Princess">Princess</SelectItem>
                        <SelectItem value="Cushion">Cushion</SelectItem>
                        <SelectItem value="Emerald">Emerald</SelectItem>
                        <SelectItem value="Oval">Oval</SelectItem>
                        <SelectItem value="Marquise">Marquise</SelectItem>
                        <SelectItem value="Pear">Pear</SelectItem>
                        <SelectItem value="Radiant">Radiant</SelectItem>
                        <SelectItem value="Asscher">Asscher</SelectItem>
                        <SelectItem value="Heart">Heart</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="carat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Carat Weight</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clarity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Clarity (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cut"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cut (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {/* Jewellery Stock Fields */}
          {type === "jewellery" && (
            <>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Ring">Ring</SelectItem>
                        <SelectItem value="Necklace">Necklace</SelectItem>
                        <SelectItem value="Bracelet">Bracelet</SelectItem>
                        <SelectItem value="Earrings">Earrings</SelectItem>
                        <SelectItem value="Pendant">Pendant</SelectItem>
                        <SelectItem value="Bangle">Bangle</SelectItem>
                        <SelectItem value="Watch">Watch</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="metalType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Metal Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select metal type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Gold 22K">Gold 22K</SelectItem>
                        <SelectItem value="Gold 18K">Gold 18K</SelectItem>
                        <SelectItem value="Gold 14K">Gold 14K</SelectItem>
                        <SelectItem value="Silver">Silver</SelectItem>
                        <SelectItem value="Platinum">Platinum</SelectItem>
                        <SelectItem value="White Gold">White Gold</SelectItem>
                        <SelectItem value="Rose Gold">Rose Gold</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="metalWeight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Metal Weight (g)</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="grossWeight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gross Weight (g)</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stoneDetails"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Stone Details (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        rows={3}
                        placeholder="Enter stone details in JSON format or plain text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <FormField
            control={form.control}
            name="costPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cost Price (₹)</FormLabel>
                <FormControl>
                  <Input {...field} type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sellingPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Selling Price (₹)</FormLabel>
                <FormControl>
                  <Input {...field} type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Main Store">Main Store</SelectItem>
                    <SelectItem value="Display Case">Display Case</SelectItem>
                    <SelectItem value="Safe">Safe</SelectItem>
                    <SelectItem value="Warehouse">Warehouse</SelectItem>
                    <SelectItem value="Workshop">Workshop</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
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
              <FormItem className="col-span-2">
                <FormLabel>Notes (Optional)</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={3} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            Save {type === "loose" ? "Loose Stock" : type === "certified" ? "Certified Stock" : "Jewellery"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
