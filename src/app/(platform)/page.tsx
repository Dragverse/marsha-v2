"use client";

import { useState } from "react";
import { VideoCard } from "@/components/video/video-card";
import { mockVideos, categories } from "@/lib/utils/mock-data";
import { FiSearch } from "react-icons/fi";
import { HeroSection } from "@/components/home/hero-section";
import { BytesSection } from "@/components/home/bytes-section";
import { CommunitySection } from "@/components/home/community-section";
import { RightSidebar } from "@/components/home/right-sidebar";
import { LiveNowSection } from "@/components/home/live-now-section";

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Separate shorts and regular videos
  const shorts = mockVideos.filter((v) => v.contentType === "short");
  const horizontalVideos = mockVideos.filter((v) => v.contentType !== "short");

  const filteredVideos = mockVideos.filter((video) => {
    const matchesCategory =
      activeCategory === "All" || video.category === activeCategory;
    const matchesSearch =
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.creator.displayName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // If searching or filtering, show filtered results in grid
  const isFiltering = searchQuery || activeCategory !== "All";

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 pb-12">
      <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-8">
        {/* Main Content */}
        <div className="col-span-12 lg:col-span-9 space-y-10">
          {/* Categories */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full whitespace-nowrap font-semibold text-sm transition-all ${
                  activeCategory === category
                    ? "bg-white text-[#0f071a]"
                    : "bg-white/10 hover:bg-white/20"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {isFiltering ? (
            <>
              {/* Search Bar when filtering */}
              <div className="relative max-w-xl">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for channel or hashtag"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-transparent focus:border-[#EB83EA]/30 rounded-full text-sm transition-all outline-none"
                />
              </div>

              {/* Results count */}
              <div className="text-sm text-gray-400">
                {filteredVideos.length}{" "}
                {filteredVideos.length === 1 ? "video" : "videos"}
                {searchQuery && ` matching "${searchQuery}"`}
                {activeCategory !== "All" && ` in ${activeCategory}`}
              </div>

              {/* Filtered Video Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredVideos.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>

              {filteredVideos.length === 0 && (
                <div className="text-center py-20">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#1a0b2e] mb-4">
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
            </>
          ) : (
            <>
              {/* Hero Section */}
              <HeroSection />

              {/* Live Now Section (shows when creators are streaming) */}
              <LiveNowSection />

              {/* Bytes (Shorts) Section */}
              <BytesSection shorts={shorts} />

              {/* Community Videos Section */}
              <CommunitySection videos={horizontalVideos} />
            </>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="col-span-3">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
}
