"use client";

import { Upload } from "lucide-react";
import { useUploads } from "./UploadProvider";
import styles from "./UploadButton.module.css";

// Primary entry point to the upload flow, pinned in the shell header on
// every page. At rest it is a brand-700 rounded square with just the upload
// icon (white on brand-700 is 6.11:1) and a constant teal shine sweeping
// across to invite use. On hover or keyboard focus the label is pulled out
// to the left: the pill expands (outer max-width) while the text slides in
// and overshoots with an ease-out-back curve, then recoils to rest. The
// icon stays anchored on the right. The label text is the button's
// accessible name and also appears on focus, so this is not hover-only.
export function UploadButton() {
  const { openFileBrowser } = useUploads();
  return (
    <button
      type="button"
      onClick={openFileBrowser}
      className={`${styles.button} group flex h-10 items-center rounded-lg bg-brand-700 pl-1 pr-1 text-surface-0 hover:bg-[color-mix(in_srgb,var(--ink-900)_25%,var(--brand-700))]`}
    >
      <span className="flex max-w-0 overflow-hidden transition-[max-width] duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:max-w-[170px] group-focus-visible:max-w-[170px] motion-reduce:transition-none">
        <span className="translate-x-3 whitespace-nowrap pl-3 pr-1 text-sm font-medium opacity-0 transition-[transform,opacity] duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 motion-reduce:translate-x-0 motion-reduce:transition-none">
          Upload documents
        </span>
      </span>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center">
        <Upload size={18} aria-hidden="true" />
      </span>
    </button>
  );
}
