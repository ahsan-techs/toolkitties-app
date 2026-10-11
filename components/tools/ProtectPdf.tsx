"use client";

import { useState } from "react";
import Dropzone from "@/components/workspace/Dropzone";
import { FileDownload } from "@/components/workspace/OutputPanel";
import { protectPdf } from "@/lib/tool-processors/pdf-advanced";
import { Stack, ErrorNote, btnCls, baseName } from "./ui";
import PasswordInput from "./PasswordInput";

export default function ProtectPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Blob | null>(null);

  const mismatch = confirm !== "" && password !== confirm;

  async function run() {
    if (!file) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      setResult(await protectPdf(file, password));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try another PDF.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Stack>
      <Dropzone
        accept="application/pdf,.pdf"
        label="Drop a PDF here, or click to browse"
        onFiles={(f) => {
          setFile(f[0] ?? null);
          setResult(null);
          setError(null);
        }}
      />
      {file && <p className="text-sm text-slate">Selected: {file.name}</p>}
      <PasswordInput label="Password" value={password} onChange={(v) => { setPassword(v); setResult(null); }} hint="Anyone who opens the file will need this password. Use at least 8 characters." />
      <PasswordInput label="Type the password again" value={confirm} onChange={(v) => { setConfirm(v); setResult(null); }} />
      {mismatch && <p className="text-sm text-red-800">The two passwords do not match.</p>}
      <button type="button" className={btnCls} disabled={!file || !password || password !== confirm || busy} onClick={run}>
        {busy ? "Protecting…" : "Protect PDF"}
      </button>
      {error && <ErrorNote message={error} />}
      {result && (
        <>
          <FileDownload blob={result} filename={`${baseName(file ?? undefined, "document")}-protected.pdf`} />
          <p className="text-xs text-slate">The file uses AES-256 encryption and your password never leaves this device. There is no way to recover a lost password, so keep it somewhere safe.</p>
        </>
      )}
    </Stack>
  );
}
