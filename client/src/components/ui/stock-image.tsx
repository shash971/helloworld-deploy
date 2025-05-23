import React from "react";
import { cn } from "@/lib/utils";

interface StockImageProps {
  type: "jewelry-store" | "jewelry-counter" | "gemstone-collection" | "certified-stone" | "jewelry-pieces";
  className?: string;
}

export function StockImage({ type, className }: StockImageProps) {
  // Using URLs from CDNs for placeholder jewelry stock photos
  const imageUrls: Record<string, string[]> = {
    "jewelry-store": [
      "https://images.unsplash.com/photo-1586074299757-dc655f18518c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1551649668-fe62a50fba37?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1597696929736-6d13bed8e6a8?auto=format&fit=crop&w=800&q=80"
    ],
    "jewelry-counter": [
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1589207212779-2dce7c6ec1b2?auto=format&fit=crop&w=800&q=80"
    ],
    "gemstone-collection": [
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1620230874543-3049b9989cd8?auto=format&fit=crop&w=800&q=80"
    ],
    "certified-stone": [
      "https://images.unsplash.com/photo-1615655060948-2a1920435916?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1579042904065-099a6505b3a5?auto=format&fit=crop&w=800&q=80"
    ],
    "jewelry-pieces": [
      "https://images.unsplash.com/photo-1539874754764-5a96559165b0?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1582119749974-a008adf7fc56?auto=format&fit=crop&w=800&q=80"
    ]
  };

  // Select a random image from the array for the requested type
  const images = imageUrls[type];
  const randomIndex = Math.floor(Math.random() * images.length);
  const selectedImage = images[randomIndex];

  return (
    <div className={cn("overflow-hidden rounded-md", className)}>
      <img 
        src={selectedImage} 
        alt="Jewelry shop"
        className="h-full w-full object-cover"
      />
    </div>
  );
}
