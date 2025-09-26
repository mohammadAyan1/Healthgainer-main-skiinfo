"use client";

import { useEffect, useState, useCallback, memo } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNews,
  deleteNews,
} from "@/redux/slices/news-slice";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Pencil, Trash, Loader2 } from "lucide-react";
import NewsForm from "./page";
import { toast } from "react-toastify";
import ConfirmDelete from "@/components/common/ConfirmDelete";

const NewsCard = memo(({ item, onEdit, onDelete }) => {
  return (
    <div className="bg-white border rounded p-3 flex flex-col items-center shadow-sm text-center">
      <Image
        src={item.imageUrl}
        alt={item.label}
        width={80}
        height={80}
        className="object-contain rounded"
        loading="lazy"
      />
      <p className="mt-1 font-medium text-sm">{item.label}</p>

      <div className="flex gap-1 mt-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onEdit(item)}
          className="h-8 w-8"
        >
          <Pencil className="w-3 h-3" />
        </Button>
        <Button
          variant="destructive"
          size="icon"
          onClick={() => onDelete(item._id)}
          className="h-8 w-8"
        >
          <Trash className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
});

NewsCard.displayName = 'NewsCard';

export default function NewsSection() {
  const dispatch = useDispatch();
  const { news, loading } = useSelector((state) => state.news);
  const [editData, setEditData] = useState(null);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    dispatch(fetchNews());
  }, [dispatch]);

  const handleEdit = useCallback((item) => {
    setEditData(item);
    setOpen(true);
  }, []);

  const handleSubmit = useCallback(() => {
    setOpen(false);
    setEditData(null);
  }, []);

  const confirmDelete = useCallback((id) => {
    setDeleteId(id);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteId) return;
    
    try {
      await dispatch(deleteNews(deleteId)).unwrap();
      toast.success("News item deleted successfully");
    } catch (err) {
      toast.error("Failed to delete news item");
    } finally {
      setDeleteId(null);
    }
  }, [deleteId, dispatch]);

  const handleDialogChange = useCallback((val) => {
    setOpen(val);
    if (!val) setEditData(null);
  }, []);

  const handleAddClick = useCallback(() => {
    setEditData(null);
  }, []);

  const handleDeleteCancel = useCallback(() => {
    setDeleteId(null);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <Loader2 className="w-5 h-5 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">News Section</h2>

        <Dialog open={open} onOpenChange={handleDialogChange}>
          <DialogTrigger asChild>
            <Button onClick={handleAddClick} size="sm">Add News</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogTitle className="text-base font-semibold">
              {editData ? "Edit News" : "Add News"}
            </DialogTitle>
            <NewsForm initialData={editData} onSubmit={handleSubmit} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {news.map((item) => (
          <NewsCard
            key={item._id}
            item={item}
            onEdit={handleEdit}
            onDelete={confirmDelete}
          />
        ))}
      </div>

      <ConfirmDelete
        open={!!deleteId}
        onConfirm={handleConfirmDelete}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
}