"use client";

import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createImage,
  updateImage,
  clearImageState,
} from "@/redux/slices/header-slice/imageSlice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-toastify";

const HeaderImageSlider = ({ initialData = null, onSubmit }) => {
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector(
    (state) => state.headerSlider
  );
  const [images, setImages] = useState([]);
  const [sourceUrl, setSourceUrl] = useState("");
  const [viewType, setViewType] = useState("desktop");

  useEffect(() => {
    if (initialData) {
      setSourceUrl(initialData.sourceUrl || initialData.url || "");
      setViewType(initialData.viewType || "desktop");
    }
  }, [initialData]);

  const handleImageUpload = useCallback((e) => {
    setImages(e.target.files);
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!window.confirm("Are you sure you want to submit the fields?"))
        return;

      try {
        if (initialData) {
          await dispatch(
            updateImage({ id: initialData._id, sourceUrl, viewType })
          ).unwrap();
          toast.success("Image updated successfully");
        } else {
          if (!images || images.length === 0) {
            toast.error("Please select image(s).");
            return;
          }

          const formData = new FormData();
          Array.from(images).forEach((file) => formData.append("images", file));
          formData.append("viewType", viewType);

          await dispatch(createImage(formData)).unwrap();
          toast.success("Image uploaded successfully");
        }

        onSubmit?.();
      } catch {
        toast.error("Operation failed");
      }
    },
    [dispatch, images, initialData, sourceUrl, viewType, onSubmit]
  );

  useEffect(() => {
    if (success || error) {
      setImages([]);
      setSourceUrl("");
      dispatch(clearImageState());
    }
  }, [success, error, dispatch]);

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-6 border rounded-md shadow space-y-4"
    >
      <h2 className="text-lg font-bold">
        {initialData ? "Edit Header Image" : "Upload Header Slider Images"}
      </h2>

      <div className="space-y-2">
        <Label>View Type</Label>
        <Select value={viewType} onValueChange={setViewType}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select view type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desktop">Desktop</SelectItem>
            <SelectItem value="mobile">Mobile</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image-upload">
          {initialData ? "Upload new image (optional)" : "Choose Image(s)"}
        </Label>
        <Input
          id="image-upload"
          type="file"
          accept="image/*"
          multiple={!initialData}
          onChange={handleImageUpload}
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading
          ? initialData
            ? "Updating..."
            : "Uploading..."
          : initialData
          ? "Update Image"
          : "Upload Images"}
      </Button>
    </form>
  );
};

export default HeaderImageSlider;
