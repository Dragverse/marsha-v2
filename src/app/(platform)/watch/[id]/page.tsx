"use client";

import React, { useState } from "react";
import { mockVideos, mockCreators } from "@/lib/utils/mock-data";
import Image from "next/image";
import Link from "next/link";
import { FiThumbsUp, FiMessageCircle, FiShare2, FiUserPlus, FiDollarSign } from "react-icons/fi";
import * as Player from "@livepeer/react/player";
import { getSrc } from "@livepeer/react/external";
import { TipModal } from "@/components/video/tip-modal";

export default function WatchPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const video = mockVideos.find((v) => v.id === resolvedParams.id);
  const [likes, setLikes] = useState(video?.likes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [tipModalOpen, setTipModalOpen] = useState(false);

  if (!video) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-gray-400">Video not found</p>
      </div>
    );
  }

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setIsLiked(!isLiked);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Video */}
        <div className="lg:col-span-2">
          {/* Livepeer Player */}
          <div className="rounded-large overflow-hidden mb-6">
            {video.playbackUrl ? (
              <Player.Root
                src={getSrc(video.playbackUrl)}
                aspectRatio={video.contentType === "short" ? 9 / 16 : 16 / 9}
              >
                <Player.Container>
                  <Player.Video
                    className={video.contentType === "short" ? "max-h-[80vh] mx-auto" : ""}
                    style={{ objectFit: "contain" }}
                  />
                  <Player.Controls autoHide={3000}>
                    <Player.PlayPauseTrigger />
                    <Player.Seek>
                      <Player.Track>
                        <Player.SeekBuffer />
                        <Player.Range />
                      </Player.Track>
                      <Player.Thumb />
                    </Player.Seek>
                    <Player.Time />
                    <Player.MuteTrigger />
                    <Player.Volume>
                      <Player.Track>
                        <Player.Range />
                      </Player.Track>
                      <Player.Thumb />
                    </Player.Volume>
                    <Player.FullscreenTrigger />
                  </Player.Controls>
                </Player.Container>
              </Player.Root>
            ) : (
              <div className="w-full aspect-video bg-black rounded-lg flex items-center justify-center relative">
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  fill
                  className="object-cover rounded-lg"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <p className="text-gray-400">Video not available</p>
                </div>
              </div>
            )}
          </div>

          {/* Video Info */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>{(video.views / 1000).toFixed(0)}K views</span>
                  <span>•</span>
                  <span>
                    {new Date(video.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
              <div className="inline-block bg-purple-600 px-4 py-2 rounded-full text-sm font-semibold uppercase">
                {video.contentType}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  isLiked
                    ? "bg-purple-600 text-white"
                    : "bg-gray-900 text-gray-300 hover:bg-gray-800"
                }`}
              >
                <FiThumbsUp className="w-5 h-5" />
                <span>{likes}</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-gray-300 rounded-lg hover:bg-gray-800 transition">
                <FiMessageCircle className="w-5 h-5" />
                <span>Comment</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-gray-300 rounded-lg hover:bg-gray-800 transition">
                <FiShare2 className="w-5 h-5" />
                <span>Share</span>
              </button>
              <button
                onClick={() => setTipModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#EB83EA] to-[#7c3aed] text-white rounded-lg hover:from-[#E748E6] hover:to-[#6b2fd5] transition font-semibold"
              >
                <FiDollarSign className="w-5 h-5" />
                <span>Tip Creator</span>
              </button>
            </div>

            {/* Description */}
            <p className="text-gray-300 mb-4">{video.description}</p>

            {/* Tags */}
            <div className="flex gap-2 flex-wrap">
              {video.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/?search=${tag}`}
                  className="text-purple-400 hover:text-purple-300 text-sm"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>

          {/* Creator Info */}
          <div className="border-t border-gray-800 pt-6">
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <Image
                  src={video.creator.avatar}
                  alt={video.creator.displayName}
                  width={60}
                  height={60}
                  className="w-14 h-14 rounded-full"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">
                    {video.creator.displayName}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    @{video.creator.handle}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    {(video.creator.followerCount / 1000).toFixed(0)}K followers
                  </p>
                  <p className="text-gray-400 text-sm mt-2 max-w-lg">
                    {video.creator.description}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className={`px-6 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                  isFollowing
                    ? "bg-gray-900 text-white"
                    : "bg-purple-600 text-white hover:bg-purple-700"
                }`}
              >
                <FiUserPlus className="w-5 h-5" />
                {isFollowing ? "Following" : "Follow"}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar - Recommended Videos */}
        <div className="lg:col-span-1">
          <h3 className="font-bold text-lg mb-4">Up Next</h3>
          <div className="space-y-4">
            {mockVideos
              .filter((v) => v.id !== video.id)
              .slice(0, 5)
              .map((v) => (
                <Link
                  key={v.id}
                  href={`/watch/${v.id}`}
                  className="flex gap-3 hover:bg-gray-900/50 p-2 rounded transition"
                >
                  <div className="relative w-28 h-16 flex-shrink-0 rounded bg-gray-800">
                    <Image
                      src={v.thumbnail}
                      alt={v.title}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm line-clamp-2 hover:text-purple-400">
                      {v.title}
                    </h4>
                    <p className="text-xs text-gray-400 mt-1">
                      {v.creator.displayName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(v.views / 1000).toFixed(0)}K views
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>

      {/* Tip Modal */}
      <TipModal
        isOpen={tipModalOpen}
        onClose={() => setTipModalOpen(false)}
        creatorName={video.creator.displayName}
        creatorDID={video.creator.did}
        videoId={video.id}
      />
    </div>
  );
}
