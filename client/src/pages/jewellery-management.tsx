import React, { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { StockImage } from "@/components/ui/stock-image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

// Sample data from jewelry stock
const jewelleryStockData = [
  {
    id: 1,
    itemCode: "JS-30001",
    name: "Diamond Solitaire Ring",
    category: "Ring",
    metalType: "Platinum",
    metalWeight: 5.8,
    stoneDetails: { 
      mainStone: "Diamond", 
      mainStoneWeight: 1.25, 
      mainStoneColor: "F", 
      mainStoneClarity: "VS1", 
      otherStones: [] 
    },
    grossWeight: 6.5,
    costPrice: 180000,
    sellingPrice: 250000,
    location: "Display Case",
    status: "Available",
    tags: ["Bridal", "Luxury", "Diamond"],
    creationDate: new Date("2023-06-15"),
    lastModified: new Date("2023-07-15"),
    notes: "Classic design",
    updatedBy: 1,
  },
  {
    id: 2,
    itemCode: "JS-30002",
    name: "Ruby and Diamond Necklace",
    category: "Necklace",
    metalType: "Gold 18K",
    metalWeight: 12.3,
    stoneDetails: { 
      mainStone: "Ruby", 
      mainStoneWeight: 2.5, 
      sideStones: "Diamond", 
      sideStoneWeight: 1.8, 
      sideStoneCount: 12 
    },
    grossWeight: 15.2,
    costPrice: 310000,
    sellingPrice: 425000,
    location: "Safe",
    status: "Available",
    tags: ["Statement", "Luxury", "Ruby"],
    creationDate: new Date("2023-06-20"),
    lastModified: new Date("2023-07-14"),
    notes: "Handcrafted, exclusive design",
    updatedBy: 1,
  },
  {
    id: 3,
    itemCode: "JS-30003",
    name: "Diamond Tennis Bracelet",
    category: "Bracelet",
    metalType: "White Gold",
    metalWeight: 8.5,
    stoneDetails: { 
      mainStone: "Diamond", 
      stoneWeight: 3.2, 
      stoneCount: 24, 
      stoneColor: "G", 
      stoneClarity: "VS2" 
    },
    grossWeight: 12.8,
    costPrice: 250000,
    sellingPrice: 350000,
    location: "Safe",
    status: "Memo",
    tags: ["Classic", "Diamond", "Gift"],
    creationDate: new Date("2023-05-10"),
    lastModified: new Date("2023-07-12"),
    notes: "",
    updatedBy: 1,
  },
  {
    id: 4,
    itemCode: "JS-30004",
    name: "Emerald Drop Earrings",
    category: "Earrings",
    metalType: "Gold 22K",
    metalWeight: 4.2,
    stoneDetails: { 
      mainStone: "Emerald", 
      mainStoneWeight: 1.5, 
      sideStones: "Diamond", 
      sideStoneWeight: 0.5 
    },
    grossWeight: 6.1,
    costPrice: 180000,
    sellingPrice: 240000,
    location: "Display Case",
    status: "Available",
    tags: ["Green", "Colored Gemstone", "Elegant"],
    creationDate: new Date("2023-06-05"),
    lastModified: new Date("2023-07-10"),
    notes: "Colombian emeralds",
    updatedBy: 1,
  },
  {
    id: 5,
    itemCode: "JS-30005",
    name: "Diamond Pendant",
    category: "Pendant",
    metalType: "Rose Gold",
    metalWeight: 3.2,
    stoneDetails: { 
      mainStone: "Diamond", 
      mainStoneWeight: 0.75, 
      mainStoneColor: "E", 
      mainStoneClarity: "VVS2" 
    },
    grossWeight: 3.8,
    costPrice: 95000,
    sellingPrice: 135000,
    location: "Display Case",
    status: "Sold",
    tags: ["Gift", "Diamond", "Dainty"],
    creationDate: new Date("2023-05-25"),
    lastModified: new Date("2023-07-08"),
    notes: "",
    updatedBy: 1,
  }
];

// Create operation schema
const jewelryFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  metalType: z.string().min(1, "Metal type is required"),
  metalWeight: z.string().min(1, "Metal weight is required").refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    { message: "Metal weight must be a positive number" }
  ),
  stoneDetailsText: z.string().optional(),
  grossWeight: z.string().min(1, "Gross weight is required").refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    { message: "Gross weight must be a positive number" }
  ),
  costPrice: z.string().min(1, "Cost price is required").refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    { message: "Cost price must be a positive number" }
  ),
  sellingPrice: z.string().min(1, "Selling price is required").refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    { message: "Selling price must be a positive number" }
  ),
  location: z.string().min(1, "Location is required"),
  status: z.string().min(1, "Status is required"),
  tags: z.string().optional(),
  notes: z.string().optional(),
});

