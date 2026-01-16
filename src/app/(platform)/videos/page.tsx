"use client";

import { useState } from "react";
import { VideoCard } from "@/components/video/video-card";
import { mockVideos, categories } from "@/lib/utils/mock-data";
import { FiSearch } from "react-icons/fi";

export default function VideosPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Only show horizontal videos (exclude shorts)
  const horizontalVideos = mockVideos.filter((v) => v.contentType !== "short");

  const filteredVideos = horizontalVideos.filter((video) => {
    const matchesCategory =
      activeCategory === "All" || video.category === activeCategory;
    const matchesSearch =
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.creator.displayName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#FCF1FC] flex items-center gap-3 mb-4">
          <div className="w-1.5 h-8 bg-[#EB83EA] rounded-full" />
          Videos
        </h1>
        <p className="text-gray-400 text-sm">
          Browse all horizontal format videos from creators
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-2xl">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
          <input
            type="text"
            placeholder="Search videos, creators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[#18122D] border border-[#2f2942] rounded-xl focus:outline-none focus:border-[#EB83EA] focus:bg-[#18122D] transition placeholder:text-gray-500 text-[#FCF1FC]"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="mb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium text-sm transition-all ${
                activeCategory === category
                  ? "bg-[#EB83EA] text-white shadow-lg"
                  : "bg-[#18122D] text-gray-300 hover:bg-[#2f2942] border border-[#2f2942]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      {(searchQuery || activeCategory !== "All") && (
        <div className="mb-4 text-sm text-gray-400">
          {filteredVideos.length} {filteredVideos.length === 1 ? "video" : "videos"}
          {searchQuery && ` matching "${searchQuery}"`}
          {activeCategory !== "All" && ` in ${activeCategory}`}
        </div>
      )}

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-8">
        {filteredVideos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>

      {filteredVideos.length === 0 && (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#18122D] mb-4">
            <FiSearch className="text-2xl text-gray-500" />
          </div>
          <p className="text-gray-400 text-lg font-medium">
            No videos found
          </p>
          <p className="text-gray-500 text-sm mt-1">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  );
}
