import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { 
  LooseStock,
  CertifiedStock,
  JewelleryStock
} from "@shared/schema";

interface StockTableProps<T> {
  data: T[];
  type: "loose" | "certified" | "jewellery";
  onView?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
}

export function StockTable<T>({ 
  data, 
  type, 
  onView, 
  onEdit, 
  onDelete 
}: StockTableProps<T>) {
  const getColumns = () => {
    switch (type) {
      case "loose":
        return [
          {
            header: "Item Code",
            accessor: (row: any) => (
              <span className="font-medium text-primary">{row.itemCode}</span>
            ),
            sortable: true,
          },
          {
            header: "Stone Type",
            accessor: "stoneType",
            sortable: true,
          },
          {
            header: "Shape",
            accessor: "shape",
            sortable: true,
          },
          {
            header: "Carat",
            accessor: (row: any) => (
              <span>{row.carat.toString()}</span>
            ),
            sortable: true,
          },
          {
            header: "Color/Clarity",
            accessor: (row: any) => (
              <span>{row.color || "-"}/{row.clarity || "-"}</span>
            ),
          },
          {
            header: "Quantity",
            accessor: "quantity",
            sortable: true,
          },
          {
            header: "Price",
            accessor: (row: any) => (
              <span className="font-medium">{formatCurrency(Number(row.sellingPrice))}</span>
            ),
            sortable: true,
          },
          {
            header: "Location",
            accessor: "location",
          }
        ];
      case "certified":
        return [
          {
            header: "Item Code",
            accessor: (row: any) => (
              <span className="font-medium text-primary">{row.itemCode}</span>
            ),
            sortable: true,
          },
          {
            header: "Certificate",
            accessor: (row: any) => (
              <div>
                <div className="font-medium">{row.certificateNumber}</div>
                <div className="text-xs text-muted-foreground">{row.laboratory}</div>
              </div>
            ),
            sortable: true,
          },
          {
            header: "Stone Type",
            accessor: "stoneType",
            sortable: true,
          },
          {
            header: "Details",
            accessor: (row: any) => (
              <div>
                <div>{row.shape}, {row.carat.toString()} cts</div>
                <div className="text-xs text-muted-foreground">
                  {row.color || "-"}/{row.clarity || "-"}/{row.cut || "-"}
                </div>
              </div>
            ),
          },
          {
            header: "Price",
            accessor: (row: any) => (
              <span className="font-medium">{formatCurrency(Number(row.sellingPrice))}</span>
            ),
            sortable: true,
          },
          {
            header: "Location",
            accessor: "location",
          }
        ];
      case "jewellery":
        return [
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
            header: "Category",
            accessor: "category",
            sortable: true,
          },
          {
            header: "Metal",
            accessor: (row: any) => (
              <div>
                <div>{row.metalType}</div>
                <div className="text-xs text-muted-foreground">{row.metalWeight} g</div>
              </div>
            ),
          },
          {
            header: "Weight",
            accessor: (row: any) => (
              <span>{row.grossWeight} g</span>
            ),
            sortable: true,
          },
          {
            header: "Price",
            accessor: (row: any) => (
              <span className="font-medium">{formatCurrency(Number(row.sellingPrice))}</span>
            ),
            sortable: true,
          },
          {
            header: "Location",
            accessor: "location",
          }
        ];
      default:
        return [];
    }
  };

  return (
    <DataTable
      columns={getColumns()}
      data={data}
      keyField="id"
      actionComponent={(row) => (
        <div className="flex space-x-2">
          {onView && (
            <Button variant="outline" size="sm" onClick={() => onView(row)}>
              <i className="fas fa-eye mr-1"></i> View
            </Button>
          )}
          {onEdit && (
            <Button variant="outline" size="sm" onClick={() => onEdit(row)}>
              <i className="fas fa-pen mr-1"></i> Edit
            </Button>
          )}
          {onDelete && (
            <Button variant="outline" size="sm" className="text-error" onClick={() => onDelete(row)}>
              <i className="fas fa-trash-alt mr-1"></i> Delete
            </Button>
          )}
        </div>
      )}
    />
  );
}
