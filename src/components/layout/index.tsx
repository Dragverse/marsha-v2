import React from "react";
import { Navbar } from "./navbar";
import { Sidebar } from "./sidebar";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0f071a] text-white">
      <Navbar />
      <Sidebar />
      <main className="pt-16 md:ml-20">{children}</main>
    </div>
  );
}
