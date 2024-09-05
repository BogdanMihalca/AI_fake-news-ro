import { DataSetItem } from "@prisma/client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useState } from "react";
import { useSession } from "next-auth/react";

interface CreateEditItemDialogProps {
  onClose: () => void;
  onSave: (item: DataSetItem) => void; //eslint-disable-line
  item?: DataSetItem;
  availableTags: string[];
}

const CreateEditItemDialog: React.FC<CreateEditItemDialogProps> = ({
  onClose,
  onSave,
  item,
  availableTags,
}) => {
  const session = useSession();
  const [tag, setTag] = useState(item?.tag || "");
  const [content, setContent] = useState(item?.content || "");

  const handleSave = () => {
    onSave({
      ...item,
      tag: tag || "",
      content: content || "",
      id: item?.id || 0,
      createdBy: item?.createdBy || session?.data?.user?.email || "-",
      updatedBy: session?.data?.user?.email || "-",
      createdAt: item?.createdAt || new Date(),
      updatedAt: new Date(),
    });
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{item?.id ? "Editeaza" : "Creaza"}</DialogTitle>
          <DialogDescription>
            {item?.id
              ? "Editeaza informatiile item-ului."
              : "Completeaza informatiile item-ului."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="content" className="text-right">
              Continut
            </Label>
            <Textarea
              id="content"
              className="col-span-3 min-h-[300px]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Tag
            </Label>
            <Select
              value={tag}
              onValueChange={(e) => {
                setTag(e);
              }}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue />
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
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Anuleaza
          </Button>
          <Button type="submit" onClick={handleSave}>
            {item?.id ? "Salveaza" : "Creaza"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { CreateEditItemDialog };
