"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FiHome,
  FiUpload,
  FiLogOut,
  FiMenu,
  FiX,
  FiSearch,
  FiVideo,
  FiMail,
  FiAward,
  FiBarChart2,
  FiBell,
} from "react-icons/fi";
import { BsPlayFill, BsLightningFill } from "react-icons/bs";
import { usePrivy } from "@privy-io/react-auth";
import { useAuth } from "@/lib/store/auth";
import { useCanLivestream } from "@/lib/livestream";

export function Navbar() {
  const { login, logout, authenticated, user } = usePrivy();
  const { setSession, clearAuth } = useAuth();
  const { canStream } = useCanLivestream();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3); // Mock count, will connect to real data later

  const handleLogin = () => {
    login();
  };

  const handleLogout = () => {
    logout();
    clearAuth();
  };

  // Sync Privy auth with our store
  React.useEffect(() => {
    if (authenticated && user) {
      setSession({
        did: user.id,
        handle:
          user.email?.address ||
          user.google?.email ||
          user.farcaster?.username ||
          "user",
        accessJwt: "",
        refreshJwt: "",
      });
    }
  }, [authenticated, user, setSession]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1a0b2e] border-b border-white/10 h-16">
      <div className="h-full px-6 flex items-center justify-between gap-8">
        {/* Logo */}
        <Link href="/" className="flex items-center flex-shrink-0">
          <Image
            src="/logo.svg"
            alt="Dragverse"
            width={140}
            height={56}
            className="h-12 w-auto"
            priority
          />
        </Link>

        {/* Search Bar - Desktop */}
        <div className="hidden md:block flex-1 max-w-xl">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for channel or hashtag"
              className="w-full bg-white/5 border border-transparent focus:border-[#EB83EA]/30 rounded-full py-2.5 px-6 pl-12 text-sm transition-all outline-none placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5">
          {authenticated && (
            <>
              <Link
                href="/live"
                title="Go Live"
                className={`p-2.5 hover:bg-white/5 rounded-full transition-colors group hidden md:flex items-center justify-center ${
                  canStream ? "" : "opacity-50"
                }`}
              >
                <FiVideo className="w-5 h-5 text-gray-300 group-hover:text-[#EB83EA]" />
              </Link>
              <button
                title="Messages"
                className="p-2.5 hover:bg-white/5 rounded-full transition-colors group hidden md:flex items-center justify-center"
              >
                <FiMail className="w-5 h-5 text-gray-300 group-hover:text-[#EB83EA]" />
              </button>
              <Link
                href="/notifications"
                title="Notifications"
                className="p-2.5 hover:bg-white/5 rounded-full transition-colors group hidden md:flex items-center justify-center relative"
              >
                <FiBell className="w-5 h-5 text-gray-300 group-hover:text-[#EB83EA]" />
                {notificationCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </Link>
            </>
          )}

          {authenticated ? (
            <div className="relative group ml-2 hidden md:block">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#EB83EA] cursor-pointer hover:scale-105 transition-transform">
                <Image
                  alt="User Profile"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=80"
                />
              </div>
              {/* Dropdown */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-[#1a0b2e] border border-white/10 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all p-2 z-50">
                <Link
                  href="/profile"
                  className="block w-full text-left px-4 py-2 text-sm font-semibold hover:bg-white/5 rounded-xl transition-colors"
                >
                  View Profile
                </Link>
                <Link
                  href="/dashboard"
                  className="block w-full text-left px-4 py-2 text-sm font-semibold hover:bg-white/5 rounded-xl transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/upload"
                  className="block w-full text-left px-4 py-2 text-sm font-semibold hover:bg-white/5 rounded-xl transition-colors"
                >
                  Upload Video
                </Link>
                <Link
                  href="/live"
                  className="block w-full text-left px-4 py-2 text-sm font-semibold hover:bg-white/5 rounded-xl transition-colors"
                >
                  Go Live
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm font-semibold text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="hidden md:block px-5 py-2 bg-[#EB83EA] hover:bg-[#E748E6] text-white rounded-full font-semibold text-sm transition ml-2"
            >
              Sign In
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white"
          >
            {mobileMenuOpen ? (
              <FiX className="text-2xl" />
            ) : (
              <FiMenu className="text-2xl" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1a0b2e] border-t border-white/10">
          {/* Mobile Search */}
          <div className="p-4 border-b border-white/10">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-white/5 rounded-full py-2.5 px-6 pl-12 text-sm outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col p-4 space-y-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition"
            >
              <FiHome className="w-5 h-5" /> Home
            </Link>
            <Link
              href="/videos"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition"
            >
              <BsPlayFill className="w-5 h-5" /> Videos
            </Link>
            <Link
              href="/shorts"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition"
            >
              <BsLightningFill className="w-5 h-5" /> Bytes
            </Link>
            <Link
              href="/hall-of-fame"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition"
            >
              <FiAward className="w-5 h-5" /> Hall of Fame
            </Link>
            {authenticated && (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition"
                >
                  <FiBarChart2 className="w-5 h-5" /> Dashboard
                </Link>
                <Link
                  href="/upload"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition"
                >
                  <FiUpload className="w-5 h-5" /> Upload
                </Link>
                <Link
                  href="/live"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition"
                >
                  <FiVideo className="w-5 h-5" /> Go Live
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition"
                >
                  <FiSearch className="w-5 h-5" /> Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition text-red-400"
                >
                  <FiLogOut className="w-5 h-5" /> Sign Out
                </button>
              </>
            )}
            {!authenticated && (
              <button
                onClick={() => {
                  handleLogin();
                  setMobileMenuOpen(false);
                }}
                className="mx-4 mt-2 py-3 bg-[#EB83EA] hover:bg-[#E748E6] text-white rounded-full font-semibold transition"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
