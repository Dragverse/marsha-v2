import React from "react";
import { OwnershipBanner } from "@/components/ui/ownership-banner";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <OwnershipBanner />
    </>
  );
}
