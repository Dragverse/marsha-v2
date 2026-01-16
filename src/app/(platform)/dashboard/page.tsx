"use client";

import { useAuthUser } from "@/lib/privy/hooks";
import { useRouter } from "next/navigation";
import { FiVideo, FiHeart, FiUsers, FiDollarSign, FiTrendingUp, FiEye, FiCopy, FiEdit, FiTrash2 } from "react-icons/fi";
import Image from "next/image";
import { useState } from "react";

// Mock data - will be replaced with real Ceramic data later
const mockStats = {
  totalViews: 125430,
  totalLikes: 8234,
  followers: 1542,
  totalEarnings: 0, // Will be populated in Phase 7
};

const mockVideos = [
  {
    id: "1",
    title: "My Latest Performance",
    thumbnail: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400",
    uploadDate: "2026-01-10",
    views: 5420,
    likes: 234,
    tips: 0,
    status: "ready" as const,
  },
  {
    id: "2",
    title: "Makeup Tutorial",
    thumbnail: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400",
    uploadDate: "2026-01-08",
    views: 3210,
    likes: 156,
    tips: 0,
    status: "ready" as const,
  },
];

export default function DashboardPage() {
  const { isAuthenticated, signIn } = useAuthUser();
  const router = useRouter();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Sign in to view your dashboard</h1>
          <p className="text-gray-400 mb-6">Track your content, earnings, and analytics</p>
          <button
            onClick={signIn}
            className="px-8 py-3 bg-[#EB83EA] hover:bg-[#E748E6] text-white font-bold rounded-full transition"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const copyShareLink = (videoId: string) => {
    const link = `${window.location.origin}/watch/${videoId}`;
    navigator.clipboard.writeText(link);
    setCopiedId(videoId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold uppercase tracking-tight mb-2">
            Creator <span className="text-[#EB83EA] italic">Dashboard</span>
          </h1>
          <p className="text-gray-400">Manage your content and track your performance</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Views */}
          <div className="bg-gradient-to-br from-[#1a0b2e] to-[#0f071a] rounded-[24px] p-6 border border-[#2f2942]">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <FiEye className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">
              {mockStats.totalViews.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">Total Views</div>
          </div>

          {/* Total Likes */}
          <div className="bg-gradient-to-br from-[#1a0b2e] to-[#0f071a] rounded-[24px] p-6 border border-[#2f2942]">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center">
                <FiHeart className="w-6 h-6 text-pink-400" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">
              {mockStats.totalLikes.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">Total Likes</div>
          </div>

          {/* Followers */}
          <div className="bg-gradient-to-br from-[#1a0b2e] to-[#0f071a] rounded-[24px] p-6 border border-[#2f2942]">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                <FiUsers className="w-6 h-6 text-purple-400" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">
              {mockStats.followers.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">Followers</div>
          </div>

          {/* Total Earnings */}
          <div className="bg-gradient-to-br from-[#1a0b2e] to-[#0f071a] rounded-[24px] p-6 border border-[#2f2942]">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <FiDollarSign className="w-6 h-6 text-green-400" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">
              ${mockStats.totalEarnings.toFixed(2)}
            </div>
            <div className="text-sm text-gray-400">Total Earnings</div>
            <div className="mt-2 text-xs text-[#EB83EA]">Phase 7: Coming Soon</div>
          </div>
        </div>

        {/* Earnings Panel - Featured for Phase 7 */}
        <div className="bg-gradient-to-br from-[#1a0b2e] to-[#311453] rounded-[24px] p-6 border border-[#2f2942] mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">Earnings Overview</h2>
              <p className="text-gray-400 text-sm">Track tips and revenue from your content</p>
            </div>
            <div className="hidden md:flex gap-2">
              <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-sm font-semibold transition">
                All Time
              </button>
              <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-sm font-semibold transition">
                30 Days
              </button>
              <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-sm font-semibold transition">
                7 Days
              </button>
            </div>
          </div>

          {/* Earnings Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/5 rounded-2xl p-4">
              <div className="text-sm text-gray-400 mb-1">Crypto Tips (ETH/USDC)</div>
              <div className="text-2xl font-bold">$0.00</div>
              <div className="text-xs text-green-400 mt-1">0 transactions</div>
            </div>
            <div className="bg-white/5 rounded-2xl p-4">
              <div className="text-sm text-gray-400 mb-1">Fiat Tips (Stripe)</div>
              <div className="text-2xl font-bold">$0.00</div>
              <div className="text-xs text-green-400 mt-1">0 transactions</div>
            </div>
            <div className="bg-white/5 rounded-2xl p-4">
              <div className="text-sm text-gray-400 mb-1">Available to Withdraw</div>
              <div className="text-2xl font-bold text-[#EB83EA]">$0.00</div>
              <button className="mt-2 w-full py-2 bg-[#EB83EA]/20 text-[#EB83EA] rounded-lg text-sm font-semibold opacity-50 cursor-not-allowed">
                Withdraw (Phase 7)
              </button>
            </div>
          </div>

          {/* Coming Soon Message */}
          <div className="bg-[#EB83EA]/10 border border-[#EB83EA]/30 rounded-2xl p-4 text-center">
            <div className="text-[#EB83EA] font-semibold mb-1">🚀 Monetization Coming in Phase 7</div>
            <div className="text-sm text-gray-300">
              Hybrid tipping system (Crypto + Stripe), transaction history, top fans leaderboard, and more!
            </div>
          </div>
        </div>

        {/* Video Management */}
        <div className="bg-gradient-to-br from-[#1a0b2e] to-[#0f071a] rounded-[24px] p-6 border border-[#2f2942]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">Your Videos</h2>
              <p className="text-gray-400 text-sm">Manage and track your uploaded content</p>
            </div>
            <button
              onClick={() => router.push('/upload')}
              className="px-6 py-2.5 bg-[#EB83EA] hover:bg-[#E748E6] text-white font-bold rounded-full transition flex items-center gap-2"
            >
              <FiVideo className="w-4 h-4" />
              Upload New
            </button>
          </div>

          {/* Videos Table */}
          <div className="space-y-4">
            {mockVideos.map((video) => (
              <div
                key={video.id}
                className="bg-white/5 rounded-2xl p-4 hover:bg-white/10 transition group"
              >
                <div className="flex gap-4">
                  {/* Thumbnail */}
                  <div className="relative w-32 h-20 rounded-xl overflow-hidden flex-shrink-0">
                    <Image
                      src={video.thumbnail}
                      alt={video.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded">
                      {video.status.toUpperCase()}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg mb-1 truncate">{video.title}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-2">
                      <span className="flex items-center gap-1">
                        <FiEye className="w-4 h-4" />
                        {video.views.toLocaleString()} views
                      </span>
                      <span className="flex items-center gap-1">
                        <FiHeart className="w-4 h-4" />
                        {video.likes.toLocaleString()} likes
                      </span>
                      <span className="flex items-center gap-1">
                        <FiDollarSign className="w-4 h-4" />
                        ${video.tips.toFixed(2)} tips
                      </span>
                      <span>Uploaded: {new Date(video.uploadDate).toLocaleDateString()}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => copyShareLink(video.id)}
                        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-semibold transition flex items-center gap-1"
                      >
                        <FiCopy className="w-3 h-3" />
                        {copiedId === video.id ? 'Copied!' : 'Copy Link'}
                      </button>
                      <button className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-semibold transition flex items-center gap-1">
                        <FiEdit className="w-3 h-3" />
                        Edit
                      </button>
                      <button className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-xs font-semibold transition flex items-center gap-1">
                        <FiTrash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {mockVideos.length === 0 && (
              <div className="text-center py-12">
                <FiVideo className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">No videos yet</h3>
                <p className="text-gray-400 mb-4">Upload your first video to get started!</p>
                <button
                  onClick={() => router.push('/upload')}
                  className="px-6 py-3 bg-[#EB83EA] hover:bg-[#E748E6] text-white font-bold rounded-full transition"
                >
                  Upload Your First Video
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Analytics Charts Section - Placeholder for future enhancement */}
        <div className="mt-8 bg-gradient-to-br from-[#1a0b2e] to-[#0f071a] rounded-[24px] p-6 border border-[#2f2942]">
          <h2 className="text-2xl font-bold mb-4">Analytics</h2>
          <div className="bg-white/5 rounded-2xl p-8 text-center">
            <FiTrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Advanced Analytics Coming Soon</h3>
            <p className="text-gray-400">
              View charts, engagement metrics, follower growth, and more
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
