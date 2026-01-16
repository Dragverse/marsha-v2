"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiChevronLeft, FiChevronRight, FiZap, FiHeart } from "react-icons/fi";
import type { Video } from "@/types";

interface BytesSectionProps {
  shorts: Video[];
}

export function BytesSection({ shorts }: BytesSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "k";
    return num.toString();
  };

  if (shorts.length === 0) return null;

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FiZap className="text-[#EB83EA] w-8 h-8" />
          <h2 className="font-bold text-2xl lg:text-3xl uppercase tracking-widest">
            Bytes
          </h2>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => scroll("left")}
            className="w-11 h-11 rounded-full border border-[#2f2942] flex items-center justify-center hover:bg-[#EB83EA] hover:border-[#EB83EA] transition-all hover:text-white"
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-11 h-11 rounded-full border border-[#2f2942] flex items-center justify-center hover:bg-[#EB83EA] hover:border-[#EB83EA] transition-all hover:text-white"
          >
            <FiChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {shorts.map((video) => (
          <Link
            key={video.id}
            href={`/shorts?v=${video.id}`}
            className="flex-shrink-0 snap-start"
          >
            <div className="relative w-[160px] aspect-[9/16] rounded-3xl overflow-hidden group cursor-pointer shadow-lg">
              <Image
                src={video.thumbnail}
                alt={video.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white mb-2">
                  <FiHeart className="w-4 h-4 text-[#EB83EA]" />
                  {formatNumber(video.likes)}
                </div>
                <p className="text-white text-sm font-semibold line-clamp-2">
                  {video.title}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
