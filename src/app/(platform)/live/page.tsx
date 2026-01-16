"use client";

import { useState } from "react";
import { FiVideo, FiCopy, FiCheck, FiAlertCircle, FiLock } from "react-icons/fi";
import toast from "react-hot-toast";
// Removed direct Livepeer import - now using secure backend API
import { useAuthUser } from "@/lib/privy/hooks";
import { useCanLivestream } from "@/lib/livestream";
import Link from "next/link";

interface StreamInfo {
  id: string;
  streamKey: string;
  playbackUrl: string;
  rtmpIngestUrl: string;
}

export default function GoLivePage() {
  const { isAuthenticated, signIn } = useAuthUser();
  const { canStream, blockedReason } = useCanLivestream();

  const [streamTitle, setStreamTitle] = useState("");
  const [streamInfo, setStreamInfo] = useState<StreamInfo | null>(null);
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState<"key" | "rtmp" | null>(null);

  const handleCreateStream = async () => {
    if (!streamTitle.trim()) {
      toast.error("Please enter a stream title");
      return;
    }

    try {
      setCreating(true);

      // Call secure backend API to create stream
      const response = await fetch("/api/stream/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: streamTitle }),
      });

      if (!response.ok) {
        throw new Error("Failed to create stream");
      }

      const stream = await response.json();
      setStreamInfo(stream);
      toast.success("Livestream created! You can now start streaming.");
    } catch (error) {
      console.error("Failed to create stream:", error);
      toast.error("Failed to create livestream. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const copyToClipboard = async (text: string, type: "key" | "rtmp") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(null), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#EB83EA] to-[#7c3aed] flex items-center justify-center">
            <FiVideo className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold">Go Live</h1>
          <p className="text-gray-400">
            Sign in to start streaming to your audience
          </p>
          <button
            onClick={signIn}
            className="px-8 py-3 bg-[#EB83EA] hover:bg-[#E748E6] text-white rounded-full font-semibold transition-colors"
          >
            Sign In to Stream
          </button>
        </div>
      </div>
    );
  }

  // Not authorized to stream
  if (!canStream) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center space-y-6 max-w-lg">
          <div className="w-20 h-20 mx-auto rounded-full bg-[#1a0b2e] border border-[#2f2942] flex items-center justify-center">
            <FiLock className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold">Livestreaming Beta</h1>
          <p className="text-gray-400">
            {blockedReason}
          </p>
          <div className="p-6 rounded-[24px] bg-[#1a0b2e] border border-[#2f2942] text-left space-y-4">
            <h3 className="font-bold text-lg">Want to go live?</h3>
            <p className="text-sm text-gray-400">
              We&apos;re gradually rolling out livestreaming to creators. To apply for early access:
            </p>
            <ul className="text-sm text-gray-400 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-[#EB83EA]">1.</span>
                <span>Upload at least 3 videos to your channel</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#EB83EA]">2.</span>
                <span>Build a following in the community</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#EB83EA]">3.</span>
                <span>Contact us to request beta access</span>
              </li>
            </ul>
          </div>
          <Link
            href="/upload"
            className="inline-block px-8 py-3 bg-[#EB83EA] hover:bg-[#E748E6] text-white rounded-full font-semibold transition-colors"
          >
            Upload Your First Video
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Go Live</h1>
        <p className="text-gray-400">
          Start streaming to your audience in real-time
        </p>
      </div>

      {!streamInfo ? (
        // Stream Setup Form
        <div className="space-y-8">
          <div className="p-6 rounded-[24px] bg-[#1a0b2e] border border-[#2f2942] space-y-6">
            <h2 className="text-lg font-bold uppercase tracking-widest">Stream Setup</h2>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">
                Stream Title *
              </label>
              <input
                type="text"
                value={streamTitle}
                onChange={(e) => setStreamTitle(e.target.value)}
                maxLength={100}
                placeholder="What are you streaming today?"
                className="w-full px-4 py-3 bg-[#0f071a] border border-[#2f2942] rounded-xl focus:outline-none focus:border-[#EB83EA] transition placeholder:text-gray-500"
              />
              <p className="text-xs text-gray-500 mt-1 text-right">
                {streamTitle.length}/100
              </p>
            </div>

            <button
              onClick={handleCreateStream}
              disabled={creating || !streamTitle.trim()}
              className="w-full px-6 py-4 bg-[#EB83EA] hover:bg-[#E748E6] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-full transition-colors text-lg flex items-center justify-center gap-2"
            >
              {creating ? (
                "Creating Stream..."
              ) : (
                <>
                  <FiVideo className="w-5 h-5" />
                  Create Livestream
                </>
              )}
            </button>
          </div>

          {/* Instructions */}
          <div className="p-6 rounded-[24px] bg-[#1a0b2e] border border-[#2f2942]">
            <h2 className="text-lg font-bold uppercase tracking-widest mb-4">How to Stream</h2>
            <div className="space-y-4 text-sm text-gray-400">
              <p>
                <span className="text-[#EB83EA] font-bold">1.</span> Create a livestream by entering a title above
              </p>
              <p>
                <span className="text-[#EB83EA] font-bold">2.</span> Copy your stream key and RTMP URL
              </p>
              <p>
                <span className="text-[#EB83EA] font-bold">3.</span> Configure your streaming software (OBS, Streamlabs, etc.)
              </p>
              <p>
                <span className="text-[#EB83EA] font-bold">4.</span> Start streaming from your software
              </p>
            </div>
          </div>
        </div>
      ) : (
        // Stream Info
        <div className="space-y-8">
          {/* Success Banner */}
          <div className="p-6 rounded-[24px] bg-green-500/10 border border-green-500/30">
            <div className="flex items-center gap-3 text-green-500">
              <FiCheck className="w-6 h-6" />
              <span className="font-bold text-lg">Livestream Ready!</span>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Your stream is set up. Configure your streaming software with the details below.
            </p>
          </div>

          {/* Stream Credentials */}
          <div className="p-6 rounded-[24px] bg-[#1a0b2e] border border-[#2f2942] space-y-6">
            <h2 className="text-lg font-bold uppercase tracking-widest">Stream Credentials</h2>

            {/* RTMP URL */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">
                RTMP Server URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={streamInfo.rtmpIngestUrl.replace(streamInfo.streamKey, "")}
                  className="flex-1 px-4 py-3 bg-[#0f071a] border border-[#2f2942] rounded-xl text-gray-400 font-mono text-sm"
                />
                <button
                  onClick={() => copyToClipboard(streamInfo.rtmpIngestUrl.replace(streamInfo.streamKey, ""), "rtmp")}
                  className="px-4 py-3 bg-[#2f2942] hover:bg-[#3f3952] rounded-xl transition-colors"
                >
                  {copied === "rtmp" ? <FiCheck className="w-5 h-5 text-green-500" /> : <FiCopy className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Stream Key */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">
                Stream Key
              </label>
              <div className="flex gap-2">
                <input
                  type="password"
                  readOnly
                  value={streamInfo.streamKey}
                  className="flex-1 px-4 py-3 bg-[#0f071a] border border-[#2f2942] rounded-xl text-gray-400 font-mono text-sm"
                />
                <button
                  onClick={() => copyToClipboard(streamInfo.streamKey, "key")}
                  className="px-4 py-3 bg-[#2f2942] hover:bg-[#3f3952] rounded-xl transition-colors"
                >
                  {copied === "key" ? <FiCheck className="w-5 h-5 text-green-500" /> : <FiCopy className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <FiAlertCircle className="w-3 h-3" />
                Keep your stream key private. Never share it publicly.
              </p>
            </div>
          </div>

          {/* Playback URL */}
          <div className="p-6 rounded-[24px] bg-[#1a0b2e] border border-[#2f2942] space-y-4">
            <h2 className="text-lg font-bold uppercase tracking-widest">Share Your Stream</h2>
            <p className="text-sm text-gray-400">
              Once you start streaming, viewers can watch at:
            </p>
            <div className="px-4 py-3 bg-[#0f071a] border border-[#2f2942] rounded-xl font-mono text-sm text-[#EB83EA] break-all">
              {`${typeof window !== "undefined" ? window.location.origin : ""}/watch/live/${streamInfo.id}`}
            </div>
          </div>

          {/* New Stream Button */}
          <button
            onClick={() => {
              setStreamInfo(null);
              setStreamTitle("");
            }}
            className="w-full px-6 py-4 border-2 border-[#2f2942] hover:border-[#EB83EA]/50 text-white font-bold rounded-full transition-colors"
          >
            Create Another Stream
          </button>
        </div>
      )}
    </div>
  );
}
