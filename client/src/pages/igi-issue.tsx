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
const igiIssueData = [
  {
    id: 1,
    date: "2025-05-15T10:30:00Z",
    issueNumber: "IGI-10001",
    items: [
      {
        id: 101,
        itemCode: "D-1001",
        name: "Diamond Solitaire",
        pcs: 1,
        grossWeight: 1.25,
        netWeight: 1.25,
        rate: 95000,
        amount: 118750,
        status: "Issued"
      }
    ],
    labName: "IGI Mumbai",
    expectedReturnDate: "2025-05-25T10:30:00Z",
    totalAmount: 118750,
    totalPieces: 1,
    notes: "For certification of diamond quality and authenticity",
    receiveStatus: "Pending",
    updatedBy: 1,
    lastUpdated: "2025-05-15T10:30:00Z"
  },
  {
    id: 2,
    date: "2025-05-12T14:45:00Z",
    issueNumber: "IGI-10002",
    items: [
      {
        id: 102,
        itemCode: "D-1034",
        name: "Diamond Ring Set",
        pcs: 5,
        grossWeight: 8.5,
        netWeight: 3.2,
        rate: 75000,
        amount: 240000,
        status: "Issued"
      }
    ],
    labName: "IGI Delhi",
    expectedReturnDate: "2025-05-26T14:45:00Z",
    totalAmount: 240000,
    totalPieces: 5,
    notes: "Certification for entire ring set",
    receiveStatus: "Pending",
    updatedBy: 1,
    lastUpdated: "2025-05-12T14:45:00Z"
  },
  {
    id: 3,
    date: "2025-05-08T09:15:00Z",
    issueNumber: "IGI-10003",
    items: [
      {
        id: 103,
        itemCode: "D-982",
        name: "Diamond Bracelet",
        pcs: 1,
        grossWeight: 18.5,
        netWeight: 4.8,
        rate: 82000,
        amount: 393600,
        status: "Issued"
      }
    ],
    labName: "IGI Mumbai",
    expectedReturnDate: "2025-05-22T09:15:00Z",
    totalAmount: 393600,
    totalPieces: 1,
    notes: "Premium certification requested",
    receiveStatus: "Pending",
    updatedBy: 1,
    lastUpdated: "2025-05-08T09:15:00Z"
  },
  {
    id: 4,
    date: "2025-05-02T11:20:00Z",
    issueNumber: "IGI-10004",
    items: [
      {
        id: 104,
        itemCode: "D-876",
        name: "Diamond Pendant",
        pcs: 1,
        grossWeight: 3.2,
        netWeight: 1.1,
        rate: 88000,
        amount: 96800,
        status: "Received"
      }
    ],
    labName: "IGI Surat",
    expectedReturnDate: "2025-05-16T11:20:00Z",
    totalAmount: 96800,
    totalPieces: 1,
    notes: "Express certification",
    receiveStatus: "Completed",
    receiveDate: "2025-05-15T14:30:00Z",
    certificateNumbers: ["IGI-124578"],
    updatedBy: 1,
    lastUpdated: "2025-05-15T14:30:00Z"
  }
];

