"use client";

import Image from "next/image";
import Link from "next/link";
import { FiExternalLink, FiAward } from "react-icons/fi";

const famers = [
  { name: "ALLESIA", image: "/Famers/ALLESIA.png" },
  { name: "ARIEL", image: "/Famers/ARIEL.png" },
  { name: "ARIZONA", image: "/Famers/ARIZONA.png" },
  { name: "CRYSTAL", image: "/Famers/CRYSTAL_2.png" },
  { name: "RUBY", image: "/Famers/CRYSTAL.png" },
  { name: "FLORENTINX", image: "/Famers/FLORENTINX.png" },
  { name: "FRESA", image: "/Famers/FRESA.png" },
  { name: "FUEGO", image: "/Famers/FUEGO.png" },
  { name: "OSQUITA", image: "/Famers/OSQUITA.png" },
  { name: "SALTI", image: "/Famers/SALTI.png" },
  { name: "TOYONCE", image: "/Famers/TOYONCE.png" },
  { name: "VINTAGE", image: "/Famers/VINTAGE.png" },
];

export default function HallOfFamePage() {
  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#EB83EA] to-[#7c3aed] mb-6">
            <FiAward className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold uppercase tracking-tight mb-4">
            Hall of <span className="text-[#EB83EA] italic">Fame</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
            Celebrating the legendary creators who have shaped the Dragverse community
          </p>

          {/* CTA to World Version */}
          <a
            href="https://world.dragverse.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#EB83EA] to-[#7c3aed] hover:from-[#E748E6] hover:to-[#6c2aed] text-white font-extrabold rounded-full shadow-xl shadow-[#EB83EA]/25 transition-all"
          >
            <span>EXPLORE IN 3D WORLD</span>
            <FiExternalLink className="w-5 h-5" />
          </a>
        </div>

        {/* Grid of Famers */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          {famers.map((famer) => (
            <div
              key={famer.name}
              className="group relative rounded-[24px] overflow-hidden bg-gradient-to-br from-[#1a0b2e] to-[#0f071a] border border-[#2f2942] hover:border-[#EB83EA]/60 transition-all shadow-xl hover:shadow-2xl hover:shadow-[#EB83EA]/20"
            >
              {/* Image */}
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={famer.image}
                  alt={famer.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f071a] via-transparent to-transparent opacity-60" />
              </div>

              {/* Name Badge */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0f071a] to-transparent">
                <h3 className="text-center font-bold text-lg uppercase tracking-wider text-white">
                  {famer.name}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Section */}
        <div className="text-center p-8 rounded-[32px] bg-gradient-to-br from-[#1a0b2e] to-[#311453] border border-[#2f2942]">
          <h2 className="text-2xl font-bold mb-4">Want to Join the Hall of Fame?</h2>
          <p className="text-gray-400 mb-6 max-w-xl mx-auto">
            Create amazing content, build your community, and become a legend in the Dragverse
          </p>
          <Link
            href="/upload"
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#EB83EA] hover:bg-[#E748E6] text-white font-bold rounded-full transition-all"
          >
            START CREATING
          </Link>
        </div>
      </div>
    </div>
  );
}
