"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { fetchDeals, deleteDeal, updateDeal } from "@/redux/slices/deal-slice";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  defaultKeyboardCoordinateGetter,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Pencil, Trash, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import DealForm from "./page";

function SortableRow({ deal, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: deal._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr ref={setNodeRef} style={style} className="border-t bg-white">
      <td
        className="p-2 pl-6 cursor-grab select-none text-gray-500"
        {...attributes}
        {...listeners}
        title="Drag to reorder"
      >
        ☰
      </td>
      <td className="p-2">
        <Image
          src={deal.image}
          alt={deal.title}
          width={50}
          height={50}
          className="rounded object-contain"
        />
      </td>
      <td className="p-2 font-semibold">{deal.title}</td>
      <td className="p-2 text-sm text-gray-600">{deal.subtitle}</td>
      <td className="p-2 text-green-600 font-bold">{deal.price}</td>
      <td className="p-2 text-orange-500">{deal.tag || "-"}</td>
      <td className="p-2 space-x-2">
        <Button variant="outline" size="icon" onClick={() => onEdit(deal)}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="destructive"
          size="icon"
          onClick={() => onDelete(deal)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </td>
    </tr>
  );
}

export default function DealsTableLayout() {
  const dispatch = useDispatch();
  const { deals, loading } = useSelector((state) => state.deals);

  const [editData, setEditData] = useState(null);
  const [open, setOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [items, setItems] = useState([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: defaultKeyboardCoordinateGetter,
    })
  );

  useEffect(() => {
    dispatch(fetchDeals());
  }, [dispatch]);

  const sortedDeals = useMemo(() => {
    if (!deals?.length) return [];
    return [...deals].sort((a, b) => a.sno - b.sno);
  }, [deals]);

  useEffect(() => {
    setItems(sortedDeals);
  }, [sortedDeals]);

  const handleEdit = useCallback((deal) => {
    setEditData(deal);
    setOpen(true);
  }, []);

  const handleDelete = useCallback(
    async (id) => {
      try {
        await dispatch(deleteDeal(id)).unwrap();
        toast.success("Deal deleted successfully");
      } catch {
        toast.error("Failed to delete deal");
      } finally {
        setDeleteDialog({ open: false, id: null });
      }
    },
    [dispatch]
  );

  const handleSubmit = useCallback(() => {
    setOpen(false);
    setEditData(null);
  }, []);

  const handleDragEnd = useCallback(
    async (event) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = items.findIndex((item) => item._id === active.id);
      const newIndex = items.findIndex((item) => item._id === over.id);
      const reordered = arrayMove(items, oldIndex, newIndex);
      setItems(reordered);

      try {
        for (let i = 0; i < reordered.length; i++) {
          if (reordered[i].sno !== i + 1) {
            await dispatch(
              updateDeal({ id: reordered[i]._id, formData: { sno: i + 1 } })
            ).unwrap();
          }
        }
        dispatch(fetchDeals());
      } catch {
        toast.error("Failed to reorder deals");
      }
    },
    [items, dispatch]
  );

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Deal of the Day</h2>
        <Dialog
          open={open}
          onOpenChange={(val) => {
            setOpen(val);
            if (!val) setEditData(null);
          }}
        >
          <DialogTrigger asChild>
            <Button onClick={() => setEditData(null)}>Add Deal</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>{editData ? "Edit Deal" : "Add Deal"}</DialogTitle>
            <DealForm initialData={editData} onSubmit={handleSubmit} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded overflow-hidden">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map((item) => item._id)}
            strategy={verticalListSortingStrategy}
          >
            <table className="w-full table-auto text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-2 pl-6">#</th>
                  <th className="p-2">Image</th>
                  <th className="p-2">Title</th>
                  <th className="p-2">Subtitle</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">Tag</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((deal) => (
                  <SortableRow
                    key={deal._id}
                    deal={deal}
                    onEdit={handleEdit}
                    onDelete={() =>
                      setDeleteDialog({ open: true, id: deal._id })
                    }
                  />
                ))}
              </tbody>
            </table>
          </SortableContext>
        </DndContext>
      </div>

      <Dialog
        open={deleteDialog.open}
        onOpenChange={(val) => setDeleteDialog({ ...deleteDialog, open: val })}
      >
        <DialogContent>
          <DialogTitle>Are you sure you want to delete this deal?</DialogTitle>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, id: null })}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDelete(deleteDialog.id)}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
