"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Pencil, Trash, Loader2 } from "lucide-react";
import YourForm from "./page";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllImages,
  deleteImage,
  updateImage,
} from "@/redux/slices/header-slice/imageSlice";
import dynamic from "next/dynamic";
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
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ConfirmDelete from "@/components/common/ConfirmDelete";

const { toast } = dynamic(() => import("react-toastify"), { ssr: false });

const SortableRow = React.memo(function SortableRow({
  img,
  handleEdit,
  confirmDelete,
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: img._id });

  const style = { transform: CSS.Transform.toString(transform), transition };

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
          src={img.url}
          alt={img._id}
          width={60}
          height={60}
          className="rounded-md object-cover"
        />
      </td>
      <td className="p-2">{img.type || "Untitled"}</td>
      <td className="p-2 space-x-2">
        <Button variant="outline" size="icon" onClick={() => handleEdit(img)}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="destructive"
          size="icon"
          onClick={() => confirmDelete(img._id)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </td>
    </tr>
  );
});

export default function ImageTable() {
  const dispatch = useDispatch();
  const { images, loading } = useSelector((state) => state.headerSlider || {});
  const [open, setOpen] = useState(false);
  const [editImage, setEditImage] = useState(null);
  const [items, setItems] = useState([]);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    dispatch(fetchAllImages());
  }, [dispatch]);

  useEffect(() => {
    if (images) {
      const sorted = [...images].sort((a, b) => a.sno - b.sno);
      setItems(sorted);
    }
  }, [images]);

  const confirmDelete = useCallback((id) => setDeleteId(id), []);

  const handleDelete = useCallback(async () => {
    try {
      await dispatch(deleteImage(deleteId)).unwrap();
      (await toast).success("Image deleted successfully");
    } catch {
      (await toast).error("Failed to delete image");
    } finally {
      setDeleteId(null);
    }
  }, [deleteId, dispatch]);

  const handleEdit = useCallback((image) => {
    setEditImage(image);
    setOpen(true);
  }, []);

  const handleFormSubmit = useCallback(() => {
    setOpen(false);
    setEditImage(null);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: defaultKeyboardCoordinateGetter,
    })
  );

  const handleDragEnd = useCallback(
    async (event) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = items.findIndex((i) => i._id === active.id);
      const newIndex = items.findIndex((i) => i._id === over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);

      try {
        for (let i = 0; i < newItems.length; i++) {
          const image = newItems[i];
          if (image.sno !== i + 1) {
            await dispatch(updateImage({ id: image._id, sno: i + 1 })).unwrap();
          }
        }
      } catch {
        (await toast).error("Reordering failed");
      }
    },
    [items, dispatch]
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center p-6">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Image Gallery</h2>

        <Dialog
          open={open}
          onOpenChange={(val) => {
            setOpen(val);
            if (!val) setEditImage(null);
          }}
        >
          <DialogTrigger asChild>
            <Button onClick={() => setEditImage(null)}>Add Image</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>{editImage ? "Edit Image" : "Add Image"}</DialogTitle>
            <YourForm initialData={editImage} onSubmit={handleFormSubmit} />
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
            items={items.map((img) => img._id)}
            strategy={verticalListSortingStrategy}
          >
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="p-2 text-left">Re-Order</th>
                  <th className="p-2 text-left">Image</th>
                  <th className="p-2 text-left">View Type</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((img) => (
                  <SortableRow
                    key={img._id}
                    img={img}
                    handleEdit={handleEdit}
                    confirmDelete={confirmDelete}
                  />
                ))}
              </tbody>
            </table>
          </SortableContext>
        </DndContext>
      </div>

      <ConfirmDelete
        open={!!deleteId}
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
