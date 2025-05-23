import React, { useState } from "react";
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
const memoGiveData = [
  {
    id: 1,
    date: "2025-05-10T10:30:00Z",
    memoNumber: "MG-10001",
    clientName: "Raj Jewellers",
    clientContact: "+91 98765 43210",
    items: [
      {
        id: 101,
        itemCode: "JS-10001",
        name: "Diamond Engagement Ring",
        type: "Ring",
        grossWeight: 5.2,
        netWeight: 4.3,
        purity: "18K",
        rate: 4250,
        amount: 18275,
        status: "Out"
      }
    ],
    expectedReturnDate: "2025-05-20T10:30:00Z",
    totalValue: 18275,
    notes: "Client requested for customer approval",
    returnStatus: "Pending",
    updatedBy: 1,
    lastUpdated: "2025-05-10T10:30:00Z"
  },
  {
    id: 2,
    date: "2025-05-12T14:45:00Z",
    memoNumber: "MG-10002",
    clientName: "Royal Jewels",
    clientContact: "+91 87654 32109",
    items: [
      {
        id: 102,
        itemCode: "JS-10007",
        name: "Diamond Tennis Bracelet",
        type: "Bracelet",
        grossWeight: 12.6,
        netWeight: 11.2,
        purity: "14K",
        rate: 3850,
        amount: 43120,
        status: "Out"
      },
      {
        id: 103,
        itemCode: "JS-10012",
        name: "Pearl Necklace",
        type: "Necklace",
        grossWeight: 22.5,
        netWeight: 21.8,
        purity: "22K",
        rate: 3950,
        amount: 86110,
        status: "Out"
      }
    ],
    expectedReturnDate: "2025-05-22T14:45:00Z",
    totalValue: 129230,
    notes: "For exhibition purposes",
    returnStatus: "Pending",
    updatedBy: 1,
    lastUpdated: "2025-05-12T14:45:00Z"
  },
  {
    id: 3,
    date: "2025-05-15T09:20:00Z",
    memoNumber: "MG-10003",
    clientName: "Wedding Jewellers",
    clientContact: "+91 76543 21098",
    items: [
      {
        id: 104,
        itemCode: "JS-10023",
        name: "Bridal Jewelry Set",
        type: "Set",
        grossWeight: 45.8,
        netWeight: 42.3,
        purity: "22K",
        rate: 4350,
        amount: 184005,
        status: "Out"
      }
    ],
    expectedReturnDate: "2025-06-05T09:20:00Z",
    totalValue: 184005,
    notes: "For bridal photoshoot",
    returnStatus: "Pending",
    updatedBy: 1,
    lastUpdated: "2025-05-15T09:20:00Z"
  },
  {
    id: 4,
    date: "2025-05-08T11:10:00Z",
    memoNumber: "MG-10004",
    clientName: "Golden Retailers",
    clientContact: "+91 65432 10987",
    items: [
      {
        id: 105,
        itemCode: "JS-10031",
        name: "Diamond Stud Earrings",
        type: "Earrings",
        grossWeight: 3.2,
        netWeight: 2.8,
        purity: "18K",
        rate: 4150,
        amount: 11620,
        status: "Returned"
      }
    ],
    expectedReturnDate: "2025-05-13T11:10:00Z",
    totalValue: 11620,
    notes: "Client's customer didn't like the design",
    returnStatus: "Completed",
    returnDate: "2025-05-12T16:30:00Z",
    updatedBy: 1,
    lastUpdated: "2025-05-12T16:30:00Z"
  }
];

