"use client";

import { useState, type FormEvent } from "react";
import { allTools } from "@/lib/tools-data";
import { CONTACT_EMAIL } from "@/lib/site-config";

const topics = ["Suggestion", "Something is broken", "New tool request", "Other"] as const;
const toolOptions = allTools.filter((t) => t.functional).sort((a, b) => a.name.localeCompare(b.name));

const fieldClass =
  "w-full rounded-xl border border-ink/15 bg-white/80 px-4 py-3 text-sm text-ink outline-none transition focus:border-moss focus:shadow-[0_0_0_4px_rgba(31,92,76,0.15)]";

// No server is needed: sending opens the visitor's own email app with the message filled in.
export default function FeedbackForm() {
  const [topic, setTopic] = useState<string>(topics[0]);
  const [tool, setTool] = useState("");
  const [message, setMessage] = useState("");
  const [replyTo, setReplyTo] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "sent">("idle");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim().length < 10) {
      setStatus("error");
      return;
    }
    const lines = [message.trim(), "", "---", `Type: ${topic}`];
    if (tool) lines.push(`Tool: ${tool}`);
    if (replyTo.trim()) lines.push(`Reply to: ${replyTo.trim()}`);
    if (topic === "Something is broken") lines.push(`Browser: ${navigator.userAgent}`);
    const subject = `Toolkitties feedback: ${topic}${tool ? ` (${tool})` : ""}`;
    setStatus("sent");
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-5" noValidate>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-1.5 text-sm font-medium text-ink">
          What is this about?
          <select value={topic} onChange={(e) => setTopic(e.target.value)} className={fieldClass}>
            {topics.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1.5 text-sm font-medium text-ink">
          Which tool? (optional)
          <select value={tool} onChange={(e) => setTool(e.target.value)} className={fieldClass}>
            <option value="">Not about a specific tool</option>
            {toolOptions.map((t) => (
              <option key={t.slug} value={t.name}>
                {t.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="grid gap-1.5 text-sm font-medium text-ink">
        Your message
        <textarea
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          rows={6}
          placeholder="Tell us what happened or what you would like to see. Please do not include private files or passwords."
          className={fieldClass}
          aria-invalid={status === "error"}
        />
      </label>

      <label className="grid gap-1.5 text-sm font-medium text-ink">
        Your email, so we can reply (optional)
        <input type="email" value={replyTo} onChange={(e) => setReplyTo(e.target.value)} placeholder="you@example.com" className={fieldClass} />
      </label>

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="btn-premium rounded-full bg-ink px-7 py-3 text-sm font-semibold text-paper hover:bg-ink/85">
          Send feedback
        </button>
        <p role="status" aria-live="polite" className="text-sm text-slate">
          {status === "error" && <span className="text-[#B3261E]">Please write at least a short message (10 characters).</span>}
          {status === "sent" && (
            <span>
              Your email app should open with the message ready. If nothing happens, write to{" "}
              <a className="font-semibold text-moss underline" href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
              .
            </span>
          )}
        </p>
      </div>
    </form>
  );
}
