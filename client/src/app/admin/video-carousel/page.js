"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createVideo,
  updateVideo,
} from "@/redux/slices/video-carousel-slice";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";

export default function VideoForm({ initialData = null, onSubmit }) {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.videos);

  const [name, setName] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setVideoUrl(initialData.videoUrl || "");
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    const confirmSubmit = window.confirm(
      "Are you sure you want to submit the fields?"
    );
    if (!confirmSubmit) return;
    e.preventDefault();
    setSubmitting(true);
    const formData = { name, videoUrl };

    try {
      if (initialData) {
        await dispatch(updateVideo({ id: initialData._id, formData })).unwrap();
        toast.success("Video updated");
      } else {
        await dispatch(createVideo(formData)).unwrap();
        toast.success("Video uploaded");
      }
      if (onSubmit) onSubmit();
      setName("");
      setVideoUrl("");
    } catch (err) {
      toast.error("Failed to save video");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Video Title</Label>
        <Input
          type="text"
          placeholder="Enter video name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <Label>Video URL</Label>
        <Input
          type="text"
          placeholder="Enter YouTube, Vimeo or MP4 link"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />
      </div>

      <Button type="submit" disabled={loading || submitting} className="w-full">
        {(loading || submitting)
          ? initialData
            ? "Updating..."
            : "Uploading..."
          : initialData
          ? "Update Video"
          : "Upload Video"}
      </Button>
    </form>
  );
}
