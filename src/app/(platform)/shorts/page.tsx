"use client";

import { useState, useEffect } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { mockVideos } from "@/lib/utils/mock-data";
import { ShortVideo } from "@/components/shorts/short-video";
import { ShortOverlayTop } from "@/components/shorts/short-overlay-top";
import { ShortOverlayBottom } from "@/components/shorts/short-overlay-bottom";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";

export default function ShortsPage() {
  const shorts = mockVideos.filter((v) => v.contentType === "short");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    vertical: true,
    slides: {
      perView: 1,
      spacing: 0,
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
  });

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        instanceRef.current?.prev();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        instanceRef.current?.next();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [instanceRef]);

  if (shorts.length === 0) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-lg">No shorts available yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[calc(100vh-4rem)] overflow-hidden bg-black">
      {/* Vertical Slider */}
      <div
        ref={sliderRef}
        className="keen-slider h-full snap-y snap-mandatory overflow-y-hidden"
      >
        {shorts.map((video, idx) => (
          <div key={video.id} className="keen-slider__slide relative">
            <ShortVideo video={video} isActive={currentSlide === idx} />
            <ShortOverlayTop video={video} />
            <ShortOverlayBottom video={video} />
          </div>
        ))}
      </div>

      {/* Navigation Buttons - Desktop Only */}
      {loaded && instanceRef.current && (
        <div className="hidden md:flex flex-col gap-4 fixed right-8 top-1/2 -translate-y-1/2 z-20">
          <button
            onClick={() => instanceRef.current?.prev()}
            disabled={currentSlide === 0}
            className="w-12 h-12 bg-gray-800/80 rounded-full flex items-center justify-center hover:bg-gray-700/80 transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <FiChevronUp className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={() => instanceRef.current?.next()}
            disabled={currentSlide === shorts.length - 1}
            className="w-12 h-12 bg-gray-800/80 rounded-full flex items-center justify-center hover:bg-gray-700/80 transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <FiChevronDown className="w-6 h-6 text-white" />
          </button>
        </div>
      )}

      {/* Slide Indicator */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex gap-1 z-20">
        {shorts.map((_, idx) => (
          <div
            key={idx}
            className={`h-1 rounded-full transition-all ${
              currentSlide === idx
                ? "w-8 bg-[#EB83EA]"
                : "w-1 bg-gray-600"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
