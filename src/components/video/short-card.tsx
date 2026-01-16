import type { Video } from "@/types";
import Link from "next/link";
import Image from "next/image";

interface ShortCardProps {
  video: Video;
}

export function ShortCard({ video }: ShortCardProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  return (
    <Link href={`/shorts?v=${video.id}`}>
      <div className="group cursor-pointer">
        {/* Vertical video thumbnail */}
        <div className="relative w-full aspect-[9/16] rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 mb-3 shadow-lg">
          <Image
            src={video.thumbnail}
            alt={video.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Shorts badge */}
          <div className="absolute top-2 left-2 bg-gradient-to-r from-[#EB83EA] to-[#E748E6] px-2.5 py-1 rounded-full text-xs font-bold uppercase shadow-lg">
            Short
          </div>
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {/* Views overlay */}
          <div className="absolute bottom-2 left-2 right-2">
            <div className="text-white text-xs font-semibold drop-shadow-lg">
              {formatNumber(video.views)} views
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-[#EB83EA] transition leading-snug px-1">
          {video.title}
        </h3>
      </div>
    </Link>
  );
}
