"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFeatures,
  createFeature,
  updateFeature,
  deleteFeature,
} from "@/redux/slices/why-choose/feature-slice/index";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Pencil, Trash } from "lucide-react";
import { toast } from "react-toastify";

const FeatureForm = ({ initialData = null, onSubmit }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [icon, setIcon] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (icon) formData.append("image", icon);

    try {
      if (initialData) {
        await dispatch(updateFeature({ id: initialData._id, formData })).unwrap();
        toast.success("Feature updated successfully");
      } else {
        await dispatch(createFeature(formData)).unwrap();
        toast.success("Feature created successfully");
      }

      if (onSubmit) onSubmit();
      setTitle("");
      setDescription("");
      setIcon(null);
    } catch (err) {
      toast.error("Failed to save feature");
      console.error("Feature form error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Title</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <Label>Description</Label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div>
        <Label>Upload Icon</Label>
        <Input type="file" accept="image/*" onChange={(e) => setIcon(e.target.files[0])} />
      </div>
      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? "Saving..." : initialData ? "Update" : "Create"}
      </Button>
    </form>
  );
};

const FeatureManager = () => {
  const dispatch = useDispatch();
  const { features, loading } = useSelector((state) => state.features);

  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchFeatures()).unwrap().catch(() => {
      toast.error("Failed to fetch features");
    });
  }, [dispatch]);

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      await dispatch(deleteFeature(itemToDelete._id)).unwrap();
      toast.success("Feature deleted");
    } catch (err) {
      toast.error("Failed to delete feature");
    } finally {
      setConfirmDeleteOpen(false);
      setItemToDelete(null);
    }
  };

  const handleSubmit = () => {
    setOpen(false);
    setEditData(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Manage Features</h2>
        <Dialog
          open={open}
          onOpenChange={(v) => {
            setOpen(v);
            if (!v) setEditData(null);
          }}
        >
          <DialogTrigger asChild>
            <Button onClick={() => setEditData(null)}>Add Feature</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>{editData ? "Edit Feature" : "Add Feature"}</DialogTitle>
            <FeatureForm initialData={editData} onSubmit={handleSubmit} />
          </DialogContent>
        </Dialog>
      </div>

      <Dialog
        open={confirmDeleteOpen}
        onOpenChange={(val) => {
          setConfirmDeleteOpen(val);
          if (!val) setItemToDelete(null);
        }}
      >
        <DialogContent>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <p>Are you sure you want to delete this feature?</p>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setConfirmDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        {features.map((item) => (
          <div key={item._id} className="p-4 border rounded-md shadow-sm bg-white space-y-2">
            <img src={item.imageUrl} alt="icon" className="w-12 h-12 object-contain" />
            <h3 className="font-semibold">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.description}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={() => {
                setEditData(item);
                setOpen(true);
              }}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => {
                  setItemToDelete(item);
                  setConfirmDeleteOpen(true);
                }}
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureManager;
