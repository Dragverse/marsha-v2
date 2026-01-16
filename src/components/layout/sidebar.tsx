"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiCompass, FiZap, FiUser, FiSettings, FiAward, FiBarChart2 } from "react-icons/fi";

const navItems = [
  { href: "/", icon: FiHome, label: "Home" },
  { href: "/videos", icon: FiCompass, label: "Explore" },
  { href: "/shorts", icon: FiZap, label: "Bytes" },
  { href: "/hall-of-fame", icon: FiAward, label: "Hall of Fame" },
  { href: "/dashboard", icon: FiBarChart2, label: "Dashboard" },
  { href: "/profile", icon: FiUser, label: "Profile" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-20 flex flex-col items-center py-6 gap-6 border-r border-[#2f2942] bg-[#1a0b2e] z-40 hidden md:flex">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            title={item.label}
            className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all ${
              isActive
                ? "bg-[#EB83EA] text-white shadow-lg shadow-[#EB83EA]/30"
                : "text-gray-400 hover:bg-white/5 hover:text-[#EB83EA]"
            }`}
          >
            <Icon className="w-6 h-6" />
          </Link>
        );
      })}

      <Link
        href="/settings"
        title="Settings"
        className="w-12 h-12 flex items-center justify-center rounded-2xl text-gray-400 hover:bg-white/5 hover:text-[#EB83EA] transition-all mt-auto"
      >
        <FiSettings className="w-6 h-6" />
      </Link>
    </aside>
  );
}
