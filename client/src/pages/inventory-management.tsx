import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StockImage } from "@/components/ui/stock-image";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";

// Types for inventory items
interface LooseStockItem {
  id: number;
  date: string;
  branch: string;
  iteam: string;
  shape: string;
  size: string;
  total: number;
  remark?: string;
}

interface CertifiedStockItem {
  id: number;
  date: string;
  certi_no: string;
  lab: string;
  shape: string;
  size: string;
  color: string;
  clarity: string;
  rate: number;
  total: number;
  currency: string;
  pay_mode: string;
  remark?: string;
}

interface JewelleryStockItem {
  id: number;
  date: string;
  item: string;
  gross_wt: number;
  net_wt: number;
  purity: string;
  type: string;
  value: number;
  remark?: string;
}

interface InventorySummary {
  looseStock: {
    count: number;
    value: number;
  };
  certifiedStock: {
    count: number;
    value: number;
  };
  jewelleryStock: {
    count: number;
    value: number;
  };
  totalCount: number;
  totalValue: number;
}

// Sample data - in a real app, this would be fetched from the API
const looseStockData: LooseStockItem[] = [
  { id: 1, date: "2025-05-20T00:00:00Z", branch: "Main Store", iteam: "Diamond", shape: "Round", size: "1ct", total: 85000, remark: "VS1-F" },
  { id: 2, date: "2025-05-18T00:00:00Z", branch: "Main Store", iteam: "Diamond", shape: "Princess", size: "0.75ct", total: 62000, remark: "VS2-G" },
  { id: 3, date: "2025-05-16T00:00:00Z", branch: "Showroom", iteam: "Diamond", shape: "Oval", size: "1.2ct", total: 95000, remark: "SI1-H" },
  { id: 4, date: "2025-05-15T00:00:00Z", branch: "Workshop", iteam: "Ruby", shape: "Oval", size: "3ct", total: 45000, remark: "A Grade" },
  { id: 5, date: "2025-05-12T00:00:00Z", branch: "Showroom", iteam: "Emerald", shape: "Square", size: "2ct", total: 55000, remark: "Fine Quality" },
];

const certifiedStockData: CertifiedStockItem[] = [
  { id: 1, date: "2025-05-21T00:00:00Z", certi_no: "GIA-124578", lab: "GIA", shape: "Round", size: "1.5ct", color: "F", clarity: "VS1", rate: 75000, total: 112500, currency: "INR", pay_mode: "Cash", remark: "Excellent Cut" },
  { id: 2, date: "2025-05-19T00:00:00Z", certi_no: "IGI-873345", lab: "IGI", shape: "Princess", size: "1ct", color: "G", clarity: "VS2", rate: 65000, total: 65000, currency: "INR", pay_mode: "Bank Transfer", remark: "Very Good Cut" },
  { id: 3, date: "2025-05-17T00:00:00Z", certi_no: "GIA-992871", lab: "GIA", shape: "Emerald", size: "1.8ct", color: "D", clarity: "VVS2", rate: 92000, total: 165600, currency: "INR", pay_mode: "Credit Card", remark: "Premium" },
  { id: 4, date: "2025-05-15T00:00:00Z", certi_no: "IGI-129384", lab: "IGI", shape: "Oval", size: "1.25ct", color: "E", clarity: "VS1", rate: 68000, total: 85000, currency: "INR", pay_mode: "Cash", remark: "" },
  { id: 5, date: "2025-05-10T00:00:00Z", certi_no: "HRD-758493", lab: "HRD", shape: "Cushion", size: "2ct", color: "F", clarity: "SI1", rate: 58000, total: 116000, currency: "INR", pay_mode: "Bank Transfer", remark: "Good Cut" },
];

const jewelleryStockData: JewelleryStockItem[] = [
  { id: 1, date: "2025-05-22T00:00:00Z", item: "Diamond Ring", gross_wt: 5.4, net_wt: 4.8, purity: "18K", type: "Gold", value: 185000, remark: "Solitaire Setting" },
  { id: 2, date: "2025-05-20T00:00:00Z", item: "Diamond Necklace", gross_wt: 18.5, net_wt: 15.2, purity: "22K", type: "Gold", value: 320000, remark: "Statement Piece" },
  { id: 3, date: "2025-05-18T00:00:00Z", item: "Ruby Earrings", gross_wt: 6.2, net_wt: 5.5, purity: "18K", type: "White Gold", value: 125000, remark: "Drop Style" },
  { id: 4, date: "2025-05-15T00:00:00Z", item: "Tennis Bracelet", gross_wt: 12.8, net_wt: 10.5, purity: "14K", type: "White Gold", value: 235000, remark: "Diamond Studded" },
  { id: 5, date: "2025-05-12T00:00:00Z", item: "Sapphire Pendant", gross_wt: 4.6, net_wt: 3.8, purity: "18K", type: "Yellow Gold", value: 95000, remark: "Cushion Cut" },
];

