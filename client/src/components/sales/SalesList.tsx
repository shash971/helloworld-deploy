import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { DataTable } from "@/components/ui/data-table";
import { API_BASE_URL, getAuthHeader } from "@/lib/auth";
import { formatCurrency, formatDate } from "@/lib/utils";

interface SalesItem {
  id: number;
  invoiceNumber: string;
  date: Date;
  customerName: string;
  totalAmount: number;
  paymentStatus: string;
  items: string;
}

export function SalesList() {
  const [salesData, setSalesData] = useState<SalesItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the sales data from the backend
  const fetchSales = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/sales/`, {
        headers: {
          ...getAuthHeader()
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching sales: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Received sales data:", data);
      
      // Transform the backend data to our frontend format
      if (Array.isArray(data) && data.length > 0) {
        const transformedData = data.map((sale: any, index: number) => ({
          id: sale.id || index + 1,
          invoiceNumber: `SL-${70000 + index}`,
          date: new Date(sale.date),
          customerName: sale.customer || 'Customer',
          totalAmount: parseFloat(sale.total?.toString() || '0'),
          paymentStatus: sale.pay_mode || 'Pending',
          items: sale.iteam || 'Jewelry Item',
        }));
        
        setSalesData(transformedData);
      } else {
        console.log("No sales data returned or empty array");
      }
    } catch (err) {
      console.error("Error fetching sales:", err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  // On initial load, fetch the sales data
  useEffect(() => {
    fetchSales();
  }, []);
  
  const columns = [
    {
      header: "Invoice Number",
      accessor: (row: SalesItem) => (
        <span className="font-medium text-primary">{row.invoiceNumber}</span>
      ),
      sortable: true,
    },
    {
      header: "Date",
      accessor: (row: SalesItem) => formatDate(row.date),
      sortable: true,
    },
    {
      header: "Customer",
      accessor: "customerName",
      sortable: true,
    },
    {
      header: "Items",
      accessor: "items",
    },
    {
      header: "Amount",
      accessor: (row: SalesItem) => (
        <span className="font-medium">{formatCurrency(row.totalAmount)}</span>
      ),
      sortable: true,
    },
    {
      header: "Status",
      accessor: (row: SalesItem) => (
        <StatusBadge type="status" value={row.paymentStatus} />
      ),
    },
  ];
  
  return (
    <Card>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <p>Loading sales data...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-32">
            <p className="text-red-500">Error: {error}</p>
            <Button variant="outline" className="ml-2" onClick={fetchSales}>
              Retry
            </Button>
          </div>
        ) : salesData.length === 0 ? (
          <div className="flex justify-center items-center h-32">
            <p>No sales records found. Start by creating a new sale.</p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={salesData}
            keyField="id"
            actionComponent={(row) => (
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <i className="fas fa-eye mr-1"></i> View
                </Button>
                <Button variant="outline" size="sm">
                  <i className="fas fa-print mr-1"></i> Print
                </Button>
              </div>
            )}
          />
        )}
      </CardContent>
    </Card>
  );
}