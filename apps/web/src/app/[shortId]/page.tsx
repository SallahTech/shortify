"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CTAOverlay } from "@/components/CTAOverlay";

const API_URL = "http://localhost:3002";

interface Link {
  id: string;
  originalUrl: string;
  shortUrl: string;
  ctaOverlay?: {
    id: string;
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
  };
}

export default function RedirectPage() {
  const params = useParams();
  const shortId = params.shortId as string;
  const [link, setLink] = useState<Link | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [redirectTimer, setRedirectTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  useEffect(() => {
    const fetchLink = async () => {
      try {
        const response = await fetch(`${API_URL}/r/${shortId}`);
        if (!response.ok) {
          throw new Error("Link not found");
        }
        const data = await response.json();
        setLink(data);

        // Record the click
        await fetch(`${API_URL}/r/${shortId}/click`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userAgent: navigator.userAgent,
          }),
        });

        // If there's no CTA, redirect immediately
        // If there is a CTA, set a timer to redirect after 30 seconds
        if (!data.ctaOverlay) {
          window.location.href = data.originalUrl;
        } else {
          const timer = setTimeout(() => {
            window.location.href = data.originalUrl;
          }, 30000); // 30 seconds
          setRedirectTimer(timer);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    };

    fetchLink();

    // Cleanup timer on unmount
    return () => {
      if (redirectTimer) {
        clearTimeout(redirectTimer);
      }
    };
  }, [shortId]);

  const handleCtaClick = async () => {
    if (!link) return;

    // Clear the auto-redirect timer
    if (redirectTimer) {
      clearTimeout(redirectTimer);
    }

    // Record the CTA click
    await fetch(`${API_URL}/r/${shortId}/cta-click`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userAgent: navigator.userAgent,
      }),
    });

    // Redirect to the CTA URL
    window.location.href = link.ctaOverlay?.buttonUrl || link.originalUrl;
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-500 mb-4">Oops!</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!link) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {link.ctaOverlay && (
        <CTAOverlay
          message={link.ctaOverlay.message}
          buttonText={link.ctaOverlay.buttonText}
          buttonUrl={link.ctaOverlay.buttonUrl}
          position={link.ctaOverlay.position}
          color={link.ctaOverlay.color}
          onCtaClick={handleCtaClick}
        />
      )}
    </div>
  );
}
