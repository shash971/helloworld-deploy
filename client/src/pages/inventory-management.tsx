import React, { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { formatCurrency } from "@/lib/utils";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { StockImage } from "@/components/ui/stock-image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Combined inventory data (simplified for this example)
const inventoryData = {
  loose: [
    { id: 1, itemCode: "LS-10001", type: "Diamond", quantity: 1, carats: 1.02, value: 165000, status: "In Stock", location: "Main Store" },
    { id: 2, itemCode: "LS-10002", type: "Diamond", quantity: 2, carats: 0.85, value: 110000, status: "In Stock", location: "Safe" },
    { id: 3, itemCode: "LS-10003", type: "Ruby", quantity: 1, carats: 1.75, value: 145000, status: "In Stock", location: "Display Case" },
    { id: 4, itemCode: "LS-10004", type: "Emerald", quantity: 1, carats: 1.25, value: 160000, status: "Memo Out", location: "N/A" },
    { id: 5, itemCode: "LS-10005", type: "Diamond", quantity: 1, carats: 1.15, value: 195000, status: "In Stock", location: "Main Store" },
  ],
  certified: [
    { id: 1, itemCode: "CS-20001", type: "Diamond", certificate: "IGI 123456789", carats: 1.52, value: 425000, status: "In Stock", location: "Safe" },
    { id: 2, itemCode: "CS-20002", type: "Diamond", certificate: "GIA 2211567823", carats: 2.03, value: 575000, status: "In Stock", location: "Safe" },
    { id: 3, itemCode: "CS-20003", type: "Diamond", certificate: "IGI 987654321", carats: 1.21, value: 240000, status: "IGI Certification", location: "N/A" },
    { id: 4, itemCode: "CS-20004", type: "Ruby", certificate: "GRS 10567823", carats: 3.05, value: 750000, status: "In Stock", location: "Safe" },
    { id: 5, itemCode: "CS-20005", type: "Sapphire", certificate: "SSEF 89562", carats: 4.25, value: 625000, status: "In Stock", location: "Safe" },
  ],
  jewellery: [
    { id: 1, itemCode: "JS-30001", type: "Ring", name: "Diamond Solitaire Ring", metal: "Platinum", value: 250000, status: "In Stock", location: "Display Case" },
    { id: 2, itemCode: "JS-30002", type: "Necklace", name: "Ruby and Diamond Necklace", metal: "Gold 18K", value: 425000, status: "In Stock", location: "Safe" },
    { id: 3, itemCode: "JS-30003", type: "Bracelet", name: "Diamond Tennis Bracelet", metal: "White Gold", value: 350000, status: "Memo Out", location: "N/A" },
    { id: 4, itemCode: "JS-30004", type: "Earrings", name: "Emerald Drop Earrings", metal: "Gold 22K", value: 240000, status: "In Stock", location: "Display Case" },
    { id: 5, itemCode: "JS-30005", type: "Pendant", name: "Diamond Pendant", metal: "Rose Gold", value: 135000, status: "Sold", location: "N/A" },
  ],
};

// Location data for reporting
const locationData = [
  { location: "Safe", itemCount: 5, value: 2375000 },
  { location: "Display Case", itemCount: 3, value: 545000 },
  { location: "Main Store", itemCount: 2, value: 360000 },
  { location: "Memo Out", itemCount: 2, value: 510000 },
  { location: "IGI Certification", itemCount: 1, value: 240000 },
];

// Category data for reporting
const categoryData = [
  { category: "Diamond", itemCount: 7, value: 1760000 },
  { category: "Ruby", itemCount: 2, value: 895000 },
  { category: "Sapphire", itemCount: 1, value: 625000 },
  { category: "Emerald", itemCount: 2, value: 400000 },
  { category: "Gold Jewelry", itemCount: 3, value: 800000 },
];

export default function InventoryManagement() {
  const [activeTab, setActiveTab] = useState("overview");
  const [timeframe, setTimeframe] = useState("all");
  
  // Calculate inventory totals
  const totalItems = 
    inventoryData.loose.length + 
    inventoryData.certified.length + 
    inventoryData.jewellery.length;
  
  const totalValue = 
    inventoryData.loose.reduce((sum, item) => sum + item.value, 0) +
    inventoryData.certified.reduce((sum, item) => sum + item.value, 0) +
    inventoryData.jewellery.reduce((sum, item) => sum + item.value, 0);
  
  // Loose stock columns
  const looseColumns = [
    {
      header: "Item Code",
      accessor: (row: any) => (
        <span className="font-medium text-primary">{row.itemCode}</span>
      ),
      sortable: true,
    },
    {
      header: "Type",
      accessor: "type",
      sortable: true,
    },
    {
      header: "Carats",
      accessor: (row: any) => `${row.carats} ct`,
      sortable: true,
    },
    {
      header: "Quantity",
      accessor: "quantity",
      sortable: true,
    },
    {
      header: "Value",
      accessor: (row: any) => (
        <span className="font-medium">{formatCurrency(row.value)}</span>
      ),
      sortable: true,
    },
    {
      header: "Status",
      accessor: (row: any) => (
        <StatusBadge type="status" value={row.status} />
      ),
    },
    {
      header: "Location",
      accessor: "location",
    },
  ];
  
  // Certified stock columns
  const certifiedColumns = [
    {
      header: "Item Code",
      accessor: (row: any) => (
        <span className="font-medium text-primary">{row.itemCode}</span>
      ),
      sortable: true,
    },
    {
      header: "Type",
      accessor: "type",
      sortable: true,
    },
    {
      header: "Certificate",
      accessor: "certificate",
      sortable: true,
    },
    {
      header: "Carats",
      accessor: (row: any) => `${row.carats} ct`,
      sortable: true,
    },
    {
      header: "Value",
      accessor: (row: any) => (
        <span className="font-medium">{formatCurrency(row.value)}</span>
      ),
      sortable: true,
    },
    {
      header: "Status",
      accessor: (row: any) => (
        <StatusBadge type="status" value={row.status} />
      ),
    },
    {
      header: "Location",
      accessor: "location",
    },
  ];
  
  // Jewellery columns
  const jewelleryColumns = [
    {
      header: "Item Code",
      accessor: (row: any) => (
        <span className="font-medium text-primary">{row.itemCode}</span>
      ),
      sortable: true,
    },
    {
      header: "Name",
      accessor: "name",
      sortable: true,
    },
    {
      header: "Type",
      accessor: "type",
      sortable: true,
    },
    {
      header: "Metal",
      accessor: "metal",
    },
    {
      header: "Value",
      accessor: (row: any) => (
        <span className="font-medium">{formatCurrency(row.value)}</span>
      ),
      sortable: true,
    },
    {
      header: "Status",
      accessor: (row: any) => (
        <StatusBadge type="status" value={row.status} />
      ),
    },
    {
      header: "Location",
      accessor: "location",
    },
  ];
  
  // Format for location and category tables
  const analysisColumns = [
    {
      header: "Name",
      accessor: (row: any) => row.location || row.category,
      sortable: true,
    },
    {
      header: "Items",
      accessor: "itemCount",
      sortable: true,
    },
    {
      header: "Value",
      accessor: (row: any) => (
        <span className="font-medium">{formatCurrency(row.value)}</span>
      ),
      sortable: true,
    },
    {
      header: "% of Total",
      accessor: (row: any) => (
        <div className="w-full">
          <div className="flex justify-between mb-1">
            <span className="text-xs">{((row.value / totalValue) * 100).toFixed(1)}%</span>
          </div>
          <Progress value={(row.value / totalValue) * 100} className="h-2" />
        </div>
      ),
    },
  ];
  
  return (
    <MainLayout title="Inventory Management">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-800">Inventory Management</h1>
          <p className="text-neutral-500">Real-time stock levels across all modules</p>
        </div>
        <div>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Inventory Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-neutral-500">Total Inventory Value</p>
                <h3 className="text-2xl font-semibold mt-1">{formatCurrency(totalValue)}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <i className="fas fa-coins text-lg"></i>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-neutral-500">Total Items</p>
                <h3 className="text-2xl font-semibold mt-1">{totalItems}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-info/10 flex items-center justify-center text-info">
                <i className="fas fa-cubes text-lg"></i>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-neutral-500">Items on Memo</p>
                <h3 className="text-2xl font-semibold mt-1">2</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center text-warning">
                <i className="fas fa-paper-plane text-lg"></i>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-neutral-500">Items in Certification</p>
                <h3 className="text-2xl font-semibold mt-1">1</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                <i className="fas fa-certificate text-lg"></i>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Featured Store Image */}
      <div className="mb-6">
        <Card>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="md:col-span-1">
                <StockImage type="jewelry-store" className="h-full rounded-l-lg md:rounded-r-none rounded-r-lg" />
              </div>
              <div className="md:col-span-2 p-6">
                <h3 className="text-lg font-semibold text-neutral-800">Comprehensive Inventory Management</h3>
                <p className="text-neutral-600 mt-2 mb-4">
                  Track all your inventory in real-time across loose stones, certified gemstones, and 
                  finished jewelry. Monitor stock levels, locations, values, and status to maintain optimal 
                  inventory control and make informed business decisions.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="border border-neutral-200 rounded-md p-3">
                    <p className="text-xs text-neutral-500">Loose Stones</p>
                    <p className="font-medium">{inventoryData.loose.length} items</p>
                  </div>
                  <div className="border border-neutral-200 rounded-md p-3">
                    <p className="text-xs text-neutral-500">Certified Stones</p>
                    <p className="font-medium">{inventoryData.certified.length} items</p>
                  </div>
                  <div className="border border-neutral-200 rounded-md p-3">
                    <p className="text-xs text-neutral-500">Jewelry Pieces</p>
                    <p className="font-medium">{inventoryData.jewellery.length} items</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Inventory Tabs */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="loose">Loose Stock</TabsTrigger>
          <TabsTrigger value="certified">Certified Stock</TabsTrigger>
          <TabsTrigger value="jewellery">Jewellery</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-neutral-800 mb-4">Inventory Distribution</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Loose Stock</span>
                      <span className="text-sm font-medium">
                        {formatCurrency(inventoryData.loose.reduce((sum, item) => sum + item.value, 0))}
                      </span>
                    </div>
                    <Progress value={19} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Certified Stock</span>
                      <span className="text-sm font-medium">
                        {formatCurrency(inventoryData.certified.reduce((sum, item) => sum + item.value, 0))}
                      </span>
                    </div>
                    <Progress value={64} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Jewellery</span>
                      <span className="text-sm font-medium">
                        {formatCurrency(inventoryData.jewellery.reduce((sum, item) => sum + item.value, 0))}
                      </span>
                    </div>
                    <Progress value={17} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-neutral-800 mb-4">Status Distribution</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">In Stock</span>
                      <span className="text-sm font-medium">10 items</span>
                    </div>
                    <Progress value={71} className="h-2 bg-neutral-100">
                      <div className="h-full bg-success rounded-full" style={{ width: '71%' }} />
                    </Progress>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Memo Out</span>
                      <span className="text-sm font-medium">2 items</span>
                    </div>
                    <Progress value={15} className="h-2 bg-neutral-100">
                      <div className="h-full bg-warning rounded-full" style={{ width: '15%' }} />
                    </Progress>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">IGI Certification</span>
                      <span className="text-sm font-medium">1 item</span>
                    </div>
                    <Progress value={7} className="h-2 bg-neutral-100">
                      <div className="h-full bg-info rounded-full" style={{ width: '7%' }} />
                    </Progress>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Sold (Not Removed)</span>
                      <span className="text-sm font-medium">1 item</span>
                    </div>
                    <Progress value={7} className="h-2 bg-neutral-100">
                      <div className="h-full bg-error rounded-full" style={{ width: '7%' }} />
                    </Progress>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-neutral-800 mb-4">Recent Inventory Changes</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-success pl-4 py-1">
                  <p className="text-sm">Added <span className="font-medium">Diamond Solitaire Ring (JS-30001)</span> to inventory</p>
                  <p className="text-xs text-neutral-500">Today, 10:30 AM</p>
                </div>
                <div className="border-l-4 border-warning pl-4 py-1">
                  <p className="text-sm">Moved <span className="font-medium">Diamond Tennis Bracelet (JS-30003)</span> to Memo Out</p>
                  <p className="text-xs text-neutral-500">Yesterday, 2:15 PM</p>
                </div>
                <div className="border-l-4 border-info pl-4 py-1">
                  <p className="text-sm">Sent <span className="font-medium">Diamond (CS-20003)</span> for IGI Certification</p>
                  <p className="text-xs text-neutral-500">July 12, 2023</p>
                </div>
                <div className="border-l-4 border-error pl-4 py-1">
                  <p className="text-sm">Marked <span className="font-medium">Diamond Pendant (JS-30005)</span> as Sold</p>
                  <p className="text-xs text-neutral-500">July 8, 2023</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-neutral-200 text-center">
                <Button variant="link" className="text-sm">View All Inventory Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Loose Stock Tab */}
        <TabsContent value="loose">
          <Card>
            <CardContent className="p-0">
              <div className="p-6 border-b border-neutral-200">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-neutral-800">Loose Stock Inventory</h3>
                  <Button variant="outline" size="sm">
                    <i className="fas fa-file-export mr-2"></i> Export
                  </Button>
                </div>
              </div>
              <DataTable
                columns={looseColumns}
                data={inventoryData.loose}
                keyField="id"
                actionComponent={(row) => (
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <i className="fas fa-eye mr-1"></i> View
                    </Button>
                  </div>
                )}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Certified Stock Tab */}
        <TabsContent value="certified">
          <Card>
            <CardContent className="p-0">
              <div className="p-6 border-b border-neutral-200">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-neutral-800">Certified Stock Inventory</h3>
                  <Button variant="outline" size="sm">
                    <i className="fas fa-file-export mr-2"></i> Export
                  </Button>
                </div>
              </div>
              <DataTable
                columns={certifiedColumns}
                data={inventoryData.certified}
                keyField="id"
                actionComponent={(row) => (
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <i className="fas fa-eye mr-1"></i> View
                    </Button>
                  </div>
                )}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Jewellery Tab */}
        <TabsContent value="jewellery">
          <Card>
            <CardContent className="p-0">
              <div className="p-6 border-b border-neutral-200">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-neutral-800">Jewellery Inventory</h3>
                  <Button variant="outline" size="sm">
                    <i className="fas fa-file-export mr-2"></i> Export
                  </Button>
                </div>
              </div>
              <DataTable
                columns={jewelleryColumns}
                data={inventoryData.jewellery}
                keyField="id"
                actionComponent={(row) => (
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <i className="fas fa-eye mr-1"></i> View
                    </Button>
                  </div>
                )}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6">
          <Card>
            <CardContent className="p-0">
              <div className="p-6 border-b border-neutral-200">
                <h3 className="font-semibold text-neutral-800">Inventory by Location</h3>
              </div>
              <DataTable
                columns={analysisColumns}
                data={locationData}
                keyField="location"
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-0">
              <div className="p-6 border-b border-neutral-200">
                <h3 className="font-semibold text-neutral-800">Inventory by Category</h3>
              </div>
              <DataTable
                columns={analysisColumns}
                data={categoryData}
                keyField="category"
              />
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-neutral-800 mb-4">Inventory Alerts</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-warning/10 text-warning p-2 rounded-full">
                      <i className="fas fa-exclamation-triangle"></i>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Low Stock Alert</p>
                      <p className="text-xs text-neutral-600">
                        Diamond Round Cut (1.0-1.5ct) stock is running low
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-error/10 text-error p-2 rounded-full">
                      <i className="fas fa-clock"></i>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Memo Overdue</p>
                      <p className="text-xs text-neutral-600">
                        2 items have exceeded the expected return date
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-info/10 text-info p-2 rounded-full">
                      <i className="fas fa-chart-line"></i>
                    </div>
                    <div>
                      <p className="text-sm font-medium">High Value Concentration</p>
                      <p className="text-xs text-neutral-600">
                        65% of inventory value is in certified diamonds
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-neutral-800 mb-4">Inventory Recommendations</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-success/10 text-success p-2 rounded-full">
                      <i className="fas fa-shopping-cart"></i>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Purchase Recommendation</p>
                      <p className="text-xs text-neutral-600">
                        Order more round diamonds (1.0-1.5ct) based on sales data
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-secondary/10 text-secondary p-2 rounded-full">
                      <i className="fas fa-tags"></i>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Pricing Adjustment</p>
                      <p className="text-xs text-neutral-600">
                        Consider price adjustments for slow-moving emerald items
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary/10 text-primary p-2 rounded-full">
                      <i className="fas fa-sync-alt"></i>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Display Rotation</p>
                      <p className="text-xs text-neutral-600">
                        Rotate sapphire items to display case to improve visibility
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
