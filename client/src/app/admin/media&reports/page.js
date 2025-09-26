"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createMediaReport,
  updateMediaReport,
} from "@/redux/slices/mediaReport-slice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const MediaReportForm = ({ initialData = null, onSubmit }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.mediaReports);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    url: "",
    icon: null
  });

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        title: initialData.title || "",
        description: initialData.description || "",
        url: initialData.url || ""
      }));
    }
  }, [initialData]);

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleFileChange = useCallback((e) => {
    handleInputChange('icon', e.target.files[0]);
  }, [handleInputChange]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    const confirmSubmit = window.confirm(
      "Are you sure you want to submit the fields?"
    );
    if (!confirmSubmit) return;

    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("description", formData.description);
    submitData.append("url", formData.url);
    if (formData.icon) submitData.append("icon", formData.icon);

    try {
      if (initialData) {
        await dispatch(updateMediaReport({ 
          id: initialData._id, 
          formData: submitData 
        })).unwrap();
      } else {
        await dispatch(createMediaReport(submitData)).unwrap();
      }

      setFormData({
        title: "",
        description: "",
        url: "",
        icon: null
      });

      onSubmit?.(true);
    } catch (err) {
      onSubmit?.(false);
    }
  }, [formData, initialData, dispatch, onSubmit]);

  const buttonText = useMemo(() => {
    if (loading) {
      return initialData ? "Updating..." : "Creating...";
    }
    return initialData ? "Update" : "Create";
  }, [loading, initialData]);

  const formTitle = useMemo(() => 
    initialData ? "Edit Media Report" : "Add New Media Report",
    [initialData]
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-4 border rounded shadow-sm space-y-3"
    >
      <h2 className="text-md font-semibold">{formTitle}</h2>

      <div className="space-y-1">
        <Label htmlFor="title" className="text-sm">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="Enter title"
          className="text-sm"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="description" className="text-sm">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Enter description"
          className="text-sm min-h-[80px]"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="url" className="text-sm">Report URL</Label>
        <Input
          id="url"
          type="url"
          value={formData.url}
          onChange={(e) => handleInputChange('url', e.target.value)}
          placeholder="https://example.com/article"
          className="text-sm"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="icon" className="text-sm">Upload Icon</Label>
        <Input
          id="icon"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="text-sm"
        />
      </div>

      <Button 
        type="submit" 
        disabled={loading} 
        className="w-full text-sm py-2"
      >
        {buttonText}
      </Button>
    </form>
  );
};

export default MediaReportForm;