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
const certifiedStockData = [
  {
    id: 1,
    itemCode: "CS-20001",
    stoneType: "Diamond",
    certificateNumber: "IGI 123456789",
    laboratory: "IGI",
    shape: "Round",
    carat: 1.52,
    color: "D",
    clarity: "VVS1",
    cut: "Excellent",
    costPrice: 320000,
    sellingPrice: 425000,
    location: "Safe",
    notes: "Triple excellent cut grade",
    updatedBy: 1,
    lastUpdated: "2023-07-15T10:30:00Z"
  },
  {
    id: 2,
    itemCode: "CS-20002",
    stoneType: "Diamond",
    certificateNumber: "GIA 2211567823",
    laboratory: "GIA",
    shape: "Cushion",
    carat: 2.03,
    color: "F",
    clarity: "VS2",
    cut: "Very Good",
    costPrice: 450000,
    sellingPrice: 575000,
    location: "Safe",
    notes: "",
    updatedBy: 1,
    lastUpdated: "2023-07-14T14:45:00Z"
  },
  {
    id: 3,
    itemCode: "CS-20003",
    stoneType: "Diamond",
    certificateNumber: "IGI 987654321",
    laboratory: "IGI",
    shape: "Princess",
    carat: 1.21,
    color: "G",
    clarity: "SI1",
    cut: "Excellent",
    costPrice: 180000,
    sellingPrice: 240000,
    location: "Display Case",
    notes: "",
    updatedBy: 1,
    lastUpdated: "2023-07-12T09:20:00Z"
  },
  {
    id: 4,
    itemCode: "CS-20004",
    stoneType: "Ruby",
    certificateNumber: "GRS 10567823",
    laboratory: "GRS",
    shape: "Oval",
    carat: 3.05,
    color: "Pigeon Blood Red",
    clarity: "",
    cut: "",
    costPrice: 520000,
    sellingPrice: 750000,
    location: "Safe",
    notes: "Unheated Burma ruby with exceptional color",
    updatedBy: 1,
    lastUpdated: "2023-07-10T16:15:00Z"
  },
  {
    id: 5,
    itemCode: "CS-20005",
    stoneType: "Sapphire",
    certificateNumber: "SSEF 89562",
    laboratory: "SSEF",
    shape: "Cushion",
    carat: 4.25,
    color: "Royal Blue",
    clarity: "",
    cut: "",
    costPrice: 380000,
    sellingPrice: 625000,
    location: "Safe",
    notes: "Kashmir origin, no heat treatment",
    updatedBy: 1,
    lastUpdated: "2023-07-08T11:30:00Z"
  }
];

export default function CertifiedStock() {
  const { toast } = useToast();
  const [openDialog, setOpenDialog] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "form">("table");
  const [editItem, setEditItem] = useState<any>(null);
  const [stockData, setStockData] = useState(certifiedStockData);
  
  // Calculate total stock value
  const totalValue = stockData.reduce((sum, item) => sum + item.sellingPrice, 0);
  
  // Group by laboratory
  const labBreakdown = stockData.reduce((acc: Record<string, number>, item) => {
    const lab = item.laboratory;
    acc[lab] = (acc[lab] || 0) + 1;
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
    <MainLayout title="Certified Stock">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-800">Certified Stock Management</h1>
          <p className="text-neutral-500">Manage certified gemstones inventory</p>
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
                <i className="fas fa-certificate text-lg"></i>
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
                <p className="text-sm text-neutral-500">IGI Certificates</p>
                <h3 className="text-2xl font-semibold mt-1">{labBreakdown['IGI'] || 0}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center text-warning">
                <i className="fas fa-award text-lg"></i>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Featured Certificate */}
      <div className="mb-6">
        <Card>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="md:col-span-1">
                <StockImage type="gemstone-collection" className="h-full rounded-l-lg md:rounded-r-none rounded-r-lg" />
              </div>
              <div className="md:col-span-2 p-6">
                <h3 className="text-lg font-semibold text-neutral-800">Certified Gemstone Collection</h3>
                <p className="text-neutral-600 mt-2 mb-4">
                  Our certified collection features premium gemstones with authentication from leading 
                  laboratories including IGI, GIA, HRD and more. Each stone comes with a detailed certificate
                  verifying its characteristics and authenticity.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="border border-neutral-200 rounded-md p-3">
                    <p className="text-xs text-neutral-500">IGI Certificate</p>
                    <p className="font-medium">Diamond, D VVS1, 1.52ct</p>
                  </div>
                  <div className="border border-neutral-200 rounded-md p-3">
                    <p className="text-xs text-neutral-500">GIA Certificate</p>
                    <p className="font-medium">Diamond, F VS2, 2.03ct</p>
                  </div>
                  <div className="border border-neutral-200 rounded-md p-3">
                    <p className="text-xs text-neutral-500">SSEF Certificate</p>
                    <p className="font-medium">Kashmir Sapphire, 4.25ct</p>
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
            type="certified"
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
            <DialogTitle>{editItem ? 'Edit Certified Stock' : 'Add New Certified Stock'}</DialogTitle>
            <DialogDescription>
              {editItem 
                ? 'Update the details of the certified stock item.' 
                : 'Enter the details for the new certified stock item.'}
            </DialogDescription>
          </DialogHeader>
          
          <StockForm
            type="certified"
            defaultValues={editItem}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
