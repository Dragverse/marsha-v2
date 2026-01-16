"use client";

import { useState, useCallback } from "react";
import { FiUploadCloud, FiCheck, FiFilm, FiZap } from "react-icons/fi";
import toast from "react-hot-toast";
import { uploadVideoToLivepeer, waitForAssetReady } from "@/lib/livepeer/client-upload";
import { useAuthUser } from "@/lib/privy/hooks";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function UploadPage() {
  const { isAuthenticated, signIn } = useAuthUser();
  const router = useRouter();

  const [formData, setFormData] = useState({
    contentType: "short" as "short" | "long",
    title: "",
    description: "",
    category: "",
    tags: "",
    thumbnail: null as File | null,
    thumbnailPreview: null as string | null,
    video: null as File | null,
  });

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState<"idle" | "uploading" | "processing" | "complete">("idle");
  const [dragActive, setDragActive] = useState(false);

  const categories = [
    "Entertainment",
    "Beauty & Makeup",
    "Music",
    "Comedy",
    "Dance",
    "Fashion",
    "Lip Sync",
    "Tutorial",
    "Behind the Scenes",
    "Other",
  ];

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const validateVideoFile = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      // Check file type
      const validTypes = ["video/mp4", "video/webm", "video/x-matroska", "video/quicktime"];
      if (!validTypes.includes(file.type) && !file.type.startsWith("video/")) {
        toast.error("Invalid file type. Please upload MP4, WebM, or MKV files.");
        resolve(false);
        return;
      }

      // Check file size (5GB max)
      const maxSize = 5 * 1024 * 1024 * 1024; // 5GB in bytes
      if (file.size > maxSize) {
        toast.error("File too large. Maximum size is 5GB.");
        resolve(false);
        return;
      }

      // Check video duration based on content type
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        const duration = video.duration; // in seconds

        if (formData.contentType === "short") {
          // Vertical/Short content: max 60 seconds
          if (duration > 60) {
            toast.error("Short videos must be 60 seconds or less.");
            resolve(false);
            return;
          }
        } else if (formData.contentType === "long") {
          // Horizontal/Long content: 1 to 60 minutes
          if (duration < 60) {
            toast.error("Long-form videos must be at least 1 minute.");
            resolve(false);
            return;
          }
          if (duration > 3600) {
            toast.error("Long-form videos must be 60 minutes or less.");
            resolve(false);
            return;
          }
        }

        resolve(true);
      };

      video.onerror = () => {
        toast.error("Failed to read video metadata. Please try again.");
        resolve(false);
      };

      video.src = URL.createObjectURL(file);
    });
  };

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const isValid = await validateVideoFile(file);
      if (isValid) {
        setFormData((prev) => ({ ...prev, video: file }));
      }
    }
  }, [formData.contentType]);

  const handleThumbnailChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          thumbnail: file,
          thumbnailPreview: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({
        ...prev,
        thumbnail: null,
        thumbnailPreview: null,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please sign in to upload videos");
      signIn();
      return;
    }

    if (!formData.video) {
      toast.error("Please select a video file");
      return;
    }

    if (!formData.title) {
      toast.error("Please enter a title");
      return;
    }

    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }

    try {
      setUploading(true);
      setUploadStage("uploading");

      const asset = await uploadVideoToLivepeer(formData.video, (progress) => {
        setUploadProgress(progress.percentage);
      });

      toast.success("Upload complete! Processing video...");
      setUploadStage("processing");

      const readyAsset = await waitForAssetReady(asset.id, (progress) => {
        setProcessingProgress(Math.round(progress * 100));
      });

      console.log("Video ready:", readyAsset);

      // Save video metadata to Ceramic via backend API
      try {
        const metadataResponse = await fetch("/api/video/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            thumbnail: formData.thumbnailPreview || readyAsset.playbackUrl?.replace("index.m3u8", "thumbnail.jpg"),
            livepeerAssetId: readyAsset.id,
            playbackId: readyAsset.playbackId,
            playbackUrl: readyAsset.playbackUrl,
            duration: readyAsset.videoSpec?.duration,
            contentType: formData.contentType,
            category: formData.category,
            tags: formData.tags ? formData.tags.split(",").map((t: string) => t.trim()) : [],
          }),
        });

        const metadataResult = await metadataResponse.json();
        console.log("Video metadata saved:", metadataResult);
      } catch (metadataError) {
        console.error("Failed to save metadata:", metadataError);
        // Don't fail the entire upload if metadata save fails
        toast.error("Video uploaded but metadata save failed");
      }

      setUploadStage("complete");
      toast.success("Video uploaded successfully!");

      // Redirect to dashboard after successful upload
      setTimeout(() => {
        setFormData({
          contentType: "short",
          title: "",
          description: "",
          category: "",
          tags: "",
          thumbnail: null,
          thumbnailPreview: null,
          video: null,
        });
        setUploadStage("idle");
        setUploadProgress(0);
        setProcessingProgress(0);
        setUploading(false);
        router.push("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error instanceof Error ? error.message : "Upload failed");
      setUploading(false);
      setUploadStage("idle");
      setUploadProgress(0);
      setProcessingProgress(0);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#EB83EA] to-[#7c3aed] flex items-center justify-center">
            <FiUploadCloud className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold">Upload Your Content</h1>
          <p className="text-gray-400">
            Sign in to share your drag content with the community
          </p>
          <button
            onClick={signIn}
            className="px-8 py-3 bg-[#EB83EA] hover:bg-[#E748E6] text-white rounded-full font-semibold transition-colors"
          >
            Sign In to Upload
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Upload Content</h1>
        <p className="text-gray-400">
          Share your drag content with the Dragverse community
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Content Type Toggle */}
        <div className="p-6 rounded-[24px] bg-[#1a0b2e] border border-[#2f2942]">
          <label className="block text-lg font-bold uppercase tracking-widest mb-4">
            Content Type
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, contentType: "short" })}
              className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
                formData.contentType === "short"
                  ? "border-[#EB83EA] bg-[#EB83EA]/10"
                  : "border-[#2f2942] hover:border-[#EB83EA]/50"
              }`}
            >
              <FiZap className={`w-8 h-8 ${formData.contentType === "short" ? "text-[#EB83EA]" : "text-gray-400"}`} />
              <div className="text-center">
                <div className="font-bold">Byte</div>
                <div className="text-xs text-gray-400">Vertical - Max 60 seconds</div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, contentType: "long" })}
              className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
                formData.contentType === "long"
                  ? "border-[#EB83EA] bg-[#EB83EA]/10"
                  : "border-[#2f2942] hover:border-[#EB83EA]/50"
              }`}
            >
              <FiFilm className={`w-8 h-8 ${formData.contentType === "long" ? "text-[#EB83EA]" : "text-gray-400"}`} />
              <div className="text-center">
                <div className="font-bold">Video</div>
                <div className="text-xs text-gray-400">Horizontal - 1 to 60 minutes</div>
              </div>
            </button>
          </div>
        </div>

        {/* Video Upload */}
        <div className="p-6 rounded-[24px] bg-[#1a0b2e] border border-[#2f2942]">
          <label className="block text-lg font-bold uppercase tracking-widest mb-4">
            Video File
          </label>
          <label
            className={`flex flex-col items-center justify-center w-full px-6 py-12 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
              dragActive
                ? "border-[#EB83EA] bg-[#EB83EA]/10"
                : formData.video
                ? "border-green-500/50 bg-green-500/5"
                : "border-[#2f2942] hover:border-[#EB83EA]/50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {formData.video ? (
              <div className="text-center">
                <FiCheck className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <span className="text-lg font-semibold text-green-500">
                  {formData.video.name}
                </span>
                <p className="text-sm text-gray-400 mt-1">
                  {(formData.video.size / (1024 * 1024)).toFixed(2)} MB
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setFormData({ ...formData, video: null });
                  }}
                  className="mt-3 text-sm text-[#EB83EA] hover:underline"
                >
                  Choose different file
                </button>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#EB83EA]/20 to-[#7c3aed]/20 flex items-center justify-center mb-4">
                  <FiUploadCloud className="w-8 h-8 text-[#EB83EA]" />
                </div>
                <span className="text-lg font-semibold">
                  Drag and drop or click to upload
                </span>
                <span className="text-sm text-gray-400 mt-2">
                  MP4, WebM, MKV - Max 5GB
                </span>
              </>
            )}
            <input
              type="file"
              accept="video/mp4,video/webm,video/x-matroska,video/quicktime"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const isValid = await validateVideoFile(file);
                  if (isValid) {
                    setFormData({
                      ...formData,
                      video: file,
                    });
                  }
                }
              }}
              className="hidden"
            />
          </label>
        </div>

        {/* Details */}
        <div className="p-6 rounded-[24px] bg-[#1a0b2e] border border-[#2f2942] space-y-6">
          <h2 className="text-lg font-bold uppercase tracking-widest">Details</h2>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              maxLength={100}
              placeholder="Give your content a catchy title..."
              className="w-full px-4 py-3 bg-[#0f071a] border border-[#2f2942] rounded-xl focus:outline-none focus:border-[#EB83EA] transition placeholder:text-gray-500"
            />
            <p className="text-xs text-gray-500 mt-1 text-right">
              {formData.title.length}/100
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              maxLength={5000}
              placeholder="Tell viewers about your content..."
              rows={4}
              className="w-full px-4 py-3 bg-[#0f071a] border border-[#2f2942] rounded-xl focus:outline-none focus:border-[#EB83EA] transition resize-none placeholder:text-gray-500"
            />
            <p className="text-xs text-gray-500 mt-1 text-right">
              {formData.description.length}/5000
            </p>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-4 py-3 bg-[#0f071a] border border-[#2f2942] rounded-xl focus:outline-none focus:border-[#EB83EA] transition text-white"
            >
              <option value="" className="bg-[#1a0b2e]">Select a category...</option>
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-[#1a0b2e]">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              Tags
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="drag, makeup, performance (comma separated)"
              className="w-full px-4 py-3 bg-[#0f071a] border border-[#2f2942] rounded-xl focus:outline-none focus:border-[#EB83EA] transition placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* Thumbnail */}
        <div className="p-6 rounded-[24px] bg-[#1a0b2e] border border-[#2f2942]">
          <label className="block text-lg font-bold uppercase tracking-widest mb-4">
            Thumbnail (Optional)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="flex flex-col items-center justify-center w-full px-4 py-8 border-2 border-dashed border-[#2f2942] rounded-2xl hover:border-[#EB83EA]/50 cursor-pointer transition">
              <FiUploadCloud className="w-8 h-8 text-[#EB83EA] mb-2" />
              <span className="text-sm font-medium">
                {formData.thumbnail ? formData.thumbnail.name : "Upload thumbnail"}
              </span>
              <span className="text-xs text-gray-500 mt-1">
                PNG, JPG - 1280x720px recommended
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleThumbnailChange(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
            {formData.thumbnailPreview && (
              <div className="relative aspect-video rounded-2xl overflow-hidden">
                <Image
                  src={formData.thumbnailPreview}
                  alt="Thumbnail preview"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleThumbnailChange(null)}
                  className="absolute top-2 right-2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition"
                >
                  x
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Terms */}
        <div className="flex items-start gap-3 p-4 bg-[#1a0b2e] border border-[#2f2942] rounded-2xl">
          <input
            type="checkbox"
            id="terms"
            required
            className="mt-1 w-5 h-5 accent-[#EB83EA] rounded"
          />
          <label htmlFor="terms" className="text-sm text-gray-300">
            I confirm this content follows community guidelines and I have the rights to share it.
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={uploading || !formData.video || !formData.title || !formData.category}
          className="w-full px-6 py-4 bg-[#EB83EA] hover:bg-[#E748E6] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-full transition-colors text-lg"
        >
          {uploading ? "Uploading..." : "Upload Content"}
        </button>

        {/* Upload Progress */}
        {uploading && (
          <div className="p-6 bg-[#1a0b2e] border border-[#2f2942] rounded-[24px]">
            {uploadStage === "uploading" && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold">Uploading to Livepeer...</span>
                  <span className="text-[#EB83EA] font-bold">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-[#0f071a] rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-[#EB83EA] to-[#7c3aed] h-3 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {uploadStage === "processing" && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold">Processing video...</span>
                  <span className="text-[#EB83EA] font-bold">{processingProgress}%</span>
                </div>
                <div className="w-full bg-[#0f071a] rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-[#EB83EA] to-[#7c3aed] h-3 rounded-full transition-all duration-300"
                    style={{ width: `${processingProgress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  This may take a few minutes depending on video length
                </p>
              </div>
            )}

            {uploadStage === "complete" && (
              <div className="flex items-center gap-3 text-green-500">
                <FiCheck className="text-2xl" />
                <span className="font-semibold">Video ready! Redirecting...</span>
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
