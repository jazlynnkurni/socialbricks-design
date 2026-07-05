"use client";

import { useState, type DragEvent } from "react";
import { CloudUpload } from "lucide-react";
import { useUploads } from "./UploadProvider";

// The whole card is one <button> (HTML forbids nested buttons), so the
// entire surface is clickable and keyboard-focusable; "browse files" is the
// emphasized part of its label. Drag and drop is an enhancement on top:
// the button and the header action remain the accessible paths (WCAG 2.5.7).
export function DropZone({
  forceCompact = false,
  compactLabel = "Upload more",
}: {
  /** Always render the compact bar (e.g. atop the Documents page). */
  forceCompact?: boolean;
  compactLabel?: string;
} = {}) {
  const { uploads, addFiles, openFileBrowser } = useUploads();
  const [dragOver, setDragOver] = useState(false);
  const compact = forceCompact || uploads.length > 0;

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  };
  const handleDragLeave = () => setDragOver(false);
  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    // Keep the global window listener from adding the same files again.
    event.stopPropagation();
    setDragOver(false);
    if (event.dataTransfer.files.length > 0) {
      addFiles(event.dataTransfer.files);
    }
  };

  const dragClasses = dragOver
    ? "border-brand-700 bg-[color-mix(in_srgb,var(--brand-400)_12%,var(--surface-50))]"
    : "border-border bg-surface-50 hover:border-brand-700";

  if (compact) {
    return (
      <button
        type="button"
        onClick={openFileBrowser}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`mt-6 flex w-full items-center gap-3 rounded-xl border border-dashed px-4 py-3 text-left transition-colors ${dragClasses}`}
      >
        <CloudUpload
          size={20}
          className={dragOver ? "text-brand-700" : "text-ink-600"}
          aria-hidden="true"
        />
        <span className="text-sm font-medium text-ink-900">{compactLabel}</span>
        <span className="ml-auto text-sm font-medium text-brand-700 underline">
          Browse files
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={openFileBrowser}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`mt-6 flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors ${dragClasses}`}
    >
      <CloudUpload
        size={28}
        className={dragOver ? "text-brand-700" : "text-ink-600"}
        aria-hidden="true"
      />
      <span className="text-base font-medium text-ink-900">
        Drag documents here or{" "}
        <span className="font-medium text-brand-700 underline">
          browse files
        </span>
      </span>
      <span className="text-sm text-ink-600">PDF, JPG, PNG up to 20 MB</span>
    </button>
  );
}
