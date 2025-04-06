"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import * as links from "@/lib/links";
import { useToast } from "@/hooks/use-toast";

interface CreateLinkFormProps {
  onSuccess: (link: links.Link) => void;
}

export function CreateLinkForm({ onSuccess }: CreateLinkFormProps) {
  const { toast } = useToast();
  const [showCTA, setShowCTA] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data: any = {
      originalUrl: formData.get("originalUrl"),
    };

    if (showCTA) {
      data.ctaOverlay = {
        message: formData.get("cta.message"),
        buttonText: formData.get("cta.buttonText"),
        buttonUrl: formData.get("cta.buttonUrl"),
        position: formData.get("cta.position"),
        color: formData.get("cta.color"),
      };
    }

    try {
      const link = await links.createLink(data);
      toast({
        title: "Success",
        description: "Your link has been created successfully.",
      });
      onSuccess(link);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create link";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
      console.error("Create link error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid gap-2">
          <label className="text-sm font-medium">URL to Shorten</label>
          <input
            name="originalUrl"
            type="url"
            placeholder="https://example.com"
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="add-cta"
            checked={showCTA}
            onChange={(e) => setShowCTA(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300"
          />
          <label htmlFor="add-cta" className="text-sm font-medium">
            Add CTA Overlay
          </label>
        </div>

        {showCTA && (
          <div className="space-y-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Message</label>
              <input
                name="cta.message"
                type="text"
                required={showCTA}
                placeholder="Subscribe to our newsletter!"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Button Text</label>
              <input
                name="cta.buttonText"
                type="text"
                required={showCTA}
                placeholder="Subscribe Now"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Button URL</label>
              <input
                name="cta.buttonUrl"
                type="url"
                required={showCTA}
                placeholder="https://example.com/subscribe"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Position</label>
              <select
                name="cta.position"
                defaultValue="TOP_RIGHT"
                required={showCTA}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                <option value="TOP_LEFT">Top Left</option>
                <option value="TOP_RIGHT">Top Right</option>
                <option value="BOTTOM_LEFT">Bottom Left</option>
                <option value="BOTTOM_RIGHT">Bottom Right</option>
                <option value="CENTER">Center</option>
              </select>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Color</label>
              <input
                name="cta.color"
                type="color"
                defaultValue="#000000"
                required={showCTA}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              />
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Creating..." : "Create Short Link"}
      </Button>
    </form>
  );
}
