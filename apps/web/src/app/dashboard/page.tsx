"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import * as auth from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import * as links from "@/lib/links";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function DashboardPage() {
  const router = useRouter();
  const [userLinks, setUserLinks] = useState<links.Link[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push("/login");
      return;
    }

    const fetchLinks = async () => {
      try {
        const data = await links.getLinks();
        setUserLinks(data);
      } catch (err) {
        setError("Failed to fetch links");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLinks();
  }, [router]);

  const handleDelete = async (id: string) => {
    try {
      await links.deleteLink(id);
      setUserLinks(userLinks.filter((link) => link.id !== id));
    } catch (err) {
      setError("Failed to delete link");
    }
  };

  const getClickCount = (link: links.Link) => {
    return link.clicks.length;
  };

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

  if (isLoading) {
    return (
      <div className="container py-8">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your links and view analytics
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

      <div className="grid gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg shadow p-4 sm:p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Total Links
            </h3>
            <p className="text-2xl sm:text-3xl font-bold">{userLinks.length}</p>
          </div>
          <div className="bg-card rounded-lg shadow p-4 sm:p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Total Clicks
            </h3>
            <p className="text-2xl sm:text-3xl font-bold">
              {userLinks.reduce((sum, link) => sum + getClickCount(link), 0)}
            </p>
          </div>
          <div className="bg-card rounded-lg shadow p-4 sm:p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Links with CTA
            </h3>
            <p className="text-2xl sm:text-3xl font-bold">
              {userLinks.filter((link) => link.cta).length}
            </p>
          </div>
          <div className="bg-card rounded-lg shadow p-4 sm:p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Average Clicks
            </h3>
            <p className="text-2xl sm:text-3xl font-bold">
              {userLinks.length
                ? Math.round(
                    userLinks.reduce(
                      (sum, link) => sum + getClickCount(link),
                      0
                    ) / userLinks.length
                  )
                : 0}
            </p>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow overflow-hidden">
          <div className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">
              Your Links
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Original URL
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Short URL
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Clicks
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    CTA
                  </th>
                  <th className="hidden sm:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {userLinks.map((link) => (
                  <tr key={link.id}>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <a
                          href={link.originalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline max-w-[150px] sm:max-w-[250px] truncate"
                        >
                          {link.originalUrl}
                        </a>
                        <button
                          onClick={() =>
                            handleCopy(link.originalUrl, "original")
                          }
                          className="p-1 hover:bg-muted rounded cursor-pointer"
                        >
                          <Copy className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
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
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                      {getClickCount(link)}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                      {link.cta ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100">
                          Yes
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                          No
                        </span>
                      )}
                    </td>
                    <td className="hidden sm:table-cell px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                      {new Date(link.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(link.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const recentLinks = [
  {
    id: "1",
    originalUrl: "https://example.com/very-long-article",
    shortUrl: "short.ly/abc123",
    clicks: 145,
    created: "2 days ago",
  },
  {
    id: "2",
    originalUrl: "https://example.com/another-article",
    shortUrl: "short.ly/def456",
    clicks: 89,
    created: "3 days ago",
  },
  {
    id: "3",
    originalUrl: "https://example.com/blog-post",
    shortUrl: "short.ly/ghi789",
    clicks: 234,
    created: "5 days ago",
  },
];
