import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

// Sample data for demonstration
const memoTakeData = [
  {
    id: 1,
    date: "2025-05-08T10:30:00Z",
    memoNumber: "MT-10001",
    vendorName: "Luxury Diamonds Co.",
    vendorContact: "+91 98765 43210",
    items: [
      {
        id: 101,
        itemCode: "VD-10001",
        name: "Diamond Solitaire",
        type: "Diamond",
        grossWeight: 2.1,
        netWeight: 1.8,
        purity: "VS1-F",
        rate: 65000,
        amount: 117000,
        status: "Received"
      }
    ],
    returnByDate: "2025-05-18T10:30:00Z",
    totalValue: 117000,
    notes: "For examination and potential purchase",
    returnStatus: "Pending",
    updatedBy: 1,
    lastUpdated: "2025-05-08T10:30:00Z"
  },
  {
    id: 2,
    date: "2025-05-09T14:15:00Z",
    memoNumber: "MT-10002",
    vendorName: "Gems International",
    vendorContact: "+91 87654 32109",
    items: [
      {
        id: 102,
        itemCode: "GI-2254",
        name: "Ruby Collection",
        type: "Gemstone",
        grossWeight: 12.5,
        netWeight: 12.5,
        purity: "A Grade",
        rate: 12000,
        amount: 150000,
        status: "Received"
      },
      {
        id: 103,
        itemCode: "GI-2267",
        name: "Emerald Selection",
        type: "Gemstone",
        grossWeight: 8.3,
        netWeight: 8.3,
        purity: "AA Grade",
        rate: 15000,
        amount: 124500,
        status: "Received"
      }
    ],
    returnByDate: "2025-05-23T14:15:00Z",
    totalValue: 274500,
    notes: "For client selection and potential showcase",
    returnStatus: "Pending",
    updatedBy: 1,
    lastUpdated: "2025-05-09T14:15:00Z"
  },
  {
    id: 3,
    date: "2025-05-05T09:45:00Z",
    memoNumber: "MT-10003",
    vendorName: "Elite Gold Suppliers",
    vendorContact: "+91 76543 21098",
    items: [
      {
        id: 104,
        itemCode: "EG-563",
        name: "Gold Chain Samples",
        type: "Gold",
        grossWeight: 42.8,
        netWeight: 42.8,
        purity: "22K",
        rate: 5800,
        amount: 248240,
        status: "Returned"
      }
    ],
    returnByDate: "2025-05-15T09:45:00Z",
    totalValue: 248240,
    notes: "For pattern selection",
    returnStatus: "Completed",
    returnDate: "2025-05-14T16:30:00Z",
    updatedBy: 1,
    lastUpdated: "2025-05-14T16:30:00Z"
  },
  {
    id: 4,
    date: "2025-05-03T11:20:00Z",
    memoNumber: "MT-10004",
    vendorName: "Precious Metals Inc.",
    vendorContact: "+91 65432 10987",
    items: [
      {
        id: 105,
        itemCode: "PM-789",
        name: "Platinum Ring Settings",
        type: "Platinum",
        grossWeight: 15.6,
        netWeight: 15.6,
        purity: "95%",
        rate: 7200,
        amount: 112320,
        status: "Purchased"
      }
    ],
    returnByDate: "2025-05-10T11:20:00Z",
    totalValue: 112320,
    notes: "For client approval, decided to purchase",
    returnStatus: "Completed",
    purchaseDecision: "Purchased",
    purchaseDate: "2025-05-08T14:20:00Z",
    updatedBy: 1,
    lastUpdated: "2025-05-08T14:20:00Z"
  }
];

