"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { createDeal, updateDeal } from "@/redux/slices/deal-slice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";

const DealForm = ({ initialData = null, onSubmit }) => {
  const dispatch = useDispatch();

  const defaultState = useMemo(
    () => ({
      title: "",
      subtitle: "",
      price: "",
      quantity: "",
      tag: "",
      image: null,
    }),
    []
  );

  const [formState, setFormState] = useState(defaultState);
  const [formSubmitting, setFormSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormState((prev) => ({
        ...prev,
        title: initialData.title || "",
        subtitle: initialData.subtitle || "",
        price: initialData.price || "",
        quantity: initialData.quantity || "",
        tag: initialData.tag || "",
      }));
    }
  }, [initialData]);

  const handleChange = (field) => (e) => {
    const value = field === "image" ? e.target.files[0] : e.target.value;
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!window.confirm("Are you sure you want to submit the fields?"))
        return;

      setFormSubmitting(true);

      const formData = new FormData();
      Object.entries(formState).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      try {
        if (initialData) {
          await dispatch(
            updateDeal({ id: initialData._id, formData })
          ).unwrap();
          toast.success("Deal updated successfully!");
        } else {
          await dispatch(createDeal(formData)).unwrap();
          toast.success("Deal created successfully!");
        }

        onSubmit?.();
        setFormState(defaultState);
      } catch (error) {
        console.error("Submit failed", error);
        toast.error("Something went wrong. Please try again.");
      } finally {
        setFormSubmitting(false);
      }
    },
    [dispatch, formState, initialData, onSubmit, defaultState]
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-6 border rounded-md shadow space-y-4"
    >
      <h2 className="text-lg font-bold">
        {initialData ? "Edit Deal" : "Add New Deal"}
      </h2>

      <div className="space-y-2">
        <Label>Title</Label>
        <Input value={formState.title} onChange={handleChange("title")} />
      </div>

      <div className="space-y-2">
        <Label>Subtitle</Label>
        <Input value={formState.subtitle} onChange={handleChange("subtitle")} />
      </div>

      <div className="flex gap-4">
        <div className="space-y-2 flex-1">
          <Label>Price</Label>
          <Input value={formState.price} onChange={handleChange("price")} />
        </div>

        <div className="space-y-2 flex-1">
          <Label>Quantity</Label>
          <Input
            type="number"
            value={formState.quantity}
            onChange={handleChange("quantity")}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Tag (optional)</Label>
        <Input
          value={formState.tag}
          onChange={handleChange("tag")}
          placeholder="e.g. HOT DEAL"
        />
      </div>

      <div className="space-y-2">
        <Label>Upload Image</Label>
        <Input type="file" accept="image/*" onChange={handleChange("image")} />
      </div>

      <Button type="submit" disabled={formSubmitting} className="w-full">
        {formSubmitting ? "Saving..." : initialData ? "Update" : "Create"}
      </Button>
    </form>
  );
};

export default DealForm;
