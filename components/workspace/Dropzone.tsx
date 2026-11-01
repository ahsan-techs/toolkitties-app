"use client";

import { useCallback, useRef, useState } from "react";

export default function Dropzone({
  onFiles,
  accept,
  multiple = false,
  label = "Drop a file here, or click to browse",
}: {
  onFiles: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  label?: string;
}) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return;
      onFiles(Array.from(fileList));
    },
    [onFiles]
  );

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={label}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        // Drag-and-drop zones built on a <div> aren't natively keyboard-operable the
        // way a real <button> is — without this, anyone navigating by keyboard (or a
        // screen reader user) could see this control but never actually open the file
        // picker from it, on every tool that uses this component.
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-14 text-center outline-none transition focus-visible:border-moss ${
        dragging ? "border-moss bg-moss/5" : "border-ink/15 bg-sand/40 hover:border-moss/50"
      }`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-2xl shadow-sm">📤</div>
      <p className="text-sm font-medium text-ink">{label}</p>
      <p className="text-xs font-semibold text-moss">🔒 Processed on your device — never uploaded, never stored.</p>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          // Reset so picking the same file again (after removing it) still fires.
          e.target.value = "";
        }}
      />
    </div>
  );
}
