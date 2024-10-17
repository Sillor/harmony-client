import {
  CaretSortIcon,
  DotsHorizontalIcon,
  Share1Icon,
  Pencil1Icon,
  DownloadIcon,
  TrashIcon,
  CopyIcon,
} from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { useParams } from "react-router-dom";
import {fileDelete, fileDuplicate, fileDownload, fileRename} from '../../utils/fileManagement'
export default [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("title")}</div>,
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date Created
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">
        {new Date(row.getValue("date")).toLocaleDateString()}
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Type
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="font-medium capitalize">{row.getValue("type")}</div>
      );
    },
  },
  {
    accessorKey: "size",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Size
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium capitalize">
          {row.getValue("size")}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;
      let params = useParams();
      let chatId = params.chatId;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
            onClick={e => {
                fileRename(e, chatId, row.getValue("title"), row.original.fileId, row.getValue("type"))
                 window.location.reload();
                }}>
              <Pencil1Icon />
              <div className="ps-2">Rename</div>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={e => {
                fileDownload(e, chatId, row.original.fileId, row.getValue("type"))
                }}>
              <DownloadIcon />
              <div className="ps-2">Save
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={e => {
                fileDuplicate(e, chatId, row.getValue("title"), row.original.fileId, row.getValue("type"))
                window.location.reload();
                }}>
              <CopyIcon />
              <div className="ps-2" >Duplicate
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Share1Icon />
              <div className="ps-2">Share</div>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-500 focus:text-red-500" 
              onClick={e => {
                fileDelete(e, chatId, row.getValue("title"), row.original.fileId, row.getValue("type"))
                window.location.reload();
                }}>
              <TrashIcon />
              <div className="ps-2">Delete</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
