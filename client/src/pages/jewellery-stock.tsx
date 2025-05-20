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
    notes: "Classic design",
    updatedBy: 1,
    lastUpdated: "2023-07-15T10:30:00Z"
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
    notes: "Handcrafted, exclusive design",
    updatedBy: 1,
    lastUpdated: "2023-07-14T14:45:00Z"
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
    notes: "",
    updatedBy: 1,
    lastUpdated: "2023-07-12T09:20:00Z"
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
    notes: "Colombian emeralds",
    updatedBy: 1,
    lastUpdated: "2023-07-10T16:15:00Z"
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
    notes: "",
    updatedBy: 1,
    lastUpdated: "2023-07-08T11:30:00Z"
  }
];

export default function JewelleryStock() {
  const { toast } = useToast();
  const [openDialog, setOpenDialog] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "form">("table");
  const [editItem, setEditItem] = useState<any>(null);
  const [stockData, setStockData] = useState(jewelleryStockData);
  
  // Calculate total stock value
  const totalValue = stockData.reduce((sum, item) => sum + item.sellingPrice, 0);
  
  // Get categories breakdown
  const categoryBreakdown = stockData.reduce((acc: Record<string, number>, item) => {
    const category = item.category;
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});
  
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
    <MainLayout title="Jewellery Stock">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-800">Jewellery Stock Management</h1>
          <p className="text-neutral-500">Manage finished jewellery inventory</p>
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
                <i className="fas fa-ring text-lg"></i>
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
                <i className="fas fa-gem text-lg"></i>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-neutral-500">Top Category</p>
                <h3 className="text-2xl font-semibold mt-1">
                  {Object.entries(categoryBreakdown).reduce((a, b) => a[1] > b[1] ? a : b)[0]}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center text-success">
                <i className="fas fa-crown text-lg"></i>
              </div>
            </div>
          </CardContent>
        </Card>
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
                <h3 className="text-lg font-semibold text-neutral-800">Exquisite Jewellery Collection</h3>
                <p className="text-neutral-600 mt-2 mb-4">
                  Our jewellery stock features handcrafted pieces using the finest metals and gemstones. 
                  Each piece is meticulously cataloged with detailed specifications including metal type, 
                  weight, stone details, and more.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="border border-neutral-200 rounded-md p-3">
                    <p className="text-xs text-neutral-500">Diamond Rings</p>
                    <p className="font-medium">Platinum, 18K Gold</p>
                  </div>
                  <div className="border border-neutral-200 rounded-md p-3">
                    <p className="text-xs text-neutral-500">Necklaces</p>
                    <p className="font-medium">Ruby and Diamond</p>
                  </div>
                  <div className="border border-neutral-200 rounded-md p-3">
                    <p className="text-xs text-neutral-500">Bracelets</p>
                    <p className="font-medium">Tennis, Bangle</p>
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
            type="jewellery"
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
            <DialogTitle>{editItem ? 'Edit Jewellery Stock' : 'Add New Jewellery Stock'}</DialogTitle>
            <DialogDescription>
              {editItem 
                ? 'Update the details of the jewellery item.' 
                : 'Enter the details for the new jewellery item.'}
            </DialogDescription>
          </DialogHeader>
          
          <StockForm
            type="jewellery"
            defaultValues={editItem ? {
              ...editItem,
              stoneDetails: editItem.stoneDetails ? JSON.stringify(editItem.stoneDetails) : ""
            } : null}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
