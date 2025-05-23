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
const jewelleryStockData = [
  {
    id: 1,
    itemCode: "JS-10001",
    name: "Diamond Engagement Ring",
    category: "Ring",
    metalType: "18K White Gold",
    metalWeight: 4.2,
    diamondDetails: "1.2ct, VS1, F Color, Round",
    grossWeight: 5.1,
    purity: "18K",
    costPrice: 345000,
    sellingPrice: 425000,
    location: "Main Store",
    notes: "Solitaire setting with micro pavé band",
    updatedBy: 1,
    lastUpdated: "2023-09-10T10:25:00Z"
  },
  {
    id: 2,
    itemCode: "JS-10002",
    name: "Sapphire Necklace",
    category: "Necklace",
    metalType: "22K Yellow Gold",
    metalWeight: 12.8,
    diamondDetails: "3.5ct Blue Sapphire, 0.75ct Diamond Accents",
    grossWeight: 16.3,
    purity: "22K",
    costPrice: 520000,
    sellingPrice: 685000,
    location: "Safe",
    notes: "Royal blue sapphire pendant with diamond halo",
    updatedBy: 1,
    lastUpdated: "2023-09-12T14:40:00Z"
  },
  {
    id: 3,
    itemCode: "JS-10003",
    name: "Diamond Tennis Bracelet",
    category: "Bracelet",
    metalType: "14K White Gold",
    metalWeight: 7.5,
    diamondDetails: "4.2ct total, SI1-VS2, G-H Color",
    grossWeight: 9.3,
    purity: "14K",
    costPrice: 275000,
    sellingPrice: 375000,
    location: "Display Case",
    notes: "Prong setting with secure double clasp",
    updatedBy: 1,
    lastUpdated: "2023-09-15T09:10:00Z"
  },
  {
    id: 4,
    itemCode: "JS-10004",
    name: "Pearl & Diamond Earrings",
    category: "Earrings",
    metalType: "18K Rose Gold",
    metalWeight: 3.2,
    diamondDetails: "8mm Akoya Pearls, 0.4ct Diamond Accents",
    grossWeight: 5.5,
    purity: "18K",
    costPrice: 125000,
    sellingPrice: 195000,
    location: "Main Store",
    notes: "Drop style with lever back closures",
    updatedBy: 1,
    lastUpdated: "2023-09-18T11:35:00Z"
  },
  {
    id: 5,
    itemCode: "JS-10005",
    name: "Men's Signet Ring",
    category: "Ring",
    metalType: "22K Yellow Gold",
    metalWeight: 9.8,
    diamondDetails: "N/A",
    grossWeight: 9.8,
    purity: "22K",
    costPrice: 210000,
    sellingPrice: 265000,
    location: "Display Case",
    notes: "Traditional design with family crest option",
    updatedBy: 1,
    lastUpdated: "2023-09-20T15:20:00Z"
  }
];

