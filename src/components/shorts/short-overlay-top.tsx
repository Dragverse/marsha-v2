"use client";

import Image from "next/image";
import Link from "next/link";
import type { Video } from "@/types";

interface ShortOverlayTopProps {
  video: Video;
}

export function ShortOverlayTop({ video }: ShortOverlayTopProps) {
  return (
    <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent z-10">
      <Link
        href={`/creator/${video.creator.handle}`}
        className="flex items-center gap-3 hover:opacity-80 transition"
      >
        <Image
          src={video.creator.avatar}
          alt={video.creator.displayName}
          width={40}
          height={40}
          className="rounded-full w-10 h-10"
        />
        <div>
          <h3 className="font-semibold text-white text-sm">
            {video.creator.displayName}
          </h3>
          <p className="text-xs text-gray-300">@{video.creator.handle}</p>
        </div>
      </Link>
    </div>
  );
}
