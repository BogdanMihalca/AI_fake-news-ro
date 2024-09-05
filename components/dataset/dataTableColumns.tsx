import { DataTableColumnHeader } from "@/components/common/DataTable/DataTableCOlumnHeader";
import { ColumnDef } from "@tanstack/react-table";
import { TrashIcon, Pencil2Icon } from "@radix-ui/react-icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { filter } from "lodash";

export const getColumns = ({
  data = {},
  onDelete,
  onUpdated,
  onEdit,
  isAuth,
  hasPermission,
  availableTags,
}: {
  data: any;
  onDelete: (id: number) => void; //eslint-disable-line
  onUpdated: (id: number, tag: string) => void; //eslint-disable-line
  onEdit: (id: number) => void; //eslint-disable-line
  isAuth: boolean;
  hasPermission: boolean;
  availableTags: string[];
}) => {
  //generate columns based on the data type object keys

  const columns: ColumnDef<any>[] = filter(
    Object.keys(data),
    (k) => k !== "id"
  ).map((key: string) => {
    return {
      accessorKey: key,
      enableHiding: true,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={
            key === "tag"
              ? "Tag"
              : key === "displayId"
              ? "ID"
              : key === "content"
              ? "Content"
              : key
          }
        />
      ),
      cell: ({ row }) => {
        if (key === "tag" && isAuth)
          return (
            <div className="flex items-center">
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <span tabIndex={0}>
                      <Select
                        value={row.getValue(key) || "No data"}
                        onValueChange={(e) => {
                          onUpdated(row.original.id, e);
                        }}
                        disabled={!hasPermission}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue>
                            {row.getValue(key) || "No data"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {availableTags.map((tag) => (
                            <SelectItem key={tag} value={tag}>
                              {tag}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </span>
                  </TooltipTrigger>
                  {!hasPermission ? (
                    <TooltipContent>
                      <div className="flex items-center">
                        <span className="text-xs text-red-500">
                          You must be an admin to update tags
                        </span>
                      </div>
                    </TooltipContent>
                  ) : null}
                </Tooltip>
              </TooltipProvider>
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
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <span tabIndex={0}>
                      <button
                        className="text-red-500"
                        onClick={() => onDelete(row.original.id)}
                      >
                        <TrashIcon width={25} height={25} />
                      </button>
                      {/* edit button */}
                      <button
                        className="text-green-500 ml-4"
                        onClick={() => onEdit(row.original.id)}
                      >
                        <Pencil2Icon width={25} height={25} />
                      </button>
                    </span>
                  </TooltipTrigger>
                  {!hasPermission ? (
                    <TooltipContent>
                      <div className="flex items-center">
                        <span className="text-xs text-red-500">
                          You must be an admin to delete items
                        </span>
                      </div>
                    </TooltipContent>
                  ) : null}
                </Tooltip>
              </TooltipProvider>
            ) : (
              <p className="text-red-500 text-xs">Not authorized</p>
            )}
          </div>
        );
      },
    },
  ];
};
