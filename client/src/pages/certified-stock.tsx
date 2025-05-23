import React, { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { StockTable } from "@/components/data-display/stock-table";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StockImage } from "@/components/ui/stock-image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/utils";

// Sample data for demonstration
const certifiedStockData = [
  {
    id: 1,
    itemCode: "CS-10001",
    certificateNumber: "GIA-12345678",
    lab: "GIA",
    stoneType: "Diamond",
    shape: "Round",
    carat: 1.01,
    color: "D",
    clarity: "VVS1",
    cut: "Excellent",
    costPrice: 235000,
    sellingPrice: 295000,
    location: "Main Store",
    notes: "Triple excellent, eye clean",
    updatedBy: 1,
    lastUpdated: "2023-08-10T14:30:00Z"
  },
  {
    id: 2,
    itemCode: "CS-10002",
    certificateNumber: "IGI-98765432",
    lab: "IGI",
    stoneType: "Diamond",
    shape: "Princess",
    carat: 1.50,
    color: "E",
    clarity: "VS1",
    cut: "Very Good",
    costPrice: 275000,
    sellingPrice: 355000,
    location: "Safe",
    notes: "Hearts and arrows pattern",
    updatedBy: 1,
    lastUpdated: "2023-08-12T10:15:00Z"
  },
  {
    id: 3,
    itemCode: "CS-10003",
    certificateNumber: "AGS-54321678",
    lab: "AGS",
    stoneType: "Diamond",
    shape: "Oval",
    carat: 1.75,
    color: "F",
    clarity: "VS2",
    cut: "Excellent",
    costPrice: 310000,
    sellingPrice: 395000,
    location: "Display Case",
    notes: "No fluorescence",
    updatedBy: 1,
    lastUpdated: "2023-08-15T09:45:00Z"
  },
  {
    id: 4,
    itemCode: "CS-10004",
    certificateNumber: "HRD-87654321",
    lab: "HRD",
    stoneType: "Diamond",
    shape: "Cushion",
    carat: 2.05,
    color: "G",
    clarity: "SI1",
    cut: "Very Good",
    costPrice: 345000,
    sellingPrice: 425000,
    location: "Safe",
    notes: "Medium blue fluorescence",
    updatedBy: 1,
    lastUpdated: "2023-08-18T13:20:00Z"
  },
  {
    id: 5,
    itemCode: "CS-10005",
    certificateNumber: "GIA-87654321",
    lab: "GIA",
    stoneType: "Sapphire",
    shape: "Emerald",
    carat: 3.25,
    color: "Blue",
    clarity: "VS",
    cut: "Good",
    costPrice: 425000,
    sellingPrice: 530000,
    location: "Main Store",
    notes: "Royal blue, no heat treatment",
    updatedBy: 1,
    lastUpdated: "2023-08-20T11:10:00Z"
  }
];

