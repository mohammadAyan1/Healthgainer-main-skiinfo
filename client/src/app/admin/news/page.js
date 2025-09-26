"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { createNews, updateNews } from "@/redux/slices/news-slice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";

const NewsForm = ({ initialData = null, onSubmit }) => {
  const dispatch = useDispatch();

  const [formState, setFormState] = useState({
    label: "",
    link: "",
    image: null
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormState({
        label: initialData.label || "",
        link: initialData.link || "",
        image: null
      });
    }
  }, [initialData]);

  const handleInputChange = useCallback((field, value) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleFileChange = useCallback((e) => {
    handleInputChange('image', e.target.files[0]);
  }, [handleInputChange]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    const confirmSubmit = window.confirm(
      "Are you sure you want to submit the fields?"
    );
    if (!confirmSubmit) return;
    
    setSubmitting(true);

    const formData = new FormData();
    formData.append("label", formState.label);
    formData.append("link", formState.link);
    if (formState.image) formData.append("image", formState.image);

    try {
      if (initialData) {
        await dispatch(updateNews({ id: initialData._id, formData })).unwrap();
        toast.success("News updated");
      } else {
        await dispatch(createNews(formData)).unwrap();
        toast.success("News created");
      }
      onSubmit?.();

      setFormState({
        label: "",
        link: "",
        image: null
      });
    } catch (err) {
      toast.error("Failed to save news");
    } finally {
      setSubmitting(false);
    }
  }, [formState, initialData, dispatch, onSubmit]);

  const formTitle = useMemo(() => 
    initialData ? "Edit News" : "Add News",
    [initialData]
  );

  const buttonText = useMemo(() => {
    if (submitting) return "Saving...";
    return initialData ? "Update" : "Create";
  }, [submitting, initialData]);

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-4 border rounded shadow-sm space-y-3"
    >
      <h2 className="text-md font-semibold">{formTitle}</h2>

      <div className="space-y-1">
        <Label htmlFor="label" className="text-sm">Label</Label>
        <Input
          id="label"
          value={formState.label}
          onChange={(e) => handleInputChange('label', e.target.value)}
          placeholder="e.g. NDTV, India Today"
          className="text-sm"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="link" className="text-sm">Redirect Link</Label>
        <Input
          id="link"
          value={formState.link}
          onChange={(e) => handleInputChange('link', e.target.value)}
          placeholder="https://example.com"
          className="text-sm"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="image" className="text-sm">Upload Channel Logo</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="text-sm"
        />
      </div>

      <Button 
        type="submit" 
        disabled={submitting} 
        className="w-full text-sm py-2"
      >
        {buttonText}
      </Button>
    </form>
  );
};

export default NewsForm;