export default function JewelleryManagement() {
  const { toast } = useToast();
  const [jewelleryData, setJewelleryData] = useState(jewelleryStockData);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | "view">("create");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [filterCategory, setFilterCategory] = useState<string>("All");
  
  // Calculate total value and statistics
  const totalValue = jewelleryData.reduce((sum, item) => 
    item.status !== "Sold" ? sum + item.sellingPrice : sum, 0
  );
  
  const categories = ["All", ...Array.from(new Set(jewelleryData.map(item => item.category)))];
  
  // Filter data based on selected category
  const filteredData = filterCategory === "All" 
    ? jewelleryData 
    : jewelleryData.filter(item => item.category === filterCategory);
  
  // Status badge color mapping
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available": return "success";
      case "Memo": return "warning";
      case "Sold": return "error";
      case "Reserved": return "info";
      default: return "default";
    }
  };
  
  // Columns for data table
  const columns = [
    {
      header: "Item Code",
      accessor: (row: typeof jewelleryData[0]) => (
        <span className="font-medium text-primary">{row.itemCode}</span>
      ),
      sortable: true,
    },
    {
      header: "Name",
      accessor: (row: typeof jewelleryData[0]) => (
        <div>
          <div className="font-medium">{row.name}</div>
          <div className="text-xs text-neutral-500">{row.category}</div>
        </div>
      ),
      sortable: true,
    },
    {
      header: "Metal",
      accessor: (row: typeof jewelleryData[0]) => (
        <div>
          <div>{row.metalType}</div>
          <div className="text-xs text-neutral-500">{row.metalWeight}g</div>
        </div>
      ),
    },
    {
      header: "Stones",
      accessor: (row: typeof jewelleryData[0]) => {
        const details = row.stoneDetails;
        return (
          <div>
            <div>{details.mainStone}</div>
            <div className="text-xs text-neutral-500">
              {details.mainStoneWeight || details.stoneWeight || ""}
              {details.mainStoneColor ? `, ${details.mainStoneColor}` : ""}
              {details.mainStoneClarity ? ` ${details.mainStoneClarity}` : ""}
              {details.stoneCount ? `, ${details.stoneCount} pcs` : ""}
            </div>
          </div>
        );
      },
    },
    {
      header: "Price",
      accessor: (row: typeof jewelleryData[0]) => (
        <span className="font-medium">{formatCurrency(row.sellingPrice)}</span>
      ),
      sortable: true,
    },
    {
      header: "Status",
      accessor: (row: typeof jewelleryData[0]) => (
        <Badge variant={getStatusColor(row.status) as any}>
          {row.status}
        </Badge>
      ),
    },
    {
      header: "Location",
      accessor: (row: typeof jewelleryData[0]) => row.location,
    },
  ];
  
  // Form setup
  const form = useForm<z.infer<typeof jewelryFormSchema>>({
    resolver: zodResolver(jewelryFormSchema),
    defaultValues: {
      name: "",
      category: "",
      metalType: "",
      metalWeight: "",
      stoneDetailsText: "",
      grossWeight: "",
      costPrice: "",
      sellingPrice: "",
      location: "Display Case",
      status: "Available",
      tags: "",
      notes: "",
    },
  });
  
  // View item details
  const handleViewItem = (item: any) => {
    setSelectedItem(item);
    setDialogMode("view");
    setOpenDialog(true);
  };
  
  // Edit item
  const handleEditItem = (item: any) => {
    setSelectedItem(item);
    setDialogMode("edit");
    
    // Set form values
    form.reset({
      name: item.name,
      category: item.category,
      metalType: item.metalType,
      metalWeight: item.metalWeight.toString(),
      stoneDetailsText: JSON.stringify(item.stoneDetails, null, 2),
      grossWeight: item.grossWeight.toString(),
      costPrice: item.costPrice.toString(),
      sellingPrice: item.sellingPrice.toString(),
      location: item.location,
      status: item.status,
      tags: item.tags.join(", "),
      notes: item.notes,
    });
    
    setOpenDialog(true);
  };
  
  // Create new item
  const handleCreateItem = () => {
    setSelectedItem(null);
    setDialogMode("create");
    form.reset({
      name: "",
      category: "",
      metalType: "",
      metalWeight: "",
      stoneDetailsText: "",
      grossWeight: "",
      costPrice: "",
      sellingPrice: "",
      location: "Display Case",
      status: "Available",
      tags: "",
      notes: "",
    });
    setOpenDialog(true);
  };
  
  // Handle form submission
  function onSubmit(values: z.infer<typeof jewelryFormSchema>) {
    // Process form values
    let stoneDetails;
    try {
      stoneDetails = values.stoneDetailsText ? JSON.parse(values.stoneDetailsText) : {};
    } catch (e) {
      stoneDetails = { description: values.stoneDetailsText };
    }
    
    const formattedItem = {
      name: values.name,
      category: values.category,
      metalType: values.metalType,
      metalWeight: Number(values.metalWeight),
      stoneDetails: stoneDetails,
      grossWeight: Number(values.grossWeight),
      costPrice: Number(values.costPrice),
      sellingPrice: Number(values.sellingPrice),
      location: values.location,
      status: values.status,
      tags: values.tags ? values.tags.split(",").map(tag => tag.trim()) : [],
      notes: values.notes || "",
      updatedBy: 1,
      lastModified: new Date(),
    };
    
    if (dialogMode === "create") {
      // Create new item
      const newItem = {
        id: jewelleryData.length + 1,
        itemCode: `JS-${30000 + jewelleryData.length + 1}`,
        creationDate: new Date(),
        ...formattedItem,
      };
      
      setJewelleryData([...jewelleryData, newItem]);
      toast({
        title: "Item Created",
        description: `${values.name} has been added to jewelry inventory.`,
        variant: "default",
      });
    } else if (dialogMode === "edit" && selectedItem) {
      // Update existing item
      setJewelleryData(jewelleryData.map(item => 
        item.id === selectedItem.id 
          ? { ...item, ...formattedItem } 
          : item
      ));
      
      toast({
        title: "Item Updated",
        description: `${values.name} has been updated.`,
        variant: "default",
      });
    }
    
    setOpenDialog(false);
  }
  
  // Handle delete item
  const handleDeleteItem = (item: any) => {
    if (confirm(`Are you sure you want to delete ${item.name}?`)) {
      setJewelleryData(jewelleryData.filter(i => i.id !== item.id));
      toast({
        title: "Item Deleted",
        description: `${item.name} has been deleted from the inventory.`,
        variant: "default",
      });
    }
  };
  
  return (
    <MainLayout title="Jewellery Management">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-800">Jewellery Management</h1>
          <p className="text-neutral-500">Create, update and manage jewellery items</p>
        </div>
        <Button onClick={handleCreateItem}>
          <i className="fas fa-plus mr-2"></i> Create New Item
        </Button>
      </div>
      
      {/* Featured Jewellery */}
      <div className="mb-6">
        <Card>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="md:col-span-1">
                <StockImage type="jewelry-counter" className="h-full rounded-l-lg md:rounded-r-none rounded-r-lg" />
              </div>
              <div className="md:col-span-2 p-6">
                <h3 className="text-lg font-semibold text-neutral-800">Jewellery Collection Management</h3>
                <p className="text-neutral-600 mt-2 mb-4">
                  Manage your complete jewellery inventory with detailed specifications, pricing, 
                  stone information, and status tracking. Create new pieces, update existing ones, 
                  and keep track of all your jewellery items in one place.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="border border-neutral-200 rounded-md p-3">
                    <p className="text-xs text-neutral-500">Total Items</p>
                    <p className="font-medium">{jewelleryData.length} pieces</p>
                  </div>
                  <div className="border border-neutral-200 rounded-md p-3">
                    <p className="text-xs text-neutral-500">Inventory Value</p>
                    <p className="font-medium">{formatCurrency(totalValue)}</p>
                  </div>
                  <div className="border border-neutral-200 rounded-md p-3">
                    <p className="text-xs text-neutral-500">Available Items</p>
                    <p className="font-medium">{jewelleryData.filter(i => i.status === "Available").length} pieces</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Filter Categories */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(category => (
          <Button 
            key={category} 
            variant={filterCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>
      
      {/* Jewellery Items Table */}
      <Card>
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={filteredData}
            keyField="id"
            actionComponent={(row) => (
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleViewItem(row)}>
                  View
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleEditItem(row)}>
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteItem(row)}>
                  Delete
                </Button>
              </div>
            )}
          />
        </CardContent>
      </Card>
      
      {/* View/Edit/Create Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "view" ? "Jewellery Details" : 
               dialogMode === "edit" ? "Edit Jewellery Item" : 
               "Create New Jewellery Item"}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === "view" ? "View detailed information about this jewellery item" : 
               dialogMode === "edit" ? "Update the details of this jewellery item" : 
               "Fill in the details to create a new jewellery item"}
            </DialogDescription>
          </DialogHeader>
          
          {dialogMode === "view" && selectedItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-neutral-500 mb-1">Item Information</h3>
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-sm text-neutral-600">Item Code:</span>
                      <span className="text-sm font-medium col-span-2">{selectedItem.itemCode}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-sm text-neutral-600">Name:</span>
                      <span className="text-sm font-medium col-span-2">{selectedItem.name}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-sm text-neutral-600">Category:</span>
                      <span className="text-sm font-medium col-span-2">{selectedItem.category}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-sm text-neutral-600">Status:</span>
                      <span className="col-span-2">
                        <Badge variant={getStatusColor(selectedItem.status) as any}>
                          {selectedItem.status}
                        </Badge>
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-sm text-neutral-600">Location:</span>
                      <span className="text-sm font-medium col-span-2">{selectedItem.location}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-neutral-500 mb-1">Specifications</h3>
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-sm text-neutral-600">Metal Type:</span>
                      <span className="text-sm font-medium col-span-2">{selectedItem.metalType}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-sm text-neutral-600">Metal Weight:</span>
                      <span className="text-sm font-medium col-span-2">{selectedItem.metalWeight}g</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-sm text-neutral-600">Gross Weight:</span>
                      <span className="text-sm font-medium col-span-2">{selectedItem.grossWeight}g</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-sm text-neutral-600">Cost Price:</span>
                      <span className="text-sm font-medium col-span-2">{formatCurrency(selectedItem.costPrice)}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-sm text-neutral-600">Selling Price:</span>
                      <span className="text-sm font-medium col-span-2">{formatCurrency(selectedItem.sellingPrice)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-neutral-500 mb-1">Stone Details</h3>
                <div className="bg-neutral-50 rounded-md p-3 text-sm">
                  <pre className="whitespace-pre-wrap text-xs">
                    {JSON.stringify(selectedItem.stoneDetails, null, 2)}
                  </pre>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-neutral-500 mb-1">Tags</h3>
                <div className="flex flex-wrap gap-1">
                  {selectedItem.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {selectedItem.notes && (
                <div>
                  <h3 className="text-sm font-medium text-neutral-500 mb-1">Notes</h3>
                  <p className="text-sm">{selectedItem.notes}</p>
                </div>
              )}
              
              <div className="flex justify-between text-xs text-neutral-500">
                <span>Created: {formatDate(selectedItem.creationDate)}</span>
                <span>Last Modified: {formatDate(selectedItem.lastModified)}</span>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpenDialog(false)}>Close</Button>
                <Button onClick={() => {
                  setOpenDialog(false);
                  setDialogMode("edit");
                  handleEditItem(selectedItem);
                }}>Edit</Button>
              </DialogFooter>
            </div>
          )}
          
          {(dialogMode === "edit" || dialogMode === "create") && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Item Name</FormLabel>
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
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="metalType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Metal Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
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
                          <Input {...field} />
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
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="stoneDetailsText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stone Details (JSON format)</FormLabel>
                      <FormControl>
                        <Textarea 
                          rows={4} 
                          {...field} 
                          placeholder='{"mainStone": "Diamond", "mainStoneWeight": 1.25, "mainStoneColor": "F", "mainStoneClarity": "VS1"}'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="costPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cost Price (₹)</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select location" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Display Case">Display Case</SelectItem>
                            <SelectItem value="Safe">Safe</SelectItem>
                            <SelectItem value="Workshop">Workshop</SelectItem>
                            <SelectItem value="Showroom">Showroom</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
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
                            <SelectItem value="Available">Available</SelectItem>
                            <SelectItem value="Memo">Memo</SelectItem>
                            <SelectItem value="Reserved">Reserved</SelectItem>
                            <SelectItem value="Sold">Sold</SelectItem>
                            <SelectItem value="Repair">Repair</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags (comma separated)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. Bridal, Diamond, Luxury" />
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
                  <Button type="button" variant="outline" onClick={() => setOpenDialog(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {dialogMode === "create" ? "Create Item" : "Update Item"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
