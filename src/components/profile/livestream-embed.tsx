"use client";

import { useEffect, useState } from "react";
import { FiVideo } from "react-icons/fi";

interface LivestreamEmbedProps {
  creatorDID: string;
  creatorName: string;
}

interface StreamData {
  streamId: string;
  title: string;
  playbackUrl: string;
  isActive: boolean;
}

export function LivestreamEmbed({ creatorDID, creatorName }: LivestreamEmbedProps) {
  const [streamData, setStreamData] = useState<StreamData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkCreatorStream = async () => {
      try {
        // TODO: Once Ceramic is configured, query streams by creatorDID
        // For now, this will prepare the structure for when we add Ceramic queries

        // Example future implementation:
        // const streams = await ceramic.query({
        //   model: "Livestream",
        //   where: { creatorDID: creatorDID, isActive: true }
        // });

        // For now, no streams to display (will be connected after Phase 3 Ceramic setup)
        setStreamData(null);
      } catch (error) {
        console.error("Failed to check creator stream:", error);
        setStreamData(null);
      } finally {
        setLoading(false);
      }
    };

    checkCreatorStream();

    // Poll for stream status every 30 seconds
    const interval = setInterval(checkCreatorStream, 30000);
    return () => clearInterval(interval);
  }, [creatorDID]);

  if (loading) {
    return null;
  }

  if (!streamData || !streamData.isActive) {
    return null;
  }

  return (
    <div className="mb-8 bg-[#1a0b2e] border border-[#2f2942] rounded-[24px] overflow-hidden">
      {/* Live Badge */}
      <div className="px-6 py-4 border-b border-[#2f2942] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 bg-red-500 rounded-full">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
            <span className="text-white text-sm font-bold uppercase">LIVE</span>
          </div>
          <h2 className="text-xl font-bold text-white">{streamData.title}</h2>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <FiVideo className="w-5 h-5" />
          <span className="text-sm">{creatorName} is streaming</span>
        </div>
      </div>

      {/* Video Player */}
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <iframe
          src={`https://lvpr.tv/?v=${streamData.playbackUrl.split("/")[4]}`}
          className="absolute top-0 left-0 w-full h-full"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
