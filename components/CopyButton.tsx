"use client";

export default function CopyButton({ text }: { text: string }) {
  return (
    <button
      className="shrink-0 rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-[#e5553a]"
      onClick={() => {
        if (typeof navigator !== "undefined") {
          navigator.clipboard.writeText(text);
        }
      }}
    >
      Copy
    </button>
  );
}