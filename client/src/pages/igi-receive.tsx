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
const igiReceiveData = [
  {
    id: 1,
    receiveDate: "2025-05-15T14:30:00Z",
    receiveNumber: "IGI-REC-10001",
    labName: "IGI Mumbai",
    items: [
      {
        id: 101,
        itemCode: "D-1001",
        itemName: "Diamond Solitaire",
        shape: "Round",
        weight: "1.25ct",
        labName: "IGI Mumbai",
        certificateNo: "IGI-124578",
        remark: "VS1-F Color"
      }
    ]
  },
  {
    id: 2,
    receiveDate: "2025-05-14T11:45:00Z",
    receiveNumber: "IGI-REC-10002",
    labName: "IGI Delhi",
    items: [
      {
        id: 102,
        itemCode: "D-985",
        itemName: "Diamond Stud Earrings",
        shape: "Princess",
        weight: "0.75ct each",
        labName: "IGI Delhi",
        certificateNo: "IGI-124432, IGI-124433",
        remark: "Matching pair, VS2-G Color"
      }
    ]
  },
  {
    id: 3,
    receiveDate: "2025-05-12T10:15:00Z",
    receiveNumber: "IGI-REC-10003",
    labName: "IGI Surat",
    items: [
      {
        id: 103,
        itemCode: "D-950",
        itemName: "Diamond Pendant",
        shape: "Pear",
        weight: "1.05ct",
        labName: "IGI Surat",
        certificateNo: "IGI-124255",
        remark: "VVS2-E Color"
      }
    ]
  }
];

