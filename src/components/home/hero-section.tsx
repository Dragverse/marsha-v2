"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiArrowRight } from "react-icons/fi";
import * as Player from "@livepeer/react/player";
import { getSrc } from "@livepeer/react/external";
import { HeroSlider } from "./hero-slider";

const STREAM_URL = "https://livepeercdn.studio/hls/fb7fdq50qnczbi4u/index.m3u8";

export function HeroSection() {
  const [isLive, setIsLive] = useState(false);
  const [checkingStream, setCheckingStream] = useState(true);

  useEffect(() => {
    // Check if stream is live using backend API
    const checkStream = async () => {
      try {
        const response = await fetch("/api/stream/status/official");
        const data = await response.json();
        setIsLive(data.isLive || false);
      } catch (error) {
        console.error("Failed to check stream status:", error);
        setIsLive(false);
      } finally {
        setCheckingStream(false);
      }
    };

    checkStream();
    // Re-check every 30 seconds
    const interval = setInterval(checkStream, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left - Hero Slider */}
      <div className="lg:col-span-1 min-h-[400px]">
        <HeroSlider />
      </div>

      {/* Right - Dragverse Stream */}
      <div className="lg:col-span-2 relative rounded-[32px] overflow-hidden bg-[#1a0b2e] min-h-[400px] shadow-2xl">
        {/* Status Badge */}
        {!checkingStream && (
          <div className={`absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full ${
            isLive ? 'bg-[#4CAF50]' : 'bg-[#C62828]'
          }`}>
            <span className={`w-2 h-2 bg-white rounded-full ${isLive ? 'animate-pulse' : ''}`} />
            <span className="text-xs font-bold uppercase text-white">{isLive ? 'Live' : 'Offline'}</span>
          </div>
        )}

        {checkingStream ? (
          // Loading state
          <div className="absolute inset-0 flex items-center justify-center bg-[#1a0b2e]">
            <div className="w-8 h-8 border-2 border-[#EB83EA] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : isLive ? (
          // Live stream player
          <Player.Root src={getSrc(STREAM_URL)} autoPlay>
            <Player.Container className="h-full">
              <Player.Video className="w-full h-full object-cover" />
              <Player.Controls autoHide={3000} className="p-4">
                <div className="flex items-center gap-2">
                  <Player.PlayPauseTrigger className="w-10 h-10 flex items-center justify-center bg-white/20 rounded-full hover:bg-white/30 transition" />
                  <Player.MuteTrigger className="w-10 h-10 flex items-center justify-center bg-white/20 rounded-full hover:bg-white/30 transition" />
                  <Player.FullscreenTrigger className="ml-auto w-10 h-10 flex items-center justify-center bg-white/20 rounded-full hover:bg-white/30 transition" />
                </div>
              </Player.Controls>
            </Player.Container>
          </Player.Root>
        ) : (
          // Offline placeholder
          <div className="absolute inset-0">
            <Image
              src="/Famers/currently-offline.jpg"
              alt="Stream Currently Offline"
              fill
              className="object-cover"
            />
          </div>
        )}
        </div>
    </section>
  );
}
