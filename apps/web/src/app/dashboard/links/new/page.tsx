"use client";

import { useRouter } from "next/navigation";
import { CreateLinkForm } from "@/components/CreateLinkForm";
import type { Link } from "@/lib/links";

export default function NewLinkPage() {
  const router = useRouter();

  const handleSuccess = (link: Link) => {
    router.push("/dashboard");
  };

  return (
    <div className="container max-w-2xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create New Link</h1>
        <p className="text-muted-foreground">
          Create a new short link with an optional CTA overlay
        </p>
      </div>
      <div className="border rounded-lg p-6 bg-card">
        <CreateLinkForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