export default function CertifiedStock() {
  const { toast } = useToast();
  const [stockData, setStockData] = useState(certifiedStockData);
  const [openDialog, setOpenDialog] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [viewDialog, setViewDialog] = useState(false);
  const [viewItem, setViewItem] = useState<any>(null);
  
  const totalStockValue = stockData.reduce((sum, item) => sum + item.sellingPrice, 0);
  
  // Generate stats for dashboard
  const totalItems = stockData.length;
  const totalCarat = stockData.reduce((sum, item) => sum + item.carat, 0).toFixed(2);
  
  // Handle view item
  const handleViewItem = (item: any) => {
    setViewItem(item);
    setViewDialog(true);
  };
  
  // Handle edit item
  const handleEditItem = (item: any) => {
    setEditItem(item);
    setOpenDialog(true);
  };
  
  // Handle add new item
  const handleAddItem = () => {
    setEditItem(null);
    setOpenDialog(true);
  };
  
  // Handle delete item
  const handleDeleteItem = (item: any) => {
    setStockData(stockData.filter(stock => stock.id !== item.id));
    toast({
      title: "Item Deleted",
      description: `Item ${item.itemCode} has been deleted.`,
      variant: "default",
    });
  };
  
  // Handle form submission with improved data handling
  const handleFormSubmit = (data: any) => {
    console.log("Received form data:", data);
    
    try {
      // Create a clean object with all needed fields
      const processedData = {
        id: editItem ? editItem.id : stockData.length + 1,
        itemCode: data.itemCode || `CS-${Math.floor(10000 + Math.random() * 90000)}`,
        certificateNumber: data.certificateNumber || "",
        lab: data.lab || "",
        stoneType: data.stoneType || "Diamond",
        shape: data.shape || "",
        carat: parseFloat(data.carat) || 0,
        color: data.color || "",
        clarity: data.clarity || "",
        cut: data.cut || "",
        costPrice: parseFloat(data.costPrice) || 0,
        sellingPrice: parseFloat(data.sellingPrice) || 0,
        location: data.location || "Main Store",
        notes: data.notes || "",
        updatedBy: 1, // Current user
        lastUpdated: new Date().toISOString()
      };
      
      console.log("Processed data:", processedData);
      
      if (editItem) {
        // Update existing item
        setStockData(stockData.map(item => 
          item.id === editItem.id ? processedData : item
        ));
        toast({
          title: "Item Updated",
          description: `Item ${processedData.itemCode} has been successfully updated.`,
          variant: "default",
        });
      } else {
        // Add new item
        setStockData([...stockData, processedData]);
        toast({
          title: "Item Added",
          description: `Item ${processedData.itemCode} has been successfully added to stock.`,
          variant: "default",
        });
      }
      
      // Close dialog and reset
      setOpenDialog(false);
      setEditItem(null);
    } catch (error) {
      console.error("Error processing form data:", error);
      toast({
        title: "Error",
        description: "There was a problem saving the item. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Handle form cancel
  const handleFormCancel = () => {
    setOpenDialog(false);
    setEditItem(null);
  };
  
  // Print item details
  const handlePrintItem = (item: any) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast({
        title: "Error",
        description: "Please allow pop-ups to print item details.",
        variant: "destructive",
      });
      return;
    }
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Certified Stock Details - ${item.itemCode}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            h1 { color: #333; margin-bottom: 5px; }
            .logo { margin-bottom: 20px; }
            .info-section { margin-bottom: 20px; }
            .info-row { display: flex; margin-bottom: 8px; }
            .info-label { font-weight: bold; width: 150px; }
            .info-value { flex: 1; }
            .badge { display: inline-block; padding: 5px 10px; border-radius: 4px; font-size: 14px; }
            .badge-store { background-color: #E3F2FD; color: #1976D2; }
            .badge-safe { background-color: #E8F5E9; color: #388E3C; }
            .badge-display { background-color: #FFF3E0; color: #E64A19; }
            .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #777; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Certified Stock Item</h1>
            <p>Printed on ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="info-section">
            <h2>Item Information</h2>
            <div class="info-row">
              <div class="info-label">Item Code:</div>
              <div class="info-value">${item.itemCode}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Certificate Number:</div>
              <div class="info-value">${item.certificateNumber}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Lab:</div>
              <div class="info-value">${item.lab}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Stone Type:</div>
              <div class="info-value">${item.stoneType}</div>
            </div>
          </div>
          
          <div class="info-section">
            <h2>Stone Details</h2>
            <div class="info-row">
              <div class="info-label">Shape:</div>
              <div class="info-value">${item.shape}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Carat:</div>
              <div class="info-value">${item.carat}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Color:</div>
              <div class="info-value">${item.color}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Clarity:</div>
              <div class="info-value">${item.clarity}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Cut:</div>
              <div class="info-value">${item.cut}</div>
            </div>
          </div>
          
          <div class="info-section">
            <h2>Pricing</h2>
            <div class="info-row">
              <div class="info-label">Cost Price:</div>
              <div class="info-value">₹${item.costPrice.toLocaleString()}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Selling Price:</div>
              <div class="info-value">₹${item.sellingPrice.toLocaleString()}</div>
            </div>
          </div>
          
          <div class="info-section">
            <h2>Location & Notes</h2>
            <div class="info-row">
              <div class="info-label">Location:</div>
              <div class="info-value">
                <span class="badge badge-${item.location === 'Main Store' ? 'store' : item.location === 'Safe' ? 'safe' : 'display'}">
                  ${item.location}
                </span>
              </div>
            </div>
            <div class="info-row">
              <div class="info-label">Notes:</div>
              <div class="info-value">${item.notes || 'No notes available'}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Last Updated:</div>
              <div class="info-value">${new Date(item.lastUpdated).toLocaleString()}</div>
            </div>
          </div>
          
          <div class="footer">
            <p>This document was generated by the Jewelry Management System.</p>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    setTimeout(() => printWindow.close(), 500);
  };

  return (
    <MainLayout title="Certified Stock Management">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Certified Stock Management</h1>
          <p className="text-neutral-500">Manage certified gemstones with laboratory certificates and detailed specifications</p>
        </div>
        <Button onClick={handleAddItem} className="bg-primary text-white hover:bg-primary/90">
          Add New Stock
        </Button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold text-neutral-600">Total Stock Value</h3>
            <p className="text-3xl font-bold text-primary mt-2">₹{formatCurrency(totalStockValue)}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold text-neutral-600">Total Items</h3>
            <p className="text-3xl font-bold text-primary mt-2">{totalItems}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold text-neutral-600">Total Carat</h3>
            <p className="text-3xl font-bold text-primary mt-2">{totalCarat}</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Featured Content */}
      <div className="mb-8">
        <Card>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="md:col-span-1">
                <StockImage type="certified-stone" className="h-full rounded-l-lg md:rounded-r-none rounded-r-lg" />
              </div>
              <div className="md:col-span-2 p-6">
                <h3 className="text-lg font-semibold text-neutral-800">Certified Loose Gemstones</h3>
                <p className="text-neutral-600 mt-2 mb-4">
                  Our collection includes certified diamonds and precious gemstones with laboratory certificates from GIA, IGI, AGS, and more.
                  Keep track of all details including certificates, gradings, and locations.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="border border-neutral-200 rounded-md p-3">
                    <p className="text-xs text-neutral-500">GIA Diamond</p>
                    <p className="font-medium">Round, D VVS1, 1.01ct</p>
                  </div>
                  <div className="border border-neutral-200 rounded-md p-3">
                    <p className="text-xs text-neutral-500">IGI Diamond</p>
                    <p className="font-medium">Princess, E VS1, 1.50ct</p>
                  </div>
                  <div className="border border-neutral-200 rounded-md p-3">
                    <p className="text-xs text-neutral-500">HRD Diamond</p>
                    <p className="font-medium">Cushion, G SI1, 2.05ct</p>
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
          
          {/* Direct form implementation */}
          <form onSubmit={(e) => {
            e.preventDefault();
            
            // Get form data directly from the form elements
            const formData = new FormData(e.currentTarget);
            const data = {
              id: editItem ? editItem.id : stockData.length + 1,
              itemCode: formData.get('itemCode') as string || `CS-${Math.floor(10000 + Math.random() * 90000)}`,
              certificateNumber: formData.get('certificateNumber') as string,
              lab: formData.get('lab') as string,
              stoneType: formData.get('stoneType') as string || "Diamond",
              shape: formData.get('shape') as string || "",
              carat: parseFloat(formData.get('carat') as string) || 0,
              color: formData.get('color') as string || "",
              clarity: formData.get('clarity') as string || "",
              cut: formData.get('cut') as string || "",
              costPrice: parseFloat(formData.get('costPrice') as string) || 0,
              sellingPrice: parseFloat(formData.get('sellingPrice') as string) || 0,
              location: formData.get('location') as string || "Main Store",
              notes: formData.get('notes') as string || "",
              updatedBy: 1, // Current user
              lastUpdated: new Date().toISOString()
            };
            
            console.log("Saving data:", data);
            
            // Use the existing handler with our processed data
            handleFormSubmit(data);
          }} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Item Code */}
              <div className="space-y-2">
                <label htmlFor="itemCode" className="text-sm font-medium">Item Code</label>
                <input 
                  id="itemCode" 
                  name="itemCode"
                  defaultValue={editItem?.itemCode || ""}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              {/* Certificate Number */}
              <div className="space-y-2">
                <label htmlFor="certificateNumber" className="text-sm font-medium">Certificate Number</label>
                <input 
                  id="certificateNumber" 
                  name="certificateNumber"
                  defaultValue={editItem?.certificateNumber || ""}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              {/* Lab */}
              <div className="space-y-2">
                <label htmlFor="lab" className="text-sm font-medium">Laboratory</label>
                <select 
                  id="lab" 
                  name="lab" 
                  defaultValue={editItem?.lab || "GIA"}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="GIA">GIA</option>
                  <option value="IGI">IGI</option>
                  <option value="AGS">AGS</option>
                  <option value="HRD">HRD</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              {/* Stone Type */}
              <div className="space-y-2">
                <label htmlFor="stoneType" className="text-sm font-medium">Stone Type</label>
                <select 
                  id="stoneType" 
                  name="stoneType" 
                  defaultValue={editItem?.stoneType || "Diamond"}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="Diamond">Diamond</option>
                  <option value="Ruby">Ruby</option>
                  <option value="Emerald">Emerald</option>
                  <option value="Sapphire">Sapphire</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              {/* Shape */}
              <div className="space-y-2">
                <label htmlFor="shape" className="text-sm font-medium">Shape</label>
                <select 
                  id="shape" 
                  name="shape" 
                  defaultValue={editItem?.shape || ""}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="Round">Round</option>
                  <option value="Princess">Princess</option>
                  <option value="Cushion">Cushion</option>
                  <option value="Oval">Oval</option>
                  <option value="Emerald">Emerald</option>
                  <option value="Pear">Pear</option>
                  <option value="Marquise">Marquise</option>
                  <option value="Radiant">Radiant</option>
                  <option value="Asscher">Asscher</option>
                  <option value="Heart">Heart</option>
                </select>
              </div>
              
              {/* Carat */}
              <div className="space-y-2">
                <label htmlFor="carat" className="text-sm font-medium">Carat Weight</label>
                <input 
                  id="carat" 
                  name="carat" 
                  type="number" 
                  step="0.01"
                  defaultValue={editItem?.carat || ""}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              {/* Color */}
              <div className="space-y-2">
                <label htmlFor="color" className="text-sm font-medium">Color</label>
                <input 
                  id="color" 
                  name="color" 
                  defaultValue={editItem?.color || ""}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              {/* Clarity */}
              <div className="space-y-2">
                <label htmlFor="clarity" className="text-sm font-medium">Clarity</label>
                <input 
                  id="clarity" 
                  name="clarity" 
                  defaultValue={editItem?.clarity || ""}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              {/* Cut */}
              <div className="space-y-2">
                <label htmlFor="cut" className="text-sm font-medium">Cut</label>
                <select 
                  id="cut" 
                  name="cut" 
                  defaultValue={editItem?.cut || ""}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="Excellent">Excellent</option>
                  <option value="Very Good">Very Good</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>
              
              {/* Cost Price */}
              <div className="space-y-2">
                <label htmlFor="costPrice" className="text-sm font-medium">Cost Price (₹)</label>
                <input 
                  id="costPrice" 
                  name="costPrice" 
                  type="number"
                  defaultValue={editItem?.costPrice || ""}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              {/* Selling Price */}
              <div className="space-y-2">
                <label htmlFor="sellingPrice" className="text-sm font-medium">Selling Price (₹)</label>
                <input 
                  id="sellingPrice" 
                  name="sellingPrice" 
                  type="number"
                  defaultValue={editItem?.sellingPrice || ""}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              {/* Location */}
              <div className="space-y-2">
                <label htmlFor="location" className="text-sm font-medium">Location</label>
                <select 
                  id="location" 
                  name="location" 
                  defaultValue={editItem?.location || "Main Store"}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="Main Store">Main Store</option>
                  <option value="Safe">Safe</option>
                  <option value="Display Case">Display Case</option>
                </select>
              </div>
            </div>
            
            {/* Notes */}
            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-medium">Notes (Optional)</label>
              <textarea 
                id="notes" 
                name="notes" 
                defaultValue={editItem?.notes || ""}
                className="w-full p-2 border border-gray-300 rounded-md h-24"
              ></textarea>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" type="button" onClick={handleFormCancel}>
                Cancel
              </Button>
              <Button type="submit">
                Save Certified Stock
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* View Stock Item Dialog */}
      <Dialog open={viewDialog} onOpenChange={setViewDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Certified Stock Details</DialogTitle>
            <DialogDescription>
              Detailed information about stock item {viewItem?.itemCode}
            </DialogDescription>
          </DialogHeader>
          
          {viewItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium">Item Code</h4>
                  <p className="text-base">{viewItem.itemCode}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Certificate Number</h4>
                  <p className="text-base">{viewItem.certificateNumber}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium">Laboratory</h4>
                  <p className="text-base">{viewItem.lab}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Stone Type</h4>
                  <p className="text-base">{viewItem.stoneType}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h4 className="text-sm font-medium">Shape</h4>
                  <p className="text-base">{viewItem.shape}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Carat</h4>
                  <p className="text-base">{viewItem.carat}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Color</h4>
                  <p className="text-base">{viewItem.color}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium">Clarity</h4>
                  <p className="text-base">{viewItem.clarity}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Cut</h4>
                  <p className="text-base">{viewItem.cut}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium">Cost Price</h4>
                  <p className="text-base">₹{viewItem.costPrice.toLocaleString()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Selling Price</h4>
                  <p className="text-base">₹{viewItem.sellingPrice.toLocaleString()}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium">Location</h4>
                <div className="mt-1">
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                    viewItem.location === 'Main Store'
                      ? 'bg-blue-100 text-blue-800'
                      : viewItem.location === 'Safe'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {viewItem.location}
                  </span>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium">Notes</h4>
                <p className="text-base">{viewItem.notes || 'No notes available'}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium">Last Updated</h4>
                <p className="text-base">{new Date(viewItem.lastUpdated).toLocaleString()}</p>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => handlePrintItem(viewItem)}>
                  Print Details
                </Button>
                <Button variant="outline" onClick={() => handleEditItem(viewItem)}>
                  Edit
                </Button>
                <Button variant="default" onClick={() => setViewDialog(false)}>
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}