"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchVideos,
  deleteVideo,
  updateVideo,
} from "@/redux/slices/video-carousel-slice";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Pencil, Trash, Loader2 } from "lucide-react";
import VideoForm from "./page";
import ConfirmDelete from "@/components/common/ConfirmDelete";
import { toast } from "react-toastify";

export default function VideoTable() {
  const dispatch = useDispatch();
  const { videos, loading } = useSelector((state) => state.videos);

  const [editData, setEditData] = useState(null);
  const [open, setOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    dispatch(fetchVideos());
  }, [dispatch]);

  const handleEdit = (data) => {
    setEditData(data);
    setOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await dispatch(deleteVideo(deleteTarget._id)).unwrap();
      toast.success("Video deleted successfully");
    } catch (err) {
      toast.error("Failed to delete video");
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleFormSubmit = () => {
    setOpen(false);
    setEditData(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Video Carousel</h2>

        <Dialog
          open={open}
          onOpenChange={(val) => {
            setOpen(val);
            if (!val) setEditData(null);
          }}
        >
          <DialogTrigger asChild>
            <Button onClick={() => setEditData(null)}>Add Video</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>
              {editData ? "Edit Video" : "Add New Video"}
            </DialogTitle>
            <VideoForm initialData={editData} onSubmit={handleFormSubmit} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {videos.map((video) => (
          <div
            key={video._id}
            className="p-4 border rounded shadow bg-white space-y-2"
          >
            <p className="text-lg font-semibold">{video.name}</p>
            <video
              src={video.videoUrl}
              controls
              className="w-full rounded-md"
            ></video>

            <div className="flex gap-2 mt-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleEdit(video)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => setDeleteTarget(video)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDelete
        open={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