export default function JewelleryStock() {
  const { toast } = useToast();
  const [stockData, setStockData] = useState(jewelleryStockData);
  const [openDialog, setOpenDialog] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [viewDialog, setViewDialog] = useState(false);
  const [viewItem, setViewItem] = useState<any>(null);
  
  const totalStockValue = stockData.reduce((sum, item) => sum + item.sellingPrice, 0);
  
  // Generate stats for dashboard
  const totalItems = stockData.length;
  const totalGrossWeight = stockData.reduce((sum, item) => sum + item.grossWeight, 0).toFixed(2);
  
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
        itemCode: data.itemCode || `JS-${Math.floor(10000 + Math.random() * 90000)}`,
        name: data.name || "",
        category: data.category || "",
        metalType: data.metalType || "",
        metalWeight: parseFloat(data.metalWeight) || 0,
        diamondDetails: data.diamondDetails || "",
        grossWeight: parseFloat(data.grossWeight) || 0,
        purity: data.purity || "",
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
          <title>Jewellery Stock Details - ${item.itemCode}</title>
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
            <h1>Jewellery Stock Item</h1>
            <p>Printed on ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="info-section">
            <h2>Item Information</h2>
            <div class="info-row">
              <div class="info-label">Item Code:</div>
              <div class="info-value">${item.itemCode}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Name:</div>
              <div class="info-value">${item.name}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Category:</div>
              <div class="info-value">${item.category}</div>
            </div>
          </div>
          
          <div class="info-section">
            <h2>Metal Details</h2>
            <div class="info-row">
              <div class="info-label">Metal Type:</div>
              <div class="info-value">${item.metalType}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Metal Weight (g):</div>
              <div class="info-value">${item.metalWeight}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Gross Weight (g):</div>
              <div class="info-value">${item.grossWeight}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Purity:</div>
              <div class="info-value">${item.purity}</div>
            </div>
          </div>
          
          <div class="info-section">
            <h2>Diamond/Gemstone Details</h2>
            <div class="info-row">
              <div class="info-label">Details:</div>
              <div class="info-value">${item.diamondDetails || 'No diamond/gemstone details'}</div>
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
    <MainLayout title="Jewellery Stock Management">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Jewellery Stock Management</h1>
          <p className="text-neutral-500">Manage complete jewelry pieces with metal and stone details, pricing and inventory location</p>
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
            <h3 className="text-lg font-semibold text-neutral-600">Total Gross Weight (g)</h3>
            <p className="text-3xl font-bold text-primary mt-2">{totalGrossWeight}</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Featured Content */}
      <div className="mb-8">
        <Card>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="md:col-span-1">
                <StockImage type="jewelry-pieces" className="h-full rounded-l-lg md:rounded-r-none rounded-r-lg" />
              </div>
              <div className="md:col-span-2 p-6">
                <h3 className="text-lg font-semibold text-neutral-800">Finished Jewelry Collection</h3>
                <p className="text-neutral-600 mt-2 mb-4">
                  Our collection includes fine jewelry pieces including rings, necklaces, bracelets, and earrings.
                  Track complete details including metal type, purity, weight, and stone specifications.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="border border-neutral-200 rounded-md p-3">
                    <p className="text-xs text-neutral-500">Engagement Ring</p>
                    <p className="font-medium">18K White Gold, 1.2ct</p>
                  </div>
                  <div className="border border-neutral-200 rounded-md p-3">
                    <p className="text-xs text-neutral-500">Sapphire Necklace</p>
                    <p className="font-medium">22K Yellow Gold, 3.5ct</p>
                  </div>
                  <div className="border border-neutral-200 rounded-md p-3">
                    <p className="text-xs text-neutral-500">Tennis Bracelet</p>
                    <p className="font-medium">14K White Gold, 4.2ct</p>
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
                ? 'Update the details of the jewellery stock item.' 
                : 'Enter the details for the new jewellery stock item.'}
            </DialogDescription>
          </DialogHeader>
          
          {/* Direct form implementation */}
          <form onSubmit={(e) => {
            e.preventDefault();
            
            // Get form data directly from the form elements
            const formData = new FormData(e.currentTarget);
            const data = {
              id: editItem ? editItem.id : stockData.length + 1,
              itemCode: formData.get('itemCode') as string || `JS-${Math.floor(10000 + Math.random() * 90000)}`,
              name: formData.get('name') as string || "",
              category: formData.get('category') as string || "",
              metalType: formData.get('metalType') as string || "",
              metalWeight: parseFloat(formData.get('metalWeight') as string) || 0,
              diamondDetails: formData.get('diamondDetails') as string || "",
              grossWeight: parseFloat(formData.get('grossWeight') as string) || 0,
              purity: formData.get('purity') as string || "",
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
              
              {/* Name */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Item Name</label>
                <input 
                  id="name" 
                  name="name"
                  defaultValue={editItem?.name || ""}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              {/* Category */}
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">Category</label>
                <select 
                  id="category" 
                  name="category" 
                  defaultValue={editItem?.category || "Ring"}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="Ring">Ring</option>
                  <option value="Necklace">Necklace</option>
                  <option value="Bracelet">Bracelet</option>
                  <option value="Earrings">Earrings</option>
                  <option value="Pendant">Pendant</option>
                  <option value="Bangle">Bangle</option>
                  <option value="Watch">Watch</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              {/* Metal Type */}
              <div className="space-y-2">
                <label htmlFor="metalType" className="text-sm font-medium">Metal Type</label>
                <select 
                  id="metalType" 
                  name="metalType" 
                  defaultValue={editItem?.metalType || "18K White Gold"}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="18K White Gold">18K White Gold</option>
                  <option value="18K Yellow Gold">18K Yellow Gold</option>
                  <option value="18K Rose Gold">18K Rose Gold</option>
                  <option value="14K White Gold">14K White Gold</option>
                  <option value="14K Yellow Gold">14K Yellow Gold</option>
                  <option value="22K Yellow Gold">22K Yellow Gold</option>
                  <option value="Platinum">Platinum</option>
                  <option value="Silver">Silver</option>
                </select>
              </div>
              
              {/* Metal Weight */}
              <div className="space-y-2">
                <label htmlFor="metalWeight" className="text-sm font-medium">Metal Weight (g)</label>
                <input 
                  id="metalWeight" 
                  name="metalWeight" 
                  type="number" 
                  step="0.01"
                  defaultValue={editItem?.metalWeight || ""}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              {/* Gross Weight */}
              <div className="space-y-2">
                <label htmlFor="grossWeight" className="text-sm font-medium">Gross Weight (g)</label>
                <input 
                  id="grossWeight" 
                  name="grossWeight" 
                  type="number" 
                  step="0.01"
                  defaultValue={editItem?.grossWeight || ""}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              {/* Purity */}
              <div className="space-y-2">
                <label htmlFor="purity" className="text-sm font-medium">Purity</label>
                <select 
                  id="purity" 
                  name="purity" 
                  defaultValue={editItem?.purity || "18K"}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="24K">24K</option>
                  <option value="22K">22K</option>
                  <option value="18K">18K</option>
                  <option value="14K">14K</option>
                  <option value="10K">10K</option>
                  <option value="925 Silver">925 Silver</option>
                  <option value="950 Platinum">950 Platinum</option>
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
            
            {/* Diamond/Gemstone Details */}
            <div className="space-y-2">
              <label htmlFor="diamondDetails" className="text-sm font-medium">Diamond/Gemstone Details</label>
              <input 
                id="diamondDetails" 
                name="diamondDetails" 
                defaultValue={editItem?.diamondDetails || ""}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="E.g., 1ct Round Diamond, VS1, F Color or 2.5ct Blue Sapphire"
              />
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
                Save Jewellery Stock
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* View Stock Item Dialog */}
      <Dialog open={viewDialog} onOpenChange={setViewDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Jewellery Stock Details</DialogTitle>
            <DialogDescription>
              Detailed information about jewelry item {viewItem?.itemCode}
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
                  <h4 className="text-sm font-medium">Name</h4>
                  <p className="text-base">{viewItem.name}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium">Category</h4>
                  <p className="text-base">{viewItem.category}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Metal Type</h4>
                  <p className="text-base">{viewItem.metalType}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h4 className="text-sm font-medium">Metal Weight</h4>
                  <p className="text-base">{viewItem.metalWeight}g</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Gross Weight</h4>
                  <p className="text-base">{viewItem.grossWeight}g</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Purity</h4>
                  <p className="text-base">{viewItem.purity}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium">Diamond/Gemstone Details</h4>
                <p className="text-base">{viewItem.diamondDetails || 'No diamond/gemstone details'}</p>
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