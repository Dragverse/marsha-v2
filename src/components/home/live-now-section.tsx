"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiVideo } from "react-icons/fi";

interface LiveStream {
  streamId: string;
  creatorDID: string;
  creatorName: string;
  creatorAvatar: string;
  creatorHandle: string;
  title: string;
  thumbnail: string;
  viewerCount: number;
  category: string;
}

export function LiveNowSection() {
  const [liveStreams, setLiveStreams] = useState<LiveStream[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiveStreams = async () => {
      try {
        // TODO: Once Ceramic is configured, query all active streams
        // For now, this will prepare the structure for when we add Ceramic queries

        // Example future implementation:
        // const streams = await ceramic.query({
        //   model: "Livestream",
        //   where: { isActive: true },
        //   orderBy: { viewerCount: "DESC" },
        //   limit: 8
        // });

        // For now, no live streams to display (will be connected after Phase 3 Ceramic setup)
        setLiveStreams([]);
      } catch (error) {
        console.error("Failed to fetch live streams:", error);
        setLiveStreams([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveStreams();

    // Poll for new streams every 30 seconds
    const interval = setInterval(fetchLiveStreams, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return null;
  }

  // Don't show the section if no streams are live
  if (liveStreams.length === 0) {
    return null;
  }

  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 px-3 py-1 bg-red-500 rounded-full">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
          <span className="text-white text-sm font-bold uppercase">LIVE</span>
        </div>
        <h2 className="text-2xl font-bold">Live Now</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {liveStreams.map((stream) => (
          <Link
            key={stream.streamId}
            href={`/creator/${stream.creatorHandle.split(".")[0]}`}
            className="group relative bg-[#1a0b2e] rounded-[24px] border border-[#2f2942] hover:border-[#EB83EA]/50 transition-all overflow-hidden"
          >
            {/* Thumbnail with Live Badge */}
            <div className="relative aspect-video">
              <Image
                src={stream.thumbnail}
                alt={stream.title}
                fill
                className="object-cover"
              />
              <div className="absolute top-3 left-3 flex items-center gap-2 px-2 py-1 bg-red-500 rounded text-xs font-bold text-white">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                LIVE
              </div>
              <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 rounded text-xs font-bold text-white flex items-center gap-1">
                <FiVideo className="w-3 h-3" />
                {stream.viewerCount.toLocaleString()}
              </div>
            </div>

            {/* Stream Info */}
            <div className="p-4">
              <h3 className="font-bold text-white mb-2 line-clamp-2 group-hover:text-[#EB83EA] transition-colors">
                {stream.title}
              </h3>
              <div className="flex items-center gap-3">
                <Image
                  src={stream.creatorAvatar}
                  alt={stream.creatorName}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium truncate">
                    {stream.creatorName}
                  </p>
                  <p className="text-xs text-gray-400">{stream.category}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
