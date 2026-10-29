"use client";

// Phase 12: a quiet, premium "done" signal — a checkmark with two ripple
// rings that expand and fade once. Remounted (via the `tick` key in
// ToolWorkspace) each time a task finishes, so it replays on every success.
export default function SuccessBurst() {
  return (
    <div className="flex items-center justify-center py-1" aria-hidden="true">
      <div className="relative flex h-14 w-14 items-center justify-center">
        <span className="tk-success-ripple absolute inset-0 rounded-full border-2 border-moss" />
        <span className="tk-success-ripple absolute inset-0 rounded-full border-2 border-moss [animation-delay:150ms]" />
        <span className="tk-success-check relative flex h-10 w-10 items-center justify-center rounded-full bg-moss text-white">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </div>
  );
}
