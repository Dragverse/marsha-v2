"use client";

import { mockCreators, mockVideos } from "@/lib/utils/mock-data";
import Image from "next/image";
import Link from "next/link";
import { FiUser, FiUserPlus, FiMail, FiLink2 } from "react-icons/fi";
import { useState } from "react";
import { VideoCard } from "@/components/video/video-card";
import { LivestreamEmbed } from "@/components/profile/livestream-embed";

export default function ProfilePage({
  params,
}: {
  params: { handle: string };
}) {
  const creator = mockCreators.find(
    (c) => c.handle.split(".")[0] === params.handle
  ) || mockCreators[0];
  const creatorVideos = mockVideos.filter((v) => v.creator.did === creator.did);

  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<"videos" | "about">("videos");

  return (
    <div>
      {/* Cover Section - Marsha v2 Style */}
      <div className="relative h-44 md:h-[20vw] ultrawide:h-[25vh] bg-[#EB83EA] bg-cover bg-center bg-no-repeat overflow-hidden">
        <Image
          src={`https://api.dicebear.com/7.x/patterns/svg?seed=${creator.handle}&backgroundColor=EB83EA`}
          alt="banner"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="container mx-auto max-w-screen-xl px-2 xl:px-0">
        {/* Profile Header */}
        <div className="relative -mt-16 mb-6">
          <div className="flex flex-wrap justify-between items-end gap-4">
            {/* Avatar & Basic Info */}
            <div className="flex items-end gap-4">
              <Image
                src={creator.avatar}
                alt={creator.displayName}
                width={128}
                height={128}
                className="size-24 laptop:size-32 rounded-small border-2 border-white dark:bg-[#100c1f] bg-white shadow-2xl"
              />
              <div className="flex-1 pb-2">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-[#FCF1FC]">
                    {creator.displayName}
                  </h1>
                  {creator.verified && (
                    <svg
                      className="w-5 h-5 text-[#EB83EA]"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                  )}
                </div>
                <p className="text-[#EB83EA] text-base">@{creator.handle}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pb-2">
              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className={`px-6 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                  isFollowing
                    ? "bg-[#18122D] text-[#FCF1FC] hover:bg-[#2f2942]"
                    : "bg-[#EB83EA] text-white hover:bg-[#E748E6]"
                }`}
              >
                <FiUserPlus className="w-5 h-5" />
                {isFollowing ? "Following" : "Follow"}
              </button>
              <button className="px-6 py-2 bg-[#18122D] text-[#FCF1FC] rounded-lg font-medium hover:bg-[#2f2942] transition flex items-center gap-2">
                <FiMail className="w-5 h-5" />
                Message
              </button>
            </div>
          </div>
        </div>

        {/* Livestream Embed (if active) */}
        <LivestreamEmbed
          creatorDID={creator.did}
          creatorName={creator.displayName}
        />

        {/* Bio & Stats */}
        <div className="mb-6">
          <p className="text-[#FCF1FC] mb-4 max-w-3xl line-clamp-5">
            {creator.description}
          </p>
          <div className="flex gap-6 text-sm">
            <div>
              <span className="font-bold text-lg text-[#FCF1FC]">
                {(creator.followerCount / 1000).toFixed(0)}K
              </span>
              <span className="text-gray-400 ml-2">Followers</span>
            </div>
            <div>
              <span className="font-bold text-lg text-[#FCF1FC]">
                {creatorVideos.length}
              </span>
              <span className="text-gray-400 ml-2">Videos</span>
            </div>
            <div>
              <span className="font-bold text-lg text-[#FCF1FC]">
                {(creator.followingCount / 1000).toFixed(1)}K
              </span>
              <span className="text-gray-400 ml-2">Following</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-[#2f2942] mb-8">
          <button
            onClick={() => setActiveTab("videos")}
            className={`pb-3 font-semibold transition ${
              activeTab === "videos"
                ? "border-b-2 border-[#EB83EA] text-[#FCF1FC]"
                : "text-gray-400 hover:text-[#FCF1FC]"
            }`}
          >
            Videos ({creatorVideos.length})
          </button>
          <button
            onClick={() => setActiveTab("about")}
            className={`pb-3 font-semibold transition ${
              activeTab === "about"
                ? "border-b-2 border-[#EB83EA] text-[#FCF1FC]"
                : "text-gray-400 hover:text-[#FCF1FC]"
            }`}
          >
            About
          </button>
        </div>

        {/* Content */}
        {activeTab === "videos" && (
          <div>
            {creatorVideos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {creatorVideos.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-[#18122D] rounded-lg">
                <FiUser className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                <p className="text-gray-400">This creator has not uploaded yet</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "about" && (
          <div className="max-w-2xl">
            <div className="bg-[#18122D] p-6 rounded-lg space-y-4">
              <div>
                <h3 className="font-semibold mb-2 text-[#FCF1FC]">Bio</h3>
                <p className="text-gray-400">{creator.description}</p>
              </div>
              <div className="border-t border-[#2f2942] pt-4">
                <h3 className="font-semibold mb-3 text-[#FCF1FC]">Links</h3>
                <div className="space-y-2">
                  <a
                    href={`https://bsky.app/profile/${creator.handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[#EB83EA] hover:text-[#E748E6]"
                  >
                    <FiLink2 className="w-4 h-4" />
                    Bluesky Profile
                  </a>
                </div>
              </div>
              <div className="border-t border-[#2f2942] pt-4">
                <h3 className="font-semibold mb-2 text-[#FCF1FC]">Joined</h3>
                <p className="text-gray-400">
                  {creator.createdAt.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