export default function MemoGive() {
  const { toast } = useToast();
  const [memoData, setMemoData] = useState(memoGiveData);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMemo, setEditMemo] = useState<any>(null);
  const [viewDialog, setViewDialog] = useState(false);
  const [viewMemo, setViewMemo] = useState<any>(null);
  const [returnDialog, setReturnDialog] = useState(false);
  const [returnMemo, setReturnMemo] = useState<any>(null);
  
  // Calculate total value of all memo items that are still out
  const totalOutstandingValue = memoData
    .filter(memo => memo.returnStatus === "Pending")
    .reduce((sum, memo) => sum + memo.totalValue, 0);
  
  // Count total active memos
  const totalActiveMemos = memoData.filter(memo => memo.returnStatus === "Pending").length;
  
  // Calculate oldest outstanding memo days
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
    setMemoData(memoData.filter(m => m.id !== memo.id));
    toast({
      title: "Memo Deleted",
      description: `Memo ${memo.memoNumber} has been deleted.`,
      variant: "default",
    });
  };
  
  // Handle return memo items
  const handleReturnMemo = (memo: any) => {
    setReturnMemo(memo);
    setReturnDialog(true);
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
  
  // Handle form submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    try {
      // Get basic memo details
      const date = new Date();
      const clientName = formData.get('clientName') as string || "";
      const clientContact = formData.get('clientContact') as string || "";
      const expectedReturnDate = formData.get('expectedReturnDate') as string || "";
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
        status: "Out"
      };
      
      if (editMemo) {
        // Update existing memo
        const updatedMemo = {
          ...editMemo,
          clientName,
          clientContact,
          expectedReturnDate: new Date(expectedReturnDate).toISOString(),
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
          memoNumber: `MG-${10000 + memoData.length + 1}`,
          clientName,
          clientContact,
          items: [item],
          expectedReturnDate: new Date(expectedReturnDate).toISOString(),
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
            .status-out { background-color: #FFF8E1; color: #FF8F00; }
            .status-returned { background-color: #E8F5E9; color: #388E3C; }
            .footer { margin-top: 50px; }
            .signatures { display: flex; justify-content: space-between; margin-top: 70px; }
            .signature-line { width: 200px; border-top: 1px solid #000; padding-top: 5px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>MEMO INVOICE</h1>
            <p>${memo.memoNumber}</p>
          </div>
          
          <div class="memo-details">
            <div class="section-title">Memo Details</div>
            <div class="info-row">
              <div class="info-label">Date:</div>
              <div class="info-value">${format(new Date(memo.date), 'dd/MM/yyyy')}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Client Name:</div>
              <div class="info-value">${memo.clientName}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Contact:</div>
              <div class="info-value">${memo.clientContact}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Expected Return:</div>
              <div class="info-value">${format(new Date(memo.expectedReturnDate), 'dd/MM/yyyy')}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Return Status:</div>
              <div class="info-value">${memo.returnStatus}</div>
            </div>
            ${memo.returnStatus === "Completed" ? `
              <div class="info-row">
                <div class="info-label">Return Date:</div>
                <div class="info-value">${format(new Date(memo.returnDate), 'dd/MM/yyyy')}</div>
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
              1. The above items are issued on memo and remain the property of our company.<br>
              2. The receiver is responsible for the safety and security of all items.<br>
              3. All items must be returned in their original condition by the expected return date.<br>
              4. Any loss or damage will be charged at the full value stated above.
            </p>
            
            <div class="signatures">
              <div class="signature-line">Authorized By</div>
              <div class="signature-line">Received By</div>
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
    <MainLayout title="Memo Give Management">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Memo Give Management</h1>
          <p className="text-neutral-500">Track jewelry items issued on memo to clients and retailers</p>
        </div>
        <Button onClick={handleAddMemo} className="bg-primary text-white hover:bg-primary/90">
          New Memo
        </Button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold text-neutral-600">Outstanding Value</h3>
            <p className="text-3xl font-bold text-primary mt-2">₹{formatCurrency(totalOutstandingValue)}</p>
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
                <StockImage type="jewelry-pieces" className="h-full rounded-l-lg md:rounded-r-none rounded-r-lg" />
              </div>
              <div className="md:col-span-2 p-6">
                <h3 className="text-lg font-semibold text-neutral-800">Track Outgoing Jewelry</h3>
                <p className="text-neutral-600 mt-2 mb-4">
                  Keep track of jewelry pieces issued on memo to clients, retailers, or for exhibitions. 
                  Manage return dates, values, and maintain a clear record of all outstanding items.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border border-neutral-200 rounded-md p-3">
                    <p className="text-xs text-neutral-500">Process</p>
                    <p className="font-medium">Issue items on memo → Track status → Process returns</p>
                  </div>
                  <div className="border border-neutral-200 rounded-md p-3">
                    <p className="text-xs text-neutral-500">Benefits</p>
                    <p className="font-medium">Clear records, efficient tracking, prevent losses</p>
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
                  <TableHead>Client</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead>Return Status</TableHead>
                  <TableHead>Expected Return</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {memoData.map((memo) => (
                  <TableRow key={memo.id}>
                    <TableCell className="font-medium">{memo.memoNumber}</TableCell>
                    <TableCell>{format(new Date(memo.date), 'dd/MM/yyyy')}</TableCell>
                    <TableCell>{memo.clientName}</TableCell>
                    <TableCell>{memo.items.length}</TableCell>
                    <TableCell className="text-right">₹{memo.totalValue.toLocaleString()}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                        memo.returnStatus === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {memo.returnStatus}
                      </span>
                    </TableCell>
                    <TableCell>{format(new Date(memo.expectedReturnDate), 'dd/MM/yyyy')}</TableCell>
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
                          <Button 
                            variant="default" 
                            size="sm" 
                            onClick={() => handleReturnMemo(memo)}
                          >
                            Return
                          </Button>
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
              {/* Client Name */}
              <div className="space-y-2">
                <label htmlFor="clientName" className="text-sm font-medium">Client Name *</label>
                <input 
                  id="clientName" 
                  name="clientName"
                  required
                  defaultValue={editMemo?.clientName || ""}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              {/* Client Contact */}
              <div className="space-y-2">
                <label htmlFor="clientContact" className="text-sm font-medium">Client Contact</label>
                <input 
                  id="clientContact" 
                  name="clientContact"
                  defaultValue={editMemo?.clientContact || ""}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              {/* Expected Return Date */}
              <div className="space-y-2">
                <label htmlFor="expectedReturnDate" className="text-sm font-medium">Expected Return Date *</label>
                <input 
                  id="expectedReturnDate" 
                  name="expectedReturnDate" 
                  type="date"
                  required
                  defaultValue={editMemo 
                    ? format(new Date(editMemo.expectedReturnDate), 'yyyy-MM-dd') 
                    : format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')}
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
                    defaultValue={editMemo?.items[0]?.type || "Ring"}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="Ring">Ring</option>
                    <option value="Necklace">Necklace</option>
                    <option value="Bracelet">Bracelet</option>
                    <option value="Earrings">Earrings</option>
                    <option value="Pendant">Pendant</option>
                    <option value="Set">Set</option>
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
                  <label htmlFor="purity" className="text-sm font-medium">Purity *</label>
                  <select 
                    id="purity" 
                    name="purity" 
                    required
                    defaultValue={editMemo?.items[0]?.purity || "18K"}
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
                placeholder="Purpose of memo, special conditions, etc."
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
                  <h4 className="text-sm font-medium">Client Name</h4>
                  <p className="text-base">{viewMemo.clientName}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Client Contact</h4>
                  <p className="text-base">{viewMemo.clientContact || 'N/A'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium">Expected Return Date</h4>
                  <p className="text-base">{format(new Date(viewMemo.expectedReturnDate), 'dd/MM/yyyy')}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Return Status</h4>
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                    viewMemo.returnStatus === 'Pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {viewMemo.returnStatus}
                  </span>
                  {viewMemo.returnStatus === "Completed" && (
                    <p className="text-sm mt-1">
                      Returned on: {format(new Date(viewMemo.returnDate), 'dd/MM/yyyy')}
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
                              item.status === 'Out'
                                ? 'bg-yellow-100 text-yellow-800'
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
                  <Button variant="default" onClick={() => {
                    setViewDialog(false);
                    handleReturnMemo(viewMemo);
                  }}>
                    Process Return
                  </Button>
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
              Mark memo {returnMemo?.memoNumber} as returned.
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
                    <p className="text-xs text-neutral-500">Client</p>
                    <p className="text-sm font-medium">{returnMemo.clientName}</p>
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
    </MainLayout>
  );
}