export default function IgiReceive() {
  const { toast } = useToast();
  // Load data from localStorage if available, otherwise use sample data
  const [receiveData, setReceiveData] = useState(() => {
    const savedData = localStorage.getItem('igiReceiveData');
    return savedData ? JSON.parse(savedData) : igiReceiveData;
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [editReceive, setEditReceive] = useState<any>(null);
  const [viewDialog, setViewDialog] = useState(false);
  const [viewReceive, setViewReceive] = useState<any>(null);
  
  // Save to localStorage whenever receiveData changes
  useEffect(() => {
    localStorage.setItem('igiReceiveData', JSON.stringify(receiveData));
  }, [receiveData]);
  
  // Calculate statistics
  const totalCertificates = receiveData.reduce((sum, receive) => {
    return sum + receive.items.reduce((itemSum, item) => {
      // Count multiple certificates (comma separated) as individual certificates
      return itemSum + (item.certificateNo ? item.certificateNo.split(',').length : 0);
    }, 0);
  }, 0);
  
  const totalItems = receiveData.reduce((sum, receive) => sum + receive.items.length, 0);
  
  // Handle view receive
  const handleViewReceive = (receive: any) => {
    setViewReceive(receive);
    setViewDialog(true);
  };
  
  // Handle edit receive
  const handleEditReceive = (receive: any) => {
    setEditReceive(receive);
    setOpenDialog(true);
  };
  
  // Handle add new receive
  const handleAddReceive = () => {
    setEditReceive(null);
    setOpenDialog(true);
  };
  
  // Handle delete receive
  const handleDeleteReceive = (receive: any) => {
    if (confirm(`Are you sure you want to delete receive record ${receive.receiveNumber}?`)) {
      setReceiveData(receiveData.filter(r => r.id !== receive.id));
      toast({
        title: "Record Deleted",
        description: `Record ${receive.receiveNumber} has been deleted.`,
        variant: "default",
      });
    }
  };
  
  // Handle form submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    try {
      // Get basic receive details
      const receiveDate = new Date();
      const labName = formData.get('labName') as string || "";
      
      // Process item data
      const itemCode = formData.get('itemCode') as string || "";
      const itemName = formData.get('itemName') as string || "";
      const shape = formData.get('shape') as string || "";
      const weight = formData.get('weight') as string || "";
      const certificateNo = formData.get('certificateNo') as string || "";
      const remark = formData.get('remark') as string || "";
      
      // Create item object
      const item = {
        id: Date.now(), // Generate unique ID
        itemCode,
        itemName,
        shape,
        weight,
        labName,
        certificateNo,
        remark
      };
      
      if (editReceive) {
        // Update existing receive
        const updatedReceive = {
          ...editReceive,
          labName,
          // If we're editing, just replace the first item for simplicity
          // In a real app, you'd likely have a more complex item management system
          items: [item]
        };
        
        setReceiveData(receiveData.map(receive => 
          receive.id === editReceive.id ? updatedReceive : receive
        ));
        
        toast({
          title: "Record Updated",
          description: `Record ${updatedReceive.receiveNumber} has been updated.`,
          variant: "default",
        });
      } else {
        // Create new receive
        const newReceive = {
          id: receiveData.length + 1,
          receiveDate: receiveDate.toISOString(),
          receiveNumber: `IGI-REC-${10000 + receiveData.length + 1}`,
          labName,
          items: [item]
        };
        
        setReceiveData([...receiveData, newReceive]);
        
        toast({
          title: "Record Created",
          description: `Record ${newReceive.receiveNumber} has been created.`,
          variant: "default",
        });
      }
      
      setOpenDialog(false);
      setEditReceive(null);
    } catch (error) {
      console.error("Error processing form:", error);
      toast({
        title: "Error",
        description: "There was a problem saving the record. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Print certificate details
  const handlePrintCertificate = (receive: any) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast({
        title: "Error",
        description: "Please allow pop-ups to print certificate details.",
        variant: "destructive",
      });
      return;
    }
    
    printWindow.document.write(`
      <html>
        <head>
          <title>IGI Certificate Record - ${receive.receiveNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            h1 { color: #333; margin-bottom: 5px; }
            .receive-details { border: 1px solid #ddd; padding: 15px; margin-bottom: 20px; }
            .section-title { font-size: 16px; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
            .info-row { display: flex; margin-bottom: 8px; }
            .info-label { font-weight: bold; width: 150px; }
            .info-value { flex: 1; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .certificate { border: 2px solid #333; padding: 15px; margin-bottom: 20px; }
            .certificate-header { text-align: center; border-bottom: 1px solid #333; padding-bottom: 10px; margin-bottom: 15px; }
            .certificate-logo { font-size: 24px; font-weight: bold; }
            .certificate-number { font-size: 18px; margin-top: 5px; }
            .certificate-grid { display: grid; grid-template-columns: 1fr 1fr; grid-gap: 10px; }
            .certificate-item { margin-bottom: 5px; }
            .certificate-item-label { font-weight: bold; }
            .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #777; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>IGI CERTIFICATE RECORD</h1>
            <p>${receive.receiveNumber}</p>
          </div>
          
          <div class="receive-details">
            <div class="section-title">Receipt Details</div>
            <div class="info-row">
              <div class="info-label">Date:</div>
              <div class="info-value">${format(new Date(receive.receiveDate), 'dd/MM/yyyy')}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Lab Name:</div>
              <div class="info-value">${receive.labName}</div>
            </div>
          </div>
          
          ${receive.items.map((item: any) => `
            <div class="certificate">
              <div class="certificate-header">
                <div class="certificate-logo">IGI CERTIFICATE</div>
                <div class="certificate-number">Certificate Number: ${item.certificateNo}</div>
              </div>
              
              <div class="certificate-grid">
                <div class="certificate-item">
                  <div class="certificate-item-label">Item Code:</div>
                  <div>${item.itemCode}</div>
                </div>
                <div class="certificate-item">
                  <div class="certificate-item-label">Description:</div>
                  <div>${item.itemName}</div>
                </div>
                <div class="certificate-item">
                  <div class="certificate-item-label">Shape:</div>
                  <div>${item.shape}</div>
                </div>
                <div class="certificate-item">
                  <div class="certificate-item-label">Weight:</div>
                  <div>${item.weight}</div>
                </div>
                <div class="certificate-item">
                  <div class="certificate-item-label">Lab:</div>
                  <div>${item.labName}</div>
                </div>
                <div class="certificate-item">
                  <div class="certificate-item-label">Certificate Date:</div>
                  <div>${format(new Date(receive.receiveDate), 'dd/MM/yyyy')}</div>
                </div>
              </div>
              
              <div class="certificate-item" style="margin-top: 15px;">
                <div class="certificate-item-label">Remarks:</div>
                <div>${item.remark || 'No remarks'}</div>
              </div>
            </div>
          `).join('')}
          
          <div class="section-title">Items Summary</div>
          <table>
            <thead>
              <tr>
                <th>Item Code</th>
                <th>Description</th>
                <th>Shape</th>
                <th>Weight</th>
                <th>Certificate No.</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              ${receive.items.map((item: any) => `
                <tr>
                  <td>${item.itemCode}</td>
                  <td>${item.itemName}</td>
                  <td>${item.shape}</td>
                  <td>${item.weight}</td>
                  <td>${item.certificateNo}</td>
                  <td>${item.remark || ''}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="footer">
            <p>This document is a record of IGI certificates received and does not replace the original IGI certificates.</p>
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
    <MainLayout title="IGI Receive Management">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">IGI Receive Management</h1>
          <p className="text-neutral-500">Track certified items received from IGI laboratories with certificate details</p>
        </div>
        <Button onClick={handleAddReceive} className="bg-primary text-white hover:bg-primary/90">
          New IGI Receive
        </Button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold text-neutral-600">Total Certificates</h3>
            <p className="text-3xl font-bold text-primary mt-2">{totalCertificates}</p>
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
            <h3 className="text-lg font-semibold text-neutral-600">Recent Certificates</h3>
            <p className="text-3xl font-bold text-primary mt-2">{receiveData.length > 0 ? format(new Date(receiveData[0].receiveDate), 'MMM dd') : 'None'}</p>
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
                <h3 className="text-lg font-semibold text-neutral-800">Certified Diamonds & Gemstones</h3>
                <p className="text-neutral-600 mt-2 mb-4">
                  Record and manage items received from IGI laboratories with their certification details. 
                  Track certificate numbers, grades, and maintain complete certification records.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border border-neutral-200 rounded-md p-3">
                    <p className="text-xs text-neutral-500">Benefits</p>
                    <p className="font-medium">Enhanced value, customer confidence, authentication</p>
                  </div>
                  <div className="border border-neutral-200 rounded-md p-3">
                    <p className="text-xs text-neutral-500">Process</p>
                    <p className="font-medium">Receive certified items → Record details → Update inventory</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Receive Data Table */}
      <Card>
        <CardContent className="p-6">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Receive #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Lab</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Certificate No.</TableHead>
                  <TableHead>Remarks</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {receiveData.map((receive) => (
                  <TableRow key={receive.id}>
                    <TableCell className="font-medium">{receive.receiveNumber}</TableCell>
                    <TableCell>{format(new Date(receive.receiveDate), 'dd/MM/yyyy')}</TableCell>
                    <TableCell>{receive.labName}</TableCell>
                    <TableCell>
                      {receive.items.length > 0 
                        ? `${receive.items[0].itemName} ${receive.items.length > 1 ? `+${receive.items.length - 1} more` : ''}`
                        : 'No items'
                      }
                    </TableCell>
                    <TableCell>
                      {receive.items.length > 0 && receive.items[0].certificateNo
                        ? receive.items[0].certificateNo.split(',')[0] + (receive.items[0].certificateNo.split(',').length > 1 ? '...' : '')
                        : 'N/A'
                      }
                    </TableCell>
                    <TableCell>
                      {receive.items.length > 0 && receive.items[0].remark
                        ? (receive.items[0].remark.length > 20 
                          ? receive.items[0].remark.substring(0, 20) + '...' 
                          : receive.items[0].remark)
                        : 'No remarks'
                      }
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleViewReceive(receive)}
                        >
                          View
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditReceive(receive)}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handlePrintCertificate(receive)}
                        >
                          Print
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDeleteReceive(receive)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {receiveData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-neutral-500">
                      No IGI receive records found. Create a new record to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Add/Edit Receive Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editReceive ? 'Edit IGI Receive' : 'Create New IGI Receive'}</DialogTitle>
            <DialogDescription>
              {editReceive 
                ? 'Update the details of this IGI receive record.' 
                : 'Enter the details for a new IGI receive record.'}
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
                  defaultValue={editReceive?.labName || "IGI Mumbai"}
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
                    defaultValue={editReceive?.items[0]?.itemCode || ""}
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
                    defaultValue={editReceive?.items[0]?.itemName || ""}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                {/* Shape */}
                <div className="space-y-2">
                  <label htmlFor="shape" className="text-sm font-medium">Shape *</label>
                  <select
                    id="shape" 
                    name="shape"
                    required
                    defaultValue={editReceive?.items[0]?.shape || "Round"}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="Round">Round</option>
                    <option value="Princess">Princess</option>
                    <option value="Oval">Oval</option>
                    <option value="Cushion">Cushion</option>
                    <option value="Emerald">Emerald</option>
                    <option value="Pear">Pear</option>
                    <option value="Marquise">Marquise</option>
                    <option value="Radiant">Radiant</option>
                    <option value="Asscher">Asscher</option>
                    <option value="Heart">Heart</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                {/* Weight */}
                <div className="space-y-2">
                  <label htmlFor="weight" className="text-sm font-medium">Weight *</label>
                  <input 
                    id="weight" 
                    name="weight"
                    required
                    defaultValue={editReceive?.items[0]?.weight || ""}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="e.g., 1.25ct"
                  />
                </div>
                
                {/* Certificate No */}
                <div className="space-y-2">
                  <label htmlFor="certificateNo" className="text-sm font-medium">Certificate Number(s) *</label>
                  <input 
                    id="certificateNo" 
                    name="certificateNo"
                    required
                    defaultValue={editReceive?.items[0]?.certificateNo || ""}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="e.g., IGI-123456 or multiple separated by commas"
                  />
                </div>
                
                {/* Remark */}
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="remark" className="text-sm font-medium">Remarks</label>
                  <input 
                    id="remark" 
                    name="remark"
                    defaultValue={editReceive?.items[0]?.remark || ""}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="e.g., VS1-F Color, Excellent Cut"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" type="button" onClick={() => setOpenDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editReceive ? 'Update Record' : 'Create Record'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* View Receive Dialog */}
      <Dialog open={viewDialog} onOpenChange={setViewDialog}>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle>IGI Receive Details</DialogTitle>
            <DialogDescription>
              Detailed information for IGI Receive {viewReceive?.receiveNumber}
            </DialogDescription>
          </DialogHeader>
          
          {viewReceive && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium">Receive Number</h4>
                  <p className="text-base">{viewReceive.receiveNumber}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Date</h4>
                  <p className="text-base">{format(new Date(viewReceive.receiveDate), 'dd/MM/yyyy')}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium">Lab Name</h4>
                <p className="text-base">{viewReceive.labName}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Items</h4>
                <div className="rounded-md border overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Item Code</th>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Shape</th>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Weight</th>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Certificate No.</th>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {viewReceive.items.map((item: any) => (
                        <tr key={item.id}>
                          <td className="px-3 py-2 whitespace-nowrap text-sm">{item.itemCode}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm">{item.itemName}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm">{item.shape}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm">{item.weight}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm">{item.certificateNo}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm">{item.remark || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => handlePrintCertificate(viewReceive)}>
                  Print Certificate
                </Button>
                <Button variant="outline" onClick={() => handleEditReceive(viewReceive)}>
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