export default function IgiIssue() {
  const { toast } = useToast();
  // Load data from localStorage if available, otherwise use sample data
  const [issueData, setIssueData] = useState(() => {
    const savedData = localStorage.getItem('igiIssueData');
    return savedData ? JSON.parse(savedData) : igiIssueData;
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [editIssue, setEditIssue] = useState<any>(null);
  const [viewDialog, setViewDialog] = useState(false);
  const [viewIssue, setViewIssue] = useState<any>(null);
  const [receiveDialog, setReceiveDialog] = useState(false);
  const [receiveIssue, setReceiveIssue] = useState<any>(null);
  
  // Save to localStorage whenever issueData changes
  useEffect(() => {
    localStorage.setItem('igiIssueData', JSON.stringify(issueData));
  }, [issueData]);
  
  // Calculate total value of all items that are still with IGI
  const totalPendingValue = issueData
    .filter(issue => issue.receiveStatus === "Pending")
    .reduce((sum, issue) => sum + issue.totalAmount, 0);
  
  // Count total active issues
  const totalActiveIssues = issueData.filter(issue => issue.receiveStatus === "Pending").length;
  
  // Calculate total pieces out for certification
  const totalPiecesOut = issueData
    .filter(issue => issue.receiveStatus === "Pending")
    .reduce((sum, issue) => sum + issue.totalPieces, 0);
  
  // Handle view issue
  const handleViewIssue = (issue: any) => {
    setViewIssue(issue);
    setViewDialog(true);
  };
  
  // Handle edit issue
  const handleEditIssue = (issue: any) => {
    setEditIssue(issue);
    setOpenDialog(true);
  };
  
  // Handle add new issue
  const handleAddIssue = () => {
    setEditIssue(null);
    setOpenDialog(true);
  };
  
  // Handle delete issue
  const handleDeleteIssue = (issue: any) => {
    if (confirm(`Are you sure you want to delete issue ${issue.issueNumber}?`)) {
      setIssueData(issueData.filter(i => i.id !== issue.id));
      toast({
        title: "Issue Deleted",
        description: `Issue ${issue.issueNumber} has been deleted.`,
        variant: "default",
      });
    }
  };
  
  // Handle receive issue items
  const handleReceiveIssue = (issue: any) => {
    setReceiveIssue(issue);
    setReceiveDialog(true);
  };
  
  // Process receive of issue items
  const handleProcessReceive = (formData: FormData) => {
    const now = new Date();
    const certificateNumbers = formData.get('certificateNumbers') as string || "";
    
    const updatedIssue = {
      ...receiveIssue,
      receiveStatus: "Completed",
      receiveDate: now.toISOString(),
      lastUpdated: now.toISOString(),
      certificateNumbers: certificateNumbers.split(',').map(num => num.trim()),
      items: receiveIssue.items.map((item: any) => ({
        ...item,
        status: "Received"
      })),
      notes: formData.get('receiveNotes') 
        ? `${receiveIssue.notes}\nReceive Notes: ${formData.get('receiveNotes')}`
        : receiveIssue.notes
    };
    
    setIssueData(issueData.map(issue => 
      issue.id === receiveIssue.id ? updatedIssue : issue
    ));
    
    setReceiveDialog(false);
    setReceiveIssue(null);
    
    toast({
      title: "Items Received",
      description: `IGI issue ${updatedIssue.issueNumber} has been marked as received.`,
      variant: "default",
    });
  };
  
  // Handle form submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    try {
      // Get basic issue details
      const date = new Date();
      const labName = formData.get('labName') as string || "";
      const expectedReturnDate = formData.get('expectedReturnDate') as string || "";
      const notes = formData.get('notes') as string || "";
      
      // Process item data
      const itemCode = formData.get('itemCode') as string || "";
      const itemName = formData.get('itemName') as string || "";
      const pcs = parseInt(formData.get('pcs') as string) || 1;
      const grossWeight = parseFloat(formData.get('grossWeight') as string) || 0;
      const netWeight = parseFloat(formData.get('netWeight') as string) || 0;
      const rate = parseFloat(formData.get('rate') as string) || 0;
      
      // Calculate amount
      const amount = netWeight * rate;
      
      // Create item object
      const item = {
        id: Date.now(), // Generate unique ID
        itemCode,
        name: itemName,
        pcs,
        grossWeight,
        netWeight,
        rate,
        amount,
        status: "Issued"
      };
      
      if (editIssue) {
        // Update existing issue
        const updatedIssue = {
          ...editIssue,
          labName,
          expectedReturnDate: new Date(expectedReturnDate).toISOString(),
          notes,
          lastUpdated: date.toISOString(),
          // If we're editing, just replace the first item for simplicity
          // In a real app, you'd likely have a more complex item management system
          items: [item],
          totalAmount: amount,
          totalPieces: pcs
        };
        
        setIssueData(issueData.map(issue => 
          issue.id === editIssue.id ? updatedIssue : issue
        ));
        
        toast({
          title: "Issue Updated",
          description: `Issue ${updatedIssue.issueNumber} has been updated.`,
          variant: "default",
        });
      } else {
        // Create new issue
        const newIssue = {
          id: issueData.length + 1,
          date: date.toISOString(),
          issueNumber: `IGI-${10000 + issueData.length + 1}`,
          labName,
          items: [item],
          expectedReturnDate: new Date(expectedReturnDate).toISOString(),
          totalAmount: amount,
          totalPieces: pcs,
          notes,
          receiveStatus: "Pending",
          updatedBy: 1, // Current user ID
          lastUpdated: date.toISOString()
        };
        
        setIssueData([...issueData, newIssue]);
        
        toast({
          title: "Issue Created",
          description: `Issue ${newIssue.issueNumber} has been created.`,
          variant: "default",
        });
      }
      
      setOpenDialog(false);
      setEditIssue(null);
    } catch (error) {
      console.error("Error processing form:", error);
      toast({
        title: "Error",
        description: "There was a problem saving the issue. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Print issue details
  const handlePrintIssue = (issue: any) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast({
        title: "Error",
        description: "Please allow pop-ups to print issue details.",
        variant: "destructive",
      });
      return;
    }
    
    printWindow.document.write(`
      <html>
        <head>
          <title>IGI Issue - ${issue.issueNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            h1 { color: #333; margin-bottom: 5px; }
            .issue-details { border: 1px solid #ddd; padding: 15px; margin-bottom: 20px; }
            .section-title { font-size: 16px; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
            .info-row { display: flex; margin-bottom: 8px; }
            .info-label { font-weight: bold; width: 150px; }
            .info-value { flex: 1; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .status { display: inline-block; padding: 3px 8px; border-radius: 3px; font-size: 12px; }
            .status-issued { background-color: #FFF8E1; color: #FF8F00; }
            .status-received { background-color: #E8F5E9; color: #388E3C; }
            .footer { margin-top: 50px; }
            .signatures { display: flex; justify-content: space-between; margin-top: 70px; }
            .signature-line { width: 200px; border-top: 1px solid #000; padding-top: 5px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>IGI SUBMISSION FORM</h1>
            <p>${issue.issueNumber}</p>
          </div>
          
          <div class="issue-details">
            <div class="section-title">Issue Details</div>
            <div class="info-row">
              <div class="info-label">Date:</div>
              <div class="info-value">${format(new Date(issue.date), 'dd/MM/yyyy')}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Lab Name:</div>
              <div class="info-value">${issue.labName}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Expected Return:</div>
              <div class="info-value">${format(new Date(issue.expectedReturnDate), 'dd/MM/yyyy')}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Status:</div>
              <div class="info-value">${issue.receiveStatus}</div>
            </div>
            ${issue.receiveStatus === "Completed" ? `
              <div class="info-row">
                <div class="info-label">Received Date:</div>
                <div class="info-value">${format(new Date(issue.receiveDate), 'dd/MM/yyyy')}</div>
              </div>
              ${issue.certificateNumbers?.length ? `
                <div class="info-row">
                  <div class="info-label">Certificate Numbers:</div>
                  <div class="info-value">${issue.certificateNumbers.join(', ')}</div>
                </div>
              ` : ''}
            ` : ''}
          </div>
          
          <div class="section-title">Items</div>
          <table>
            <thead>
              <tr>
                <th>Item Code</th>
                <th>Description</th>
                <th>Pieces</th>
                <th>Gross Wt (g)</th>
                <th>Net Wt (g)</th>
                <th>Rate</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${issue.items.map((item: any) => `
                <tr>
                  <td>${item.itemCode}</td>
                  <td>${item.name}</td>
                  <td>${item.pcs}</td>
                  <td>${item.grossWeight.toFixed(2)}</td>
                  <td>${item.netWeight.toFixed(2)}</td>
                  <td>₹${item.rate.toLocaleString()}</td>
                  <td>₹${item.amount.toLocaleString()}</td>
                  <td><span class="status status-${item.status.toLowerCase()}">${item.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="text-align: right; font-weight: bold;">Total:</td>
                <td style="font-weight: bold;">${issue.totalPieces}</td>
                <td colspan="3" style="text-align: right; font-weight: bold;">Total Value:</td>
                <td colspan="2" style="font-weight: bold;">₹${issue.totalAmount.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
          
          <div>
            <div class="section-title">Notes</div>
            <p>${issue.notes || 'No notes'}</p>
          </div>
          
          <div class="footer">
            <p>
              <strong>Terms & Conditions:</strong><br>
              1. All items are submitted for the purpose of certification only.<br>
              2. The lab is responsible for the safety and security of all items during the certification process.<br>
              3. All items must be returned by the expected return date along with certification.<br>
              4. Any loss or damage will be compensated at the full value stated above.
            </p>
            
            <div class="signatures">
              <div class="signature-line">Submitted By</div>
              <div class="signature-line">Received By (Lab)</div>
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
    <MainLayout title="IGI Issue Management">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">IGI Issue Management</h1>
          <p className="text-neutral-500">Track items sent to IGI laboratories for certification</p>
        </div>
        <Button onClick={handleAddIssue} className="bg-primary text-white hover:bg-primary/90">
          New IGI Issue
        </Button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold text-neutral-600">Items Value at IGI</h3>
            <p className="text-3xl font-bold text-primary mt-2">₹{formatCurrency(totalPendingValue)}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold text-neutral-600">Active Issues</h3>
            <p className="text-3xl font-bold text-primary mt-2">{totalActiveIssues}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold text-neutral-600">Pieces at IGI</h3>
            <p className="text-3xl font-bold text-primary mt-2">{totalPiecesOut}</p>
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
                <h3 className="text-lg font-semibold text-neutral-800">Certify Your Precious Stones</h3>
                <p className="text-neutral-600 mt-2 mb-4">
                  Track jewelry and loose stones sent to IGI laboratories for certification. 
                  Maintain records of issue dates, expected returns, and certification numbers.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border border-neutral-200 rounded-md p-3">
                    <p className="text-xs text-neutral-500">Process</p>
                    <p className="font-medium">Issue items → Track status → Receive with certificates</p>
                  </div>
                  <div className="border border-neutral-200 rounded-md p-3">
                    <p className="text-xs text-neutral-500">Benefits</p>
                    <p className="font-medium">Maintain authenticity, increase item value, build trust</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Issue Data Table */}
      <Card>
        <CardContent className="p-6">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Issue #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Lab</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expected Return</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {issueData.map((issue) => (
                  <TableRow key={issue.id}>
                    <TableCell className="font-medium">{issue.issueNumber}</TableCell>
                    <TableCell>{format(new Date(issue.date), 'dd/MM/yyyy')}</TableCell>
                    <TableCell>{issue.labName}</TableCell>
                    <TableCell>{issue.totalPieces}</TableCell>
                    <TableCell className="text-right">₹{issue.totalAmount.toLocaleString()}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                        issue.receiveStatus === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {issue.receiveStatus}
                      </span>
                    </TableCell>
                    <TableCell>{format(new Date(issue.expectedReturnDate), 'dd/MM/yyyy')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleViewIssue(issue)}
                        >
                          View
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditIssue(issue)}
                          disabled={issue.receiveStatus === "Completed"}
                        >
                          Edit
                        </Button>
                        {issue.receiveStatus === "Pending" && (
                          <Button 
                            variant="default" 
                            size="sm" 
                            onClick={() => handleReceiveIssue(issue)}
                          >
                            Receive
                          </Button>
                        )}
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDeleteIssue(issue)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {issueData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6 text-neutral-500">
                      No IGI issue records found. Create a new issue to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Add/Edit Issue Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editIssue ? 'Edit IGI Issue' : 'Create New IGI Issue'}</DialogTitle>
            <DialogDescription>
              {editIssue 
                ? 'Update the details of this IGI issue.' 
                : 'Enter the details for a new IGI issue.'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Lab Name */}
              <div className="space-y-2">
                <label htmlFor="labName" className="text-sm font-medium">Lab Name *</label>
                <select
                  id="labName" 
                  name="labName"
                  required
                  defaultValue={editIssue?.labName || "IGI Mumbai"}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="IGI Mumbai">IGI Mumbai</option>
                  <option value="IGI Delhi">IGI Delhi</option>
                  <option value="IGI Surat">IGI Surat</option>
                  <option value="IGI Chennai">IGI Chennai</option>
                  <option value="IGI Kolkata">IGI Kolkata</option>
                  <option value="IGI Jaipur">IGI Jaipur</option>
                  <option value="Other Lab">Other Lab</option>
                </select>
              </div>
              
              {/* Expected Return Date */}
              <div className="space-y-2">
                <label htmlFor="expectedReturnDate" className="text-sm font-medium">Expected Return Date *</label>
                <input 
                  id="expectedReturnDate" 
                  name="expectedReturnDate" 
                  type="date"
                  required
                  defaultValue={editIssue 
                    ? format(new Date(editIssue.expectedReturnDate), 'yyyy-MM-dd') 
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
                    defaultValue={editIssue?.items[0]?.itemCode || ""}
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
                    defaultValue={editIssue?.items[0]?.name || ""}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                {/* Pieces */}
                <div className="space-y-2">
                  <label htmlFor="pcs" className="text-sm font-medium">Pieces *</label>
                  <input 
                    id="pcs" 
                    name="pcs" 
                    type="number"
                    min="1"
                    required
                    defaultValue={editIssue?.items[0]?.pcs || "1"}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
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
                    defaultValue={editIssue?.items[0]?.grossWeight || ""}
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
                    defaultValue={editIssue?.items[0]?.netWeight || ""}
                    className="w-full p-2 border border-gray-300 rounded-md"
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
                    defaultValue={editIssue?.items[0]?.rate || ""}
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
                defaultValue={editIssue?.notes || ""}
                className="w-full p-2 border border-gray-300 rounded-md h-20"
                placeholder="Any special instructions or notes for the lab?"
              ></textarea>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" type="button" onClick={() => setOpenDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editIssue ? 'Update Issue' : 'Create Issue'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* View Issue Dialog */}
      <Dialog open={viewDialog} onOpenChange={setViewDialog}>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle>IGI Issue Details</DialogTitle>
            <DialogDescription>
              Detailed information for IGI Issue {viewIssue?.issueNumber}
            </DialogDescription>
          </DialogHeader>
          
          {viewIssue && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium">Issue Number</h4>
                  <p className="text-base">{viewIssue.issueNumber}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Date</h4>
                  <p className="text-base">{format(new Date(viewIssue.date), 'dd/MM/yyyy')}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium">Lab Name</h4>
                  <p className="text-base">{viewIssue.labName}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Expected Return Date</h4>
                  <p className="text-base">{format(new Date(viewIssue.expectedReturnDate), 'dd/MM/yyyy')}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium">Status</h4>
                <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                  viewIssue.receiveStatus === 'Pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {viewIssue.receiveStatus}
                </span>
                {viewIssue.receiveStatus === "Completed" && viewIssue.receiveDate && (
                  <p className="text-sm mt-1">
                    Received on: {format(new Date(viewIssue.receiveDate), 'dd/MM/yyyy')}
                  </p>
                )}
                {viewIssue.certificateNumbers && viewIssue.certificateNumbers.length > 0 && (
                  <div className="mt-2">
                    <h4 className="text-sm font-medium">Certificate Numbers:</h4>
                    <p className="text-base">{viewIssue.certificateNumbers.join(', ')}</p>
                  </div>
                )}
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Items</h4>
                <div className="rounded-md border overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Item Code</th>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Pieces</th>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Weight</th>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {viewIssue.items.map((item: any) => (
                        <tr key={item.id}>
                          <td className="px-3 py-2 whitespace-nowrap text-sm">{item.itemCode}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm">{item.name}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm">{item.pcs}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm">{item.grossWeight}g / {item.netWeight}g</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm">₹{item.amount.toLocaleString()}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm">
                            <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                              item.status === 'Issued'
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
                        <td colSpan={2} className="px-3 py-2 text-sm font-medium text-right">Total:</td>
                        <td className="px-3 py-2 text-sm font-medium">{viewIssue.totalPieces}</td>
                        <td className="px-3 py-2 text-sm font-medium text-right">Total Value:</td>
                        <td colSpan={2} className="px-3 py-2 text-sm font-medium">₹{viewIssue.totalAmount.toLocaleString()}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium">Notes</h4>
                <p className="text-base whitespace-pre-line">{viewIssue.notes || 'No notes available'}</p>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => handlePrintIssue(viewIssue)}>
                  Print Issue
                </Button>
                {viewIssue.receiveStatus === "Pending" && (
                  <Button variant="default" onClick={() => {
                    setViewDialog(false);
                    handleReceiveIssue(viewIssue);
                  }}>
                    Process Receipt
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
      
      {/* Receive Issue Dialog */}
      <Dialog open={receiveDialog} onOpenChange={setReceiveDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Process IGI Receipt</DialogTitle>
            <DialogDescription>
              Mark issue {receiveIssue?.issueNumber} as received with certification.
            </DialogDescription>
          </DialogHeader>
          
          {receiveIssue && (
            <form onSubmit={(e) => {
              e.preventDefault();
              handleProcessReceive(new FormData(e.target as HTMLFormElement));
            }} className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Receipt Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-neutral-500">Lab</p>
                    <p className="text-sm font-medium">{receiveIssue.labName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Total Value</p>
                    <p className="text-sm font-medium">₹{receiveIssue.totalAmount.toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-xs text-neutral-500">Items</p>
                  <ul className="list-disc list-inside text-sm">
                    {receiveIssue.items.map((item: any) => (
                      <li key={item.id}>{item.name} ({item.pcs} pcs)</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="certificateNumbers" className="text-sm font-medium">Certificate Numbers</label>
                <input 
                  id="certificateNumbers" 
                  name="certificateNumbers" 
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter certificate numbers, comma separated"
                />
                <p className="text-xs text-neutral-500">
                  Enter the IGI certificate numbers received. For multiple certificates, separate with commas.
                </p>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="receiveNotes" className="text-sm font-medium">Receipt Notes</label>
                <textarea 
                  id="receiveNotes" 
                  name="receiveNotes" 
                  className="w-full p-2 border border-gray-300 rounded-md h-20"
                  placeholder="Any notes about the received items?"
                ></textarea>
              </div>
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setReceiveDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Confirm Receipt
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}