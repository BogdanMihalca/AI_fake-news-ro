import { DataTableColumnHeader } from "@/components/common/DataTable/DataTableCOlumnHeader";
import { ColumnDef } from "@tanstack/react-table";
import { TrashIcon } from "@radix-ui/react-icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const getColumns = ({
  data = {},
  onDelete,
  onUpdated,
  isAuth,
  availableTags,
}: {
  data: any;
  onDelete: (id: number) => void;
  onUpdated: (id: number, tag: string) => void;
  isAuth: boolean;
  availableTags: string[];
}) => {
  //generate columns based on the data type object keys

  const columns: ColumnDef<any>[] = Object.keys(data).map((key: string) => {
    return {
      accessorKey: key,
      enableHiding: true,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={key} />
      ),
      cell: ({ row }) => {
        if (key === "tag" && isAuth)
          return (
            <div className="flex items-center">
              <Select
                value={row.getValue(key) || "No data"}
                onValueChange={(e) => {
                  onUpdated(row.original.id, e);
                }}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue>{row.getValue(key) || "No data"}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {availableTags.map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        return (
          <div className="flex items-center">
            <span className="text-sm">{row.getValue(key) || "No data"}</span>
          </div>
        );
      },
    };
  });

  return [
    ...columns,
    {
      accessorKey: "actions",
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="Actions" />
      ),
      cell: ({ row }: any) => {
        return (
          <div className="flex items-center">
            {isAuth ? (
              <button
                className="text-red-500"
                onClick={() => onDelete(row.original.id)}
              >
                <TrashIcon width={25} height={25} />
              </button>
            ) : (
              <p className="text-red-500 text-xs">Not authorized</p>
            )}
          </div>
        );
      },
    },
  ];
};
