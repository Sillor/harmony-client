import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  ChevronDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@radix-ui/react-icons";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ImportFilePopup from "./ImportFilePopup";

import columns from "./columns";
import { fetchFileList } from "../../utils/fileManagement";

export default function FileManagement() {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  const [fileData, setFileData] = useState({});
  const [tableData, setTableData] = useState([]);
  const table = useReactTable({
    data: tableData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  let {chatId} = useParams();

  //obtain directory file
  useEffect(() => {
      fetchFileList(chatId).then(json => {
        setFileData(json);

      });
  }, []);

  //format fileData to be used as tableData 
  useEffect(() => {
      let emptyArray = [];
      for(let i in fileData.files){
        let type = fileData.files[i].name.split(".")[1] || 'folder'
        
        emptyArray.push({
          title: fileData.files[i].name,
          size: fileData.properties[i].size,
          date: fileData.properties[i].birthtimeMs,
          type: type,
          key: `key${i}`
        })
      }

      setTableData(emptyArray)
  }, [fileData])
  
  return (
    <div className="w-full h-full flex flex-col grow overflow-auto">
      <div className="flex items-center gap-6">
        <div className="text-3xl font-semibold">bun-bunnies</div>
        <div className="inline [&>svg]:inline [&>svg]:me-2 [&>svg]:h-6 [&>svg]:w-6">
          <ArrowLeftIcon />
          <ArrowRightIcon />
        </div>
      </div>
      <span className="ms-3">
        <span>/</span>
        <span className="underline px-1 cursor-pointer">main</span>
        <span>/</span>
        <span className="underline px-1 cursor-pointer">src</span>
        <span>/</span>
        {
          fileData.dirName && 
          <>
            <span className="underline px-1 cursor-pointer">{fileData.dirName[0]}</span>
            <span>/</span>
            <span className="underline px-1 cursor-pointer">{fileData.dirName[1]}</span>
          </>
        }
      </span>
      <div className="flex items-center py-4 gap-3">
        <Input
          placeholder="Filter file..."
          value={table.getColumn("title")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm h-8"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="h-8">
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
        <ImportFilePopup onFile={() => {
            fetchFileList(chatId).then(json => {
              setFileData(json);
            });
          }} />
      </div>
      <div className="grow overflow-auto">
        <div className="rounded-md border border-input max-h-full overflow-auto">
          <Table className="overflow-auto">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-input">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className="has-[button:not([role='checkbox'])]:px-0"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="overflow-auto">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="border-input"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="flex items-center justify-end space-x-2 pt-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
