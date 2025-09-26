"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSupplements,
  updateSupplement,
  deleteSupplement,
  createSupplement,
} from "@/redux/slices/supplement-slice";

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
import SupplementForm from "./page";
import ConfirmDelete from "@/components/common/ConfirmDelete";
import { toast } from "react-toastify";

function SortableRow({ supplement, index, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: supplement._id });

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
          src={supplement.iconUrl}
          alt="supplement icon"
          width={40}
          height={40}
          className="rounded"
        />
      </td>
      <td className="p-2 font-medium">{supplement.title}</td>
      <td className="p-2 max-w-60">
        {supplement.description?.length > 400
          ? supplement.description.slice(0, 400) + "..."
          : supplement.description}
      </td>
      <td className="p-2 space-x-2">
        <Button variant="outline" size="icon" onClick={() => onEdit(supplement)}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="destructive" size="icon" onClick={() => onDelete(supplement)}>
          <Trash className="h-4 w-4" />
        </Button>
      </td>
    </tr>
  );
}

export default function SupplementTable() {
  const dispatch = useDispatch();
  const { supplements, loading } = useSelector((state) => state.supplements);

  const [items, setItems] = useState([]);
  const [editData, setEditData] = useState(null);
  const [open, setOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: defaultKeyboardCoordinateGetter })
  );

  useEffect(() => {
    dispatch(fetchSupplements());
  }, [dispatch]);

  useEffect(() => {
    if (supplements?.length) {
      const sorted = [...supplements].sort((a, b) => a.sno - b.sno);
      setItems(sorted);
    }
  }, [supplements]);

  const handleEdit = (supplement) => {
    setEditData(supplement);
    setOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await dispatch(deleteSupplement(deleteTarget._id)).unwrap();
      toast.success("Supplement deleted");
    } catch (err) {
      toast.error("Failed to delete");
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleSubmit = async () => {
    // Refresh already handled via slice
  };

  const handleDragEnd = async (event) => {
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
            updateSupplement({ id: reordered[i]._id, formData: { sno: i + 1 } })
          ).unwrap();
        }
      }
    } catch (err) {
      toast.error("Failed to reorder");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-6">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Supplements Section</h2>

        <Dialog
          open={open}
          onOpenChange={(val) => {
            setOpen(val);
            if (!val) setEditData(null);
          }}
        >
          <DialogTrigger asChild>
            <Button onClick={() => setEditData(null)}>Add Supplement</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>{editData ? "Edit Supplement" : "Add Supplement"}</DialogTitle>
            <SupplementForm
              initialData={editData}
              onSubmit={handleSubmit}
              onClose={() => {
                setOpen(false);
                setEditData(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md overflow-hidden">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map((b) => b._id)}
            strategy={verticalListSortingStrategy}
          >
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="p-2 text-left">Reorder</th>
                  <th className="p-2 text-left">Icon</th>
                  <th className="p-2 text-left">Title</th>
                  <th className="p-2 text-left">Description</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((supplement, index) => (
                  <SortableRow
                    key={supplement._id}
                    supplement={supplement}
                    index={index}
                    onEdit={handleEdit}
                    onDelete={() => setDeleteTarget(supplement)}
                  />
                ))}
              </tbody>
            </table>
          </SortableContext>
        </DndContext>
      </div>

      <ConfirmDelete
        open={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
