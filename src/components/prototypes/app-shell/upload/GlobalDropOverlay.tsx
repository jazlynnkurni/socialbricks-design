"use client";

import { useEffect, useState } from "react";
import { useUploads } from "./UploadProvider";

// Full-viewport drop target while a file drag is in flight. The overlay is
// pointer-events-none decoration (aria-hidden): the window listeners do the
// work, so the DropZone underneath still gets its own dragover highlight
// and can claim drops via stopPropagation. Accessible paths are the header
// button and the drop-zone card, never drag alone.
export function GlobalDropOverlay() {
  const { addFiles } = useUploads();
  // dragenter/dragleave counter: stays above zero while inside the window.
  const [depth, setDepth] = useState(0);

  useEffect(() => {
    const hasFiles = (event: DragEvent) =>
      Array.from(event.dataTransfer?.types ?? []).includes("Files");

    const onDragEnter = (event: DragEvent) => {
      if (hasFiles(event)) setDepth((d) => d + 1);
    };
    const onDragLeave = (event: DragEvent) => {
      if (hasFiles(event)) setDepth((d) => Math.max(0, d - 1));
    };
    const onDragOver = (event: DragEvent) => {
      if (hasFiles(event)) event.preventDefault();
    };
    const onDrop = (event: DragEvent) => {
      if (!hasFiles(event)) return;
      event.preventDefault();
      setDepth(0);
      if (event.dataTransfer && event.dataTransfer.files.length > 0) {
        addFiles(event.dataTransfer.files);
      }
    };
    const onDragEnd = () => setDepth(0);

    window.addEventListener("dragenter", onDragEnter);
    window.addEventListener("dragleave", onDragLeave);
    window.addEventListener("dragover", onDragOver);
    window.addEventListener("drop", onDrop);
    window.addEventListener("dragend", onDragEnd);
    return () => {
      window.removeEventListener("dragenter", onDragEnter);
      window.removeEventListener("dragleave", onDragLeave);
      window.removeEventListener("dragover", onDragOver);
      window.removeEventListener("drop", onDrop);
      window.removeEventListener("dragend", onDragEnd);
    };
  }, [addFiles]);

  if (depth === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-[color-mix(in_srgb,var(--surface-0)_92%,var(--brand-400))]"
    >
      <div className="absolute inset-4 rounded-xl border-2 border-dashed border-brand-700" />
      <p className="font-heading text-2xl font-semibold text-brand-700">
        Drop to upload
      </p>
    </div>
  );
}