export default function MemoTake() {
  const { toast } = useToast();
  // Load data from localStorage if available, otherwise use sample data
  const [memoData, setMemoData] = useState(() => {
    const savedData = localStorage.getItem('memoTakeData');
    return savedData ? JSON.parse(savedData) : memoTakeData;
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [editMemo, setEditMemo] = useState<any>(null);
  const [viewDialog, setViewDialog] = useState(false);
  const [viewMemo, setViewMemo] = useState<any>(null);
  const [returnDialog, setReturnDialog] = useState(false);
  const [returnMemo, setReturnMemo] = useState<any>(null);
  const [purchaseDialog, setPurchaseDialog] = useState(false);
  const [purchaseMemo, setPurchaseMemo] = useState<any>(null);
  
  // Save to localStorage whenever memoData changes
  useEffect(() => {
    localStorage.setItem('memoTakeData', JSON.stringify(memoData));
  }, [memoData]);
  
  // Calculate total value of all memo items that are still pending
  const totalPendingValue = memoData
    .filter(memo => memo.returnStatus === "Pending")
    .reduce((sum, memo) => sum + memo.totalValue, 0);
  
  // Count total active memos
  const totalActiveMemos = memoData.filter(memo => memo.returnStatus === "Pending").length;
  
  // Calculate oldest pending memo days
  const oldestMemoDate = memoData
    .filter(memo => memo.returnStatus === "Pending")
    .reduce((oldest, memo) => {
      const memoDate = new Date(memo.date);
      return memoDate < oldest ? memoDate : oldest;
    }, new Date());
  
  const daysSinceOldestMemo = Math.ceil((new Date().getTime() - oldestMemoDate.getTime()) / (1000 * 3600 * 24));
  
  // Handle view memo
  const handleViewMemo = (memo: any) => {
    setViewMemo(memo);
    setViewDialog(true);
  };
  
  // Handle edit memo
  const handleEditMemo = (memo: any) => {
    setEditMemo(memo);
    setOpenDialog(true);
  };
  
  // Handle add new memo
  const handleAddMemo = () => {
    setEditMemo(null);
    setOpenDialog(true);
  };
  
  // Handle delete memo
  const handleDeleteMemo = (memo: any) => {
    if (confirm(`Are you sure you want to delete memo ${memo.memoNumber}?`)) {
      setMemoData(memoData.filter(m => m.id !== memo.id));
      toast({
        title: "Memo Deleted",
        description: `Memo ${memo.memoNumber} has been deleted.`,
        variant: "default",
      });
    }
  };
  
  // Handle return memo items
  const handleReturnMemo = (memo: any) => {
    setReturnMemo(memo);
    setReturnDialog(true);
  };
  
  // Handle purchase memo items
  const handlePurchaseMemo = (memo: any) => {
    setPurchaseMemo(memo);
    setPurchaseDialog(true);
  };
  
  // Process return of memo items
  const handleProcessReturn = (formData: FormData) => {
    const now = new Date();
    const updatedMemo = {
      ...returnMemo,
      returnStatus: "Completed",
      returnDate: now.toISOString(),
      lastUpdated: now.toISOString(),
      items: returnMemo.items.map((item: any) => ({
        ...item,
        status: "Returned"
      })),
      notes: formData.get('returnNotes') 
        ? `${returnMemo.notes}\nReturn Notes: ${formData.get('returnNotes')}`
        : returnMemo.notes
    };
    
    setMemoData(memoData.map(memo => 
      memo.id === returnMemo.id ? updatedMemo : memo
    ));
    
    setReturnDialog(false);
    setReturnMemo(null);
    
    toast({
      title: "Memo Returned",
      description: `Memo ${updatedMemo.memoNumber} has been marked as returned.`,
      variant: "default",
    });
  };
  
  // Process purchase of memo items
  const handleProcessPurchase = (formData: FormData) => {
    const now = new Date();
    const purchasePrice = formData.get('purchasePrice') 
      ? parseFloat(formData.get('purchasePrice') as string)
      : purchaseMemo.totalValue;
    
    const updatedMemo = {
      ...purchaseMemo,
      returnStatus: "Completed",
      purchaseDecision: "Purchased",
      purchaseDate: now.toISOString(),
      purchasePrice: purchasePrice,
      lastUpdated: now.toISOString(),
      items: purchaseMemo.items.map((item: any) => ({
        ...item,
        status: "Purchased"
      })),
      notes: formData.get('purchaseNotes') 
        ? `${purchaseMemo.notes}\nPurchase Notes: ${formData.get('purchaseNotes')}`
        : purchaseMemo.notes
    };
    
    setMemoData(memoData.map(memo => 
      memo.id === purchaseMemo.id ? updatedMemo : memo
    ));
    
    setPurchaseDialog(false);
    setPurchaseMemo(null);
    
    toast({
      title: "Memo Purchased",
      description: `Memo ${updatedMemo.memoNumber} has been marked as purchased.`,
      variant: "default",
    });
  };
  
  // Handle form submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    try {
      // Get basic memo details
      const date = new Date();
      const vendorName = formData.get('vendorName') as string || "";
      const vendorContact = formData.get('vendorContact') as string || "";
      const returnByDate = formData.get('returnByDate') as string || "";
      const notes = formData.get('notes') as string || "";
      
      // Process item data
      const itemCode = formData.get('itemCode') as string || "";
      const itemName = formData.get('itemName') as string || "";
      const itemType = formData.get('itemType') as string || "";
      const grossWeight = parseFloat(formData.get('grossWeight') as string) || 0;
      const netWeight = parseFloat(formData.get('netWeight') as string) || 0;
      const purity = formData.get('purity') as string || "";
      const rate = parseFloat(formData.get('rate') as string) || 0;
      
      // Calculate amount
      const amount = netWeight * rate;
      
      // Create item object
      const item = {
        id: Date.now(), // Generate unique ID
        itemCode,
        name: itemName,
        type: itemType,
        grossWeight,
        netWeight,
        purity,
        rate,
        amount,
        status: "Received"
      };
      
      if (editMemo) {
        // Update existing memo
        const updatedMemo = {
          ...editMemo,
          vendorName,
          vendorContact,
          returnByDate: new Date(returnByDate).toISOString(),
          notes,
          lastUpdated: date.toISOString(),
          // If we're editing, just replace the first item for simplicity
          // In a real app, you'd likely have a more complex item management system
          items: [item],
          totalValue: amount
        };
        
        setMemoData(memoData.map(memo => 
          memo.id === editMemo.id ? updatedMemo : memo
        ));
        
        toast({
          title: "Memo Updated",
          description: `Memo ${updatedMemo.memoNumber} has been updated.`,
          variant: "default",
        });
      } else {
        // Create new memo
        const newMemo = {
          id: memoData.length + 1,
          date: date.toISOString(),
          memoNumber: `MT-${10000 + memoData.length + 1}`,
          vendorName,
          vendorContact,
          items: [item],
          returnByDate: new Date(returnByDate).toISOString(),
          totalValue: amount,
          notes,
          returnStatus: "Pending",
          updatedBy: 1, // Current user ID
          lastUpdated: date.toISOString()
        };
        
        setMemoData([...memoData, newMemo]);
        
        toast({
          title: "Memo Created",
          description: `Memo ${newMemo.memoNumber} has been created.`,
          variant: "default",
        });
      }
      
      setOpenDialog(false);
      setEditMemo(null);
    } catch (error) {
      console.error("Error processing form:", error);
      toast({
        title: "Error",
        description: "There was a problem saving the memo. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Print memo details
  const handlePrintMemo = (memo: any) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast({
        title: "Error",
        description: "Please allow pop-ups to print memo details.",
        variant: "destructive",
      });
      return;
    }
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Memo Details - ${memo.memoNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            h1 { color: #333; margin-bottom: 5px; }
            .memo-details { border: 1px solid #ddd; padding: 15px; margin-bottom: 20px; }
            .section-title { font-size: 16px; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
            .info-row { display: flex; margin-bottom: 8px; }
            .info-label { font-weight: bold; width: 150px; }
            .info-value { flex: 1; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .status { display: inline-block; padding: 3px 8px; border-radius: 3px; font-size: 12px; }
            .status-received { background-color: #FFF8E1; color: #FF8F00; }
            .status-returned { background-color: #E8F5E9; color: #388E3C; }
            .status-purchased { background-color: #E3F2FD; color: #1976D2; }
            .footer { margin-top: 50px; }
            .signatures { display: flex; justify-content: space-between; margin-top: 70px; }
            .signature-line { width: 200px; border-top: 1px solid #000; padding-top: 5px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>MEMO RECEIPT</h1>
            <p>${memo.memoNumber}</p>
          </div>
          
          <div class="memo-details">
            <div class="section-title">Memo Details</div>
            <div class="info-row">
              <div class="info-label">Date:</div>
              <div class="info-value">${format(new Date(memo.date), 'dd/MM/yyyy')}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Vendor Name:</div>
              <div class="info-value">${memo.vendorName}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Contact:</div>
              <div class="info-value">${memo.vendorContact}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Return By:</div>
              <div class="info-value">${format(new Date(memo.returnByDate), 'dd/MM/yyyy')}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Status:</div>
              <div class="info-value">${memo.returnStatus}</div>
            </div>
            ${memo.returnStatus === "Completed" && memo.returnDate ? `
              <div class="info-row">
                <div class="info-label">Return Date:</div>
                <div class="info-value">${format(new Date(memo.returnDate), 'dd/MM/yyyy')}</div>
              </div>
            ` : ''}
            ${memo.purchaseDecision === "Purchased" ? `
              <div class="info-row">
                <div class="info-label">Purchase Date:</div>
                <div class="info-value">${format(new Date(memo.purchaseDate), 'dd/MM/yyyy')}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Purchase Price:</div>
                <div class="info-value">₹${memo.purchasePrice?.toLocaleString() || memo.totalValue.toLocaleString()}</div>
              </div>
            ` : ''}
          </div>
          
          <div class="section-title">Items</div>
          <table>
            <thead>
              <tr>
                <th>Item Code</th>
                <th>Description</th>
                <th>Type</th>
                <th>Gross Wt (g)</th>
                <th>Net Wt (g)</th>
                <th>Purity</th>
                <th>Rate</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${memo.items.map((item: any) => `
                <tr>
                  <td>${item.itemCode}</td>
                  <td>${item.name}</td>
                  <td>${item.type}</td>
                  <td>${item.grossWeight.toFixed(2)}</td>
                  <td>${item.netWeight.toFixed(2)}</td>
                  <td>${item.purity}</td>
                  <td>₹${item.rate.toLocaleString()}</td>
                  <td>₹${item.amount.toLocaleString()}</td>
                  <td><span class="status status-${item.status.toLowerCase()}">${item.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="7" style="text-align: right; font-weight: bold;">Total Value:</td>
                <td colspan="2" style="font-weight: bold;">₹${memo.totalValue.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
          
          <div>
            <div class="section-title">Notes</div>
            <p>${memo.notes || 'No notes'}</p>
          </div>
          
          <div class="footer">
            <p>
              <strong>Terms & Conditions:</strong><br>
              1. The above items are received on memo and must be returned by the specified date unless purchased.<br>
              2. We are responsible for the safety and security of all items while in our possession.<br>
              3. All items must be returned in their original condition by the expected return date.<br>
              4. Any loss or damage will be paid at the full value stated above.
            </p>
            
            <div class="signatures">
              <div class="signature-line">Received By</div>
              <div class="signature-line">Authorized Signature</div>
            </div>
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
    <MainLayout title="Memo Take Management">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Memo Take Management</h1>
          <p className="text-neutral-500">Track items received on memo from vendors and suppliers</p>
        </div>
        <Button onClick={handleAddMemo} className="bg-primary text-white hover:bg-primary/90">
          New Memo
        </Button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold text-neutral-600">Item Value On Memo</h3>
            <p className="text-3xl font-bold text-primary mt-2">₹{formatCurrency(totalPendingValue)}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold text-neutral-600">Active Memos</h3>
            <p className="text-3xl font-bold text-primary mt-2">{totalActiveMemos}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold text-neutral-600">Oldest Memo Age</h3>
            <p className="text-3xl font-bold text-primary mt-2">{daysSinceOldestMemo} days</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Featured Content */}
      <div className="mb-8">
        <Card>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="md:col-span-1">
                <StockImage type="gemstone-collection" className="h-full rounded-l-lg md:rounded-r-none rounded-r-lg" />
              </div>
              <div className="md:col-span-2 p-6">
                <h3 className="text-lg font-semibold text-neutral-800">Track Incoming Memo Items</h3>
                <p className="text-neutral-600 mt-2 mb-4">
                  Keep track of items received on memo from vendors and suppliers. 
                  Manage return dates, values, and decide whether to purchase or return items.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border border-neutral-200 rounded-md p-3">
                    <p className="text-xs text-neutral-500">Process</p>
                    <p className="font-medium">Receive on memo → Evaluate → Purchase or Return</p>
                  </div>
                  <div className="border border-neutral-200 rounded-md p-3">
                    <p className="text-xs text-neutral-500">Benefits</p>
                    <p className="font-medium">Try before buying, streamlined decision process</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Memo Data Table */}
      <Card>
        <CardContent className="p-6">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Memo #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Return By</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {memoData.map((memo) => (
                  <TableRow key={memo.id}>
                    <TableCell className="font-medium">{memo.memoNumber}</TableCell>
                    <TableCell>{format(new Date(memo.date), 'dd/MM/yyyy')}</TableCell>
                    <TableCell>{memo.vendorName}</TableCell>
                    <TableCell>{memo.items.length}</TableCell>
                    <TableCell className="text-right">₹{memo.totalValue.toLocaleString()}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                        memo.returnStatus === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : memo.purchaseDecision === 'Purchased'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {memo.purchaseDecision === 'Purchased' ? 'Purchased' : memo.returnStatus}
                      </span>
                    </TableCell>
                    <TableCell>{format(new Date(memo.returnByDate), 'dd/MM/yyyy')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleViewMemo(memo)}
                        >
                          View
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditMemo(memo)}
                          disabled={memo.returnStatus === "Completed"}
                        >
                          Edit
                        </Button>
                        {memo.returnStatus === "Pending" && (
                          <>
                            <Button 
                              variant="default" 
                              size="sm" 
                              onClick={() => handlePurchaseMemo(memo)}
                            >
                              Purchase
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleReturnMemo(memo)}
                            >
                              Return
                            </Button>
                          </>
                        )}
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDeleteMemo(memo)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {memoData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6 text-neutral-500">
                      No memo records found. Create a new memo to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Add/Edit Memo Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editMemo ? 'Edit Memo' : 'Create New Memo'}</DialogTitle>
            <DialogDescription>
              {editMemo 
                ? 'Update the details of this memo.' 
                : 'Enter the details for a new memo.'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Vendor Name */}
              <div className="space-y-2">
                <label htmlFor="vendorName" className="text-sm font-medium">Vendor Name *</label>
                <input 
                  id="vendorName" 
                  name="vendorName"
                  required
                  defaultValue={editMemo?.vendorName || ""}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              {/* Vendor Contact */}
              <div className="space-y-2">
                <label htmlFor="vendorContact" className="text-sm font-medium">Vendor Contact</label>
                <input 
                  id="vendorContact" 
                  name="vendorContact"
                  defaultValue={editMemo?.vendorContact || ""}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              {/* Return By Date */}
              <div className="space-y-2">
                <label htmlFor="returnByDate" className="text-sm font-medium">Return By Date *</label>
                <input 
                  id="returnByDate" 
                  name="returnByDate" 
                  type="date"
                  required
                  defaultValue={editMemo 
                    ? format(new Date(editMemo.returnByDate), 'yyyy-MM-dd') 
                    : format(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            
            <div className="border-t border-gray-200 my-4 pt-4">
              <h3 className="font-medium text-lg mb-2">Item Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Item Code */}
                <div className="space-y-2">
                  <label htmlFor="itemCode" className="text-sm font-medium">Item Code *</label>
                  <input 
                    id="itemCode" 
                    name="itemCode"
                    required
                    defaultValue={editMemo?.items[0]?.itemCode || ""}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                {/* Item Name */}
                <div className="space-y-2">
                  <label htmlFor="itemName" className="text-sm font-medium">Item Name *</label>
                  <input 
                    id="itemName" 
                    name="itemName"
                    required
                    defaultValue={editMemo?.items[0]?.name || ""}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                {/* Item Type */}
                <div className="space-y-2">
                  <label htmlFor="itemType" className="text-sm font-medium">Item Type *</label>
                  <select 
                    id="itemType" 
                    name="itemType" 
                    required
                    defaultValue={editMemo?.items[0]?.type || "Diamond"}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="Diamond">Diamond</option>
                    <option value="Gemstone">Gemstone</option>
                    <option value="Gold">Gold</option>
                    <option value="Platinum">Platinum</option>
                    <option value="Silver">Silver</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                {/* Gross Weight */}
                <div className="space-y-2">
                  <label htmlFor="grossWeight" className="text-sm font-medium">Gross Weight (g) *</label>
                  <input 
                    id="grossWeight" 
                    name="grossWeight" 
                    type="number" 
                    step="0.01"
                    required
                    defaultValue={editMemo?.items[0]?.grossWeight || ""}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                {/* Net Weight */}
                <div className="space-y-2">
                  <label htmlFor="netWeight" className="text-sm font-medium">Net Weight (g) *</label>
                  <input 
                    id="netWeight" 
                    name="netWeight" 
                    type="number" 
                    step="0.01"
                    required
                    defaultValue={editMemo?.items[0]?.netWeight || ""}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                {/* Purity */}
                <div className="space-y-2">
                  <label htmlFor="purity" className="text-sm font-medium">Purity/Quality *</label>
                  <input 
                    id="purity" 
                    name="purity"
                    required
                    defaultValue={editMemo?.items[0]?.purity || ""}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="E.g., VS1-F, 22K, AAA Grade"
                  />
                </div>
                
                {/* Rate */}
                <div className="space-y-2">
                  <label htmlFor="rate" className="text-sm font-medium">Rate (₹) *</label>
                  <input 
                    id="rate" 
                    name="rate" 
                    type="number" 
                    step="0.01"
                    required
                    defaultValue={editMemo?.items[0]?.rate || ""}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <p className="text-xs text-neutral-500 mt-2">
                Note: Amount will be calculated automatically based on Net Weight and Rate.
              </p>
            </div>
            
            {/* Notes */}
            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-medium">Notes</label>
              <textarea 
                id="notes" 
                name="notes" 
                defaultValue={editMemo?.notes || ""}
                className="w-full p-2 border border-gray-300 rounded-md h-20"
                placeholder="Purpose of memo, special evaluation criteria, etc."
              ></textarea>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" type="button" onClick={() => setOpenDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editMemo ? 'Update Memo' : 'Create Memo'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* View Memo Dialog */}
      <Dialog open={viewDialog} onOpenChange={setViewDialog}>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle>Memo Details</DialogTitle>
            <DialogDescription>
              Detailed information for Memo {viewMemo?.memoNumber}
            </DialogDescription>
          </DialogHeader>
          
          {viewMemo && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium">Memo Number</h4>
                  <p className="text-base">{viewMemo.memoNumber}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Date</h4>
                  <p className="text-base">{format(new Date(viewMemo.date), 'dd/MM/yyyy')}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium">Vendor Name</h4>
                  <p className="text-base">{viewMemo.vendorName}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Vendor Contact</h4>
                  <p className="text-base">{viewMemo.vendorContact || 'N/A'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium">Return By Date</h4>
                  <p className="text-base">{format(new Date(viewMemo.returnByDate), 'dd/MM/yyyy')}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Status</h4>
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                    viewMemo.returnStatus === 'Pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : viewMemo.purchaseDecision === 'Purchased'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {viewMemo.purchaseDecision === 'Purchased' ? 'Purchased' : viewMemo.returnStatus}
                  </span>
                  {viewMemo.returnStatus === "Completed" && viewMemo.returnDate && !viewMemo.purchaseDecision && (
                    <p className="text-sm mt-1">
                      Returned on: {format(new Date(viewMemo.returnDate), 'dd/MM/yyyy')}
                    </p>
                  )}
                  {viewMemo.purchaseDecision === "Purchased" && (
                    <p className="text-sm mt-1">
                      Purchased on: {format(new Date(viewMemo.purchaseDate), 'dd/MM/yyyy')}
                    </p>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Items</h4>
                <div className="rounded-md border overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Item Code</th>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Weight</th>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {viewMemo.items.map((item: any) => (
                        <tr key={item.id}>
                          <td className="px-3 py-2 whitespace-nowrap text-sm">{item.itemCode}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm">{item.name}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm">{item.type}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm">{item.grossWeight}g / {item.netWeight}g ({item.purity})</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm">₹{item.amount.toLocaleString()}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm">
                            <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                              item.status === 'Received'
                                ? 'bg-yellow-100 text-yellow-800'
                                : item.status === 'Purchased'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan={4} className="px-3 py-2 text-sm font-medium text-right">Total Value:</td>
                        <td colSpan={2} className="px-3 py-2 text-sm font-medium">₹{viewMemo.totalValue.toLocaleString()}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium">Notes</h4>
                <p className="text-base whitespace-pre-line">{viewMemo.notes || 'No notes available'}</p>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => handlePrintMemo(viewMemo)}>
                  Print Memo
                </Button>
                {viewMemo.returnStatus === "Pending" && (
                  <>
                    <Button variant="default" onClick={() => {
                      setViewDialog(false);
                      handlePurchaseMemo(viewMemo);
                    }}>
                      Process Purchase
                    </Button>
                    <Button variant="outline" onClick={() => {
                      setViewDialog(false);
                      handleReturnMemo(viewMemo);
                    }}>
                      Process Return
                    </Button>
                  </>
                )}
                <Button variant="default" onClick={() => setViewDialog(false)}>
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Return Memo Dialog */}
      <Dialog open={returnDialog} onOpenChange={setReturnDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Process Memo Return</DialogTitle>
            <DialogDescription>
              Mark memo {returnMemo?.memoNumber} as returned to the vendor.
            </DialogDescription>
          </DialogHeader>
          
          {returnMemo && (
            <form onSubmit={(e) => {
              e.preventDefault();
              handleProcessReturn(new FormData(e.target as HTMLFormElement));
            }} className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Return Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-neutral-500">Vendor</p>
                    <p className="text-sm font-medium">{returnMemo.vendorName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Total Value</p>
                    <p className="text-sm font-medium">₹{returnMemo.totalValue.toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-xs text-neutral-500">Items</p>
                  <ul className="list-disc list-inside text-sm">
                    {returnMemo.items.map((item: any) => (
                      <li key={item.id}>{item.name} ({item.itemCode})</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="returnNotes" className="text-sm font-medium">Return Notes</label>
                <textarea 
                  id="returnNotes" 
                  name="returnNotes" 
                  className="w-full p-2 border border-gray-300 rounded-md h-20"
                  placeholder="Any notes about the returned items?"
                ></textarea>
              </div>
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setReturnDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Confirm Return
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Purchase Memo Dialog */}
      <Dialog open={purchaseDialog} onOpenChange={setPurchaseDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Process Memo Purchase</DialogTitle>
            <DialogDescription>
              Mark memo {purchaseMemo?.memoNumber} as purchased and add to inventory.
            </DialogDescription>
          </DialogHeader>
          
          {purchaseMemo && (
            <form onSubmit={(e) => {
              e.preventDefault();
              handleProcessPurchase(new FormData(e.target as HTMLFormElement));
            }} className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Purchase Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-neutral-500">Vendor</p>
                    <p className="text-sm font-medium">{purchaseMemo.vendorName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Original Value</p>
                    <p className="text-sm font-medium">₹{purchaseMemo.totalValue.toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-xs text-neutral-500">Items</p>
                  <ul className="list-disc list-inside text-sm">
                    {purchaseMemo.items.map((item: any) => (
                      <li key={item.id}>{item.name} ({item.itemCode})</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="purchasePrice" className="text-sm font-medium">Purchase Price (₹)</label>
                <input 
                  id="purchasePrice" 
                  name="purchasePrice" 
                  type="number"
                  step="0.01"
                  defaultValue={purchaseMemo.totalValue}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <p className="text-xs text-neutral-500">
                  Enter the final negotiated purchase price, if different from the original value.
                </p>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="purchaseNotes" className="text-sm font-medium">Purchase Notes</label>
                <textarea 
                  id="purchaseNotes" 
                  name="purchaseNotes" 
                  className="w-full p-2 border border-gray-300 rounded-md h-20"
                  placeholder="Payment details, negotiation notes, etc."
                ></textarea>
              </div>
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setPurchaseDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Confirm Purchase
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}