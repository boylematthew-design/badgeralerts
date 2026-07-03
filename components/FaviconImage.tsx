"use client";

export default function FaviconImage({ src }: { src: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      className="w-4 h-4 rounded-sm shrink-0"
      onError={(e) => (e.currentTarget.style.display = "none")}
    />
  );
}
