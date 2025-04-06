import { getToken } from "./auth";

const API_URL = "http://localhost:3002";

interface Click {
  id: string;
  createdAt: string;
  ctaClick: boolean;
}

interface CTAOverlay {
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
  linkId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Link {
  id: string;
  originalUrl: string;
  shortUrl: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  clicks: Click[];
  ctaOverlay?: CTAOverlay;
}

export async function createLink(data: {
  originalUrl: string;
  ctaOverlay?: {
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
}): Promise<Link> {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${API_URL}/links`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      Array.isArray(errorData.message)
        ? errorData.message.join(", ")
        : errorData.message || "Failed to create link"
    );
  }

  return response.json();
}

export async function getLinks(): Promise<Link[]> {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${API_URL}/links`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch links");
  }

  return response.json();
}

export async function getLink(id: string): Promise<Link> {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${API_URL}/links/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch link");
  }

  return response.json();
}

export async function deleteLink(id: string): Promise<void> {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${API_URL}/links/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete link");
  }
}

export async function updateLink(
  id: string,
  data: Partial<{
    originalUrl: string;
    ctaOverlay: {
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
  }>
): Promise<Link> {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${API_URL}/links/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update link");
  }

  return response.json();
}
