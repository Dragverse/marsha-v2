"use client";

import { useState } from "react";
import { FiThumbsUp, FiMessageCircle, FiShare2 } from "react-icons/fi";
import type { Video } from "@/types";

interface ShortOverlayBottomProps {
  video: Video;
}

export function ShortOverlayBottom({ video }: ShortOverlayBottomProps) {
  const [likes, setLikes] = useState(video.likes);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setIsLiked(!isLiked);
  };

  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent z-10">
      <div className="flex justify-between items-end">
        {/* Video Info */}
        <div className="flex-1 pr-4">
          <h2 className="text-white font-semibold text-base mb-2 line-clamp-2">
            {video.title}
          </h2>
          {video.description && (
            <p className="text-gray-200 text-sm line-clamp-2 mb-2">
              {video.description}
            </p>
          )}
          {video.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {video.tags.slice(0, 3).map((tag: string) => (
                <span key={tag} className="text-purple-400 text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4">
          <button
            onClick={handleLike}
            className={`flex flex-col items-center gap-1 transition ${
              isLiked ? "text-purple-500" : "text-white"
            }`}
          >
            <div className="w-12 h-12 bg-gray-800/80 rounded-full flex items-center justify-center hover:bg-gray-700/80">
              <FiThumbsUp className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium">{formatCount(likes)}</span>
          </button>

          <button className="flex flex-col items-center gap-1 text-white transition">
            <div className="w-12 h-12 bg-gray-800/80 rounded-full flex items-center justify-center hover:bg-gray-700/80">
              <FiMessageCircle className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium">0</span>
          </button>

          <button className="flex flex-col items-center gap-1 text-white transition">
            <div className="w-12 h-12 bg-gray-800/80 rounded-full flex items-center justify-center hover:bg-gray-700/80">
              <FiShare2 className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium">Share</span>
          </button>
        </div>
      </div>
    </div>
  );
}
