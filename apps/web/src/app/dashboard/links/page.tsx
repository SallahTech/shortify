"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import * as auth from "@/lib/auth";
import * as links from "@/lib/links";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function LinksPage() {
  const router = useRouter();
  const [userLinks, setUserLinks] = useState<links.Link[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleCopy = (text: string, type: "original" | "short") => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        variant: "success",
        title: "Copied!",
        description: `${
          type === "original" ? "Original" : "Short"
        } URL copied to clipboard`,
      });
    });
  };

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push("/login");
      return;
    }

    const fetchLinks = async () => {
      try {
        const data = await links.getLinks();
        console.log("Fetched links:", JSON.stringify(data, null, 2));
        setUserLinks(data);
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch links",
        });
        setError("Failed to fetch links");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLinks();
  }, [router, toast]);

  const handleDelete = async (id: string) => {
    try {
      await links.deleteLink(id);
      setUserLinks(userLinks.filter((link) => link.id !== id));
      toast({
        variant: "success",
        title: "Success",
        description: "Link deleted successfully",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete link",
      });
      setError("Failed to delete link");
    }
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Links</h1>
          <p className="text-muted-foreground">
            Manage and track your shortened links
          </p>
        </div>
        <Link href="/dashboard/links/new">
          <Button>Create New Link</Button>
        </Link>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-8">
          {error}
        </div>
      )}

      <div className="bg-card rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Original URL
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Short URL
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Clicks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  CTA
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {userLinks.map((link) => (
                <tr key={link.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <a
                        href={link.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {link.originalUrl.length > 50
                          ? link.originalUrl.substring(0, 50) + "..."
                          : link.originalUrl}
                      </a>
                      <button
                        onClick={() => handleCopy(link.originalUrl, "original")}
                        className="p-1 hover:bg-muted rounded cursor-pointer"
                      >
                        <Copy className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <a
                        href={`/${link.shortUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {window.location.origin}/{link.shortUrl}
                      </a>
                      <button
                        onClick={() =>
                          handleCopy(
                            `${window.location.origin}/${link.shortUrl}`,
                            "short"
                          )
                        }
                        className="p-1 hover:bg-muted rounded cursor-pointer"
                      >
                        <Copy className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {link.clicks.length}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div suppressHydrationWarning>
                      {(() => {
                        console.log(
                          "Link CTA for",
                          link.id,
                          ":",
                          link.ctaOverlay
                        );
                        return link.ctaOverlay ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100">
                            Yes
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                            No
                          </span>
                        );
                      })()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {new Date(link.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex justify-end space-x-2">
                      <Link href={`/dashboard/links/${link.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(link.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
