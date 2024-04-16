import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import formatFileSize from "../../utils/formatFileSIze";
import { DialogClose } from "@radix-ui/react-dialog";
import { fileUpload } from "../../utils/fileManagement";
import { useParams } from "react-router-dom";
/**
 * @callback FileCallback
 * @param {File} file
 * @returns {void}
 */

/**
 * @param {{onFile: FileCallback}} param0
 * @returns
 */
export default function ImportFilePopup({ onFile }) {
  const [file, setFile] = useState(null);
  let {chatId} = useParams();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="h-8">Import</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import File</DialogTitle>
          <DialogDescription>
            {file
              ? "Do you want to import this file?"
              : "Click or Drop to import file"}
          </DialogDescription>
        </DialogHeader>
        <div className={`w-full ${file ? "" : "h-36"}`}>
          {file ? (
            <code className="flex justify-between">
              <div>{file.name}</div>
              <div>{formatFileSize(file.size)}</div>
            </code>
          ) : (
            <Label
              htmlFor="importFilePopupElement"
              className="w-full h-full relative"
            >
              <div className="border-muted-foreground border border-dashed rounded-sm w-full h-full flex justify-center items-center text-muted-foreground">
                {file ? file.name : <PlusIcon className="w-10 h-10" />}
              </div>
              <Input
                id="importFilePopupElement"
                type="file"
                className="absolute top-0 left-0 w-full h-full opacity-0"
                onInput={(e) => {
                  const target = e.currentTarget;
                  const f = target.files[0];
                  if (!f) return;
                  setFile(f);
                }}
              />
            </Label>
          )}
        </div>
        {file && (
          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="submit"
                variant="destructive"
                onClick={() => {
                  setFile(null);
                }}
              >
                Cancel
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                type="submit"
                onClick={() => {
                  fileUpload(file, chatId);
                  onFile && onFile(file);
                  setFile(null);
                }}
              >
                Confirm
              </Button>
            </DialogClose>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
