"use client";

import { Button } from "@/components/ui/button";

interface CTAOverlayProps {
  message: string;
  buttonText: string;
  buttonUrl: string;
  position:
    | "TOP_LEFT"
    | "TOP_RIGHT"
    | "BOTTOM_LEFT"
    | "BOTTOM_RIGHT"
    | "CENTER";
  color: string;
  onCtaClick: () => void;
}

export function CTAOverlay({
  message,
  buttonText,
  buttonUrl,
  position,
  color,
  onCtaClick,
}: CTAOverlayProps) {
  const positionClasses = {
    TOP_LEFT: "top-4 left-4 -translate-x-0",
    TOP_RIGHT: "top-4 right-4 translate-x-0",
    BOTTOM_LEFT: "bottom-4 left-4 -translate-x-0",
    BOTTOM_RIGHT: "bottom-4 right-4 translate-x-0",
    CENTER: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
  };

  return (
    <div
      className={`fixed ${positionClasses[position]} w-full max-w-md mx-auto px-4 z-50`}
    >
      <div
        className="rounded-lg shadow-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{ backgroundColor: color }}
      >
        <p className="text-white text-center sm:text-left font-medium">
          {message}
        </p>
        <Button
          className="whitespace-nowrap bg-white text-gray-900 hover:bg-gray-100"
          onClick={() => {
            onCtaClick();
            window.open(buttonUrl, "_blank");
          }}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
}
