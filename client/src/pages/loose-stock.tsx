import React, { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { StockTable } from "@/components/data-display/stock-table";
import { StockForm } from "@/components/forms/stock-form";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StockImage } from "@/components/ui/stock-image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/utils";

// Sample data for demonstration
const looseStockData = [
  {
    id: 1,
    itemCode: "LS-10001",
    stoneType: "Diamond",
    shape: "Round",
    carat: 1.02,
    color: "F",
    clarity: "VS1",
    cut: "Excellent",
    quantity: 1,
    costPrice: 125000,
    sellingPrice: 165000,
    location: "Main Store",
    notes: "Excellent polish and symmetry",
    updatedBy: 1,
    lastUpdated: "2023-07-15T10:30:00Z"
  },
  {
    id: 2,
    itemCode: "LS-10002",
    stoneType: "Diamond",
    shape: "Princess",
    carat: 0.85,
    color: "G",
    clarity: "SI1",
    cut: "Very Good",
    quantity: 2,
    costPrice: 85000,
    sellingPrice: 110000,
    location: "Safe",
    notes: "",
    updatedBy: 1,
    lastUpdated: "2023-07-14T14:45:00Z"
  },
  {
    id: 3,
    itemCode: "LS-10003",
    stoneType: "Ruby",
    shape: "Oval",
    carat: 1.75,
    color: "Red",
    clarity: "",
    cut: "",
    quantity: 1,
    costPrice: 95000,
    sellingPrice: 145000,
    location: "Display Case",
    notes: "Deep red color, heat treated",
    updatedBy: 1,
    lastUpdated: "2023-07-12T09:20:00Z"
  },
  {
    id: 4,
    itemCode: "LS-10004",
    stoneType: "Emerald",
    shape: "Emerald",
    carat: 1.25,
    color: "Green",
    clarity: "",
    cut: "",
    quantity: 1,
    costPrice: 110000,
    sellingPrice: 160000,
    location: "Safe",
    notes: "Colombian origin",
    updatedBy: 1,
    lastUpdated: "2023-07-10T16:15:00Z"
  },
  {
    id: 5,
    itemCode: "LS-10005",
    stoneType: "Diamond",
    shape: "Cushion",
    carat: 1.15,
    color: "E",
    clarity: "VVS2",
    cut: "Excellent",
    quantity: 1,
    costPrice: 145000,
    sellingPrice: 195000,
    location: "Main Store",
    notes: "",
    updatedBy: 1,
    lastUpdated: "2023-07-08T11:30:00Z"
  }
];

export default function LooseStock() {
  const { toast } = useToast();
  const [openDialog, setOpenDialog] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "form">("table");
  const [editItem, setEditItem] = useState<any>(null);
  const [stockData, setStockData] = useState(looseStockData);
  
  // Calculate total stock value
  const totalValue = stockData.reduce((sum, item) => {
    return sum + (item.sellingPrice * item.quantity);
  }, 0);
  
  // Calculate total quantity
  const totalQuantity = stockData.reduce((sum, item) => sum + item.quantity, 0);
  
  // Handle view item
  const handleViewItem = (item: any) => {
    setEditItem(item);
    setViewMode("form");
    setOpenDialog(true);
  };
  
  // Handle edit item
  const handleEditItem = (item: any) => {
    setEditItem(item);
    setViewMode("form");
    setOpenDialog(true);
  };
  
  // Handle delete item
  const handleDeleteItem = (item: any) => {
    // In a real app, this would be an API call
    setStockData(stockData.filter(stock => stock.id !== item.id));
    toast({
      title: "Item Deleted",
      description: `Item ${item.itemCode} has been deleted.`,
      variant: "default",
    });
  };
  
  // Handle form submission
  const handleFormSubmit = (data: any) => {
    if (editItem) {
      // Update existing item
      setStockData(stockData.map(item => 
        item.id === editItem.id ? { ...item, ...data } : item
      ));
      toast({
        title: "Item Updated",
        description: `Item ${data.itemCode} has been updated.`,
        variant: "default",
      });
    } else {
      // Add new item
      const newItem = {
        id: stockData.length + 1,
        ...data,
      };
      setStockData([...stockData, newItem]);
      toast({
        title: "Item Added",
        description: `Item ${data.itemCode} has been added to stock.`,
        variant: "default",
      });
    }
    setOpenDialog(false);
    setEditItem(null);
  };
  
  // Handle form cancel
  const handleFormCancel = () => {
    setOpenDialog(false);
    setEditItem(null);
  };
  
  return (
    <MainLayout title="Loose Stock">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-800">Loose Stock Management</h1>
          <p className="text-neutral-500">Manage loose gemstones inventory</p>
        </div>
        <Button onClick={() => {
          setEditItem(null);
          setOpenDialog(true);
        }}>
          <i className="fas fa-plus mr-2"></i> Add New Stock
        </Button>
      </div>
      
      {/* Stock Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-neutral-500">Total Stock Value</p>
                <h3 className="text-2xl font-semibold mt-1">{formatCurrency(totalValue)}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <i className="fas fa-gem text-lg"></i>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-neutral-500">Total Items</p>
                <h3 className="text-2xl font-semibold mt-1">{stockData.length}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-info/10 flex items-center justify-center text-info">
                <i className="fas fa-box-open text-lg"></i>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-neutral-500">Total Quantity</p>
                <h3 className="text-2xl font-semibold mt-1">{totalQuantity}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center text-success">
                <i className="fas fa-calculator text-lg"></i>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Featured Gemstone */}
      <div className="mb-6">
        <Card>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="md:col-span-1">
                <StockImage type="gemstone-collection" className="h-full rounded-l-lg md:rounded-r-none rounded-r-lg" />
              </div>
              <div className="md:col-span-2 p-6">
                <h3 className="text-lg font-semibold text-neutral-800">Featured Loose Gemstones</h3>
                <p className="text-neutral-600 mt-2 mb-4">
                  Our collection includes high-quality loose diamonds, rubies, emeralds, and sapphires 
                  with detailed specifications. Update daily inventory counts and track each stone's location.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="border border-neutral-200 rounded-md p-3">
                    <p className="text-xs text-neutral-500">Diamond</p>
                    <p className="font-medium">Round, VS1, F Color</p>
                  </div>
                  <div className="border border-neutral-200 rounded-md p-3">
                    <p className="text-xs text-neutral-500">Ruby</p>
                    <p className="font-medium">Oval, Deep Red, 1.75ct</p>
                  </div>
                  <div className="border border-neutral-200 rounded-md p-3">
                    <p className="text-xs text-neutral-500">Emerald</p>
                    <p className="font-medium">Colombian, 1.25ct</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Stock Data Table */}
      <Card>
        <CardContent className="p-0">
          <StockTable
            data={stockData}
            type="loose"
            onView={handleViewItem}
            onEdit={handleEditItem}
            onDelete={handleDeleteItem}
          />
        </CardContent>
      </Card>
      
      {/* Add/Edit Stock Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editItem ? 'Edit Loose Stock' : 'Add New Loose Stock'}</DialogTitle>
            <DialogDescription>
              {editItem 
                ? 'Update the details of the loose stock item.' 
                : 'Enter the details for the new loose stock item.'}
            </DialogDescription>
          </DialogHeader>
          
          <StockForm
            type="loose"
            defaultValues={editItem}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
