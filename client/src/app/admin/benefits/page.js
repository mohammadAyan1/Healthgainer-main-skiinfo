"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const FORM_LABELS = {
  EDIT: "Edit Benefit",
  ADD: "Add New Benefit",
  TITLE: "Title",
  DESCRIPTION: "Description",
  UPLOAD_ICON: "Upload Icon"
};

const PLACEHOLDERS = {
  TITLE: "Enter title",
  DESCRIPTION: "Enter description"
};

const CONFIRM_MESSAGE = "Are you sure you want to submit the fields?";

const BenefitForm = ({ initialData = null, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: null
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        title: initialData.title || "",
        description: initialData.description || ""
      }));
    }
  }, [initialData]);

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleTitleChange = useCallback((e) => {
    handleInputChange('title', e.target.value);
  }, [handleInputChange]);

  const handleDescriptionChange = useCallback((e) => {
    handleInputChange('description', e.target.value);
  }, [handleInputChange]);

  const handleIconChange = useCallback((e) => {
    handleInputChange('icon', e.target.files[0] || null);
  }, [handleInputChange]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!window.confirm(CONFIRM_MESSAGE)) return;
    
    setLoading(true);

    try {
      if (onSubmit) {
        await onSubmit(formData);
        setFormData({ title: "", description: "", icon: null });
      }
    } catch (err) {
      console.error("Submit failed", err);
    } finally {
      setLoading(false);
    }
  }, [formData, onSubmit]);

  const isEditMode = Boolean(initialData);
  const buttonText = loading ? "Saving..." : (isEditMode ? "Update" : "Create");

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-6 border rounded-md space-y-4"
    >
      <h2 className="text-lg font-bold">
        {isEditMode ? FORM_LABELS.EDIT : FORM_LABELS.ADD}
      </h2>

      <div className="space-y-2">
        <Label htmlFor="title">{FORM_LABELS.TITLE}</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={handleTitleChange}
          placeholder={PLACEHOLDERS.TITLE}
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">{FORM_LABELS.DESCRIPTION}</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={handleDescriptionChange}
          placeholder={PLACEHOLDERS.DESCRIPTION}
          required
          disabled={loading}
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="icon">{FORM_LABELS.UPLOAD_ICON}</Label>
        <Input
          id="icon"
          type="file"
          accept="image/*"
          onChange={handleIconChange}
          disabled={loading}
        />
      </div>

      <Button 
        type="submit" 
        disabled={loading} 
        className="w-full"
        aria-label={buttonText}
      >
        {buttonText}
      </Button>
    </form>
  );
};

export default BenefitForm;