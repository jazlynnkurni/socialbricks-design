"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { useReducedMotion } from "framer-motion";
import {
  ACCEPTED_FILE_TYPES,
  ACCEPTED_MIME_TYPES,
  UPLOAD_LIMIT_BYTES,
  formatFileSize,
} from "@/lib/mock/uploads";
import type { Document } from "@/lib/types/contract";

// Uploads live in sessionStorage behind useSyncExternalStore so the list
// survives navigating to the review page and back, with no hydration
// mismatch. The pipeline itself is pure mock timers, no network calls.

const STORAGE_KEY = "sb-app-shell-uploads";
const CHANGE_EVENT = "sb-app-shell-uploads-change";
const EMPTY: Document[] = [];

let cachedJson = "";
let cachedValue: Document[] = EMPTY;

function readUploads(): Document[] {
  const json = window.sessionStorage.getItem(STORAGE_KEY);
  if (!json) return EMPTY;
  if (json !== cachedJson) {
    cachedJson = json;
    try {
      cachedValue = JSON.parse(json) as Document[];
    } catch {
      cachedValue = EMPTY;
    }
  }
  return cachedValue;
}

function writeUploads(next: Document[]) {
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function updateUpload(id: string, patch: Partial<Document>) {
  writeUploads(
    readUploads().map((u) => (u.id === id ? { ...u, ...patch } : u)),
  );
}

function subscribe(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback);
  return () => window.removeEventListener(CHANGE_EVENT, callback);
}

function getServerSnapshot() {
  return EMPTY;
}

interface UploadContextValue {
  uploads: Document[];
  addFiles: (files: FileList | File[]) => void;
  openFileBrowser: () => void;
  confirmUpload: (id: string) => void;
  flagUpload: (id: string) => void;
}

const UploadContext = createContext<UploadContextValue | null>(null);

export function useUploads() {
  const context = useContext(UploadContext);
  if (!context) {
    throw new Error("useUploads must be used inside UploadProvider");
  }
  return context;
}

export function UploadProvider({ children }: { children: ReactNode }) {
  const uploads = useSyncExternalStore(subscribe, readUploads, getServerSnapshot);
  const [announcement, setAnnouncement] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const timersRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
  const finishedCountRef = useRef(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    // Records left mid-pipeline by a navigation lost their timers: settle
    // them as ready so nothing sits at "Uploading" forever.
    const current = readUploads();
    if (current.some((u) => u.status === "uploading" || u.status === "parsing")) {
      writeUploads(
        current.map((u) =>
          u.status === "uploading" || u.status === "parsing"
            ? { ...u, status: "ready", progress: 100 }
            : u,
        ),
      );
    }
    const timers = timersRef.current;
    return () => {
      timers.forEach(clearTimeout);
      timers.clear();
    };
  }, []);

  const schedule = useCallback((fn: () => void, ms: number) => {
    const timer = setTimeout(() => {
      timersRef.current.delete(timer);
      fn();
    }, ms);
    timersRef.current.add(timer);
  }, []);

  const startPipeline = useCallback(
    (record: Document) => {
      const finalize = () => {
        finishedCountRef.current += 1;
        if (finishedCountRef.current % 3 === 0) {
          updateUpload(record.id, {
            status: "needs-attention",
            lowConfidenceFields: 2,
          });
          setAnnouncement(
            `${record.fileName} needs attention. 2 fields have low confidence.`,
          );
        } else {
          updateUpload(record.id, { status: "ready" });
          setAnnouncement(`${record.fileName} is ready for review.`);
        }
      };
      const startParsing = () => {
        updateUpload(record.id, { status: "parsing", progress: 100 });
        setAnnouncement(`Parsing ${record.fileName}.`);
        schedule(finalize, 2000);
      };
      if (reduceMotion) {
        schedule(startParsing, 1500);
      } else {
        for (let step = 1; step <= 10; step++) {
          schedule(() => updateUpload(record.id, { progress: step * 10 }), step * 150);
        }
        schedule(startParsing, 1500);
      }
    },
    [reduceMotion, schedule],
  );

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const incoming = Array.from(files);
      if (incoming.length === 0) return;
      const next = [...readUploads()];
      const started: Document[] = [];
      const errors: string[] = [];
      // Runtime uploads are not attached to an application until reviewed.
      const uploadedAt = new Date().toISOString();

      for (const file of incoming) {
        const id = crypto.randomUUID();
        const typeOk =
          ACCEPTED_MIME_TYPES.includes(file.type) ||
          ACCEPTED_FILE_TYPES.some((ext) =>
            file.name.toLowerCase().endsWith(ext),
          );
        if (!typeOk) {
          const message = `SocialBricks can only read PDF, JPG, and PNG files. ${file.name} is a different type.`;
          next.push({
            id,
            applicationId: null,
            fileName: file.name,
            sizeBytes: file.size,
            status: "error",
            progress: 0,
            uploadedAt,
            errorMessage: message,
          });
          errors.push(message);
          continue;
        }
        if (file.size > UPLOAD_LIMIT_BYTES) {
          const message = `This file is ${formatFileSize(file.size)}. The limit is 20 MB. Try compressing it.`;
          next.push({
            id,
            applicationId: null,
            fileName: file.name,
            sizeBytes: file.size,
            status: "error",
            progress: 0,
            uploadedAt,
            errorMessage: message,
          });
          errors.push(message);
          continue;
        }
        const record: Document = {
          id,
          applicationId: null,
          fileName: file.name,
          sizeBytes: file.size,
          status: "uploading",
          progress: 0,
          uploadedAt,
        };
        next.push(record);
        started.push(record);
      }

      writeUploads(next);
      if (errors.length > 0) setAnnouncement(errors.join(" "));
      started.forEach(startPipeline);
    },
    [startPipeline],
  );

  const openFileBrowser = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const confirmUpload = useCallback((id: string) => {
    const record = readUploads().find((u) => u.id === id);
    if (!record) return;
    updateUpload(id, { status: "confirmed" });
    setAnnouncement(`${record.fileName} confirmed.`);
  }, []);

  const flagUpload = useCallback((id: string) => {
    const record = readUploads().find((u) => u.id === id);
    if (!record) return;
    // A worker-raised flag is distinct from a system low-confidence result.
    updateUpload(id, { status: "flagged" });
    setAnnouncement(`${record.fileName} flagged for review.`);
  }, []);

  return (
    <UploadContext.Provider
      value={{ uploads, addFiles, openFileBrowser, confirmUpload, flagUpload }}
    >
      {children}
      <input
        ref={inputRef}
        type="file"
        multiple
        tabIndex={-1}
        accept={[...ACCEPTED_FILE_TYPES, ...ACCEPTED_MIME_TYPES].join(",")}
        aria-label="Upload documents"
        className="hidden"
        onChange={(event) => {
          if (event.target.files) addFiles(event.target.files);
          event.target.value = "";
        }}
      />
      <div aria-live="polite" role="status" className="sr-only">
        {announcement}
      </div>
    </UploadContext.Provider>
  );
}
