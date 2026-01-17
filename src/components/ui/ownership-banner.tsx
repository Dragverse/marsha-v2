"use client";

import React, { useState, useEffect } from "react";
import { FiKey, FiLock, FiX } from "react-icons/fi";
import Link from "next/link";

export function OwnershipBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user has dismissed the banner before
    const dismissed = localStorage.getItem("ownership-banner-dismissed");
    if (!dismissed) {
      // Show banner after a short delay for better UX
      setTimeout(() => setIsVisible(true), 2000);
    } else {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem("ownership-banner-dismissed", "true");
  };

  const handleRemindLater = () => {
    setIsVisible(false);
    // Don't set dismissed in localStorage, so it shows again next session
  };

  if (isDismissed || !isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-slide-up">
      <div className="bg-gradient-to-br from-[#1a0b2e] via-[#2d1b4e] to-[#1a0b2e] border-2 border-[#EB83EA]/30 rounded-2xl shadow-2xl p-6 backdrop-blur-sm">
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
          aria-label="Dismiss"
        >
          <FiX className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-[#EB83EA]/10 rounded-full">
            <FiKey className="w-6 h-6 text-[#EB83EA]" />
          </div>
          <h3 className="text-lg font-bold text-white">Your Keys, Your Castle</h3>
        </div>

        {/* Message */}
        <div className="space-y-3 mb-5">
          <p className="text-sm text-gray-300 leading-relaxed">
            You own your wallet and your content. At any moment, you can take your
            assets and leave—no lock-in, no gatekeepers.
          </p>
          <div className="flex items-start gap-2 text-sm text-gray-400">
            <FiLock className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#EB83EA]" />
            <p className="text-xs">
              Your content is secured on the blockchain, ensuring permanent ownership
              and portability.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            href="/about"
            onClick={handleDismiss}
            className="flex-1 px-4 py-2 bg-[#EB83EA] hover:bg-[#E748E6] text-white text-sm font-semibold rounded-lg transition-colors text-center"
          >
            Learn More
          </Link>
          <button
            onClick={handleRemindLater}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-semibold rounded-lg transition-colors"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
}