export default function InventoryManagement() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("summary");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLocalStorageLoaded, setIsLocalStorageLoaded] = useState(false);
  
  // State for inventory data
  const [looseStock, setLooseStock] = useState<LooseStockItem[]>([]);
  const [certifiedStock, setCertifiedStock] = useState<CertifiedStockItem[]>([]);
  const [jewelleryStock, setJewelleryStock] = useState<JewelleryStockItem[]>([]);
  
  // Load data from localStorage (if available) or use sample data
  useEffect(() => {
    const loadedLooseStock = localStorage.getItem('looseStockData');
    const loadedCertifiedStock = localStorage.getItem('certifiedStockData');
    const loadedJewelleryStock = localStorage.getItem('jewelleryStockData');
    
    setLooseStock(loadedLooseStock ? JSON.parse(loadedLooseStock) : looseStockData);
    setCertifiedStock(loadedCertifiedStock ? JSON.parse(loadedCertifiedStock) : certifiedStockData);
    setJewelleryStock(loadedJewelleryStock ? JSON.parse(loadedJewelleryStock) : jewelleryStockData);
    
    setIsLocalStorageLoaded(true);
  }, []);
  
  // Calculate inventory summary
  const inventorySummary: InventorySummary = {
    looseStock: {
      count: looseStock.length,
      value: looseStock.reduce((sum, item) => sum + item.total, 0),
    },
    certifiedStock: {
      count: certifiedStock.length,
      value: certifiedStock.reduce((sum, item) => sum + item.total, 0),
    },
    jewelleryStock: {
      count: jewelleryStock.length,
      value: jewelleryStock.reduce((sum, item) => sum + item.value, 0),
    },
    get totalCount() {
      return this.looseStock.count + this.certifiedStock.count + this.jewelleryStock.count;
    },
    get totalValue() {
      return this.looseStock.value + this.certifiedStock.value + this.jewelleryStock.value;
    },
  };
  
  // Filter data based on search query
  const filteredLooseStock = looseStock.filter(item => 
    searchQuery === "" || 
    Object.values(item).some(value => 
      value && value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
  
  const filteredCertifiedStock = certifiedStock.filter(item => 
    searchQuery === "" || 
    Object.values(item).some(value => 
      value && value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
  
  const filteredJewelleryStock = jewelleryStock.filter(item => 
    searchQuery === "" || 
    Object.values(item).some(value => 
      value && value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
  
  // Generate inventory distribution data for display
  const calculateInventoryDistribution = () => {
    const total = inventorySummary.totalValue;
    
    if (total === 0) return [
      { category: "Loose Stock", value: 0, percentage: 0 },
      { category: "Certified Stock", value: 0, percentage: 0 },
      { category: "Jewellery Stock", value: 0, percentage: 0 },
    ];
    
    return [
      { 
        category: "Loose Stock", 
        value: inventorySummary.looseStock.value,
        percentage: Math.round((inventorySummary.looseStock.value / total) * 100)
      },
      { 
        category: "Certified Stock", 
        value: inventorySummary.certifiedStock.value,
        percentage: Math.round((inventorySummary.certifiedStock.value / total) * 100)
      },
      { 
        category: "Jewellery Stock", 
        value: inventorySummary.jewelleryStock.value,
        percentage: Math.round((inventorySummary.jewelleryStock.value / total) * 100)
      },
    ];
  };
  
  const inventoryDistribution = calculateInventoryDistribution();
  
  // Get date of most recent item added to inventory
  const getMostRecentDate = () => {
    const allDates = [
      ...looseStock.map(item => new Date(item.date)),
      ...certifiedStock.map(item => new Date(item.date)),
      ...jewelleryStock.map(item => new Date(item.date)),
    ];
    
    if (allDates.length === 0) return 'No items';
    
    const mostRecent = new Date(Math.max(...allDates.map(date => date.getTime())));
    return format(mostRecent, 'dd MMM yyyy');
  };

  return (
    <MainLayout title="Inventory Management">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Inventory Management</h1>
          <p className="text-neutral-500">Comprehensive view of all inventory items across categories</p>
        </div>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search inventory..."
            className="max-w-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button onClick={() => setSearchQuery("")} variant="outline" disabled={!searchQuery}>
            Clear
          </Button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold text-neutral-600">Total Inventory Value</h3>
            <p className="text-3xl font-bold text-primary mt-2">₹{formatCurrency(inventorySummary.totalValue)}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold text-neutral-600">Total Items</h3>
            <p className="text-3xl font-bold text-primary mt-2">{inventorySummary.totalCount}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold text-neutral-600">Most Valuable Category</h3>
            <p className="text-3xl font-bold text-primary mt-2">
              {inventoryDistribution.sort((a, b) => b.value - a.value)[0]?.category || 'N/A'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold text-neutral-600">Latest Addition</h3>
            <p className="text-3xl font-bold text-primary mt-2">{getMostRecentDate()}</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Inventory Overview */}
      <div className="mb-8">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-neutral-800 mb-4">Inventory Distribution</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {inventoryDistribution.map((item, index) => (
                <div key={index} className="border rounded-md p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">{item.category}</h4>
                    <Badge variant="outline">{item.percentage}%</Badge>
                  </div>
                  <p className="text-2xl font-bold">₹{formatCurrency(item.value)}</p>
                  <p className="text-sm text-neutral-500 mt-1">{
                    item.category === "Loose Stock" 
                      ? inventorySummary.looseStock.count 
                      : item.category === "Certified Stock" 
                        ? inventorySummary.certifiedStock.count 
                        : inventorySummary.jewelleryStock.count
                  } items</p>
                  <div className="w-full bg-neutral-100 rounded-full h-2.5 mt-2">
                    <div 
                      className="bg-primary h-2.5 rounded-full" 
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Inventory Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full mb-6">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="loose">Loose Stock</TabsTrigger>
          <TabsTrigger value="certified">Certified Stock</TabsTrigger>
          <TabsTrigger value="jewellery">Jewellery Stock</TabsTrigger>
        </TabsList>
        
        {/* Summary Tab */}
        <TabsContent value="summary">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Inventory Highlights</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <p className="font-medium">Loose Stock</p>
                        <p className="text-sm text-neutral-500">{inventorySummary.looseStock.count} items</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₹{formatCurrency(inventorySummary.looseStock.value)}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <p className="font-medium">Certified Stock</p>
                        <p className="text-sm text-neutral-500">{inventorySummary.certifiedStock.count} items</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₹{formatCurrency(inventorySummary.certifiedStock.value)}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <p className="font-medium">Jewellery Stock</p>
                        <p className="text-sm text-neutral-500">{inventorySummary.jewelleryStock.count} items</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₹{formatCurrency(inventorySummary.jewelleryStock.value)}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-primary/10 rounded-md">
                      <div>
                        <p className="font-medium">Total Inventory</p>
                        <p className="text-sm text-neutral-500">{inventorySummary.totalCount} items</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₹{formatCurrency(inventorySummary.totalValue)}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Recent Additions</h3>
                  <div className="space-y-3">
                    {[
                      ...looseStock.map(item => ({ ...item, type: 'loose' })),
                      ...certifiedStock.map(item => ({ ...item, type: 'certified' })),
                      ...jewelleryStock.map(item => ({ ...item, type: 'jewellery' }))
                    ]
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .slice(0, 5)
                      .map((item, index) => (
                        <div key={index} className="flex items-center p-3 border rounded-md">
                          <div className="mr-3">
                            <Badge variant={
                              item.type === 'loose' 
                                ? 'outline' 
                                : item.type === 'certified' 
                                  ? 'default' 
                                  : 'secondary'
                            }>
                              {item.type === 'loose' 
                                ? 'Loose' 
                                : item.type === 'certified' 
                                  ? 'Cert' 
                                  : 'Jewel'}
                            </Badge>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{
                              item.type === 'loose' 
                                ? (item as any).iteam + ' - ' + (item as any).shape
                                : item.type === 'certified' 
                                  ? (item as any).certi_no
                                  : (item as any).item
                            }</p>
                            <p className="text-xs text-neutral-500">{format(new Date(item.date), 'dd MMM yyyy')}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">₹{formatCurrency(
                              item.type === 'loose' 
                                ? (item as any).total
                                : item.type === 'certified' 
                                  ? (item as any).total
                                  : (item as any).value
                            )}</p>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <h3 className="text-lg font-semibold mb-4">Inventory Composition</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-md p-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Stock Types</h4>
                    <Badge variant="outline">{inventorySummary.totalCount} Total</Badge>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                      <span className="flex-1">Loose Stock</span>
                      <span className="font-medium">{inventorySummary.looseStock.count}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="flex-1">Certified Stock</span>
                      <span className="font-medium">{inventorySummary.certifiedStock.count}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                      <span className="flex-1">Jewellery Stock</span>
                      <span className="font-medium">{inventorySummary.jewelleryStock.count}</span>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Value Distribution</h4>
                    <Badge variant="outline">₹{formatCurrency(inventorySummary.totalValue)}</Badge>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                      <span className="flex-1">Loose Stock</span>
                      <span className="font-medium">₹{formatCurrency(inventorySummary.looseStock.value)}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="flex-1">Certified Stock</span>
                      <span className="font-medium">₹{formatCurrency(inventorySummary.certifiedStock.value)}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                      <span className="flex-1">Jewellery Stock</span>
                      <span className="font-medium">₹{formatCurrency(inventorySummary.jewelleryStock.value)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Average Value</h4>
                    <Badge variant="outline">Per Item</Badge>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                      <span className="flex-1">Loose Stock</span>
                      <span className="font-medium">₹{formatCurrency(
                        inventorySummary.looseStock.count > 0 
                          ? inventorySummary.looseStock.value / inventorySummary.looseStock.count 
                          : 0
                      )}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="flex-1">Certified Stock</span>
                      <span className="font-medium">₹{formatCurrency(
                        inventorySummary.certifiedStock.count > 0 
                          ? inventorySummary.certifiedStock.value / inventorySummary.certifiedStock.count 
                          : 0
                      )}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                      <span className="flex-1">Jewellery Stock</span>
                      <span className="font-medium">₹{formatCurrency(
                        inventorySummary.jewelleryStock.count > 0 
                          ? inventorySummary.jewelleryStock.value / inventorySummary.jewelleryStock.count 
                          : 0
                      )}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Loose Stock Tab */}
        <TabsContent value="loose">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Loose Stock Inventory</h3>
                <Button variant="outline" asChild>
                  <a href="/loose-stock">Manage Loose Stock</a>
                </Button>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Branch</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead>Shape</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead className="text-right">Value</TableHead>
                      <TableHead>Remarks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLooseStock.length > 0 ? (
                      filteredLooseStock.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.id}</TableCell>
                          <TableCell>{format(new Date(item.date), 'dd/MM/yyyy')}</TableCell>
                          <TableCell>{item.branch}</TableCell>
                          <TableCell>{item.iteam}</TableCell>
                          <TableCell>{item.shape}</TableCell>
                          <TableCell>{item.size}</TableCell>
                          <TableCell className="text-right">₹{item.total.toLocaleString()}</TableCell>
                          <TableCell>{item.remark || 'N/A'}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-6 text-neutral-500">
                          {searchQuery ? 'No matching loose stock items found.' : 'No loose stock items available.'}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Certified Stock Tab */}
        <TabsContent value="certified">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Certified Stock Inventory</h3>
                <Button variant="outline" asChild>
                  <a href="/certified-stock">Manage Certified Stock</a>
                </Button>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Certificate</TableHead>
                      <TableHead>Lab</TableHead>
                      <TableHead>Shape</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Color</TableHead>
                      <TableHead>Clarity</TableHead>
                      <TableHead className="text-right">Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCertifiedStock.length > 0 ? (
                      filteredCertifiedStock.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.id}</TableCell>
                          <TableCell>{format(new Date(item.date), 'dd/MM/yyyy')}</TableCell>
                          <TableCell>{item.certi_no}</TableCell>
                          <TableCell>{item.lab}</TableCell>
                          <TableCell>{item.shape}</TableCell>
                          <TableCell>{item.size}</TableCell>
                          <TableCell>{item.color}</TableCell>
                          <TableCell>{item.clarity}</TableCell>
                          <TableCell className="text-right">₹{item.total.toLocaleString()}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-6 text-neutral-500">
                          {searchQuery ? 'No matching certified stock items found.' : 'No certified stock items available.'}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Jewellery Stock Tab */}
        <TabsContent value="jewellery">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Jewellery Stock Inventory</h3>
                <Button variant="outline" asChild>
                  <a href="/jewellery-stock">Manage Jewellery Stock</a>
                </Button>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Gross Wt</TableHead>
                      <TableHead>Net Wt</TableHead>
                      <TableHead>Purity</TableHead>
                      <TableHead className="text-right">Value</TableHead>
                      <TableHead>Remarks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredJewelleryStock.length > 0 ? (
                      filteredJewelleryStock.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.id}</TableCell>
                          <TableCell>{format(new Date(item.date), 'dd/MM/yyyy')}</TableCell>
                          <TableCell>{item.item}</TableCell>
                          <TableCell>{item.type}</TableCell>
                          <TableCell>{item.gross_wt}g</TableCell>
                          <TableCell>{item.net_wt}g</TableCell>
                          <TableCell>{item.purity}</TableCell>
                          <TableCell className="text-right">₹{item.value.toLocaleString()}</TableCell>
                          <TableCell>{item.remark || 'N/A'}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-6 text-neutral-500">
                          {searchQuery ? 'No matching jewellery stock items found.' : 'No jewellery stock items available.'}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}